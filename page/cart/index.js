var app = getApp();
var server = require('../../utils/server');


Page({
    data: {
        canEdit: !1,
        cart: {
          shopid: 0,
          firstrate: 0,
          secondrate: 0,
          count: 0,
          total: 0,
          list: []
        },
        carts: {
            items: []
        },
        prompt: {
            hidden: false,
            icon: '../../imgs/cart/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件商品吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    bindtap: function(e) {
        const index = e.currentTarget.dataset.index
        switch(index) {
            case 0:
            wx.switchTab({
              url: '/page/index/index'
            })
                break
            default:
                break
        }
    },
    onLoad() {},
    onShow() {
      //console.log(wx.getStorageSync('confirmOrder'))
      var cart = wx.getStorageSync('confirmOrder');
      if (cart) {
        this.data.cart = cart;
      }
        this.getCarts('list','')
    },
    getCarts: function (a,b){
      // cart: { count: 0,total: 0, list: [{num:0,goods:{}}] }
       if (a =='del'){
         for (var i in this.data.cart.list) {
          var one = this.data.cart.list[i];
          if (one.goods.id == b.id) {
            this.data.cart.count -= one.num;
            this.data.cart.total -= one.num * (one.goods.price * 1 + one.goods.sold*1);
            this.data.cart.list.splice(i, 1);
          }
        }
      } else if(a == 'set'){
         for (var i in this.data.cart.list) {
           var one = this.data.cart.list[i];
           if (one.goods.id == b.id) {
             this.data.cart.count -= one.num;
             this.data.cart.total -= one.num * (one.goods.price * 1 + one.goods.sold * 1);
              this.data.cart.list[i].num = b.num;
             one.num = b.num;
             this.data.cart.count += one.num;
             this.data.cart.total += one.num * (one.goods.price * 1 + one.goods.sold * 1);
           }
         }
       } else if (a == 'clear') {
          wx.setStorageSync('confirmOrder',null);
          this.data.cart = { count: 0, total: 0, list: [] };
       }
       
       this.setData({
         carts: { items: this.data.cart.list },
         'prompt.hidden': this.data.cart.count!=0,
       })
       wx.setStorageSync('confirmOrder', this.data.cart);
    },
    onPullDownRefresh() {
      this.getCarts('list')
    },
    navigateTo(e) {
      app.WxService.switchTab({
        url: '/page/index/index'
      })
    },
    confirmOrder(e) {
        wx.navigateTo({
          url: '/page/order/confirm/index'
        })
    },
    del(e) {
      var self = this;
        var id = e.currentTarget.dataset.id
        wx.showModal({
          title: '友情提示',
          content: '确定要删除这个商品吗？',
          success: function (res) {
            if (res.confirm) {
              self.getCarts('del', { id: id});
            }
          }
        })
    },
    clear() {
      var self = this;
      wx.showModal({
        title: '友情提示',
        content: '确定要清空购物车吗？',
        success: function (res) {
          if (res.confirm) {
            self.getCarts('clear','');
          }
        }
      })
    },
    onTapEdit(e) {
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        var id = e.currentTarget.dataset.id
        var total = Math.abs(e.detail.value)
        if (total < 0 || total > 100) return
        this.putCartByUser(id, {total: total})
    },
    putCartByUser(id, params) {
      this.getCarts('set', { id: id, num: params.total});
    },
    decrease(e) {
        var id = e.currentTarget.dataset.id
        var total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        this.putCartByUser(id, {
            total: total - 1
        })
    },
    increase(e) {
        var id = e.currentTarget.dataset.id
        var total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        this.putCartByUser(id, {
            total: total + 1
        })
    },
})