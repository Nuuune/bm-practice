<template>
	<div class="BETeacherList">
		<Table
			:dataList="grouplist"
			:columns="columns"
			:EAndDoperation="true"
			@show-editDialog="ediShow"
			@show-delDialog="delShow"
			@theRow="getRow"
			height="400"
			:pagination="pagination"
			@changePage="changePage">
			<h1 style="display: inline" slot="title">分组列表</h1>
			<template slot="right-header">
				<div class="left-float search">
					<el-input
						v-model="search.keyword"
						placeholder="输入组名搜索"
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
						@click="addShow">新增分组</el-button></div></template></Table>

	</div>
</template>

<script>

import { mapGetters } from 'vuex'
import Table from '../CRUD/Table'
import API from '@/api'
import { RECEIVE_GROUPS_CURRLIST } from '@/store/mutation-types'

export default {
	name: "BEGroupList",
	components: {
		Table: Table
	},
	data () {
		return {
			grouplist: [],
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
				{name: "组名", prop: "name", width: ""},
				{name: "更新时间", prop: "utime", width: ""}
			],
			theRow: null,
			editMode: ""
		}
	},
	methods: {
		changePage (currPage) {
			let queryLimit = this.search.limit; // 需要和API请求的limit一致
			let pageSize = this.pagination.pageSize;
			let area = ~~((currPage - 1) * pageSize / queryLimit); // 当前页码区间，如果区间变更需要重新请求
			let page = currPage - (queryLimit / pageSize * area);	//相对区间的页码

			if(area !== this.pagination.area) {
				this.search.offset = area * queryLimit
				this.$store.dispatch('getALLGroups', this.search);
				this.pagination.area = area;
			}

			this.$store.dispatch('setCurrPage', {currPage: page, limit: pageSize, type: RECEIVE_GROUPS_CURRLIST})
		},
		searching () {
			this.$store.dispatch('getALLGroups', this.search);
			this.changePage(1)
		},
		ediShow (o) {
			this.$prompt('请输入组名', '修改组名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
					API.updateGroup({id: o.row.id, name: value}).then(
						resp => {
							this.$message.success(resp.msg);
							this.$store.dispatch('getALLGroups');
							this.changePage(1)
						},
						err => {
							this.$message.error(err)
						}
					)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
		},
		addShow () {
			this.$prompt('请输入组名', '新增分组', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					API.addGroup({name: value}).then(
						resp => {
							this.$message.success(resp.msg);
							this.$store.dispatch('getALLGroups');
							this.changePage(1)
						},
						err => {
							this.$message.error(err)
						}
					)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
		},
		delShow (o) {
			console.log(o);
			this.$confirm("组名： " + o.row.name + " 将被删除！", "提示", {
				confirmButtonText: "删除",
				cancelButtonText: "取消",
				type: "wraning"
			}).then(() => {
				API.delGroup({id: o.row.id})
				.then(resp => {
					this.$message.success(resp.msg);
					this.$store.dispatch('getALLGroups');
          this.changePage(1)
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
      'groups',
			'ALLgroups'
		])
	},
	created () {
		this.$store.dispatch('getALLGroups')
	},
	watch: {
		ALLgroups (newval) {
			this.changePage(1)
		},
    groups (newval) {
      this.grouplist = newval
			this.changePage(1)
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
