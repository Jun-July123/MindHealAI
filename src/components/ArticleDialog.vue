<!-- 17-1.1 创建文章新增/编辑弹窗组件,使用el-dialog组件 -->
<!-- 17-1.6 弹窗绑定dialogVisible控制弹窗显示隐藏,及关闭close事件 -->
<template>
  <!-- 20-2.6.2 弹窗标题根据isEdit判断是编辑/新增文章，有id为编辑文章，无id为新增文章详情 -->
  <el-dialog  
    :title="isEdit ? '编辑文章' : '新增文章'" 
    v-model="dialogVisible" 
    width="50%"
    @close="handleClose">
     <!-- 18-1.3 el-form绑定formData获取表单数据,el-input绑定formData内的属性-->
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题"  maxlength="200" show-word-limit clearable></el-input>
      </el-form-item>
      <!-- 18-1.4 文章分类下拉选择框 -->
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <!-- 18-1.4.3 文章分类下拉框选项，遍历分类列表，渲染分类选项 -->
          <el-option v-for="item in props.categoryList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 18-1.5 文章摘要textarea，rows=4 显示4行 -->
      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="formData.summary" type="textarea" :rows="4" placeholder="请输入文章摘要（可选）" show-word-limit clearable ></el-input>
      </el-form-item>
      <!-- 18-1.6 文章标签，下拉选择标签，multiple 多选标签,过滤filterable过滤标签,allow-create 允许创建新标签 -->
      <el-form-item label="文章标签" prop="tagsArray">
        <el-select v-model="formData.tagArray" placeholder="请选择文章标签" multiple filterable allow-create style="width: 100%;">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <!-- 18-2.1 文章封面上传el-upload组件 -->
      <!-- 18-2.1.1 绑定before-upload事件处理文件上传前的校验 -->
      <!-- 18-2.1.2 绑定http-request事件处理文件上传请求 -->
      <el-form-item label="文章封面" prop="coverImage">
        <div>
          <el-upload  
            class="cover-uploader"
            action="#"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            :show-file-list="false"
            >
          <img v-if="imgUrl" :src="imgUrl" class="cover" />
          <!-- <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon> -->
          <p v-else>点击上传封面</p>
        </el-upload>
        <!-- 18-2.5 删除封面按钮 -->
        <!-- 18-2.5.1 当存在封面时，显示删除封面按钮，触发删除事件 -->
        <div v-if="imgUrl" class="cover-remove" @click="removeCover">
          <el-button type="danger" size="mini">删除封面</el-button>
        </div>
      </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
      <!-- 19-1.7 使用富文本编辑器，绑定formData.content，
      配置placeholder，maxCharCount 最大字数5000，
      绑定change事件处理内容变化,created事件处理编辑器创建完成 -->
      <RichTextEditor 
        v-model="formData.content" 
        :editorConfig="editorConfig"
        :placeholder="请输入文章内容"
        :maxCharCount="5000"
        @change="handleContentChange"
        @created="handleEditorCreated"
        min-height="400px"
         />
      </el-form-item>
  </el-form>
  <!-- 20-1.1 弹窗底部按钮 -->
  <template #footer>
    <!-- 20-1.1.1 取消按钮,点击关闭弹窗,调用handleClose关闭弹窗 -->
    <el-button @click="handleClose">取消</el-button>
    <!-- 20-1.1.2 提交按钮，处理提交事件（根据formData.id判断是新增还是更新）,绑定loading状态 -->
    <!-- 20-2.6.3 提交按钮根据isEdit判断是新增/更新文章 -->
    <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '更新文章' : '创建文章' }}</el-button>
  </template>
  </el-dialog>
