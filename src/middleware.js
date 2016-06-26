import { ActionDelimiter } from './constants'

// Why do we need this strange way of storing all Models?
// Because we need in multiple locations access to the Model (e.g. in the applyLocalMiddleware -> getState )
// It is not an option to return there view.props.model, because when running async stuff (e.g. Saga), it 
// could be that the reducers have finished, the redux store calls its subscribers. Now, there is 
// a tiny timeslot that REACT is not updated yet (setState, used in Redux connect(), is not guaranteed 
// to be synchronous). And just in that moment, the Saga wants to get the getState. If we would use the
// view.props.model, we would use the old version, not the latest version (from the reducer)
const modelsRepository = {}

export default () => (store) => (next) => (action) => {
	if (action.meta) {
		const { SHORT_CIRCUIT: shortCircuitData } = action.meta
		if (shortCircuitData) {
			const { type } = action
			const indexOfFinalAction = type.lastIndexOf(ActionDelimiter)
			const containerLocation = type.substr(0, indexOfFinalAction)

			if (type.indexOf('@@GET_MODEL') !== -1) {
				shortCircuitData.unintendedPath(modelsRepository[containerLocation], containerLocation)
			} else if (type.indexOf('@@CLEAR_MODEL') !== -1) {
				delete modelsRepository[containerLocation]
			}

			// Short circuited. 
			// Do not continue with this action (to prevent updates)
			return
		}
	}	
	return next(action)
}

// When an updator reducer has exectued, he should set the updated model in the repository
export const updateModel = (key, model) => {
	modelsRepository[key] = model
}

export const getModelAction = (unintendedPath) => {
	return {
		type: '@@GET_MODEL',
		meta: {
			SHORT_CIRCUIT: {
				unintendedPath
			}
		}
	}
}

export const clearModelAction = () => {
	return {
		type: '@@CLEAR_MODEL',
		meta: {
			SHORT_CIRCUIT: {}
		}
	}
}