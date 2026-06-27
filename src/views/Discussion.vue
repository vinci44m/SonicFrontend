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
import { ref, computed, inject } from 'vue'

// DIE VUE-MAGIE: Wir holen uns die searchQuery, die in App.vue via provide bereitgestellt wird
const searchQuery = inject('searchQuery', ref(''))

const sortBy = ref('votes')
const activeCategory = ref('Alle')
const categories = ref(['Vue', 'Laravel', 'CSS', 'Python', 'JavaScript'])

// Eure Beitragsdaten
const allPosts = ref([
  { id: 1, title: "Vue 3 Composition API vs Options API", author: "vue_dev",    tags: ["Vue", "JavaScript"],    votes: 42, comments: 12, date: "vor 2 Stunden" },
  { id: 2, title: "Laravel 11 neue Features im Überblick", author: "backend_guy", tags: ["Laravel"],              votes: 28, comments: 5,  date: "vor 5 Stunden" },
  { id: 3, title: "CSS Grid vs Flexbox - Wann nutzt man was?", author: "css_queen",   tags: ["CSS"],                  votes: 54, comments: 18, date: "vor 3 Tagen" },
  { id: 4, title: "Wie lerne ich am besten programmieren als Anfänger?", author: "starter2024", tags: ["Allgemein"],              votes: 89, comments: 45, date: "vor 4 Tagen" },
  { id: 5, title: "Python Listen und Dictionaries erklärt", author: "pydev",       tags: ["Python"],                 votes: 33, comments: 9,  date: "vor 5 Tagen" },
  { id: 6, title: "Warum sollte ich Vue.js lernen?",                  author: "vuefan",      tags: ["JavaScript"],             votes: 21, comments: 14, date: "vor 1 Woche" },
])

// Kombinierte Filter- und Sortierlogik
const filteredPosts = computed(() => {
  let result = allPosts.value

  // 1. Nach Kategorie filtern
  if (activeCategory.value !== 'Alle') {
    result = result.filter(p => p.tags.includes(activeCategory.value))
  }

  // 2. Nach Suchbegriff filtern (Echtzeit!)
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    )
  }

  // 3. Nach Auswahl sortieren
  if (sortBy.value === 'votes') {
    return [...result].sort((a, b) => b.votes - a.votes)
  }
  if (sortBy.value === 'comments') {
    return [...result].sort((a, b) => b.comments - a.comments)
  }
  
  // Wenn "Neu" gewählt ist, lassen wir die Standardreihenfolge
  return result
})

// Vote-Funktion
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