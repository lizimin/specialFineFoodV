var app = getApp();
var server = require('../../utils/server');
Page({
  data: {
    serverCfg: app.globalData.serverCfg,
    filterId: 1,
    address: '定位中…',
    banners: [],
    icons: [],
    shops: []
  },
  onLoad: function () {
    var self = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        server.getJSON('?s=index&adv=1', {
          latitude: app.globalData.latitude,
          longitude: app.globalData.longitude
        }, function (res) {
          self.setData({
            banners: res.data.banners,
            icons: res.data.icons,
            shops: res.data.shops,
            shopsList: res.data.shopsList,
            newscatList: res.data.newscatList,
            address: res.data.address.street
          });
        });
      }
    });
   
  },
  onShow: function () {
  //  console.log(wx.getStorageSync('confirmOrder'))
  },
  onScroll: function (e) {
    if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
  },
  tapSearch: function () {
    wx.navigateTo({ url: 'search' });
  },
  tapFilter: function (e) {
    switch (e.target.dataset.id) {
      case '1':
        this.data.shops.sort(function (a, b) {
          return a.id > b.id;
        });
        break;
      case '2':
        this.data.shops.sort(function (a, b) {
          return a.sales < b.sales;
        });
        break;
      case '3':
        this.data.shops.sort(function (a, b) {
          return a.distance > b.distance;
        });
        break;
    }
    this.setData({
      filterId: e.target.dataset.id,
      shops: this.data.shops
    });
  }
});

