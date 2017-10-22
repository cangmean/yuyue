//index.js
//获取应用实例
const util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    searchBook: '',
    books: [],
    historyKeyword: [],
  },
  onLoad: function () {
    let self = this;
    if(!app.globalData.openid){
      app.getOpenidCallback = resp => {
        let openid = resp.data.openid;
        app.globalData.openid = openid;
      }
    }
  },
  onShow(){
    let self = this;
    self.setData({
      searchBook: '',
      books: [],
    })
    self.getHistoryKeyword();
  },
  bindKeyInput: function (e) {
    // 输入书籍
    this.setData({
      searchBook: e.detail.value
    })
  },
  viewBookInfo: function(e){
    // 查看书籍详情页面
    let self = this;
    let bookId = e.target.dataset.bookId;
    wx.navigateTo({
      url: '../book/info/info?bookId=' + bookId,
    })
  },
  search: function(){
    // 查询书籍
    let self = this;
    let book = self.data.searchBook;
    let url = util.getUrl('search');
    wx.request({
      url: url,
      data: {
        book: book,
      },
      success: function(resp){
        self.setData({
          books: resp.data.books,
        })
      }
    })

    // 上传最新的keyword并获取历史keyword数据
    wx.request({
      url: util.getUrl('keywords'),
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        keyword: book,
      },
      success: resp => {
        if (resp.data.code == 1){
          self.setData({
            historyKeyword: resp.data.keywords,
          })
        }
      }
    })
  },
  getBooks(e) {
    // 通过keyword 获取书籍
    let self = this;
    let kw = e.target.dataset.bookKw;
    let url = util.getUrl('search');
    wx.request({
      url: url,
      data: {
        book: kw,
      },
      success: function(resp){
        self.setData({
          books: resp.data.books,
          searchBook: kw,
        })
      }
    })

    // 上传最新的keyword并获取历史keyword数据
    wx.request({
      url: util.getUrl('keywords'),
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        keyword: kw,
      },
      success: resp => {
        if (resp.data.code == 1){
          self.setData({
            historyKeyword: resp.data.keywords,
          })
        }
      }
    })
  },
  delKeywords(){
    let self = this;
    wx.request({
      url: util.getUrl('keywords'),
      method: 'DELETE',
      data: {
        openid: app.globalData.openid,
      },
      success: resp => {
        if (resp.data.code == 1){
          self.setData({
            historyKeyword: [],
          })
        }
      }
    })
  },
  getHistoryKeyword() {
    // 获取历史信息
    let self = this;
    wx.request({
      url: util.getUrl('keywords'),
      data: {
        openid: app.globalData.openid,
      },
      success: resp => {
        self.setData({
          historyKeyword: resp.data.keywords,
        })
      }
    })
  },
})
