<template>
    <div class="members-pagination">
        <!-- 搜索框 -->
        <div class="search-box">
            <div class="search-input-wrapper">
                <svg
                    class="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索成员昵称或所属组别..."
                    class="search-input"
                />
                <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="clear-search"
                    title="清除搜索"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>

        <!-- 筛选选项 -->
        <div class="filter-box">
            <div class="filter-item">
                <label>按组别筛选：</label>
                <select v-model="selectedGroup" class="group-filter">
                    <option value="">全部</option>
                    <option
                        v-for="group in uniqueGroups"
                        :key="group"
                        :value="group"
                    >
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
            <div class="stats-content">
                <svg
                    class="stats-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span class="stats-text"
                    >共
                    <strong>{{ filteredMembers.length }}</strong> 位成员</span
                >
                <span v-if="searchQuery || selectedGroup" class="stats-filter">
                    (已筛选，总共 {{ membersData.length }} 位)
                </span>
            </div>
        </div>

        <!-- 顶部分页控件 -->
        <div v-if="totalPages > 1" class="pagination pagination-top">
            <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="page-btn"
                title="首页"
            >
                ⟪
            </button>

            <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="page-btn"
                title="上一页"
            >
                ⟨
            </button>

            <template v-for="page in visiblePages" :key="page">
                <button
                    v-if="page !== '...'"
                    @click="
                        currentPage =
                            typeof page === 'number' ? page : currentPage
                    "
                    :class="[
                        'page-btn',
                        'page-btn-desktop',
                        { active: currentPage === page },
                    ]"
                >
                    {{ page }}
                </button>
                <span v-else class="page-ellipsis page-ellipsis-desktop"
                    >...</span
                >
            </template>

            <!-- 移动端简化分页 -->
            <template
                v-for="page in mobileVisiblePages"
                :key="`mobile-${page}`"
            >
                <button
                    @click="
                        currentPage =
                            typeof page === 'number' ? page : currentPage
                    "
                    :class="[
                        'page-btn',
                        'page-btn-mobile',
                        { active: currentPage === page },
                    ]"
                >
                    {{ page }}
                </button>
            </template>

            <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="page-btn"
                title="下一页"
            >
                ⟩
            </button>

            <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="page-btn"
                title="末页"
            >
                ⟫
            </button>

            <!-- 页面跳转功能（当页数过多时显示） -->
            <div v-if="useSimplePagination" class="page-jump">
                <input
                    v-model="jumpToPage"
                    type="number"
                    :min="1"
                    :max="totalPages"
                    placeholder="跳转"
                    class="jump-input"
                    @keyup.enter="goToPage"
                />
                <button
                    @click="goToPage"
                    class="jump-btn"
                    :disabled="!jumpToPage"
                >
                    跳转
                </button>
            </div>

            <div class="page-info">
                第 {{ currentPage }} / {{ totalPages }} 页
            </div>
        </div>

        <!-- 成员展示 -->
        <div class="nav-card">
            <div class="card-grid">
                <div
                    v-for="member in paginatedMembers"
                    :key="member.name"
                    class="card-item"
                >
                    <a :href="member.link" target="_blank" class="card-link">
                        <div class="card-avatar">
                            <img :src="member.img" :alt="member.name" />
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">{{ member.name }}</h3>
                            <p class="card-desc">{{ member.desc }}</p>
                            <div
                                v-if="member.badge"
                                class="card-badge"
                                :class="`badge-${member.badgeType || 'default'}`"
                            >
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
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="page-btn"
                title="首页"
            >
                ⟪
            </button>

            <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="page-btn"
                title="上一页"
            >
                ⟨
            </button>

            <template v-for="page in visiblePages" :key="page">
                <button
                    v-if="page !== '...'"
                    @click="
                        currentPage =
                            typeof page === 'number' ? page : currentPage
                    "
                    :class="[
                        'page-btn',
                        'page-btn-desktop',
                        { active: currentPage === page },
                    ]"
                >
                    {{ page }}
                </button>
                <span v-else class="page-ellipsis page-ellipsis-desktop"
                    >...</span
                >
            </template>

            <!-- 移动端简化分页 -->
            <template
                v-for="page in mobileVisiblePages"
                :key="`mobile-${page}`"
            >
                <button
                    @click="
                        currentPage =
                            typeof page === 'number' ? page : currentPage
                    "
                    :class="[
                        'page-btn',
                        'page-btn-mobile',
                        { active: currentPage === page },
                    ]"
                >
                    {{ page }}
                </button>
            </template>

            <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="page-btn"
                title="下一页"
            >
                ⟩
            </button>

            <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="page-btn"
                title="末页"
            >
                ⟫
            </button>

            <!-- 页面跳转功能（当页数过多时显示） -->
            <div v-if="useSimplePagination" class="page-jump">
                <input
                    v-model="jumpToPage"
                    type="number"
                    :min="1"
                    :max="totalPages"
                    placeholder="跳转"
                    class="jump-input"
                    @keyup.enter="goToPage"
                />
                <button
                    @click="goToPage"
                    class="jump-btn"
                    :disabled="!jumpToPage"
                >
                    跳转
                </button>
            </div>

            <div class="page-info">
                第 {{ currentPage }} / {{ totalPages }} 页
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Member {
    name: string;
    desc: string;
    link: string;
    img: string;
    badge?: string;
    badgeType?: string;
}

