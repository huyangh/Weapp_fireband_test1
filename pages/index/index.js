//index.js
//获取应用实例
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()

Page({
  data: {
    udata: 'Hello World',
    heartrate:70,
    spo2:98,
    location:"120E,30N"
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
  },

  searchSN:function(){
    console.log("button touch");
    
  }
})
