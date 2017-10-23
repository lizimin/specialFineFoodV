var app = getApp()
var server = require('../../../utils/server');
Page({
    data: {
        address: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-addr-empty.png',
            title: '还没有收货地址呢',
            text: '暂时没有相关数据',
        },
    },
    onLoad() {
        this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            address: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                },
                paginate: {}
            }
        })
    },
    toAddressEdit(e) {
      wx.navigateTo({
        url: "/page/address/edit/index?id=" + e.currentTarget.dataset.id
      });
    },
    toAddressAdd(e) {
      wx.navigateTo({
        url: "/page/address/add/index?mineaddr=1"
      });
    },
    setDefalutAddress(e) {
        const id = e.currentTarget.dataset.id
        App.HttpService.setDefalutAddress(id)
        .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
                this.onPullDownRefresh()
            }
        })
    },
    getList() {
      const address = this.data.address
      const params = address.params
      var self = this;
      server.getJSON('?s=address', { act: 'list', arg: { uid: 1 } }, function (res) {
        if (res.data.meta == 1) {
          address.items = address.items.concat(res.data.addrlist)
          address.paginate = res.data.paginate
          address.params.page = res.data.paginate.next
          address.params.limit = res.data.paginate.perPage
          
          self.setData({
            address: address,
            'prompt.hidden': address.items.length != 0,
          })
        }
      });
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.address.paginate.hasNext) return
        this.getList()
    },
})