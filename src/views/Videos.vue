<template>
  <div>
    <h1 class="content-title">
      {{ searchQuery.trim() ? `Suchergebnisse für "${searchQuery}"` : 'Videos nach Modulen' }}
    </h1>

    <div class="filter-wrapper" v-if="!searchQuery.trim()">
      <div class="semester-filter">
        <button 
          v-for="sem in semesters" 
          :key="sem"
          class="filter-btn sem-btn"
          :class="{ active: selectedSemester === sem }"
          @click="selectSemester(sem)"
        >
          {{ sem }}
        </button>
      </div>

      <div class="module-filter" v-if="availableModules.length > 0">
        <button 
          class="filter-btn mod-btn"
          :class="{ active: selectedModule === 'Alle' }"
          @click="selectedModule = 'Alle'"
        >
          Alle Module
        </button>
        <button 
          v-for="mod in availableModules" 
          :key="mod"
          class="filter-btn mod-btn"
          :class="{ active: selectedModule === mod }"
          @click="selectedModule = mod"
        >
          {{ mod }}
        </button>
      </div>
    </div>

    <div v-if="videoList.length > 0" class="video-grid">
      <article class="video-container" v-for="video in videoList" :key="video.id" @click="openVideo(video)" style="cursor: pointer;">
        <div class="thumbnail-wrapper">
          <img :src="video.thumbnail" class="video" />
        </div>
        <div class="video-info">
          <p class="video-title">{{ video.title }}</p>
          <p class="video-channel-name">{{ video.channelName }}</p>
          <div class="video-meta">
            <span class="module-tag">{{ video.module }}</span>
            <p class="video-views">{{ video.views }}</p>
            <p class="video-date">{{ video.date }}</p>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="no-results">
      <p>🔍 Keine Videos für die aktuelle Auswahl gefunden.</p>
    </div>

    <div class="button-container" v-if="hasMore">
      <button class="loadMore-btn" @click="loadMore">Mehr Videos laden</button>
    </div>

    <div v-if="activeVideo" class="video-modal-backdrop" @click.self="closeVideo">
      <div class="video-modal-content">
        <button class="close-modal-btn" @click="closeVideo">✕</button>
        
        <div class="modal-video-player" :class="{ 'is-fullscreen': isFullscreen }">
          <img :src="activeVideo.thumbnail" alt="Video playing" />
          <div class="play-overlay">▶ Simulated Video Player</div>
          
          <button class="fullscreen-toggle-btn" @click="toggleFullscreen">
            {{ isFullscreen ? '🗗 Fullscreen verlassen' : '🗖 Fullscreen' }}
          </button>
        </div>

        <div class="modal-video-details" v-if="!isFullscreen">
          <h2>{{ activeVideo.title }}</h2>
          <p class="modal-channel">{{ activeVideo.channelName }} • <span class="module-tag">{{ activeVideo.module }}</span></p>
          <p class="modal-meta">{{ activeVideo.views }} • {{ activeVideo.date }} • Passgenauigkeit: {{ activeVideo.accuracy }}%</p>
        </div>

        <div class="comments-section">
          <h3>💬 Kommentare ({{ comments.length }})</h3>
          
          <div class="comment-input-box">
            <input 
              v-model="newCommentText" 
              placeholder="Schreibe einen öffentlichen Kommentar..." 
              @keyup.enter="addComment"
            />
            <button @click="addComment">Posten</button>
          </div>

          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">👤</div>
              <div class="comment-body">
                <p class="comment-user">{{ comment.user }} <span class="comment-time">{{ comment.time }}</span></p>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
            <p v-if="comments.length === 0" class="no-comments">Noch keine Kommentare. Schreib den ersten!</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

// Suchbegriff live aus App.vue abfangen
const searchQuery = inject('searchQuery', ref(''))

// Datenstruktur für Semester und deren Module
const semesters = ref(['Alle', '1. Semester', '2. Semester', '3. Semester'])

