import { delay, takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import * as Effects from './effects';

const getTopic = (model) => model.topic;

function* fetchGif() {
	const topic = yield select(getTopic)
	const url = yield call(Effects.fetchGif, topic)
	yield put({ type: 'NewGif', payload: { url } })
}

export default function* requestGif() {
	yield* takeEvery('RequestGif', fetchGif)
}
