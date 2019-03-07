var util = require('../../utils/util.js')

const app = getApp()

Page({
  data: {
    heartrate:0,
    spo2:0,
    lo_gps:0,
    lo_lbs:0,
    la_gps:0,
    la_lbs:0,
    batlvl:0,
    SN:'',
    status:'',
    time1:'',
    time2:''
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
    var snlist = new Array(11);

    snlist[0] = '001221A00B80';
    snlist[1] = '001221B00EBB';
    snlist[2] = '001221B00EB5';
    snlist[3] = '001221B00EBD';
    snlist[4] = '001221B00EC0';
    snlist[5] = '001221B00EB5';
    snlist[6] = '001221B00EB5';
    snlist[7] = '001221B00EB5';
    snlist[8] = '001221B00EB5';
    snlist[9] = '001221B00EB5';
    snlist[10] = '001221B00EB5';

    if(e.detail.value <= 10 && e.detail.value >= 0){
      this.setData({
        SN: snlist[e.detail.value]
      })
    }else{
      this.setData({
        SN:null
      })
    }
  },

  searchSN:function(){
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
    }
    else{
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
        console.log(res.data.t);
        console.log(res.data.t.collectDate);
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;

        that.setData({
          status: res.data.t.onlineStatus,
          time1: util.formatTimeTwo(timestamp, 'Y/M/D h:m:s'),
          heartrate: res.data.t.items[10].numValues,
          spo2: res.data.t.items[9].numValues,          
          lo_gps: res.data.t.items[5].numValues,
          la_gps: res.data.t.items[6].numValues,
          lo_lbs: res.data.t.items[7].numValues,
          la_lbs: res.data.t.items[8].numValues,
          batlvl: res.data.t.items[2].numValues,
          
        })
        
        if (res.data.t.items[9].numValues != 0) {
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
        title: 'Fireband_test',
        desc: 'Fireband手环信息查看工具',
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