const props = defineProps<{
    membersData: Member[];
}>();

// 响应式数据
const searchQuery = ref("");
const selectedGroup = ref("");
const currentPage = ref(1);
const pageSize = ref(20);

// 解析成员数据中的组别信息
const uniqueGroups = computed(() => {
    return ["管理组", "策划组", "美术组", "音乐组", "剪辑组", "文案组"];
});

// 计算属性：过滤后的成员
const filteredMembers = computed(() => {
    let filtered = props.membersData;

    // 按搜索关键词过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (member) =>
                member.name.toLowerCase().includes(query) ||
                member.desc.toLowerCase().includes(query),
        );
    }

    // 按组别过滤
    if (selectedGroup.value) {
        filtered = filtered.filter((member) =>
            member.desc.includes(selectedGroup.value),
        );
    }

    return filtered;
});

// 计算属性：当前页的成员
const paginatedMembers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredMembers.value.slice(start, end);
});

// 计算属性：总页数
const totalPages = computed(() => {
    return Math.ceil(filteredMembers.value.length / pageSize.value);
});

// 计算属性：是否使用简化分页模式
const useSimplePagination = computed(() => totalPages.value > 10);

// 计算属性：可见的页码
const visiblePages = computed(() => {
    const current = currentPage.value;
    const total = totalPages.value;

    // 当页数超过10时，使用简化分页模式
    if (useSimplePagination.value) {
        // 简化模式：只显示 首页、当前页、末页（去重）
        const pages: (number | string)[] = [];

        // 始终包含首页
        pages.push(1);

        // 如果当前页不是首页也不是末页，则添加当前页
        if (
            current !== 1 &&
            current !== total &&
            current > 1 &&
            current < total
        ) {
            if (current > 2) pages.push("...");
            pages.push(current);
            if (current < total - 1) pages.push("...");
        } else if (current > 2 && current < total - 1) {
            pages.push("...");
            pages.push(current);
            pages.push("...");
        }

        // 始终包含末页（如果不是首页）
        if (total > 1) {
            pages.push(total);
        }

        // 去除重复项
        return pages.filter((page, index, arr) => arr.indexOf(page) === index);
    }

    // 正常模式：减少显示的页码数量（从±2改为±1）
    const delta = 1; // 当前页前后显示的页数

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    // 调整范围以保持最多显示 3 个页码
    if (end - start < 2 && total > 3) {
        if (start === 1) {
            end = Math.min(total, start + 2);
        } else if (end === total) {
            start = Math.max(1, end - 2);
        }
    }

    const pages: (number | string)[] = [];

    // 添加页码
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // 添加省略号和边界页码
    if (start > 1) {
        if (start > 2) {
            pages.unshift("...");
        }
        pages.unshift(1);
    }

    if (end < total) {
        if (end < total - 1) {
            pages.push("...");
        }
        pages.push(total);
    }

    return pages;
});

// 计算属性：移动端简化的页码
const mobileVisiblePages = computed(() => {
    const current = currentPage.value;
    const total = totalPages.value;

    // 移动端只显示当前页和相邻页
    const pages: (number | string)[] = [];

    // 只显示当前页前后各1页，最多3个页码
    const start = Math.max(1, current - 1);
    const end = Math.min(total, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});

// 监听筛选条件变化，重置到第一页
watch([searchQuery, selectedGroup, pageSize], () => {
    currentPage.value = 1;
});

// 监听总页数变化，确保当前页不超过范围
watch(totalPages, (newTotal) => {
    if (currentPage.value > newTotal && newTotal > 0) {
        currentPage.value = newTotal;
    }
});

// 页面跳转功能
const jumpToPage = ref("");

const goToPage = () => {
    const pageNum = parseInt(jumpToPage.value);
    if (pageNum >= 1 && pageNum <= totalPages.value) {
        currentPage.value = pageNum;
        jumpToPage.value = "";
    }
};

// 暴露给父组件的方法
defineExpose({
    resetPagination: () => {
        currentPage.value = 1;
        searchQuery.value = "";
        selectedGroup.value = "";
        jumpToPage.value = "";
    },
});
</script>

<style scoped>
.members-pagination {
    max-width: 100%;
    margin: 2rem auto;
    padding: 1.5rem;
    background: linear-gradient(
        135deg,
        var(--vp-c-bg) 0%,
        var(--vp-c-bg-soft) 100%
    );
    border-radius: 20px;
    border: 1px solid var(--vp-c-divider-light);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.members-pagination::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
        90deg,
        transparent,
        var(--vp-c-brand-1),
        transparent
    );
    opacity: 0.6;
}

