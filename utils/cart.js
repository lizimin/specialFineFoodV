
  module.exports = {
    shopid: 0,
    firstrate: 0,
    secondrate: 0,
    count:0,
    total:0,
    list:[],
  getCartAll:function () { 
    return { count: this.count, total: this.total, list: this.list, firstrate: this.firstrate, secondrate: this.secondrate, shopid: this.shopid}
    },
   setCartAll:function (obj) { 
     this.count = obj.count; this.total = obj.total; this.list = obj.list;
     this.firstrate = obj.firstrate; this.secondrate = obj.secondrate; this.shopid = obj.shopid;
     },
  getCartOne:function (id) {
      for (var i in this.list) {
        var one = this.list[i];
        if (one.goods.id == id) {
          return one
        }
      }
      return null;
    },
  setCartOne:function (obj, isdetele) {
    console.log(this)
    for (var i in this.list) {
      var one = this.list[i];
      if (one.goods.id == obj.goods.id) {
        if (isdetele) {
          this.list.splice(i, 1);
        } else {
          this.list[i] = obj
        }
        return null;
      }
    }
    this.list[this.list.length] = obj;
  },
  addCart:function (goods) {
    var one = this.getCartOne(goods.id) || { num: 0, goods: goods };
    one['num'] += 1
    this.setCartOne(one);
    this.countCart();
  },
  countCart:function () {
    var count = 0, total = 0;
    for (var i in this.list) {
      var one = this.list[i];
      //console.log('000', this.data.cart.list);
      count += one['num'];
      total += (one['goods'].price * 1 + one['goods'].sold * 1) * one['num'];
    }
    this.count = count;
    this.total = total;
   // wx.setStorageSync('confirmOrder', this.data.cart);
  },
  reduceCart: function (goods) {
    var one = this.getCartOne(goods.id) || { num: 0, goods: null };
    var num = one.num || 0;
    if (num <= 1) {
      this.setCartOne(one, 1);
    } else {
      one.num -= 1;
      this.setCartOne(one);
    }
    this.countCart();
  }
}


