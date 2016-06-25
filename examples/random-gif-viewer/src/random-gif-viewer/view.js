import React from 'react'
import { compose } from 'redux'
import { view, applyLocalMiddleware } from 'redux-container-state'
import { requestGif } from './actions'

import localThunk from 'redux-container-state-thunk'

const renderGif = url => {
	if (url) {
		return <img role="presentation" src={url} width="200" height="200" />;
	}

	return <div>Waiting for gif</div>
}

const viewWithMiddleware = compose(applyLocalMiddleware(localThunk))(view)

export default viewWithMiddleware(class GifViewer extends React.Component {

	componentWillMount() {
		const { model, dispatch } = this.props
		dispatch(requestGif(model.topic))
	}

	render() {
		const { model, dispatch } = this.props

		return (
			<div style={{ width: '200px' }}>
        <h2 style={{ width: '200px', textAlign: 'center' }}>{ model.topic }</h2>
        { renderGif(model.url) }
        <button onClick={ () => dispatch(requestGif(model.topic)) }>More Please!</button>
      </div>
    )
  }
})