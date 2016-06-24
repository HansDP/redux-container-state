import { updater } from 'redux-container-state'

const initialModel = 0

export default updater((model = initialModel, action) => {
	switch (action.type) {

		case 'Increment':
			return model + 1

		case 'Decrement':
			return model - 1
			
		default:
			return model
	}
})
