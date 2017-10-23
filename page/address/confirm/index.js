var app = getApp()
var server = require('../../../utils/server');

Page({
    data: {
        hidden: !0,
        address: {
          items: [],
          params: { page: 1, limit: 10},
          paginate: {}
        }
    },
    onLoad(option) {
     //   console.log(option)
        this.setData({
          ret: option.addrid
        })
        this.onPullDownRefresh()
    },
    radioChange(e) {
        console.log('值为：', e.detail.value)
        wx.redirectTo({ url: '/page/order/confirm/index?address_id=' + e.detail.value}); 
    },
    toAddressAdd(e) {
      wx.navigateTo({
        url: "/page/address/add/index"
      });
    },
    getAddressList() {
        const address = this.data.address
        const params = address.params
        this.setData({ 
            hidden: !1
        })
        var self = this;
        server.getJSON('?s=address', { act: 'list', arg: { uid:1} }, function (res) {
          if (res.data.meta ==1) {
            address.items = address.items.concat(res.data.addrlist)
            address.paginate = res.data.paginate
            address.params.page = res.data.paginate.next
            address.params.limit = res.data.paginate.perPage

          //  address.items.forEach((n, i) => n.checked = n._id === this.data.ret)

            self.setData({
              address: address
            })
          }
          self.setData({
            hidden: !0
          })
        });
    },
    onPullDownRefresh() {
        this.getAddressList()
    },
    onReachBottom() {
        this.lower()
    },
    lower() {
        if (!this.data.address.paginate.hasNext) return
        this.getAddressList()
    },
})