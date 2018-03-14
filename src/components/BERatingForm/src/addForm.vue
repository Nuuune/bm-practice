
<template>
  <div class="addform">
    <transition mode="out-in" name="fade">
      <div class="sub-ratingForm shadow-right-Bottom" v-if="formShow" key="add_form">
        <el-form
          :model="form"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          size="small">

          <el-form-item
            prop="name"
            label="评选表名">
            <el-input
              v-model="form.name"
              placeholder="请输入评选表名"></el-input></el-form-item>

          <el-form-item
            prop="ratingtype"
            label="评分类型">
            <el-select
              v-model="form.ratingtype"
              multiple
              size="small"
              collapse-tags>
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"></el-option></el-select></el-form-item>


          <el-form-item
            prop="acount"
            label="A分个数">
            <el-input-number
              v-model="form.acount"
              size="small"
              :min="0"></el-input-number></el-form-item>

          <el-form-item
            prop="bcount"
            label="B分个数">
            <el-input-number
              v-model="form.bcount"
              size="small"
              :min="0"></el-input-number></el-form-item>

          <el-form-item
            prop="ccount"
            label="C分个数">
            <el-input-number
              v-model="form.ccount"
              :min="0"
              size="small"></el-input-number></el-form-item>


              <el-form-item
                label="评选时间"
                prop="ratingTimeRange">
                <el-date-picker
                  v-model="form.ratingTimeRange"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  range-separator="至"
                  :picker-options="timeOption"></el-date-picker></el-form-item>

              <el-form-item
                prop="ratingedteacher"
                class="inline-box"
                label-width="0">
                <el-button
                  size="small"
                  type="primary"
                  @click="openWinRatinged">设置被评教师</el-button></el-form-item>

              <el-form-item
                prop="ratingteacher"
                class="inline-box"
                label-width="0">
                <el-button
                  size="small"
                  type="primary"
                  @click="openWinRating">设置评选教师</el-button></el-form-item>

              <el-form-item
                prop="selfratingteacher"
                class="inline-box"
                label-width="0">
                <el-button
                  size="small"
                  type="primary"
                  @click="openWinSelfRating">设置互评教师</el-button></el-form-item>

        </el-form>

        <el-row
          :gutter="20"
          class="footer">
          <el-col
            :span="4"
            :offset="16">
            <el-button
            size="small"
            type="primary"
            @click="goToList">取消</el-button></el-col>
          <el-col
            :span="4">
            <el-button
            size="small"
            type="primary"
            @click="submit">提交</el-button></el-col>
        </el-row>
      </div>
      <div class="addform-sub-wrap shadow-right-Bottom" v-if="ratingTeacherShow" key="rating_teacher">
        <Table
          key="rating"
          pagiKey="rating-p"
          ref="ratingTable"
    			:pagination="finalPagination"
    			@changePage="changePage"
          :selectionable="true"
          :dataList="teachers"
          :columns="columns"
          :EAndDoperation="false"
          :selectedIdArr="form.ratingteacher"
          height="400"><h3 style="display: inline" slot="title">请选择评选教师</h3></Table>
        <el-row
          :gutter="10"
          class="footer">
          <el-col
            :span="4"
            :offset="16">
            <el-button
            size="small"
            type="primary"
            @click="backToForm">返回</el-button></el-col>
          <el-col
            :span="4">
            <el-button
            size="small"
            type="primary"
            @click="choosedRating">确认选择</el-button></el-col>
        </el-row>
      </div>
      <div class="addform-sub-wrap shadow-right-Bottom"  v-if="ratingedTeacherShow" key="ratinged_teacher">
        <Table
          key="ratinged"
          ref="ratingedTable"
          pagiKey="ratinged-p"
          :pagination="finalPagination"
          @changePage="changePage"
          :selectionable="true"
          :dataList="teachers"
          :columns="columns"
          :EAndDoperation="false"
          :selectedIdArr="form.ratingedteacher"
          height="400"><h3 style="display: inline" slot="title">请选择被评选教师</h3></Table>

        <el-row
          :gutter="10"
          class="footer">
          <el-col
            :span="4"
            :offset="16">
            <el-button
            size="small"
            type="primary"
            @click="backToForm">返回</el-button></el-col>
          <el-col
            :span="4">
            <el-button
            size="small"
            type="primary"
            @click="choosedRatinged">确认选择</el-button></el-col>
        </el-row>
      </div>
      <div class="addform-sub-wrap shadow-right-Bottom"  v-if="selfRatingedTeacherShow" key="selfrating_teacher">
        <Table
          key="selfRating"
          pagiKey="selfRating-p"
          ref="selfRatingTable"
          :pagination="finalPagination"
          @changePage="changePage"
          :selectionable="true"
          :dataList="teachers"
          :columns="columns"
          :EAndDoperation="false"
          :selectedIdArr="form.selfratingteacher"
          height="400"><h3 style="display: inline" slot="title">请选择互评选教师</h3></Table>

        <el-row
          :gutter="10"
          class="footer">
          <el-col
            :span="4"
            :offset="16">
            <el-button
            size="small"
            type="primary"
            @click="backToForm">返回</el-button></el-col>
          <el-col
            :span="4">
            <el-button
            size="small"
            type="primary"
            @click="choosedSelfRating">确认选择</el-button></el-col>
        </el-row>
      </div>
    </transition>

  </div>
