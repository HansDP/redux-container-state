import { updater } from 'redux-container-state'
import counterUpdater, { initialState as counterInitialState } from '../counter/updater'

// TODO: this is not needed, i think
const initialState = {
	topCounter: counterInitialState,
	bottomCounter: counterInitialState
}

export default updater((state = initialState, action) => {
	switch (action.type) {

		case 'Reset':
			return initialState

		case 'TopCounter': 
			return {
				...state,
				topCounter: counterUpdater(state.topCounter, action.inner())
			}

		case 'BottomCounter': 
			return {
				...state,
				bottomCounter: counterUpdater(state.bottomCounter, action.inner())
			}
			
		default:
			return state
	}
})