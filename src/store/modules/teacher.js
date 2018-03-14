import API from '../../api'
import * as types from '../mutation-types'

// initial state
const state = {
	"id":"",
	"name":"",
	"sex":"",
	"pic":"",
	"idcard":"",
	"teacherid":"",
	"birthday":0,
	"phone":"",
	"grouplist":null,
	"ctime":0,
	"utime":0
}

// getters
const getters = {
	getTeacher: state => {
		
	}
}

// actions
const actions = {
	getAllTeachers ({ commit }) {
		API.getAllTeachers().then(
		resp => {
			commit(types.RECEIVE_TEACHERS, { resp.data });
			commit(types.RECEIVE_TEACHERS_COUNT, { resp.count });
			commit(types.RECEIVE_TEACHERS_LIMIT, { resp.limit });
			commit(types.RECEIVE_TEACHERS_OFFSET, { resp.offset })
		},
		errMsg => {
			this.$message.error('获取失败 msg:' + errMsg0 )
		})
	}
}

// mutations
const mutations = {
	[types.RECEIVE_TEACHERS] (state, { teacherList }) {
		state.allList = teacherList
	},

	[types.RECEIVE_TEACHERS_COUNT] (state, { count }) {
		state.count = count
	},

	[types.RECEIVE_TEACHERS_LIMIT] (state, { limit }) {
		state.limit = limit
	},

	[types.RECEIVE_TEACHERS_OFFSET] (state, { offset }) {
		state.offset = offset
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
