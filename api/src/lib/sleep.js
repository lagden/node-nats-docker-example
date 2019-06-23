'use strict'

// function msleep(n) {
// 	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n)
// }

// function sleep(n) {
// 	msleep(n * 1000)
// }

function sleep(t = 1) {
	return new Promise(resolve => {
		const timeoutID = setTimeout(() => {
			clearTimeout(timeoutID)
			resolve()
		}, t * 1000)
	})
}

module.exports = sleep
