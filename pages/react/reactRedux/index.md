# react-redux

## 1. redux 的基本用法

##### step-1: 利用 createStore 创建 store 数据

> redux-thunk 的作用：使 dispatch 支持传函数参数。

> countReducer 函数最重要的特征是，它是一个纯函数。

```js
import {createStore, applyMiddleware} from 'redux'
import thunk from "redux-thunk"

const countReducer = (state = {
  number: 100
}, {type, payLoad}) => {
  switch(type) {
    case 'ADD':
      return {
        ...state,
        number: state.number + payLoad
      }
    case 'MINUS':
        return {
          ...state,
          number: state.number - payLoad
        }
    default:
      return state
  }
}

export const store = createStore(countReducer, applyMiddleware(thunk))

export const subscribe = store.subscribe

export const dispatch = store.dispatch

export const getState = store.getState
```

##### step-2: 利用 subscribe, dispatch, getState 操作 store 数据

> subscribe 的时候，为什么要调用 this.forceUpdate() ？

```js
import React, { Component } from 'react'
import { subscribe, dispatch, getState } from "./store"

export default class App extends Component {
  componentDidMount() {
    subscribe(() => {
      this.forceUpdate()
    })
  }
  add() {
    dispatch({
      type: 'ADD',
      payLoad: 2
    })
  }
  minus() {
    dispatch({
      type: 'MINUS',
      payLoad: 1
    })
  }
  asyAdd() {
    dispatch(dispatch => {
      setTimeout(() => {
        dispatch({
          type: 'ADD',
          payLoad: 3
        })
      }, 2000)
    })
  }
  render() {
    const {number} = getState()
    return (
      <div className="App">
        <h3>ReduxPage</h3>
        <p>{number}</p>
        <button onClick={this.add}>add</button>
        <button onClick={this.minus}>minus</button>
        <button onClick={this.asyAdd}>asyAdd</button>
      </div>
    );
  }
}
```

## 2. react-redux 的基本用法

##### step-1: 利用 createStore 创建 store 数据

```js
import {createStore} from "redux";

function countReducer(state = 0, action) {
  switch (action.type) {
    case "ADD":
      return state + action.num;
    case "MINUS":
      return state - action.num;
    default:
      return state;
  }
}
const store = createStore(countReducer);

export default store;
```

##### step-2: 利用 Provider 全局挂载 store 数据

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App msg="ownProps"/>
  </Provider>,
  document.getElementById('root')
);
```

##### step-3: 利用 connect 连接 store 数据

```js
import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

export default connect(
  state => ({count: state}),
  dispatch => {
    let res = {
      add: () => ({type: "ADD", num: 2}),
      minus: () => ({type: "MINUS", num: 2})
    };
    res = bindActionCreators(res, dispatch);
    return {
      dispatch,
      ...res
    };
  }
)(
  class App extends Component {
    render() {
      console.log(this.props)
      const {count, dispatch, msg, add, minus} = this.props;
      return (
        <div>
          <h3>ReactReduxPage</h3>
          <p>{count}</p>
          <p>{msg}</p>
          <button onClick={() => dispatch({type: "ADD", num: 2})}>
            add use dispatch
          </button>
          <button onClick={add}>add</button>
          <button onClick={minus}>minus</button>
        </div>
      )
    }
  }
);
```

## 3. redux 源码

### 3.1 compose 函数

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reverse().reduce((a, b) => args => a(b(args)));
}

// 测试
function f1(arg) {
  console.log("f1", arg);
  return arg;
}
function f2(arg) {
  console.log("f2", arg);
  return arg;
}
function f3(arg) {
  console.log("f3", arg);
  return arg;
}

let res = compose(f1, f2, f3)("omg");
```

### 3.2 createStore 源码

```js
export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let currentState = undefined;
  let currentListeners = [];
  function getState() {
    return currentState;
  }
  function dispatch(action) {
    currentState = reducer(currentState, action);
    // 监听函数是一个数组
    currentListeners.map(listener => listener());
  }

  //订阅，可以多次订阅
  function subscribe(listener) {
    // 每次订阅，把回调放入回调数组
    currentListeners.push(listener);
  }

  // 取值的时候，注意一定要保证不和项目中的会重复
  dispatch({type: "@INIT/REDUX-KKB"});

  return {
    getState,
    dispatch,
    subscribe
  };
}
```

### 3.3 applyMiddleware 源码

```js
export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = store.dispatch;
    const middleApi = {
      getState: store.getState,
      dispatch
    };
    const middlewaresChain = middlewares.map(middleware =>
      middleware(middleApi)
    );
    dispatch = compose(...middlewaresChain)(dispatch);
    return {
      ...store,
      dispatch
    };
  };
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reverse.reduce((a, b) => (...args) => a(b(...args)));
}
```

### 3.4 redux-thunk 源码

- 目的：为了让 dispatch 能够把函数作为参数进行传递。

```js
function thunk({getState, dispatch}) {
  return dispatch => action => {
    // action 可以是对象也可以是函数
    if (typeof action === "function") {
      return action(dispatch, getState);
    } else {
      return dispatch(action);
    }
  };
}
```

## vuex 与 redux 的区别

- redux 中有三个基本概念：Actions、Reducer、Store；vuex 中有三个基本概念：Actions、Mutations、Store。

- vuex 以 mutations 变化函数取代 reducer，无需 switch，只需在对应的 mutation 函数里改变 state 值即可。

- redux 的几个方法：

  * 提供 getState() 方法获取 state；     

  * 提供 dispatch(action) 方法更新 state；     

  * 通过 subscribe(listener) 注册监听器。

- vuex 的几个方法：

  * 提供 getters 方法获取 state；     

  * 提供 dispatch(actions) 方法更新 state；     

  * 由于 vue 自动重新渲染的特性，无需订阅重新渲染函数。

- redux 的 action 中发送过来的对象 必须有一个type属性 reducer 他是一个纯函数  他会跟action发送过来的type类型做逻辑上的处理（使用switch方法进行判断）

- redux 的 Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出，不能调用系统 I/O 的 API 不能调用 Date.now() 或者 Math.random() 等不纯的方法。