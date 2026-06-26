<template>
  <div>
    <h1 class="content-title">Alle Videos</h1>
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

    <div class="button-container" v-if="hasMore">
      <button class="loadMore-btn" @click="loadMore">Mehr Videos laden</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const allVideos = ref([
  { id: 1,  title: "Beispielvideo 1",  channelName: "Kanal 1",  accuracy: 85, views: "1M Aufrufe",   date: "vor 1 Monat",   thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 2,  title: "Beispielvideo 2",  channelName: "Kanal 2",  accuracy: 90, views: "500K Aufrufe", date: "vor 2 Wochen",  thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 3,  title: "Beispielvideo 3",  channelName: "Kanal 3",  accuracy: 75, views: "200K Aufrufe", date: "vor 3 Tagen",   thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 4,  title: "Beispielvideo 4",  channelName: "Kanal 4",  accuracy: 95, views: "1.5M Aufrufe", date: "vor 1 Woche",   thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 5,  title: "Beispielvideo 5",  channelName: "Kanal 5",  accuracy: 80, views: "300K Aufrufe", date: "vor 2 Monaten", thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 6,  title: "Beispielvideo 6",  channelName: "Kanal 6",  accuracy: 85, views: "1M Aufrufe",   date: "vor 1 Monat",   thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 7,  title: "Beispielvideo 7",  channelName: "Kanal 7",  accuracy: 90, views: "500K Aufrufe", date: "vor 2 Wochen",  thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 8,  title: "Beispielvideo 8",  channelName: "Kanal 8",  accuracy: 75, views: "200K Aufrufe", date: "vor 3 Tagen",   thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 9,  title: "Beispielvideo 9",  channelName: "Kanal 9",  accuracy: 95, views: "1.5M Aufrufe", date: "vor 1 Woche",   thumbnail: "../img/placeholder-image.jpg", link: "#" },
  { id: 10, title: "Beispielvideo 10", channelName: "Kanal 10", accuracy: 80, views: "300K Aufrufe", date: "vor 2 Monaten", thumbnail: "../img/placeholder-image.jpg", link: "#" },
])

const visibleCount = ref(8)
const videoList = computed(() => allVideos.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < allVideos.value.length)

const loadMore = () => {
  visibleCount.value = Math.min(visibleCount.value + 4, allVideos.value.length)
}
</script>
