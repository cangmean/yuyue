//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    let self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code;
        wx.request({
          url: self.globalData.site + 'wxlogin',
          data: { code: code},
          success: resp => {
            self.globalData.openid = resp.data.openid;
            self._login();
            if (self.getOpenidCallback){
              self.getOpenidCallback(resp);
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: '',
    site: '',
  },
  _login() {
    let self = this;
    if (self.globalData.userInfo){
      wx.request({
        url: self.globalData.site + 'wx/users',
        method: 'POST',
        data: {
          openid: self.globalData.openid,
          nickName: self.globalData.userInfo.nickName,
          avatarUrl: self.globalData.userInfo.avatarUrl,
          gender: self.globalData.userInfo.gender,
          country: self.globalData.userInfo.country,
          province: self.globalData.userInfo.province,
          city: self.globalData.userInfo.city,
        },
        success: resp => {
          console.log(resp.data.message)
        }
      })
    }else {
      self.userInfoReadyCallback = resp => {
        self.globalData.userInfo = resp.userInfo;
        wx.request({
          url: self.globalData.site + 'wx/users',
          method: 'POST',
          data: {
            openid: self.globalData.openid,
            nickName: self.globalData.userInfo.nickName,
            avatarUrl: self.globalData.userInfo.avatarUrl,
            gender: self.globalData.userInfo.gender,
            country: self.globalData.userInfo.country,
            province: self.globalData.userInfo.province,
            city: self.globalData.userInfo.city,
          },
          success: resp => {
            console.log(resp.data.message)
          }
        })
      }
    }
  },
})
