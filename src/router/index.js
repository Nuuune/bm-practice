import Vue from 'vue'
import Router from 'vue-router'
import BELogin from '@/components/BELogin/Login'
import BEIndex from '@/components/BEIndex/Index'
import BETeacherList from '@/components/BETeacher/BETeacherList'
import BETemplate from '@/components/BETeamplate'
import BEGroupList from '@/components/BEGroup/BEGroupList'
import BEUsersList from '@/components/BEUsers/BEUsersList'
import BERatingForm from '@/components/BERatingForm/BERatingForm'
import addForm from '@/components/BERatingForm/src/addForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/manage/login',
      alias: '/manage',
      name: 'BELogin',
      component: BELogin
    },
    {
      path: '/manage/:id',
      name: 'BEIndex',
      component: BEIndex,
      children: [
      	{
      	  path: 'teacherList',
      	  name: 'BETeacherList',
      	  component: BETeacherList
      	},
        {
          path: 'groupList',
          name: 'BEGroupList',
          component: BEGroupList
        },
        {
          path: 'usersList',
          name: 'BEUsersList',
          component: BEUsersList
        },
        {
          path: 'ratingFormList',
          name: 'BERatingForm',
          component: BERatingForm
        },
        {
          path: 'addForm',
          name: 'addForm',
          component: addForm
        }
      ]
    },
    {
        path: '/test/template',
      name: 'BETest',
      component: BETemplate
    }
  ]
})
