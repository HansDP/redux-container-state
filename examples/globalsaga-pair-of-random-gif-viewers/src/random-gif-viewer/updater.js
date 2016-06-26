import { updater } from 'redux-container-state'

import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater'

const initialModel = {
	topic: 'funny cats',
	url: null,

	hasCounter: true,
	counter: counterInitialModel
}

export default updater((model = initialModel, action) => {

	switch (action.type) {

		case 'NewGif':
			return {
				...model,
				url: action.payload.url
			}

		case 'RequestGif':
			return {
				...model,
				url: null
			}

		case 'RemoveCounter':
			return {
				...model,
				hasCounter: false
			}

		case 'AddCounter':
			return {
				...model,
				hasCounter: true
			}

		case 'Counter': 
			if (model.hasCounter){
				return {
					...model,
					counter: counterUpdater(model.counter, action)
				}			
			}
			return model
	
		default:
			return model
	}
})

