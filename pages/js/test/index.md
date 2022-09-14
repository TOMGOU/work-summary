# 单元测试和端到端测试

## E2E 测试

- 小程序的自动化测试

```js
const automator = require('miniprogram-automator')
const { prepareAuctionData, prepareInquiryData } = require('./data.prepare.js')
const chalk = require('chalk')

jest.setTimeout(200000)
describe('拍卖小程序自动化测试', () => {
  let miniProgram
  let auctionStatusText = ''
  let auctionSessionText = ''
  // 运行测试前调用
  beforeAll(async () => {
    const res = await Promise.all([prepareInquiryData(), prepareAuctionData()])
    if (res[1].code === 0 && res[1].message === 'ok' && res[0].code === 0) {
      console.log(chalk.bold.green('模拟拍卖和询价数据创建成功'))
      miniProgram = await automator.launch({
        // 开发者工具地址
        cliPath: 'C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat',
        // 项目地址
        projectPath: process.cwd(),
      })
    } else {
      console.log(chalk.bold.red('模拟拍卖数据创建失败'))
      throw res
    }
  })

  // 运行测试后调用
  afterAll(() => {
    miniProgram.disconnect()
  })

  // 拍卖大厅场景检测
  describe('拍卖大厅场景检测', () => {
    let auctionPage
    beforeAll(async () => {
      const landingPage = await miniProgram.navigateTo('/pages/login/landing')
      await landingPage.waitFor(3000)
      auctionPage = await miniProgram.currentPage()
    })

    test('状态检测', async () => {
      try {
        const auctionList = await auctionPage.$$('.auction-session-list')
        const auctions = await auctionList[0].$$('navigator')
        const auctionStatus = await auctionPage.$('.auction-session-item__status-text')
        const data = await auctionPage.data()
        auctionStatusText = await auctionStatus.text()
        if (!data.todaySessions.length && !data.futureSessions.length) miniProgram.disconnect()
        if (data.todaySessions.length) expect(data.todaySessions).toBeStatus(auctionStatusText)
        if (!data.todaySessions.length && data.futureSessions.length) expect(data.futureSessions).toBeStatus(auctionStatusText)
        auctionSessionText = await (await auctionPage.$('.auction-session-item__info-title')).text()
        await auctions[0].tap()
        await auctionPage.waitFor(async () => (await miniProgram.currentPage()).path === 'pages/auction/sessiondetail')
      } catch (e) {
        throw e.message
      }
    })
  })

  // 场次详情场景检测
  describe('场次详情场景检测', () => {
    test('场次检测 + 状态检测', async () => {
      try {
        const carPage = await miniProgram.currentPage()
        expect((await miniProgram.currentPage()).path).toBe('pages/auction/sessiondetail')
        await carPage.waitFor('.car-info')
        const carsSession = await carPage.$('.data-wrapper__title')
        const carsStatus = await carPage.$('.session-info__status')
        expect(await carsSession.text()).toBe(auctionSessionText)
        expect(await carsStatus.text()).toBe(auctionStatusText)
        const cars = await carPage.$$('.car-info')
        await cars[0].tap()
        await carPage.waitFor(async () => (await miniProgram.currentPage()).path === 'pages/auction/cardetail')
      } catch (e) {
        throw e.message
      }
    })
  })

  // 车辆详情场景检测
  describe('车辆详情场景检测', () => {
    let carDetailPage
    let data
    beforeAll(async () => {
      carDetailPage = await miniProgram.currentPage()
      data = await carDetailPage.data()
    })

    test('轮播图片检测', async () => {
      try {
        expect(carDetailPage.path).toBe('pages/auction/cardetail')
        await carDetailPage.waitFor('swiper')
        const swiperImg = await carDetailPage.$$('swiper .swiper-group__image')
        const pageData = await carDetailPage.data()
        // 如果有视频，滑动图片总数等于 图片数 + 视频数
        const swiperImgCount = pageData.videoUrl ? pageData.swiperImages.length + 1 : pageData.swiperImages.length
        expect(swiperImg.length).toBe(swiperImgCount)
      } catch (e) {
        throw e.message
      }
    })

    test('关注检测', async () => {
      try {
        await carDetailPage.waitFor('.follow-or-like__submit-btn')
        const like = await carDetailPage.$('.follow-or-like__submit-btn')
        await like.tap()
      } catch (e) {
        throw e.message
      }
    })

    test('正常出价检测', async () => {
      try {
        await carDetailPage.waitFor('.quote-entry__action')
        const quote = await carDetailPage.$('.quote-entry__action')
        await quote.tap()
        await carDetailPage.waitFor('.quote-model__auction-input')
        await carDetailPage.waitFor('.plus-icon')
        const plus = await carDetailPage.$('.plus-icon')
        await plus.tap()
        const input = await carDetailPage.$('.quote-model__auction-input')
        const price = +(await input.value())
        await carDetailPage.waitFor('.quote-model__confirm-btn')
        const confirm = await carDetailPage.$('.quote-model__confirm-btn')
        await confirm.tap()

        // 微信小程序针对 嵌套了子自定义组件 会往 嵌套子组件的 class 加入 前缀，比如 index--
        // 所以应该先 获取 子组件xml 然后提取 前缀
        const iModal = await carDetailPage.$('i-modal')
        const iModalXml = await iModal.wxml()
        const matchSelector = iModalXml.match(/<view\s+class="([a-z]+)--i-modal.+">/)
        const prefix = matchSelector[1] || 'index'

        // 得到前缀，重新转换成完整的 class 选择器
        const modalOkBtnSelector = `.${prefix}--i-modal-btn-ok`

        await carDetailPage.waitFor(modalOkBtnSelector)
        const modalOkBtn = await carDetailPage.$(modalOkBtnSelector)
        await modalOkBtn.tap()

        await carDetailPage.waitFor(500)
        const currentPriceText = await (await carDetailPage.$('.auction-info-price')).text()
        const currentPrice = +currentPriceText.substring(0, currentPriceText.length - 1)
        expect(await currentPrice).toBe(price)
      } catch (e) {
        throw e.message
      }
    })

    test('未过保留价检测', async () => {
      try {
        await carDetailPage.waitFor('.auction-info-over-reserver')
        const auctionPrice = await carDetailPage.$('.auction-info-over-reserver')
        expect(await auctionPrice.text()).toBe('未过保留价')
      } catch (e) {
        throw e.message
      }
    })

    test('自定义出价检测', async () => {
      try {
        const price = 15.01
        await carDetailPage.callMethod('handleSubmitPrice', data.auctionId, 'formid', price)

        // 微信小程序针对 嵌套了子自定义组件 会往 嵌套子组件的 class 加入 前缀，比如 index--
        // 所以应该先 获取 子组件xml 然后提取 前缀
        const iModal = await carDetailPage.$('i-modal')
        const iModalXml = await iModal.wxml()
        const matchSelector = iModalXml.match(/<view\s+class="([a-z]+)--i-modal.+">/)
        const prefix = matchSelector[1] || 'index'

        // 得到前缀，重新转换成完整的 class 选择器
        const modalOkBtnSelector = `.${prefix}--i-modal-btn-ok`

        await carDetailPage.waitFor(modalOkBtnSelector)
        const modalOkBtn = await carDetailPage.$(modalOkBtnSelector)
        await modalOkBtn.tap()

        await carDetailPage.waitFor(500)
        const currentPriceText = await (await carDetailPage.$('.auction-info-price')).text()
        const currentPrice = +currentPriceText.substring(0, currentPriceText.length - 1)
        expect(await currentPrice).toBe(price)
      } catch (e) {
        throw e.message
      }
    })

    test('已过保留价检测', async () => {
      try {
        await carDetailPage.waitFor('.auction-info-over-reserver--over')
        const auctionPrice = await carDetailPage.$('.auction-info-over-reserver--over')
        expect(await auctionPrice.text()).toBe('已过保留价')
      } catch (e) {
        throw e.message
      }
    })

    test('拍卖结果检测', async () => {
      try {
        await carDetailPage.waitFor('.finish-info__content')
        const auctionResult = await carDetailPage.$('.status-bar__label')
        expect(await auctionResult.text()).toBe('已中标')
        const home = await carDetailPage.$$('.icon-outter')
        await home[1].tap()
        await carDetailPage.waitFor(2000)
        await miniProgram.switchTab('quote/index')
        await carDetailPage.waitFor(async () => (await miniProgram.currentPage()).path === 'pages/quote/index')
      } catch (e) {
        throw e.message
      }
    })
  })

  // 报价场景检测
  describe('报价场景检测', () => {
    test('报价结果检测', async () => {
      try {
        expect((await miniProgram.currentPage()).path).toBe('pages/quote/index')
        const quotePage = await miniProgram.currentPage()
        await quotePage.waitFor('.car-info')
        const quoteList = await quotePage.$$('.car-info')
        await quoteList[0].tap()
        await quotePage.waitFor(async () => (await miniProgram.currentPage()).path === 'pages/quote/quotedetail')
        const quoteDetailPage = await miniProgram.currentPage()
        const quoteButton = await quoteDetailPage.$('.quote-entry__action')
        await quoteButton.tap()
        await miniProgram.mockWxMethod('showModal', {
          confirm: true,
          cancel: false
        })
        const price = 15.00
        await quoteDetailPage.callMethod('submitQuote', price, 'formid', price)
        await miniProgram.restoreWxMethod('showModal')
        await quoteDetailPage.waitFor('.font-w')
        const quotePriceText = (await quoteDetailPage.data()).confirmQuotePrice
        const quotePrice = +quotePriceText.substring(0, quotePriceText.length - 1)
        expect(quotePrice).toBe(price)
      } catch (e) {
        throw e.message
      }
    })
  })
})

expect.extend({
  toBeStatus(received, argument) {
    const status = {
      1: '待开拍',
      2: '竞拍中'
    }
    const pass = received.length ? argument === status[received[0].status] : argument === undefined
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be divisible by ${argument}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be divisible by ${argument}`,
        pass: false
      }
    }
  }
})