const modulesBySemester = {
  '1. Semester': ['Programmierung 1', 'Mathematik 1', 'Grundlagen der Informatik'],
  '2. Semester': ['Programmierung 2', 'Webentwicklung', 'Datenbanken'],
  '3. Semester': ['Software Engineering', 'Computergrafik', 'Netzwerke']
}

const selectedSemester = ref('Alle')
const selectedModule = ref('Alle')

const selectSemester = (sem) => {
  selectedSemester.value = sem
  selectedModule.value = 'Alle'
}

const availableModules = computed(() => {
  if (selectedSemester.value === 'Alle') return []
  return modulesBySemester[selectedSemester.value] || []
})

// Eure erweiterten Video-Testdaten
const allVideos = ref([
  { id: 1, title: "Beispielvideo 1", channelName: "Kanal 1", accuracy: 85, views: "1M Aufrufe",   date: "vor 1 Monat",   thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "1. Semester", module: "Programmierung 1" },
  { id: 2, title: "Beispielvideo 2", channelName: "Kanal 2", accuracy: 90, views: "500K Aufrufe", date: "vor 2 Wochen",  thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "1. Semester", module: "Mathematik 1" },
  { id: 3, title: "Beispielvideo 3", channelName: "Kanal 3", accuracy: 75, views: "200K Aufrufe", date: "vor 3 Tagen",   thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "2. Semester", module: "Webentwicklung" },
  { id: 4, title: "Beispielvideo 4", channelName: "Kanal 4", accuracy: 95, views: "1.5M Aufrufe", date: "vor 1 Woche",   thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "2. Semester", module: "Datenbanken" },
  { id: 5, title: "Beispielvideo 5", channelName: "Kanal 5", accuracy: 80, views: "300K Aufrufe", date: "vor 2 Monaten", thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "1. Semester", module: "Grundlagen der Informatik" },
  { id: 6, title: "Beispielvideo 6", channelName: "Kanal 6", accuracy: 85, views: "1M Aufrufe",   date: "vor 1 Monat",   thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "2. Semester", module: "Programmierung 2" },
  { id: 7, title: "Beispielvideo 7", channelName: "Kanal 7", accuracy: 90, views: "500K Aufrufe", date: "vor 2 Wochen",  thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "3. Semester", module: "Software Engineering" },
  { id: 8, title: "Beispielvideo 8", channelName: "Kanal 8", accuracy: 75, views: "200K Aufrufe", date: "vor 3 Tagen",   thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "3. Semester", module: "Computergrafik" },
  { id: 9, title: "Beispielvideo 9", channelName: "Kanal 9", accuracy: 95, views: "1.5M Aufrufe", date: "vor 1 Woche",   thumbnail: "../img/placeholder-image.jpg", link: "#", semester: "3. Semester", module: "Netzwerke" }
])

const visibleCount = ref(4)

const videoList = computed(() => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    return allVideos.value.filter(video => 
      video.title.toLowerCase().includes(query) || 
      video.channelName.toLowerCase().includes(query)
    )
  }

  return allVideos.value.filter(video => {
    const matchSemester = selectedSemester.value === 'Alle' || video.semester === selectedSemester.value
    const matchModule = selectedModule.value === 'Alle' || video.module === selectedModule.value
    return matchSemester && matchModule
  }).slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  if (searchQuery.value.trim() || selectedSemester.value !== 'Alle' || selectedModule.value !== 'Alle') return false
  return visibleCount.value < allVideos.value.length
})

const loadMore = () => { visibleCount.value += 4 }

// Logik für das Detail-Fenster & Kommentare
const activeVideo = ref(null)
const newCommentText = ref('')
const comments = ref([])
const isFullscreen = ref(false) // Fullscreen Variable hier sauber deklariert

const openVideo = (video) => {
  activeVideo.value = video
  comments.value = [
    { id: 1, user: "Studi_99", text: `Richtig gutes Video zu ${video.module}! Das hat mir für die Prüfung extrem geholfen.`, time: "vor 1 Std." },
    { id: 2, user: "Alex_Code", text: "Kann mir jemand erklären, was der Dozent ab der Mitte des Videos meint?", time: "vor 30 Min." }
  ]
}

