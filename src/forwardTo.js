import wrapAction from './wrapAction'

/** 
 * Modified localDispatch by wrapping all the outgoing actions in the action composition
 *
 * @param {Function} localDispatch The localDispatch method to forward
 * @param {string} type Action type to forward to
 * @param {object} [param] Parameter for the action type
 * @return {Function} modified localDispatch
 */
export default (localDispatch, type, param) => (action) => localDispatch(wrapAction(action, type, param))