```

- data.prepare.js

```js
const axios = require('axios')
const qs = require('qs')

// 测试环境
// const mockAccount = process.env.mockAccount.split('-')
const auctionCreateurl = 'https://boss.test.dos.cheanjia.net/api/v1/auction_mock/create_auction_directly'
const loginUrl = 'https://q.test.dos.cheanjia.net/auth/wxlogin'
const auctionUrl = 'https://q.test.dos.cheanjia.net/api/v1/auctions/auction_cars'

const formatDate = () => {
  const startedAt = new Date(Date.now() + 10000)
  const year = startedAt.getFullYear()
  const month = startedAt.getMonth() + 1
  const day = startedAt.getDate()
  const hour = startedAt.getHours()
  const minute = startedAt.getMinutes()
  const second = startedAt.getSeconds()
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const prepareAuctionData = async () => {
  // 设置request headers
  axios.interceptors.request.use(
    config => {
      // config.headers.common['Auction-Mock-Non-Scan-Key'] = process.env.noScanValue
      config.headers.common['Auction-Mock-Non-Scan-Key'] = 'd4310fa09cbadfc2a913cf4f9b44e731'
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )

  // 模拟创建拍卖请求
  const formData = {
    'store_id': 199,
    'number': 2,
    'started_at': formatDate(),
    'tmpl_id': 32
  }
  const res = await axios.post(auctionCreateurl, qs.stringify(formData))
  return res.data
}

// 模拟创建询价请求
const prepareInquiryData = async () => {
  const loginData = {
    username: '13800000000',
    password: '123456'
  }
  // const loginData = {
  //   username: mockAccount[0],
  //   password: mockAccount[1]
  // }
  const loginRes = await axios.post(loginUrl, loginData)
  const csrfToken = loginRes.headers['set-cookie'][0].split(';')[0]
  const session = loginRes.headers['set-cookie'][1].split(';')[0]
  axios.interceptors.request.use(
    config => {
      config.headers.Cookie = `${csrfToken};${session}`
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )
  const auctionRes = await axios.get(auctionUrl)
  const auctionData = auctionRes.data.data['auction_cars']
  const quoteData = auctionData.find(item => item.enquirying === false)
  const quoteUrl = `https://q.test.dos.cheanjia.net/api/v1/auctions/submit_auction_car_enquiry/${quoteData.auction_car_id}`
  const formData = {
    period_type: 7,
    config_id: 89,
    deal_date: '2019-10-31'
  }
  const xCsrfToken = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1]
  axios.interceptors.request.use(
    config => {
      config.headers.common['X-CSRF-Token'] = xCsrfToken
      return config
    },
    err => {
      return Promise.reject(err)
    }
  )
  const auoteRes = await axios.put(quoteUrl, qs.stringify(formData))
  return auoteRes.data
}

module.exports = { prepareAuctionData, prepareInquiryData }

```