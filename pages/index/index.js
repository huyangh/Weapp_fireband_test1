
var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    heartrate:'',
    spo2:'',
    lo_gps:0,
    lo_lbs:0,
    la_gps:0,
    la_lbs:0,
    batlvl:'',
    signal:'',
    SN:'',
    status:'',
    collectTime1:'',
    collectTime2: '',

  },
  
  bindViewTap: function() {
    if(this.data.lo_gps != 0 && this.data.la_gps !=0){
      wx.openLocation({
        longitude: this.data.lo_gps,
        latitude: this.data.la_gps
      })
    }else{
      wx.openLocation({
        longitude: this.data.lo_lbs,
        latitude: this.data.la_lbs
      })
    }
    
  },

  onLoad: function () {
    
  },


  sninput:function(e){
    var snlist = new Array(100);
    snlist[0] = '001221A00B80';
    
    if(e.detail.value <= 100 && e.detail.value >= 1){
      this.setData({
        SN: snlist[e.detail.value - 1]
      })
    }else{
      
    }
    
    
  },

  searchSN:function(){
    console.log("button tap");
    if(this.data.SN != null){
      console.log("SN:" + this.data.SN);
      var that = this;  

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
    }else{
      wx.showToast({
        title: '请重新输入正确的设备编号',
        icon: 'none',
        duration: 2000
      })
    }
  },


  getdata: function (token) {
    // 获取数据
    var that = this;
    wx.request({
      method:'POST',
      url:    'https://api.hizyf.com/DM-open-service/serviceSum/deviceDataNew/3fb0139916be4d53a73dbdf0ae452571',
      data: {
        'deviceSn': this.data.SN,
        'fieldId': ''
      },
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: function (res) {
      
        console.log(res.data.t)

        // var batbuf = res.data.t.items[2].numValues;
        // var logpsbuf = res.data.t.items[5].numValues;
        // var lagpsbuf = res.data.t.items[6].numValues;
        // var lolbsbuf = res.data.t.items[7].numValues;
        // var lalbsbuf = res.data.t.items[8].numValues;
        // var hrbuf = res.data.t.items[10].numValues;
        // var spo2buf = res.data.t.items[9].numValues;
        if (res.data.t.items[10].numValues == 0){
          that.setData({
            
            batlvl: res.data.t.items[2].numValues,
            lo_gps: res.data.t.items[5].numValues,
            la_gps: res.data.t.items[6].numValues,
            lo_lbs: res.data.t.items[7].numValues,
            la_lbs: res.data.t.items[8].numValues,
            
            collectTime1: new Date(res.data.t.collectDate).toLocaleDateString().replace(/\//g, "-") ,
            collectTime2: new Date(res.data.t.collectDate).toTimeString().substr(0, 8),
          
          })
        } else if (res.data.t.items[2].numValues == 0){
          that.setData({
            heartrate: res.data.t.items[10].numValues,
            spo2: res.data.t.items[9].numValues,
            status: res.data.t.onlineStatus,
          })
        }
        
        if (res.data.t.items[2].numValues != 0) {
          wx.showToast({
            title: '查询成功',
            icon: 'success',
            duration: 2000
          })
        }
      },

      fail:function (){
        wx.showToast({
          title: '请求数据失败',
          icon:'fail',
          duration:2000
        })
      }
    })
  },

  onShareAppMessage: function () {

      return {

        title: 'Fireband',

        desc: '查看手环信息',

        path: '/index/index'

      }

    },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    console.log("refresh!");
    if (this.data.SN != null) {
      console.log("SN:" + this.data.SN);
      var that = this;

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
    }
  }

})


