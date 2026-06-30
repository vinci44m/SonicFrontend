<template>
  <div>
    <div class="disc-topbar">
      <span class="post-count">{{ filteredPosts.length }} Beiträge</span>
      <div class="topbar-right">
        <select v-model="sortBy">
          <option value="votes">Beliebt</option>
          <option value="new">Neu</option>
          <option value="comments">Meiste Kommentare</option>
        </select>
        <a href="#" class="new-post-btn">+ Neue Diskussion</a>
      </div>
    </div>

    <div class="category-filter">
      <button
        class="cat-btn"
        :class="{ active: activeCategory === 'Alle' }"
        @click="activeCategory = 'Alle'"
      >
        Alle
      </button>
      <button
        class="cat-btn"
        v-for="cat in categories"
        :key="cat"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="post-list">
      <article class="post-card" v-for="post in filteredPosts" :key="post.id">
        <div class="vote-col">
          <button class="vote-btn" @click="vote(post, 1)">▲</button>
          <span class="vote-count" :class="{ positive: post.votes > 0 }">
            {{ post.votes }}
          </span>
          <button class="vote-btn" @click="vote(post, -1)">▼</button>
        </div>
        <div class="post-content">
          <a href="#" class="post-title">{{ post.title }}</a>
          <div class="post-meta">
            <span class="post-tag" v-for="tag in post.tags" :key="tag">
              {{ tag }}
            </span>
            <span>Gepostet von @{{ post.author }}</span>
            <span>•</span>
            <span>{{ post.date }}</span>
          </div>
          <div class="post-comments">💬 {{ post.comments }} Kommentare</div>
        </div>
      </article>

      <div v-if="filteredPosts.length === 0" class="empty-state">
        Keine Diskussionen gefunden, die zu deinen Filtern oder deiner Suche passen.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { API_URL } from '../config.js'

const searchQuery = inject('searchQuery', ref(''))

const categories = ['Allgemein', 'Prüfungen', 'Projektgruppen', 'JavaScript', 'Laravel']
const activeCategory = ref('Alle')
const sortBy = ref('votes')

const allPosts = ref([]) // Holt sich die Beiträge gleich live

onMounted(async () => {
  try {
    const response = await fetch(`${API_URL}/posts`)
    if (response.ok) {
      allPosts.value = await response.json()
    }
  } catch (error) {
    console.error('Fehler beim Laden der Forenbeiträge:', error)
  }
})

const filteredPosts = computed(() => {
  let result = allPosts.value

  if (activeCategory.value !== 'Alle') {
    result = result.filter(p => p.tags.includes(activeCategory.value))
  }

  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    )
  }

  if (sortBy.value === 'votes') {
    return [...result].sort((a, b) => b.votes - a.votes)
  }
  if (sortBy.value === 'comments') {
    return [...result].sort((a, b) => b.comments - a.comments)
  }
  
  return result
})

const vote = (post, val) => {
  post.votes += val
}
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.cat-btn {
  background: #0d1b2a;
  border: 1px solid #1a3a5c;
  color: #8ab4d4;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.cat-btn:hover {
  border-color: #1e90ff;
  color: #1e90ff;
}

.cat-btn.active {
  background: #1e90ff;
  border-color: #1e90ff;
  color: #060f1a;
  font-weight: 600;
}
</style>