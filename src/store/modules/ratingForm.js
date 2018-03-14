import API from '../../api'
import * as types from '../mutation-types'
import UTIL from '@/util'

// initial state
const state = {
	allList: [],
	currList: [],
	msg: "",
	code: "0",
	currRating: {
		id: "",
		acount: 0,
		bcount: 0,
		ccount: 0,
		ctime: 0,
		etime: 0,
		stime: 0,
		utime: 0,
		name: "",
		ratingedteacher: [],
		ratingteacher: [],
		ratingtype: [],
		selfratingteacher: []
	},
	count: 0,
	limit: 100000,
	offset: 0,
	errMsg: ""
}

// getters
const getters = {
	ratingForms: state => {
		let forms = [];
		state.currList.forEach(function(item, index, arr) {
			let form = {
				"acount": item.acount,
				"bcount": item.bcount,
				"ccount": item.ccount,
				"id": item.id,
				"name": item.name,
				"ratingedteacher": item.ratingedteacher,
				"ratingteacher": item.ratingteacher,
				"ratingtype": item.ratingtype,
				"selfratingteacher": item.selfratingteacher,
				"stime": UTIL.unixToDate(item.stime * 1000),
				"etime": UTIL.unixToDate(item.etime * 1000),
				"utime": UTIL.unixToDate(item.utime * 1000),
				"ctime": UTIL.unixToDate(item.utime * 1000)
			};
			forms.push(form);
		});
		return forms;
	},
	totalRatingForms: state => {
		return state.count
	},
	ratingFormsErrMsg: state => {
		return state.errMsg
	},
	ALLratingForms: state => {
		return state.allList
	}
}


// actions
const actions = {
	getALLRatingForms ({ commit }, option) {
		API.getALLRatingForms(option).then(
		resp => {
			commit(types.RECEIVE_RATINGFORM, resp);
      commit(types.RECEIVE_RATINGFORM_COUNT, resp);
      commit(types.RECEIVE_RATINGFORM_LIMIT, resp);
      commit(types.RECEIVE_RATINGFORM_OFFSET, resp);
		},
		errMsg => {
			commit(types.RECEIVE_RATINGFORM_ERRMSG, errMsg)
		})
	}
}

const mutations = {
	[types.RECEIVE_RATINGFORM] (state, { data }) {
		state.allList = data
	},

	[types.RECEIVE_RATINGFORM_COUNT] (state, { count }) {
    state.count = count
  },

  [types.RECEIVE_RATINGFORM_LIMIT] (state, { limit }) {
    state.limit = limit
  },

  [types.RECEIVE_RATINGFORM_OFFSET] (state, { offset }) {
    state.offset = offset
  },

  [types.RECEIVE_RATINGFORM_ERRMSG] (state, errMsg) {
    state.errMsg = errMsg
  },

	[types.RECEIVE_RATINGFORM_CURRLIST] (state, currList) {
		state.currList = currList
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
