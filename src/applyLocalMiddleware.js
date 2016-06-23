import { compose } from 'redux'

export default (...middlewares) => (view) => {

	const localDispatch = (action) => view.props.dispatch(action)

	const middlewareAPI = {
		getState: () => view.props.model,
		dispatch: localDispatch,
		getGlobalState: () => view.context.store.getState(),
		globalDispatch: (action) => view.context.store.dispatch
	}

	const chain = middlewares.map(middleware => middleware(middlewareAPI))

	return compose(...chain)(localDispatch)
}
