# 倒计时组件使用示例

## 基础用法

```vue
<template>
  <div>
    <!-- 基础倒计时 -->
    <CountdownTimer
      :target-date="'2024-12-31 23:59:59'"
      title="新年倒计时"
      description="距离2024年结束还有"
    />
    
    <!-- 不显示天数的倒计时 -->
    <CountdownTimer
      :target-date="endTime"
      title="活动倒计时"
      :show-days="false"
      expired-message="活动已结束"
      @expired="onCountdownExpired"
      @tick="onCountdownTick"
    />
    
    <!-- 手动控制的倒计时 -->
    <CountdownTimer
      ref="countdownRef"
      :target-date="'2024-08-15 12:00:00'"
      title="考试倒计时"
      :auto-start="false"
    />
    
    <div class="controls">
      <button @click="startCountdown">开始</button>
      <button @click="stopCountdown">暂停</button>
      <button @click="resetCountdown">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CountdownTimer from './CountdownTimer.vue'

const countdownRef = ref()

// 动态设置结束时间（当前时间后30分钟）
const endTime = ref('')

onMounted(() => {
  const now = new Date()
  const future = new Date(now.getTime() + 30 * 60 * 1000) // 30分钟后
  endTime.value = future.toISOString()
})

// 事件处理
const onCountdownExpired = () => {
  console.log('倒计时结束了！')
  // 这里可以执行一些操作，比如跳转页面、显示提示等
}

const onCountdownTick = (timeLeft) => {
  console.log('剩余时间:', timeLeft)
  // 可以在这里实现自定义逻辑，比如当剩余时间少于5分钟时显示警告
  if (timeLeft.total <= 5 * 60 * 1000) {
    console.warn('时间不多了！')
  }
}

// 手动控制方法
const startCountdown = () => {
  countdownRef.value?.startCountdown()
}

const stopCountdown = () => {
  countdownRef.value?.stopCountdown()
}

const resetCountdown = () => {
  countdownRef.value?.resetCountdown()
}
</script>
```

## 组件 Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `targetDate` | `string \| Date` | - | 目标时间（必需） |
| `title` | `string` | - | 倒计时标题 |
| `description` | `string` | - | 倒计时描述 |
| `expiredMessage` | `string` | `'倒计时已结束'` | 过期时显示的消息 |
| `showDays` | `boolean` | `true` | 是否显示天数 |
| `autoStart` | `boolean` | `true` | 是否自动开始倒计时 |

## 组件事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `expired` | - | 倒计时结束时触发 |
| `tick` | `timeLeft: TimeLeft` | 每秒触发，返回剩余时间对象 |

## 组件方法

| 方法名 | 说明 |
|--------|------|
| `startCountdown()` | 开始倒计时 |
| `stopCountdown()` | 停止倒计时 |
| `resetCountdown()` | 重置倒计时 |

## 时间格式说明

目标时间支持多种格式：

```javascript
// ISO 8601 格式
'2024-12-31T23:59:59+08:00'

// 简单日期时间格式
'2024-12-31 23:59:59'
'2024-12-31'

// Date 对象
new Date('2024-12-31T23:59:59')
```

**注意**: 组件现在使用本地时间进行计算，目标时间将按照用户所在时区进行解析。

## TimeLeft 对象结构

```typescript
interface TimeLeft {
  days: number      // 剩余天数
  hours: number     // 剩余小时数
  minutes: number   // 剩余分钟数
  seconds: number   // 剩余秒数
  total: number     // 总剩余毫秒数
}
```

## 样式自定义

组件使用 CSS 变量，可以通过覆盖变量来自定义样式：

```css
/* 自定义主题色 */
:root {
  --vp-c-brand-1: #ff6b6b;
  --vp-c-brand-soft: rgba(255, 107, 107, 0.1);
}

/* 自定义倒计时容器 */
.countdown-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```
