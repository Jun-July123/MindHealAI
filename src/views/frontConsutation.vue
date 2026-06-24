<template>
  <div class="consultation-container">
    <!-- 左侧导航栏 -->
    <!-- 26-2.1 AI咨询分为左侧聊天基本信息和右侧聊天区域 -->
    <div class="sidebar">
      <!-- 26-2.2 基本信息-AI助手信息（需要引入AI助手的头像） -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="logoUrl" style="width: 25px; height: 25px;"/>
        </div>
        <h3 class="assistant-name">心愈AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>在线中
        </div>
      </div>
      
      <!-- 27-3.4 动态渲染情绪花园 -->
      <!-- 27-2.1 基本信息-情绪花园(标题、情绪信息、温暖建议) -->
      <div class="emotion-garden">
        <h4 class="garden-title">情绪花园</h4>
        <!-- 27-2.2 情绪信息包括情绪名称和情绪分数 -->
        <div class="emotion-info">
          <div class="emotion-name">{{currentEmotion.primaryEmotion}}</div>
          <div class="emotion-score">{{currentEmotion.emotionScore}}</div>
        </div>
        
        <!-- 27-2.3 温暖建议包括情绪状态、情绪强度、建议、治愈行动、风险提示-->
        <div class="warm-tips">
          <!-- 情绪状态 -->
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <!-- 27-3.4.1 根据情绪是否为负面情绪判断情绪状态，如果是负面情绪则显示“需要关注”，否则显示“很不错哦” -->
            <span class="status-emotion">{{currentEmotion.isNegative ? '需要温暖' : '很不错呢'}}</span>
          </div>

          <!-- 情绪强度 -->
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <!-- 27-3.4.3 v-for渲染3个dot，调用情绪强度函数传递情绪分数，获取情绪强度 -->
              <!-- 当情绪强度大于等于index时，添加active类 -->
              <span class="dot" 
                v-for="index in 3" 
                :key="index" 
                :class="{'active': getIntensityClass(currentEmotion.emotionScore) >= index}" >
              </span>
            </span>
            <!-- 27-3.4.5 调用获取风险提示的函数，传递情绪风险等级，获取风险程度 -->
            <span class="intensity-text">{{ getRiskText(currentEmotion.riskLevel) }}</span>
          </div>

          <!-- 建议 -->
          <!-- 27-3.4.6 当存在情绪建议时，显示建议 -->
          <div class="warm-suggestion" v-if="currentEmotion.suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你一些建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          
          <!-- 治愈行动 -->
          <!-- 27-3.4.7 当治愈行动列表长度 > 0时，显示治愈行动 -->
          <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
              <div class="actions-title">治愈小行动</div>
              <div class="actions-list">
                <!-- 27-3.4.8 v-for遍历治愈行动列表，渲染每个治愈行动项 -->
                <div v-for="action in currentEmotion.improvementSuggestions" :key="action" class="action-item">
                  <div class="action-icon">✨</div>
                  <div class="action-text">{{ action }}</div>
                </div>
              </div>
          </div>

          <!-- 风险提示 -->
          <!-- 27-3.4.9 当情绪为消极且情绪风险等级大于1时，显示风险提示 -->
          <div class="risk-notice" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
            <div class="notice-icon">🤗</div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">{{currentEmotion.riskDescription}}</div>
            </div>
          </div>
        </div>

      </div>
        <!-- 26-4.3 基本信息-会话列表(包含会话标题、会话列表) -->
      <div class="session-history">
        <h4 class="session-title">会话列表</h4>
        <!-- 26-4.4 v-for遍历会话列表，渲染每个会话项 -->
        <div class="session-list">
          <!-- 26-5.5 每一条会话项注册点击事件，被选中后，传递该会话对象 -->
          <div @click="onSelectSession(session)" v-for="session in sessionList" :key="session.sessionId" class="session-item">
            <!-- 26-4.5 每个会话包含会话信息和删除按钮 -->
            <div class="session-info">
              <!-- 26-4.6 会话信息（会话标题、会话开始时间、会话最后一条消息内容、会话消息数量、会话持续时间） -->
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <!-- 会话开始时间 -->
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <!-- 会话最后一条消息内容 -->
                <div class="session-preview">{{ session.lastMessageContent }}</div>
                <!-- 会话消息数量、会话持续时间 -->
                <div class="session-status">
                  <span class="status-dot">
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span class="status-dot">
                    <el-icon>
                      <Clock />
                    </el-icon>
                    {{ session.durationMinutes || 0 }}分钟
                  </span>
                </div>
              </div>

              <!-- 会话删除按钮 -->
              <div class="session-actions">
                <!-- 26-5.2 删除会话按钮注册点击事件，传递该会话id -->
                <el-button @click="onDeleteSession(session.id)" text type="danger" size="mini">
                  <el-icon>
                    <DeleteFilled />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    

    <!-- 26-2.3 聊天区域（包含聊天顶部、聊天内容区域、聊天消息发送区域） -->
    <div class="chat-main">
      <!-- 26-2.4 聊天顶部（包含左侧ai助手信息、右侧新建会话按钮） -->
      <div class="chat-header">
        <!-- 左侧头像 -->
        <div class="header-left">
          <div class="chat-avatar">
            <el-image :src="likeUrl" style="width: 30px; height: 30px;"/>
          </div>
          <div class="chat-info">
            <h3 class="assistant-name">心愈智伴AI助手</h3>
            <p>倾听您的故事，用温暖和智慧伴你左右~</p>
          </div>
        </div>

        <!-- 右侧按钮 -->
         <el-button circle @click="onCreateSession" title="新建会话">
            <el-icon>
              <Plus />
            </el-icon>
        </el-button>
      </div>
         
      <!-- 26-2.5 聊天内容区域 -->
      <div class="chat-messages">
        <!-- 26-2.5.1 定义对话信息数组，如果对话信息数组为空，显示欢迎信息 -->
        <div v-if="chatMessages.length === 0" class="message-item ai-message">
          <!-- 26-2.5.2 对话左侧头像 -->
          <div class="message-avatar">
            <el-image :src="logoUrl" style="width: 18px; height: 18px;"/>
          </div>
          <!-- 26-2.5.3 对话右侧消息内容 -->
          <div class="message-content">
            <div class="message-bubble">
              <p>欢迎来到心愈智伴 AI 助手，我是陪伴你的小愈，心事、情绪、烦恼都可以放心和我聊聊。</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>

        <!-- 26-5.7 v-for遍历对话消息记录，渲染每个消息项（消息项左侧头像、消息项右侧消息内容和消息发送时间） -->
        <!-- 26-5.7.1 当消息发送者是用户，消息添加user-message类，否则添加ai-message类 -->
        <!-- 26-6.5 v-for遍历对话消息 chatMessages -->
        <div class="message-item" v-for="msg in chatMessages" :key="msg.id" :class="msg.senderType == 1 ? 'user-message' : 'ai-message'">
          <div class="message-avatar">
            <!-- 26-5.7.2 对话左侧头像，根据消息发送者是用户或AI助手，显示不同的头像 -->
            <el-image :src= "msg.senderType == 1 ? userUrl : logoUrl" style="width: 18px; height: 18px;"/>
          </div>
          <!-- 26-5.8 对话右侧消息内容及消息发送时间 -->
          <div class="message-content">
            <div class="message-bubble"> 
              <!-- 26-5.8.1 当消息是错误状态，显示信息错误提示 -->
              <div v-if="msg.isError" class="error-message">
                <p>{{ msg.content }}</p>
              </div>

              <!-- 26-5.8.2 当消息发送者是AI、且是正在输入状态，显示AI助手正在思考中状态 ..-->
              <div v-if="msg.senderType == 2 && isAiTyping && !msg.content" class="typing-indicator">
                <div v-for="(dot, index) in 3" :key="index" class="typing-dot active"></div>
              </div>

              <!-- 26-5.8.3 当消息发送者是AI，引入MarkdownRenderer组件，传递消息内容，格式化显示AI助手返回消息 -->
              <MarkdownRenderer v-else-if="msg.senderType == 2 " :content="msg.content" :is-ai-message="true" />

              <!-- 26-5.8.4 当消息发送者是用户，将用户发送的消息格式化(实现换行)、v-html显示用户输入消息， -->
              <p v-else-if="msg.content" v-html="formatMessage(msg.content)"></p>
            </div>

            <!-- 26-5.8.5 消息下方显示发送时间 -->
            <div class="message-time">{{ msg.senderType == 2 && isAiTyping ? '正在思考...' : msg.createdAt }}</div>
          </div>
        </div>
      </div>

      <!-- 26-2.6 聊天消息发送区域 -->
      <div class="chat-input">
        <!-- 26-2.6.1 左侧信息输入框，v-model绑定用户输入的消息，type="textarea"多行输入框 -->
        <!-- 消息输入框:disabled绑定isAiTyping（判断AI是否正在输入） -->
        <!-- 26-6.2 键盘注册按下事件 -->
        <div class="input-container">
            <el-input 
              v-model="userMessage"
              placeholder="请输入您想要分享的内容..." 
              type="textarea"
              :rows="3"
              @keydown="onKeyDownMessage"
              :disabled="isAiTyping"
              class="message-input"
              clearable></el-input>
              <!-- 26-6.4 消息输入框下方显示按Enter发送，Shift+Enter换行，输入字符数 -->
              <div class="input-footer">
                <span>按Enter发送，Shift+Enter换行</span>
                <span>{{ userMessage.length }}/500</span>
              </div>
        </div>
        <!-- 26-2.6.2 右侧发送按钮 -->
        <!-- 26-3.4 发送消息按钮，注册发送事件 -->
        <!-- 26-6.1 当用户输入的消息为空或超过500个字符时，禁用发送按钮 -->
        <el-button :disabled="!userMessage.trim() || userMessage.length > 500" @click="onSendMessage" class="send-btn" type="primary">
          <el-icon>
            <Promotion />
          </el-icon>
        </el-button>
      </div>

    </div>

    
  </div>
