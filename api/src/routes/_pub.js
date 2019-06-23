'use strict'

const Router = require('koa-router')
const debug = require('../lib/debug')
const conn = require('../lib/conn')

const router = new Router()

function pub(msg) {
	return new Promise((resolve, reject) => {
		const stan = conn('nats_lab', 'pub')
		stan
			.on('connect', sc => {
				debug.log('connected')
				sc.publish('nats', msg, (error, guid) => {
					if (error) {
						debug.error('ackHandler error', error)
					} else {
						debug.log('ackHandler ok', guid, msg)
					}
					sc.close()
				})
			})
			.on('close', () => {
				resolve('OK')
			})
			.on('error', error => {
				debug.error(error)
				reject(new Error('Erro no NATS Stream'))
			})
	})
}

async function middleware(ctx, next) {
	const {msg} = ctx.params
	const ok = await pub(msg)
	ctx.body = ok
}

router.get('/pub/:msg', middleware)

module.exports = router
