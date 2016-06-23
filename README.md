# [redux-container-state](https://github.com/HansDP/redux-container-state)

**Note:** Work in progress. This project is not ready to be used

This project is an attempt to integrate local container state into a Redux store, which is global by nature.

### Influences

This project evolves the ideas [redux-elm](http://salsita.github.io/redux-elm/), but avoids its opinions about Side Effects and tries to be more in line with [Redux](https://github.com/reactjs/redux/) approach of reducers.

Because `redux-elm` is highly influenced by [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial/), most concepts will be familiar to the architecture.

### What is this project trying to solve?

This project tries to solve the same problem as the `redux-elm` project:

> redux-elm is framework specifically tailored for solving difficult problems that people have to face in modern front-end application development, it is heavily based on [Composition](http://salsita.github.io/redux-elm/composition/).


## The Gist

`redux-container-state` is about reusable Containers (which are basically React components that control pieces of an application). These Containers typically require some local state. To solve this within `redux`, you have to find solutions to link actions and components to dedicated locations within the state graph.

With `redux-container-state`, it should become a lot more easy to solve this, because your reusable containers do not have to care about the above problem anymore.

To create containers that benefit from this approach, your container should at least consist of 2 pieces:
* `View`: This is your typical [`React`](https://facebook.github.io/react/)  implementation, wrapped within a higher order component that handles isolation.
* `Updater`: This is your typical Redux [`reducer`](http://redux.js.org/docs/basics/Reducers.html), wrapped within a higher order function that handles isolation.

In the Elm architecture, the typical example is about a counter. So, lets get started with the same example.

### Counter

#### Counter updater

```javascript
import { updater } from 'redux-container-state'

const initialState = 0

// The updater(...) function handles isolation of the Counter reducer.
export default updater((state = initialState, action) => {
	switch (action.type) {

		case 'Increment':
			return state + 1

		case 'Decrement':
			return state - 1
			
		default:
			return state
	}
})
```

#### Counter view

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

### Pair of counters

To up the ante, let us create a parent container that holds two Counters (the pair-of-counters use case): a topCounter and a bottomCounter.

You can re-use the Counter updater and view from the example above. After all, this is the whole idea behind this project: being able to reuse containers.

Little side note: you actually need to change one detail in the Counter example above: the parent view should know the initial state of its child containers. This requires you to just export the default initalState of the Counter updater:

```javascript
export default const initialState = 0
```

#### Parent view

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

#### Parent updater

```javascript
import { updater } from 'redux-container-state'
import counterUpdater, { initialState as counterInitialState } from '../counter/updater'

const initialState = {
	topCounter: counterInitialState,
	bottomCounter: counterInitialState
}

export default updater((state = initialState, action) => {
	switch (action.type) {

		case 'Reset':
			return initialState

		case 'TopCounter': 
			return {
				...state,
				topCounter: counterUpdater(state.topCounter, action.inner())
			}

		case 'BottomCounter': 
			return {
				...state,
				bottomCounter: counterUpdater(state.bottomCounter, action.inner())
			}
			
		default:
			return state
	}
})
```

The parent updator is aware of child containers, he should pass the inner action to the child updators. This is done by passing the `action.inner()` to the counter updator.


## Dynamic composition

In a lot of cases, a hard-coded set of child containers is sufficient. However, there is a huge use-case for a dynamic set of child containers.

### Dynamic list of counters

#### Parent view

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

#### Parent updater

```javascript
import { updater } from 'redux-container-state'
import counterUpdater, { initialState as counterInitialState } from '../counter/updater'

export default updater((state = [], action) => {

    switch (action.type) {

        case 'Insert': 
            return [
                ...state,
                counterInitialState
            ]

        case 'Remove':
            if (state.length > 0) {
                const counters = [ ...state ]
                counters.pop()
                return counters
            }
            return state

        case 'Counter':
            return state.map((counterState, index) => {
                if (index === action.typeParam) {
                    return counterUpdater(counterState, action.inner())
                }
                return counterState
            })

        default:
            return state
    }
})
```

The updater can use the `typeParam` to check the targetted child container (as set in the forwardTo method). Because parameterization is mainly used within the context of arrays (and thus the index in the array will be the parameter), the framework deserializes numbers back to valid JavaScript types (which takes away the burder to have to parse the parameter to a number yourself.)


## Some remarks

### Actions are dispatched globally

Worth noting is that all actions that originate from a view() are dispatched globally. This might not be obvious at first sight, but if you consider that Redux is the backing state store for this framework, it makes a lot more sense. 

This also means that you can register any middleware and/or store enhancer in Redux to handle some concerns from your child containers (but be careful, in some cases this is exactly what you don't want).

When composed actions are send to Redux, they will follow a predictable format. Suppose you have a container that holds a dynamic list of counters, the type of the action in global scope will look like `Counter[4]->Increment`. Or deeply nested, it could look like `Child[1]->GrandChild[2]->TopCounter->Increment`.

### Inspecting the global type in an updater

In some cases, you will want to inspect the globally dispatched action. To get a hold of this within an updater(reducer), you can inspect the `action.globalType` property.


## Installation & Usage

You can install `redux-container-state` via npm.

```
npm install redux-container-state --save
```