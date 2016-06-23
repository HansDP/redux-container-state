import { ActionDelimiter } from './constants'

const parameterRegEx = /^(.+?)\[(.+)\]$/

const createWrappedAction = (action, globalType, segments, index) => {

	const { type, param: typeParam } = segments[index]
	return {
		...action,
		globalType,
		type,
		typeParam,
		inner: () => {
			if (segments.length === index + 1) {
				throw 'There is no more inner() action left.'
			}
			return createWrappedAction(action, globalType, segments, index + 1)
		}
	}
}

/**
 * Higher order function that adds Elm-like updater functionality to a reducer
 *
 * @param {Function} reducer The reducer to augment
 * @return {Function} The augmented reducer with Elm-like updater functionality
 */
export default (reducer) => (state, action) => {

	const segments = action.type.split(ActionDelimiter).map((segment) => {
		const match = segment.match(parameterRegEx)
		if (match) {
			return {
				type: match[1],
				param: isNaN(match[2]) ? match[2] : parseFloat(match[2])
			}
		} 
		return {
			type: segment
		}
	})

	// if the action already contains the inner method, it is already wrapped
	const wrappedAction = typeof action.inner === 'function' ? action : createWrappedAction(action, action.type, segments, 0)
	return reducer(state, wrappedAction)
}
