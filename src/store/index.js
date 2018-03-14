import Vue from 'vue'
import Vuex from 'vuex'
import teacherList from './modules/teacherList'
import groupList from './modules/groupList'
import ratingForm from './modules/ratingForm'
import usersList from './modules/usersList'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  modules: {
    ratingForm,
  	teacherList,
  	groupList,
    usersList
  }
})
