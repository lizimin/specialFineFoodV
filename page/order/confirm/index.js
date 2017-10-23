var app = getApp()
var server = require('../../../utils/server');
Page({
    data: {
        hidden: !0,
        carts: {},
        address_id:null,
        address: {item: {}},
        des:''
    },
    onLoad(option) {
      this.data.address_id= option.address_id;
        var cart = wx.getStorageSync('confirmOrder');
       // cart: { count: 0,total: 0, list: [{num:0,goods:{}}] }
        var carts = {
           items: cart.list,
            totalAmount: cart.total, 
            firstrate: cart.firstrate,
            secondrate: cart.secondrate
        }

      //  carts.items.forEach(n => carts.totalAmount+=n.totalAmount)
        this.setData({
            carts: carts
        })

       // console.log(this.data.carts)
    },
    onShow() {
        var address_id = this.data.address_id;
        //console.log(address_id+'===')
        if (address_id) {
            this.getAddressDetail(address_id)
        } else {
            this.getDefalutAddress()
        }
    },
    desInputEvent:function(e){
    	this.data.des=e.detail.value;
 	},
    addressChoose(e) {
      wx.redirectTo({ url: '/page/address/confirm/index?addrid=' + this.data.address_id});       
    },
    getDefalutAddress() {
      var self = this;
      server.getJSON('?s=address', { act: 'default', arg:{uid:1}}, function (res) {
        if (res.data.meta ==1) {
          self.setData({
            address_id: res.data.addr.id,
            'address.item': res.data.addr,
          })
        }else{
          wx.showModal({
            title: '友情提示',
            content: '没有收货地址，请先设置',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({url:'/page/address/add/index'})
              }else{
                wx.navigateBack()
              }
            }
          })
        }
      });
    },
    getAddressDetail(id) {
      var self = this;
      server.getJSON('?s=address', { act: 'detail', arg: { uid: 1, addrid:id } }, function (res) {
        if (res.data.meta == 1) {
          self.setData({
            'address.item': res.data.addr
           })
        }
      });
    },
    addOrder() {
        var params = {
          firstrate: this.data.carts.firstrate,
          secondrate: this.data.carts.secondrate,
          items: this.data.carts.items, 
          address_id: this.data.address_id,
          des:this.data.des
        }
        var self = this;
        server.postJSON('?s=order&act=make', { arg: params }, function (res){
          if (res.data.meta == 1) {
            self.clear();
            wx.showModal({
              title: '恭喜您,订单已提交',
              content: '支付成功后,我们会第一时间为您配送',
              showCancel: false,
              success: function () {
                  wx.redirectTo({ url: '/page/order/detail/index?payalter=1&uorderid=' + res.data.uorderid })
              }
            })
          }
        });    
    },
    clear() {
      wx.setStorageSync('confirmOrder', null);
    },
})