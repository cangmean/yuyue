var app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const toInt = n => {
  n = parseInt(n);
  return n
}

const paginate = (total, perpage) => {
  if (!total || !perpage) {
    return 1;
  }
  if (total <= perpage){
    return 1;
  }else {
    return Math.ceil(total / perpage);
  }
}

const isNull = (text) => {
  if (text == ""){
    return true;
  }
  let r = "^[ ]+$";
  let re = new RegExp(r);
  return re.test(text);
}

const getUrl = (path) => {
  return app.globalData.site + path;
}


module.exports = {
  formatTime: formatTime,
  toInt: toInt,
  paginate: paginate,
  isNull: isNull,
  getUrl: getUrl,
}
