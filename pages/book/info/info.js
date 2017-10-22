const util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {
    book: {}, // 书籍信息
    bookId: '', // 传进来的书籍id 根据这个请求书籍详情
    inputValue: '', // 输入的评论内容
    replies: [],   // 列出的评论
    replyCount: 0,  // 对本书的总评论数
    perpage: 5,    // 一次下拉加载的评论个数
    page: 1,       // 获取几条评论
    flag: '', // 表示这个是从什么页面进来的 如果是收藏着表示 fav 历史表示 his  别的入口为 undefined.
  },
  onLoad (option) {
    let self = this;
    let bookId = option.bookId;
    if(!app.globalData.openid){
      app.getOpenidCallback = resp => {
        let openid = resp.data.openid;
        app.globalData.openid = openid;
      }
    }
    self.setData({
      bookId: bookId,
    })
    // 获取书籍信息
    let url =  util.getUrl('books/' + bookId);
    wx.request({
      url:url,
      success: resp => {
        self.setData({
          book: resp.data.book,
        })
      }
    })
    // 判断该书籍是否是收藏的书籍
    wx.request({
      url: util.getUrl('favbook'),
      data: {
        openid: app.globalData.openid,
        bookId: bookId,
      },
      success: resp => {
        if (resp.data.code == 1){
          self.setData({
            flag: 'fav',
          })
        }
      }
    })
  },
  onShow(){
    let self = this;
    let bookId = self.data.bookId;
    let page = self.data.page;
    let perpage = self.data.perpage;

    // 获取该书籍相关评论
    wx.request({
      url:  util.getUrl('books/' + bookId + '/replies'),
      data: {
        page: page, limit: perpage,
      },
      success: resp => {
        self.setData({
          replies: resp.data.replies,
          replyCount: util.toInt(resp.data.count),
        })
      }
    })
  },
  start_read: function(e){
    // 免费试阅读
    let self = this;
    wx.request({
      url: util.getUrl('histories'),
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        bookId: self.data.bookId,
      },
      success: resp => {
        self.setData({
          flag: 'fav',
        })
      }
    })
    wx.navigateTo({
      url: '../chapter/chapter?bookId=' + self.data.bookId + '&seq=1',
    })
  },
  set_fav: function (e){
    // 加入收藏
    let self = this;
    wx.request({
      url: util.getUrl('favorites'),
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        bookId: self.data.bookId,
      },
      success: resp => {
        self.setData({
          flag: 'fav',
        })
      }
    })
  },
  toMulu: function (){
    let self = this;
    let bookId = self.data.bookId;
    let url = '../mulu/mulu?bookId=' + bookId + '&bookName=' + self.data.book.name;
    wx.navigateTo({
      url: url,
    })
  },
  bindKeyInput: function(e) {
    // 查看键盘内容
    this.setData({
      inputValue: e.detail.value
    })
  },
  getReplies() {
    // 获取本书的所有评论
    let self = this;
    let page = self.data.page;
    let perpage = self.data.perpage;
    let replies = self.data.replies;
    let bookId = self.data.bookId;

    wx.request({
      url:  util.getUrl('books/' + bookId + '/replies'),
      data: {
        page: page, limit: perpage,
      },
      success: resp => {
        // for (let i=0; i<resp.data.replies.length; i++){
        //   replies.push(resp.data.replies[i]);
        // }
        self.setData({
          replies: resp.data.replies,
          replyCount: util.toInt(resp.data.count),
        })
      }
    })
  },
  addReply: function() {
    // 添加评论
    let self = this;
    let inputValue = self.data.inputValue;
    let userInfo = app.globalData.userInfo;
    let openid = app.globalData.openid;
    let replies = self.data.replies;
    let bookId = self.data.bookId;
    let replyCount = self.data.replyCount;
    if (util.isNull(inputValue)){
      return
    }
    // 添加评论
    wx.request({
      url:  util.getUrl('books/' + bookId + '/replies'),
      method: 'POST',
      data: {
        openid: openid, content: self.data.inputValue,
      },
      success: resp => {
        if (resp.data.code == 1){
            replies.unshift(resp.data.reply);
            replyCount += 1;
        }
        self.setData({
          inputValue: '',
          replies: replies,
          replyCount: replyCount,
        })
      },
    })
  },
  onReachBottom(){
    // 系统默认方法 需要在app.json设置
    let self = this;
    let page = self.data.page;
    let perpage = self.data.perpage;
    let replyCount = self.data.replyCount
    if (page >= Math.ceil(replyCount / perpage)){
      return;
    }
    page += 1;
    self.setData({
      page: page,
    })
    self.getReplies();
  }
})
