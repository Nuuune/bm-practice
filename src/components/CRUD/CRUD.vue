<template>
	<div class="text-left zh-crud">
	<h1>
		this is CRUD page
	</h1>
	<el-table
		:data="dataList"
		@row-click="setEditing"
		@selection-change="selectHandle">

		<el-table-column
			type="selection"
			fixed="left"></el-table-column>

		<el-table-column
			prop="id"
			label="id"
			width="180">
		</el-table-column>
		<el-table-column
			prop="name"
			label="姓名"
			width="180">
		</el-table-column>	
		<el-table-column
			prop="age"
			label="年龄"
			width="100">
		</el-table-column>	
		<el-table-column
			prop="address"
			label="地址">
		</el-table-column>	
		<el-table-column
			label="操作"
			fixed="right"
			width="200">
			<template slot-scope="scope">
				<el-button
				icon="el-icon-edit" class="btn-edit" @click="editDialogVisible=true"></el-button>		
				<el-button
				icon="el-icon-delete" class="btn-delete" @click="deleteDialogVisible=true"></el-button>			
			</template>
		</el-table-column>		
	</el-table>
	<!--其他按钮块 （新增行  /  删除所选行）-->
	<div style="margin-top: 20px;">
		<el-button
			icon="el-icon-plus" 
			class="btn-edit"
			@click="createDialogVisible=true">
			新增一行
		</el-button>
		<el-button
			icon="el-icon-delete" 
			class="btn-delete"
			@click="deleteDialogVisible=true">
			删除所选
		</el-button>
	</div>
	<!--编辑面板 S-->
	<el-dialog
		title="编辑修改"
		:visible.sync="editDialogVisible"
		@close="closeEditDialog">
		<!--编辑表单 S-->
		<el-form
			:model="editing"
			:rules="rule1"
			:inline="true"
			ref="editForm"	
			size="mini">

			<el-form-item
				prop="name"
				label="姓名">
				<el-input
					v-model="editing.name"
					type="text"
					id="name"></el-input></el-form-item>

			<el-form-item
				prop="age"
				label="年龄">
				<el-input
					v-model="editing.age"
					type="tel"
					id="age"></el-input></el-form-item>

			<el-form-item
				prop="address"
				label="地址">
				<el-input
					v-model="editing.address"
					type="text"
					id="address"></el-input></el-form-item></el-form>
		<!--编辑表单 E-->
		<!--面板按钮 S-->
		<template slot="footer">
			<el-button 
				type="success" 
				icon="el-icon-check"
				:loading="updating"
				@click="update(editing)">确认</el-button>
		</template>			
		<!--面板按钮 E-->			
	</el-dialog>
	<!--编辑面板 E-->
	<!--删除面板 S-->
	<el-dialog
		:visible.sync="deleteDialogVisible"
		title="删除如下信息"
		@close="closeDeleteDialog">
		<el-row
			:gutter="20"
			style="border-bottom: 1px solid #d8d8d8;">
			<el-col :span="4">id</el-col>
			<el-col :span="4">姓名</el-col>
			<el-col :span="4">年龄</el-col>
			<el-col :span="12">地址</el-col>
		</el-row>
		<template v-if="this.editing.id !== ''">
			<el-row
				:gutter="20">
				<el-col :span="4">{{this.editing.id}}</el-col>
				<el-col :span="4">{{this.editing.name}}</el-col>
				<el-col :span="4">{{this.editing.age}}</el-col>
				<el-col :span="12">{{this.editing.address}}</el-col>
			</el-row>
			<el-button 
				slot="footer" 
				icon="el-icon-delete" 
				type="danger"
				@click="del(editing)"></el-button>
		</template>
		<template v-else>
			<el-row
				:gutter="20"
				v-for="item in editings" :key="item.id">
				<el-col :span="4">{{item.id}}</el-col>
				<el-col :span="4">{{item.name}}</el-col>
				<el-col :span="4">{{item.age}}</el-col>
				<el-col :span="12">{{item.address}}</el-col>
			</el-row>
			<el-button 
				slot="footer" 
				icon="el-icon-delete" 
				type="danger"
				@click="del(editings)"></el-button>
		</template>
	</el-dialog>
	<!--删除面板 E-->
	<!--新增面板 S-->
	<el-dialog
		title="新增行"
		:visible.sync="createDialogVisible"
		@close="closeCreatetDialog">
		<!--编辑表单 S-->
		<el-form
			:model="newRow"
			:rules="rule1"
			:inline="true"
			ref="newRowForm"	
			size="mini">

			<el-form-item
				prop="name"
				label="姓名">
				<el-input
					v-model="newRow.name"
					type="text"
					id="name"></el-input></el-form-item>

			<el-form-item
				prop="age"
				label="年龄">
				<el-input
					v-model="newRow.age"
					type="tel"
					id="age"></el-input></el-form-item>

			<el-form-item
				prop="address"
				label="地址">
				<el-input
					v-model="newRow.address"
					type="text"
					id="address"></el-input></el-form-item></el-form>
		<!--编辑表单 E-->
		<!--面板按钮 S-->
		<template slot="footer">
			<el-button 
				type="success" 
				icon="el-icon-check"
				@click="creat(newRow)">确认</el-button>
		</template>			
		<!--面板按钮 E-->			
	</el-dialog>
	<!--新增面板 E-->
	</div>
