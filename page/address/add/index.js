var app = getApp()
var server = require('../../../utils/server');
import WxValidate from '../../../utils/WxValidate'
Page({
    data: {
      mineaddr:0,
    	show: !0,
    	form: {
			name   : '', 
			gender : '1', 
			tel    : '', 
			address: '', 
			is_def : !1, 
        },
        radio: [
            {
            	name: '先生', 
            	value: '1', 
            	checked: !0, 
            },
            {
            	name: '女士', 
            	value: '0', 
            },
        ],
    },
    onLoad(option) {
      this.data.mineaddr = option.mineaddr||0;
      console.log(this.data.mineaddr + '')
      this.WxValidate =new WxValidate({
			name: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			tel: {
				required: true, 
				tel: true, 
			},
			address: {
				required: true, 
				minlength: 2, 
				maxlength: 100, 
			},
		}, {
			name: {
				required: '请输入收货人姓名', 
        minlength:'收货人姓名至少输入2个字符',
			},
			tel: {
				required: '请输入收货人电话', 
			},
			address: {
				required: '请输入收货人地址', 
			},
		})
    },
	radioChange(e) {		 
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const params = e.detail.value
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value === value)
		this.setData({
			radio: radio, 
			'form.gender': value, 
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
    
    server.getJSON('?s=address', { act:'add', arg: params}, function (res) {
      if (res.data.meta != 0) {
        console.log(self.data.mineaddr+'')
        if (self.data.mineaddr){
          wx.navigateTo({
            url: "/page/address/list/index"
          });
        }else{
          wx.navigateTo({
            url: "/page/order/confirm/index?address_id=" + res.data.addrid
          });
        }
      } 
    });
	},
	showToast(message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 1500
    })

    wx.WxService.navigateBack()
	},
	chooseLocation() {
    return;
    wx.chooseAddress({
      success: function (res) {
        console.log(JSON.stringify(res))
      },
      fail: function (err) {
        console.log(JSON.stringify(err))
      }
    })
    wx.chooseLocation().then(data => {
	        console.log(data)
	        this.setData({
	        	'form.address': data.address
	        })
	    })
	},
})