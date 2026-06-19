<!-- 9-1.1 封装页面搜索组件PageSearch -->
<template>
    <!-- 10-1.3 el-form绑定表单数据formData对象 -->
    <!-- 11-1.4.1 表单ref绑定 -->
    <el-form ref="ruleFormRef" :model="formData">
    <!-- 11-1.5 el-row布局，包含所有搜索表单项 -->
      <el-row :gutter="20">
        <!-- 9-1.6 v-for循环渲染所有搜索表单项 -->
        <template v-for="item in formItemAttr" :key="item.prop">
          <el-col v-bind="item.col">
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- 9-1.7 动态组件添加is属性,调用isCom根据com属性判断组件类型 -->
              <!-- 10-1.4 SOLO模式排查，用户输入内容不显示在输入框（没有绑定v-model） -->
              <component :is="isComp(item.comp)" 
                v-model="formData[item.prop]"
                :placeholder="item.placeholder">
                <!-- 10-1.1 如果comp属性为select下拉选择框,动态组件添加options属性 -->
                <template v-if="item.comp === 'select'">
                  <el-option label="全部" value="" />
                  <el-option v-for="option in item.options" 
                    :key="option.value" 
                    :label="option.label" 
                    :value="option.value" />
                </template>
              </component>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <el-row>
      <!-- 11-1.1 查询重置按钮，点击触发handleSearch和handleReset事件 -->
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <!-- 11-1.4.2 重置按钮，点击触发handleReset事件,并传递表单ref作为参数 -->
      <el-button type="primary" @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
</template>

<script setup>
// 10-1.2 引入vue的ref和reactive函数，定义formData对象
import { ref,reactive,computed } from 'vue'

// 11-1.2 定义事件emit，用于将查询事件传递给父组件,父组件通过@search事件处理函数接收查询事件
const emit = defineEmits(['search'])
// 9-1.5 定义props属性，PageSearch接收使用knowledge组件的formItem参数
const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})


// 11-1.6 计算属性formItemAttr，
// 根据不同屏幕宽度添加col属性，用于el-form-item布局
const formItemAttr = computed(() => {
  const { formItem } = props
  formItem.forEach(item => {
    item.col = {xs:24,sm:12,md:8,lg:6,xl:6}
  })
  return formItem
})

const ruleFormRef = ref(null)
const formData = reactive({})
// 9-1.8 isComp根据comp属性判断是否为input或select组件，返回对应的组件类型
const isComp = (comp) => {
  return  {
    input:'el-input',
    select:'el-select'
  }[comp]
}

// 11-1.3 查询事件，将formData对象中的数据传递给父组件
const handleSearch = () => {
  emit('search',formData)
}

// 11-1.4 重置事件，重置表单再查询（避免重置之后查询为空对象）
const handleReset = (formEl) => {
 // 11-1.4.3 存在表单ref时，resetFields()重置表单数据
 if(formEl){
  formEl.resetFields()
  emit('search',formData)
 }
 else return
}











</script>
