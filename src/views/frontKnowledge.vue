<template>
  <div class="knowledge-container">
    <!-- 29-1.5 知识库，包括头部标题、知识列表（左侧推荐列表、右侧文章列表）、分页 -->
    <!-- 头部标题 -->
    <div class="header-section">
      <div class="header-content">
        <el-image :src="bookUrl" style="width: 60px; height: 60px;"></el-image>
        <h1>知识库</h1>
      </div>
    </div>

    <!-- 知识列表区域（左侧推荐列表、右侧文章列表） -->
    <div class="content">
      <!-- 29-1.6 左侧推荐列表,.v-for遍历推荐列表，每个推荐项包括标题、阅读量 -->
      <div class="recommend-section">
        <div class="section-title">推荐阅读</div>
          <div class="recommend-list">
            <!-- 29-2.1 推荐列表，文章注册点击事件、传递文章id -->
            <div @click="onDetailArticle(item.id)"  v-for="item in recommendList" :key="item.id" class="recommend-item">
              <h4>{{ item.title }}</h4>
              <p class="read-count">
                <el-icon> <History /></el-icon> 
                阅读量{{ item.summary}}人             
              </p>
            </div>
          </div>
      </div>
      <!-- 右侧文章列表 -->
      <!-- 29-1.7 文章列表包括文章封面、文章信息 -->
      <div class="article-list">
        <!-- 29-1.7.1 v-for遍历文章列表，每个文章项包括文章封面、文章信息 -->
        <!-- 29-2.2 文章列表，文章注册点击事件、传递文章id -->
        <div @click="onDetailArticle(item.id)" v-for="item in articleList" :key="item.id" class="article-item">
          <!-- 29-1.7.3 el-image设置文章封面，调用getCoverImage函数获取完整URL/默认图片 -->
          <el-image :src="getCoverImage(item.coverImage)" style="width: 240px; height: 150px;"></el-image>
          <!-- 29-1.7.4 文章信息包括标题、作者、发布时间、观看人数 -->
          <div class="info">
            <!-- 29-1.7.5 文章标题包括标题及分类标签（Plain标签镂空） -->
            <div class="title">
              <h3>{{ item.title }}</h3>
              <!-- 标签镂空 -->
              <el-tag plain type="primary">{{ item.categoryName }}</el-tag>
            </div>
            <!-- 29-1.7.6 文章作者及发布时间（dayjs格式化发布时间） -->
            <div :style="{marginTop: '10px'}">
              <div class="flex-box">
                <el-icon> <User /></el-icon> 
                <span>{{ item.authorName }}</span>
              </div>
              <!-- 发布时间 -->
              <div class="flex-box">
                <el-icon> <Time /></el-icon> 
                <span>{{ dayjs(item.updatedAt) .format('YYYY-MM-DD HH:mm:ss') }}</span>
              </div>
            </div>
            <!-- 29-1.7.7 文章观看人数 -->
            <div :style="{marginTop: '10px'}">
              <div class="flex-box">
                <el-icon> <Platform /></el-icon> 
                <span>观看人数：{{ item.readCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 29-1.8 el-pagination设置文章列表分页 -->
    <div class="pagination-wrapper">
      <!-- 29-1.8.1 分页组件 :page-size绑定分页参数size,:total绑定分页参数total-->
      <!-- 29-1.8.2 @current-change注册页码变化事件 -->
      <el-pagination
        layout="prev, pager, next"  
        :page-size="pagination.size"
        :total="pagination.total"
        @change="onPaginationChange"
        style="margin-top: 25px;"
        background
      />
    </div>  

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledgeListAPI } from '@/api/user'
import { dayjs } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const bookUrl = new URL('@/assets/images/book.png', import.meta.url).href

// 推荐列表
const recommendList = ref([])
// 29-1.2 获取推荐列表
const getRecommendList = ()=>{
  // 29-1.2.1 定义推荐列表查询参数（sortField、sortDirection、currentPage、size）
  const params = {
    sortField: 'readCount',
    sortDirection: 'desc',// 降序排列
    currentPage: 1,
    size: 5
  }
  // 29-1.2.2 调用getKnowledgeListAPI、传递推荐列表查询参数、获取推荐列表数据
  getKnowledgeListAPI(params).then(res => {
    // 29-1.2.3 将获取到的推荐列表数据赋值给recommendList
    recommendList.value = res.records
  })
}

// 29-1.3 定义文章列表分页参数pagination
const pagination = ref({
    total: 0,
    currentPage: 1,
    size: 5
})

const articleList = ref([])
// 29-1.4 获取文章列表
const getArticleList = ()=>{
  // 29-1.4.1 定义文章列表查询参数（sortField、sortDirection、分页参数）
  const params = {
    sortField: 'publishedAt',
    sortDirection: 'desc',// 降序排列
    ...pagination
  }
  // 29-1.4.2 调用getKnowledgeListAPI、传递文章列表查询参数、获取文章列表数据
  getKnowledgeListAPI(params).then(res => {
    console.log(res.records)
    // 29-1.4.3 将获取到的文章列表数据赋值给articleList
    articleList.value = res.records
  })
}

// 29-1.7.2 获取文章封面，接收文章封面URL，如果URL为空，默认返回默认图片，否则拼接完整URL
const getCoverImage = (url)=>{
  return url ? 'http://159.75.169.224:1235' + url : 'https://file.itndedu.com/psychology_ai.png'
}

// 29-1.8.3 页码变化事件
const onPaginationChange = (page) => {
  // 29-1.8.4 当前页码更新为点击页页码
  pagination.currentPage = page
  // 29-1.8.5 调用onPageSearch函数，重新获取文章数据
  getArticleList()
}

// 29-2.3 文章详情事件,接收文章id，跳转文章详情页
const onDetailArticle = (id) => {
  router.push(`/knowledge/article/${id}`)
}

onMounted(() => {
  // 29-1.2.4 页面一渲染，获取推荐列表数据
  getRecommendList()  
  // 29-1.4.4 页面一渲染，获取文章列表数据
  getArticleList()
})
</script>

<style scoped lang="scss">
.knowledge-container {
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .flex-box {
        display: flex;
        align-items: center;
        span {
            margin-left: 10px;
        }
    }
    .header-section {
        background: linear-gradient(135deg, #82b5ef 0%, #f97cb9 100%);
        color: white;
        padding: 48px;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        width: 1200px;
        padding: 20px;
        .recommend-section {
            width: 280px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 15px;
            height: 400px;
            .section-title {
                font-size: 12;
                font-weight: 600;
                color: #374151;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .recommend-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .recommend-item {
                    border-left: 4px solid #f59e0b;
                    padding-left: 10px;
                    cursor: pointer;
                    .read-count {
                        margin-top: 15px;
                        font-size: 12px;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
        .article-list {
            flex: 1;
            .article-item {
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                padding: 15px;
                margin-bottom: 20px;
                display: flex;
                .info {
                    margin-left: 20px;
                    .title {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                }
            }
        }
    }
    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding-bottom: 30px;
    }
}
</style>


