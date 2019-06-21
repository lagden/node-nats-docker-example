'use strict'

const {workerData, parentPort} = require('worker_threads')
const debug = require('./lib/debug')
const sleep = require('./lib/sleep')

debug.log('doit.js service');

(async () => {
	const data = workerData
	await sleep(3)
	parentPort.postMessage(`Dados processados ${data * 10}`)
})()
