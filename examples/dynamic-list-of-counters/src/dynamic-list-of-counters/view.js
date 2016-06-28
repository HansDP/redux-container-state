import React from 'react'
import { forwardTo, view } from 'redux-container-state'

import Counter from '../counter/view'

const viewCounter = (localDispatch, model, index) =>
  <Counter key={index} localDispatch={ forwardTo(localDispatch, 'Counter', index) } model={ model } />

export default view(({ model, localDispatch }) => (
	<div>
    <button onClick={ () => localDispatch({ type: 'Remove' }) }>Remove</button>
    <button onClick={ () => localDispatch({ type: 'Insert' }) }>Add</button>
    {model.map((counterModel, index) => viewCounter(localDispatch, counterModel, index))}
  </div>
))