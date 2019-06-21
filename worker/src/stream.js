'use strict'

const {join} = require('path')
const STAN = require('node-nats-streaming')
const debug = require('./lib/debug')
const runService = require('./lib/worker')

const {NATS_CONN = 'nats://127.0.0.1:14222'} = process.env
debug.log('STAN NATS_CONN', NATS_CONN)

const stan = STAN.connect('nats_lab', 'sub', {
	servers: [NATS_CONN],
	stanMaxPingOut: 3,
	stanPingInterval: 1000,
	reconnect: true,
	reconnectTimeWait: 3000,
	maxReconnectAttempts: 10,
	waitOnFirstConnect: true,
	name: 'nats_lab_sub'
})
stan
	.on('connect', () => {
		debug.log('connected ------------>>>', NATS_CONN)

		const opts = stan.subscriptionOptions()
		opts.setDeliverAllAvailable();
		opts.setDurableName('nats_lab_sub_durable')

		const subscription = stan.subscribe('nats', 'nats.workers', opts)
		subscription
			.on('message', msg => {
				debug.log(msg.getSubject(), `[${msg.getSequence()}]`, msg.getData())
				debug.log('enviando para a thread...')
				// Thread
				runService(join(__dirname, 'doit.js'), msg.getData())
					.then(debug.log)
					.catch(debug.error)
			})
			.on('error', err => {
				debug.error(`subscription for ${nats} raised an error: ${err}`);
			})
	})
	.on('error', debug.error)
