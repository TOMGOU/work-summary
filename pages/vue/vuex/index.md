# vue3.x + vuex4.x

## 基本概念

#### State

- Vuex 使用单一状态树，整个应用仅仅包含一个 store 实例。

- 辅助函数：mapState + createNamespacedHelpers

```js
import { mapState, mapGetters } from 'vuex';

computed: {
  ...mapGetters('socket', [
    'getOrderMsg',
  ]),
  ...mapState('socket', [
    'enterNotification',
  ]),
}

/**
 * or
 */

import { createNamespacedHelpers } from 'vuex';

const { mapState, mapGetters } = createNamespacedHelpers('socket');

computed: {
  ...mapGetters([
    'getOrderMsg',
  ]),
  ...mapState([
    'enterNotification',
  ]),
}
```

#### Getter

- Getter 不仅可以访问 state 数据，还能在访问的时候，对 state 进行处理。

```js
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

- 在组件中可以直接通过 store.getters 访问state，也可以通过辅助函数：mapGetters。

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

#### Mutation

- Mutation 必须是一个纯函数，不纯的放到 Action 中。Mutation 的参数：1. { commit }, 2. payload

```js
const actions = {
  fetchCleaningDataTaskItem({ commit }, payload) {
    const {
      taskId,
      status,
      ...queryForm
    } = payload;
    return rest.insurance.fetchCleaningDataTaskItem(taskId, status)(queryForm).then((res) => {
      commit(MutationsType.UPDATE_CLEANING_DATA_TASK_ITEM, res.data.bulk_renewal_items);
      commit(MutationsType.UPDATE_CLEANING_DATA_TASK_ITEM_TOTAL_COUNT, res.data.total_count);
      return res;
    });
  },
};
```

- Mutation 通过 store.commit 方法触发。

- 在组件中可以使用 this.$store.commit('xxx') 提交 mutation，也可以使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用。

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

#### Action

- Action 的参数：1. state; 2. data

```js
const mutations = {
  [MutationsType.UPDATE_CLEANING_DATA_TASK_LIST] (state, data) {
    state.cleaningDataTaskList = data;
  },
};
```

- Action 通过 store.dispatch 方法触发。

- 在组件中可以使用 this.$store.dispatch('xxx') 分发 action，也可以使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用。

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}

```

#### Module

```js
const moduleA = {
  namespaced: true,
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  namespaced: true,
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  // 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

- 模块动态注册: https://vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E5%8A%A8%E6%80%81%E6%B3%A8%E5%86%8C

```js
import { createStore } from 'vuex'

const store = createStore({ /* 选项 */ })

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})

// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

## 基本用法

##### step-1: 利用 createStore 创建 store 数据

```js
import { createStore } from 'vuex'
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state, num) {
      state.count += num
    },
    decrement (state, num) {
      state.count -= num
    }
  }
})

export default store
```

##### step-2: 全局安装 store

```js
import {createApp} from 'vue'
import App from './App.vue'
import store from './vuex/store'

createApp(App).use(store).mount('#app')
```

##### step-3: useStore 操作数据

```html
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{count}}</p>
    <button @click="handleAdd">add</button>
    <button @click="handleMinus">minus</button>
    <button @click="handleAsyncAdd">asyAdd</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const store = useStore();
    let count = computed(() => store.state.count); // 这里注意指定user模块
    return {
      count,
      handleAdd: () => store.commit('increment', 2),
      handleMinus: () => store.commit('decrement', 3),
      handleAsyncAdd: () => {
        setTimeout(() => {
          store.commit('increment', 4)
        })
      },
    }
  }
}
</script>
```

## vuex 的好处

- 能够在 Vuex 中集中管理共享的数据，易于开发和后期维护

- 能够高效的实现组件之间的数据共享，提高开发效率

- 存储在 Vuex 中的数据都是响应式的，能够实时保持数据与页面的同步

## 什么样的数据适合存储到 Vuex 中

- 多个视图依赖于同一个状态：例如多组件之间数据共享，在不同页面都可以拿到用户信息

- 来自不同视图的行为需要改变同一个状态：比如用户会员信息，在不同页面可以更改