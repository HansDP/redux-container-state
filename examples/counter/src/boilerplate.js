import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider, connect } from 'react-redux'
import { containerStateMiddleware } from 'redux-container-state'

export default (containerDomId, View, updater) => {
  const storeFactory = compose(
    applyMiddleware(containerStateMiddleware()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore)

  const store = storeFactory(updater)

  const ConnectedView = connect(appState => ({
    model: appState
  }))(View)

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
    ), document.getElementById(containerDomId)
  )
}
