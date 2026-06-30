<template>
  <div class="upload-wrapper">
    <div class="upload-card">
      <h2>Video hochladen</h2>
      
      <label>Titel:</label>
      <input v-model="title" placeholder="Wie heißt dein Video?" />

      <label>Videodatei:</label>
      <input type="file" @change="handleFileUpload" accept="video/*" />

      <button @click="uploadVideo">Jetzt hochladen</button>
      
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_URL } from '../config.js'

const title = ref('')
const videoFile = ref(null)
const message = ref('')

const handleFileUpload = (event) => {
  videoFile.value = event.target.files[0]
}

const uploadVideo = async () => {
  if (!title.value || !videoFile.value) {
    message.value = 'Bitte Titel und Datei auswählen!'
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('video', videoFile.value)

  try {
    const token = localStorage.getItem('auth_token')

    const response = await fetch(`${API_URL}/videos`, {
      method: 'POST',
      headers: {
        // Nötig, da Video-Upload eine geschützte Route ist (auth:sanctum)
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData,
    })

    if (response.ok) {
      message.value = 'Erfolg! Das Video wurde hochgeladen.'
      title.value = ''
    } else if (response.status === 401) {
      message.value = 'Bitte zuerst einloggen.'
    } else {
      message.value = 'Fehler beim Hochladen.'
    }
  } catch (error) {
    message.value = 'Verbindungsfehler.'
    console.error(error)
  }
}
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.upload-card {
  background: #111b2b;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  color: white;
}

h2 {
  margin-bottom: 20px;
  border-bottom: 1px solid #2d3748;
  padding-bottom: 10px;
}

label {
  display: block;
  margin: 15px 0 5px 0;
  font-weight: bold;
}

input[type="text"], 
input[type="file"] {
  display: block;
  width: 100%;
  padding: 10px;
  background: #1a2538;
  border: 1px solid #2d3748;
  color: white;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: bold;
}

button:hover {
  background: #1d4ed8;
}

.message {
  margin-top: 15px;
  text-align: center;
}
</style>
