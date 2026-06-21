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
    
    <!-- 23-2.1 趋势分析图表,一行2个图表卡片（情绪趋势分析图表、咨询会话趋势分析图表） -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <!-- 23-2.2 情绪趋势分析图卡片 -->
        <el-card style="width: 100%;">
          <!-- 23-2.2.1 插槽，卡片头部标题 -->
          <template #header>
            <div class="card-header">情绪趋势分析</div>
          </template>
         <!-- 23-2.2.2 图表内容容器 ，ref绑定emotionChartRef情绪趋势图表容器-->
         <div class="chart-content">
          <div ref="emotionChartRef" style="width:100%;height: 300px;"></div>
         </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { getDataOverviewAPI } from '@/api/admin.js'
import { onMounted, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Position } from '@element-plus/icons-vue'

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
    // 23-2.5 获取到综合数据后，等DOM更新完毕再执行情绪趋势分析图表初始化
    nextTick(() => {
      initEmotionChart()
    })
  })
}

let emotionChart = null
const emotionChartRef = ref(null)

// 23-2.3 情绪趋势图表
const initEmotionChart = () => {
  // 23-2.3.1 如果不存在情绪趋势图表容器，直接返回
  if (!emotionChartRef.value) return
  // 23-2.3.2 先销毁旧实例，避免重复初始化图表
  if (emotionChart) emotionChart.dispose()
  // 23-2.3.3 获取情绪趋势图表实例，初始化最新趋势数据  
  emotionChart = echarts.init(emotionChartRef.value)
  // 23-2.3.4 获取情绪趋势数据赋值给emotionTrendData
  const emotionTrendData = overviewData.value.emotionTrend|| []
  // 23-2.4 配置情绪趋势图表选项
  const option = {
    // 23-2.4.1 图表标题
     title: {
      text: '情绪趋势分析',
      textStyle: {
        color: '#2d3436',
        fontSize: 16,
        fontWeight: '600'
      },
      left:'center',
      top:10
    },
    // 23-2.4.2 提示框配置
    tooltip: {
      trigger: 'axis',//触发类型
      borderColor: '#fab1a0',//边框颜色
      borderWidth: 1,
      textStyle: {
        color: '#2d3436',
      },
    },
    // 23-2.4.3 图例配置（平均情绪评分、记录数量）
    legend: { data: ['平均情绪评分', '记录数量'], top: 40 },
    // 23-2.4.4 网格配置（设置图表内容区域的位置）
    grid: {
      top: 80,
      bottom: '3',
      left: '3%',
      right: '4%'
    },
    // 23-2.4.5 X轴配置（遍历emotionTrendData，获取日期）
    xAxis: {
      type: 'category',
      data: emotionTrendData.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: '#2d3436'
        }
      }
    },
    // 23-2.4.6 Y轴配置（遍历emotionTrendData，获取情绪评分、记录数量）
    yAxis: [
       {
        type: 'value',
        name: '情绪评分',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#2d3436'
          }
        }
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#2d3436'
          }
        }
      }
    ],
    // 23-2.4.7 系列配置（平均情绪评分、记录数量）
    series: [
      {
        name: '平均情绪评分',
        type: 'line',
        data: emotionTrendData.map(item => item.avgMoodScore),
        smooth: true,
        lineStyle: { color: '#fab1a0', width: 3 },
        itemStyle: { color: '#fab1a0' }
      },
      {
        name: '记录数量',
        type: 'line',
        data: emotionTrendData.map(item => item.recordCount),
        smooth: true,
        lineStyle: { color: '#eeb5a3', width: 3 },
        itemStyle: { color: '#eeb5a3' }
      }
    ]
  }
  // 23-2.4.8 将图表选项设置为情绪趋势图表选项
  emotionChart.setOption(option)
}

onMounted(() => {
  // 23-1.3 页面一渲染时调用getOverview函数获取综合分析数据
  getOverview()
  // 23-2.5 初始化情绪趋势图表
  // initEmotionChart()
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