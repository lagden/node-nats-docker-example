'use strict'

const STAN = require('node-nats-streaming')
const debug = require('./debug')

const {NATS_CONN = 'nats://127.0.0.1:4222'} = process.env
const servers = NATS_CONN.split(',')
debug.log('STAN servers', servers)

function conn(cluster, id, name) {
	return STAN.connect(cluster, id, {
		servers,
		stanMaxPingOut: 3,
		stanPingInterval: 5000,
		reconnect: true,
		reconnectTimeWait: 5000,
		maxReconnectAttempts: -1,
		name: name || `${cluster}_${id}`
	})
}

module.exports = conn
