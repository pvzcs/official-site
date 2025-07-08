<template>
  <div class="members-pagination">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索成员昵称或所属组别..."
        class="search-input"
      />
    </div>

    <!-- 筛选选项 -->
    <div class="filter-box">
      <div class="filter-item">
        <label>按组别筛选：</label>
        <select v-model="selectedGroup" class="group-filter">
          <option value="">全部</option>
          <option v-for="group in uniqueGroups" :key="group" :value="group">
            {{ group }}
          </option>
        </select>
      </div>
      
      <div class="filter-item">
        <label>每页显示：</label>
        <select v-model="pageSize" class="page-size-selector">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="30">30</option>
        </select>
      </div>
    </div>

    <!-- 成员统计 -->
    <div class="stats">
      <span>共 {{ filteredMembers.length }} 位成员</span>
      <span v-if="searchQuery || selectedGroup">
        (已筛选，总共 {{ membersData.length }} 位)
      </span>
    </div>

    <!-- 上方分页控件 -->
    <div v-if="totalPages > 1" class="pagination pagination-top">
      <button
        @click="changePage(1)"
        :disabled="currentPage === 1 || isAnimating"
        class="page-btn"
        title="首页"
      >
        ⟪
      </button>
      
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1 || isAnimating"
        class="page-btn"
        title="上一页"
      >
        ⟨
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          @click="typeof page === 'number' ? changePage(page) : null"
          :disabled="isAnimating"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        <span v-else class="page-ellipsis">...</span>
      </template>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages || isAnimating"
        class="page-btn"
        title="下一页"
      >
        ⟩
      </button>
      
      <button
        @click="changePage(totalPages)"
        :disabled="currentPage === totalPages || isAnimating"
        class="page-btn"
        title="末页"
      >
        ⟫
      </button>

      <div class="page-info">
        第 {{ currentPage }} / {{ totalPages }} 页
      </div>
    </div>

    <!-- 成员展示 -->
    <div class="nav-card">
      <div ref="cardGridRef" class="card-grid">
        <div
          v-for="(member, index) in paginatedMembers"
          :key="`${currentPage}-${member.name}`"
          :ref="(el: any) => setCardRef(el as HTMLElement, index)"
          class="card-item"
        >
          <a :href="member.link" target="_blank" class="card-link">
            <div class="card-avatar">
              <img :src="member.img" :alt="member.name" />
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ member.name }}</h3>
              <p class="card-desc">{{ member.desc }}</p>
              <div v-if="member.badge" class="card-badge" :class="`badge-${member.badgeType || 'default'}`">
                {{ member.badge }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        @click="changePage(1)"
        :disabled="currentPage === 1 || isAnimating"
        class="page-btn"
        title="首页"
      >
        ⟪
      </button>
      
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1 || isAnimating"
        class="page-btn"
        title="上一页"
      >
        ⟨
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          @click="typeof page === 'number' ? changePage(page) : null"
          :disabled="isAnimating"
          :class="['page-btn', { active: currentPage === page }]"
        >
          {{ page }}
        </button>
        <span v-else class="page-ellipsis">...</span>
      </template>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages || isAnimating"
        class="page-btn"
        title="下一页"
      >
        ⟩
      </button>
      
      <button
        @click="changePage(totalPages)"
        :disabled="currentPage === totalPages || isAnimating"
        class="page-btn"
        title="末页"
      >
        ⟫
      </button>

      <div class="page-info">
        第 {{ currentPage }} / {{ totalPages }} 页
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { animate, stagger } from 'motion'

interface Member {
  name: string
  desc: string
  link: string
  img: string
  badge?: string
  badgeType?: string
}

const props = defineProps<{
  membersData: Member[]
}>()

// 响应式数据
const searchQuery = ref('')
const selectedGroup = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 动画相关的引用
const cardGridRef = ref<HTMLElement>()
const cardRefs = ref<(HTMLElement | null)[]>([])
const isAnimating = ref(false)

// 设置卡片引用
const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el && el instanceof HTMLElement) {
    cardRefs.value[index] = el
  }
}

// 解析成员数据中的组别信息
const uniqueGroups = computed(() => {
  const groups = new Set<string>()
  props.membersData.forEach(member => {
    const desc = member.desc
    const groupMatches = desc.match(/(管理组|策划组|美术组|音乐组|剪辑组|文案组)/g)
    if (groupMatches) {
      groupMatches.forEach(group => groups.add(group))
    }
  })
  return Array.from(groups).sort()
})

// 计算属性：过滤后的成员
const filteredMembers = computed(() => {
  let filtered = props.membersData

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.desc.toLowerCase().includes(query)
    )
  }

  // 按组别过滤
  if (selectedGroup.value) {
    filtered = filtered.filter(member =>
      member.desc.includes(selectedGroup.value)
    )
  }

  return filtered
})

// 计算属性：当前页的成员
const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMembers.value.slice(start, end)
})

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredMembers.value.length / pageSize.value)
})

// 计算属性：可见的页码
const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const delta = 2 // 当前页前后显示的页数

  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)

  // 调整范围以保持最多显示 5 个页码
  if (end - start < 4 && total > 5) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else if (end === total) {
      start = Math.max(1, end - 4)
    }
  }

  const pages: (number | string)[] = []
  
  // 添加页码
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // 添加省略号和边界页码
  if (start > 1) {
    if (start > 2) {
      pages.unshift('...')
    }
    pages.unshift(1)
  }

  if (end < total) {
    if (end < total - 1) {
      pages.push('...')
    }
    pages.push(total)
  }

  return pages
})

