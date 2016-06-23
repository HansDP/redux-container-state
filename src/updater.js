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
export default (reducer) => {

	return (state, action) => {

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

		const wrappedAction = createWrappedAction(action, action.type, segments, 0)
		return reducer(state, wrappedAction)
	}
}