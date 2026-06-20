<template>
  <div>
    <!-- 21-1.1 consultations引入使用PageHead组件，设置标题 -->
    <PageHead title="咨询记录" />
    <!-- 21-1.2 el-table设置表格,动态属性data绑定tableData -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 21-1.2.1 设置会话ID列，插槽接收scope获取当前行数据，用el-avatar显示用户昵称 -->
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar>{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <!-- 21-1.2.2 设置情绪日志列，插槽接收scope获取当前行数据，显示会话标题和会话最后一条消息内容-->
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <!-- 21-1.2.3 设置消息数列，prop接收messageCount，显示会话消息数 -->
      <el-table-column prop="messageCount" label="消息数" width="100" />
      <!-- 21-1.2.4 设置时间列，prop接收lastMessageTime，显示会话最后一条消息时间 -->
      <el-table-column prop="lastMessageTime" label="时间" width="200" />  
      <!-- 21-1.2.5 设置操作列，插槽接收scope获取当前行数据，显示详情按钮 -->
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button  type="primary" size="mini" text>详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 21-1.7 表格下方分页组件（直接从knowledge组件copy） --> 
    <!-- 绑定页数总数total，每页数量size，注册页数变化事件 -->
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
import { ref,onMounted ,reactive} from 'vue'
import PageHead from '@/components/PageHead.vue'
import { getPsychologicalChatSessionsAPI } from '@/api/admin.js'

const tableData = ref([])

// 21-1.4 consultations定义分页参数
const pagination = reactive({currentPage: 1,size: 10,total: 0,})

// 21-1.5 consultations定义获取咨询记录列表函数
const onPageSearch = () => {
  // 21-1.5.1 调用咨询记录接口getPsychologicalChatSessionsAPI，获取咨询记录列表
  getPsychologicalChatSessionsAPI(pagination).then(res => {
    // 21-1.5.2 从接口获取的咨询记录数据，解构赋值给tableData和pagination
    const{records,total} = res
    tableData.value = records
    pagination.total = total
  })
}


// 21-1.8 页数变化事件
const onPaginationChange = (page) => {
  // 21-1.8.1 当前页码更新为点击页页码  
  pagination.currentPage = page
  // 21-1.8.2 调用onPageSearch函数，重新获取咨询记录列表数据
  onPageSearch()
}



// 21-1.6 页面一渲染获取咨询记录列表
onMounted(() => {
  onPageSearch()
})
</script>
