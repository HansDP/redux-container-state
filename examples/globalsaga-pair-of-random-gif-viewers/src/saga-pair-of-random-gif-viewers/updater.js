import { updater } from 'redux-container-state'
import childUpdater, { init as childInit } from '../saga-random-gif-viewer/updater'

const initialModel = {
	top: childInit('funny cats'),
	bottom: childInit('dogs')
}

export default updater((model = initialModel, action) => {
  switch (action.type) {

    case 'Reset':
      return initialModel

    case 'Top': 
      return {
        ...model,
        top: childUpdater(model.top, action)
      }

    case 'Bottom': 
      return {
        ...model,
        bottom: childUpdater(model.bottom, action)
      }

    default:
      return model
  }
})