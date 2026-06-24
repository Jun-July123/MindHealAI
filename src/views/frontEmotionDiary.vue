<template>
  <div class="emotionDiary-container">
    <!-- 28-1.1 情绪日记分为头部标题和情绪内容两部分 -->
    <div class="header-section">
      <div class="header-content">
        <el-image :src="likeUrl" style="width: 60px; height: 60px;"></el-image>
        <h1>情绪日记</h1>
      </div>
    </div>

    <!-- 28-1.2 情绪内容包括情绪评分、主要情绪及情绪详细记录及按钮四部分 -->
    <div class="content">
      <!-- 28-1.3 情绪评分（标题和星级评分） -->
      <div class="diary-card">
        <div class="title">情绪评分</div>
        <div class="section">
          <p>您今天的整体情绪状态如何？(1-10分)</p>
          <!-- 28-1.3.1 el-rate实现评分、v-model绑定日记表单的情绪评分、最大值10分 -->
          <!-- 28-1.3.2 :texts绑定评分状态、在星级评分右侧显示情绪状态 -->
          <div class="rate">
            <el-rate v-model="diaryForm.moodScore" :texts="emotionStatus" 
            show-text :max="10" size="large"
            />
          </div>
        </div>
      </div>

      <!-- 28-1.4 主要情绪（标题及情绪卡片） -->
      <div class="diary-card">
        <div class="title">主要情绪</div>
        <!-- 28-1.4.1 情绪卡片，包括情绪图片及情绪名称 -->
        <!-- 28-1.4.2 v-for遍历情绪选项、el-image绑定情绪图片地址 -->
        <div class="emotion-grid">
          <!-- 28-2.1 情绪卡片注册点击事件，传递所点击的情绪名称、选择情绪 -->
          <!-- 28-2.3 当选择的情绪名称与表单dominantEmotion相同时，添加selected类，表示选中 -->
          <div 
            @click="onSelectEmotion(emotion.name)"
            :class="{'selected': emotion.name === diaryForm.dominantEmotion}"
            v-for="emotion in emotionOptions" :key="emotion.name" class="emotion-card">
            <el-image :src="emotion.url" style="width: 50px; height: 50px;"></el-image>
            <div class="emotion-name">{{emotion.name }}</div>
          </div>
        </div>
      </div>

      <!-- 28-1.5 情绪详细记录（情绪触发因素、今日感想、生活质量、按钮） -->
      <div class="diary-card">
        <div class="title">详细记录</div>
        <div class="detail-form">
          <div class="form-group">
            <!-- 28-1.5.1 el-input输入情绪触发因素，v-model绑定表单emotionTrigger -->
            <!-- 类型为多行文本、最大字数1000，显示字数限制 -->
            <label class="form-label">情绪触发因素</label>
            <el-input 
              v-model="diaryForm.emotionTrigger" 
              type="textarea" :rows="3"
              maxLength="1000" show-word-limit
              placeholder="是什么影响了你的情绪呢？"></el-input>
          </div>
          <!-- 28-1.5.2 el-input输入情绪内容，v-model绑定表单emotionContent-->
          <!-- 类型为多行文本、最大字数1=2000，显示字数限制  -->
          <div class="form-group">
            <div class="form-label">今日感想</div>
            <el-input 
              v-model="diaryForm.dairyContent" 
              type="textarea" :rows="5" maxLength="2000" show-word-limit
              placeholder="分享你今天的情绪感想吧！"></el-input>
          </div>
          <!-- 28-1.5.3 el-select选择生活质量（包括睡眠质量、压力水平）等级 -->
          <!-- v-model分别绑定表单sleepQuality及stressLevel -->
          <div class="life-indicators">
            <div class="form-group">
              <div class="form-label">睡眠质量</div>
              <el-select v-model="diaryForm.sleepQuality" placeholder="请选择" style="width: 90px;">
                <el-option label="很差" :value="1"></el-option>
                <el-option label="较差" :value="2"></el-option>
                <el-option label="一般" :value="3"></el-option>
                <el-option label="良好" :value="4"></el-option>
                <el-option label="优秀" :value="5"></el-option>
              </el-select>
            </div>

            <div class="form-group">
              <div class="form-label">压力水平</div>
              <el-select v-model="diaryForm.stressLevel" placeholder="请选择" style="width: 90px;">
                <el-option label="很低" :value="1"></el-option>
                <el-option label="较低" :value="2"></el-option>
                <el-option label="中等" :value="3"></el-option>
                <el-option label="较高" :value="4"></el-option>
                <el-option label="很高" :value="5"></el-option>
              </el-select>
            </div>
          </div>

          <!-- 28-1.6 表单按钮（重置及提交表单） -->
          <div class="action-buttons">
            <!-- 28-2.4 重置按钮注册点击事件 -->
            <el-button @click="onResetForm">重置</el-button>
            <!-- 28-2.6 提交按钮注册点击事件 -->
            <el-button @click="onSubmitForm" type="primary" size="large">提交记录</el-button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { dayjs } from 'element-plus'