</template>
<script setup>
// 18-1.5.1 安装vue-quill组件
// 18-1.5.2 引入vue-quill的snow主题、 QuillEditor组件
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref,reactive ,computed,watch} from 'vue'
import { ElMessage } from 'element-plus'
// 18-2.3.3 引入uploadFile接口
import { uploadFile,postKnowledgeArticleAPI,putKnowledgeArticleByIdAPI } from '@/api/admin'
// 18-2.4.2 引入文件上传接口基础URL
import { fileBaseURL } from '@/config/index'
// 19-1.6 ArticleDialog引入富文本编辑器RichTextEditor组件
import RichTextEditor from '@/components/RichTextEditor.vue'
// import { articleSave } from '@/api/admin'
import { nextTick } from 'vue'

// 17-1.4.2 定义props，弹窗从knowledge接受弹窗显示隐藏状态modelValue
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 18-1.4.2 ArticleDialog接收knowledge传递的分类列表categoryList
  categoryList: {
    type: Array,
    default: () => []
  },
  // 20-2.5 ArticleDialog接收knowledge传递的当前文章数据currentArticle
  currentArticle: {
    type: Object,
    default: null
  }
})

// 20-2.6 根据article.id判断是编辑还是新增文章
// 20-2.6.1 定义isEdit计算属性，根据接收的article判断是否有id
const isEdit = computed(() => {
  return !!props.currentArticle?.id
})

// 20-3.1 watch(监听某个数据的变化，执行回调函数)监听表单编辑
// 监听当前文章currentArticle变化
watch(()=>props.currentArticle,async (newVal) => {
  if(newVal){
    // 20-3.3 点击编辑文章回显至表单，再点击新增，该文章的部分内容会回显到表单中
    // 需要等待DOM更新完成，即关闭编辑文章弹窗完成重置表单后，再将新数据赋值给formData
    nextTick(()=>{

      // 20-3.1.1 监听到新数据，将新数据赋值给formData
      Object.assign(formData,newVal)
      // 20-3.1.2 将新数据的id赋值给businessId
      // businessId是新增文章的虚拟id,将当前文章id赋值给businessId变成真实文章id
      businessId.value = newVal.id
      // 20-3.1.3 封面URL赋值给imgUrl
      imgUrl.value = fileBaseURL + newVal.coverImage

    })
  }
})

// 17-1.5 定义emit，向knowledge传递update:modelValue事件
const emit = defineEmits(['update:modelValue','success'])

// 18-1.1 reactive定义弹窗表单数据formData
const formData = reactive({
  title:'',
  content:'',
  coverImage:'',
  categoryId:1,
  summary:'',
  tagArray:[],
  id:''
})

// 18-1.2 弹窗表单验证规则rules
const rules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  summary: [
    { required: false, message: '请输入文章摘要', trigger: 'change' }
  ],
  tagsArray: [
    { required: false, message: '请选择文章标签', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, max: 5000, message: '文章内容长度必须在10到5000之间', trigger: 'blur' }
  ],
})

// 18-1.6 文章标签数组
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
const loading = ref(false)


// 19-1.8 处理内容变化事件(获取到{html,text})，更新formData.content
const handleContentChange = (data) => {
  console.log(data)//{html,text}
  formData.content = data.html
}

const editorInstance = ref(null)
const formRef = ref(null)
// 19-1.9 处理编辑器创建完成事件，
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  if(formData.content){
    nextTick(() => {
      editorInstance.value.setHtml(formData.content)
    })
  }
}

