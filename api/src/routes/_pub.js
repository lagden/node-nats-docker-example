'use strict'

const Router = require('koa-router')
// const NATS = require('nats')
const debug = require('../lib/debug')

// const {NATS_CONN} = process.env
// const nats = NATS.connect({url: NATS_CONN, name: 'pub'})
const router = new Router()

// debug.log('NATS_CONN', NATS_CONN)

function middleware(ctx) {
	// const {msg} = ctx.params
	// nats.publish('doit', msg, () => {
	// 	debug.log('recebido', msg)
	// })
	// nats.flush()
	ctx.body = 'OK'
}

router.get('/pub/:msg', middleware)

module.exports = router
