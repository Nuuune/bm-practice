<template>
	<div class="BETeacherList">
		<Table
			:dataList="ratingForms"
			:columns="columns"
			:EAndDoperation="true"
			@show-editDialog="ediShow"
			@show-delDialog="delShow"
			height="400"
			:pagination="pagination"
			@changePage="changePage"
			eBtnIconClass="el-icon-view">
			<h1 style="display: inline" slot="title">评分列表</h1>
			<template slot="right-header">
				<div class="left-float search">
					<el-input
						v-model="search.keyword"
						placeholder="输入表名搜索"
						size="medium"
				 		type="text"
						@keyup.enter.native="searching">
				 		<el-button
							slot="append"
							icon="el-icon-search"
							@click="searching"></el-button></el-input></div>
				<div class="left-float" style="margin-left:10px">
					<el-button
						type="primary"
						size="medium"
						icon="el-icon-plus"
						@click="addShow">新增评选表</el-button></div></template></Table>

		<el-dialog
			class="checkTable"
			:visible.sync="checkTable.visible"
			:title="checkTable.title"
			:show-close="false"
			@close="initCheckTable">
			<transition
				name="fade"
				mode="out-in">
				<div
					v-if="checkTable.index"
					key="check-index">
					<el-row
						:gutter='20'>
						<el-col :span="8"><p>A分个数：{{checkTable.data.acount}}</p></el-col>
						<el-col :span="8"><p>B分个数：{{checkTable.data.bcount}}</p></el-col>
						<el-col :span="8"><p>C分个数：{{checkTable.data.ccount}}</p></el-col>
					</el-row>
					<el-row
						:gutter='20'>
						<el-col :span="12"><p>开始时间：{{checkTable.data.stime}}</p></el-col>
						<el-col :span="12"><p>结束时间：{{checkTable.data.etime}}</p></el-col>
					</el-row>
					<el-row
						:gutter='20'
						type='flex'
						justify='center'>
						<el-col :span="6">
							<el-button
                size="mini"
                type="primary"
                @click="openTeacherData('ratinged')">查看被评教师</el-button></el-col>
						<el-col :span="6">
							<el-button
								size="mini"
								type="primary"
								@click="openTeacherData('rating')">查看评选教师</el-button></el-col>
						<el-col :span="6">
							<el-button
								size="mini"
								type="primary"
								@click="openTeacherData('selfRating')">查看互评教师</el-button></el-col></el-row>
						<el-row
							:gutter='20'
							type='flex'
							justify='center'>
							<el-col
								v-for="type in checkTable.data.ratingtype"
								:key="type + '-btn'"
								:span="6">
								<el-button
									size="mini"
									type="primary"
									@click="ratingTypeHandle(type)"
									v-text="getText(type)"></el-button></el-col>
							<el-col
								:span="6">
								<el-button
									size="mini"
									type="primary"
									@click="nyetRatingBtnHandle">尚未评选教师</el-button></el-col></el-row></div>

				<div
					v-if="checkTable.teacherPanel"
					key="check-teacherPanel">
					<el-table
						:data="checkTable.teacherData">
						<el-table-column
							v-for="(col, index) in checkTable.dataColums[checkTable.mode]"
							:prop="col.prop"
							:label="col.name"
							:key="index"></el-table-column></el-table>
					<el-row
						:gutter="10">
						<el-col
							:push="20"
							:span="4">
							<el-button
								size="small"
								type="primary"
								@click="backIndex">返回</el-button></el-col></el-row></div>

			</transition>
		</el-dialog>

	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Table from '../CRUD/Table'
import API from '@/api'
import { RECEIVE_RATINGFORM_CURRLIST } from '@/store/mutation-types'

