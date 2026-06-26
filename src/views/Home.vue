<template>
  <div>
    <h1 class="content-title">Videos</h1>
    <div class="video-grid">
      <article class="video-container" v-for="video in videoList" :key="video.id">
        <a :href="video.link">
          <img :src="video.thumbnail" class="video" />
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
import { ref, computed } from 'vue'

const allVideos = ref([
  { id: 1, title: "Beispielvideo 1", channelName: "Kanal 1", accuracy: 85, views: "1M Aufrufe", date: "vor 1 Monat", thumbnail: "/placeholder.jpg", link: "#" },
  { id: 2, title: "Beispielvideo 2", channelName: "Kanal 2", accuracy: 90, views: "500K Aufrufe", date: "vor 2 Wochen", thumbnail: "/placeholder.jpg", link: "#" },
  { id: 3, title: "Beispielvideo 3", channelName: "Kanal 3", accuracy: 75, views: "200K Aufrufe", date: "vor 3 Tagen", thumbnail: "/placeholder.jpg", link: "#" },
  { id: 4, title: "Beispielvideo 4", channelName: "Kanal 4", accuracy: 95, views: "1.5M Aufrufe", date: "vor 1 Woche", thumbnail: "/placeholder.jpg", link: "#" },
])

const videoList = computed(() => allVideos.value.slice(0, 4))

const posts = ref([
  { id: 1, title: 'Wie erkläre ich Rekursion am besten?', tags: ['Informatik'], author: 'max_mustermann', date: '14. Jun 2026', votes: 12, comments: 5 },
  { id: 2, title: 'Tipps für die IT-Sicherheit Klausur?', tags: ['IT-Sicherheit'], author: 'coder42', date: '13. Jun 2026', votes: 7, comments: 3 },
  { id: 3, title: 'Welche Mathe-Formelsammlung ist empfehlenswert?', tags: ['Mathe'], author: 'studihelp', date: '12. Jun 2026', votes: 4, comments: 8 },
])

const vote = (post, val) => { post.votes += val }
</script>
