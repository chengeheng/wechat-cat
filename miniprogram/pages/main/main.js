// miniprogram/pages/main/main.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerImages: [],
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    catLists: [],
    fundList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              });
            },
            fail: _ => {
              console.log("fail");
            }
          });
        }
      }
    });

    const db = wx.cloud.database();
    const catImages = db.collection("catImages");
    const catFood = db.collection("catFood");
    catFood.get().then(res => {
      const { data } = res;
      console.log(data);
      this.setData({
        fundList: data
      });
    });
    catImages.get().then(res => {
      const { data } = res;
      let imagas = [];
      data.forEach(item => {
        imagas = imagas.concat(item.files);
      });
      const bannerImages = imagas.slice(0, 3).reverse();
      this.setData({
        bannerImages: bannerImages,
        catLists: data
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