export default {
	name: "BERatingForm",
	components: {
		Table: Table
	},
	data () {
		return {
			typeText: {
				'cavg': '综合素质',
				'ComprehensiveQuality': '综合素质',
				'eavg': '师德分数',
				'TeacherEthics': '师德分数'
			},
			search: {
				limit: 150,
				offset: 0,
				keyword: "",
			},
			pagination: {
				total: 0,
				pageSize: 5,
				currentPage: 1,
				area: 0
			},
			columns: [
				{name: "评选", prop: "name", width: ""},
				{name: "开始时间", prop: "stime", width: ""},
				{name: "结束时间", prop: "etime", width: ""},
				{name: "更新时间", prop: "utime", width: ""}
			],
			checkTable: {
				mode: 'mode1',
				visible: false,
				title: '表名',
				index: true,
				teacherPanel: false,
				teacherData: {},
				dataColums: {
					'mode1': [
						{name: '姓名', prop: "name", width: ""},
						{name: '教师号', prop: "teacherid", width: ""},
						{name: '手机号', prop: "phone", width: ""},
						{name: '分组', prop: "groupnamelist", width: ""}
					],
					'mode2': [
						{name: '姓名', prop: "name", width: ""},
						{name: '教师号', prop: "teacherid", width: ""},
						{name: '手机号', prop: "phone", width: ""},
						{name: '分组', prop: "groupnamelist", width: ""},
						{name: '分数', prop: "avg", width: ""}
					]
				},
				data: {
					name: '',
					ratingtype: [],
					acount: 0,
					bcount: 0,
					ccount: 0,
					stime: '',
					etime: '',
					ratingteacher: [],
					ratingedteacher: [],
					selfratingteacher: []
				}
			}
		}
	},
	methods: {
		nyetRatingBtnHandle () {
			API.getnotcomplete(this.checkTable.data.id)
			.then(resp => {
				this.checkTable.mode = 'mode1'
				this.checkTable.teacherData = resp
				this.checkTable.index = false;
				this.checkTable.teacherPanel = true
			}).catch(err => {
				this.$message.error(err)
			})
		},
		ratingTypeHandle (type) {
			API.getavglist(this.checkTable.data.id, type)
			.then(resp => {
				this.checkTable.mode = 'mode2'
				this.checkTable.teacherData = resp
				this.checkTable.index = false;
				this.checkTable.teacherPanel = true
			}).catch(err => {
				this.$message.error(err)
			})
		},
		getText (type) {
			return '查看' + this.typeText[type]
		},
		initCheckTable () {
			let table = this.checkTable;
			table.index = true;
			table.teacherPanel = false;
			table.teacherData = {};
		},
		backIndex () {
			this.checkTable.index = true;
			this.checkTable.teacherPanel = false
		},
		openTeacherData(type) {
			switch (type) {
				case 'ratinged':
					this.checkTable.teacherData = this.checkTable.data.ratingedteacher;
					break;
				case 'rating':
					this.checkTable.teacherData = this.checkTable.data.ratingteacher;
					break;
				case 'selfRating':
					this.checkTable.teacherData = this.checkTable.data.selfratingteacher;
					break;
				default:
					;
			}
			this.checkTable.mode = 'mode1'
			this.checkTable.index = false;
			this.checkTable.teacherPanel = true
		},
		changePage (currPage) {
			let queryLimit = this.search.limit; // 需要和API请求的limit一致
			let pageSize = this.pagination.pageSize;
			let area = ~~((currPage - 1) * pageSize / queryLimit); // 当前页码区间，如果区间变更需要重新请求
			let page = currPage - (queryLimit / pageSize * area);	//相对区间的页码

			if(area !== this.pagination.area) {
				this.search.offset = area * queryLimit
				this.$store.dispatch('getALLRatingForms', this.search);
				this.pagination.area = area;
			}

			this.$store.dispatch('setCurrPage', {currPage: page, limit: pageSize, type: RECEIVE_RATINGFORM_CURRLIST})
		},
		searching () {
			this.$store.dispatch('getALLRatingForms', this.search);
			this.changePage(1)
		},
		ediShow (o) {
			this.checkTable.title = o.row.name;
			this.checkTable.data = o.row;
			this.checkTable.visible = o.flag;
		},
		addShow () {
			this.$router.push({name:'addForm'})
		},

		delShow (o) {
			this.$confirm("表名： " + o.row.name + " 将被删除！", "提示", {
				confirmButtonText: "删除",
				cancelButtonText: "取消",
				type: "wraning"
			}).then(() => {
				API.delRatingForm(o.row.id)
				.then(resp => {
					this.$message.success(resp.msg);
					this.$store.dispatch('getALLRatingForms');
          this.changePage(1)
				}, err => {
					this.$message.error("删除失败：" + err);
				})
			}).catch(() => {
				this.$message.info("已取消删除")
			})
		}
	},
	computed: {
		...mapGetters([
      'ratingForms',
			'totalRatingForms',
			'ratingFormsErrMsg',
			'ALLratingForms'
		])
	},
	created () {
		this.$store.dispatch('getALLRatingForms')
	},
	watch: {
		ALLratingForms (newval) {
			this.changePage(1)
		},
		totalRatingForms (newval) {
			this.pagination.total = newval;
			this.changePage(1)
		},
		ratingFormsErrMsg (newval) {
			if(newval !== "") {
				this.$message.error("错误： " + newval);
				this.$router.push({name:"BELogin"})
			}
		},
	}
}
</script>

<style>
.checkTable .el-table { text-align:left; }
.checkTable .el-row { margin: 10px 0; }

.fade-enter, .fade-leave-to {
	opacity: 0;
	transform: translateX(20px);
}
.fade-enter-active, .fade-leave-active {
	transition: all 0.5s;
}
</style>
