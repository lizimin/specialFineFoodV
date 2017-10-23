var app = getApp();
var server = require('../../../utils/server');
Page({
  data: {
    serverCfg: app.globalData.serverCfg,
    oneItem:null,
    loading: true,
    hasMore: false
  },
  onLoad: function (options) {
    this.data.id = options.id ? options.id : 0;
    this.getDataFromServer()
  },
 
  //获取网络数据的方法
  getDataFromServer: function () {
    this.setData({
      loading: false,
      hasMore: true
    })
    //调用网络请求
    var self = this;
    server.getJSON('?s=message',{act:'one',arg: { id: this.data.id} }, function (res) {
      self.setData({ oneItem: res.data.news });
    })
  },
})
