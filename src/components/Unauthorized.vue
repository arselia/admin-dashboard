<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const goToLogin = () => {
  router.push('/')
}
</script>

<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <div class="icon-container">
        <div class="lock-icon">🔒</div>
        <div class="error-code">401</div>
      </div>
      
      <div class="content-unauthorized">
        <h1 class="title">Access Denied</h1>
        <p class="subtitle">You don't have permission to view this page</p>
        <p class="description">
          Please check your credentials or contact your administrator for access.
        </p>
      </div>
      
      <div class="button-group">
        <button @click="goToLogin" class="btn btn-secondary">
          <span class="btn-icon">🔑</span>
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.unauthorized-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unauthorized-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.unauthorized-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.content-unauthorized {
    margin-top: 20px;
    margin-bottom: 30px;
}

@keyframes shimmer {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
}

.icon-container {
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  display: block;
  animation: shake 2s ease-in-out infinite;
}

.error-code {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}


.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.subtitle {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.description {
  color: #a0aec0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  min-width: 100px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #4fd1c7, #06b6d4);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .unauthorized-container {
    padding: 1rem;
  }
  
  .unauthorized-card {
    padding: 1.5rem 1.25rem;
    max-width: 350px;
  }
  
  .error-code {
    font-size: 3rem;
  }
  
  .title {
    font-size: 1.6rem;
  }
  
  .subtitle {
    font-size: 0.95rem;
  }
  
  .description {
    font-size: 0.85rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
    max-width: 180px;
  }
}

@media (max-width: 480px) {
  .unauthorized-card {
    max-width: 320px;
    padding: 1.25rem 1rem;
  }
  
  .lock-icon {
    font-size: 2.5rem;
  }
  
  .error-code {
    font-size: 2.5rem;
  }
  
  .title {
    font-size: 1.4rem;
  }
}

/* Loading states untuk tombol */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Hover effect untuk container */
.unauthorized-card:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 25px 45px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}
</style>