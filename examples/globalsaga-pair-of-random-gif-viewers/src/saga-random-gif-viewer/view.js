import React from 'react'
import { compose } from 'redux'
import { view, applyLocalMiddleware } from 'redux-container-state'
import { sagaViewEnhancer } from '../globalsaga'
import rootSaga from './sagas'

const renderGif = url => {
  if (url) {
    return <img role="presentation" src={url} width="200" height="200" />;
  }

  return <div>Waiting for gif</div>
}

const options = {
  // Make sure to cancel any pending saga
  autoCancel: true,
  // When a view mounts, request a new gif when needed.
  onMount: (props) => {
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
