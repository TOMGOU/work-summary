# 微信小程序云开发
- 订阅消息推送
- 数据库操作

### 订阅消息推送

### 数据库操作

##### 1. add(增)

```
const db = wx.cloud.database()
db.collection('history').add({
  data: {
    name: '中国平安',
    price: 186.98
  },
  success: res => {
    // 在返回结果中会包含新创建的记录的 _id
    wx.showToast({
      title: '新增记录成功',
    })
    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
  },
  fail: err => {
    wx.showToast({
      icon: 'none',
      title: '新增记录失败'
    })
    console.error('[数据库] [新增记录] 失败：', err)
  }
})
```

##### 2. remove(删)

```
const db = wx.cloud.database()
db.collection('history').where({name: '五粮液'}).remove({
  success: res => {
    wx.showToast({
      title: '删除成功',
    })
  },
  fail: err => {
    wx.showToast({
      icon: 'none',
      title: '删除失败',
    })
    console.error('[数据库] [删除记录] 失败：', err)
  }
})
```

##### 3. update(改)

```
const db = wx.cloud.database()
db.collection('history').where({name: '中国平安'}).update({
  data: {
    name: '五粮液',
    price: 86.98
  },
  success: res => {
    wx.showToast({
      title: '更新成功',
    })
  },
  fail: err => {
    icon: 'none',
    console.error('[数据库] [更新记录] 失败：', err)
  }
})
```

##### 4. query(查)

```
db.collection('history')
  .where({
    price: _.gt(10) // price大于10
  })
  .field({
    name: true,
    price: true
  }) // 只展示name和price两个字段
  .orderBy('price', 'desc') // 排序
  .skip(5) // 跳过前5条数据
  .limit(10) // 最多返回10条数据
  .get()
```