// Hier ist die Schließen-Logik jetzt vollkommen fehlerfrei integriert:
const closeVideo = () => {
  isFullscreen.value = false
  activeVideo.value = null
  newCommentText.value = ''
}

const addComment = () => {
  if (newCommentText.value.trim() === '') return
  
  comments.value.unshift({
    id: Date.now(),
    user: "Du (Eingeloggt)",
    text: newCommentText.value,
    time: "Gerade eben"
  })
  
  newCommentText.value = ''
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}
</script>

<style scoped>
.filter-wrapper {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.semester-filter, .module-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  background-color: var(--card-bg, #0f172a);
  border: 1px solid var(--border-color, #1a3a5c);
  color: var(--text-color, #e0e0e0);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary-color, #1e90ff);
}

.filter-btn.active {
  background-color: var(--primary-color, #1e90ff);
  color: white;
  border-color: var(--primary-color, #1e90ff);
}

.mod-btn {
  font-size: 0.85rem;
  padding: 6px 12px;
  background-color: transparent;
}

.module-tag {
  background-color: rgba(30, 144, 255, 0.15);
  color: var(--primary-color, #1e90ff);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.no-results {
  text-align: center;
  padding: 40px;
  background-color: var(--card-bg, #0f172a);
  border: 1px dashed var(--border-color, #1a3a5c);
  border-radius: 8px;
  color: var(--text-muted, #64748b);
  margin-top: 20px;
}

.video-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.video-modal-content {
  background-color: var(--card-bg, #0f172a);
  border: 1px solid var(--border-color, #1a3a5c);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.close-modal-btn:hover { background: #ef4444; }

.modal-video-player {
  position: relative;
  width: 100%;
  background-color: black;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-video-player img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}
.play-overlay {
  position: absolute;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  background: rgba(30, 144, 255, 0.8);
  padding: 12px 24px;
  border-radius: 30px;
}

.modal-video-details {
  padding: 20px;
  border-bottom: 1px solid var(--border-color, #1a3a5c);
}
.modal-video-details h2 { margin: 0 0 8px 0; color: var(--text-title, #fff); }
.modal-channel { color: var(--text-muted, #64748b); margin-bottom: 4px; }
.modal-meta { font-size: 0.9rem; color: var(--text-muted, #64748b); }

.comments-section { padding: 20px; }
.comment-input-box {
  display: flex;
  gap: 10px;
  margin: 15px 0 25px 0;
}
.comment-input-box input {
  flex: 1;
  background-color: var(--bg-color, #060f1a);
  border: 1px solid var(--border-color, #1a3a5c);
  color: var(--text-color, #e0e0e0);
  padding: 12px;
  border-radius: 6px;
  outline: none;
}
.comment-input-box input:focus { border-color: var(--primary-color, #1e90ff); }
.comment-input-box button {
  background-color: var(--primary-color, #1e90ff);
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.comments-list { display: flex; flex-direction: column; gap: 16px; }
.comment-item { display: flex; gap: 12px; align-items: flex-start; }
.comment-avatar { font-size: 1.5rem; }
.comment-user { font-weight: bold; font-size: 0.9rem; margin: 0 0 4px 0; }
.comment-time { font-weight: normal; font-size: 0.8rem; color: #64748b; margin-left: 6px; }
.comment-text { margin: 0; color: var(--text-color, #e0e0e0); font-size: 0.95rem; }
.no-comments { text-align: center; color: #64748b; font-style: italic; }

.fullscreen-toggle-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  z-index: 15;
}

.fullscreen-toggle-btn:hover {
  background: var(--primary-color, #1e90ff);
  border-color: var(--primary-color, #1e90ff);
}

.modal-video-player.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3000;
  background-color: black;
}

.modal-video-player.is-fullscreen img {
  opacity: 0.8;
}

.modal-video-player.is-fullscreen ~ .close-modal-btn {
  display: none;
}
</style>