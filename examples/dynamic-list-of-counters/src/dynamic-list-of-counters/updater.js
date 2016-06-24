import { updater } from 'redux-container-state'
import counterUpdater, { initialState as counterInitialState } from '../counter/updater'

export default updater((state = [], action) => {

    switch (action.type) {

        case 'Insert': 
            return [
                ...state,
                counterInitialState
            ]

        case 'Remove':
            if (state.length > 0) {
                const counters = [ ...state ]
                counters.pop()
                return counters
            }
            return state

        case 'Counter':
            return state.map((counterState, index) => {
                if (index === action.typeParam) {
                    return counterUpdater(counterState, action)
                }
                return counterState
            })

        default:
            return state
    }
})
