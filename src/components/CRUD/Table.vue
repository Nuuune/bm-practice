<template>
	<div class="text-left zh-table">
	<header>
		<div class="left-float">
			<slot name="title"></slot>
		</div>
		<div class="right-float">
			<slot name="right-header"></slot>
		</div>
	</header>
	<el-table
		ref="theTable"
		:data="dataList"
		@row-click="selectedRow"
		@selection-change="multiSelectChange"
		row-key="id"
		:max-height="height">
		<el-table-column
			v-if="selectionable"
			type="selection"
			reserve-selection
			width="50"></el-table-column>
		<el-table-column
			v-for="(col, index) in columns"
			:key="index"
			:formatter="formatterForGroup"
			:prop="col.prop"
			:label="col.name"
			:width="col.width"></el-table-column>
		<el-table-column
			v-if="EAndDoperation"
			label="操作"
			fixed="right"
			width="160">
			<template slot-scope="scope">
				<el-button
					:icon="eBtnIconClass"
					class="btn-edit"
					@click="editClicked(scope.row)"></el-button>
				<el-button
					icon="el-icon-delete"
					class="btn-delete"
					@click="delClicked(scope.row)"></el-button></template></el-table-column>
	</el-table>

	<!-- 分页 -->
	<el-pagination
		:key="pagiKey"
	  v-if="pagination.total > pagination.pageSize"
		:total="pagination.total"
		:page-size="pagination.pageSize"
		:current-page.sync="pagination.currentPage"
		layout="prev, pager, next"
		@current-change="changePage"></el-pagination>

	</div>
</template>

<script>

export default {
	name:'Table',
	props: {
		'dataList': {
			type: Array,
			default: function () {
				return []
			}
		},
		'columns': Array,
		'EAndDoperation': Boolean,
		'selectionable': {
			type: Boolean,
			default: false
		},
		'height': String,
		'pagination': Object,
		'eBtnIconClass': {
			type: String,
			default: 'el-icon-edit'
		},
		'selectionClean': Boolean,
		'selectedIdArr': {
			type: Array,
			default: function () {
				return []
			}
		},
		'pagiKey': String
	},
	data () {
		return {
			multiSelected: []
		}
	},
	methods: {
		_initSelected (arr) {
			if(arr.length !== 0) {
				let newArr = arr.map( o => o.id);
				this.dataList.forEach(function (item) {
					if(newArr.indexOf(item.id) !== -1) {
						this.$refs.theTable.toggleRowSelection(item,true);
					}
				}, this)
			}
		},
		multiSelectChange (val) {
			this.multiSelected = val
		},
		getMultiSelectedId () {
			let multiSelectedId = [];
			this.multiSelected.forEach(function(item){
				multiSelectedId.push({id: item.id})
			});
			return multiSelectedId;
		},
		editClicked (row) {
			let o = {
				flag: true,
				row: row
			};
			this.$emit('show-editDialog', o)
		},
		delClicked (row) {
			let o = {
				flag: true,
				row: row
			};
			this.$emit('show-delDialog', o)
		},
		selectedRow (row, event, column) {
			this.$emit('theRow', row)
		},
		formatterForGroup (row, column, cellValue) {
			if (column.property == "grouplist") {
				return row.grouplist.toString();
			}
			return cellValue;
		},
		changePage (currPage) {
			this.$emit('changePage', currPage)
		}

	},
	watch: {
		selectionClean (val) {
			this.$refs.theTable.clearSelection()
		},
		dataList (val) {
			if(this.selectedIdArr.length !== 0){
				this._initSelected(this.selectedIdArr)
			}
		}
	},
	mounted () {
		this.$nextTick(function () {
			this.pagination.currentPage = 1;
			if (this.selectedIdArr.length !== 0) {
				this._initSelected(this.selectedIdArr)
			}
		})
	}

}

</script>

<style>
.zh-table .btn-edit:hover { color: #fff; border-color: #12aacc; background-color: #409eff; }
.zh-table .btn-delete { color: #ff0303; }
.zh-table .btn-delete:hover { color: #fff; border-color: #db7676; background-color: #ff0101; }
.zh-table header > div {height: 68px; line-height: 68px;}
.zh-table header::after {
	display: table;
	content: "";
	clear: both;
}
</style>
