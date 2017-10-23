var app = getApp();
var server = require('../../../utils/server');
Page({
    data: {
      serverCfg: app.globalData.serverCfg,
        caiItems: [],
        loading: true,
        hasMore: false,
        page: 1
    },
    onLoad: function (options) {
      this.data.pid = options.pid ? options.pid :0;
        this.getDataFromServer()
    },
    refresh: function () {
        //console.log("下拉刷新....")
        this.onLoad()
    },
    loadMore: function () {
        this.setData({ page: this.data.page + 1 })
        //console.log("上拉拉加载更多...." + this.data.page)
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
        server.getJSON('?s=message', { act: 'clslist', arg: { pid: this.data.pid, page: this.data.page } }, function (res) {
          if (self.data.page==1){
            self.setData({ banners: res.data.banners});
          }
          self.setData({
            caiItems: self.data.caiItems.concat(res.data.mesList),                 loading: true, 
             hasMore: false
          })
    })
    },
    //点击 跳转到具体页面
    onItemClick: function (event) {
      var targetUrl = "../detail/index?id=" + event.currentTarget.dataset.detailHrefId;
        wx.navigateTo({
            url: targetUrl
        });
    },
})
