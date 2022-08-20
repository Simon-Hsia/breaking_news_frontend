<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="userFormRules"
      ref="userFormRef"
      label-width="100px"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFn">提交修改</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updateUserInfoAPI } from '@/api'
export default {
  name: 'UserInfo',
  data() {
    return {
      userForm: {
        username: this.$store.state.userInfo.username, // 默认值用登录后获取到的用户名
        nickname: '',
        email: ''
      },
      // 表单的验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '昵称必须是1-10位的非空字符串',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitFn() {
      // 兜底校验
      this.$refs.userFormRef.validate(async (valid) => {
        if (!valid) return false
        // 这个表单没id，后台要id，从vuex中取
        this.userForm.id = this.$store.state.userInfo.id
        const { data: res } = await updateUserInfoAPI(this.userForm)
        if (res.code) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 数据库更新成功后就更新vuex中的userInfo
        this.$store.dispatch('initUserInfo')
      })
    },
    resetFn() {
      // 调用这个方法可以清空当前表单数据
      this.$refs.userFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
