<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

// Menggunakan emits untuk memberi tahu komponen induk (App.vue) bahwa login berhasil
const emit = defineEmits(['loginSuccess']);

const handleLogin = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  
  try {
    // 1. Request login
    const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
      email: email.value,
      password: password.value,
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    // 2. Simpan token ke localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    // 3. Ambil data profil pengguna (terautentikasi)
    const profileResponse = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = profileResponse.data;

    // 4. Simpan data user dan role ke localStorage
    localStorage.setItem('user_profile', JSON.stringify(user));
    localStorage.setItem('user_role', user.role); // bisa: 'customer' / 'admin'

    // 5. Cek role sebelum redirect
    if (user.role === 'admin') {
      success.value = 'Login berhasil!';
      emit('loginSuccess');
      router.push('/dashboard');
    } else {
        error.value = 'Access denied. Admin only.';
      // Hapus token dan user info jika bukan admin
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_role');
    }

  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    error.value = 'Login gagal. Email atau password salah.';
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🔐</div>
        <h2 class="login-title">Welcome Back</h2>
        <p class="login-subtitle">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">
            <span class="label-icon">📧</span>
            Email Address
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="form-input" 
            placeholder="Enter your email"
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon">🔒</span>
            Password
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="form-input" 
            placeholder="Enter your password"
            required 
          />
        </div>
        
        <button type="submit" :disabled="loading" class="login-button">
          <span v-if="loading" class="loading-spinner">⏳</span>
          <span v-else class="button-icon"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <!-- Alert Messages -->
      <div v-if="error" class="alert alert-error">
        <span class="alert-icon">❌</span>
        {{ error }}
      </div>
      
      <div v-if="success" class="alert alert-success">
        <span class="alert-icon">✅</span>
        {{ success }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  max-width: 450px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
}

.login-header {
  margin-bottom: 2.5rem;
}

.logo-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  text-align: left;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.form-input:hover {
  border-color: #d1d5db;
}

.form-input::placeholder {
  color: #9ca3af;
}

.login-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover:not(:disabled)::before {
  left: 100%;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-icon,
.loading-spinner {
  font-size: 1.2rem;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.alert {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-error {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #dc2626;
  border: 1px solid #fecaca;
}

.alert-success {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.alert-icon {
  font-size: 1.2rem;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.footer-text {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.footer-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    max-width: 100%;
    margin: 0 auto;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
  }
  
  .login-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

/* Loading animation */
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

.login-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>