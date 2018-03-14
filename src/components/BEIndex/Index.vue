<template>
	<el-container class="be_index">
		<el-header>
			{{$route.params.id}}
		</el-header>
		<el-container>
			<el-aside width="200px">
				<h5>导航栏</h5>
				<el-menu
					class="text-left"
					:router= "true"
					:default-active= urlIndex
					:unique-opened= "true">
					<!-- 首页栏目 暂时不需要 S-->
					<!-- <el-submenu index="1">
						<template slot="title">
							<i class="el-icon-ex-home"></i>
							<span>后台首页</span>
						</template> -->
						<!-- 展示基本信息 S-->
						<!-- <el-menu-item index="1-1">基本信息</el-menu-item> -->
						<!-- 展示基本信息 E-->
					<!-- </el-submenu> -->
					<!-- 首页栏目 E-->
					<!-- 教师管理 S-->
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span>教师管理</span>
						</template>
						<el-menu-item index="teacherList">
							教师列表
						</el-menu-item>
						<el-menu-item index="groupList">
							教师分组
						</el-menu-item>
					</el-submenu>
					<!-- 教师管理 E-->
					<!-- 评选相关 S-->
					<el-submenu index="3">
						<template slot="title">
							<i class="el-icon-menu"></i>
							<span>评选相关</span>
						</template>
						<el-menu-item index="ratingFormList">
							评选表列表
						</el-menu-item>
					</el-submenu>
					<!-- 评选相关 E-->
					<!-- 用户管理 S-->
					<el-submenu index="4">
						<template slot="title">
							<i class="el-icon-ex-user"></i>
							<span>用户管理</span>
						</template>
						<el-menu-item index="usersList">
							管理员列表
						</el-menu-item>
					</el-submenu>
					<!-- 用户管理 E-->
				</el-menu>
			</el-aside>

			<el-container>
				<el-main>
					<router-view />
				</el-main>
				<el-footer>@Nuuune</el-footer>
			</el-container>

		</el-container>
	</el-container>
</template>

<script>

export default {
	name: 'BEIndex',
	data () {
		return {
		  urlIndex: ""
		}
	},
	beforeMount: function() {
		//获取url最后一段作为索引 激活导航
		this.urlIndex = window.location.href.split("/").slice(-1).toString()
	}
}

</script>

<style>

.be_index { height: inherit; }
.be_index > .el-header {
	background-color: #303133;
	color: #fff;
	line-height: 60px;
}
.be_index > .el-container > .el-container > .el-footer {
	background-color: #fff;
	padding-top: 10px;
	color: #333;
	line-height: 20px;
	font-size: 14px;
}
.be_index > .el-container > .el-aside {
	background-color: #fff;
	color:  #303133;
}

</style>
