'use strict'

const {workerData, parentPort} = require('worker_threads')
const debug = require('./debug')
const sleep = require('./sleep')

debug.log('doit.js service');

(async () => {
	const {data, seq} = workerData
	await sleep(3)
	parentPort.postMessage(`Dados processados ${seq}: ${data}`)
})()