// 20-1.2 提交事件
const handleSubmit = async () => {
  // 20-1.2.1 获取表单formRef实例，validate校验表单数据
  const valid = await formRef.value.validate()
  if(!valid){
    ElMessage.error('请填写完整文章信息')
    return
  }
  console.log(formData)

  // 20-1.3 调用新增文章接口，传递参数
  // 20-1.3.1 准备向后端传递的参数submitData(tags单独处理)
  // 解构formData,将tagsArray的元素进行拼接添加至submitData，
  // 再将原先formData里的tagsArray，从submitData移除
  const submitData ={
    ...formData,
    tags:formData.tagArray.join(',')
  }
  delete submitData.tagArray
  
  try{
  if(!isEdit.value){
  // 20-1.3.2 调用新增文章接口，传递参数
  await postKnowledgeArticleAPI(submitData).then(res => {
    submitData.id = businessId.value
    loading.value = false
    ElMessage.success('新增成功')
    // 20-1.4 新增成功后，重新刷新文章列表
    // 20-1.4.1 新增成功，发送success事件给knowledge
    emit('success')
  })
  }
  else{
    // 20-1.3.2 调用编辑文章接口，传递参数
    await putKnowledgeArticleByIdAPI(props.currentArticle.id,submitData).then(res => {
      loading.value = false
      ElMessage.success('编辑成功')
      // 20-1.4 编辑成功后，重新刷新文章列表，关闭弹窗
      // 20-1.4.1 编辑成功，发送success事件给knowledge
      emit('success')
    })
  }
  
  // 20-1.3.3 新增/编辑成功后，关闭弹窗  
  // emit('update:modelValue', false)
  
  }
  catch(err){
    // 接口失败不关闭弹窗，保留填写内容
    console.error('提交失败', err)
  }finally{
    loading.value = false
  }


}


const imgUrl = ref('')
// 18-2.2 beforeUpload处理文件上传前的校验
const beforeUpload = (file) => {
  // 18-2.2.1 校验文件类型是否为图片
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('上传封面图片，请选择图片文件')
    return false
  }
  // 18-2.2.2 校验文件大小是否超过5MB
  const isSize = file.size / 1024 / 1024 < 5
  if (!isSize) {
    ElMessage.error('上传封面图片大小不能超过5MB')
    return false
  }
  return true
}

const businessId = ref(null)
// 18-2.3 处理文件上传请求
const handleUploadRequest = async ({file}) => {
  // 18-2.3.4 UUID，生成业务文件唯一标识ID
  businessId.value = crypto.randomUUID()
  // 18-2.3.5 将文件和id传递给uploadFile，获取图片文件信息
  const fileRes = await uploadFile(file,businessId.value) 
  // 18-2.4 页面展示上传后的图片
  // 18-2.4.2 拼接完整的图片地址,
  // 将图片路径赋值给imgUrl和formData.coverImage
  imgUrl.value = fileBaseURL+fileRes.filePath
  formData.coverImage = fileRes.filePath
}

// 18-2.6 删除封面，将imgUrl和coverImage清空
const removeCover = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}


// 17-1.7 计算属性dialogVisible，更新弹窗显示隐藏状态
const dialogVisible = computed({
  // 17-1.7.1 dialogVisible为读取到的弹窗显示隐藏状态modelValue
  get(){
    return props.modelValue
  },
  // 17-1.7.2 dialogVisible发生变化时，触发update:modelValue事件，
  // 将新的弹窗显示隐藏状态传递给knowledge
  set(val){
    emit('update:modelValue',val)
  }
})

// 17-1.8 点击关闭弹窗，将弹窗显示隐藏状态设置为false
const handleClose = () => {
  // 20-3.2 新增文章但是没有提交，再次点击新增，上次的内容还会在表单中，关闭弹窗前需要重置
  // 20-3.2.1 关闭弹窗前，重置表单
  formRef.value.resetFields()
  // 20-3.2.2 重置businessId为null
  businessId.value = null
  // 20-3.2.3 重置封面图片和数据
  removeCover()
  // 20-3.2.4 重置标签
  formData.tagArray = []
  emit('update:modelValue',false)
}

</script>

<style scoped lang="scss">
// 18-1.4.3 上传封面文件样式
.cover-uploader {
  // 上传容器整体
  :deep(.el-upload) {
    width: 178px;
    height: 178px;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s;
    &:hover {
      border-color: #409eff;
    }
  }
  // 已上传图片样式
  .cover {
    width: 178px;
    height: 178px;
    object-fit: cover; // 图片等比裁切不变形
    display: block;
    border-radius: 6px;
  }

}

.editor-wrap {
  :deep(.ql-container) {
    min-height: 200px;
    font-size: 15px;
  }
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
