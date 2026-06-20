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
          <!-- 21-2.6 详情按钮注册点击事件，传递当前行数据 -->
          <el-button @click="onMessageDetail(scope.row)" type="primary" size="mini" text>详情</el-button>
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

    <!-- 21-2.1 对话详情弹窗，v-model绑定showDialog控制弹窗显示隐藏 -->
    <!-- :close-on-click-modal点击弹窗外页面，弹窗不会自动取消 -->
    <el-dialog
      v-model="showDialog"
      title="咨询会话详情"
      width="70%"
      :close-on-click-modal="false"
    >
      <!-- 21-2.8 sessionBasic渲染对话详情头部，sessionMessage渲染对话列表 -->
      <div class="session-detail">
        <!-- 21-2.8.1 sessionBasic渲染头部对话基本信息 -->
        <!-- 21-2.2 对话详情-头部基本信息 -->
        <div class="detail-header">
          <!-- 21-2.2.1 基本信息-用户信息 -->
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{ sessionBasic.userNickname }}</div>
          </div>
          <!-- 21-2.2.2 基本信息-开始时间 -->
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">{{ sessionBasic.startTime }}</div>
          </div>
          <!-- 21-2.2.3 基本信息-消息数量 -->
          <div class="detail-row">
            <div class="detail-label">消息数量：</div>
            <div class="detail-value">{{ sessionBasic.messageCount }}</div>
          </div>  
        </div>

        <!-- 21-2.8.2 sessionMessage渲染对话列表，v-for遍历对话列表，根据发送者类型判断是用户消息还是AI助手消息，并根据样式渲染 -->
        <!-- 21-2.3 对话详情-对话消息列表 -->
        <div class="messages-container">
          <!-- 21-2.3.1 对话消息列表-头部标题 -->
          <div class="messages-header">
            <h4>对话记录</h4>
          </div>
          <!-- 21-2.3.2 对话消息列表-对话消息 -->
          <div class="messages-list" v-loading="loadingSession">
            <div v-for="message in sessionMessages" :key="message.id" class="message-item" :class="message.senderType===1 ? 'user-message':'ai-message'">
              <!-- 21-2.3.3 对话消息-对话头部（发送者类型、发送时间） -->
              <div class="messages-header">
                <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <!-- 21-2.3.4 对话消息-对话内容 -->
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 21-2.4 底部关闭按钮，点击关闭弹窗 -->
      <template #footer>
        <el-button type="primary" @click="showDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,onMounted ,reactive} from 'vue'
import PageHead from '@/components/PageHead.vue'
import { getSessionsAPI, getSessionsByIdMessagesAPI } from '@/api/admin.js'

const tableData = ref([])

// 21-1.4 consultations定义分页参数
const pagination = reactive({currentPage: 1,size: 10,total: 0,})

// 21-1.5 consultations定义获取咨询记录列表函数
const onPageSearch = () => {
  // 21-1.5.1 调用咨询记录接口getSessionsAPI，获取咨询记录列表
  getSessionsAPI(pagination).then(res => {
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


const showDialog = ref(false)//对话详情弹窗显示隐藏
const sessionBasic = ref({})//对话基本信息
const sessionMessages = ref([])//对话消息列表
// 28-2.9 定义对话详情加载状态loadingSession，默认false不加载
const loadingSession = ref(false)//对话详情加载状态

// 21-2.7 详情事件，接收当前行数据row
const onMessageDetail = (row) => {
  // 21-2.7.1 打开详情弹窗
  showDialog.value = true
  // 28-2.9.1 打开详情弹窗后，显示加载状态
  loadingSession.value = true

  // 21-2.7.2 调用对话详情接口getSessionsByIdMessagesAPI
  // 接收当前行数据row.id，获取对话记录详情
  getSessionsByIdMessagesAPI(row.id).then(res => {
    // 21-2.7.3 将接口获取的对话记录详情数据，赋值给对话消息列表sessionMessages
    sessionMessages.value = res
    // 21-2.7.4 将当前行数据row，赋值给对话基本信息sessionBasic
    sessionBasic.value = row

    // 28-2.9.2 调用接口获取到对话列表后，隐藏加载状态
    loadingSession.value = false
  })
}


// 21-1.6 页面一渲染获取咨询记录列表
onMounted(() => {
  onPageSearch()
})
</script>

<style lang="scss" scoped>
 .session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    // max-height: 70vh;
    // overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        .sender {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }

        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>
