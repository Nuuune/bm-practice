import * as types from './mutation-types'

const comStateName = {
  RECEIVE_TEACHERS_CURRLIST: 'teacherList',
  RECEIVE_GROUPS_CURRLIST: 'groupList',
  RECEIVE_RATINGFORM_CURRLIST: 'ratingForm',
  RECEIVE_USERS_CURRLIST: 'usersList'
}

//option{limit: 10, currPage: 1, }
export const setCurrPage = function ({ commit, state }, option) {
  let currPage = option.currPage || 1;
  let limit = option.limit || 10;
  let type = option.type;
  if (!type) {
    throw Error('类型不存在')
  }
  commit(type, state[comStateName[type]].allList.slice((currPage - 1) * limit, limit * currPage));
}
