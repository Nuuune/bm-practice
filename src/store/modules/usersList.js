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
  users: state => {
    let users = [];
    state.currList.forEach(function(item, index, arr) {
      let user = {
            "id": item.id ? item.id : item['_id'],
            "name": item.name,
            "psword": item.psword,
            "ctime": UTIL.unixToDate(item.ctime * 1000),
            "utime": UTIL.unixToDate(item.utime * 1000)
      };
      users.push(user);
    });
    return users;
  },
  totalUsers: state => {
    return state.count
  },
  userErrMsg: state => {
    return state.errMsg
  },
	ALLusers: state => {
		return state.allList
	}
}


// actions
const actions = {
	getALLUsers ({ commit }, option) {
		console.log(option);
		API.getALLUsers(option).then(
		resp => {
			commit(types.RECEIVE_USERS, resp);
      commit(types.RECEIVE_USERS_COUNT, resp);
      commit(types.RECEIVE_USERS_LIMIT, resp);
      commit(types.RECEIVE_USERS_OFFSET, resp);
		},
		errMsg => {
			commit(types.RECEIVE_USERS_ERRMSG, errMsg)
		})
	}
}

// mutations
const mutations = {
	[types.RECEIVE_USERS] (state, { data }) {
		state.allList = data
	},

  [types.RECEIVE_USERS_COUNT] (state, { count }) {
    state.count = count
  },

  [types.RECEIVE_USERS_LIMIT] (state, { limit }) {
    state.limit = limit
  },

  [types.RECEIVE_USERS_OFFSET] (state, { offset }) {
    state.offset = offset
  },

  [types.RECEIVE_USERS_ERRMSG] (state, errMsg) {
    state.errMsg = errMsg
  },

	[types.RECEIVE_USERS_CURRLIST] (state, currList) {
		state.currList = currList
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
