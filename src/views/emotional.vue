<template>
  <div>
    <!-- 22-1.1 引入使用pageHead,页面标题 -->
    <pageHead title="情绪日志" />
    <!-- 22-1.2 引入使用pageSearch,搜索表单，:formItem绑定formItem搜索表单的配置项 -->
    <!-- 22-1.6 pageSearch组件标签注册search搜索日志列表事件 -->
    <pageSearch :formItem="formItem" @search="onPageSearch" />

    <!-- 22-1.3 el-table设置表格，:data绑定tableData表格数据 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 22-1.3.1 用户id列,prop接收用户ID -->
      <el-table-column prop="id" label="用户ID" width="80" />

      <!-- 22-1.3.2 会话id列，插槽接收scope获取当前行数据，用el-avatar显示用户昵称 -->
      <el-table-column label="会话Id" width="80">
        <template #default="scope">
          <el-avatar>{{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>

      <!-- 22-1.3.3 记录日期列，prop接收记录日期-->
      <el-table-column prop="diaryDate" label="记录日期" width="130" />

      <!-- 22-1.3.4 情绪评分列，插槽接收scope获取当前行数据，用el-rate显示情绪评分 -->
      <el-table-column label="情绪评分" >
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled></el-rate>
        </template>
      </el-table-column>

      <!-- 22-1.3.5 生活指标列，插槽接收scope获取当前行数据，显示睡眠质量和压力等级 -->  
      <el-table-column label="生活指标" width="130">
        <template #default="scope">
         <div>
          <p>睡眠：{{ scope.row.sleepQuality }} / 5</p>
          <p>压力：{{ scope.row.stressLevel }} / 5</p>
         </div>
        </template>
      </el-table-column>

      <!-- 22-1.3.6 情绪触发因素列，prop接收情绪触发因素 -->
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120" />

      <!-- 22-1.3.7 日记内容列，prop接收日记内容 -->
      <el-table-column prop="diaryContent" label="日记内容" width="120" />

      <!-- 22-1.3.8 操作列，插槽接收scope获取当前行数据，显示详情和删除按钮 -->
       <el-table-column label="操作" width="240">
        <template #default="scope">
          <!-- 22-2.1 详情按钮注册点击事件，传递当前行数据 -->
          <el-button @click="onDetail(scope.row)" type="primary" size="mini" text>详情</el-button>
          <el-button type="danger" size="mini" text>删除</el-button>
        </template>
      </el-table-column>
    </el-table> 

    <!-- 22-1.9 表格底部分页组件，:page-size绑定每页数量，:total绑定总记录数，@current-change绑定页数变化事件 -->
    <el-pagination
          layout="prev, pager, next"  
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="onPaginationChange"
          style="margin-top: 25px;"
          background
    />

    <!-- 22-2.3 详情弹窗-->
    <!-- 22-2.3.1 v-model绑定showDialog，控制弹窗显示隐藏状态 -->
    <!-- 22-2.3.2 :close-on-click-modal绑定是否点击弹窗外部关闭弹窗，false表示不关闭 -->
    <el-dialog 
      title="情绪日志详情"
      v-model="showDialog" 
      :close-on-click-modal="false"
      width="50%">

      <!-- 22-2.4 当curDiaryDetail存在时，显示详情内容（用户信息、情绪状态、日记内容、AI分析结果、日志时间、操作按钮） -->
      <div class="detail-content" v-if="curDiaryDetail">
        <!-- 22-2.5 详情内容-用户信息 -->
        <div class="detail-section">
          <!-- 22-2.5.1 h4用户信息标题 -->
          <h4>用户信息</h4>
          <!-- 22-2.5.2 el-descriptions组件显示2行2列用户信息（用户名、昵称、用户id、记录日期） -->
          <!-- 22-2.5.3 将获取到的当前日志数据渲染至el-descriptions组件中 -->
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ curDiaryDetail.username }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ curDiaryDetail.nickname }}</el-descriptions-item>
            <el-descriptions-item label="用户id">{{ curDiaryDetail.userId }}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{ curDiaryDetail.diaryDate }}</el-descriptions-item>   
          </el-descriptions>
        </div>

        <!-- 22-2.6 详情内容-情绪状态 -->
        <div class="detail-section">
          <!-- 22-2.6.1 h4情绪状态标题 -->
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <!-- 22-2.6.2 el-rate显示情绪评分，:model-value绑定渲染当前日志的情绪评分，:max绑定最大评分，disabled禁用编辑 -->
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="curDiaryDetail.moodScore" :max="10" disabled></el-rate>    
            </el-descriptions-item>
            <!-- 22-2.6.3 el-tag显示主要情绪，:type传递当前日志的主要情绪给getEmotionTagType函数 -->
            <!-- 根据情绪类型返回不同的标签颜色，渲染当前日志的主要情绪 -->
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(curDiaryDetail.dominantEmotion)">{{ curDiaryDetail.dominantEmotion || '-' }}</el-tag>
            </el-descriptions-item>
            <!-- 22-2.6.4 el-descriptions-item直接显示渲染当前日志的睡眠质量和压力等级 -->  
            <el-descriptions-item label="睡眠质量">{{ curDiaryDetail.sleepQuality || '-' }}/5</el-descriptions-item>
            <el-descriptions-item label="压力等级">{{ curDiaryDetail.stressLevel || '-' }}/5</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <!-- 22-2.7 详情内容-日记内容，el-descriptions组件2行1列显示日记内容（情感触发因素、日记内容） -->
        <div class="detail-section">
          <!-- 22-2.7.1 h4日记内容标题 -->
          <h4>日记内容</h4>
          <!-- 22-2.7.2 el-descriptions-item直接显示渲染当前日志的情感触发因素、日记内容 -->
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情感触发因素">{{ curDiaryDetail.emotionTriggers || '-' }}</el-descriptions-item>
            <el-descriptions-item label="日记内容">{{ curDiaryDetail.diaryContent || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      
        <!-- 22-2.8 详情内容-AI情绪分析结果 -->
        <div class="detail-section">
          <!-- 22-2.8.1 h4 AI情绪分析结果标题 -->
          <h4>AI情绪分析结果</h4>
          <!-- 22-2.8.2 el-descriptions组件显示2行2列AI情绪分析结果（主要情绪、情绪强度、风险等级、情绪性质、专业建议、风险描述、改善建议） -->
          <div class="ai-analysis-result">
            <el-descriptions :column="2" border>
              <!-- 22-2.9 AI情绪分析结果内容 -->
              <!-- 22-2.9.1 el-tag显示主要情绪，:type传递当前日志的主要情绪给getEmotionTagType函数 -->
              <!-- 根据情绪类型返回不同的标签颜色，渲染当前日志ai分析的主要情绪 -->
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(aiDate.primaryEmotion)">{{ aiDate.primaryEmotion}}</el-tag>
              </el-descriptions-item>
              <!-- 22-2.9.2 el-progress显示情绪强度，:percentage绑定当前日志ai分析的情绪强度，:color传递当前日志ai分析数据的情绪强度给getEmotionScoreColor函数 -->
              <!-- 根据情绪强度返回不同的进度条颜色，:stroke-width绑定进度条宽度 -->
              <el-descriptions-item label="情绪强度">
                <el-progress :percentage="aiDate.emotionScore" :color="getEmotionScoreColor(aiDate.emotionScore)" :stroke-width="8" />
              </el-descriptions-item>
              <!-- 22-2.9.3 el-tag显示风险等级，:type传递当前日志ai分析的风险等级给getAiEmotionTagType函数 -->
              <!-- 根据风险等级类型返回不同的标签颜色，调用getRiskLevelText传递当前日志ai分析的风险等级，渲染当前日志ai分析的风险等级文本 -->
              <el-descriptions-item label="风险等级">
                <el-tag :type="getRiskLevelTagType(aiDate.riskLevel)">{{ getRiskLevelText(aiDate.riskLevel)}}</el-tag>
              </el-descriptions-item> 
              <!-- 22-2.9.4 el-tag显示情绪性质，:type根据isNegative判断情绪性质类型,danger负面情绪，success正面情绪 -->
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiDate.isNegative ? 'danger' : 'success'">{{ aiDate.isNegative ? '负面情绪' : '正面情绪'}}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <!-- 22-2.9.5 专业建议,h5标题,div渲染显示当前日志ai分析的专业建议内容 -->
            <div class="ai-suggestion-section">
              <h5>专业建议</h5>
              <div class="suggestion-content">{{ aiDate.suggestion || '-' }}</div>
            </div>
            <!-- 22-2.9.6 风险描述,h5标题,div渲染显示当前日志ai分析的风险描述内容 -->
            <div class="ai-risk-section">
              <h5>风险描述</h5>
              <div class="risk-content">{{ aiDate.riskDescription || '-' }}</div>
            </div>
            <!-- 22-2.9.7 改善建议,h5标题,ul遍历当前日志ai分析的改善建议列表，渲染显示当前日志ai分析的改善建议 -->
            <div class="ai-improvements-section">
              <h5>改善建议</h5>
              <ul class="improvement-list">
                <li v-for="item in aiDate.improvementSuggestions" :key="item">{{ item || '-' }}</li>
              </ul>
            </div>  
          </div>
        </div>
         <!-- 22-2.10 详情内容-时间信息 -->
        <div class="detail-section">
          <!-- 22-2.10.1 h4时间信息标题 -->
          <h4>时间信息</h4>
          <!-- 22-2.10.2 el-descriptions组件显示2行2列时间信息（创建时间、更新时间） -->
          <el-descriptions :column="2" border>
            <!-- 22-2.10.3 渲染显示当前日志的创建时间、更新时间 -->
            <el-descriptions-item label="创建时间">{{ curDiaryDetail.createdAt}}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ curDiaryDetail.updatedAt }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <!-- 22-2.11 弹窗底部关闭按钮，点击关闭弹窗 -->
      <template #footer>
        <el-button type="primary" @click="showDialog = false">关闭</el-button>
      </template>
    
    </el-dialog>
  
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import pageHead from '@/components/pageHead.vue'
import pageSearch from '@/components/pageSearch.vue'
import { getEmotionPageAPI} from '@/api/admin.js'


const formItem = [
  // 22-1.2.1 配置项，输入用户ID
  {comp: 'input', label: '用户ID', prop: 'userId',placeholder: '请输入用户ID'},
  // 22-1.2.2 配置项，下拉选择情绪评分范围，options为情绪评分范围的选项
  {comp: 'select', label: '情绪评分', prop: 'moodScoreRange',placeholder: '请选择情绪评分范围',options: [
    {
      label: '低分（1-3）',
      value: '1-3'
    },
    {
      label: '中分（4-6）',
      value: '4-6'
    },
    {
      label: '高分（7-10）',
      value: '7-10'
    }
  ]},
]

const tableData = ref([])
const formData = reactive({})

// 22-1.5 定义分页参数
const pagination = reactive({currentPage: 1,size: 10,total: 0,})

// 22-1.7 日志列表搜索事件
const onPageSearch = async () => {
  // 22-1.7.1 构建搜索参数，包含表格数据，当前页数，每页数量
  const params = {
    ...formData,
    pageNum: pagination.currentPage,
    pageSize: pagination.size
  }
  // 22-1.7.2 调用getEmotionPageAPI函数，获取情绪日志列表数据
  const {records,total} = await getEmotionPageAPI(params)
  // 22-1.7.3 解构接口获取的数据，赋值更新表格数据和分页参数
  tableData.value = records
  pagination.total = total
}

// 22-1.10 页数变化事件
const onPaginationChange = (page) => {
  // 22-1.10.1 当前页码更新为点击页页码  
  pagination.currentPage = page
  // 22-1.10.2 调用onPageSearch函数，重新获取情绪日志列表数据
  onPageSearch()
}

const showDialog = ref(false)
const curDiaryDetail = ref(null)
const aiDate = ref(null)

// 22-2.2 详情事件，接收当前日志数据，获取日志详情
const onDetail = (row) => {
  // 22-2.3.3 点击详情触发详情事件后，显示弹窗
  showDialog.value = true
  // 22-2.2.1 将当前日志数据赋值给curDiaryDetail
  curDiaryDetail.value = row  
  // 22-2.2.2 如果当前日志包含AI情绪分析结果，获取并赋值给aiDate
  if (row.aiEmotionAnalysis) {
    aiDate.value = JSON.parse(row.aiEmotionAnalysis)
  }else{
    // 22-2.2.3 否则，将aiDate赋值为空对象
    aiDate.value = {}
  }
}

// 映射方法
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '开心': 'success',
    '快乐': 'success',
    '平静': 'info',
    '兴奋': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '快乐': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}


// 22-1.8 页面一渲染就获取情绪日志列表数据
onMounted(() => {
  onPageSearch()
})




</script>

<style scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}
/* AI分析相关样式 */
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>