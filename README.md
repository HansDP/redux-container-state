# [redux-container-state](https://github.com/HansDP/redux-container-state)

This project is an attempt to integrate local container state into a Redux store, which is global by nature.

#### Influences

This project evolves the ideas [redux-elm](http://salsita.github.io/redux-elm/), but avoids opinions about specific implementations of Side Effects and tries to be more in line with the [Redux](https://github.com/reactjs/redux/) approach of reducers.

Because this project is influenced by `redux-elm`, which is in its term highly influenced by [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/), most concepts will be familiar to both projects.

#### What is this project trying to solve?

This project tries to solve the same problem as the `redux-elm` project. Basically, it comes down to this:

> In Redux, state is considered global. That makes it hard to create isolated and reusable container components, which require their own local state. This projects tries to abstract away the complexity to handle this problem.


## The Gist

`redux-container-state` is about reusable Containers (which are basically React components that control pieces of an application). These Containers typically require some local state. To solve this within `redux`, you have to find solutions to link actions and components to dedicated locations within the state graph.

With `redux-container-state`, it should become a lot more easy to solve this, because your reusable containers do not have to care about the above problem anymore.

To create containers that benefit from this approach, your container should at least consist of 2 pieces:
* `View`: This is your typical [`React`](https://facebook.github.io/react/)  implementation, wrapped within a higher order component that handles isolation.
* `Updater`: This is your typical Redux [`reducer`](http://redux.js.org/docs/basics/Reducers.html), wrapped within a higher order function that handles isolation.

In the Elm architecture, the typical example is about a counter. So, lets get started with the same example.

#### Counter

##### Counter updater

```javascript
import { updater } from 'redux-container-state'

const initialModel = 0

// The updater(...) function handles isolation of the Counter reducer.
export default updater((model = initialModel, action) => {
  switch (action.type) {

    case 'Increment':
      return model + 1

    case 'Decrement':
      return model - 1
      
    default:
      return model
  }
})
```

##### Counter view

```javascript
import React from 'react'
import { view } from 'redux-container-state'

export default view(({ model, dispatch }) => (
  <div>
    <button onClick={() => dispatch({ type: 'Decrement' })}>-</button>
    <div>{model}</div>
    <button onClick={() => dispatch({ type: 'Increment' })}>+</button>
  </div>
))
```


## Composition

The Counter sample is the most simple example, but it should give you an idea of the way of working.

#### Pair of counters

To up the ante, let us create a parent container that holds two Counters (the pair-of-counters use case): a topCounter and a bottomCounter.

You can re-use the Counter updater and view from the example above. After all, this is the whole idea behind this project: being able to reuse containers.

Little side note: you actually need to change one detail in the Counter example above: the parent view should know the initial state of its child containers. This requires you to just export the default initalModel of the Counter updater:

```javascript
export default const initialModel = 0
```

##### Parent view

```javascript
import React from 'react'
import { forwardTo, view } from 'redux-container-state'

import Counter from '../counter/view'

export default view(({ model, dispatch }) => (
  <div>
    <Counter model={model.topCounter} dispatch={forwardTo(dispatch, 'TopCounter')} />
    <Counter model={model.bottomCounter} dispatch={forwardTo(dispatch, 'BottomCounter')} />
    <button onClick={() => dispatch({ type: 'Reset' })}>RESET</button>
  </div>
))
```

The above sample actually explains the internal working of the composition mechanism: the parent container prepares a new `dispatch` method for its child containers. This new `dispatch` method is capable of composing an hierarchical action. 

For instance: `forwardTo(dispatch, 'TopCounter')` creates a new `dispatch` method that will wrap dispatches of the child container into the TopCounter context. This context can then be used within the parent updater to inspect the targetted child container.

##### Parent updater

```javascript
import { updater } from 'redux-container-state'
import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater'

const initialModel = {
  topCounter: counterInitialModel,
  bottomCounter: counterInitialModel
}

export default updater((model = initialModel, action) => {
  switch (action.type) {

    case 'Reset':
      return initialModel

    case 'TopCounter': 
      return {
        ...model,
        topCounter: counterUpdater(model.topCounter, action)
      }

    case 'BottomCounter': 
      return {
        ...model,
        bottomCounter: counterUpdater(model.bottomCounter, action)
      }
      
    default:
      return model
  }
})
```

The parent updator is aware of its child updaters. The library takes care of unwrapping the parent's action into a child action, so you just pass the action to the child updater.


## Dynamic composition

In a lot of cases, a hard-coded set of child containers is sufficient. However, there is a huge use-case for a dynamic set of child containers.

#### Dynamic list of counters

##### Parent view

```javascript
import React from 'react'
import { forwardTo, view } from 'redux-container-state'

import Counter from '../counter/view'

const viewCounter = (dispatch, model, index) =>
  <Counter key={index} dispatch={ forwardTo(dispatch, 'Counter', index) } model={ model } />

export default view(({ model, dispatch }) => (
  <div>
    <button onClick={ () => dispatch({ type: 'Remove' }) }>Remove</button>
    <button onClick={ () => dispatch({ type: 'Insert' }) }>Add</button>
    {model.map((counterModel, index) => viewCounter(dispatch, counterModel, index))}
  </div>
))
```

Because there are an unknown amount of child containers, the parent view is not capable of forwarding the dispatch method in a predictable way (without trickery code, that is).

That is why the `forwardTo` method can take an additional parameter, which parameterizes the action type that is being forwarded. This parameter can then be used within the parent's updater.

Note: this parameter can be of any type, but it should be serializable to a string (e.g. integers, strings, floats, ...).  

##### Parent updater

```javascript
import { updater } from 'redux-container-state'
import counterUpdater, { initialModel as counterInitialModel } from '../counter/updater'

export default updater((model = [], action) => {

    switch (action.type) {

        case 'Insert': 
            return [
                ...model,
                counterInitialModel
            ]

        case 'Remove':
            if (model.length > 0) {
                const counters = [ ...model ]
                counters.pop()
                return counters
            }
            return model

        case 'Counter':
            return model.map((counterModel, index) => {
                if (index === action.typeParam) {
                    return counterUpdater(counterModel, action)
                }
                return counterModel
            })

        default:
            return model
    }
})
```

The updater can use the `typeParam` to check the targetted child container (as set in the forwardTo method). Because parameterization is mainly used within the context of arrays (and thus the index in the array will be the parameter), the framework deserializes numbers back to valid JavaScript types (which takes away the burder to have to parse the parameter to a number yourself.)


## View enhancers

#### Local middleware

**Note**: This is highly experimental and has not validated against multiple use-case. However, [local thunk middleware](https://github.com/HansDP/redux-container-state-thunk) is up and running. Yay!

In order for your reusable container to be truly isolated, you probably need some middleware that only applies to your container only.

```javascript
import React from 'react'
import { compose } from 'redux'
import { view, applyLocalMiddleware } from 'redux-container-state'
import localThunk from 'redux-container-state-thunk'


const increment = () => {
  return {
    type: 'INCREMENT_COUNTER'
  }
}

const incrementAsync = () => {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000)
  }
}

const counterUpdater = updater((model = 0, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNTER': 
      return model + 1
    default:
      return model
  }
})

const viewWithMiddleware = compose(applyLocalMiddleware(localThunk))(view)

// Pass the middlewares you need to the view method.
export default viewWithMiddleware(({model, dispatch}) => (
  <div>
    <button onClick={ () => dispatch(incrementAsync()) }>Start counter</button>
    Current count: { model }
  </div>
))
```

#### Global state

In some cases, you will want to get access to the global state of Redux within your view(). For that use-case, take a look at the global-state enhancer at [redux-container-state-globalstate](https://github.com/HansDP/redux-container-state-globalstate).


#### Side Effects with [redux-saga](https://github.com/yelouafi/redux-saga)

If you wish to incoporate `redux-saga` into your local containers, you can have [redux-container-state-globalsaga](https://github.com/HansDP/redux-container-state-globalsaga). This extension enables Sagas that have access to actions and state from both global (redux store) and local (container) sources. 

If you need Sagas that work on containers only (so only local actions and state), there is another option as well: [redux-container-state-saga](https://github.com/HansDP/redux-container-state-saga)

## Some remarks

#### Redux middleware

`redux-container-state` requires a piece of middleware to keep things going. 

```javascript
import { applyMiddleware, createStore, compose } from 'redux'
import { containerStateMiddleware } from 'redux-container-state'

import rootReducer from './path/to/rootReducer'

const storeFactory = compose(
  applyMiddleware(containerStateMiddleware())
)(createStore)

const store = storeFactory(rootReducer)

...

```

#### Actions are dispatched globally

Worth noting is that all actions that originate from a view() are dispatched globally. This might not be obvious at first sight, but if you consider that Redux is the backing state store for this framework, it makes a lot more sense. 

This also means that you can register any middleware and/or store enhancer in Redux to handle some concerns from your child containers (but be careful, in some cases this is exactly what you don't want).

When composed actions are send to Redux, they will follow a predictable format. Suppose you have a container that holds a dynamic list of counters, the type of the action in global scope will look like `Counter[4]->Increment`. Or deeply nested, it could look like `Child[1]->GrandChild[2]->TopCounter->Increment`.

#### Inspecting the global type in an updater

In some cases, you will want to inspect the globally dispatched action. To get a hold of this within an updater(reducer), you can inspect the `action.globalType` property.

## Examples

* [Counter](https://github.com/HansDP/redux-container-state/tree/master/examples/counter)  
  Shows a simple example to showcase the basics
* [Pair of counters](https://github.com/HansDP/redux-container-state/tree/master/examples/pair-of-counters)  
  Shows how to achieve composition with local state
* [Dynamic list of counters](https://github.com/HansDP/redux-container-state/tree/master/examples/dynamic-list-of-counters)  
  Shows how to achieve dynamic composition
* [Random GIF viewer](https://github.com/HansDP/redux-container-state/tree/master/examples/random-gif-viewer)  
  Showcase of how to work with asynchrone actions
* [Saga random GIF viewer](https://github.com/HansDP/redux-container-state/tree/master/examples/saga-random-gif-viewer)  
  Showcase of how to work with side effects using the [redux-saga](https://github.com/yelouafi/redux-saga) library.
* [Saga pair of random GIF viewers](https://github.com/HansDP/redux-container-state/tree/master/examples/saga-pair-of-random-gif-viewers)  
  Showcase of how to work with side effects using the [redux-saga](https://github.com/yelouafi/redux-saga) library when using composition
* [Global Saga pair of random GIF viewers](https://github.com/HansDP/redux-container-state/tree/master/examples/globalsaga-pair-of-random-gif-viewers)  
  Enables using Sagas within composed containers with Sagas that have access to both global and local state.


## Installation & Usage

You can install `redux-container-state` via npm.

```
npm install redux-container-state --save
```