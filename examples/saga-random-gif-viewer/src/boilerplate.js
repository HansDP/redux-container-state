import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider, connect } from 'react-redux'

export default (containerDomId, View, updater) => {
  const storeFactory = compose(
    applyMiddleware(containerStateMiddleware()),
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
