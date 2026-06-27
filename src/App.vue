<template>
  <div v-if="isAuthPage" class="auth-page">
    <RouterView />
  </div>

  <div v-else>
    <header>
      <RouterLink to="/"><h1>SONIC</h1></RouterLink>

      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Suchen..."
        />
        <button style="cursor: default;">🔍</button>
      </div>

      <div class="header-right">
        <button class="theme-toggle-btn" @click="toggleTheme">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>

        <div class="upload-dropdown-container">
          <button class="upload-btn" @click="toggleUploadMenu">
            Upload ▾
          </button>
          
          <div v-if="isUploadMenuOpen" class="upload-dropdown-menu">
            <RouterLink to="/upload" @click="isUploadMenuOpen = false">🎥 Video hochladen</RouterLink>
            <RouterLink to="/live" @click="isUploadMenuOpen = false">🔴 Live gehen</RouterLink>
            <RouterLink to="/discussion" @click="isUploadMenuOpen = false">✍️ Beitrag posten</RouterLink>
          </div>
        </div>

        <RouterLink to="/login" class="login-btn">Login</RouterLink>
      </div>
    </header>

<main>
      <div class="sidebar">
        <h2>Filter</h2>
        <ul>
          <li>
            <RouterLink to="/videos" :class="{ active: $route.path === '/videos' }">
              Alle Videos
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/discussion" :class="{ active: $route.path === '/discussion' }">
              Chats/Gruppen/Diskussionen
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/live" :class="{ active: $route.path === '/live' }">
              Live-Streams
            </RouterLink>
          </li>
        </ul>
        
        <router-link to="/konto" class="sidebar-link">
          <span>👤 Mein Konto</span>
        </router-link>

        <div class="report-section">
          <button class="report-toggle-btn" @click="isReportOpen = !isReportOpen">
            ⚠️ Problem melden
          </button>
          
          <div v-if="isReportOpen" class="report-box">
            <textarea 
              v-model="reportText" 
              placeholder="Beschreibe das Problem..."
              rows="3"
            ></textarea>
            <button class="report-send-btn" @click="sendReport">Absenden</button>
            <p v-if="reportMessage" class="report-status">{{ reportMessage }}</p>
          </div>
        </div>
      </div>

      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')

provide('searchQuery', searchQuery)

// NEU: Logik für Dark/Light Mode
const isDarkMode = ref(true)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

// Logik für das Upload-Dropdown-Menü
const isUploadMenuOpen = ref(false)

const toggleUploadMenu = () => {
  isUploadMenuOpen.value = !isUploadMenuOpen.value
}

const isAuthPage = computed(() =>
  route.path === '/login' || route.path === '/register'
)

const search = () => {
  console.log('Suche nach:', searchQuery.value)
}

// Logik für die Melde-Section
const isReportOpen = ref(false)
const reportText = ref('')
const reportMessage = ref('')

const sendReport = () => {
  if (reportText.value.trim() === '') {
    reportMessage.value = 'Bitte beschreibe das Problem zuerst.'
    return
  }
  
  // Hier simulieren wir das Absenden (später geht das ans Backend)
  console.log('Gemeldetes Problem:', reportText.value)
  
  reportMessage.value = 'Vielen Dank! Die Meldung wurde gesendet.'
  reportText.value = ''
  
  // Nachricht nach 3 Sekunden wieder ausblenden
  setTimeout(() => {
    reportMessage.value = ''
  }, 3000)
}
</script>

<style scoped>
/* Ein kleiner feiner Style direkt für den Theme-Button im Header */
.theme-toggle-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: transform 0.2s;
}
.theme-toggle-btn:hover {
  transform: scale(1.15);
}

/* Styling für die Melde-Section */
.report-section {
  margin-top: auto; /* Schiebt die Section ganz nach unten in der Sidebar */
  padding-top: 20px;
  border-top: 1px solid var(--border-color, #1a3a5c);
}

.report-toggle-btn {
  width: 100%;
  background: transparent;
  border: 1px dashed var(--primary-color, #1e90ff);
  color: var(--text-color, #e0e0e0);
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-align: left;
  transition: background-color 0.2s;
}

.report-toggle-btn:hover {
  background-color: rgba(30, 144, 255, 0.1);
}

.report-box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-box textarea {
  width: 100%;
  background-color: var(--bg-color, #060f1a);
  border: 1px solid var(--border-color, #1a3a5c);
  color: var(--text-color, #e0e0e0);
  padding: 8px;
  border-radius: 6px;
  resize: none;
  font-family: inherit;
  font-size: 13px;
}

.report-box textarea:focus {
  outline: none;
  border-color: var(--primary-color, #1e90ff);
}

.report-send-btn {
  background-color: var(--primary-color, #1e90ff);
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  transition: opacity 0.2s;
}

.report-send-btn:hover {
  opacity: 0.9;
}

.report-status {
  font-size: 12px;
  color: #4caf50;
  margin: 0;
  text-align: center;
}
</style>