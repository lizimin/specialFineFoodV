var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    serverCfg: app.globalData.serverCfg,
    shop:{},
		goodsList:[],
		cart: {
      shopid:0,
      firstrate:0,
      secondrate:0,
			count: 0,
			total: 0,
      list: []/*num:2,goods:{....},num:2,goods:{....},*/
		},
		showCartDetail: false
	},
	onLoad: function (options) {
    var self = this;
    var shopId = options.id ? options.id : '26';
    var catId = options.cat ? options.cat : '';
   // console.log('000');
    server.getJSON('?s=product', {
      act: 'list',
      arg: { shopid: shopId, catid: catId}
    }, function (res) {
      if (res.data.status != 0) {
        self.setData({
          classifySeleted: res.data.classifySeleted,
          goodsList: res.data.goodsList,
          shop: res.data.shop,
          'cart.firstrate': res.data.shop.firstrate*1,
          'cart.secondrate': res.data.shop.secondrate*1,
          'cart.shopid': res.data.shop.id
        });
        setTimeout(function () {
          self.setData({
            classifyViewed: 'cat' + res.data.classifySeleted
          });
        }, 2000);
      }
    });
	},
	onShow: function () {
    var cart = wx.getStorageSync('confirmOrder');
    if (cart && cart.shopid == this.data.cart.shopid) {
      this.data.cart.list = cart.list;
      this.countCart();
    }
   },
	tapAddCart: function (e) {
		this.addCart(e.target.dataset.id);
	},
	tapReduceCart: function (e) {
		this.reduceCart(e.target.dataset.id);
	},
  getCartOne: function (id) {
    for (var i in this.data.cart.list) {
      var one = this.data.cart.list[i];
      if(one.goods.id==id){
        return one
      }
    }
   return null;
  },
  setCartOne: function (obj,isdetele) {
    for (var i in this.data.cart.list) {
      var one = this.data.cart.list[i];
      if (one.goods.id == obj.goods.id) {
        if (isdetele) {
          this.data.cart.list.splice(i, 1);
        }else{
          this.data.cart.list[i] = obj
        }
        return null;
      }
    }
    this.data.cart.list[this.data.cart.list.length]=obj;
  },
	addCart: function (goods) {
   // console.log('000', goods);
    wx.showToast({
      title: '操作中',
      icon: 'loading',
      duration: 2000
    })
    var one = this.getCartOne(goods.id) || { num: 0, goods: goods };
    one['num']+=1
    this.setCartOne(one);
    wx.showToast({
      title: '操作完毕',
      icon: 'success',
      duration: 1000
    })
		this.countCart();
	},
	reduceCart: function (goods) {
    var one = this.getCartOne(goods.id) || { num: 0, goods: null };
    var num = one.num || 0;
		if (num <= 1) {
      this.setCartOne(one,1);
		} else {
      one.num-=1;
      this.setCartOne(one);
		}
		this.countCart();
	},
	countCart: function () {
		var count = 0,total = 0;
		for (var i in this.data.cart.list) 
    {
      var one = this.data.cart.list[i];
      //console.log(one['goods'].sold+'000', one['goods'].price + one['goods'].sold);
      count += one['num'];
      total += (one['goods'].price*1 + one['goods'].sold*1) * one['num'];
		}
		this.data.cart.count = count;
		this.data.cart.total = total;
		this.setData({
			cart: this.data.cart
		});
    wx.setStorageSync('confirmOrder', this.data.cart);
	},
	follow: function () {
		this.setData({
			followed: !this.data.followed
		});
	},
	onGoodsScroll: function (e) {
		if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}

		var scale = e.detail.scrollWidth / 570,
			scrollTop = e.detail.scrollTop / scale,
			h = 0,
			classifySeleted,
			len = this.data.goodsList.length;
		this.data.goodsList.forEach(function (classify, i) {
     // console.log(classify.id);
			var _h = 70 + classify.goods.length * (46 * 3 + 20 * 2);
			if (scrollTop >= h - 100 / scale) {
				classifySeleted = classify.id;
			}
			h += _h;
		});
   // console.log("classifySeleted");
   // console.log(classifySeleted);
		this.setData({
	//		classifySeleted: classifySeleted
		});
	},
	tapClassify: function (e) {
		var id = e.target.dataset.id;
		this.setData({
      classifyViewed: 'cat' + id
		});
    console.log(this.data.classifyViewed);
		var self = this;
		setTimeout(function () {
			self.setData({
				classifySeleted:id
			});
		}, 100);
	},
	showCartDetail: function () {
		this.setData({
			showCartDetail: !this.data.showCartDetail
		});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},
	submit: function (e) {
    wx.navigateTo({
      url: "/page/order/confirm/index"
    });
    
 //e.detail.formId
  //  server.postJSON('?s=order', {
  //    act: 'make',
  //    arg:null
  //  }, function (res) {
	//		if (res.data.errorcode == 0) {
			//...........
	//		}
      //console.log(res)
	//	});
	}
});

