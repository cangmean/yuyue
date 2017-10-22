const util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {
    chapter: {},
    bookId: '',
    bookName: '',
    seq: '',
    mode: 'day',
    ftSize: 'sm',  //sm md lg  小中大
    firstSeq: '',
    lastSeq: '',
  },
  onLoad: function (option) {
    let self = this;
    let seq = option.seq;
    let bookId = option.bookId
    let bookName = option.bookName;
    let firstSeq = option.firstSeq;
    let lastSeq = option.lastSeq;

    // 测试用
    // bookId = 1;
    // firstSeq = 1;
    // lastSeq = 30;

    if (!seq){
      seq = 1;
    }
    ////
    self.setData({
      bookId: bookId,
      bookName: bookName,
      seq: util.toInt(seq),
      firstSeq: util.toInt(firstSeq),
      lastSeq: util.toInt(lastSeq),
    })
    try {
      var ft = wx.getStorageSync('ftSize');
      var mode = wx.getStorageSync('mode');
      self.setData({
        ftSize: ft,
        mode: mode,
      })
    } catch (e) {
      // Do something when catch error
    }
    // 获取章节数
    let url = util.getUrl('books/' + bookId + '/chapters/' + seq);
    wx.request({
      url:url,
      success: function(resp){
        self.setData({
          chapter: resp.data.chapter,
        })
      }
    })
  },
  onShow() {
  },
  toChapter: function(seq) {
    // 重定向到新的页面
    // 打开新的章节页面
    let self = this;
    let bookId = self.data.bookId;
    let url = './chapter?seq=' + seq + '&bookId=' + bookId;
    wx.redirectTo({
      url: url,
    })
  },
  toShelf(){
    let url = '../../shelf/shelf';
    wx.switchTab({
      url: url,
    })
  },
  toMulu() {
    wx.navigateBack({
      delta: 1,
    })
  },
  prevChapter() {
    let self = this;
    let seq = self.data.seq;
    if (seq > 1){
      seq = seq - 1;
    }
    self.toChapter(seq);
  },
  nextChapter() {
    let self = this;
    let seq = self.data.seq;
    seq = seq + 1;
    self.toChapter(seq);
  },
  changeToLarge() {
    // 字体变大
    let self = this;
    let ft = self.data.ftSize;
    if (ft == 'sm'){
      ft = 'md';
    }else if(ft == 'md'){
      ft = 'lg';
    }

    self.setData({
      ftSize: ft,
    })
    wx.setStorage({
      key: "ftSize",
      data: ft,
    })
  },
  changeToSmall() {
    // 字体变小
    let self = this;
    let ft = self.data.ftSize;
    if (ft == 'lg'){
      ft = 'md';
    }else if(ft == 'md'){
      ft = 'sm';
    }

    self.setData({
      ftSize: ft,
    })
    wx.setStorage({
      key: "ftSize",
      data: ft,
    })
  },
  changeReadMode() {
    // 切换阅读模式
    let self = this;
    let mode = self.data.mode;
    if (mode == 'day'){
      mode = 'night';
    }else {
      mode = 'day';
    }
    self.setData({
      mode: mode,
    })

    wx.setStorage({
      key: "mode",
      data: mode,
    })
  }
})
