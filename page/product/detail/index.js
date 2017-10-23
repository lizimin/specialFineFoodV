var app = getApp();
var server = require('../../../utils/server');
var cartObject =require('../../../utils/cart');

Page({
    data: {
      serverCfg: app.globalData.serverCfg,
      id:null,
      cart: {
        shopid: 0,
        firstrate: 0,
        secondrate: 0,
        count: 0,
        total: 0,
        list: []/*num:2,goods:{....},num:2,goods:{....},*/
      },
      goods: {},
      goodsone: {}/*方便加入购物车*/
    },
    onLoad(option) {
    // console.log("-----------" + option.id);
      this.data.id = option.id||93;
      var self=this;
      server.getJSON('?s=product', {
        act: 'detail',
        arg: { id: this.data.id  }
      }, function (res) {
        if (res.data.f){
          wx.showModal({
            title: '提示',
            content: res.data.f,
            showCancel: false
          })
          wx.navigateBack();
        }else{
          self.setData({
            goods: res.data.goods,
            goodsone: res.data.goodsone,
            'cart.firstrate': res.data.goods.firstrate * 1,
            'cart.secondrate': res.data.goods.secondrate * 1,
            'cart.shopid': res.data.goods.member_id
          })
        }
      });
    },
    onShow() {
      var cart = wx.getStorageSync('confirmOrder');
      if (cart && cart.shopid == this.data.cart.shopid) {
        cartObject.setCartAll(cart);
      }else{
        cartObject.shopid = this.data.cart.shopid;
      }
     },
    addCart(e) {
      cartObject.addCart(this.data.goodsone);
      this.showToast("添加完毕")
      wx.setStorageSync('confirmOrder', cartObject.getCartAll());
    },
    previewImage(e) {
      var urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
      var index = e.currentTarget.dataset.index
      var current = urls[Number(index)]

      wx.previewImage({
        current: current,
        urls: urls,
      })
    },
    showToast(message) {
      wx.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    }
})