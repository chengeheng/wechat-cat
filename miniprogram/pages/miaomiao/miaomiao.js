// miniprogram/pages/miaomiao/miaomiao.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    miaomiaoList: [],
    windowWidth: 0,
    windowHeight: 0,
    imgMargin: 6,
    imgWidth: 0,
    topArr: [0, 0] //每列的累计top
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: "加载中..."
    });
    let that = this;
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        let windowWidth = res.windowWidth;
        let windowHeight = res.windowHeight;
        let imgWidth = (windowWidth - that.data.imgMargin * 3) / 2;
        that.setData(
          {
            windowWidth,
            windowHeight,
            imgWidth
          },
          function() {
            that.loadMoreImages();
          }
        );
      }
    });
  },
  //加载图片
  loadImage: function(e) {
    var index = e.currentTarget.dataset.index; //图片所在索引
    var imgW = e.detail.width,
      imgH = e.detail.height; //图片实际宽度和高度
    var imgWidth = this.data.imgWidth; //图片宽度
    var imgScaleH = (imgWidth / imgW) * imgH; //计算图片应该显示的高度

    var dataList = this.data.miaomiaoList;
    var margin = this.data.imgMargin; //图片间距
    //第一列的累积top，和第二列的累积top
    var firtColH = this.data.topArr[0],
      secondColH = this.data.topArr[1];
    var obj = dataList[index];

    obj.height = imgScaleH;

    if (firtColH <= secondColH) {
      //表示新图片应该放到第一列
      obj.left = margin;
      obj.top = firtColH + margin;
      firtColH += margin + obj.height;
    } else {
      //放到第二列
      obj.left = margin * 2 + imgWidth;
      obj.top = secondColH + margin;
      secondColH += margin + obj.height;
    }

    this.setData({
      miaomiaoList: dataList,
      topArr: [firtColH, secondColH]
    });
  },
  loadMoreImages: function() {
    const db = wx.cloud.database();
    const catInfo = db.collection("catInfo");
    catInfo.get().then(res => {
      const { data } = res;
      let images = [];
      data.forEach(d => {
        images = images.concat(
          d.files.map(f => {
            return {
              src: f.url,
              height: 0,
              top: 0,
              left: 0
            };
          })
        );
      });
      let show_data = this.data.miaomiaoList.length;
      let list = [];
      if (images.length > show_data) {
        list = images.splice(show_data, 10);
      }

      this.setData(
        {
          miaomiaoList: this.data.miaomiaoList.concat(list)
        },
        function() {
          wx.hideLoading();
        }
      );
    });
  },
  /**预览图片 */
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    var dataList = this.data.miaomiaoList;
    var currentSrc = dataList[index].src;
    // var srcArr = dataList.map(function (item) {
    //   return item.src;
    // });

    wx.previewImage({
      urls: [currentSrc]
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
