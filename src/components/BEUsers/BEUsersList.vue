<template>
	<div class="BETeacherList">
		<Table
			:dataList="users"
			:columns="columns"
			:EAndDoperation="true"
			@show-editDialog="ediShow"
			@show-delDialog="delShow"
			@theRow="getRow"
			height="400"
			:pagination="pagination"
			@changePage="changePage">
			<h1 style="display: inline" slot="title">管理员列表</h1>
			<template slot="right-header">
				<!-- <div class="left-float search">
					<el-input
						v-model="search.keyword"
						placeholder="输入管理员名搜索"
						size="medium"
				 		type="text"
						@keyup.enter.native="searching">
				 		<el-button
							slot="append"
							icon="el-icon-search"
							@click="searching"></el-button></el-input></div> 后台暂未提供搜索管理员接口 -->
				<div class="left-float" style="margin-left:10px">
					<el-button
						type="primary"
						size="medium"
						icon="el-icon-plus"
						@click="addShow">新增管理员</el-button></div></template></Table>

	</div>
</template>

<script>
//TODO: 搜索事件 请求中缺少了keyword
import { mapGetters } from 'vuex'
import Table from '../CRUD/Table'
import API from '@/api'
import { RECEIVE_USERS_CURRLIST } from '@/store/mutation-types'

export default {
	name: "BEUsersList",
	components: {
		Table: Table
	},
	data () {
		return {
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
				{name: "管理员", prop: "name", width: ""},
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
				this.$store.dispatch('getALLUsers', this.search);
				this.pagination.area = area;
			}

			this.$store.dispatch('setCurrPage', {currPage: page, limit: pageSize, type: RECEIVE_USERS_CURRLIST})
		},
		searching () {
			this.$store.dispatch('getALLUsers', this.search);
			this.changePage(1)
		},
		ediShow (o) {
			this.$prompt('请输入新密码', '修改密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
					API.updateUser({id: o.row.id, psword: value}).then(
						resp => {
							this.$message.success(resp.msg);
							this.$store.dispatch('getALLUsers');
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
			this.$prompt('请输入账号密码 格式:(name:psword)', '新增管理员', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					let arr = value.split(":");
					API.addUser({name: arr[0], psword: arr[1]}).then(
						resp => {
							this.$message.success(resp.msg);
							this.$store.dispatch('getALLUsers');
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
			this.$confirm("管理员： " + o.row.name + " 将被删除！", "提示", {
				confirmButtonText: "删除",
				cancelButtonText: "取消",
				type: "wraning"
			}).then(() => {
				API.delUser(o.row.id)
				.then(resp => {
					this.$message.success(resp.msg);
					this.$store.dispatch('getALLUsers');
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
      'users',
			'totalUsers',
			'userErrMsg',
			'ALLusers'
		])
	},
	created () {
		this.$store.dispatch('getALLUsers')
	},
	watch: {
		ALLusers (newval) {
			this.changePage(1)
		},
		totalUsers (newval) {
			this.pagination.total = newval;
			this.changePage(1)
		},
		userErrMsg (newval) {
			if(newval !== "") {
				this.$message.error("错误： " + newval);
				this.$router.push({name:"BELogin"})
			}
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