.search-box {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
}

.search-input-wrapper {
    position: relative;
    width: 100%;
    max-width: 400px;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    width: 20px;
    height: 20px;
    color: var(--vp-c-text-2);
    z-index: 1;
    transition: color 0.2s ease;
}

.search-input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.75rem;
    border: 2px solid var(--vp-c-border);
    border-radius: 20px;
    font-size: 0.9rem;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
    outline: none;
    border-color: var(--vp-c-brand-1);
    box-shadow:
        0 0 0 4px var(--vp-c-brand-soft),
        0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.search-input:focus + .search-icon,
.search-input-wrapper:hover .search-icon {
    color: var(--vp-c-brand-1);
}

.clear-search {
    position: absolute;
    right: 0.75rem;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--vp-c-text-2);
    transition: all 0.2s ease;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-search:hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    transform: scale(1.1);
}

.clear-search svg {
    width: 16px;
    height: 16px;
}

.filter-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    padding: 1rem;
    background: linear-gradient(
        135deg,
        var(--vp-c-bg-soft) 0%,
        var(--vp-c-bg-alt) 100%
    );
    border-radius: 12px;
    border: 1px solid var(--vp-c-divider);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    position: relative;
    backdrop-filter: blur(5px);
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 12px;
    transition: all 0.2s ease;
}

.filter-item:hover {
    background: var(--vp-c-bg);
    transform: translateY(-1px);
}

