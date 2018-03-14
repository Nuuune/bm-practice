import axios from 'axios'



//全局配置
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.post['Accept'] = "application/json";
axios.defaults.headers.post['Content-Type'] = "application/json; charset=UTF-8";

// Ajax 对不同表的公共方法 getALL/del/update
// 内部方法不暴露
const Action = {
	type: {
		USER: "/app/users/",
		TEACHER: "/app/teacher/",
		GROUP: "/app/group/",
		RATINGFORM: "/app/ratingform/",
		ADMIN: "/app/admin/get"
	},
	getALL (type, option) {
		let op = option || {};
		let url = type + "list";
		return new Promise ((resolve, reject) => {
					axios.post(url, {
				"limit": op.limit || 150,
				"offset": op.offset || 0,
				"keyword": op.keyword || ""
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({
						"data": resp.data.data,
						"count": resp.data.count,
						"limit": resp.data.limit,
						"offset": resp.data.offset
					})
				}else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	},
	getById (type, id) {
		let url = type + "get";
		return new Promise ((resolve, reject) => {
			axios.post(url, {
				"id": id
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({
						"data": resp.data.data
					})
				}else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	},
	update (type, newOne) {
		let url = type + "update";
		return new Promise ((resolve, reject) => {
			axios.post(url, newOne)
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({
						"msg": "更新成功"
					})
				}else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	},
	del (type, id) {
		let url = type + "del";
		return new Promise ((resolve, reject) => {
			axios.post(url, {
				"id": id
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({
						"msg": "删除成功"
					})
				}else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	},
	add (type, newOne) {
		let url = type + "add";
		return new Promise ((resolve, reject) => {
			axios.post(url, newOne)
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({
						"msg": "新增成功"
					})
				}else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	}


};


// 将要暴露的API
const API = {

/******************** 常规接口 *******************************/
	// 评选表 接口
	getALLRatingForms (option) {
		return Action.getALL(Action.type["RATINGFORM"], option)
	},

	// 获得指定Id的评选表
	getRatingFormById (id) {
		return Action.getById(Action.type["RATINGFORM"], id)
	},

	// 更新指定的评选表
	updateRatingForm (ratingForm) {
		return Action.update(Action.type["RATINGFORM"], ratingForm)
	},

	// 删除评选表
	delRatingForm (id) {
		return Action.del(Action.type["RATINGFORM"], id)
	},

	// 新增评选表
	addRatingForm (ratingForm) {
		return Action.add(Action.type["RATINGFORM"], ratingForm)
	},

	// users 接口 （后台管理员）
	getALLUsers (option) {
		return Action.getALL(Action.type["ADMIN"], option)
	},

	// 获得指定Id的管理员
	getUserById (id) {
		return Action.getById(Action.type["ADMIN"], id)
	},

	// 更新指定的管理员
	updateUser (user) {
		return Action.update(Action.type["ADMIN"], user)
	},

	// 删除管理员
	deleteUser (id) {
		return Action.del(Action.type["ADMIN"], id)
	},

	// 新增管理员
	addUser (user) {
		return Action.add(Action.type["ADMIN"], user)
	},

	//获取全部教师
	getALLTeachers (option) {
		return Action.getALL(Action.type["TEACHER"], option)
	},

	//获取指定id的教师
	getTeacherById (id) {
		return Action.getById(Action.type["TEACHER"], id)
	},

	//更新教师信息
	updateTeacher (teacher) {
		return Action.update(Action.type["TEACHER"], teacher)
	},

	//删除教师信息
	delTeacher (id) {
		return Action.del(Action.type["TEACHER"], id)
	},

	//新增教师信息
	addTeacher (teacher) {
		return Action.add(Action.type["TEACHER"], teacher)
	},

	//查询组别信息
	getALLGroups (option) {
		return Action.getALL(Action.type["GROUP"], option)
	},

	//更新教师组别
	// @params group like: {id:'123xa', name: 'aaa'}
	updateGroup (group) {
		return Action.update(Action.type["GROUP"], group)
	},

	//增加教师组别
	// @params group like: {name: 'aaa'}
	addGroup (group) {
		return Action.add(Action.type["GROUP"], group)
	},

	//删除教师组别
	// @params group like: {id: 'aaa'}
	delGroup (group) {
		return Action.del(Action.type["GROUP"], group)
	},

/******************** 一些特定接口 *******************************/

	// 重置教师密码
	resetTeacherPsword (id, psw) {
		return new Promise ((resolve, reject) => {
			axios.post("/app/teacher/updatepassword", {
				"id": id,
				"psword": psw
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({
						"msg": "重置密码成功"
					})
				}else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	},

	//登陆后台
	loginBack (name, psword) {
		return new Promise ((resolve, reject) => {
			axios.post("/app/login", {
				"name": name,
				"psword": psword
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve({msg:"登陆成功！", type:"success"})
				} else {
					reject({msg:"登陆失败！", type:"error"})
				}
			}, err => {
				console.error(err)
			})
		})
	},

	getavglist (id, avgType) {
		return new Promise((resolve, reject) => {
			axios.post("/app/ratingform/getavglist", {
				"id": id,
				"avgtype": avgType
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve(resp.data.data)
				} else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	},

	getnotcomplete (id) {
		return new Promise((resolve, reject) => {
			axios.post("/app/ratingform/getnotcomplete", {
				"id": id
			})
			.then( resp => {
				if(resp.data.code === "0") {
					resolve(resp.data.data)
				} else {
					reject(resp.data.msg)
				}
			}, err => {
				console.error(err)
			})
		})
	}



	// 上传图片
	// uploadImg (file) {
  //
	// 	let formData = new FormData();
	// 	formdata.append('file', file);
  //
	// 	let config = {
  //           headers:{'Content-Type':'multipart/form-data'}
  //       };
  //
	// 	return new Promise ((resolve, reject) => {
	// 		axios.post("/app/file/upload", formData, config)
	// 		.then(resp => {
	// 			if(resp.data.code === "0") {
	// 				resolve(resp.data.data)
	// 			}else {
	// 				reject(resp.data.msg)
	// 			}
	// 		},
	// 		err => console.log(err));
	// 	})
	// }



}

export default API
