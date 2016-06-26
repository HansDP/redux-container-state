// When an updator reducer has exectued, he should set the currentReducedModels to the latest version
//
// Why do we need this?
// Because we need in multiple locations access to the Model (e.g. in the applyLocalMiddleware -> getState )
// It is not an option to return there view.props.model, because when running async stuff (e.g. Saga), it 
// could be that the reducers have finished, the redux store calls its subscribers. Now, there is 
// a tiny timeslot that REACT is not updated yet (setState, used in Redux connect(), is not guaranteed 
// to be synchronous). And just in that moment, the Saga wants to get the getState. If we would use the
// view.props.model, we would use the old version, not the latest version (from the reducer)

export default {}