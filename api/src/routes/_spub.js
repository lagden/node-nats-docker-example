'use strict'

const Router = require('koa-router')
const STAN = require('node-nats-streaming')
const debug = require('../lib/debug')

const {NATS_CONN} = process.env
const router = new Router()

let connected = false
const stan = STAN.connect('nats_lab', 'pub', NATS_CONN)
stan
	.on('connect', () => {
		connected = true
		debug.log('connected', NATS_CONN)
	})
	.on('error', debug.error)

function spub(msg) {
	if (connected) {
		stan.publish('nats', msg, (error, guid) => {
			if (error) {
				debug.error(error)
			} else {
				debug.log(guid, msg)
			}
		})
		stan.flush()
	} else {
		debug.error('Not connected')
	}
}

function middleware(ctx) {
	const {msg} = ctx.params
	spub(msg)
	ctx.body = 'OK'
}

router.get('/spub/:msg', middleware)

module.exports = router
