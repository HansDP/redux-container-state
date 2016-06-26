import React from 'react'
import { forwardTo, view } from 'redux-container-state'

import GifViewer from '../saga-random-gif-viewer/view'

export default view(({ model, dispatch }) => (
	<div>
    <GifViewer model={model.top} dispatch={forwardTo(dispatch, 'Top')} />
    <GifViewer model={model.bottom} dispatch={forwardTo(dispatch, 'Bottom')} />
    <button onClick={() => dispatch({ type: 'Reset' })}>RESET</button>
  </div>
))
