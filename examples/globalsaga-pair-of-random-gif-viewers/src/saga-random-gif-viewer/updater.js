import { updater } from 'redux-container-state'

export const init = (topic) => ({
	topic,
	url: null
})

export default updater((model = init('funny cats'), action) => {

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

