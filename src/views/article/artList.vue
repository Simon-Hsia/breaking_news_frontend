<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option
                v-for="cate in cateList"
                :label="cate.cate_name"
                :key="cate.id"
                :value="cate.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="cate in cateList"
              :label="cate.cate_name"
              :key="cate.id"
              :value="cate.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 使用 v-model 进行双向的数据绑定 -->
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI } from '@/api'
export default {
  name: 'ArtList',
  data() {
    return {
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      cateList: [], // 文章分类
      pubForm: {
        title: '',
        cate_id: '',
        content: '' // 文章的内容
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initCateList()
  },
  methods: {
    // 发表文章按钮->点击事件->让添加文章对话框出现
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 对话框关闭前的回调
    // 注意:自带的3种关闭方式: dialog自带的点右上角的x，和按下esc按键，和点击半透明蒙层关闭才会走这里，以及你自己点击设置visible对应变量为false，都会导致关闭前回调触发
    async handleClose(done) {
      //  done的作用:调用才会放行让对话框关闭
      // 询问用户是否确认关闭对话框 这是elementui在vue上挂载的一个方法
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获确认框Promise对象里选择取消时，拒绝状态结果'cancel'字符串
      // $confirm内部虽然是一个确认提示框，但是它借用了Promise语法来管理，点击确定它的状态为兑现成功状态返回' confirm'，如果用户点击了取消按钮，此Promise对象状态为拒绝状态，返回' cancel'字符串
      // 知识点回顾:
      // 1. await只能用在被async修饰的函数内
      // async修饰:就是在当前函数名左边加async关键字，如果没有函数名，在形参的左边加async//原因: async修饰的函数就是异步函数，如果此函数被调用，总是返回一个全新Promise对象
      // 而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停async函数内的，等待await后面异步结果
      // 2. await只能拿到成功的结果并放行往下走，如果失败内部会向浏览器控制台抛出错误并不会让await往下走代码
      // 3. await后面的Promise的对象的拒绝状态(错误)如何捕获呢?
      // 方法1:try{]catch(err){0}
      // 方式2:用Promise的链式调用，而且在catch里return的非Promise拒绝状态的对象值，都会当做成功的结果返回给原地新的Promise对象结果

      // 此时弹出了这个对话框，如果点了取消或x或esc或外部就让对话框消失，点确定的话不仅这对话框消失，而且回退到artList页面
      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 获取文章分类的方法
    async initCateList() {
      const { data: res } = await getArtCateListAPI()
      if (res.code) return this.$message.error(res.message)
      this.cateList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
::v-deep .ql-editor {
  min-height: 300px;
}
</style>
