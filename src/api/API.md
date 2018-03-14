API.md
===

> jq 示例 由于 原本是采用的jq来传输数据的 现已更改为axios
>```javascript
>$.ajax({
>	type: "POST",
>	url: "http://da8efb17.ngrok.io/app/teacher/get",
>	data: JSON.stringify({
>		"id": "5a2a681b36f02657d13542b6"
>	}),
>	dataType: "json",
>	headers: {
>		Accept: "application/json",
>		"Content-type": "application/json"
>	},
>	success: function(data) {
>	  if(data.code == "4000") {
>	  	console.log("错误：" + data.msg)
>	  	return ;
>	  }
>
>	  console.log("成功：" + data.data.toString())
>	}
>})
>```

## 接口文档

dev下默认主域为: '"localhost:5002"'
build下默认为： "window.loaction.origin"
可以在/build/webpack.(dev|prod).conf.js 中进行修改

> 索引不全，具体请看index.js

### 索引

+ [教师相关]("#teacher")
+ [组别相关]("#group")

<a name="teacher" />
__ 获取多个教师信息 __

>url: "/app/teacher/list"
req: {
		"limit":limit,
		"offset":offset,
		"keyword":keyword,
		"groupid":groupid
}
resp: {
		code: "0",
		"msg": "",
		"data": [
					{
						"id":"5a2a681b36f02657d13542b6",
						"name":"test6",
						"sex":"",
						"pic":"",
						"idcard":"",
						"teacherid":"",
						"birthday":0,
						"phone":"13724241460",
						"grouplist":null,
						"ctime":1512728603,
						"utime":1512728603
					}
		],
		count: 1,
		limit: 100000,
		offset: 0
>}

__ 获取单个教师信息 __

>url: "/app/teacher/get"
req: {
		id: id(String)
}
resp: {
		code: "0",
		"msg": "",
		"data": {
					"id":"5a2a681b36f02657d13542b6",
					"name":"test6",
					"sex":"",
					"pic":"",
					"idcard":"",
					"teacherid":"",
					"birthday":0,
					"phone":"13724241460",
					"grouplist":null,
					"ctime":1512728603,
					"utime":1512728603			
		}
>}

__ 重置教师密码 __

>url: "/app/teacher/updatepassword"
req: {
	"id": id(String)
	psword: psword(String)
}
resp: {
	"code": "0",
	msg: ""
>}

__ 更新教师信息 __

>url: "/app/teacher/update"
req: {
        id:_id,
        name:name,
        idcard:idcard,
        teacherid:teacherid,
        phone:phone,
        pic:picurl,
        groupidlist:groupidlist
}
resp: {
	"code": "0",
	msg: ""
>}

__ 删除教师信息 __

>url: "/app/teacher/del"
req: {
	"id": id(String)
}
resp: {
	"code": "0",
	msg: ""
>}

__ 新增教师信息 __

>url: "/app/teacher/add"
req: {
		name:name,
		idcard:idcard,
		teacherid:teacherid,
		phone:phone,
		psword:psword,
		pic:picurl,
		groupidlist:groupidlist
}
resp: {
	"code": "0",
	msg: ""
>}

<a name="group" />
__ 获取组别 __

>url: "/app/group/list"
req: {
		"limit":100000,
		"offset":0,
		"keyword":""
}
resp: {
		"code": "0",
		"msg": "",
		"data": [
					{
						"id": "asdasd22",
						"name": "3",
						"ctime": 1512704513,
						"utime": 1512704513
					}
		]
>}

<a name="ratingForm" />
__ 获取评选表 __
>url: "/app/ratingform/list"
req: {
		"limit":100000,
		"offset":0,
		"keyword":""
}
resp: {
		"code": "0",
		"msg": "",
		"data": [
					{
						acount:1
						bcount:2
						ccount:2
						ctime:1516581420
						etime:1517443200
						id:"5a65322c66ecba0de1e78367"
						name:"评优1"
						ratingedteacher:[{id: "5a2a681436f02657d13542b5", name: "test5", pic: "", idcard: "", sex: "", teacherid: "",…},…]
						ratingteacher:[{id: "5a2a681436f02657d13542b5", name: "test5", pic: "", idcard: "", sex: "", teacherid: "",…},…]
						ratingtype:["ComprehensiveQuality"]
						selfratingteacher:[{id: "5a2a681b36f02657d13542b6", name: "test6", pic: "", idcard: "", sex: "", teacherid: "0003",…},…]
						stime:1516579200
						utime:1516581420
					}
		]
>}

__ 获取单个评选表 __
>url: "/app/ratingform/get"
req: {
		"id": "asdascz"
}
resp: {
		"code": "0",
		"msg": "",
		"data": {
			acount:1
			bcount:2
			ccount:2
			ctime:1516581420
			etime:1517443200
			id:"5a65322c66ecba0de1e78367"
			name:"评优1"
			ratingedteacher:[{id: "5a2a681436f02657d13542b5", name: "test5", pic: "", idcard: "", sex: "", teacherid: "",…},…]
			ratingteacher:[{id: "5a2a681436f02657d13542b5", name: "test5", pic: "", idcard: "", sex: "", teacherid: "",…},…]
			ratingtype:["ComprehensiveQuality"]
			selfratingteacher:[{id: "5a2a681b36f02657d13542b6", name: "test6", pic: "", idcard: "", sex: "", teacherid: "0003",…},…]
			stime:1516579200
			utime:1516581420
		}
>}

__ 获取评选表中的分数排名 __
>url: "/app/ratingform/getavglist"
req: {
		"id": "asdascz",
		"avgtype": "eavg"   // "cavg"->综合素质 "eavg"->师德分数
}
resp: {
		"code": "0",
		"msg": "",
		"data": [{
			avg:10,
			birthday:0,
			groupnamelist:["3"],
			id:"5a2a681b36f02657d13542b6",
			idcard:"",
			name:"test6",
			phone:"13724241460",
			teacherid:"0003"
		}]
>}

__ 获取评选表中的未评选的老师 __
>url: "/app/ratingform/getnotcomplete"
req: {
		"id": "asdascz"
}
resp: {
		"code": "0",
		"msg": "",
		"data": [{
			birthday:0
			groupnamelist:["3"]
			id:"5a2a681b36f02657d13542b6"
			idcard:""
			name:"test6"
			phone:"13724241460"
			pic:""
			sex:""
			teacherid:"0003"
		}]
>}
