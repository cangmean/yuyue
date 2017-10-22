// info.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
  },
  //事件处理函数
  onLoad() {
    var self = this
    //调用应用实例的方法获取全局数据
    if (!app.globalData.userInfo){
      app.userInfoReadyCallback = resp => {
        app.globalData.userInfo = resp.userInfo;
        self.setData({
          userInfo: app.globalData.userInfo,
        })
      }
    }else {
      self.setData({
        userInfo: app.globalData.userInfo,
      })
    }
  },
  onShareAppMessage(option) {
    // 微信提供的转发功能， 页面上分享
    // 可以通过 button 上设置 open-type="share" 调用
    if(option.from == 'button'){
      console.log('button')
    }
    console.log(option)
    return {
      title: '欢迎大家来小白娱阅来阅读书籍。',
      path: 'pages/shelf/shelf',
      imageUrl: '/images/share.jpg',
      success: resp => {
        console.log(resp)
      }
    }
  },
  temp_func() {
    wx.showToast({
      title: '等待开发..',
      icon: 'success',
      duration: 1000
    })
  },
})
