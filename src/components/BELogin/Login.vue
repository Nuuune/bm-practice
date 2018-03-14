<template>
  <el-container
    class="loginPanel">
    <el-header>
      Login Panel
    </el-header>
    <el-main>
      <div class="login_form_wrap">

        <el-form
          class="text-left"
          ref="loginForm"
          :rules="rules"
          :model="form"
          label-width="80px"
          label-position="top">

          <el-form-item
            prop="account"
            label="account">
            <el-input
              v-model="form.account"
              id="account" key="loginAccount"
              @keyup.enter.native="onSubmit"
              :autofocus="true"></el-input></el-form-item>

          <el-form-item
            prop="password"
            label="password">
            <el-input
              type="password"
              v-model="form.password"
              id="password" key="loginPsword"
              @keyup.enter.native="onSubmit"
              ></el-input></el-form-item>

          <el-form-item
            class="text-right">
            <el-button
              @click="onSubmit">Sign in</el-button></el-form-item>

        </el-form>

      </div>
    </el-main>
    <el-footer>
      @Nuuune
    </el-footer>
  </el-container>
</template>

<script>
import API from '@/api'

export default {
  name: 'Login',
  data () {
    //自定义不为空的验证规则
    const required = ( rule, value, callback) => {
      if(!value) {
        callback( new Error(rule.field + " is can\'t be void!"));
      }else {
        callback();
      }
    }

    return {
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { validator: required, trigger: 'blur'}
        ],
        password: [
          { validator: required, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log("登陆")
      this.$refs.loginForm.validate( valid => {
        //基本验证通过
        if(valid) {
          //验证账户密码是否正确
          API.loginBack(this.form.account, this.form.password)
            .then(resp => {
               this.$message({
                message: resp.msg,
                type: resp.type
              });
              //跳转
              this.$router.push({name:'BETeacherList', params: { id: this.form.account }
              })
           }, err => {
              this.$message({
                message: err.msg + " 账号或密码错误",
                type: err.type
              });
           })
        } else {
          console.log('error Submit!');
          return false;
        }
      })
    }
  }
}
</script>

<style>
  .loginPanel { height: inherit; }
  .loginPanel .login_form_wrap { width: 300px; margin-left: auto; margin-right: auto; border: 1px solid #dcdfe6; border-radius: 5px; padding: 15px;}
  .loginPanel > .el-header, .loginPanel > .el-footer { line-height: 60px; background-color: #333333; color: #fff; }
  .loginPanel > .el-main { display: flex; flex-direction: column; justify-content: center; }
  label { font-weight: 600; }
</style>
