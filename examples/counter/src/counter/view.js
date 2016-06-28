import React from 'react'
import { view } from 'redux-container-state'

const countStyle = {
  fontSize: '20px',
  fontFamily: 'monospace',
  display: 'inline-block',
  width: '50px',
  textAlign: 'center'
}

export default view(({ model, localDispatch }) => (
  <div>
    <button onClick={() => localDispatch({ type: 'Decrement' })}>-</button>
    <div style={countStyle}>{model}</div>
    <button onClick={() => localDispatch({ type: 'Increment' })}>+</button>
  </div>
))
