'use strict'

const {join} = require('path')
const conn = require('./lib/conn')
const debug = require('./lib/debug')
const runService = require('./lib/worker')

const stan = conn('nats_lab', 'sub')
stan
	.on('connect', sc => {
		debug.log('connected')

		const opts = sc.subscriptionOptions()
		opts
			.setDeliverAllAvailable()
			.setDurableName('nats_lab_sub_durable')
			.setManualAckMode(true)
			.setMaxInFlight(1)

		const subscription = sc.subscribe('nats', 'nats.workers', opts)
		subscription
			.on('message', msg => {
				debug.log('thread request --->', msg.getSubject(), `[${msg.getSequence()}]`, msg.getData())
				msg.ack()

				// Thread
				runService(join(__dirname, 'lib', 'doit.js'), {data: msg.getData(), seq: msg.getSequence()})
					.then(res => {
						debug.log('thread response --->', res)
					})
					.catch(debug.error)
			})
			.on('error', error => {
				debug.error(`subscription for nats raised an error: ${error}`);
			})
	})
	.on('error', error => { debug.error(error); })
	.on('disconnect', () => { debug.log('disconnect'); })
	.on('reconnecting', () => { debug.log('reconnecting'); })
	.on('reconnect', () => { debug.log('reconnect'); })
	.on('close', () => { debug.log('close'); })
