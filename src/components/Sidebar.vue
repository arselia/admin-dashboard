<template>
  <aside :class="['sidebar', { 'collapsed': isCollapsed }]">
    <div class="sidebar-header">
      <h3 v-if="!isCollapsed">Admin Dashboard</h3>
      <span v-else>⚙️</span>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/dashboard" class="nav-item">
            📊 <span v-if="!isCollapsed">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/products" class="nav-item">
            📦 <span v-if="!isCollapsed">Products</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, watch } from 'vue'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

watch(() => props.isCollapsed, (newValue) => {
  console.log('Sidebar received isCollapsed prop:', newValue)
}, { immediate: true })
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #ffffff;
  color: #374151;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  overflow-x: hidden;
  border-right: 1px solid #e5e7eb;
}

.sidebar.collapsed {
  width: 70px;
  padding: 24px 12px;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.sidebar-header span {
  font-size: 1.8rem;
  color: #6b7280;
  display: block;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 8px;
}

.nav-item:hover {
  background-color: #f9fafb;
  color: #374151;
  transform: translateX(2px);
}

.nav-item.router-link-active {
  background-color: #3b82f6;
  color: #ffffff;
}

.nav-item.router-link-active:hover {
  background-color: #2563eb;
  transform: translateX(0);
}

.nav-item span {
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 60px;
  }
}

.sidebar {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
