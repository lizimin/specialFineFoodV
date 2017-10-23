function __args() {
	var setting = {};
	if (arguments.length === 1 && typeof arguments[0] !== 'string') {
		setting = arguments[0];
	} else {
		setting.url = arguments[0];
		if (typeof arguments[1] === 'object') {
			setting.data = arguments[1];
			//setting.success = arguments[2];
      var fun = arguments[2];
      setting.success = function (res) { 
        console.log("u-" + setting.url, res);
        fun(res);}
		} else {
			setting.success = arguments[1];
		}
    setting.fail = function (res) { 
      console.log("fail-" + setting.url, res);}
	}
	if (setting.url.indexOf('http://')==-1) {
    //http://127.0.0.1:82
    //http://172.16.1.3:96
    //https://xcwm.xiaodu880.com
    setting.url = 'https://xcwm.xiaodu880.com/wxapplet.php' + setting.url;
	}
	return setting;
}
function __json(method, setting) {
	setting.method = method;
  if (method =='form'){
    setting.header = {
      'content-type': 'application/x-www-form-urlencoded'
    };
  }else{
    setting.header = {
      'content-type': 'application/json',
      'Cookie': 'USER=' + wx.getStorageSync('uid')
    };
  }
	wx.request(setting);
}

module.exports = {
	getJSON: function () {
		__json('GET', __args.apply(this, arguments));
	},
	postJSON: function () {
		__json('POST', __args.apply(this, arguments));
  },
  formJSON: function () {
    __json('form', __args.apply(this, arguments));
  },
	sendTemplate: function(formId, templateData,surl, success, fail) {
		var app = getApp();
    this.formJSON({
      url: surl,
			data: {
				rd_session: app.rd_session,
				form_id: formId,
				data: templateData,
			},
			success: success,   // errorcode==0时发送成功
			fail: fail
		});
	}
}
