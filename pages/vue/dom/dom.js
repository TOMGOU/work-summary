const vnode = {
  tag: 'div',
  props: {
    id: 'app',
    className: 'container'
  },
  children: [
    {
      tag: 'p',
      props: {
        id: 'text1',
        className: 'text'
      },
      children: ['123']
    },
    {
      tag: 'p',
      props: {
        id: 'text2',
        className: 'text'
      },
      children: ['456']
    }
  ]
}

const render = (vnode) => {
  if (typeof vnode === 'number') {
    return String(vnode)
  }
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  const element = document.createElement(vnode.tag)

  if (vnode.props) {
    Object.keys(vnode.props).forEach(key => {
      if (key === 'className') {
        element.setAttribute('class', vnode.props[key])
      } else {
        element.setAttribute(key, vnode.props[key])
      }
    })
  }

  if (vnode.children) {
    vnode.children.forEach(childNode => {
      element.appendChild(render(childNode))
    })
  }

  return element
}

console.log(render(vnode))