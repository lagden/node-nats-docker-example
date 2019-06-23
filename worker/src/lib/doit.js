'use strict'

const {workerData, parentPort} = require('worker_threads')
const debug = require('./debug')
const sleep = require('./sleep')

;(async () => {
	const {data, seq} = workerData
	await sleep(3)
	// some data processing...
	const res = `modified ${data}`
	parentPort.postMessage(`Data processed - ${seq}: ${res}`)
})()
