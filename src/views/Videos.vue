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
      <article class="video-container" v-for="video in videoList" :key="video.id">
        <a :href="video.link">
          <img :src="video.thumbnail" class="video" />
        </a>
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
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

// Suchbegriff live aus App.vue abfangen
const searchQuery = inject('searchQuery', ref(''))

// NEU: Datenstruktur für Semester und deren Module
const semesters = ref(['Alle', '1. Semester', '2. Semester', '3. Semester'])

const modulesBySemester = {
  '1. Semester': ['Programmierung 1', 'Mathematik 1', 'Grundlagen der Informatik'],
  '2. Semester': ['Programmierung 2', 'Webentwicklung', 'Datenbanken'],
  '3. Semester': ['Software Engineering', 'Computergrafik', 'Netzwerke']
}

const selectedSemester = ref('Alle')
const selectedModule = ref('Alle')

// Wenn ein Semester geklickt wird, setzen wir das gewählte Modul zurück
const selectSemester = (sem) => {
  selectedSemester.value = sem
  selectedModule.value = 'Alle'
}

// Berechnet, welche Module für das gewählte Semester angezeigt werden sollen
const availableModules = computed(() => {
  if (selectedSemester.value === 'Alle') return []
  return modulesBySemester[selectedSemester.value] || []
})

// Eure erweiterten Video-Testdaten (jetzt mit Semester und Modul verknüpft!)
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

// Aktualisierte Filterlogik: Suchleiste, Semester UND Module arbeiten zusammen!
const videoList = computed(() => {
  // Wenn in der Suchleiste getippt wird, ignorieren wir die Semester-Filter vorübergehend
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    return allVideos.value.filter(video => 
      video.title.toLowerCase().includes(query) || 
      video.channelName.toLowerCase().includes(query)
    )
  }

  // Ansonsten filtern wir nach Semester und Modul
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
</script>

<style scoped>
/* Schicke Filter-Buttons */
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
</style>