<template>
  <div class="countdown-timer">
    <div class="countdown-container">
      <div class="countdown-title" v-if="title">
        {{ title }}
      </div>
      
      <div v-if="!isExpired" class="countdown-display">
        <div class="time-unit" v-if="showDays && timeLeft.days > 0">
          <div class="time-value">{{ timeLeft.days }}</div>
          <div class="time-label">天</div>
        </div>
        
        <div class="time-unit">
          <div class="time-value">{{ formatTime(timeLeft.hours) }}</div>
          <div class="time-label">时</div>
        </div>
        
        <div class="time-separator">:</div>
        
        <div class="time-unit">
          <div class="time-value">{{ formatTime(timeLeft.minutes) }}</div>
          <div class="time-label">分</div>
        </div>
        
        <div class="time-separator">:</div>
        
        <div class="time-unit">
          <div class="time-value">{{ formatTime(timeLeft.seconds) }}</div>
          <div class="time-label">秒</div>
        </div>
      </div>
      
      <div v-else class="countdown-expired">
        <div class="expired-message">
          {{ expiredMessage || '倒计时已结束' }}
        </div>
      </div>
      
      <div class="countdown-footer" v-if="description">
        <p class="countdown-description">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

interface Props {
  targetDate: string | Date  // 目标时间
  title?: string            // 倒计时标题
  description?: string      // 倒计时描述
  expiredMessage?: string   // 过期消息
  showDays?: boolean       // 是否显示天数
  autoStart?: boolean      // 是否自动开始
}

const props = withDefaults(defineProps<Props>(), {
  showDays: true,
  autoStart: true,
  expiredMessage: '倒计时已结束'
})

const emit = defineEmits<{
  expired: []              // 倒计时结束事件
  tick: [timeLeft: TimeLeft] // 每秒触发事件
}>()

// 响应式数据
const timeLeft = ref<TimeLeft>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0
})

const isExpired = computed(() => timeLeft.value.total <= 0)
let intervalId: ReturnType<typeof setInterval> | null = null

// 获取当前时间戳
const getCurrentTimestamp = (): number => {
  return Date.now()
}

// 获取目标时间戳
const getTargetTimestamp = (): number => {
  if (typeof props.targetDate === 'string') {
    return new Date(props.targetDate).getTime()
  } else {
    return props.targetDate.getTime()
  }
}

// 计算剩余时间
const calculateTimeLeft = (): TimeLeft => {
  const now = getCurrentTimestamp()
  const target = getTargetTimestamp()
  const difference = target - now

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0
    }
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    total: difference
  }
}

// 格式化时间（补零）
const formatTime = (time: number): string => {
  return time.toString().padStart(2, '0')
}

// 更新倒计时
const updateCountdown = () => {
  const newTimeLeft = calculateTimeLeft()
  timeLeft.value = newTimeLeft
  
  emit('tick', newTimeLeft)
  
  if (newTimeLeft.total <= 0 && intervalId) {
    clearInterval(intervalId)
    intervalId = null
    emit('expired')
  }
}

// 开始倒计时
const startCountdown = () => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  
  updateCountdown()
  
  if (!isExpired.value) {
    intervalId = setInterval(updateCountdown, 1000)
  }
}

// 停止倒计时
const stopCountdown = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// 重置倒计时
const resetCountdown = () => {
  stopCountdown()
  updateCountdown()
}

// 暴露方法给父组件
defineExpose({
  startCountdown,
  stopCountdown,
  resetCountdown,
  timeLeft: computed(() => timeLeft.value),
  isExpired
})

// 生命周期
onMounted(() => {
  if (props.autoStart) {
    startCountdown()
  } else {
    updateCountdown()
  }
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped>
.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
}

.countdown-container {
  text-align: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px var(--vp-c-shadow);
  max-width: 600px;
  width: 100%;
  box-sizing: border-box;
}

.countdown-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.countdown-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  min-width: 70px;
  box-shadow: 0 2px 8px var(--vp-c-shadow);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.time-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.time-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
  font-weight: 500;
}

.time-separator {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin: 0 0.25rem;
  align-self: flex-start;
  margin-top: 0.75rem;
}

.countdown-expired {
  padding: 2rem 1rem;
}

.expired-message {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-warning-soft);
  color: var(--vp-c-warning-darker);
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-warning);
}

