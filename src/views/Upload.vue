<template>
  <div class="upload-page">
    <h1 class="content-title">Video hochladen</h1>
    <form @submit.prevent="uploadVideo" class="upload-form">
      
      <label for="title">Titel:</label>
      <input type="text" v-model="title" id="title" placeholder="Wie heißt dein Video?" required class="form-input" />
      
      <label for="file">Videodatei:</label>
      <input type="file" @change="handleFileChange" accept="video/mp4" required class="form-input" />
      
      <button type="submit" class="upload-btn" :disabled="uploading">
        {{ uploading ? 'Lädt hoch...' : 'Jetzt hochladen' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const file = ref(null)
const uploading = ref(false)

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const uploadVideo = async () => {
  uploading.value = true
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('video', file.value)

  try {
    const response = await fetch('http://127.0.0.1:8000/api/videos', {
      method: 'POST',
      body: formData
    })
    
    if (response.ok) {
      alert('Video erfolgreich hochgeladen!')
      title.value = ''
    } else {
      alert('Fehler beim Upload. Prüfe das Backend.')
    }
  } catch (error) {
    console.error("Upload fehlgeschlagen:", error)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.upload-page { max-width: 600px; margin: 40px auto; padding: 20px; color: white; }
.upload-form { display: flex; flex-direction: column; gap: 15px; background: #0f172a; padding: 30px; border-radius: 12px; }
.form-input { padding: 12px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: white; }
.upload-btn { background: #3b82f6; color: white; border: none; padding: 15px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.upload-btn:hover { background: #2563eb; }
</style>