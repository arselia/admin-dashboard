<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router'
const router = useRouter()

const allProducts = ref([]) // Ini akan menyimpan semua produk dari API
const offset = ref(0)
const limit = 5 // sesuai requirement: 5 products per page
const totalProducts = ref(0) // Ini akan jadi total produk setelah difilter
const isLoading = ref(false)

// filter states
const title = ref('')
const minPrice = ref('')
const maxPrice = ref('')
const categoryId = ref('')
const categories = ref([])

// Computed property untuk filtering data
const filteredProducts = computed(() => {
  let tempProducts = allProducts.value;

  // Filter berdasarkan judul
  if (title.value.trim()) {
    const searchTerm = title.value.trim().toLowerCase();
    tempProducts = tempProducts.filter(p => p.title.toLowerCase().includes(searchTerm));
  }

  // Filter berdasarkan harga minimum
  if (minPrice.value && !isNaN(minPrice.value)) {
    tempProducts = tempProducts.filter(p => p.price >= parseFloat(minPrice.value));
  }

  // Filter berdasarkan harga maksimum
  if (maxPrice.value && !isNaN(maxPrice.value)) {
    tempProducts = tempProducts.filter(p => p.price <= parseFloat(maxPrice.value));
  }

  // Filter berdasarkan kategori
  if (categoryId.value) {
    tempProducts = tempProducts.filter(p => p.category?.id == categoryId.value);
  }

  // Perbarui totalProducts berdasarkan hasil filter
  totalProducts.value = tempProducts.length;

  // Reset offset jika halaman saat ini tidak lagi valid setelah filter
  // Atau jika produk yang difilter lebih sedikit dari offset saat ini
  if (offset.value >= totalProducts.value && totalProducts.value > 0) {
    offset.value = Math.max(0, Math.floor((totalProducts.value - 1) / limit) * limit);
  } else if (totalProducts.value === 0) {
    offset.value = 0;
  }

  return tempProducts;
});

// Computed property untuk pagination data
const paginatedProducts = computed(() => {
  const start = offset.value;
  const end = start + limit;
  return filteredProducts.value.slice(start, end);
});

// Computed properties untuk pagination logic (menggunakan totalProducts dari hasil filter)
const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const totalPages = computed(() => Math.ceil(totalProducts.value / limit))
const isFirstPage = computed(() => offset.value === 0)
const isLastPage = computed(() => currentPage.value >= totalPages.value)
const hasOnlyOnePage = computed(() => totalPages.value <= 1 && totalProducts.value > 0)

const editProduct = (productId) => {
  router.push(`/product/edit/${productId}`)
}

const confirmDelete = async (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`)
      alert('Product deleted successfully.')
      // Setelah delete, panggil ulang fetchAllProducts untuk memperbarui data
      await fetchAllProducts()
      // Tidak perlu applyFilters lagi, karena fetchAllProducts akan memicu perubahan
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product.')
    }
  }
}

// Fungsi untuk mengambil SEMUA produk dari API (hanya sekali)
const fetchAllProducts = async () => {
  if (isLoading.value) return

  isLoading.value = true

  try {
    // Panggil API tanpa limit dan offset untuk mendapatkan semua data
    const response = await axios.get(`https://api.escuelajs.co/api/v1/products`)
    allProducts.value = response.data
    // totalProducts akan otomatis diperbarui oleh filteredProducts computed property
    console.log(`Successfully fetched ${allProducts.value.length} total products for client-side processing.`);
  } catch (error) {
    console.error('Error fetching all products:', error)
    allProducts.value = []
    totalProducts.value = 0
  } finally {
    isLoading.value = false
  }
}