</template>

<script>
import Table from '@/components/CRUD/Table.vue'
import { mapGetters } from 'vuex'
import BETeacherList from '@/components/BETeacher/BETeacherList'
import Conf from './formConf.js'
import API from '@/api'

export default {
  name: 'ratingAddForm',
  mixins: [BETeacherList],
  components: {
    Table: Table
  },
  data () {
    return {
      rules: Conf.rulesADD(this),
      timeOption: {
        disabledDate (time) {
          return time.getTime() < Date.now();
        }
      },
      columns: [
				{name: "姓名", prop: "name", width: ''},
				{name: "教师号", prop: "teacherid", width: ''},
				{name: "手机号", prop: "phone", width: ''},
				{name: "分组", prop: "grouplist", width: ''}
			],
      form: {
        name: '',
        ratingtype: [],
        acount: 0,
        bcount: 0,
        ccount: 0,
        stime: '',
        etime: '',
        ratingteacher: [],
        ratingedteacher: [],
        selfratingteacher: [],
        ratingTimeRange: ''
      },
      typeOption: [{
        value: 'cavg',
        label: '综合素质'
      }, {
        value: 'eavg',
        label: '师德分数'
      }],
      formShow: true,
      ratingTeacherShow: false,
      ratingedTeacherShow: false,
      selfRatingedTeacherShow: false
    }
  },
  watch: {
    'form.ratingTimeRange': function (val) {
      this.form.stime = Math.floor(val[0].getTime() / 1000);
      this.form.etime = Math.floor(val[1].getTime() / 1000);
    }
  },
  methods: {
    openWinSelfRating () {
      this.formShow = false;
      this.selfRatingedTeacherShow = true;
    },
    openWinRating () {
      this.formShow = false;
      this.ratingTeacherShow = true;
    },
    openWinRatinged () {
      this.formShow = false;
      this.ratingedTeacherShow = true;
    },
    openWinForm () {
      this.selfRatingedTeacherShow = false;
      this.ratingTeacherShow = false;
      this.ratingedTeacherShow = false;
      this.formShow = true;
    },
    backToForm () {
      this.openWinForm();
    },
    choosedSelfRating () {
      this.form.selfratingteacher = this.$refs.selfRatingTable.getMultiSelectedId();
      this.openWinForm();
    },
    choosedRating () {
      this.form.ratingteacher = this.$refs.ratingTable.getMultiSelectedId();
      this.openWinForm();
    },
    choosedRatinged () {
      this.form.ratingedteacher = this.$refs.ratingedTable.getMultiSelectedId();
      this.openWinForm();
    },
    submit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          delete this.form.ratingTimeRange // 提交时无需此字段
          API.addRatingForm(this.form)
          .then( resp => {
            this.$message.success(resp.msg);
            this.goToList()
          })
          .catch( err => {
            this.$message.error(err)
          })
        }else {
          return false
        }
      })
    },
    goToList () {
      this.$refs.addForm.resetFields();
      this.$router.replace({name: 'BERatingForm'});
    }
  }
}
</script>

<style>
.el-col .el-button { width: 100%;}
.inline-box { display: inline-block;}
.addform { padding: 10px;}
.addform-sub-wrap {
  width: 80%;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 30px;
  box-sizing: border-box;
}
.sub-ratingForm {
  text-align: left;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}
.shadow-right-Bottom {
  box-shadow: 2px 2px 8px 0px;
}
.footer {margin-top: auto; margin-bottom: 0;}
</style>
