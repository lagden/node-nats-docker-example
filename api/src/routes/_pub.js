'use strict'

const Router = require('koa-router')
const debug = require('../lib/debug')
const conn = require('../lib/conn')

const router = new Router()

let _sc
const stan = conn('nats_lab', 'pub')
stan
	.on('connect', sc => {
		_sc = sc
		debug.log('connected')
	})
	.on('error', error => {
		debug.error(error)
	})

async function pub(msg) {
	return new Promise((resolve, reject) => {
		if (!_sc) {
			reject(new Error('Nat não conectado'))
		}
		_sc.publish('nats', msg, (error, guid) => {
			if (error) {
				debug.error('ackHandler error', error)
				reject(`ackHandler error: ${error.message}`)
			} else {
				debug.log('ackHandler ok', guid, msg)
				resolve(`ackHandler ok: ${guid}`)
			}
		})
	})
}

async function middleware(ctx) {
	const {msg} = ctx.params
	const ok = await pub(msg)
	ctx.body = ok
}

router.get('/pub/:msg', middleware)

module.exports = router
