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
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="pubDialogVisible = true"
        >
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="artList" stripe style="width: 100%">
        <el-table-column prop="title" label="文章标题"> </el-table-column>
        <el-table-column prop="cate_name" label="分类"> </el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template v-slot="{ row }">
            <span>{{ $formatDate(row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @closed="onDialogClosedFn"
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
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img
            src="../../assets/images/cover.jpg"
            alt=""
            class="cover-img"
            ref="imgRef"
          />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input
            type="file"
            style="display: none"
            ref="iptFileRef"
            accept="image/*"
            @change="onCoverChangeFn"
          />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
import { getArtCateListAPI, addArticleAPI, getArticleListAPI } from '@/api'

export default {
  /**
   * 标签和样式中，引入图片文件直接写"静态路径”(把路径放在js的vue变量里再赋予是不行的)
   * 原因: webpack分析标签的时候，如果snc的值是一个相对路径，它会去帮我们找到那个路径的文件并一起打包
   * 打包时候，会分析文件的大小，小图转成base64字符串再赋予给src，如果是大图拷贝图片换个路径给img的src显示(运行时)
   * Vue变量中路径，赋予给标签，都会当做普通的字符串使用
   * 以前:我们写的路径是在vscode看着文件夹写的（以前好使的原因:你用live Server/磁盘双击打开，它都能通过你的相对路径，在指定路径文件夹下，找到图片文件真身)
   * 现在:写的模板代码，是要被webpack翻译处理转换的，你vscode里的代码，转换后打包到内存中/dist下，相对路径就会变化，运行时,你写的固定路径字符串就找不到那个文件真身了
   * 解决:“JS里引入图片，就用import引入", 让webpack把它当做模块数据，是转换成打包后的图片路径还是base64字符串Ⅰ
   * 注意:只有相对路径本地图片需要注意，如果你是一个http://外链的图片地址，就可以直接随便用
   * 直接标签里写也行，或者在js用变量保存后赋予给标签都ok，因为运行时，浏览器发现src地址是外链就不找相对路径文件夹了
   */
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
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      cateList: [], // 文章分类
      pubForm: {
        title: '',
        cate_id: '',
        content: '', // 文章的内容
        cover_img: null,
        state: ''
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        // 注意，这个是下拉菜单，所以trigger是change触发校验
        cate_id: [{ required: true, message: '请选择文章类别', trigger: 'change' }],
        // 原视频貌似因为这个不是饿了么UI的东西所以没校验功能，只能自己去它的官网看文档解决，但这里不知道为啥我可以
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        // 为何这个输入内容了，校验还不自己去掉?/原因:
        // content对应quill-editor富文本编辑器，它不是el提供表单标签ll el-input等输入框的在blur事件时进行校验
        // 下拉菜单，单选框，复选框，是在change事件时进行校验//解决:
        // 自己来给quill-editor绑定change事件(在文档里查到的它支持change事件内容改变事件)
        // 在事件处理函数中用el-form组件对象内，调用某个校验规则再重新执行（validateField)
        // 就是他把两个文档结合起来看，发现quill-edito自带个change监听方法，然后el-form又有个validate类似的，单独校验某条数据的方法，在监听函数中调这个方法就实现校验了
        cover_img: [{ required: true, message: '请选择文章封面！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initCateList()
    this.initArtListFn()
  },
  methods: {
    // 对话框关闭前的回调
    // 注意:自带的3种关闭方式: dialog自带的点右上角的x，和按下esc按键，和点击半透明蒙层关闭才会走这里，以及你自己点击设置visible对应变量为false，都会导致关闭前回调触发
    async handleClose(done) {
      //  done的作用:调用才会放行让对话框关闭
      // 询问用户是否确认关闭对话框 这是elementui在vue上挂载的一个方法
      // $confirm内部虽然是一个确认提示框，但是它借用了Promise语法来管理，点击确定它的状态为兑现成功状态返回' confirm'，如果用户点击了取消按钮，此Promise对象状态为拒绝状态，返回' cancel'字符串
      // 知识点回顾:
      // 1. await只能用在被async修饰的函数内
      // async修饰:就是在当前函数名左边加async关键字，如果没有函数名，在形参的左边加async//原因: async修饰的函数就是异步函数，如果此函数被调用，总是返回一个全新Promise对象
      // 而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停async函数内的，等待await后面异步结果
      // 2. await只能拿到成功的结果并放行往下走，如果失败内部会向浏览器控制台抛出错误并不会让await往下走代码
      // 3. await后面的Promise的对象的拒绝状态(错误)如何捕获呢?
      // 方法1:try{]catch(err){0}
      // 方式2:用Promise的链式调用，而且在catch里return的非Promise拒绝状态的对象值，都会当做成功的结果返回给原地新的Promise对象结果
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err) // 捕获确认框Promise对象里选择取消时，拒绝状态结果'cancel'字符串

      // 此时弹出了这个对话框，如果点了取消或x或esc或外部就让对话框消失，点确定的话不仅这对话框消失，而且回退到artList页面
      if (confirmResult === 'cancel') return
      done() // 确认关闭
    },
    // 获取文章分类的方法
    async initCateList() {
      const { data: res } = await getArtCateListAPI()
      if (res.code) return this.$message.error(res.message)
      this.cateList = res.data
    },
    // 点击表面上的+封面
    chooseImgFn() {
      // 模拟点击隐藏的那个实际input
      this.$refs.iptFileRef.click()
    },
    // 监听文件选择框的 change 事件
    onCoverChangeFn(e) {
      // 获取到用户选择的封面
      const files = e.target.files
      if (!files.length) {
        this.pubForm.cover_img = null // 用户没有选择封面
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 用户选择了封面
        // 放进表单对象，准备传给后端
        this.pubForm.cover_img = files[0]
        // 因为后端要的是文件，所以不必像头像那样转化成base64字符串
        const url = URL.createObjectURL(files[0])
        // 直接从缓存地址引入预览
        this.$refs.imgRef.setAttribute('src', url)
      }

      // 让表单单独校验封面的规则
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布文章或草稿-按钮点击事件
    pubArticleFn(state) {
      // 1. 设置发布状态
      this.pubForm.state = state
      // 2. 表单预校验
      this.$refs.pubFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请完善文章信息！')
          return false // 阻止默认行为(因为按钮有默认提交行为)
        }
        // 4. TODO：发布文章
        // 创建 FormData 对象
        const fd = new FormData() // 准备一个表单数据对象的容器 FormData类是HTML5新出的专门为了装文件内容和其他的参数的一个容器

        // 向 FormData 中追加数据
        Object.keys(this.pubForm).forEach((key) => {
          // fd.append('参数名,值)
          fd.append(key, this.pubForm[key])
        })
        // 发起新添文章的请求
        const { data: res } = await addArticleAPI(fd)
        if (res.code) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭对话框
        this.pubDialogVisible = false
        // TODO：刷新文章列表数据
        this.initArtListFn()
      })
    },
    // 监听到对话框已经关闭就会调用这个函数
    onDialogClosedFn() {
      // 清空关键数据
      this.$refs.pubFormRef.resetFields()
      // 因为这2个变量对应的标签不是表单绑定的, 所以需要单独控制
      this.pubForm.content = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 初始化文章列表
    async initArtListFn() {
      const { data: res } = await getArticleListAPI(this.q)
      if (res.code) return this.$message.error('获取文章列表失败!')
      this.artList = res.data
      this.total = res.total
    },
    // 核心思想:根据选择的页码/条数，影响q对象对应属性的值，再重新发一次请求让后台重新返回数据
    // pageSize每页条数变化时触发 发生了变化
    handleSizeChangeFn(newSize) {
      // 因为Pagination的标签上已经加了.sync，子组件内会双向绑定到右侧vue变量上(q对象里pagesize和pagenum已经改变了)
      // this.q.pagesize = newSize // 为 pagesize 赋值，这句是多余的，要是不信任饿了么UI也可以写上
      this.q.pagenum = 1 // 默认展示第一页数据
      this.initArtListFn() // 重新发起请求
    },
    // 页码值发生了变化
    handleCurrentChangeFn(newPage) {
      // this.q.pagenum = newPage // 为页码值赋值
      this.initArtListFn() // 重新发起请求
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

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  background-size: cover;
  object-fit: cover;
}

// 分页组件样式
.el-pagination {
  margin-top: 15px;
}
</style>
