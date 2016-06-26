import React from 'react'
import { compose } from 'redux'
import { view, applyLocalMiddleware } from 'redux-container-state'
import sagaViewEnhancer from 'redux-container-state-saga'

import rootSaga from './sagas'

const renderGif = url => {
  if (url) {
    return <img role="presentation" src={url} width="200" height="200" />;
  }

  return <div>Waiting for gif</div>
}

const options = {
  autoCancel: true,
  onMount: (props) => {
    // If the model is empty, fetch a new gif.
    if (!props.model.url) {
      props.dispatch({ type: 'RequestGif' })
    }
  }
}

const viewWithMiddleware = compose(sagaViewEnhancer(rootSaga, options))(view)

export default viewWithMiddleware(({ model, dispatch }) => (
  <div style={{ width: '200px' }}>
    <h2 style={{ width: '200px', textAlign: 'center' }}>{ model.topic }</h2>
    { renderGif(model.url) }
    <button onClick={ () => dispatch({ type: 'RequestGif' }) }>More Please!</button>
  </div>
))
