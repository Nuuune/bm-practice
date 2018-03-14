//工具集

const UTIL = {
	//Unix TIME  转换
	unixToDate (unixT) {
		let date = new Date(unixT);
		let o = {
			"y": date.getFullYear(), // 年
			"M": date.getMonth() + 1, // 月
			"d": date.getDate(), // 日
			"H": date.getHours(), // 时
			"m": date.getMinutes(), // 分
			"s": date.getSeconds() // 秒
		}

		//YYYY-MM-dd HH:mm:ss
		return o.y + "-"
		+ (o.M > 9 ? o.M : "0" + o.M) + "-"
		+ (o.d > 9 ? o.d : "0" + o.d) + " "
		+ (o.H > 9 ? o.H : "0" + o.H) + ":"
		+ (o.m > 9 ? o.m : "0" + o.m) + ":"
		+ (o.s > 9 ? o.s : "0" + o.s);
	},

	//判断是否为电话号码 返回Boolean值
	isTelNumber (number) {
		if(!(typeof number === "string" || typeof number === "number")) {
			return false
		}else if(typeof number === "number") {
			number = number + ""
		}

		let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
		return phoneReg.test(number);
	},

	//文件上传
	//option :  { data: { url: "", file: file}, progress: callback }
	upload (option) {
		if (!(option instanceof Object)) throw new Error("Arguments is not object!");
		let url = option.data.url;
		let file = option.data.file;

		//初始化xhr对象
		let xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		let formData = new FormData();
		formData.append('file', option.data.file);
		//进度事件
		//若需要传输速率可以将注释恢复
		// let taking = 0;
		// let startDate = new Date().getTime();
		xhr.upload.addEventListener('progress', function(e){
			if(e.lengthComputable) {
				// 传输速率
				// let nowDate = new Date().getTime();
				// taking = (nowDate - startDate)/1000;
				// let uploadSpeed = (e.loaded / 1024) / taking;
				// let formatSpeed;
				// if (uploadSpeed > 1024) {
				// 		formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
				// } else {
				// 		formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
				// }
				// 已完成百分比
				let completedPercent = Math.round((e.loaded / e.total) * 100);
				//传给回调函数
				option.progress(completedPercent);
			}
		}, false);

		//response处理
		xhr.onreadystatechange = function (resp) {
			if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
				return JSON.parse(xhr.responseText);
			} else if (xhr.status != 200 && xhr.responseText) {
          throw new Error(JSON.parse(xhr.responseText).error);
      } else if (xhr.status != 200) {
          throw new Error("上传失败");
      }
		}

		//请求
		xhr.send(formData);
	}

}

export default UTIL
