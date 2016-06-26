import { createElement, Component, PropTypes } from 'react'
import warning from 'warning'
import currentReducedModels from './currentReducedModels'
import { ActionDelimiter } from './constants'

/**
 * Higher order component implementing shouldComponentUpdate which ignores passed dispatch
 *
 * @return {Component} Wrapped React Component
 */
export default (View) => class HocView extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    /**
    * @constructor
    * @param {Object} Props
    */
    constructor(props, context) {
        super(props, context)

        // TODO: when the component has been unmounted, and an async action completes, the action still gets dispatched.
        // That is not suck a huge problem, but the 'parent' updaters need to take that into consideration. This is probably the case for redux-saga
        this.dispatch = (action) => {
            
            // Scpecial action: if mounting the container, quickly fake a dispatch
            // At the top of the tree, the dispatch method will be the same as the
            // Redux-store dispatch method. Then we are at the top and the action.type
            // will have been composed. Yeay!
            if (action.isLookup) {
                const { store } = this.context
                if (store.dispatch === this.props.dispatch) {
                    return action.type
                }
                // Else, continue going up.
            }

            // Normal behavior
            return this.props.dispatch(action)
        }

        this.resolveContainerLocation()
    }

    resolveContainerLocation() {
        const shortCircuitActionName = '@@MOUNTING'
        const globalActionType = this.dispatch({ 
            type: shortCircuitActionName,
            isLookup: true
        })
        let index = globalActionType.indexOf(shortCircuitActionName)
        if (index !== 0) {
            index -= ActionDelimiter.length
        }
        this.containerLocation = globalActionType.substr(0, index)
    }

    componentWillUnmount() {
        this.containerLocation !== undefined && delete currentReducedModels[this.containerLocation]
    }

    /**
    * shouldComponentUpdate implementation which ignores `dispatch` passed in props
    *
    * @param {Object} nextProps
    * @return {boolean}
    */
    shouldComponentUpdate(nextProps) {
        return Object
            .keys(this.props)
            .some(prop => (prop !== 'dispatch' && this.props[prop] !== nextProps[prop]))
    }

    render() {
        const { containerLocation, dispatch } = this
        return createElement(View, { ...this.props, containerLocation, dispatch })
    }
}