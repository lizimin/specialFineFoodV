var app = getApp()
var server = require('../../../utils/server');
import WxValidate from '../../../utils/WxValidate'

Page({
    data: {
    	show: !0,
        form: {
			name   : '', 
			gender : '0', 
			tel    : '', 
			address: '', 
			is_def : !1, 
        },
        radio: [
            {
            	name: '先生', 
            	value: 1 
            },
            {
            	name: '女士', 
            	value: 0 
            },
        ],
    },
    onLoad(option) {
      this.WxValidate = new WxValidate({
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
			},
			tel: {
				required: '请输入收货人电话', 
			},
			address: {
				required: '请输入收货人地址', 
			},
		})

    	this.setData({
    		id: option.id
    	})
    },
    onShow() {
    	this.renderForm(this.data.id)
    },
    renderForm(id) {
      var self = this;
      server.getJSON('?s=address', { act: 'detail', arg: { uid: 1, addrid:id } }, function (res) {
        if (res.data.meta == 1) {
          self.setData({
            form: res.data.addr
          })
        } 
      });		
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
		const params = e.detail.value
		const id = this.data.id

		console.log(params)

		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
      wx.showModal({
				title: '友情提示', 
					content: `${error.param} : ${error.msg}`, 
					showCancel: !1, 
			})
			return false
		}

    params['userid'] = '1';
    params['id'] = this.data.id;
    server.getJSON('?s=address', { act: 'update', arg: params }, function (res) {
      if (res.data.meta != 0) {
          wx.navigateTo({
            url: "/page/address/list/index"
          });
      }
    });
	
	},
	delete() {

    server.getJSON('?s=address', { act: 'delete', arg: { uid: 1, addrid: this.data.id} }, function (res) {
      if (res.data.meta != 0) {
        wx.navigateTo({
          url: "/page/address/list/index"
        });
      }
    });
	},
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
		})
		.then(() => App.WxService.navigateBack())
	},
	chooseLocation() {
		App.WxService.chooseLocation()
	    .then(data => {
	        console.log(data)
	        this.setData({
	        	'form.address': data.address
	        })
	    })
	},
})