<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
      <img v-else class="the_img" :src="avatar" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="updateImg"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: '' // 保存图片的base64或者链接
    }
  },
  methods: {
    chooseImg() {
      // 目的:为了让input[type=file]标签，让他再用S代码来触发它的点击事件(导致它默认行为给个文件选择窗口)
      // 原因:input[type=file]它是原生标签,样式不太好改
      // 解决:移花接木
      this.$refs.iptRef.click()
    },
    onFileChange(e) {
      // 获取用户选择的文件列表（伪数组）
      const files = e.target.files
      if (!files.length) {
        // 没有选择图片
        this.avatar = ''
      } else {
        // 选择了图片
        // 目标:选择的图片文件，要给到img标签上做纯前端的预览l/ img标签的src值
        //* 只能是图片的“链接地址"(外链http://开头，图片文件相对路径)
        //* 或者是图片的base64字符串(而且字符串还必须是data:image/ png;base64，图片转base64字符串)

        /* 解决方案1:文件->内存临时地址(这个地址只能在js里内存里不能发给后台)//语法:URL.createobjectURL(文件)
        返回值:内存临时地址 */
        // this.avatar = URL.createObjectURL(files[0])

        // 解决方案2:文件 -> base64字符串(此字符串是可以发给后台的)
        // 1. 创建 FileReader 对象
        const fr = new FileReader()
        // 2. 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 3. 监听 fr 的 onload 事件
        fr.onload = (e) => {
          // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
          this.avatar = e.target.result
        }
      }
    },
    async updateImg() {
      // 调用接口, 传递给后台并根据返回结果给用户提示
      const { data: res } = await updateAvatarAPI(this.avatar)
      if (res.code === 2) return this.$message.error('上传图片过大！')
      if (res.code) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
