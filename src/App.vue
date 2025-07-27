<script setup>
import { ref } from 'vue'; // Import ref untuk state reaktif
import Sidebar from './components/Sidebar.vue'; // Import komponen Sidebar

// State untuk mengontrol apakah sidebar dalam kondisi collapsed atau tidak
const isSidebarCollapsed = ref(false);

// Fungsi untuk mengubah status collapsed sidebar
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  console.log('Sidebar is now collapsed:', isSidebarCollapsed.value); // Debugging: cek status toggle
};
</script>

<template>
  <div id="app-layout">
    <!-- Tombol untuk toggle sidebar -->
    <button @click="toggleSidebar" :class="['sidebar-toggle-button', { 'collapsed': isSidebarCollapsed }]">
      <span v-if="isSidebarCollapsed">▶</span>
      <span v-else>◀</span>
    </button>

    <!-- Mengirim state isCollapsed ke komponen Sidebar -->
    <Sidebar :isCollapsed="isSidebarCollapsed" />

    <!-- Konten utama akan memiliki margin yang dinamis berdasarkan status sidebar -->
    <main :class="['content', { 'content-collapsed': isSidebarCollapsed }]">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Global styles untuk layout */
#app-layout {
  display: flex; /* Menggunakan Flexbox untuk menata sidebar dan konten */
  min-height: 100vh; /* Memastikan layout mengisi tinggi layar penuh */
  position: relative; /* Diperlukan untuk posisi tombol toggle */
  width: 100%; /* Pastikan app-layout mengambil lebar penuh dari #app */
}

/* Style untuk tombol toggle sidebar */
.sidebar-toggle-button {
  position: fixed; /* Membuat tombol tetap di tempatnya */
  top: 20px; /* Jarak dari atas */
  left: 310px; /* Awalnya di luar sidebar, sedikit ke kanan dari sidebar (250px + 10px) */
  z-index: 1001; /* Pastikan tombol di atas sidebar dan konten */
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%; /* Bentuk bulat */
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease; /* Animasi perpindahan tombol */
}

.sidebar-toggle-button.collapsed {
  left: 80px; /* Posisi tombol saat sidebar collapsed (lebar sidebar 60px + 10px padding) */
}

.content {
  margin-left: 250px; /* Lebar default sidebar */
  flex-grow: 1; /* Konten akan mengisi sisa ruang yang tersedia */
  padding: 20px; /* Padding untuk konten utama */
  transition: margin-left 0.3s ease; /* Animasi perpindahan konten */
}

.content-collapsed {
  margin-left: 60px; /* Lebar sidebar saat collapsed */
}

/* Optional: Atur body margin jika Anda ingin sidebar menempel di kiri atas tanpa scroll */
/* Style body ini bisa dihapus jika sudah diatur di file CSS global */
/* body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
} */
</style>
