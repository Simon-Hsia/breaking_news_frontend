<template>
  <div>
    <el-button>App 根组件</el-button>
  </div>
</template>

<script>
import { registerAPI } from '@/api'

export default {
  name: 'App',
  async created() {
    const res = await registerAPI()
    console.log(res)
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
