// miniprogram/pages/catFood/catFood.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		files: [],
		name: "",
		cost: "",
		hasSubmit: false
	},
	uploadDelete(files) {
		const deleteFile = files.detail.item.url;
		wx.cloud.deleteFile({
			fileList: [deleteFile],
			success: res => {
				// handle success
				wx.showToast({
					title: "删除成功",
					icon: "none"
				});
			},
			fail: err => {
				// handle error
				console.log("文件不存在");
			}
		});
	},
	previewImage: function(e) {
		wx.previewImage({
			current: e.currentTarget.id, // 当前显示图片的http链接
			urls: this.data.files // 需要预览的图片http链接列表
		});
	},
	selectFile(files) {
		console.log("files", files);
		// 返回false可以阻止某次文件上传
	},
	uplaodFile(files) {
		let uploadPromises = files.tempFilePaths.map((item, index) => {
			// 上传图片
			const cloudPath =
				"my-image-" +
				index +
				"-" +
				new Date().valueOf() +
				item.match(/\.[^.]+?$/)[0];
			return new Promise((resolve, reject) => {
				// 上传图片
				wx.cloud.uploadFile({
					cloudPath,
					filePath: item,
					success: res => {
						res.url = res.fileID;
						resolve(res);
					},
					fail: e => {
						reject();
					},
					complete: () => {
						wx.hideLoading();
					}
				});
			});
		});
		// 文件上传的函数，返回一个promise
		return Promise.all(uploadPromises);
	},
	uploadError(e) {
		wx.showToast({
			title: "图片上传失败",
			icon: "none"
		});
	},
	uploadSuccess(e) {
		let files = e.detail.map(item => ({
			url: item.fileID
		}));
		this.setData({
			files: files
		});
	},
	bindNameBlur: function(e) {
		this.setData({
			name: e.detail.value
		});
		console.log(this.data);
	},
	bindCostBlur: function(e) {
		this.setData({
			cost: e.detail.value
		});
	},
	onSubmit: function() {
		const { name, cost } = this.data;
		let costNum = parseInt(cost);
		if (!name) {
			wx.showToast({
				title: "请输入喵粮品种",
				icon: "none"
			});
			return;
		}
		if (!costNum) {
			wx.showToast({
				title: "请输入价格",
				icon: "none"
			});
			return;
		}
		const db = wx.cloud.database();
		const catFood = db.collection("catFood");
		catFood
			.where({
				name: name
			})
			.get()
			.then(res => {
				const { data } = res;
				if (data.length) {
					let totalCost = data[0].cost + costNum;
					let _id = data[0]._id;
					catFood
						.doc(_id)
						.update({
							data: {
								cost: totalCost
							}
						})
						.then(res => {
							this.setData({
								hasSubmit: true
							});
							wx.switchTab({
								url: "../index/index"
							});
						});
				} else {
					catFood
						.add({
							data: {
								name: name,
								cost: costNum,
								updateTime: new Date().valueOf()
							}
						})
						.then(res => {
							this.setData({
								hasSubmit: true
							});
							wx.switchTab({
								url: "../index/index"
							});
						});
				}
			});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			selectFile: this.selectFile.bind(this),
			uplaodFile: this.uplaodFile.bind(this)
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
	onUnload: function() {
		const { files, hasSubmit } = this.data;
		let fileIDs = files.map(item => item.url).join(",");
		if (!hasSubmit && fileIDs) {
			wx.cloud.deleteFile({
				fileList: fileIDs,
				success: res => {
					// handle success
					console.log(res.fileList);
				},
				fail: err => {
					// handle error
					console.log("文件不存在");
				}
			});
		}
	},

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
