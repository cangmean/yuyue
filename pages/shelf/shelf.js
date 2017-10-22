//box.js
const util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    books: [],
    selectBtn: 'his',
    mode: false,
  },
  onLoad() {
    let self = this;
    if(!app.globalData.openid){
      app.getOpenidCallback = resp => {
        let openid = resp.data.openid;
        app.globalData.openid = openid;
      }
    }
  },
  onShow() {
    // 用于初始化
    let self = this;
    self.setData({
      mode: false,
    })
    if(app.globalData.openid){
        let openid = app.globalData.openid;
        self.getBooks(openid);
    }else {
      app.getOpenidCallback = resp => {
        let openid = resp.data.openid;
        app.globalData.openid = openid;
        self.getBooks(openid);
      }
    }
  },
  setHistory() {
    let self = this;
    if (self.data.selectBtn == 'his'){
      return
    }
    self.setData({
      selectBtn: 'his',
    })
    self.getBooks(app.globalData.openid);
  },
  setFavorite() {
    let self = this;
    if (this.data.selectBtn == 'fav'){
      return
    }
    self.setData({
      selectBtn: 'fav',
    })
    self.getBooks(app.globalData.openid);
  },
  changeMode(){
    let self = this;
    let mode = self.data.mode;
    self.setData({
      mode: !mode,
    })
  },
  viewBookInfo(e) {
    let self = this;
    let bookId = e.target.dataset.bookId;
    wx.navigateTo({
      url: '../book/info/info?bookId=' + bookId,
    })
  },
  delBook(e) {
    let self = this;
    let flag = self.data.selectBtn;
    if(flag == 'his'){
      flag = 'histories';
    }else {
      flag = 'favorites';
    }
    let bookId = e.target.dataset.bookId;
    wx.request({
      url: util.getUrl(flag),
      method: 'DELETE',
      data: {
        openid: app.globalData.openid,
        bookId: bookId,
      },
      success: resp => {
        self.setData({
          books: resp.data.books,
        })
      }
    })
  },
  getBooks (openid) {
    let self = this;
    let flag = self.data.selectBtn;
    if(flag == 'his'){
      flag = 'histories';
    }else {
      flag = 'favorites';
    }
    wx.request({
      url: util.getUrl(flag),
      data: {
        openid: openid,
      },
      success: resp => {
        self.setData({
          books: resp.data.books,
        })
      }
    })
  }
})
