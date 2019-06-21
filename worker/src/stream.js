'use strict'

const {join} = require('path')
const conn = require('./lib/conn')
const debug = require('./lib/debug')
const runService = require('./lib/worker')

const stan = conn('nats_lab', 'sub')
stan
	.on('connect', () => {
		debug.log('connected')

		const opts = stan.subscriptionOptions()
		opts.setDeliverAllAvailable()
		opts.setDurableName('nats_lab_sub_durable')
		opts.setManualAckMode(true)
		// opts.setAckWait(10000)
		// opts.setMaxInFlight(1)

		const subscription = stan.subscribe('nats', 'nats.workers', opts)
		subscription
			.on('message', msg => {
				debug.log('thread request --->', msg.getSubject(), `[${msg.getSequence()}]`, msg.getData())

				// Thread
				runService(join(__dirname, 'lib', 'doit.js'), {data: msg.getData(), seq: msg.getSequence()})
					.then(res => {
						debug.log('thread response --->', res)

					})
					.catch(debug.error)

				msg.ack()
			})

			.on('error', err => {
				debug.error(`subscription for ${nats} raised an error: ${err}`);
			})
	})
	.on('error', debug.error)
