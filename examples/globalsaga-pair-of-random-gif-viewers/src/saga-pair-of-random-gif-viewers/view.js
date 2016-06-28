import React from 'react'
import { forwardTo, view } from 'redux-container-state'

import GifViewer from '../saga-random-gif-viewer/view'

export default view(({ model, localDispatch }) => (
  <div>
    <GifViewer model={model.top} localDispatch={forwardTo(localDispatch, 'Top')} />
    <GifViewer model={model.bottom} localDispatch={forwardTo(localDispatch, 'Bottom')} />
    <button onClick={() => localDispatch({ type: 'Reset' })}>RESET</button>
  </div>
))
