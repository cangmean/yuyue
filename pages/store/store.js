const util = require('../../utils/util.js')

Page({
  data: {
    books: [],
    page: 1,
    perpage: 20,
  },
  onLoad(){
    let self = this;
    self.getBooks();
  },
  viewBookInfo(e){
    let self = this;
    let bookId = e.target.dataset.bookId;
    wx.navigateTo({
      url: '../book/info/info?bookId=' + bookId,
    })
  },
  getBooks() {
    let self = this;
    let page = self.data.page;
    let perpage = self.data.perpage;
    let books = self.data.books;
    let url = util.getUrl('books');
    wx.request({
      url: url,
      data: {
        page: page, limit: perpage,
      },
      success: resp => {
        for(let i=0; i<resp.data.books.length; i++){
          books.push(resp.data.books[i]);
        }
        self.setData({
          books: books,
        })
      }
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
    self.getBooks();
  }
})
