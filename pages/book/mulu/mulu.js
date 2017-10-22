const util = require('../../../utils/util.js')
var app = getApp()

Page({
  data: {
    chapters: [], // 当前页面获取的章节数
    page: 1,  // 当前页码
    limit: 30,  // 当前页面包含章节数
    bookId: '',   // 小说id
    bookName: '',
    firstSeq: '', // 小说第一个章节序列
    lastSeq: '', // 最后一个章节序列
    orderMode: 'order', // 阅读模式 order: 正序, inverted:倒序
    pages: ['1'],   // 页码数组
    pageIndex: 0,  // 页码下标
    lastPage: 1, // 最后一页 页码 默认为1
  },
  onLoad: function (option) {
    let self = this;
    let bookId = option.bookId;
    let bookName = option.bookName;
    let page = self.data.page;
    let limit = self.data.limit;
    let mode = self.data.orderMode;
    let url = util.getUrl('books/' + bookId + '/mulu');
    wx.request({
      url:url,
      data: {
        page: page, limit: limit,
        order: mode,
      },
      success: function(resp){
        let pages = [];
        // 获取最大页数
        // 并生成数组
        let lastPage = util.paginate(resp.data.lastSeq, limit);
        for (let i=1; i < lastPage + 1; i++){
          pages.push(i);
        }
        self.setData({
          bookId: bookId,
          bookName: bookName,
          chapters: resp.data.mulu,
          firstSeq: resp.data.firstSeq,
          lastSeq: resp.data.lastSeq,
          lastPage: lastPage,
          pages: pages,
        })
      }
    })
  },
  onShow() {
    console.log('mulu on show')
  },
  get_book_mulu: function(){
    let self = this;
    let bookId = self.data.bookId;
    let mode = self.data.orderMode;
    let page = self.data.page;
    let limit = self.data.limit;
    let url = util.getUrl('books/' + bookId + '/mulu');
    wx.request({
      url:url,
      data: {
        page: page, limit: limit,
        order: mode,
      },
      success: function(resp){
        self.setData({
          chapters: resp.data.mulu,
        })
      }
    })
  },
  look: function (e){
    let self = this;
    let seq = e.currentTarget.dataset.chapterSeq;
    let firstSeq = self.data.firstSeq;
    let lastSeq = self.data.lastSeq;
    let bookName = self.data.bookName;
    wx.navigateTo({
      url: '../chapter/chapter?seq=' + seq + '&bookId=' + self.data.bookId + '&bookName=' + bookName + '&firstSeq=' + firstSeq + '&lastSeq=' + lastSeq,
    })
  },
  changeOrderMode: function(e){
    // 选择阅读模式
    let self = this;
    let mode = e.currentTarget.dataset.mode;
    self.setData({
      orderMode: mode,
    })
    self.get_book_mulu();
  },
  changePage: function(e) {
    // 选择页面
    let self = this;
    let pages = self.data.pages;
    let pageIndex = util.toInt(e.detail.value);
    self.setData({
      pageIndex: pageIndex,
      page: pages[pageIndex],
    })
    self.get_book_mulu();
  },
  prevPage: function() {
    // 上一页
    let self = this;
    let page = self.data.page;
    let pageIndex = self.data.pageIndex;

    if (pageIndex > 0){
      pageIndex = pageIndex - 1;
      page = page - 1;
    }
    self.setData({
      pageIndex: pageIndex,
      page: util.toInt(page),
    })
    self.get_book_mulu();
  },
  nextPage: function(){
    // 下一页
    let self = this;
    let page = self.data.page;
    let pageIndex = self.data.pageIndex;
    let lastPage = self.data.lastPage;

    if (pageIndex < lastPage - 1){
      pageIndex = pageIndex + 1;
      page = page + 1;
    }
    self.setData({
      pageIndex: pageIndex,
      page: util.toInt(page),
    })

    self.get_book_mulu();
  },
})
