# 小程序滚动穿透问题

## page-meta 组件

> 页面属性配置节点，用于指定页面的一些属性、监听页面事件。只能是页面内的第一个节点。

> https://developers.weixin.qq.com/miniprogram/dev/component/page-meta.html

## uni-app 代码示例

> isShowStoreShare 是控制弹窗显示隐藏的变量

> page-meta 设置 page 样式：overflow: hidden

```html
<template>
  <page-meta :page-style="`overflow: ${isShowStoreShare ? 'hidden' : 'visible'}`">
    <section :class="['manage-car', { 'manage-car--over-flow-hide': isSearchModelShow, 'manage-car--no-auth': !hasManageAuth }]">
      <navigate title="卖车" :showMenu="false" />
      <section class="manage-car__search-bar" v-if="hasManageAuth">
        <car-search-input
          placeholder="输入车牌号或车系"
          :result-list="searchResultList"
          :maxlength="10"
          :fuzzy="fuzzy"
          :top-diff="topDiff"
          :value.sync="searchValue"
          :is-loading="isSearchLoading"
          :is-load-all="!hasMoreData"
          :isMaskShow.sync="isSearchModelShow"
          @input="handleSearchInput"
          @confirm="handleSearchConfirm"
          @cancel="handleCancel"
          @load-more="handleLoadMore"
          @result-select="handleResultClick"
          @model-select="handleModelSelect">
        </car-search-input>
      </section>

      <new-add
        text="新增车辆"
        :hasAuth="hasAddCarAuth"
        @handleLink="handleLink"
      ></new-add>

      <section class="manage-car__button-groups" v-if="hasManageAuth">
        <all-cars
          :currentAuctionCarCount="currentAuctionCarCount"
          :otherAuctionCarCoount="otherAuctionCarCoount"
          :hasAllCarAuth="hasAllCarAuth"
        />
        <div
          v-for="group in buttonList"
          :key="group.title">
          <button-group
            icon-size="big"
            :title="group.title"
            :button-list="group.items"
            @image-click="handleNavigate"
          />
        </div>
      </section>

      <store-share
        :visible="isShowStoreShare"
        :store-name="storeInfos.storeName"
        :address="storeInfos.fullAddress"
        :concat-number="storeInfos.contactNumber"
        :logo="storeInfos.logoLocalPath"
        :qr-code="storeInfos.QRCodeLocalPath"
        @close="handleClose"
      ></store-share>
    </section>
  </page-meta>
</template>
```