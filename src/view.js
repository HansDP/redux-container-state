import warning from 'warning'

import { createElement, Component, PropTypes } from 'react'
import { clearModel } from './modelRepository'
import { ActionDelimiter } from './constants'

/**
 * Higher order component implementing shouldComponentUpdate which ignores passed localDispatch and dispatch
 *
 * @return {Component} Wrapped React Component
 */
export default (View) => class HocView extends Component {

    static propTypes = {
        dispatch: PropTypes.func,
        globalDispatch: PropTypes.func,
        localDispatch: PropTypes.func
    };

    /**
    * @constructor
    * @param {Object} Props
    */
    constructor(props, context) {
        super(props, context)

        // TODO: when the component has been unmounted, and an async action completes, the action still gets dispatched.
        // That is not suck a huge problem, but the 'parent' updaters need to take that into consideration. This is probably the case for redux-saga

        const { dispatch, localDispatch } = props

        if (!localDispatch) {
            this.isRoot = true
            if (!dispatch) {
                throw new Error('The root view() must get the dispatch method of the redux store. Review your top-level connect() initialization (it probably contains a mapDispatchToProps, which should pass along the raw dispatch function as a property.')
            }
            // root dispatching
            this.localDispatch = (action) => {
                if (action.isNameLookup) {
                    return extractLocation(action)
                }
                return dispatch(action)
            }
        } else {
            this.localDispatch = (action) => localDispatch(action)
        }
        this.dispatch = () => {
            warning(false, 'You cannot use the generic dispatch method. Use localDispatch() instead. This dispatch() call has been terminated.')
        }
    }

    componentWillUnmount() {
        const location = this.localDispatch({ type: '@@GET_FULL_NAME', isNameLookup: true })
console.log(location)
        clearModel(location)
    }

    /**
    * shouldComponentUpdate implementation which ignores `localDispatch` and `dispatch` passed in props
    *
    * @param {Object} nextProps
    * @return {boolean}
    */
    shouldComponentUpdate(nextProps) {
        return Object
            .keys(this.props)
            .some(prop => (prop !== 'dispatch' && prop !== 'localDispatch' && this.props[prop] !== nextProps[prop]))
    }

    render() {
        const { dispatch, localDispatch } = this
        return createElement(View, { ...this.props, dispatch, localDispatch })
    }
}

const extractLocation = (action) => {
    const { type } = action
    const indexOfFinalAction = type.lastIndexOf(ActionDelimiter)
    return type.substr(0, indexOfFinalAction)
}