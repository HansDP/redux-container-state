import { updater } from 'redux-container-state'
import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater'

export default updater((model = [], action) => {

    switch (action.type) {

        case 'Insert': 
            return [
                ...model,
                counterInitialModel
            ]

        case 'Remove':
            if (model.length > 0) {
                const counters = [ ...model ]
                counters.pop()
                return counters
            }
            return model

        case 'Counter':
            return model.map((counterModel, index) => {
                if (index === action.typeParam) {
                    return counterUpdater(counterModel, action)
                }
                return counterModel
            })

        default:
            return model
    }
})
