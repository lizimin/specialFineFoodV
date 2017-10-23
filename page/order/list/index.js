var app = getApp()
var server = require('../../../utils/server');

Page({
    data: {
        activeIndex: 0,
        navList: [],
        order: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-order-default.png',
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
    },
    onLoad() {
        this.setData({
            navList: [
                {
                    name: '全部',
                    _id: 'all',
                },
                {
                    name: '已提交',
                    _id: 'submitted',
                },
                {
                    name: '已确认',
                    _id: 'confirmed',
                },
                {
                    name: '已完成',
                    _id: 'finished',
                },
                {
                    name: '已取消',
                    _id: 'canceled',
                },
            ]
        })
        this.onPullDownRefresh()
    },
    initData() {
        const order = this.data.order
        const params = order && order.params
        const flag = params && params.flag || 'all'

        this.setData({
            order: {
                items: [],
                params: {
                    page : 1,
                    limit: 10,
                    flag: flag,
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
      wx.redirectTo({ url: '/page/order/detail/index?uorderid=' + e.currentTarget.dataset.id});
    },
    getList() {
        const params = this.data.order.params;
        console.info('sssss',params);
        var self = this; 
        server.getJSON('?s=order', { act: 'list', arg: { uid: 1, params: params}}, function (res) {
          if (res.data.meta == 1) {
            //console.info('bb');
            self.data.order.items = res.data.orderlist
            self.data.order.paginate = res.data.paginate
            self.data.order.params.page = res.data.paginate.next
            self.data.order.params.limit = res.data.paginate.perPage
            //console.info('bb744');
            self.setData({
              order: self.data.order,
              'prompt.hidden': self.data.order.length!=0,
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
        if (!this.data.order.paginate.hasNext) return
        this.getList()
    },
    onTapTag(e) {
      const flag = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({
            activeIndex: index,
            'order.params.flag': flag,
        })
        this.getList()
    },
})