<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="regRef" :model="regForm" :rules="rulesObj">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="regForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="regForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请确认密码" v-model="regForm.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="regNewUserFn">注册</el-button>
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入注册接口
import { registerAPI } from '@/api'

/* 前端绑定数据对象"属性名"，可以直接给要调用的功能接口的"参数名"一致
好处:我可以直接把前端对象(带着同名的属性和前端的值)发给后台
就像下面的registerAPI(this.regForm) */

export default {
  name: 'my-register',
  data() {
    const samePwdFn = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback()
      }
    }
    return {
      // 注册表单的数据对象
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      // 注册表单的验证规则对象
      rulesObj: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: samePwdFn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册新用户
    regNewUserFn() {
      // 进行表单预验证
      this.$refs.regRef.validate(async valid => {
        if (!valid) return false
        // 通过校验，发送请求
        const { data: res } = await registerAPI(this.regForm)
        console.log(res)
        // 根据接口文档，制定响应策略
        // 注册失败，提示失败信息
        // elementu性还在Vue的原型链上添加了弹窗提示，$message属性
        if (res.code) return this.$message.error(res.message)
        // 注册成功，提示用户并跳转登录组件
        this.$message.success(res.message)
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
    .btn-reg {
      width: 100%;
    }
  }
}
</style>
