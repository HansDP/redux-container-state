import { takeEvery, delay } from 'redux-saga'
import { put } from 'redux-saga/effects'

export function* helloSaga() {
  	console.log('Hello Sagas!')
}





// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
	yield delay(1000)
	yield put({ type: 'INCREMENT_COUNTER' })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
	yield* takeEvery('INCREMENT_SAGA', incrementAsync)
}


export default function* rootSaga() {
	yield [
		helloSaga(),
		watchIncrementAsync()
	]
}