import { ElMessage } from 'element-plus'
import { postEmotionDiaryAPI } from '@/api/user'
const likeUrl = new URL('@/assets/images/like.png', import.meta.url).href

// 28-1.2.1 定义日记表单初始值（日期、情绪分数、主要情绪、
// 情绪触发因素、日记内容、睡眠质量、压力水平
const diaryForm = reactive({
  diaryDate: dayjs().format('YYYY-MM-DD'),
  moodScore: null,
  dominantEmotion: '',
  emotionTrigger: '',
  dairyContent: '',
  sleepQuality: null,
  stressLevel: null,
})

// 28-1.2.2 定义情绪评分状态数组
const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']

// 28-1.2.3 定义情绪选项
const emotionOptions = [
  {name: '开心',url: new URL('@/assets/images/开心.png', import.meta.url).href},
  {name: '平静',url: new URL('@/assets/images/平静.png', import.meta.url).href},
  {name: '焦虑',url: new URL('@/assets/images/焦虑.png', import.meta.url).href},
  {name: '悲伤',url: new URL('@/assets/images/悲伤.png', import.meta.url).href},
  {name: '兴奋',url: new URL('@/assets/images/兴奋.png', import.meta.url).href},
  {name: '惊讶',url: new URL('@/assets/images/惊讶.png', import.meta.url).href},
  {name: '困惑',url: new URL('@/assets/images/困惑.png', import.meta.url).href},
]

// 28-2.2 选择情绪事件、接收点击的情绪名称、更新表单的主要情绪
const onSelectEmotion = (emotion) => {
  diaryForm.dominantEmotion = emotion
}

// 28-2.5 重置事件、Object.assign将表单内容设置为初始值
const onResetForm = () => {
  Object.assign(diaryForm,{
    diaryDate: dayjs().format('YYYY-MM-DD'),
    moodScore: null,
    dominantEmotion: '',
    emotionTrigger: '',
    dairyContent: '',
    sleepQuality: null,
    stressLevel: null,
  })
}

// 28-2.7 提交记录事件
const onSubmitForm = () => {
  // 28-2.7.1 如果当前没有进行情绪评分、提示选择情绪评分
  if (!diaryForm.moodScore) {
    ElMessage.error('请选择情绪评分')
    return
  }
  // 28-2.7.2 调用提交日志记录接口、传递日记表单
  postEmotionDiaryAPI(diaryForm).then(()=>{
    // 28-2.7.3 提交成功、显示提交成功并重置表单
    ElMessage.success('提交成功')
    onResetForm()
  })
}




</script>

<style scoped lang="scss">
.emotionDiary-container {
    // margin: 0 auto;
    // width: 1200px;
    // display: flex;
    // gap: 20px;
    // padding: 20px;
    background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);
    .header-section {
        background: linear-gradient(135deg, #7ED321 0%, #F5A623 100%);
        color: white;
        padding: 48px;
        // width: 100%;
        .header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
    }
    .content {
        margin: 0 auto;
        width: 980px;
        padding: 20px;
        .diary-card {
            margin-bottom: 20px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            .title {
                margin-bottom: 20px;
                font-size: 25px;
                font-weight: 600;
                color: #374151;
            }
            .section {
                margin-bottom: 20px;
                p {
                    font-size: 15px;
                    color: #6B7280;
                    margin-bottom: 15px;
                }
            }
            .emotion-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                .emotion-card {
                    padding: 15px;
                    border: 2px solid #E5E7EB;
                    border-radius: 15px;
                    text-align: center;
                    cursor: pointer;
                    background: #F9FAFB;
                    .emotion-name {
                        margin-top: 10px;
                        padding: 0 75px;
                        color: #374151;
                    }
                    &.selected {
                        border-color: #7ED321;
                        background: #F0FDF4;
                        transform: translateY(-3px);
                    }
                }
            }
            .detail-form {
                .form-label {
                    margin: 10px 0;
                    color: #374151;
                }
                .life-indicators {
                    display: flex;
                    gap: 20px;
                    .indicator-group {
                        flex: 1;
                    }
                }
                .action-buttons {
                    margin-top: 40px
                }
            }
        }
    }
}
</style>