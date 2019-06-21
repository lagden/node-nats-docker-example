'use strict'

const {Worker} = require('worker_threads')

function runService(service, workerData) {
	return new Promise((resolve, reject) => {
		const worker = new Worker(service, {workerData})
		worker.on('message', resolve)
		worker.on('error', reject)
		worker.on('exit', code => {
			if (code !== 0) {
				reject(new Error(`Worker stopped with exit code ${code}`))
			}
		})
	})
}

module.exports = runService
