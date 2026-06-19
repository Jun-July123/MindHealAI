<template>
  <div>
    <PageHead title="知识文章">
      <!-- 7-2.6 template #buttons 操作按钮插槽 -->
      <template #buttons>
        <!-- 17-1.9 knowledge新增按钮，点击触发新增弹窗显示 -->
        <el-button type="primary" @click="onEditCreate({})">新增</el-button>
        <!-- <el-button type="primary">编辑</el-button> -->
      </template>
    </PageHead>
    <!-- 9-1.3 PageSearch组件标签定义formItem属性，绑定formItem数据 -->
    <!-- 9-1.4 search事件，绑定onPageSearch函数 -->
    <PageSearch :formItem="formItem" @search="onPageSearch"></PageSearch>

    <div class="article-list">
    <!-- 15-1.7 文章列表区域 -->
      <el-table :data="articleList" style="width: 100%;margin-top: 25px;">
        <!-- 15-1.7.1 文章标题列 -->
        <!-- 15-1.8 添加fixed，让某些列固定在页面，防止页面缩放滚动被遮挡 -->
        <!-- 15-1.8.1 fixed="left" 让文章标题列固定在左侧 -->
        <el-table-column prop="title" label="文章标题" width="220" fixed="left">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon><timer /></el-icon>
              <span>{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 15-1.7.2 分类列 -->
        <el-table-column label="分类" width="180">  
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <span>{{categoryMap[scope.row.categoryId]}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 15-1.7.3 作者列、阅读量列、发布时间列 -->
        <el-table-column prop="authorName" label="作者" width="150" />
        <el-table-column prop="readCount" label="阅读量" width="150" />
        <el-table-column prop="updatedAt" label="发布时间" width="150" />
        <!-- 15-1.7.4 操作列,编辑、发布、下线 -->
        <!-- 15-1.8.3 fixed="right" 让操作列固定在右侧 -->
        <el-table-column prop="status" label="操作" width="230" fixed="right">
          <template #default="scope">
            <!-- 20-2.2 编辑按钮添加点击事件onEditCreate，传递当前行数据scope.row-->
            <el-button @click="onEditCreate(scope.row)" text type="primary" size="mini">编辑</el-button>
            <el-button v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
            <el-button v-else text type="warning">下线</el-button>
            <el-button text type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 16-1.1 分页组件el-pagination -->
      <!-- 16-1.2 绑定每页数量page-size,总页数total及跳转点击页current-change事件 -->
        <el-pagination
          layout="prev, pager, next"  
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="onPaginationChange"
          style="margin-top: 25px;"
          background
        />
        <!-- 17-1.3 Knowledge引入使用ArticleDialog,绑定dialogVisible传递弹窗显示隐藏状态 -->
        <!-- v-model:modelValue=""等价:modelValue属性+@update:modelValue -->
        <!-- 18-1.4.1 knowledge 传递分类列表categoryList 给文章弹框ArticleDialog -->
        <!-- 20-1.4.2 knowledge监听处理success事件 -->
        <!-- 20-2.4 knowledge传递当前文章数据currentArticle-->
        <ArticleDialog :currentArticle="currentArticle"
          v-model:modelValue="dialogVisible" 
          :categoryList="categoryList"
          @success="onSuccess" />
    </div>
  </div>
</template>
<script setup>
import ArticleDialog from '@/components/ArticleDialog.vue'
// 7-2.5 Knowledge组件引入使用PageHead组件
import PageHead from '@/components/PageHead.vue'
// 9-1.2 Knowledge组件引入使用PageSearch组件
import PageSearch from '@/components/PageSearch.vue'
// 14-1.3 Knowledge组件引入使用categoryTree接口及onMounted、ref
import {onMounted,reactive,ref} from 'vue'
import {categoryTree,getKnowledgeArticlePageAPI,getKnowledgeArticleByIdAPI} from '@/api/admin'

// 17-1.2 knowledge定义新增/编辑弹窗显示状态，初始false隐藏弹窗
const dialogVisible = ref(false)
// 14-1.4 定义分类名称映射表及分类列表
const categoryMap = reactive({})
const categoryList = ref([])
// 15-1.2 定义文章列表
const articleList = ref([])
const currentArticle = ref(null)



// 9-1.3 Knowledge组件定义搜索表单数据
const formItem = [
  {comp :'input',prop:'title',label:'标题',placeholder:'请输入搜索文章标题'},
  {comp :'select',prop:'category',label:'分类',placeholder:'请选择分类',
    value:'',
    options:[
      {label:'心理健康',value:'1'},
      {label:'情绪管理',value:'2'}
    ]
  },
  {comp :'select',prop:'status',label:'状态',placeholder:'请选择状态',
    value:'',
    options:[
      {label:'草稿',value:'0'},
      {label:'已发布',value:'1'},
      {label:'已下线',value:'2'}
    ]
  }]

// 15-1.3 定义分页参数
const pagination = reactive({
  currentPage: 1,//当前页码
  size: 10,//每页数量
  total: 0,//总页数
})

// 9-1.4 Knowledge组件定义搜索事件处理函数onPageSearch
const onPageSearch = async (formdata) => {
  // 15-1.4 定义查询参数
  const params = {
    ...pagination,
    ...formdata
  }
  // 15-1.5 处理搜索事件，调用getKnowledgeArticlePageAPI接口，获取文章数据  
  // const {records, total} = await getKnowledgeArticlePageAPI(params)
  const knowledgeArticlePageData = await getKnowledgeArticlePageAPI(params)
  articleList.value = knowledgeArticlePageData.records
  // 16-1.3 从文章数据中获取总页数total
  pagination.total = knowledgeArticlePageData.total
}

// 16-1.4 点击分页，处理onPaginationChange，跳转点击页
const onPaginationChange = (page) => {
  // 16-1.4.1 当前页码更新为点击页页码
  pagination.currentPage = page
  // 16-1.4.2 调用onPageSearch函数，重新获取文章数据
  onPageSearch()
}

// 20-2.3 按钮onEditCreate事件，接收数据
const onEditCreate = async (row) => {
// 20-2.3.1 数据没有文章id,说明是新增文章，将currentArticle.value设置为null，打开弹框
  if(!row.id){
    currentArticle.value = null
    dialogVisible.value = true
  }
  else{
    // 20-2.3.2 有文章id,调用getKnowledgeArticleByIdAPI文章详情接口，获取当前文章详情，
    const res = await getKnowledgeArticleByIdAPI(row.id)
    //20-2.3.3 将当前文章详情赋值给currentArticle，打开弹框
    currentArticle.value = res
    dialogVisible.value = true
  }
  
}

// 14-1.5 打开页面就调用categoryTree接口，获取分类数据
onMounted(async () => {
  // 15-1.6 进入页面，调用onPageSearch函数，获取文章数据
  onPageSearch()
  const categoryData = await categoryTree()
  console.log(categoryData);

  // 14-1.6 处理分类树数据
  // 14-1.6.3 下拉选项数组赋值给categoryList
  categoryList.value = categoryData.map(item => {
  // console.log(item.id,item.category)
  // 14-1.6.1 遍历分类数据，将每个分类名称转换为分类映射的属性
    categoryMap[item.id] = item.categoryName
    // 14-1.6.2 每一项分类，组装成分类下拉选项
    return {
      label:item.categoryName,
      value:item.id
    }
  })
  // console.log(categoryList.value);
  // 14-1.7 分类下拉选项数组赋值给formItem[1].options
  formItem[1].options = categoryList.value
  console.log(categoryMap);

})
// 20-1.4.3 处理success事件，刷新文章列表
const onSuccess = () => {
   dialogVisible.value = false
  onPageSearch()
}


</script>