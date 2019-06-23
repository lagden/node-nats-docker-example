'use strict'

const {workerData, parentPort} = require('worker_threads')
const debug = require('./debug')
const sleep = require('./sleep')

const {data, seq} = workerData
sleep(3)
	.then(() => {
		// some data processing...
		const res = `modified ${data}`
		parentPort.postMessage(`Data processed - ${seq}: ${res}`)
	})
	.catch(error => {
		debug.error(error)
		process.exit(1)
	})
