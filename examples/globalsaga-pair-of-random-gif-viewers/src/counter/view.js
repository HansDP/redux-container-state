import React from 'react'
import { applyLocalMiddleware, view } from 'redux-container-state'
import localThunk from 'redux-container-state-thunk'
import globalStateEnhancer from 'redux-container-state-globalstate'
import { compose } from 'redux'
import { increment, incrementAsync, doGlobalAction } from './actions'


import rootSaga from './sagas'


const countStyle = {
    fontSize: '20px',
    fontFamily: 'monospace',
    display: 'inline-block',
    width: '50px',
    textAlign: 'center'
}

const mapStateToProps = (state) => {
    console.log('global state is ', state)
    return {}
}

import createSagaMiddleware from 'redux-saga'


const localSageMiddleware = (run, options) => {

    const sagaMiddleware = createSagaMiddleware(options)

    return (localStore) => {
        const viewWithSagaMiddleware = sagaMiddleware(localStore)

        run && run(sagaMiddleware.run)

        return viewWithSagaMiddleware
    }
}

const viewWithMiddleware = compose(applyLocalMiddleware(localThunk, localSageMiddleware((run) => run(rootSaga))), globalStateEnhancer(mapStateToProps))(view)

export default viewWithMiddleware(({model, dispatch}) => (
  <div>
    <button onClick={ () => dispatch(increment()) }>Sync increment</button>
    <button onClick={ () => dispatch(incrementAsync()) }>Async increment</button>
    <button onClick={ () => dispatch({ type: "INCREMENT_SAGA" }) }>Saga increment</button>
    <button onClick={ () => dispatch(doGlobalAction()) }>Do global action</button>

    <div style={countStyle}>Current count: { model }</div>
  </div>
))



