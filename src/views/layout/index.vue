<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img class="avatar" :src="user_pic" alt="" v-if="user_pic" />
            <img class="avatar" src="@/assets/images/favicon.png" alt="" v-else />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container>
      <!-- 左侧边栏的用户信息 -->
      <el-aside width="200px">
        <!-- 头像欢迎区域 -->
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="@/assets/images/favicon.png" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 左侧导航菜单 -->
        <!-- default-active 当前激活菜单的 index
        open  展开指定的 sub-menu index: 需要打开的 sub-menu 的 index
        close 收起指定的 sub-menu index: 需要收起的 sub-menu 的 index
        active-text-color 当前激活菜单的文字颜色（仅支持 hex 格式）
        子标签:
        如果有嵌套，先写el-submenu(里面嵌套template#title的设置当前展示内容，子用el-menu-item显示)
        如果无嵌套,直接写el-menu-item
        router  是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->

        <el-menu
          router
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 因为渲染时有子级的和没子级的标签不一样，所以需要用template循环 -->
          <template v-for="item in menus">
            <!-- 如果没有子级就会渲染这套标签，判断条件是children -->
            <el-menu-item
              :index="item.indexPath"
              :key="item.indexPath"
              v-if="!item.children"
            >
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </el-menu-item>

            <!-- 有子级的，经过上面判断就是v-else了，然后用这套标签渲染 -->
            <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <!-- 循环渲染二级菜单 -->
              <el-menu-item
                :index="child.indexPath"
                :key="child.indexPath"
                v-for="child in item.children"
              >
                <i :class="child.icon"></i>
                <span>{{ child.title }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 页面主体区域 -->
        <el-main> <router-view></router-view> </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenusAPI } from '@/api'
export default {
  name: 'my-layout',
  data() {
    return {
      menus: {} // 侧边栏数据
    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },
  created() {
    this.getMenusListFn()
  },
  methods: {
    logoutFn() {
      this.$confirm('妈了个巴子要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除vuex
          this.$store.commit('updateToken', '')
          this.$store.commit('updateUserInfo', {})
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '还是怂了'
          })
        })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    // 获取侧边栏菜单数据
    async getMenusListFn() {
      const { data: res } = await getMenusAPI()
      if (res.code) return this.$message.error(res.message)
      this.menus = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
</style>
