export const increment = () => {
  return {
    type: 'INCREMENT_COUNTER'
  }
}

export const incrementAsync = () => {
  return (dispatch, getState) => {
    setTimeout(() => {
      console.log('ticked')
      dispatch(increment());
    }, 5000)
  }
}

export const doGlobalAction = () => {
	// debugger
	return (dispatch, getState, globalDispatch, getGlobalState) => {

	  	console.log('global state', getGlobalState())
	  	dispatch({ type: 'LOCAL_TYPE'})
	  	globalDispatch({ type: 'GLOBAL_TYPE'})
	}
		
}