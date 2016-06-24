import { createElement, Component, PropTypes } from 'react'
import applyLocalMiddleware from './applyLocalMiddleware'

/**
 * Higher order component implementing shouldComponentUpdate which ignores passed dispatch
 *
 * @return {Component} Wrapped React Component
 */
export default (View) => class HocView extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired
    };

    /**
    * @constructor
    * @param {Object} Props
    */
    constructor(props) {
        super(props)
        // TODO: when the component has been unmounted, and an async action completes, the action still gets dispatched.
        // That is not suck a huge problem, but the 'parent' updaters need to take that into consideration. This is probably the case for redux-saga
        this.dispatch = (action) => this.props.dispatch(action)
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
        return createElement(View, { ...this.props, dispatch: this.dispatch })
    }
}