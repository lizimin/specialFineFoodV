var server = require('./utils/server');
App({
	onLaunch: function () {
	//	console.log('App Launch')
		var self = this;
    self.login();return;
  self.globalData.uid = wx.getStorageSync('uid');
	//	console.log('rd_session', rd_session)
    if (!self.globalData.uid) {
			self.login();
		} else {
			wx.checkSession({
				success: function () {
          console.log('登录态未过期' + self.globalData.uid)
				},
				fail: function () {
					self.login();
				}
			})
		}
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
	//	console.log('App Hide')
  //http://172.16.1.3:96
  //https://xcwm.xiaodu880.com
	},
	globalData: {
    serverCfg: { url: 'https://xcwm.xiaodu880.com'} ,
		hasLogin: false,
    uid:null
	},
	login: function() {
		var self = this;
		wx.login({
			success: function (res) {
		//		console.log('wx.login', res);
        wx.getUserInfo({
          success: function (ures) {
       //     console.log('getUserInfo', ures)
            self.globalData.userInfo = ures.userInfo;
            server.getJSON('?s=member', { act: 'login', arg: { code: res.code, userInfo: ures.userInfo}}, function (ret) {
          //    console.log('setUserSessionKey', ret)
              	self.globalData.hasLogin = true;
                wx.setStorageSync('uid', ret.data.uid);
            });
          }
        });
			}
		});
	}
})
