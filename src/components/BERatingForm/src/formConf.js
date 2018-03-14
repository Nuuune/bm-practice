import UTIL from '@/util'

const formName = "addForm";

let context = undefined;

//表单域对应中文名
const Name = {
  name: "评选表名",
  ratingtype: "评分类型",
  acount: "A分个数",
  bcount: "B分个数",
  ccount: "C分个数",
  ratingteacher: "评选教师",
  ratingedteacher: "被评选教师",
  selfratingteacher: "互评教师",
  ratingTimeRange: "评选时间"
}

let validateCount = (rule, value, callback) => {
  let totalCount = context.form.acount + context.form.bcount + context.form.ccount;
  if (totalCount <= 0) {
    callback(new Error('评分总个数需要一个以上'))
  }else {
    callback()
  }
}

let validateTeacher = (rule, value, callback) => {
  let totalCount = context.form.acount + context.form.bcount + context.form.ccount
  if (value.length <= 0) {
    callback(new Error('请选择' + Name[rule.field]))
  }else if (rule.field === "ratingedteacher" && value.length < totalCount ) {
    callback(new Error('被评选老师少于评分总个数'))
  }else {
    callback()
  }
}

let validateNotVoidArr = (rule, value, callback) => {

  if (!value || value.length <= 0) {
    callback(new Error('请选择' + Name[rule.field]))
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

let _setContext = (ctx) => {
  context = ctx
}

export default {
  rulesADD (ctx) {
    _setContext(ctx)
    return {
      name: {validator: required},
      ratingtype: {validator: validateNotVoidArr},
      acount: {validator: validateCount},
      bcount: {validator: validateCount},
      ccount: {validator: validateCount},
      ratingteacher: {validator: validateTeacher, trigger: 'change'},
      ratingedteacher: {validator: validateTeacher, trigger: 'change'},
      selfratingteacher: {validator: validateTeacher, trigger: 'change'},
      ratingTimeRange: {validator: validateNotVoidArr }
    }
  }
}