.filter-box label {
    font-size: 0.9rem;
    color: var(--vp-c-text-1);
    font-weight: 600;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.group-filter,
.page-size-selector {
    padding: 0.6rem 1rem;
    border: 2px solid var(--vp-c-border);
    border-radius: 12px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-size: 0.9rem;
    min-width: 120px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-weight: 500;
}

.group-filter:hover,
.page-size-selector:hover {
    border-color: var(--vp-c-brand-1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.group-filter:focus,
.page-size-selector:focus {
    outline: none;
    border-color: var(--vp-c-brand-1);
    box-shadow:
        0 0 0 4px var(--vp-c-brand-soft),
        0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.stats {
    margin-bottom: 1.5rem;
    text-align: center;
}

.stats-content {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(
        135deg,
        var(--vp-c-brand-soft) 0%,
        var(--vp-c-tip-soft) 100%
    );
    border-radius: 16px;
    border: 1px solid var(--vp-c-brand-1);
    box-shadow: 0 4px 16px var(--vp-c-brand-soft);
    font-size: 0.9rem;
    color: var(--vp-c-text-1);
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.stats-content:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px var(--vp-c-brand-soft);
}

.stats-icon {
    width: 18px;
    height: 18px;
    color: var(--vp-c-brand-1);
    flex-shrink: 0;
}

.stats-text {
    color: var(--vp-c-text-1);
}

.stats-text strong {
    color: var(--vp-c-brand-1);
    font-weight: 700;
    font-size: 1.1em;
}

.stats-filter {
    color: var(--vp-c-text-2);
    font-size: 0.85em;
    opacity: 0.8;
}

.nav-card {
    margin-bottom: 3rem;
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInFromLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInFromRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.search-box {
    animation: slideInFromLeft 0.5s ease-out;
}

.filter-box {
    animation: slideInFromRight 0.5s ease-out 0.1s both;
}

.stats {
    animation: fadeInUp 0.5s ease-out 0.2s both;
}

.pagination {
    animation: fadeInUp 0.5s ease-out 0.3s both;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.card-item {
    border: 1px solid var(--vp-c-border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background: linear-gradient(
        135deg,
        var(--vp-c-bg) 0%,
        var(--vp-c-bg-soft) 100%
    );
    min-height: 100px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(5px);
    position: relative;
}

.card-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent,
        var(--vp-c-brand-1),
        transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card-item:hover {
    border-color: var(--vp-c-brand-1);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 2px 8px var(--vp-c-brand-soft);
    transform: translateY(-4px) scale(1.02);
}

.card-item:hover::before {
    opacity: 0.6;
}

.card-link {
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    gap: 0.75rem;
    height: 100%;
    transition: all 0.2s ease;
}

.card-avatar {
    flex-shrink: 0;
    margin-top: 0.125rem;
    position: relative;
}

.card-avatar::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(
        135deg,
        var(--vp-c-brand-1),
        var(--vp-c-brand-2)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
}

.card-item:hover .card-avatar::before {
    opacity: 0.3;
}

.card-avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--vp-c-bg);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.card-item:hover .card-avatar img {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
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
    font-weight: 700;
    margin: 0 0 0.4rem 0;
    color: var(--vp-c-text-1);
    line-height: 1.3;
    word-break: break-word;
    transition: color 0.2s ease;
}

.card-item:hover .card-title {
    color: var(--vp-c-brand-1);
}

.card-desc {
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
    flex: 1;
    word-break: break-word;
    transition: color 0.2s ease;
}

.card-item:hover .card-desc {
    color: var(--vp-c-text-1);
}

.card-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    margin-top: auto;
    align-self: flex-start;
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
    border: 1px solid var(--vp-c-brand-1);
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.card-item:hover .card-badge {
    background: var(--vp-c-brand-1);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--vp-c-brand-soft);
}

.badge-tip {
    background: var(--vp-c-tip-soft);
    color: var(--vp-c-tip-1);
    border-color: var(--vp-c-tip-1);
}

.card-item:hover .badge-tip {
    background: var(--vp-c-tip-1);
    color: white;
}

.badge-warning {
    background: var(--vp-c-warning-soft);
    color: var(--vp-c-warning-1);
    border-color: var(--vp-c-warning-1);
}

.card-item:hover .badge-warning {
    background: var(--vp-c-warning-1);
    color: white;
}

.badge-danger {
    background: var(--vp-c-danger-soft);
    color: var(--vp-c-danger-1);
    border-color: var(--vp-c-danger-1);
}

.card-item:hover .badge-danger {
    background: var(--vp-c-danger-1);
    color: white;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin: 3rem 0 2rem 0;
    flex-wrap: wrap;
    padding: 1.5rem;
    background: linear-gradient(
        135deg,
        var(--vp-c-bg-soft) 0%,
        var(--vp-c-bg-alt) 100%
    );
    border-radius: 16px;
    border: 1px solid var(--vp-c-divider);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(5px);
}

.pagination-top {
    margin: 2rem 0 2rem 0;
    padding: 1.25rem;
    background: linear-gradient(
        135deg,
        var(--vp-c-bg-alt) 0%,
        var(--vp-c-bg-soft) 100%
    );
    border: 1px solid var(--vp-c-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-btn {
    padding: 0.6rem 1rem;
    border: 2px solid var(--vp-c-border);
    border-radius: 12px;
    background: linear-gradient(
        135deg,
        var(--vp-c-bg) 0%,
        var(--vp-c-bg-soft) 100%
    );
    color: var(--vp-c-text-1);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    font-size: 0.9rem;
    min-width: 44px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
}

.page-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transition: left 0.5s ease;
}

.page-btn:hover::before {
    left: 100%;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--vp-c-brand-1);
    background: linear-gradient(
        135deg,
        var(--vp-c-brand-soft) 0%,
        var(--vp-c-brand-1) 100%
    );
    color: white;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px var(--vp-c-brand-soft);
}

.page-btn.active {
    background: linear-gradient(
        135deg,
        var(--vp-c-brand-1) 0%,
        var(--vp-c-brand-2) 100%
    );
    color: white;
    border-color: var(--vp-c-brand-1);
    box-shadow:
        0 4px 16px var(--vp-c-brand-soft),
        0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px) scale(1.02);
}

.page-btn.active::before {
    display: none;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.page-btn:disabled:hover {
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    background: linear-gradient(
        135deg,
        var(--vp-c-bg) 0%,
        var(--vp-c-bg-soft) 100%
    );
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-border);
}

.page-ellipsis {
    padding: 0.6rem 0.5rem;
    color: var(--vp-c-text-2);
    font-weight: 600;
    font-size: 0.9rem;
    opacity: 0.7;
}

.page-info {
    margin-left: 1.5rem;
    font-size: 0.85rem;
    color: var(--vp-c-text-1);
    font-weight: 600;
    padding: 0.6rem 1rem;
    background: linear-gradient(
        135deg,
        var(--vp-c-brand-soft) 0%,
        var(--vp-c-tip-soft) 100%
    );
    border-radius: 12px;
    border: 1px solid var(--vp-c-brand-1);
    box-shadow: 0 2px 8px var(--vp-c-brand-soft);
    backdrop-filter: blur(5px);
    transition: all 0.2s ease;
}

.page-info:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--vp-c-brand-soft);
}

/* 页面跳转功能样式 */
.page-jump {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
    padding: 0.5rem;
    background: var(--vp-c-bg);
    border-radius: 8px;
    border: 1px solid var(--vp-c-border);
}

.jump-input {
    width: 60px;
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 6px;
    font-size: 0.8rem;
    text-align: center;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    transition: all 0.2s ease;
}

.jump-input:focus {
    outline: none;
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.jump-btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--vp-c-brand-1);
    border-radius: 6px;
    background: var(--vp-c-brand-1);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.jump-btn:hover:not(:disabled) {
    background: var(--vp-c-brand-2);
    transform: translateY(-1px);
}

.jump-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 默认显示桌面版分页，隐藏移动版 */
.page-btn-mobile {
    display: none;
}

.page-btn-desktop,
.page-ellipsis-desktop {
    display: inline-block;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .card-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        max-width: 100%;
    }

    .card-item {
        min-height: 80px;
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
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .page-jump {
        margin-left: 0;
        margin-top: 0.5rem;
        width: 100%;
        justify-content: center;
    }

    .pagination-top {
        margin: 1rem 0 1.5rem 0;
        padding: 0.75rem;
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
        padding: 1rem;
        margin: 1rem auto;
        border-radius: 16px;
    }

    .card-grid {
        max-width: 100%;
    }

    .search-input-wrapper {
        max-width: 100%;
    }

    .search-input {
        padding: 0.6rem 1rem 0.6rem 2.5rem;
        font-size: 0.9rem;
        border-radius: 20px;
    }

    .search-icon {
        left: 0.75rem;
        width: 18px;
        height: 18px;
    }

    .clear-search {
        right: 0.5rem;
        width: 20px;
        height: 20px;
    }

    .clear-search svg {
        width: 14px;
        height: 14px;
    }

    .search-box {
        margin-bottom: 1rem;
    }

    .search-input {
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        font-size: 0.85rem;
        border-radius: 18px;
    }

    .filter-box {
        gap: 0.75rem;
        padding: 0.75rem;
        flex-direction: column;
        align-items: stretch;
        border-radius: 10px;
        margin-bottom: 1rem;
    }

    .filter-item {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 8px;
        background: var(--vp-c-bg);
    }

    .filter-box label {
        font-size: 0.85rem;
        text-align: left;
        font-weight: 600;
    }

    .group-filter,
    .page-size-selector {
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
        border-radius: 8px;
    }

    .stats {
        margin-bottom: 1rem;
    }

    .stats-content {
        padding: 0.6rem 1.25rem;
        font-size: 0.8rem;
        gap: 0.4rem;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 12px;
    }

    .stats-icon {
        width: 16px;
        height: 16px;
    }

    .card-grid {
        grid-template-columns: 1fr;
    }

    .card-link {
        padding: 0.75rem;
        gap: 0.75rem;
    }

    .card-avatar img {
        width: 48px;
        height: 48px;
    }

    .card-title {
        font-size: 1rem;
        margin-bottom: 0.4rem;
    }

    .card-desc {
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
    }

    .card-badge {
        font-size: 0.7rem;
        padding: 0.25rem 0.5rem;
        border-radius: 8px;
    }

    .pagination {
        gap: 0.5rem;
        padding: 1rem;
        margin: 2rem 0 1rem 0;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 12px;
    }

    .pagination-top {
        margin: 1rem 0 1.5rem 0;
        padding: 1rem;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        border-radius: 12px;
    }

    /* 隐藏桌面版分页，显示移动版 */
    .page-btn-desktop,
    .page-ellipsis-desktop {
        display: none;
    }

    .page-btn-mobile {
        display: inline-block;
    }

    .page-btn {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
        min-width: 32px;
        flex-shrink: 0;
        border-radius: 8px;
    }

    .page-info {
        width: 100%;
        margin: 0.75rem 0 0 0;
        font-size: 0.75rem;
        padding: 0.5rem 1rem;
        text-align: center;
        order: 10;
        border-radius: 8px;
    }

    /* 移动端跳转功能 */
    .page-jump {
        width: 100%;
        margin: 0.5rem 0;
        justify-content: center;
        order: 5;
    }

    .jump-input {
        width: 80px;
    }
}
</style>
