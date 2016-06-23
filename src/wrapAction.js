import { ActionDelimiter } from './constants'

/** 
 * Wraps an action for a parent action type
 *
 * @param {Object} action The action to wrap
 * @param {string} type Action type to forward to
 * @param {object} [param] Parameter for the action type
 * @return {Object} The wrapped action
 */
export default (action, type, param) => {

    const typePrefix = type && (param === undefined ? `${type}${ActionDelimiter}` : `${type}[${param}]${ActionDelimiter}`)

    return {
        ...action,
        type: `${ typePrefix || '' }${action.type}` 
    }
}