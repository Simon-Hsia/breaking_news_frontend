<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateshowDialogFn">
          添加分类
        </el-button>
      </div>
      <!-- 分类数据表格 -->
      <el-table style="width: 100%" border stripe :data="cateList">
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <!-- scope对象:{ row:行对象}-->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateFn(scope.row)">
              修改
            </el-button>
            <el-button type="danger" size="mini" @click="deleteFn(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的对话框 -->

    <!--
      需要设置visible属性，它接收Boolean，当为true时显示 Dialog。
      Dialog 分为两个部分：body和footer，footer需要具名为footer的slot。
      title属性用于定义标题，它是可选的，默认值为空。
      最后，本例还展示了before-close的用法。
    visible.sync:组件内检测到对话框关闭(点击蒙层，按esc，按右上角x)它会回传false给右侧vue变量-->

    <!-- 扩展知识点:.sync是Vue2.3版本新增
    //官方文档:https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
    // .sync类似v-model，可以给子组件实现"双向数据绑定"
    复习: v-model如何给子组件实现双向数据绑定（父Vue变量要传给子组件，子组件传出的值也要自动绑定到父Vue变量)
    v-model本质:给所在标签绑定:value="Vue变量"@input="val => Vue变量 =val"<标签v-model="vue变量"></标签>
    运行时如下
    <标签:value="Vue变量”@input="val =>Vue变量= val"></标签>Vue2里面一个标签上v-model只能用一次，Vue3里可以用多次
    .sync本质:给所在标签绑定:props属性名="Vue变量" @update:props属性名="val => Vue变量=val"
    <标签:visible.sync="Vue变量"></标签>
    运行时如下
    <标签:visible="Vue变量”@update:visible="val => Vue变量 = val"></标签>
    子组件内子传父的时候this.$emit( " update:visible '，值)
    Vue2里面它可以用多次，Vue3里面把它移除了-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogCloseFn"
    >
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="this.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, addArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api'

export default {
  name: 'ArtCate',
  data() {
    return {
      cateList: [],
      dialogVisible: false, //  控制对话框的出现或者隐藏
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      editId: '', // 要修改的文章id
      isEdit: false, // 保存编辑状态(false新增, true编辑)分流阀
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.initCateListFn()
  },
  methods: {
    // 获取文章分类
    async initCateListFn() {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    // 点击新增分类按钮弹出对话框
    addCateshowDialogFn() {
      this.isEdit = false
      this.editId = null
      this.dialogVisible = true
    },
    // 对话框确定按钮->点击事件->让对话框消失/调用保存文章分类
    confirmFn() {
      this.dialogVisible = false
      // 兜底校验
      this.$refs.addRef.validate(async (valid) => {
        if (!valid) return false
        // 定义res准备接收请求返回的promise对象
        let res = {}
        // 如果这个被置为true，说明是从修改点来的
        if (this.isEdit) {
          res = await updateArtCateAPI({ id: this.editId, ...this.addForm })
          // 否则就是要新添分类
        } else res = await addArtCateAPI(this.addForm)
        const data = res.data
        if (data.code) return this.$message.error(data.message)
        // 上传完分类后就请求全部分类渲染到页面
        this.initCateListFn()
        this.$message.success(data.message)
      })
    },
    // 对话框消失都会触发该函数
    dialogCloseFn() {
      // 重置表单
      this.$refs.addRef.resetFields()
    },
    // 点击修改按钮弹出对话框
    updateFn(artCate) {
      this.isEdit = true
      this.editId = artCate.id
      // 数据回填
      this.dialogVisible = true
      // 设置数据回显
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        /* this.addForm.cate_name = artCate.cate_name
        this.addForm.cate_alias = artCate.cate_alias */
        assignment(this.addForm, artCate)
        function assignment(to, from) {
          for (const key in to) {
            if (from[key] === undefined) continue
            to[key] = from[key]
          }
        }
      })
    },
    // 点击删除按钮删除文章分类
    async deleteFn(id) {
      const { data: res } = await delArtCateAPI(id)
      if (res.code) return this.$message.error(res.message)
      this.initCateListFn()
      this.$message.success(res.message)
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
