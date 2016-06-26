import createSagaMiddleware from 'redux-saga'
import { applyMiddleware } from 'redux'
const LOCAL_SAGA = '@@LOCAL_SAGA'

export default (options) => {

    const sagaMiddleware = createSagaMiddleware(options)

    const internalMiddleware = () => {
    	return  (next) => {
    		return (action) => {
				if (action.meta) {
					const { [LOCAL_SAGA]: localSaga } = action.meta

					if (localSaga) {
			            sagaMiddleware.run(localSaga)
			            return
					}
				}
				return next(action)
		    }
    	}
    }

    return applyMiddleware(sagaMiddleware, internalMiddleware)
}

export const createSagaAction = (saga) => {
	return {
        meta: {
            [LOCAL_SAGA]: saga
        }
    }
}