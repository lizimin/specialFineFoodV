//index.js
//获取应用实例
const app = getApp(); 
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'ACWBZ-XGQKO-SRPWW-SHFCA-XIYGS-NHBQK'
});

Page({
  data: {
    imgUrls: [
      '/imgs/circle_1.jpg',
      '/imgs/circle_2.jpg',
      '/imgs/circle_3.jpg'
    ],
    shopAddress:"云南省昆明火车站",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    shoplng:'',//商家地址
    shoplat:'',
    personlng:'',
    personlat:'',
  },
  //点击跳转到相应的店铺点餐页面
  jump:function(){
    wx.navigateTo({
      url: '/pages/order/index/index',
    })
  },
  onLoad: function () {
    var that=this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        that.setData({
          personlng: res.longitude,
          personlat: res.longitude,
        })
      }
    })
    
    //地址解析，把地址解析成经纬度
    qqmapsdk.geocoder({
      address: that.data.shopAddress,
      success: function (res) {
        console.log("昆明站");
       console.log(res.result.location);
        that.setData({
          shoplng: res.result.location.lng,
          shoplat: res.result.location.lat,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  //计算距离
    qqmapsdk.calculateDistance({
      to: [
        {
          latitude: that.data.shoplat,
          longitude: that.data.shoplng
        }
      ],
      success: function (res) {
        console.log("success");
        console.log(res);
      },
      fail: function (res) {
        console.log("fali");
        console.log(res);
      },
    });
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
