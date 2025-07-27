<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/');
    alert('Logout successful.');
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-card">
      <div class="welcome-section">
        <div class="welcome-icon">👋</div>
        <h1 class="welcome-title">Welcome to Dashboard</h1>
        <p class="welcome-subtitle">Manage your products efficiently</p>
      </div>
      
      <div class="actions-section">
        <h2 class="section-title">What would you like to do?</h2>
        <div class="actions-grid">
          <router-link to="/products" class="action-card">
            <div class="action-icon products">📦</div>
            <h3>View Products</h3>
            <p>Browse all available products</p>
          </router-link>
          
          <router-link to="/product/create" class="action-card">
            <div class="action-icon create">➕</div>
            <h3>Add New Product</h3>
            <p>Create a new product entry</p>
          </router-link>
          
          <div class="action-card" @click="handleLogout">
            <div class="action-icon logout">🚪</div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.dashboard-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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

.welcome-section {
  margin-bottom: 2.5rem;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.2rem;
}

.action-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  border-color: #667eea;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
  background: white;
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
}

.action-icon.products {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.action-icon.create {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.action-icon.logout {
  background: linear-gradient(135deg, #fc8181, #f56565);
}

.action-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.action-card p {
  color: #718096;
  font-size: 0.85rem;
  margin: 0;
  text-align: center;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-card {
    padding: 2rem 1.5rem;
    max-width: 500px;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .welcome-icon {
    font-size: 3.5rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 0.75rem;
  }
  
  .dashboard-card {
    padding: 1.5rem 1.25rem;
  }
  
  .welcome-title {
    font-size: 1.6rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
}
</style>