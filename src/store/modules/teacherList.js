import API from '../../api'
import * as types from '../mutation-types'
import UTIL from '@/util'

// initial state
const state = {
	allList: [],
	currList: [],
	count: 0,
	limit: 100000,
	offset: 0,
	errMsg: ""
}
//格式化 grouplist
//output: {ids: ["2222"], names: ["zxcxc"]}
function grouplistFormat (grouplist) {
		let arrForId = [];
		let arrForName = [];
		if(grouplist) {
			grouplist.forEach(function(item) {
				arrForName.push(item.name),
				arrForId.push(item.id ? item.id : item['_id'])
			})
		};
		let o = {};
		o.ids = arrForId;
		o.names = arrForName;
		o.toString = () => {
			return o.names ? o.names.join(", ") : ""
		}
		return o;
}

// getters
const getters = {
	teachers: state => {
		let teachers = [];
		state.currList.forEach(function(item, index, arr) {
			let teacher = {
						"id": item.id ? item.id : item['_id'],
						"name": item.name,
						"sex": item.sex,
						"pic": item.pic,
						"idcard": item.idcard,
						"teacherid": item.teacherid,
						"birthday": item.birthday,
						"phone": item.phone,
						"grouplist": grouplistFormat(item.grouplist),
						"ctime": UTIL.unixToDate(item.ctime * 1000),
						"utime": UTIL.unixToDate(item.utime * 1000)
			};
			teachers.push(teacher);
		});
		return teachers;
	},
	totalTeachers: state => {
		return state.count
	},
	teacherErrMsg: state => {
		return state.errMsg
	},
	ALLtechers: state => {
		return state.allList
	}
}

// actions
const actions = {
	getALLTeachers ({ commit, state }, option) {
		API.getALLTeachers(option).then(
		resp => {
			commit(types.RECEIVE_TEACHERS, resp);
			commit(types.RECEIVE_TEACHERS_COUNT, resp);
			commit(types.RECEIVE_TEACHERS_LIMIT, resp);
			commit(types.RECEIVE_TEACHERS_OFFSET, resp);
		},
		errMsg => {
			commit(types.RECEIVE_TEACHERS_ERRMSG, errMsg)
		});
	}
}

// mutations
const mutations = {
	[types.RECEIVE_TEACHERS] (state, { data }) {
		state.allList = data
	},

	[types.RECEIVE_TEACHERS_COUNT] (state, { count }) {
		state.count = count
	},

	[types.RECEIVE_TEACHERS_LIMIT] (state, { limit }) {
		state.limit = limit
	},

	[types.RECEIVE_TEACHERS_OFFSET] (state, { offset }) {
		state.offset = offset
	},

	[types.RECEIVE_TEACHERS_ERRMSG] (state, errMsg) {
		state.errMsg = errMsg
	},

	[types.RECEIVE_TEACHERS_CURRLIST] (state, currList) {
		state.currList = currList
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