</template>

<script setup>
import { Promotion } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue'
import { postSessionStartAPI, getSessionListAPI, deleteSessionAPI, getSessionMessagesAPI , getSessionEmotionAPI} from '@/api/user'
import { ElMessage , ElMessageBox} from 'element-plus'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { isNavigationFailure } from 'vue-router';

const logoUrl= new URL('@/assets/images/robot-fill.png', import.meta.url).href
const likeUrl= new URL('@/assets/images/like.png', import.meta.url).href
const userUrl= new URL('@/assets/images/users.png', import.meta.url).href    
// 定义对话信息
const chatMessages = ref([])
// 定义用户输入的消息
const userMessage = ref('')
const userAIMessage = ref('')
// 当前会话
const currentSession = ref(null)

// 26-3.2 新建会话
const createSession = () => {
  // 26-3.2.1 创建新的会话对象
  const newSession = {
    sessionId: `temp_${Date.now()}`,// 会话唯一标识
    status: 'TEMP',// 会话状态(临时会话)
    sessionTitle: '新对话',// 会话类型
  }
  // 26-3.2.2 将新的会话对象赋值给当前会话对象
  currentSession.value = newSession
}

// 定义AI是否正在输入
const isAiTyping = ref(false)
// 26-3.5 发送消息事件
const onSendMessage = () => {
  // 26-3.5.1 将用户输入的消息去除首尾空格字符
  const message = userMessage.value.trim()
  chatMessages.value.push({
    senderType: 1,
    content: message,
    createdAt: new Date().toLocaleString(),
  })

  // 26-3.5.2 检查用户是否输入了消息,如果没有输入,则返回
  if (!message) {return}

  // 26-3.5.3 当前AI正在输入,则提示用户稍后再试，返回
  if (isAiTyping.value) {
    ElMessage({
      message: '小愈正在思考中,请稍后再试...',
      type: 'warning'
    })
    return
  }
  
  // 26-3.5.4 用户输入的信息不为空，AI没有在输入，发送消息给AI
  // 清除输入框内容
  userMessage.value = ''

  // 26-3.5.5 如果当前为新会话，调用开始新对话函数
  if (currentSession.value.status === 'TEMP') {
    startNewSession(message)
  }else{
    // 27-1.6 再次发送消息给AI
    // 26-1.6.1 当前为正式会话，将用户输入的消息添加到对话列表chatMessages中
    // chatMessages.value.push({
    //   id:`user_${Date.now()}`,
    //   senderType: 1,
    //   content: message,
    //   createdAt: new Date().toISOSString(),
    // })
    // 26-1.6.2 调用开始ai流式回复函数，传递当前会话id和用户输入的消息
    startAiResponse(currentSession.value.sessionId, message)
  }
}

