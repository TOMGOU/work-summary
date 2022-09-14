# plugin

## 实际应用例子

- `giftPlugin` 过滤器和指令的创建

```js
const giftPlugin = {
  install (Vue, options) {
    Vue.filter('toThousands', (num = 0, prefix = '￥') => {
      num = num.toString();
      let result = '';
      while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
      }
      if (num) { result = num + result; }
      return prefix + result;
    });
    /* 将数字转换为‘万’为单位 */
    Vue.filter('tenThousand', (num = 0, digit = 10000, suffix = '万') => (num / digit).toFixed(2) + suffix);
    /* 文本超出显示省略号 */
    Vue.directive('ellipsis', {
      inserted(el, { value, modifiers }) {
        const text = el.innerHTML;
        text.length > value && (el.innerHTML = `${text.substr(0, value)}...`);
        text.length > value && !modifiers.noTip && el.setAttribute('title', text);
      },
    });
    /* 动态计算容器高度 */
    Vue.directive('calcHeight', {
      componentUpdated(el, { val }) {
        // console.log(el)
        el.style.minHeight = `${document.body.clientHeight - val}px`;
      },
    });
  },
};

export default giftPlugin;
```

- 全局组件 `QRCode` 的创建

```js
/**
 * @name vue封装的二维码生成器插件
 */
import QRCode from './components/QRCode.vue';

const Qr = {
  install(Vue, options) {
    Vue.component('qrcode', QRCode);
  },
};

export default Qr;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Qr);
}
```

- 插件 `WWOpenData` 的创建

```js
/**
 * a plugin for wx jssdk
 * https://mp.weixin.qq.com/wiki/11/74ad127cc054f6b80759c40f77ec03db.html
 */
import Vue from 'vue';

export default class WWOpenData {
  static install() {}
  // 校验微信接口

  constructor(options) {
    this.WWOpenData = window.WWOpenData;

    // merge 方法
    Object.assign(this, options);
    if (this.beforeCreate) {
      this.beforeCreate();
    }

    // 构造函数执行完之后的hook
    if (this.created) {
      this.created();
    }
  }
}


/**
 * vue 组件安装方法
 * @return {[type]}
 */
function install() {
  if (install.installed) return;
  install.installed = true;
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.WWOpenData) {
        this.$WWOpenData = options.WWOpenData;
      } else if (options.parent && options.parent.$WWOpenData) {
        this.$WWOpenData = options.parent.$WWOpenData;
      }
    },
  });
}
WWOpenData.install = install;
WWOpenData.version = '__VERSION__';
```

- 插件 `WWOpenData` 的使用

```js
import Vue from 'vue';
import WWOpenData from '../plugins/WWOpenData';
import config from './config';

Vue.use(WWOpenData);
export default new WWOpenData(config);
```

- 过滤器、全局指令、全局组件、插件的使用

```js
import Vue from 'vue';
import giftPlugin from './plugins/gift-card';
import Qrcode from './plugins/qrcode'; // 二维码生成器
import WWOpenData from './WWOpenData';

Vue.use(Qrcode);
Vue.use(giftPlugin);

new Vue({
  WWOpenData,
  render: h => h(App),
}).$mount('#app');
```
