<template>
  <!-- 23-1.4 系统统计数据 -->
  <div class="dashboard-container">
    <!-- 23-1.4.1 el-row/el-col/el-card 统计数据卡片，一行显示4个卡片 -->
    <!-- 23-1.4.2 每个卡片包含左侧图片和右侧文字信息 -->
    <el-row :gutter="20">
      <el-col :span="6">

        <!-- 23-1.5 总用户数卡片 -->
        <el-card>
          <!-- 23-1.5.1 左侧用户图片 -->
          <div class="card-content">
            <div class="avatar users">
              <el-image :src="userUrl" style="width: 40px; height: 40px;" />
            </div>
            <!-- 23-1.5.2 总用户数信息 -->
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ systemOverviewData.totalUsers}}</p>
              <p class="subtitle-title">活跃用户：{{ systemOverviewData.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 23-1.6 情绪日志卡片 -->
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar like">
              <el-image :src="likeUrl" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ systemOverviewData.totalDiaries}}</p>
              <p class="subtitle-title">今日新增：{{ systemOverviewData.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 23-1.7 咨询会话卡片 -->
       <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar comments">
              <el-image :src="commentsUrl" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ systemOverviewData.totalSessions}}</p>
              <p class="subtitle-title">今日新增：{{ systemOverviewData.todayNewSessions }}</p> 
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 23-1.8 平均情绪卡片 -->
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar smile">
              <el-image :src="smileUrl" style="width: 40px; height: 40px;" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ systemOverviewData.avgMoodScore}}/10</p>
              <p class="subtitle-title">情绪健康指数</p> 
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getDataOverviewAPI } from '@/api/admin.js'
import { onMounted, ref } from 'vue'
// 23-1.4.3 将所需要的图片路径赋值给变量userUrl、likeUrl、commentsUrl、smileUrl
const userUrl = new URL('@/assets/images/users.png', import.meta.url).href
const likeUrl = new URL('@/assets/images/like.png', import.meta.url).href
const commentsUrl = new URL('@/assets/images/comments.png', import.meta.url).href
const smileUrl = new URL('@/assets/images/smile.png', import.meta.url).href

const overviewData = ref({})
const systemOverviewData = ref({})

// 23-1.2 调用getDataOverviewAPI获取综合分析数据
const getOverview = () => {
  getDataOverviewAPI().then(res => {
    // 23-1.2.1 将接口返回的综合数据赋值给overviewData
    overviewData.value = res
    // 23-1.2.2 将综合分析数据的系统统计数据赋值给systemOverviewData
    systemOverviewData.value = res.systemOverview
  })
}

// 23-1.3 页面一渲染时调用getOverview函数获取综合分析数据
onMounted(() => {
  getOverview()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
    .card-content {
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 12px;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        &.like {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        &.comments {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        &.smile {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      .info {
        .title {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }
        .value {
          font-size: 24px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 4px
        }
        .subtitle-title {
          font-size: 12px;
          color: #95a5a6;
        }
      }
    }
    .chart-content {
      padding: 20px;
      height: 300px;
      position: relative;

      canvas {
        width: 100% !important;
        height: 100% !important;
      }

      .consultation-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
          }
        }
      }
    }
  }

</style>