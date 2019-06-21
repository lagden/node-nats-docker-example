'use strict'

const Router = require('koa-router')
const debug = require('../lib/debug')
const conn = require('../lib/conn')

const router = new Router()

let connected = false
const stan = conn('nats_lab', 'pub')
stan
	.on('connect', () => {
		debug.log('connected')
		connected = true
	})
	.on('error', debug.error)

function pub(msg) {
	if (connected) {
		stan.publish('nats', msg, (error, guid) => {
			if (error) {
				debug.error(error)
			} else {
				debug.log(guid, msg)
			}
		})
	} else {
		debug.error('Not connected')
	}
}

function middleware(ctx) {
	const {msg} = ctx.params
	pub(msg)
	ctx.body = 'OK'
}

router.get('/pub/:msg', middleware)

module.exports = router