// 26-3.3 开始新会话(新对话转化为正式会话)，接收用户输入的消息
const startNewSession = async (message) => {
  // 26-3.3.1 定义会话参数（会话消息、会话标题）
  const sessionParams = {
    initialMessage: message,// 初始消息
    sessionTitle: `心愈AI助手 - ${new Date().toLocaleString()}` ,
  }

  // 26-3.3.2 调用开始新会话接口，传递会话参数，获取开始会话数据
  await postSessionStartAPI(sessionParams).then(res => {
    // 26-3.3.3 将获取到的数据转换为前端会话对象格式（会话状态为正式会话ACTIVE）
    const session = {
      sessionId: res.sessionId,
      sessionTitle: sessionParams.sessionTitle,
      status: 'ACTIVE',
    }
    // 26-3.3.4 将新会话作为当前会话（新会话更新为正式会话状态）
    Object.assign(currentSession.value, session)
  })

  // 26-4.2.4 每开始一次新对话，就更新会话列表
  getSessionList()
  // 27-1.5 开始新对话后，就开始进行ai流式回复,传递当前会话id和用户输入的消息
  startAiResponse(currentSession.value.sessionId, message)
}

// 27-1.1 开始ai流式回复,接收会话id和用户输入的消息
const startAiResponse = (sessionId, userMessage) => {
  // 27-1.1.1 判断当前AI是否正在输入,如果正在输入,则提示用户稍后再试，返回
  if(isAiTyping.value) {
    ElMessage.warning('小愈正在思考中,请稍后再试...')
    return
  }
  // 没有正在输入,则设置为正在输入
  isAiTyping.value = true

  // 27-1.1.2 定义ai消息对象（包含id、senderType、content、createAt时间）
  const aiMessage = {
    id:`ai_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,// 生成随机id
    senderType:2,
    content:'',
    createAt: new Date().toISOString(),
  }

  // 27-1.1.3 将ai消息添加到对话列表chatMessages
  chatMessages.value.push(aiMessage)
  // 27-1.1.4 下载ai流式回复依赖npm install @microsoft/fetch-event-source
  // 27-1.1.5 引入fetchEventSource流式接口

  const controller = new AbortController()//用于终止fetch请求
  // 27-1.2 调用fetchEventSource流式接口，进行ai流式回复
  // 27-1.2.1 传递流式对话接口
  fetchEventSource('/api/psychological-chat/stream', {
    // 27-1.2.2 请求方法POST
    method: 'POST',
    // 27-1.2.3 请求头（Content-Type、token、Accept）
    headers: {
      'Content-Type': 'application/json',
      'token': localStorage.getItem('token'),
      'Accept': 'text/event-stream',
    },
    // 27-1.2.4 请求体（sessionId、userMessage）
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    // 27-1.2.5 信号量（定义阻止请求实例，配置终止fetch请求信号量）
    signal: controller.signal,
    // 27-1.2.6 流式建立成功后，执行一次onopen
    // 当响应的请求头获取到的Content-Type不为流式格式text/event-stream，提示用户稍后再试，返回
    onopen: (response) => {
      if(response.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.error('服务器返回非流式数据，请稍后再试')
      }
    },
    // 27-1.2.7 每获取到流式数据，执行onmessage
    onmessage: (streamData) => {
      // 27-1.3 onmessage事件处理
      // 27-1.3.1 从流式数据中提取内容并去除首尾空格,
      const row = streamData.data.trim()
      // 27-1.3.2 检查消息是否为空,如果为空,则返回
      if(!row) {return}

      // 27-1.3.3 获取当前ai消息内容
      const aiMessage = chatMessages.value[chatMessages.value.length - 1]

      const messageType = streamData.event 
      // 27-1.3.4 如果消息类型是done,则当前是最后一条消息，结束流式对话
      if(messageType === 'done') {
        isAiTyping.value = false
        controller.abort() // 终止fetch请求
        // 27-3.6 当ai回复结束时，调用获取会话的情绪分析，传递会话id，进行情绪分析
        getSessionEmotion(currentSession.value.sessionId)
      }
      
      const messageData = JSON.parse(row)
      const messageCode = messageData.code
      // 27-1.3.5 如果不是done,并且有消息数据有content,消息状态正常，则将当前消息内容拼接在aiMessage.content中
      if(messageCode && messageData.data.content) {
        aiMessage.content += messageData.data.content
      }
      // 27-1.3.6 如果消息数据状态不正常,则提示用户稍后再试，返回
      else if(!messageCode) {
        aiErrorResponse.value = messageData.message || 'AI回复失败'
      }
    },
    // 27-1.2.8 流式建立失败后，ai回复失败执行一次onError
    onError: (error) => {
      aiErrorResponse(error || '服务器返回错误，请稍后再试')
    },
    // 27-1.2.9 流式建立关闭后，执行一次onClose（开始情绪分析）
    onClose: () => {
      // 27-3.7 当关闭流式对话时，调用会话的情绪分析，传递会话id，进行情绪分析
      getSessionEmotion(currentSession.value.sessionId)
    },
  })
}

// 27-1.4 ai回复失败事件
const aiErrorResponse = (errorMessage) => {
  // 27-1.4.1 获取当前ai消息内容
  const aiMessage = chatMessages.value[chatMessages.value.length - 1]
  // 27-1.4.2 如果当前ai消息存在,则将错误信息赋值给aiMessage.content
  if(aiMessage) {
    aiMessage.content = 'AI回复失败：' + errorMessage
  }
  // 27-1.4.3 切换ai是否正在输入状态为false,提示用户错误信息
  isAiTyping.value = false
  ElMessage.error(errorMessage)
}

// 会话列表
const sessionList = ref([])
// 26-4.2 获取会话列表
const getSessionList = () => {
  // 26-4.2.1 调用获取会话列表接口，获取会话列表数据
  getSessionListAPI({pageNum: 1,pageSize: 10,}).then(res => {
    // 26-4.2.2 将获取到的会话列表数据赋值给sessionList
    sessionList.value = res.records  
  })
}

// 26-5.3 删除会话事件，接收会话id
const onDeleteSession = (sessionId) => {
//   26-5.3.1 确认删除弹窗
  ElMessageBox.confirm('确认删除该会话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 26-5.3.1 确认删除，调用删除会话接口，传递会话id
      deleteSessionAPI(sessionId).then(res => {
        // 26-5.3.2 删除成功后，提示删除成功,刷新会话列表
        ElMessage.success('删除成功')
        getSessionList()
      })
    })
}

// 换行处理
const formatMessage = (message) => {
  return message.replace(/\n/g, '<br>')
}

// 被选中的会话消息列表
// const selectedMessage = ref([])
// 26-5.6 选择会话事件，接收会话对象
const onSelectSession = (session)=>{
  // 26-5.6.1 调用获取会话的消息记录接口，传递会话id
  getSessionMessagesAPI(session.id).then(res => {
    // 26-5.6.2 将获取到的会话消息记录数据赋值给对话消息列表selectedMessages
    // 26-6.4 将接口获取到的会话消息记录数据赋值给对话消息列表chatMessages
    chatMessages.value = res
    // selectedMessage.value = res
  })

  // 27-3.5 选中会话获取会话消息记录后，调用获取会话的情绪分析，传递会话id，进行情绪分析
  getSessionEmotion(session.id)

  // 26-5.6.3 更新当前会话对象数据为选中的会话对象数据
  const sessionData = {
    sessionId: "session_" + session.id,
    sessionTitle: session.sessionTitle,
    status: 'ACTIVE',
  }
  currentSession.value = sessionData
}

// 26-6.3 键盘按下事件
const onKeyDownMessage = (e) => {
  // 26-6.3.1 按住 Shift + Enter , 允许换行，不触发发送
  if (e.shiftKey && e.key === 'Enter') return
  // 26-6.3.2 按下 Enter, 阻止默认换行，执行发送
  if (e.key === 'Enter') {
    e.preventDefault()
    onSendMessage()
  }
}

//27-3.2 定义当前情绪分析数据(主要情绪、情绪分数、是否负面情绪、建议、风险等级、改进建议、风险描述)
const currentEmotion = ref({
  primaryEmotion:'中性',
  emotionScore: 60,
  isNegative: false,
  suggestion: '情绪状态平稳',
  riskLevel: 0,
  improvementSuggestions:[],
  riskDescription: '情绪状态平稳'
})

// 27-3.3 获取会话的情绪分析数据，接收会话id
const getSessionEmotion = (sessionId) =>{
  // 27-3.3.1 确保sessionId格式正确，以session_开头，否则在sessionId前添加session_前缀
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`
  // 27-3.3.2 调用获取会话的情绪分析接口，传递会话id
  getSessionEmotionAPI(id).then(res => {
    console.log('获取情绪分析结果:', res)
    // 27-3.3.3 将获取到的情绪分析结果赋值给currentEmotion
    currentEmotion.value = res
  })
}

// 27-3.4.2 定义获取情绪强度的函数，接收情绪分数，返回情绪强度
const getIntensityClass = (score) => {
  if(score >= 60) return 3
  else if(score >= 30) return 2
  else return 1
}

// 27-3.4.4 定义获取风险提示的函数，接收情绪风险等级，返回风险程度
const getRiskText = (level) => {
  switch(level) {
    case 0:return '正常'
    case 1:return '关注'
    case 2:return '预警'
    case 3:return '风险'
    default:return '未知'
  }
}



onMounted(() => {
  // 26-4.2.3 页面初始化时，获取会话列表
  getSessionList()
  // 26-3.2.3 页面初始化时，新建一个会话
  createSession()
})



</script>

<style scoped lang="scss">
.consultation-container {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    gap: 20px;
    padding: 20px;
    .sidebar {
        width: 320px;
        .ai-assistant-info {
            margin-bottom: 20px;
            // background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(232, 244, 255, 0.95) 100%);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.08);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            .breathing-circle {
                width: 60px;
                height: 60px;
                // background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                // background: linear-gradient(135deg, #8ac5f6 0%, #5aadf6 100%);
                background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                animation: breathing 4s ease-in-out infinite;
                box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                position: relative;
            }
            .assistant-name {
                font-size: 16px;
                font-weight: 700;
                // background: linear-gradient(135deg, #fb923c, #f59e0b);
                background: linear-gradient(135deg, #74b9ff, #0984e3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                background-clip: text;
                margin: 0 0 12px;
            }
            .online-status {
                display: flex;
                align-items: center;
                justify-content: center;
                color: #059669;
                font-size: 12px;
                font-weight: 600;
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #059669;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                    box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                }
            }
        }
        .session-history {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            min-height: 250px;
            display: flex;
            flex-direction: column;
            .section-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
                margin: 0 0 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
            }
            .session-list {
                overflow-y: auto;
                max-height: 200px;
                scrollbar-width: thin;
                scrollbar-color: rgba(64, 150, 255, 0.3) transparent;
                .session-item {
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px;
                    margin-bottom: 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    &:hover {
                        background: #f8f9ff;
                        border-color: #e6f0ff;
                    }
                    &.active {
                        background: #e6f0ff;
                        border-color: #4096ff;
                    }
                    .session-info {
                        flex: 1;
                        .session-title {
                            font-weight: 500;
                            font-size: 14px;
                            color: #333;
                            margin-bottom: 4px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            .session-meta {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                margin-bottom: 6px;
                                .session-time {
                                    font-size: 12px;
                                    color: #999;
                                }
                            }
                            .session-preview {
                                width: 200px;
                                font-size: 12px;
                                color: #666;
                                margin-bottom: 6px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .session-status {
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                span {
                                    font-size: 12px;
                                    color: #999;
                                    display: flex;
                                    align-items: center;
                                    gap: 4px;
                                }
                            }
                        }
                        .session-actions {
                            position: absolute;
                            top: 10px;
                            // right: 12px;
                            right: 6px;
                        }
                    }
                }
                .no-sessions-text {
                    text-align: center;
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .emotion-garden {
            background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
            border-radius: 20px;
            padding: 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            min-height: 300px;
            
            .garden-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
                z-index: 2;
                .garden-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #8b4513;
                }
            }
            .emotion-info {
                margin: 0 auto;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                color: #fff;
                .emotion-name {
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                }
                .emotion-score {
                    font-size: 14px;
                    font-weight: 700;
                    opacity: 0.9;
                }
            }
            .warm-tips {
                text-align: center;
                margin-bottom: 16px;
                .emotion-status-text {
                    margin-bottom: 12px;
                    .status-label {
                        font-size: 14px;
                        color: #8b7355;
                        margin-right: 8px;
                    }
                    .status-emotion {
                        font-size: 16px;
                        font-weight: 600;
                        padding: 4px 12px;
                        border-radius: 16px;
                        display: inline-block;
                    }
                }
                .emotion-intensity {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    .intensity-dots {
                        display: flex;
                        gap: 4px;
                        .dot {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background: #e0e0e0;
                            transition: all 0.3s ease;
                            &.active {
                                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                transform: scale(1.2);
                                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                            }
                        }
                    }
                    .intensity-text {
                        font-size: 12px;
                        color: #8b7355;
                        font-weight: 500;
                    }
                }
                .warm-suggestion {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                    border-radius: 16px;
                    padding: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    .suggestion-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .suggestion-content {
                        text-align: left;
                        flex: 1;
                        .suggestion-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 6px;
                        }
                        .suggestion-text {
                            font-size: 13px;
                            color: #6b5b47;
                            line-height: 1.5;
                        }
                    }
                }
                .healing-actions {
                    margin-bottom: 16px;
                    .actions-title {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #8b7355;
                        margin-bottom: 16px;
                    }
                    .actions-list {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        .action-item {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                            border-radius: 12px;
                            padding: 12px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.5);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                            text-align: left;
                            .action-icon {
                                font-size: 14px;
                                color: #ffd700;
                                flex-shrink: 0;
                            }
                            .action-text {
                                font-size: 12px;
                                color: #6b5b47;
                                line-height: 1.4;
                                flex: 1;
                            }
                        }
                    }
                }
                .risk-notice {
                    background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border: 1px solid rgba(255, 234, 167, 0.6);
                    box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);
                    .notice-icon {
                        font-size: 20px;
                        flex-shrink: 0;
                        margin-top: 2px;
                    }
                    .notice-content {
                        flex: 1;
                        .notice-title {
                            font-size: 14px;
                            font-weight: 600;
                            color: #d4840f;
                            margin-bottom: 6px;
                        }
                        .notice-text {
                            font-size: 13px;
                            color: #b8740c;
                            line-height: 1.5;
                        }
                    }
                }
            }
        }
    }
    .chat-main {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
        border-radius: 20px;
        box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
        border: 1px solid rgba(251, 146, 60, 0.1);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
        .chat-header {
            background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
            // background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            color: white;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-shrink: 0;
            .header-left {
                display: flex;
                align-items: center;
                .chat-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                }
                .chat-info {
                    h2 {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }
                    p {
                        font-size: 14px;
                    }
                }
            }
        }
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
            min-height: 0;
            max-height: calc(100vh - 200px);
            scrollbar-width: thin;
            scrollbar-color: rgba(251, 146, 60, 0.3) transparent;
            .message-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                &.ai-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #fb923c, #f59e0b);
                        box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                    }
                }
                &.user-message {
                    .message-avatar {
                        background: linear-gradient(135deg, #6b7280, #4b5563);
                        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                    }
                }
                .message-content {
                    max-width: 70%;
                    .message-bubble {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                        border-radius: 16px;
                        padding: 12px 16px;
                        position: relative;
                        animation: fadeInUp 0.4s ease-out;
                        border: 1px solid rgba(251, 146, 60, 0.1);
                        box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);
                        .typing-indicator {
                            display: flex;
                            gap: 4px;
                            padding: 8px 0;
                            .typing-dot {
                                width: 8px;
                                height: 8px;
                                background: #ccc;
                                border-radius: 50%;
                                animation: typing 1.5s ease-in-out infinite;
                                &:nth-child(2) {
                                    animation-delay: 0.2s;
                                }
                                &:nth-child(3) {
                                    animation-delay: 0.4s;
                                }   
                            }
                        }
                        /* 错误消息样式 */
                        .error-message {
                            background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                            border: 1px solid #F87171;
                            border-radius: 12px;
                            padding: 12px 16px;
                            color: #991B1B;
                            font-weight: 500;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                    }
                    .message-time {
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;
                    }
                }
            }
        }
        .chat-input {
            border-top: 1px solid rgba(251, 146, 60, 0.1);
            padding: 20px 24px;
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            .input-container {
                flex: 1;
            }
            .input-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #78716c;
                font-weight: 500;
            }
            .send-btn {
                height: 60px;
                width: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                border: none !important;
                box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                transition: all 0.3s ease;
            }

        }

    }
}
</style>