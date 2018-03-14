<template>
	<div class="BETeacherList">
		<Table
			:dataList="teachers"
			:columns="columns"
			:EAndDoperation="true"
			@show-editDialog="ediShow"
			@show-delDialog="delShow"
			@theRow="getRow"
			height="400"
			:pagination="finalPagination"
			@changePage="changePage">
			<h1 style="display: inline" slot="title">教师列表</h1>
			<template slot="right-header">
				<div class="left-float search">
					<el-input
						v-model="search.keyword"
						placeholder="输入姓名搜索"
						size="medium"
				 		type="text"
						@keyup.enter.native="searching">
						<el-select
							v-model="search.groupid"
							clearable
							slot="prepend"
							placeholder="全部分组"
							@change="changeClasses" >
						  <el-option
						    v-for="item in groupSelecter"
						    :key="item.value"
						    :label="item.label"
						    :value="item.value"></el-option>
						</el-select>
				 		<el-button
							slot="append"
							icon="el-icon-search"
							@click="searching"></el-button></el-input></div>
				<div class="left-float" style="margin-left:10px">
					<el-button
						type="primary"
						size="medium"
						icon="el-icon-plus"
						@click="addShow">新增教师</el-button></div></template></Table>

		<editDialog
			v-if="theRow"
			:visible.sync="editDialog.visible"
			:theFormTitle="editDialog.title"
			:rules="editDialog.rules"
			:theData="theRow"
			:columns="editDialog.columns"
			:mode="editMode"></editDialog>

	</div>
</template>

<script>

import { mapGetters } from 'vuex'
import Table from '../CRUD/Table'
import editDialog from './src/editDialog'
import API from '@/api'
import formConf from './src/formConf'
import { RECEIVE_TEACHERS_CURRLIST } from '@/store/mutation-types'

export default {
	name: "BETeacherList",
	components: {
		Table: Table,
		editDialog: editDialog
	},
	data () {
		return {
			classes: [],
			search: {
				limit: 150,
				offset: 0,
				keyword: "",
				groupid: ""
			},
			pagination: {
				total: 0,
				pageSize: 5,
				currentPage: 1,
				area: 0
			},
			columns: [
				{name: "姓名", prop: "name", width: 180},
				{name: "教师号", prop: "teacherid", width: "180"},
				{name: "手机号", prop: "phone", width: 180},
				{name: "分组", prop: "grouplist", width: 180},
				{name: "更新时间", prop: "utime", width: ""}
			],
			editDialog: {
				title: "修改教师",
				visible: false,
				columns: formConf.inputs,
				rules: formConf.rulesEdit
			},
			theRow: null,
			editMode: ""
		}
	},
	methods: {
		changeClasses (currClass) {
			this.$store.dispatch('getALLTeachers', this.search);
			this.changePage(1)
		},
		changePage (currPage) {
			let queryLimit = this.search.limit; // 需要和API请求的limit一致
			let pageSize = this.pagination.pageSize;
			let area = ~~((currPage - 1) * pageSize / queryLimit); // 当前页码区间，如果区间变更需要重新请求
			let page = currPage - (queryLimit / pageSize * area);	//相对区间的页码

			if(area !== this.pagination.area) {
				this.search.offset = area * queryLimit
				this.$store.dispatch('getALLTeachers', this.search);
				this.pagination.area = area;
			}
			this.$store.dispatch('setCurrPage', {currPage: page, limit: pageSize, type: RECEIVE_TEACHERS_CURRLIST});
		},
		searching () {
			this.$store.dispatch('getALLTeachers', this.search);
			this.changePage(1)
		},
		ediShow (o) {
			this.editMode = "edit";
			this.editDialog.title = "修改教师";
			this.editDialog.rules = formConf.rulesEdit;
			this.editDialog.visible = o.flag
		},
		addShow () {
			this.editMode = "add";
			this.editDialog.title = "新增教师";
			this.editDialog.rules = formConf.rulesADD;
			this.theRow = {};
			this.editDialog.visible = true
		},
		delShow (o) {
			this.$confirm("教师号： " + o.row.teacherid + " 将被删除！", "提示", {
				confirmButtonText: "删除",
				cancelButtonText: "取消",
				type: "wraning"
			}).then(() => {
				API.delTeacher(o.row.id)
				.then(resp => {
					this.$message.success(resp.msg);
					this.$store.dispatch('getALLTeachers');
				}, err => {
					this.$message.error("删除失败：" + err);
				})
			}).catch(() => {
				this.$message.info("已取消删除")
			})
		},
		getRow (row) {
			this.theRow = row
		}
	},
	computed: {
		...mapGetters([
			'teachers',
			'totalTeachers',
			'teacherErrMsg',
			'groupSelecter',
			'ALLtechers'
		]),
		finalPagination () {
			return Object.assign(this.pagination, {total: this.totalTeachers})
		}

	},
	created () {
		this.$store.dispatch('getALLGroups');
		this.$store.dispatch('getALLTeachers');
	},
	watch: {
		ALLtechers (newval) {
			this.changePage(1)
		},
		totalTeachers (newval) {
			this.pagination.total = newval;
			this.changePage(1)
		},
		teacherErrMsg (newval) {
			if(newval !== "") {
				this.$message.error("错误： " + newval);
				this.$router.push({name:"BELogin"})
			}
		},
		groupSelecter (newval) {
			this.classes = newval
		}
	}
}
</script>

<style>
.search {
	width: 450px;
}
.search .el-input-group__prepend {
	width: 25%;
}
</style>
