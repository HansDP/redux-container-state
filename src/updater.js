import { ActionDelimiter } from './constants'
import { updateModel } from './middleware'

const parameterRegEx = /^(.+?)\[(.+)\]$/

const createWrappedAction = (action) => {

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

	const globalType = action.type

	const createTakeNext = (index = 0) => {
		if (index >= segments.length) {
			throw new Error(`This action has already been passed to the last child updater. Ensure that you only pass actions to intended children.`)
		}

		return {
			...action,
			parentType: segments.filter((s, i) => i < index)
								.map((segment) => segment.type + (segment.param ? `[${segment.param}]` : ''))
								.join(ActionDelimiter),
			globalType: globalType,
			type: segments[index].type,
			typeParam: segments[index].param,
			takeNext: () => createTakeNext(index + 1)
		}
	}

	return createTakeNext()
}


/**
 * Higher order function that adds Elm-like updater functionality to a reducer
 *
 * @param {Function} reducer The reducer to augment
 * @return {Function} The augmented reducer with Elm-like updater functionality
 */
export default (reducer) => (state, action) => {

	const finalAction = action.takeNext 
							? action.takeNext()
							: createWrappedAction(action)

	const model = reducer(state, finalAction)

	// Make sure to update the 'model repository' with this latest reduced version.
	updateModel(finalAction.parentType, model)

	return model
}
