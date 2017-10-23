var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    serverCfg: app.globalData.serverCfg,
		filterId: 1,
		searchWords: '',
		placeholder: '',
    shopsList:[],
    loading: true,
    hasMore: false,
    page: 1,
    cat:''
	},
  onLoad: function (option) {
    this.data.cat = option.cat ? option.cat:'';
    if (option.catname){
      wx.setNavigationBarTitle({ title: option.catname +'餐厅' })
    }
    
    this.getDataFromServer();
	},
	onShow: function (){},
	inputSearch: function (e) {
		this.setData({
			searchWords: e.detail.value
		});
	},
	doSearch: function() {
    this.setData({page:1 });
    this.getDataFromServer();
	},
	tapFilter: function (e) {
		this.setData({
			filterId: e.target.dataset.id,
      page: 1
		});
    this.getDataFromServer();
	},
  loadMore: function () {
    //console.log("上拉拉加载更多...." + this.data.page)
    this.setData({ page: this.data.page + 1 })
    this.getDataFromServer()
  },
  //获取网络数据的方法
  getDataFromServer: function () {
    this.setData({
      loading: false,
      hasMore: true
    });
    var self = this;
    server.getJSON('?s=shop',{act:'list', arg: {
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        page: this.data.page,
        flag: this.data.filterId,
        searchWords: this.data.searchWords,
        cat: this.data.cat
      }
    }, function (res) {
      self.setData({
        shopsList: self.data.page == 1?res.data.shopsList: self.data.shopsList.concat(res.data.shopsList),
        loading: true,
        hasMore: false
      })
    });
  }

});

