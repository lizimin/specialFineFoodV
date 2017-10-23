var app = getApp()
var server = require('../../../utils/server');

Page({
    data: {
        id:0,
        order: {},
        prolist:[],
        payalter: 0,
        hidepaybut:true
    },
    onLoad(option) {
      this.data.id = option.uorderid;
      this.getOrderDetail();
      if (option.payalter==1){
        this.doPay();
      }
    },
    onShow() {},
    getOrderDetail() {
      var self = this;
      server.getJSON('?s=order', { act: 'detail', arg: { uorderid: self.data.id}}, function (res) {
        if (res.data.meta ==1) {
          self.setData({
            order: res.data.order,
            prolist: res.data.prolist
          })
          if (res.data.order.status==1){
            self.setData({ hidepaybut:false});
          }
        }
      });
    },
  doPay() {
    var self = this;
    server.getJSON('?s=pay', { act: 'pay', arg: { uorderid: self.data.id } }, function (res) {
      if (res.data.f){
        wx.showModal({
          title: '提示',
          content: res.data.f,
          showCancel: false
        });
      }else{
        console.log(res.data.para)
        wx.requestPayment({
          'timeStamp': res.data.para.timeStamp,
          'nonceStr': res.data.para.nonceStr,
          'package': res.data.para.package,
          'signType': 'MD5',
          'paySign': res.data.para.paySign,
          'success': function (res) {
            self.doPayover();
          },
          'fail': function (res) {
            //console.log('fail:' + JSON.stringify(res));
          }
        })

      }
      
    });
  },
  doPayover(){
    var self = this;
    server.getJSON('?s=pay', { act: 'payover', arg: { uorderid: self.data.id } }, function (res) {
      if (res.data.f) {
        wx.showModal({
          title: '提示',
          content: res.data.f,
          showCancel: false
        });
      } else {
        self.data.order['statusName']='支付完毕,正在配送中';
        self.setData({ hidepaybut: true, order: self.data.order });
      }
    });
  }
})