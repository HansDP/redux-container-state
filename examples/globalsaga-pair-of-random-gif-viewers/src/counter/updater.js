import { updater } from 'redux-container-state'

export const initialModel = 0

// TODO: issue with 'globalType'

export default updater((model = initialModel, action) => {

  switch (action.type) {
    case 'INCREMENT_COUNTER': 
      return model + 1
    
    default:
      return model
  }
})