// fetch category list
const fetchCategories = async () => {
  try {
    const response = await axios.get('https://api.escuelajs.co/api/v1/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Apply filters - cukup mengubah offset jika diperlukan, filteredProducts akan otomatis re-evaluate
const applyFilters = () => {
  // Ketika filter diubah, kita reset offset ke 0 untuk menampilkan halaman pertama hasil filter
  offset.value = 0;
  // Karena `filteredProducts` adalah computed property, perubahan pada `title`, `minPrice`, dll.
  // akan secara otomatis memicu re-evaluasi `filteredProducts` dan `paginatedProducts`.
  // Jadi tidak perlu memanggil fetchProducts() lagi di sini.
}


// pagination methods (menggeser offset)
const nextPage = () => {
  if (!isLastPage.value && !isLoading.value) {
    offset.value += limit
  }
}

const prevPage = () => {
  if (!isFirstPage.value && !isLoading.value) {
    offset.value -= limit
  }
}

const goToPage = (page) => {
  if (isLoading.value) return

  const newOffset = (page - 1) * limit
  // Pastikan newOffset tidak melebihi batas maksimum
  if (newOffset >= 0 && newOffset < totalProducts.value) {
    offset.value = newOffset
  } else if (totalProducts.value === 0 && page === 1) { // Case for empty results, go to page 1
    offset.value = 0;
  }
}

// clear all filters
const clearFilters = () => {
  title.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  categoryId.value = ''
  applyFilters() // applyFilters akan mereset offset ke 0
}

onMounted(async () => {
  await fetchCategories()
  await fetchAllProducts() // Panggil ini untuk mengambil semua data di awal
})

</script>

<template>
  <div class="admin-container">
    <div class="header">
      <div class="header-content">
        <h1 class="page-title">Products</h1>
        <router-link to="/product/create">
          <button class="add-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Product
          </button>
        </router-link>
      </div>
    </div>

    <div class="filters-card">
      <div class="filters-grid">
        <input
          v-model="title"
          placeholder="Search products..."
          :disabled="isLoading"
          @keyup.enter="applyFilters"
          class="search-input"
        />
        <div class="price-inputs">
          <input
            v-model="minPrice"
            placeholder="Min price"
            type="number"
            min="0"
            step="0.01"
            :disabled="isLoading"
            @keyup.enter="applyFilters"
          />
          <input
            v-model="maxPrice"
            placeholder="Max price"
            type="number"
            min="0"
            step="0.01"
            :disabled="isLoading"
            @keyup.enter="applyFilters"
          />
        </div>
        <select v-model="categoryId" :disabled="isLoading">
          <option value="">All Categories</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
        <div class="filter-actions">
          <button
            @click="applyFilters"
            :disabled="isLoading"
            class="apply-btn"
          >
            {{ isLoading ? 'Loading...' : 'Apply' }}
          </button>
          <button
            @click="clearFilters"
            :disabled="isLoading"
            class="clear-btn"
          >
            Clear
          </button>
        </div>
      </div>

      <div v-if="title || minPrice || maxPrice || categoryId" class="active-filters">
        <span class="filters-label">Active filters:</span>
        <div class="filter-tags">
          <span v-if="title" class="filter-tag">{{ title }}</span>
          <span v-if="minPrice" class="filter-tag">${{ minPrice }}+</span>
          <span v-if="maxPrice" class="filter-tag">${{ maxPrice }}-</span>
          <span v-if="categoryId" class="filter-tag">
            {{ categories.find(c => c.id == categoryId)?.name }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="!isLoading" class="results-header">
      <div class="results-info">
        <span class="results-count">{{ paginatedProducts.length }} products on this page</span>
        <span v-if="totalProducts > 0" class="total-estimate">({{ totalProducts }} total)</span>
      </div>

      <div v-if="!hasOnlyOnePage && paginatedProducts.length > 0" class="pagination">
        <button
          @click="prevPage"
          :disabled="isFirstPage || isLoading"
          class="pagination-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>

        <button
          @click="nextPage"
          :disabled="isLastPage || isLoading || paginatedProducts.length < limit"
          class="pagination-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>

    <div v-else-if="paginatedProducts.length > 0" class="products-list">
      <div v-for="product in paginatedProducts" :key="product.id" class="product-row">
        <div class="product-image">
          <img
            :src="product.images && product.images[0] ? product.images[0] : '/api/placeholder/120/120'"
            :alt="product.title"
            @error="$event.target.src = '/api/placeholder/120/120'"
          />
        </div>

        <div class="product-content">
          <h3 class="product-title">{{ product.title }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-meta">
            <span class="product-price">${{ product.price }}</span>
            <span class="product-category">{{ product.category?.name || 'Unknown' }}</span>
          </div>
        </div>

        <div class="product-actions">
          <button @click="editProduct(product.id)" class="edit-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
              Edit
          </button>
          <button @click="confirmDelete(product.id)" class="delete-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading && paginatedProducts.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <h3>No products found</h3>
      <p>Try adjusting your search criteria or clear all filters.</p>
      <button @click="clearFilters" class="clear-filters-btn">Clear All Filters</button>
    </div>

    <div v-if="paginatedProducts.length > 0 && !isLoading" class="bottom-pagination">
      <div class="pagination-extended">
        <button
          @click="prevPage"
          :disabled="isFirstPage || isLoading"
          class="pagination-btn"
        >
          Previous
        </button>

        <div class="page-info-extended">
          Page {{ currentPage }} of {{ totalPages }}
        </div>

        <button
          @click="nextPage"
          :disabled="isLastPage || isLoading || paginatedProducts.length < limit"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // Method ini sudah tidak relevan karena kita menggunakan computed properties
  // dan pagination ditangani di sisi klien.
  methods: {
    getVisiblePages() {
      // Logic ini sudah tidak digunakan.
      // Anda bisa menghapus method ini atau membiarkannya kosong.
      return [];
    }
  }
}
</script>

<style scoped>
/* Header */
.header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

/* Filters */
.filters-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;

}

.search-input {
  grid-column: 1;
}

.price-inputs {
  display: flex;
  gap: 8px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.apply-btn {
  background: #059669;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  min-width: 80px;
}

.apply-btn:hover:not(:disabled) {
  background: #047857;
}

.clear-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.clear-btn:hover:not(:disabled) {
  background: #4b5563;
}

.active-filters {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.filters-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  background-color: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}


/* Results Header */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.results-count {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.total-estimate {
  font-size: 14px;
  color: #6b7280;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #6b7280;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

/* Products List (5 per page) */
.products-list {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.product-row {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.product-row:hover {
  background: #f9fafb;
}

.product-row:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  margin-right: 20px;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
  line-height: 1.4;
  text-align: left;
}

.product-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-price {
  font-size: 16px;
  font-weight: 700;
  color: #059669;
}

.product-category {
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
}

.product-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 20px;
}

.edit-btn {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  gap: 7px;
}

.edit-btn:hover {
  background: #fde68a;
  border-color: #facc15;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;  
  gap: 7px;
}

.delete-btn:hover {
  background: #fecaca;
  border-color: #f87171;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 20px 0;
  text-align: center;
}

.clear-filters-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.clear-filters-btn:hover {
  background: #2563eb;
}

/* Bottom Pagination */
.bottom-pagination {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.pagination-extended {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-info-extended {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .filter-actions {
    justify-content: stretch;
  }

  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .product-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    text-align: left;
  }

  .product-image {
    width: 120px;
    height: 120px;
    margin-right: 0;
  }

  .product-content {
    width: 100%;
  }

  .product-actions {
    width: 100%;
    margin-left: 0;
    justify-content: stretch;
  }

  .product-actions button {
    flex: 1;
  }
}
</style>