.countdown-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.countdown-description {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .countdown-timer {
    padding: 0.5rem;
  }
  
  .countdown-container {
    padding: 1.25rem;
    margin: 0 0.5rem;
    border-radius: 10px;
    max-width: 100%;
  }
  
  .countdown-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
  
  .countdown-display {
    gap: 0.375rem;
    margin-bottom: 0.75rem;
  }
  
  .time-unit {
    padding: 0.5rem 0.625rem;
    min-width: 58px;
    border-radius: 6px;
  }
  
  .time-value {
    font-size: 1.4rem;
  }
  
  .time-label {
    font-size: 0.65rem;
    margin-top: 0.2rem;
  }
  
  .time-separator {
    font-size: 1.2rem;
    margin-top: 0.4rem;
    margin: 0 0.15rem;
  }
  
  .countdown-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .countdown-timer {
    padding: 0.25rem;
  }
  
  .countdown-container {
    padding: 1rem;
    margin: 0 0.25rem;
    border-radius: 8px;
  }
  
  .countdown-title {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }
  
  .countdown-display {
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }
  
  .time-unit {
    padding: 0.4rem 0.5rem;
    min-width: 52px;
    border-radius: 5px;
  }
  
  .time-value {
    font-size: 1.25rem;
  }
  
  .time-label {
    font-size: 0.6rem;
  }
  
  .time-separator {
    font-size: 1.1rem;
    margin: 0 0.1rem;
    margin-top: 0.3rem;
  }
}

@media (max-width: 480px) {
  .countdown-timer {
    padding: 0.125rem;
  }
  
  .countdown-container {
    padding: 0.75rem;
    margin: 0;
    border-radius: 6px;
    box-shadow: 0 2px 8px var(--vp-c-shadow);
  }
  
  .countdown-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  
  .countdown-display {
    flex-direction: row;
    gap: 0.2rem;
    margin-bottom: 0.5rem;
    justify-content: space-around;
    flex-wrap: nowrap;
  }
  
  .time-separator {
    display: block;
    font-size: 1rem;
    margin: 0 0.05rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  
  .time-unit {
    min-width: 45px;
    padding: 0.35rem 0.4rem;
    border-radius: 4px;
    flex: 1;
    max-width: 60px;
  }
  
  .time-value {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .time-label {
    font-size: 0.55rem;
    margin-top: 0.15rem;
  }
  
  .expired-message {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }
  
  .countdown-expired {
    padding: 1rem 0.5rem;
  }
  
  .countdown-footer {
    margin-top: 0.75rem;
    padding-top: 0.5rem;
  }
  
  .countdown-description {
    font-size: 0.8rem;
    line-height: 1.4;
  }
}

@media (max-width: 360px) {
  .countdown-container {
    padding: 0.5rem;
  }
  
  .countdown-title {
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }
  
  .countdown-display {
    gap: 0.15rem;
  }
  
  .time-unit {
    min-width: 40px;
    padding: 0.3rem 0.35rem;
    max-width: 55px;
  }
  
  .time-value {
    font-size: 1rem;
  }
  
  .time-label {
    font-size: 0.5rem;
  }
  
  .time-separator {
    font-size: 0.9rem;
    margin: 0 0.03rem;
    margin-top: 0.2rem;
  }
  
  .expired-message {
    font-size: 0.9rem;
    padding: 0.4rem 0.75rem;
  }
  
  .countdown-description {
    font-size: 0.75rem;
  }
}

/* 极小屏幕优化 */
@media (max-width: 320px) {
  .countdown-container {
    padding: 0.4rem;
    margin: 0;
    border-radius: 4px;
  }
  
  .countdown-title {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    word-break: break-word;
  }
  
  .countdown-display {
    gap: 0.1rem;
  }
  
  .time-unit {
    min-width: 35px;
    padding: 0.25rem 0.3rem;
    max-width: 50px;
    border-radius: 3px;
  }
  
  .time-value {
    font-size: 0.9rem;
    font-weight: 700;
  }
  
  .time-label {
    font-size: 0.45rem;
    margin-top: 0.1rem;
  }
  
  .time-separator {
    font-size: 0.8rem;
    margin: 0 0.02rem;
    margin-top: 0.15rem;
  }
  
  .expired-message {
    font-size: 0.85rem;
    padding: 0.3rem 0.5rem;
    word-break: break-word;
  }
  
  .countdown-expired {
    padding: 0.5rem 0.25rem;
  }
  
  .countdown-footer {
    margin-top: 0.5rem;
    padding-top: 0.3rem;
  }
  
  .countdown-description {
    font-size: 0.7rem;
    word-break: break-word;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .countdown-container {
    background: var(--vp-c-bg-alt);
  }
  
  .time-unit {
    background: var(--vp-c-bg-soft);
  }
}

/* 动画效果 */
.time-value {
  transition: all 0.3s ease;
}

.time-unit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--vp-c-shadow);
}

/* 焦点和可访问性 */
.countdown-timer {
  position: relative;
}

.countdown-container {
  position: relative;
  overflow: hidden;
}

.countdown-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, var(--vp-c-brand-soft), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.countdown-container:hover::before {
  opacity: 0.1;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
</style>
