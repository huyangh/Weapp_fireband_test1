
var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    heartrate:'',
    spo2:'',
    lo_gps:'',
    lo_lbs:'',
    la_gps:'',
    la_lbs:'',
    batlvl:'',
    signal:'',
//    sn:'001221A00B80'
  },
  
  bindViewTap: function() {
    // if(lo_gps != 0 && la_gps !=0){
    //   wx.openLocation({
    //     longitude: lo_gps,
    //     latitude: la_gps
    //   })
    // }else{
    //   wx.openLocation({
    //     longitude: lo_lbs,
    //     latitude: la_lbs
    //   })
    // }
    wx.openLocation({
      latitude: '',
      longitude: '',
    })
  },

  onLoad: function () {
    
  },

  searchSN:function(){
    console.log("button tap");
    var that = this;
    // if(this.data.sn.length == 12){
    //   wx.showToast({
    //     title: '查询成功',
    //     icon: 'success',
    //     duration: 2000
    //   })
    // }else{
    //   wx.showToast({
    //     title: '序列号格式错误',
    //     icon: 'fail',
    //     duration: 2000
    //   })
    // }
    wx.request({
      url: 'https://api.hizyf.com/DM-open-service/auth/getToken',
      data: {
        corporateId: "3fb0139916be4d53a73dbdf0ae452571",
        corporatePasswd: "zxcvbnm123"
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      success: function (res) {
        console.log(res.data);
        that.getdata(res.data.token);
      }
    })
  },

  // sninput:function(e){
  //   this.setData({
  //     sn:e.detail.value
  //   })
  // },

  getdata: function (token) {
    // 获取数据
    var that = this;
    wx.request({
      method:'POST',
      url:    'https://api.hizyf.com/DM-open-service/serviceSum/deviceDataNew/3fb0139916be4d53a73dbdf0ae452571',
      data: {
        'deviceSn': '001221A00B80',
        'fieldId': ''
      },
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(res.data.t),
        that.setData({
          signal: res.data.t.items[1].numValues,
          batlvl: res.data.t.items[2].numValues,
          lo_gps: res.data.t.items[5].numValues,
          la_gps: res.data.t.items[6].numValues,
          lo_lbs: res.data.t.items[7].numValues,
          la_lbs: res.data.t.items[8].numValues,
          heartrate: res.data.t.items[9].numValues,
          spo2: res.data.t.items[10].numValues,


         })
      },
      fail:function (){
        wx.showToast({
          title: '请求数据失败',
          icon:'fail',
          duration:2000
        })
      }
    })
  }


})


