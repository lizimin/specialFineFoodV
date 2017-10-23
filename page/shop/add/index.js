var app = getApp()
var server = require('../../../utils/server');
import WxValidate from '../../../utils/WxValidate'
Page({
    data: {
      message:"",
    	form: {
			name   : '', 
			tel    : '', 
      desc: '' 
        }
    },
    onLoad(option) {
      var self=this;
      server.getJSON('?s=shop', { act: 'addindex', arg: {} }, function (res) {
        self.setData({ message: res.data.message });
      });
     
      this.WxValidate =new WxValidate({
        uname: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			tel: {
				required: true, 
				tel: true, 
			},
      value: {
				required: true, 
				minlength: 2, 
				maxlength: 100, 
			},
		}, {
			uname: {
				required: '请输入姓名', 
        minlength:'姓名至少输入2个字符',
			},
			tel: {
				required: '请输入电话', 
			},
      value: {
        required: '请输入留言', 
			},
		})
    },

	submitForm(e) {
    var self = this;
		const params = e.detail.value
		//console.log(params)
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
      wx.showModal({
				title: '友情提示', 
					content: ` ${error.msg}`, 
					showCancel: !1, 
			})
			return false
		}
    
    server.getJSON('?s=shop', { act:'add', arg: params}, function (res) {
      wx.showModal({
        title: '入驻提示',
        content: res.data.meta,
        showCancel: false,
        success: function (res) {
          wx.navigateBack();
        }
      })
    });
	}
})