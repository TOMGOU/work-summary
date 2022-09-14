# Suspense

>React.Suspense 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。

## 基本用法

```js
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './index.css';

const routes = [
  {
    path: "/",
    title: "首页",
    props: {exact: true},
    component: lazy(() => import('./pages/Home'))
  },
  {
    path: "/about",
    title: "关于",
    component: lazy(() => import('./pages/About'))
  },
  {
    path: "/detail/:id",
    title: "详情",
    component: lazy(() => import('./pages/Detail'))
  },
  {
    path: "/memo",
    title: "记忆",
    component: lazy(() => import('./pages/Memo'))
  },
  {
    path: "/dialog",
    title: "弹窗",
    component: lazy(() => import('./pages/DialogDemo'))
  }
];

ReactDOM.render(
  <Router>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/detail/1">Detail</Link>
      <Link to="/memo">Memo</Link>
      <Link to="/dialog">Dialog</Link>
    </nav>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {routes.map(item => {
          return (
            <Route
              {...item.props}
              path={item.path}
              key={item.path}
              component={item.component}
            />
          )
        })}
      </Switch>
    </Suspense>
  </Router>,
  document.getElementById('root')
);
```

## 实现原理