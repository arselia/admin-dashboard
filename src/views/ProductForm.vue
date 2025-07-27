<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const productId = route.params.id
const isEdit = !!productId

const title = ref('')
const price = ref('')
const description = ref('')
const categoryId = ref('')
const imageUrl = ref('')
const categories = ref([])
const fileInput = ref(null)


const fetchCategories = async () => {
  const res = await axios.get('https://api.escuelajs.co/api/v1/categories')
  categories.value = res.data
}

const fetchProductById = async () => {
  try {
    const res = await axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`)
    const product = res.data

    title.value = product.title
    price.value = product.price
    description.value = product.description
    categoryId.value = Number(product.category.id) 
    imageUrl.value = product.images[0]
  } catch (err) {
    console.error('Unable to retrieve product data:', err)
  }
}

const submitForm = async () => {

  if (!title.value || !price.value || !description.value || (!isEdit && !categoryId.value)) {
    alert("Please fill all required fields.");
    return;
  }

  if (!isEdit && !imageUrl.value) {
    alert("Please upload a product image.");
    return;
  }

  let confirmationMessage = isEdit
    ? 'Are you sure to update this product?'
    : 'Are you sure to create this product?'

  if (!confirm(confirmationMessage)) {
    // Jika pengguna menekan 'Cancel', hentikan proses submit
    return
  }

  // Struktur data yang konsisten untuk create dan update
  const productData = {
    title: title.value,
    price: Number(price.value),
    description: description.value,
    images: [imageUrl.value],
  }

  try {
    if (isEdit) {
      // Ambil data produk yang sudah ada untuk memastikan payload PUT lengkap
      const existingProductRes = await axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`);
      const existingProduct = existingProductRes.data;

      const updatePayload = {
        title: productData.title,
        price: productData.price,
        description: productData.description,
        // TETAP KIRIM categoryId LAMA, karena kita tidak bisa mengeditnya.
        // Ini untuk API yang memerlukan payload PUT lengkap.
        categoryId: existingProduct.category ? Number(existingProduct.category.id) : null,
        images: productData.images.filter(Boolean).length > 0
                  ? productData.images
                  : (existingProduct.images && existingProduct.images.length > 0
                      ? existingProduct.images
                      : ["https://api.escuelajs.co/api/v1/files/default-placeholder.jpg"])
      };

      await axios.put(`https://api.escuelajs.co/api/v1/products/${productId}`, updatePayload);
      alert('Product updated successfully!');
    } else {
      // Untuk membuat produk baru, kirim productData yang sudah termasuk categoryId baru
      productData.categoryId = Number(categoryId.value); // Pastikan categoryId ditambahkan untuk CREATE
      await axios.post('https://api.escuelajs.co/api/v1/products', productData);
      alert('Product created successfully!');
    }

    router.push('/products')
  } catch (err) {
    console.error('Submit failed:', err)
    console.error('Error response:', err.response?.data)
    alert('Unable to save product data. Check console for details.')
  }
}

const cancelForm = () => { // Mengubah nama fungsi untuk kejelasan
  if (!confirm('Are you sure you want to cancel? Any unsaved changes will be discarded.')) {
    return // Jika pengguna menekan 'Cancel', hentikan
  }
  router.push('/products') // Langsung navigasi ke halaman daftar produk
}


onMounted(() => {
  fetchCategories()
  if (isEdit) {
    fetchProductById()
  }
})

// Fungsi untuk upload gambar
const uploadImage = async () => {
  if (!fileInput.value || !fileInput.value.files[0]) {
    alert('Select a file first.')
    return
  }

  const formData = new FormData()
  formData.append('file', fileInput.value.files[0])

  try {
    const res = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    imageUrl.value = res.data.location
    alert('Successfully uploaded! Image URL:\n' + imageUrl.value)
  } catch (err) {
    console.error('Failed to upload:', err.response?.data || err.message)
    alert('Upload failed. Please check the console for more information.')
  }
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2 class="title">
        {{ isEdit ? 'Edit Product' : 'Create New Product' }}
      </h2>

      <form @submit.prevent="submitForm" class="form">
        <div class="field">
          <label class="label">Product Title <span class="required">*</span></label>
          <input 
            v-model="title" 
            class="input" 
            placeholder="Enter product title"
            required 
          />
        </div>

        <div class="field">
          <label class="label">Price ($) <span class="required">*</span></label>
          <input 
            v-model="price" 
            type="number" 
            class="input" 
            placeholder="0.00"
            step="0.01"
            min="0"
            required 
          />
        </div>

        <div class="field">
          <label class="label">Description <span class="required">*</span></label>
          <textarea 
            v-model="description" 
            class="input textarea" 
            placeholder="Describe your product..."
            rows="2"
            required
          />
        </div>

        <div class="field">
          <label class="label">Category <span class="required" v-if="!isEdit">*</span></label>
          <template v-if="!isEdit">
            <select v-model="categoryId" class="input" required>
              <option disabled value="">-- Select Category --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </template>
          <template v-else>
            <input
              :value="categories.find(c => c.id === categoryId)?.name || 'Loading...'"
              class="input"
              disabled
            />
          </template>
        </div>

        <div class="field">
          <label class="label">Product Image <span class="required" v-if="!isEdit">*</span></label>
          <div class="upload-section">
            <input 
              type="file" 
              ref="fileInput" 
              class="file-input"
              accept="image/*"
              :required="!isEdit && !imageUrl"
            />
            <button 
              type="button" 
              @click="uploadImage" 
              class="upload-btn"
            >
              Upload Image
            </button>
          </div>

          <div v-if="imageUrl" class="image-preview">
            <p class="preview-label">Image Preview:</p>
            <img :src="imageUrl" alt="Product Preview" class="preview-image" />
          </div>
        </div>

        <div class="button-group">
          <button type="submit" class="submit-btn">
            {{ isEdit ? 'Update Product' : 'Create Product' }}
          </button>
          <button 
            type="button"
            @click="cancelForm" 
            class="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>
.container {
  min-height: 20vh;
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.input {
  padding: 0.6rem 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.input:hover {
  border-color: #cbd5e0;
}

.input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.8;
}

.textarea {
  resize: vertical;
  min-height: 60px;
  line-height: 1.4;
}

.select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 3rem;
}

.upload-section {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.file-input {
  flex: 1;
  min-width: 180px;
  font-size: 0.9rem;
}

.upload-btn {
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.85rem;
}

.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.25);
}

.image-preview {
  margin-top: 0.5rem;
  padding: 0.6rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
}

.preview-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
}

.preview-image {
  max-width: 100%;
  max-height: 100px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.submit-btn {
  flex: 1;
  min-width: 110px;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.25);
}

.cancel-btn {
  flex: 1;
  min-width: 90px;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #fc8181, #f56565);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(252, 129, 129, 0.25);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
    padding-top: 1.5rem;
  }
  
  .card {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 1.6rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .submit-btn,
  .cancel-btn {
    min-width: 100%;
  }
  
  .upload-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .upload-btn {
    align-self: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.75rem;
  }
  
  .card {
    padding: 1.25rem;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
  
  .form {
    gap: 1rem;
  }
}

/* Animation untuk smooth loading */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.5s ease-out;
}

/* Custom scrollbar untuk textarea */
.textarea::-webkit-scrollbar {
  width: 6px;
}

.textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.required {
  color: red;
}
</style>