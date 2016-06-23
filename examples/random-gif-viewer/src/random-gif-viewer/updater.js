import { updater } from 'redux-container-state'

const initialState = {
	topic: 'funny cats',
	url: null
}

export default updater((state = initialState, action) => {

	switch (action.type) {

		case 'NewGif':
			return {
				...state,
				url: action.payload.url
			}

		case 'RequestGif':
			return {
				...state,
				url: null
			}

		default:
			return state
	}
})

