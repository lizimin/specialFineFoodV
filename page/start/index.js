var app = getApp();
var server = require('../../utils/server');


Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !1,
    },
    onLoad() {},
    onShow() {},
    bindload(e) { setTimeout(this.goIndex , 2000) },
    goIndex() {
      wx.switchTab({
        url: '/page/index/index'
        })
    },
    
})
///page/product/detail/index?id=144
///page/index/index
