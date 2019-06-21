'use strict'

const {join} = require('path')
const cnats = require('nats')
const debug = require('./lib/debug')
const runService = require('./lib/worker')

const {NATS_CONN = 'nats://127.0.0.1:4222'} = process.env
const nats = cnats.connect({url: NATS_CONN, name: 'sub'})

nats
	.on('connect', () => {
		debug.log('connected', NATS_CONN)
		nats.subscribe('doit', {'queue':'workers'}, data => {
			debug.log('enviando para a thread...')
			// Thread
			runService(join(__dirname, 'doit.js'), data)
				.then(debug.log)
				.catch(debug.error)
		})
	})
	.on('error', debug.error)
