import React from 'react'
import { render } from 'react-dom'
import { createStore, compose, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'

export default (containerDomId, View, updater) => {
    const storeFactory = compose(
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
            <ConnectedView uid='connectedview' />
        </Provider>
    ), document.getElementById(containerDomId))
}