</template>

<script>

export default {
	name:'BECRUD',
	data () {
		//测试数据		
		let item = {id: 1, name: 'zhz', age: 23, address: 'Changsha'};
		let item2 = {id: 2, name: 'xxx', age: 24, address: 'HK'};
		let dataList = [];
		const nullEditing = { id: '', name: '', age: '', address: ''}; //初始化编辑表单的model
		dataList.push(item);
		dataList.push(item2);

		 //自定义不为空的验证规则
	    const required = ( rule, value, callback) => {
	      if(!value) {
	        callback( new Error(rule.field + " is can\'t be void!"));
	      }else {
	        callback();
	      }
	    }

		return {
			dataList: dataList,
			editDialogVisible: false,
			deleteDialogVisible: false,
			createDialogVisible: false,
			editing: nullEditing,
			newRow: nullEditing,
			editings: [], // 多选状态
			updating: false,
			nullEditing: nullEditing,

			rule1: {
				name: [
					{ validator: required, trigger: 'blur'}
				],
				age: [
					{ validator: required, trigger: 'blur'}
				],
				address: [
					{ validator: required, trigger: 'blur'}
				]
			}
		}
	},
	methods: {
		//暂时不接触后台 使用dataList前台模拟数据更新
		creat (nItem) {
			let newID = this.dataList.sort(function(a,b){ a.id - b.id})[this.dataList.length-1].id + 1;
			nItem.id = newID;
			this.dataList.push(nItem);
			this.createDialogVisible = false;
		},
		req (option) {

		},
		update (nItem) {
			//更新updating状态
			this.updating = true;		
			//更新成功的flag
			let up_success = this.dataList.find(function(item){  
				if(item.id === nItem.id) {
					item = nItem;
					return true;
				}
			});

			if(up_success) {
				//弹出成功提示并关闭编辑框
				this.$message({
					message: '修改成功!',
					type: 'success'
				});
				this.editDialogVisible = false;
				//更新updating状态
				this.updating = false;
			}else {
				//弹出错误提示
				this.$message.error('修改失败!');
				//更新updating状态
				this.updating = false;
			}


		},
		del (rows) {
			//如果是删除多个
			let that = this.dataList;
			if(rows instanceof Array) {
				rows.forEach( element => {
					for(let i = 0; i < that.length; i++) {
						if(that[i].id === element.id) {
							that.splice(i,1);			//删除
							break
						}
					}
				});
			}else {
				for(let i = 0; i < that.length; i++) {
						if(that[i].id === rows.id) {
							that.splice(i,1);			//删除
							break
						}
					}
			}

			this.deleteDialogVisible = false;
		},
		setEditing (row, event, cloumn) {
			//如果点击的列是多选列则不改变editing
			if(cloumn.type === 'selection'){ 
				return ;
			}
			this.editing = row
		},
		closeEditDialog () {	
			this.editing = this.nullEditing //清空编辑model
		},
		closeDeleteDialog () {
			this.editing = this.nullEditing
		},
		closeCreatetDialog () {
			this.newRow = this.nullEditing
		},
		selectHandle (selected) {
			this.editings = selected
		}
	}
}

</script>

<style>
.zh-crud .btn-edit:hover { color: #fff; border-color: #12aacc; background-color: #409eff; }
.zh-crud .btn-delete { color: #ff0303; }
.zh-crud .btn-delete:hover { color: #fff; border-color: #db7676; background-color: #ff0101; }

</style>
