import React, { Component, PropTypes } from 'react'
import { compose } from 'redux'
import warning from 'warning'
import { getModel } from './modelRepository'

export default (...middlewares) => (next) => (View) => {

	const createDispatch = (view) => {
		const localDispatch = (action) => view.props.localDispatch(action)
		const middlewareAPI = {
			getLocalState: () => {
        		const location = localDispatch({ type: '@@GET_FULL_NAME', isNameLookup: true })
				warning(location !== undefined, 'Could not find the top-level view().')
				return getModel(location)
			},
			localDispatch,
			getGlobalState: () => view.context.store.getState(),
			globalDispatch: (action) => view.context.store.dispatch(action)
		}

		const chain = middlewares.map(middleware => middleware(middlewareAPI))
		return compose(...chain)(localDispatch)
	}

	return next(class ViewWithMiddleware extends Component {
		constructor(props, context) {
			super(props, context)
			this.localDispatch = createDispatch(this)
		}

	    static contextTypes = {
	        store: PropTypes.object.isRequired
	    };

		render() {
			return React.createElement(View, { ...this.props, localDispatch: this.localDispatch })
		}
	})
}