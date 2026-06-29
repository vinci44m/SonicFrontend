<template>
  <div>
    <h1 class="content-title">
      {{ searchQuery.trim() ? `Suchergebnisse für Live-Streams: "${searchQuery}"` : 'Aktive Live-Streams' }}
    </h1>

    <div v-if="liveList.length > 0" class="video-grid">
      <article class="video-container live-container" v-for="stream in liveList" :key="stream.id">
        <a :href="stream.link" class="thumbnail-wrapper">
          <img :src="stream.thumbnail" class="video" />
          <span class="live-badge">🔴 LIVE</span>
          <span class="viewer-count">👁️ {{ stream.viewers }}</span>
        </a>
        <div class="video-info">
          <p class="video-title">{{ stream.title }}</p>
          <p class="video-channel-name">{{ stream.host }}</p>
          <div class="video-meta">
            <p class="stream-category">🔹 {{ stream.category }}</p>
            <p class="video-date">Gestartet vor {{ stream.startedSince }}</p>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="no-results">
      <p>🔍 Keine aktiven Live-Streams für deine Suche "<strong>{{ searchQuery }}</strong>" gefunden.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'

const searchQuery = inject('searchQuery', ref(''))
const allStreams = ref([]) // Wird vom Server befüllt

onMounted(async () => {
  try {
    const response = await fetch('https://sonicbackend-production.up.railway.app/api/streams')
    if (response.ok) {
      allStreams.value = await response.json()
    }
  } catch (error) {
    console.error('Fehler beim Laden der Live-Streams:', error)
  }
})

const liveList = computed(() => {
  if (!searchQuery.value.trim()) {
    return allStreams.value
  }

  const query = searchQuery.value.toLowerCase()
  return allStreams.value.filter(stream => 
    stream.title.toLowerCase().includes(query) || 
    stream.host.toLowerCase().includes(query) ||
    stream.category.toLowerCase().includes(query)
  )
})
</script>

<style scoped>
/* Spezielle Anpassungen für die Live-Kacheln */
.thumbnail-wrapper {
  position: relative;
  display: block;
}

.live-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ef4444;
  color: white;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 4px;
  letter-spacing: 0.5px;
  animation: blink 1.5s infinite;
}

.viewer-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
}

.stream-category {
  color: var(--primary-color, #1e90ff);
  font-weight: 500;
}

/* Animation für das blinkende rote Licht */
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

/* Nichts gefunden Box */
.no-results {
  text-align: center;
  padding: 40px;
  background-color: var(--card-bg, #0f172a);
  border: 1px dashed var(--border-color, #1a3a5c);
  border-radius: 8px;
  color: var(--text-muted, #64748b);
  font-size: 1.1rem;
  margin-top: 20px;
}
</style>
