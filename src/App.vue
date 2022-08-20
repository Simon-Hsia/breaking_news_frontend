<template>
  <div class="app-container">
    <!-- 一级路由规则对象挂载点 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {},
  created() {}
}
</script>

<style lang="less" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
