<template>
  <div class="login">
    <div class="login-box">
      <picture>
        <img src="../assets/logo.png" alt="logo">
      </picture>
      <!-- login form -->
      <el-form class="login-form"  ref="loginForm" :rules="loginFormRules" :model="loginForm" label-width="0">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user"	v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="button-group">
          <el-button type="primary" @click="login('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loginForm:{
        username:'admin',
        password:'123456'
      },
      loginFormRules:{
        username:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    login(form){
        this.$refs[form].validate(async(valid) => {
          if (valid) {
            const {data:res} =await this.$http.post("login",this.loginForm);
            if(res.meta.status == 200){
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home');  
              this.$message.success(res.meta.msg);
            }else{
              this.$message.error(res.meta.msg);
            }
          } else {
            this.$message.error('登录失败');
            return false;
          }
        });
    },
    resetForm(form){
      console.log(this.$refs)
      this.$refs[form].resetFields();
    }
  }
}
</script>

<style lang="less">
  .login{
    height: 100%;
    background:#264a6b;
  }
  .login-box{
    width:420px;
    height: 280px;
    background: #fff;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    >picture{
      width: 100px;
      height: 100px;
      background: #EDEEEB;
      border: 6px solid #fff;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%,-50%);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      >img{
        width: 100%;
      }
    }
    .login-form{
      width: 100%;
      box-sizing: border-box;
      padding:0 20px;
      .button-group{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>