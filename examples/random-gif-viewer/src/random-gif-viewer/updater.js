import { updater } from 'redux-container-state'

const initialModel = {
	topic: 'funny cats',
	url: null
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

		default:
			return model
	}
})

