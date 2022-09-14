# portal

> Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container)
```

## createPortal 的基本使用

> 弹窗组件蒙层问题：注意关闭弹窗的时候将弹窗节点在生命周期 componentWillUnmount 中删除

```js
// components/Dialog.js
import React, { Component } from 'react'
import {createPortal} from 'react-dom'

export default class Dialog extends Component {
  constructor(props) {
    super(props)
    this.node = document.createElement("div");
    document.body.appendChild(this.node);
  }
  componentWillUnmount() {
    document.body.removeChild(this.node);
  }
  render() {
    return createPortal(
      <div className="dialog">
        <h3>Dialog</h3>
        {this.props.children}
      </div>,
      this.node
    )
  }
}
```

```js
// 弹窗组件的使用
import React, { Component } from 'react'
import Dialog from '../components/Dialog'

export default class DialogDemo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false
    }
  }
  handleDialogToggle = () => {
    this.setState({
      showDialog: !this.state.showDialog
    })
  }
  render() {
    const {showDialog} = this.state
    return (
      <div>
        <button onClick={this.handleDialogToggle}>Dialog-Toggle</button>
        {showDialog && <Dialog>
          <p>this is dialog content</p>
        </Dialog>}
      </div>
    )
  }
}
```