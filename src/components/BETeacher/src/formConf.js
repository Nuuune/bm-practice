import UTIL from '@/util'

//表单域对应中文名
const Name = {
  name: "姓名",
  idcard: "身份证号",
  teacherid: "教师号",
  phone: "手机号",
  groupidlist: "分组",
  psword: "密码",
}

let validatePhone = (rule, value, callback) => {
  if(!value) {
    callback(new Error('手机号不能为空'))
  }else if(!UTIL.isTelNumber(value)){
    callback(new Error('手机号格式错误'))
  }else {
    callback()
  }
}

let required = (rule, value, callback) => {
  if(!value){
    callback(new Error('请输入' + Name[rule.field]))
  }else {
    callback()
  }
}


export default {
  inputs: [
    {name: "", prop: "pic"},
    {name: "姓名", prop: "name"},
    {name: "身份证号", prop: "idcard"},
    {name: "教师号", prop: "teacherid", type: "tel"},
    {name: "手机号", prop: "phone", type: "tel"},
    {name: "分组", prop: "groupidlist"},
    {name: "密码", prop: "psword", type: "password"}
  ],
  rulesADD: {
    name: {validator: required},
    idcard: [
      {validator: required},
      {len: 18, message: "身份证长度不对"}
    ],
    teacherid: {validator: required},
    phone: {validator: validatePhone},
    psword: [
      {validator: required},
      {min: 3, max: 18, message: "长度不能小于3，大于18字符"}
    ]
  },
  rulesEdit: {
    name: {validator: required},
    idcard: [
      {validator: required},
      {len: 18, message: "身份证长度不对"}
    ],
    teacherid: {validator: required},
    phone: {validator: validatePhone}
  }
}
