import React from 'react'
import { forwardTo, view } from 'redux-container-state'

import Counter from '../counter/view'

export default view(({ model, localDispatch }) => (
  <div>
    <Counter model={model.topCounter} localDispatch={forwardTo(localDispatch, 'TopCounter')} />
    <Counter model={model.bottomCounter} localDispatch={forwardTo(localDispatch, 'BottomCounter')} />
    <button onClick={() => localDispatch({ type: 'Reset' })}>RESET</button>
  </div>
))
