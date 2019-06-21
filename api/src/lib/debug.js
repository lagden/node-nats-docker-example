'use strict'

const debug = require('debug')

const error = debug('nats:error')
const log = debug('nats:log')

module.exports = {
	error,
	log
}
