// miniprogram/pages/strayCat/strayCat.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		files: [],
		name: "",
		description: "",
		hasSubmit: false
	},
	uploadDelete(files) {
		console.log(files);
		const deleteFile = files.detail.item.url;
		console.log(deleteFile);
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
	},
	bindDescriptionBlur: function(e) {
		this.setData({
			description: e.detail.value
		});
	},
	onSubmit: function() {
		const { name, files, description } = this.data;
		if (!name) {
			wx.showToast({
				title: "请输入流浪猫姓名（可现编）",
				icon: "none"
			});
			return;
		}
		if (files.length == 0) {
			wx.showToast({
				title: "请上传图片（可上传自拍）",
				icon: "none"
			});
			return;
		}
		const db = wx.cloud.database();
		const catImages = db.collection("catImages");
		catImages
			.add({
				data: {
					name: name,
					files: files,
					description: description,
					updateTime: new Date().valueOf()
				}
			})
			.then(res => {
				this.setData({
					hasSubmit: true
				});
				wx.switchTab({
					url: "../main/main"
				});
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
