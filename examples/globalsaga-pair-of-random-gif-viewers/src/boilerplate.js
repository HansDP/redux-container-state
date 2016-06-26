import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import { containerStateMiddleware } from 'redux-container-state'

import { sagaStoreEnhancer } from 'redux-container-state-globalsaga'

export default (containerDomId, View, updater) => {
  const storeFactory = compose(
    applyMiddleware(containerStateMiddleware()),
    sagaStoreEnhancer(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore)

  const store = storeFactory(combineReducers({
    root: updater
  }))

  const ConnectedView = connect(appState => ({
    model: appState.root
  }))(View)

  render((
    <Provider store={store}>
      <ConnectedView />
    </Provider>
    ), document.getElementById(containerDomId))
}
