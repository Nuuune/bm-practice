
<template>
	<!--编辑面板 S-->
	<el-dialog
		custom-class="editDialog"
		:title="theFormTitle"
		:visible="openWin"
		@update:visible="val => openWin = val"
		@close="cleanForm"
		@open="cleanFormValidate">
		<!--编辑表单 S-->
		<el-form
			:model="theForm"
			ref="editForm"
			size="mini"
			:rules="rules"
			v-if="theForm"
			:key="getForm.id ? getForm.id : ''">

			<template
				v-for="(col, index) in columns">

					<el-form-item
						:class="[(col.prop == 'pic') ? 'form-img' : '']"
						:prop="col.prop ? col.prop : ''"
						:key="index"
						:label="col.name ? col.name : ''">

						<template
							v-if="col.prop === 'pic'">
							<div class="img-wrap">
								<img :src="imgUrl" />
								<div
									class="progress-wrap"
									v-show="progress.show">
									<el-progress
										:percentage="progress.progress"
										class="img-wrap_progress"
										:width="80"
										type="circle"></el-progress></div></div>
							<el-upload
								:action="url"
								:show-file-list="false"
								:on-success="successed"
								:on-progress="onProgress">
								<el-button
									size="mini"
									type="primary">
									上传头像</el-button></el-upload></template>

						<el-select
							v-else-if="col.prop === 'groupidlist'"
							v-model="theForm.groupidlist"
							collapse-tags
							multiple
							placeholder="请选择分组">
							<el-option
								v-for="op in groupSelecter"
								:key="op.value"
								:label="op.label"
								:value="op.value"></el-option></el-select>

						<el-input
							v-else-if="col.prop === 'psword'"
							v-model="theForm[col.prop]"
							type="password"
							:id="col.prop"
							:disabled="paswordDisable"></el-input>

						<el-input
							v-else
							v-model="theForm[col.prop]"
							:type="col.type ? col.type : 'text'"
							:id="col.prop"></el-input>
					</el-form-item></template></el-form>
		<!--编辑表单 E-->



		<!--面板按钮 S-->
		<template
			slot="footer">
			<template
				v-if="mode === 'edit'">
				<el-button
					type="primary"
					icon="el-icon-refresh"
					@click="resetPsword">重置密码</el-button>
				<el-button
					type="success"
					icon="el-icon-check"
					:loading="updating"
					@click="update">确认</el-button></template>

			<el-button
				v-else
				type="success"
				icon="el-icon-check"
				@click="add">确认</el-button>
		</template>
		<!--面板按钮 E-->
	</el-dialog>
	<!--编辑面板 E-->
</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'

export default {
	name: 'teacherEdit',
	data () {
		return {
			hostUrl: "http://cac1af63.ngrok.io",
			updating: false,
			url: "http://localhost:5002/app/file/upload",
			defaultUrl: "http://zhzhouse.com/assets/photo.png",
			imgUrl: "",
			theForm: null,
			progress: {
				show: false,
				progress: 0
			}
		}
	},
	props: ["theData","columns","visible","mode","theFormTitle","rules"],
	methods: {
		cleanForm() {
			console.log('cleanForm');
			this.$refs.editForm.resetFields();
			this.imgUrl = this.defaultUrl;
		},
		cleanFormValidate() {
			console.log('cleanForm2');
			this.$refs.editForm.clearValidate();
		},
		resetPsword () {
			let id = this.theForm.id;
			this.$prompt('请输入新密码', "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
			}).then(({value}) => {
				API.resetTeacherPsword(id, value).then(resp => {
					this.$message.success(resp.msg)
				}).catch(err => {
					this.$message.error(err)
				});
			}).catch(() => {
				this.$message.info("取消重置密码")
			})
		},
		add () {
			this.$refs.editForm.validate((valid) => {
				if(valid) {
					API.addTeacher(this.theForm)
						.then(resp => {
							this.$message.success(resp.msg);
							this.$store.dispatch('getALLTeachers');
							this.openWin = false
						}, err => {
							this.$message.error(err.msg)
						});
				} else {
					return false
				}
			})
		},
		update () {
			this.$refs.editForm.validate((valid) => {
				if(valid) {
					this.updating = true;
					API.updateTeacher(this.theForm)
						.then(resp => {
							this.$message.success(resp.msg);
							this.updating = false;
							this.$store.dispatch('getALLTeachers');
							this.openWin = false
						}, err => {
							this.$message.error(err.msg);
							this.updating = false
						});
				} else {
					return false
				}
			})
		},
		onProgress (e, file, filelist ) {
			this.progress.show = true;
			this.progress.progress = e.percent > 98 ? 98 : e.percent;
		},
		successed (response, file, filelist) {
			this.progress.progress = 100;
			this.$nextTick(function(){
				this.progress.show = false;
				this.theForm.pic = response.data.url;
				this.progress.progress = 0;
				this.$message.success("上传成功");
				this.imgUrl = URL.createObjectURL(file.raw);
			})
		}
	},
	computed: {
		openWin: {
			set(val) {
				this.$emit('update:visible', val)
			},
			get() {
				return this.visible
			}
		},
		getForm () {
			let form = {};
			let theData = this.theData;
			//初始化相片
			this.imgUrl = this.defaultUrl;
			//动态渲染表单
			if(this.mode === "edit"){

				if(theData.pic !== "") {
					this.imgUrl = this.hostUrl + theData.pic;
				}

				form.id = theData.id;
				form.groupidlist = theData.grouplist.ids ? theData.grouplist.ids : [];
				this.columns.forEach(item => {
					if(item.prop !== 'groupidlist')
						form[item.prop] = theData[item.prop];
				});
			} else {
				form.groupidlist = [];
				this.columns.forEach(item => {
					if(item.prop !== 'groupidlist')
						form[item.prop] = "";
				});
			}

			return form;
		},
		paswordDisable () {
			return this.mode === "edit" ? true : false
		},
		...mapGetters([
			'groupSelecter'
		])
	},
	watch: {
		getForm (val) {
			this.theForm = val
		}
	},
	created () {
		this.theForm = this.getForm
	}
}
</script>

<style >
.editDialog .el-form { display: flex; flex-flow: row wrap; justify-content: space-around;}
.form-img { width: 100%;}
.img-wrap { position:relative; width: 100px; height: 100px; margin: 0 auto 5px;}
.img-wrap > img { width: 100%; height: 100%}
.progress-wrap { position: absolute; left: 0; top: 0; width: 100px; height: 100px; line-height: 100px; background-color: rgba(75,75,75,0.8)}
.img-wrap_progress {vertical-align: middle;}
.el-progress__text {color: #fff !important;}
.editDialog .el-input__inner {height: 28px !important;}
@media screen and (min-width:1200px){
    .editDialog { width: 660px; }
}
@media screen and (min-width: 768px) and (max-width: 1199px) {
    .editDialog { width: 500px; }
}
</style>
