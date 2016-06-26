import React, { Component, PropTypes } from 'react'
import { compose } from 'redux'
import warning from 'warning'
import { getModelAction } from './middleware'

const notInitializedModel = {}

export default (...middlewares) => (next) => (View) => {

	const createDispatch = (view) => {
		const localDispatch = (action) => view.props.dispatch(action)
		const middlewareAPI = {
			getState: () => {
				let model = notInitializedModel
				localDispatch(getModelAction((data) => model = data))
				warning(model !== notInitializedModel, 'Middleware \'containerStateMiddleware\' not installed. Apply this middleware to your Redux store.')
				return model
			},
			dispatch: localDispatch,
			getGlobalState: () => view.context.store.getState(),
			globalDispatch: (action) => view.context.store.dispatch(action)
		}

		const chain = middlewares.map(middleware => middleware(middlewareAPI))
		return compose(...chain)(localDispatch)
	}

	return next(class ViewWithMiddleware extends Component {
		constructor(props, context) {
			super(props, context)
			this.dispatch = createDispatch(this)
		}

	    static contextTypes = {
	        store: PropTypes.object.isRequired
	    };

		render() {
			return React.createElement(View, { ...this.props, dispatch: this.dispatch})
		}
	})
}