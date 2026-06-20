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
          <el-rate :value="scope.row.moodScore" :max="10" disabled></el-rate>
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
          <el-button type="primary" size="mini" text>详情</el-button>
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
  
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import pageHead from '@/components/pageHead.vue'
import pageSearch from '@/components/pageSearch.vue'
import { getEmotionPageAPI } from '@/api/admin.js'

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

// 22-1.8 页面一渲染就获取情绪日志列表数据
onMounted(() => {onPageSearch()})



</script>