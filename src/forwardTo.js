import wrapAction from './wrapAction'

/** 
 * Modified dispatch by wrapping all the outgoing actions in the action composition
 *
 * @param {Function} dispatch The dispatch method to forward
 * @param {string} type Action type to forward to
 * @param {object} [param] Parameter for the action type
 * @return {Function} modified dispatch
 */
export default (dispatch, type, param) => (action) => dispatch(wrapAction(action, type, param))