import React from 'react'
import { view, forwardTo } from 'redux-container-state'
import { requestGif } from './actions'

import Counter from '../counter/view'

const renderGif = url => {
    if (url) {
        return <img role="presentation" src={url} width="200" height="200" />;
    }

    return <div>Waiting for gif</div>
}

export default view(class GifViewer extends React.Component {
    
    componentWillMount() {
        const { model, dispatch } = this.props
        dispatch(requestGif(model.topic))
    }

    render() {
        const { model, dispatch } = this.props

        return (
            <div>
                <div style={{ width: '200px' }}>
                    <h2 style={{ width: '200px', textAlign: 'center' }}>{ model.topic }</h2>
                    { renderGif(model.url) }
                    <button onClick={ () => dispatch(requestGif(model.topic)) }>More Please!</button>
                </div>
                <div>
                {
                    !model.hasCounter 
                        ? <button onClick={ () => dispatch({ type: 'AddCounter'}) }>Add counter</button>
                        : <button onClick={ () => dispatch({ type: 'RemoveCounter'}) }>Rmove counter</button>
                }
                </div>
                <div>
                {
                    model.hasCounter ? <Counter uid='counter' dispatch={ forwardTo(dispatch, 'Counter') } model={ model.counter } /> : null
                }
                </div>
            </div>
        )
    }
})
