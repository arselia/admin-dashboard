<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const userProfile = ref(null);
const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  totalUsers: 0
});

const fetchUserProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    userProfile.value = response.data;
    console.log('User profile fetched:', userProfile.value);
  } catch (err) {
    console.error('Failed to fetch user profile:', err.response?.data || err.message);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    userProfile.value = null;
    alert('Your session has ended. Please sign in again.');
    router.push('/');
  }
};

const fetchStats = async () => {
  try {
    const productsRes = await axios.get('https://api.escuelajs.co/api/v1/products');
    stats.value.totalProducts = productsRes.data.length;
    
    const categoriesRes = await axios.get('https://api.escuelajs.co/api/v1/categories');
    stats.value.totalCategories = categoriesRes.data.length;
    
    const usersRes = await axios.get('https://api.escuelajs.co/api/v1/users');
    stats.value.totalUsers = usersRes.data.length;
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    stats.value = { totalProducts: 150, totalCategories: 8, totalUsers: 25 };
  }
};

const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  router.push('/');
  alert('Logout successful.');
};

onMounted(() => {
  fetchUserProfile();
  fetchStats();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Dashboard</h1>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/products" class="action-card">
            <div class="action-icon">📦</div>
            <h3>Manage Products</h3>
            <p>View, add, or edit products</p>
          </router-link>
          
          <router-link to="/product/create" class="action-card">
            <div class="action-icon">➕</div>
            <h3>Add Product</h3>
            <p>Create a new product</p>
          </router-link>
          
          <div class="action-card logout-card" @click="handleLogout">
            <div class="action-icon">🚪</div>
            <h3>Logout</h3>
            <p>Sign out of your account</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 1rem;
}

.dashboard-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  color: #718096;
  text-align: left;
}

.loading-skeleton {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  animation: pulse 2s infinite;
}

.skeleton-text {
  width: 80px;
  height: 20px;
  background: #e2e8f0;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.products { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-icon.categories { background: linear-gradient(135deg, #f093fb, #f5576c); }
.stat-icon.users { background: linear-gradient(135deg, #4facfe, #00f2fe); }

.stat-info h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  text-align: left;
}

.stat-info p {
  color: #718096;
  margin: 0;
  font-size: 0.9rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.action-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.logout-card .action-icon {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
}

.action-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.action-card p {
  color: #718096;
  font-size: 0.85rem;
  margin: 0;
}

.recent-activity {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.activity-icon {
  font-size: 1.2rem;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  color: #2d3748;
}

.activity-time {
  font-size: 0.8rem;
  color: #718096;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 0.75rem;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .dashboard-title {
    font-size: 1.6rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
}
</style>