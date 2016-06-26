import { delay, takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import * as Effects from './effects';

export default (local) => {

	const getTopic = (globalState) => {
		
		// You can access the global state with the globalState argument
		// return globalState.something

		// Local model can be found in local.getState()
		return local.getState().topic
   
	}

	function* fetchGif() {

		const topic = yield select(getTopic)
		const url = yield call(Effects.fetchGif, topic)

		// Putting global like you would in standard redux-saga
		// yield put({ type: 'SOME_GLOBAL_ACTION' })

		// Putting local entry must be wrapped with local.type(...)
		yield put({ type: local.type('NewGif'), payload: { url } })

	}

	return function* requestGif() {

		// Taking something global like you would in standard redux-saga
		// yield* takeEvery('GLOBAL_INTERESTING_ACTION', doSomething)

		// Taking something local must be wrapped with local.type(...)
		yield* takeEvery(local.type('RequestGif'), fetchGif)

	}
}