// 动画函数
const animateCards = async () => {
  if (isAnimating.value || !cardGridRef.value) return
  
  isAnimating.value = true
  
  // 获取所有卡片元素
  const cards = cardRefs.value.filter(Boolean)
  
  if (cards.length === 0) {
    isAnimating.value = false
    return
  }
  
  // 先隐藏所有卡片
  cards.forEach(card => {
    if (card) {
      card.style.opacity = '0'
      card.style.transform = 'translateY(20px) scale(0.95)'
    }
  })
  
  // 等待下一帧
  await nextTick()
  
  // 使用stagger动画依次显示卡片
  await animate(
    cards,
    {
      opacity: [0, 1],
      transform: ['translateY(20px) scale(0.95)', 'translateY(0px) scale(1)']
    },
    {
      duration: 0.1,
      delay: stagger(0.01)
    }
  )
  
  isAnimating.value = false
}

// 页面切换动画
const changePage = async (newPage: number) => {
  if (isAnimating.value || newPage === currentPage.value) return
  
  // 先执行退出动画
  const cards = cardRefs.value.filter(Boolean)
  if (cards.length > 0) {
    await animate(
      cards,
      {
        opacity: [1, 0],
        transform: ['translateY(0px) scale(1)', 'translateY(-10px) scale(0.98)']
      },
      {
        duration: 0.1,
        delay: stagger(0.01)
      }
    )
  }
  
  // 更新页面
  currentPage.value = newPage
  
  // 等待DOM更新
  await nextTick()
  
  // 执行进入动画
  await animateCards()
}

// 监听筛选条件变化，重置到第一页
watch([searchQuery, selectedGroup, pageSize], async () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
}, { flush: 'sync' })

// 监听总页数变化，确保当前页不超过范围
watch(totalPages, async (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    currentPage.value = newTotal
  }
}, { flush: 'sync' })

// 监听分页成员变化，触发动画
watch(paginatedMembers, async () => {
  if (!isAnimating.value) {
    await nextTick()
    await animateCards()
  }
}, { flush: 'post' })

// 组件挂载后执行初始动画
onMounted(async () => {
  await nextTick()
  await animateCards()
})

// 暴露给父组件的方法
defineExpose({
  resetPagination: () => {
    currentPage.value = 1
    searchQuery.value = ''
    selectedGroup.value = ''
  }
})
</script>

<style scoped>
.members-pagination {
  max-width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

.search-box {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.filter-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-box label {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  white-space: nowrap;
}

.group-filter,
.page-size-selector {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  min-width: 120px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.group-filter:hover,
.page-size-selector:hover {
  border-color: var(--vp-c-brand-1);
}

.group-filter:focus,
.page-size-selector:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.stats {
  margin-bottom: 2rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  text-align: center;
  padding: 0.75rem;
  background: var(--vp-c-bg-alt);
  border-radius: 6px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.nav-card {
  display: grid;
  margin-bottom: 3rem;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.card-item {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
  min-height: 90px;
  display: flex;
  flex-direction: column;
}

.card-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px var(--vp-c-shadow);
  transform: translateY(-2px);
}

.card-link {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  gap: 1rem;
}

.card-avatar {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.card-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--vp-c-border);
}

.card-content {
  flex: 1;
  text-align: left;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.375rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.2;
  word-break: break-word;
}

.card-desc {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.card-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  margin-top: auto;
  align-self: flex-start;
}

.badge-tip {
  background: var(--vp-c-tip-soft);
  color: var(--vp-c-tip-darker);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 3rem 0 2rem 0;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.pagination-top {
  margin: 1.5rem 0 2rem 0;
  padding: 1rem;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
}

.page-btn {
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  min-width: 44px;
  font-weight: 500;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.page-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 4px var(--vp-c-brand-soft);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.page-btn:disabled:hover {
  transform: none;
}

.page-ellipsis {
  padding: 0.6rem 0.3rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.page-info {
  margin-left: 1.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-alt);
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.75rem;
  }
  
  .card-item {
    min-height: 85px;
  }
  
  .card-link {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .card-avatar {
    margin-top: 0.1rem;
  }
  
  .card-avatar img {
    width: 45px;
    height: 45px;
  }
  
  .card-title {
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
  }
  
  .card-desc {
    font-size: 0.75rem;
  }
  
  .filter-box {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .pagination {
    gap: 0.25rem;
  }
  
  .pagination-top {
    padding: 0.75rem;
    margin: 1rem 0 1.5rem 0;
  }
  
  .page-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
    min-width: 36px;
  }
  
  .page-info {
    margin-left: 0.5rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .members-pagination {
    padding: 0 0.25rem;
    margin: 1rem auto;
  }
  
  .search-box {
    margin-bottom: 1rem;
  }
  
  .search-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .filter-box {
    gap: 0.75rem;
    padding: 0.5rem;
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .filter-box label {
    font-size: 0.85rem;
    text-align: center;
  }
  
  .group-filter,
  .page-size-selector {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .stats {
    margin-bottom: 1rem;
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .card-link {
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .card-avatar img {
    width: 40px;
    height: 40px;
  }
  
  .card-title {
    font-size: 0.9rem;
  }
  
  .card-desc {
    font-size: 0.7rem;
  }
  
  .card-badge {
    font-size: 0.65rem;
    padding: 0.15rem 0.3rem;
  }
  
  .pagination {
    gap: 0.25rem;
    padding: 0.75rem;
    margin: 1.5rem 0 1rem 0;
    flex-direction: column;
  }
  
  .pagination-top {
    padding: 0.5rem;
    margin: 0.75rem 0 1rem 0;
    flex-direction: column;
  }
  
  .pagination > div:first-child {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    min-width: 36px;
  }
  
  .page-info {
    margin: 0.75rem 0 0 0;
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
