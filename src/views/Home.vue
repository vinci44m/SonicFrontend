<template>
  <div>
    <!-- Videobereich -->
    <h1 class="content-title">Videos</h1>
    <div class="video-grid">
      <article class="video-container" v-for="video in videoList" :key="video.id">
        <a :href="video.link">
          <img :src="video.thumbnail" class="video" alt="Thumbnail" />
        </a>
        <div class="video-info">
          <p class="video-title">{{ video.title }}</p>
          <p class="video-channel-name">{{ video.channelName }}</p>
          <div class="video-meta">
            <p class="video-accuracy">{{ video.accuracy }}%</p>
            <p class="video-views">{{ video.views }}</p>
            <p class="video-date">{{ video.date }}</p>
          </div>
        </div>
      </article>
    </div>

    <!-- Button zum Laden weiterer Videos -->
    <div v-if="visibleCount < allVideos.length" class="load-more-container">
      <button @click="visibleCount += 4" class="load-more-btn">Mehr Videos laden</button>
    </div>

    <!-- Diskussionsbereich (wie am Anfang) -->
    <h2 class="content-title">Discussion</h2>
    <div class="post-list">
      <article class="post-card" v-for="post in posts" :key="post.id">
        <div class="vote-col">
          <button class="vote-btn" @click="vote(post, 1)">▲</button>
          <span class="vote-count" :class="{ positive: post.votes > 0 }">{{ post.votes }}</span>
          <button class="vote-btn" @click="vote(post, -1)">▼</button>
        </div>
        <div class="post-content">
          <RouterLink :to="'/discussion'" class="post-title">{{ post.title }}</RouterLink>
          <div class="post-meta">
            <span class="post-tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
            <span>von {{ post.author }}</span>
            <span>· {{ post.date }}</span>
          </div>
          <p class="post-comments">{{ post.comments }} Kommentare</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const allVideos = ref([])
const visibleCount = ref(4)

// Daten abrufen
onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/videos')
    const data = await response.json()
    
    allVideos.value = data.map(v => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail_path || '/placeholder.jpg',
      link: '#',
      channelName: 'Dein Kanal',
      accuracy: 100,
      views: '0 Aufrufe',
      date: v.created_at ? new Date(v.created_at).toLocaleDateString('de-DE') : ''
    }))
  } catch (error) {
    console.error("Fehler beim Laden:", error)
  }
})

const videoList = computed(() => allVideos.value.slice(0, visibleCount.value))

// Posts Logik
const posts = ref([
  { id: 1, title: 'Wie erkläre ich Rekursion am besten?', tags: ['Informatik'], author: 'max_mustermann', date: '14. Jun 2026', votes: 12, comments: 5 },
  { id: 2, title: 'Tipps für die IT-Sicherheit Klausur?', tags: ['IT-Sicherheit'], author: 'coder42', date: '13. Jun 2026', votes: 7, comments: 3 },
  { id: 3, title: 'Welche Mathe-Formelsammlung ist empfehlenswert?', tags: ['Mathe'], author: 'studihelp', date: '12. Jun 2026', votes: 4, comments: 8 },
])
const vote = (post, val) => { post.votes += val }
</script>

<style scoped>
/* Original Design Styles */
.content-title { color: #ffffff; font-size: 1.5rem; margin-bottom: 20px; font-weight: 600; }
.video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; }
.video-container { background: #0f172a; border-radius: 12px; overflow: hidden; transition: 0.3s; }
.video-container:hover { transform: translateY(-5px); }
.video { width: 100%; height: 160px; object-fit: cover; }
.video-info { padding: 16px; }
.video-title { color: white; font-weight: bold; margin: 0 0 8px 0; }
.video-channel-name { color: #64748b; font-size: 0.9rem; margin-bottom: 12px; }
.video-meta { display: flex; gap: 12px; color: #94a3b8; font-size: 0.85rem; }

.load-more-container { text-align: center; margin-bottom: 40px; }
.load-more-btn { background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; }

/* Diskussion Bereich Original Styles */
.post-list { display: flex; flex-direction: column; gap: 16px; }
.post-card { display: flex; background: #0f172a; padding: 16px; border-radius: 8px; color: white; }
.vote-col { display: flex; flex-direction: column; align-items: center; margin-right: 16px; }
.vote-btn { background: none; border: none; color: #64748b; cursor: pointer; }
.vote-count { font-weight: bold; margin: 4px 0; }
.post-title { color: #3b82f6; text-decoration: none; font-weight: bold; }
.post-meta { font-size: 0.85rem; color: #94a3b8; margin: 8px 0; display: flex; gap: 8px; }
</style>