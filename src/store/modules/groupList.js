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

// getters
const getters = {
	groups: state => {
		let groups = [];
		state.allList.forEach(function(item, index, arr) {
			let group = {
						"id": item.id ? item.id : item["_id"],
						"name": item.name,
						"utime": UTIL.unixToDate(item.utime * 1000)
			};
			groups.push(group);
		});
		return groups;
	},
	//配合element-ui T-columnsAttr filters: [{text: "t", value: "t"}]
	groupFilter: state => {
		let arr = [];
		state.allList.forEach(function(item) {
			let o = {};
			o.text = item.name;
			o.value = item.name;
			arr.push(o);
		});
		return arr;
	},
	//配合element-ui Select选择器 分组选择 option: [{value:"xx", label:"ss"}]
	groupSelecter: state => {
		let option = [];
		state.allList.forEach(function(item) {
			let o = {};
			o.value = item.id ? item.id : item['_id'];
			o.label = item.name;
			option.push(o);
		});
		return option;
	},
	ALLgroups: state => {
		return state.allList
	}
}


// actions
const actions = {
	getALLGroups ({ commit }, option) {
		API.getALLGroups(option).then(
		resp => {
			commit(types.RECEIVE_GROUPS, resp);
      commit(types.RECEIVE_GROUPS_COUNT, resp);
      commit(types.RECEIVE_GROUPS_LIMIT, resp);
      commit(types.RECEIVE_GROUPS_OFFSET, resp);
		},
		errMsg => {
			commit(types.RECEIVE_GROUPS_ERRMSG, errMsg)
		})
	}
}

// mutations
const mutations = {
	[types.RECEIVE_GROUPS] (state, { data }) {
		state.allList = data
	},

	[types.RECEIVE_GROUPS_COUNT] (state, { count }) {
    state.count = count
  },

  [types.RECEIVE_GROUPS_LIMIT] (state, { limit }) {
    state.limit = limit
  },

  [types.RECEIVE_GROUPS_OFFSET] (state, { offset }) {
    state.offset = offset
  },

  [types.RECEIVE_GROUPS_ERRMSG] (state, errMsg) {
    state.errMsg = errMsg
  },

	[types.RECEIVE_GROUPS_CURRLIST] (state, currList) {
		state.currList = currList
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
