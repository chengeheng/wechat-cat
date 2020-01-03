Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        pagePath: "/pages/main/main",
        iconPath: "/images/tabbar/cat.png",
        selectedIconPath: "/images/tabbar/cat.png",
        text: "主页"
      },
      {
        pagePath: "/pages/miaomiao/miaomiao",
        iconPath: "/images/tabbar/foot.png",
        selectedIconPath: "/images/tabbar/foot.png",
        text: "妙妙日记"
      },
      {
        pagePath: "/pages/index/index",
        iconPath: "/images/tabbar/food.png",
        selectedIconPath: "/images/tabbar/food.png",
        text: "用户"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({
        selected: data.index
      });
    }
  }
});
