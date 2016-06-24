import { updater } from 'redux-container-state'
import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater'

// TODO: this is not needed, i think
const initialModel = {
	topCounter: counterInitialModel,
	bottomCounter: counterInitialModel
}

export default updater((model = initialModel, action) => {
	switch (action.type) {

		case 'Reset':
			return initialModel

		case 'TopCounter': 
			return {
				...model,
				topCounter: counterUpdater(model.topCounter, action)
			}

		case 'BottomCounter': 
			return {
				...model,
				bottomCounter: counterUpdater(model.bottomCounter, action)
			}
			
		default:
			return model
	}
})