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
        <button @click="showForm = !showForm" class="new-post-btn">+ Neue Diskussion</button>
      </div>
    </div>

    <div v-if="showForm" class="create-post-form">
      <h3>Neue Diskussion starten</h3>
      <form @submit.prevent="createNewPost">
        <div class="form-group">
          <input v-model="newPostTitle" placeholder="Titel der Diskussion..." required />
        </div>
        <div class="form-group">
          <textarea v-model="newPostContent" placeholder="Beschreibe dein Anliegen ausführlich..." rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">Diskussion veröffentlichen</button>
          <button type="button" @click="showForm = false" class="cancel-btn">Abbrechen</button>
        </div>
      </form>
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
          <p class="post-body-text">{{ post.content }}</p>
          <div class="post-meta">
            <span class="post-tag" v-for="tag in post.tags" :key="tag">
              {{ tag }}
            </span>
            <span>Gepostet von @{{ post.user ? post.user.name : 'Unbekannt' }}</span>
            <span>•</span>
            <span>{{ new Date(post.created_at).toLocaleDateString('de-DE') }}</span>
          </div>
          <div class="post-comments">💬 {{ post.comments ? post.comments.length : 0 }} Kommentare</div>
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

const allPosts = ref([]) 
const showForm = ref(false)
const newPostTitle = ref('')
const newPostContent = ref('')

const loadPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`)
    if (response.ok) {
      allPosts.value = await response.json()
    }
  } catch (error) {
    console.error('Fehler beim Laden der Forenbeiträge:', error)
  }
}

onMounted(() => {
  loadPosts()
})

// Sendet die neue Diskussion an das Backend
const createNewPost = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: newPostTitle.value,
        content: newPostContent.value,
        tags: ['Allgemein'] // Default-Tag, erweiterbar
      })
    })

    if (response.ok) {
      const savedPost = await response.json()
      allPosts.value.unshift(savedPost) // Sofort live anzeigen
      newPostTitle.value = ''
      newPostContent.value = ''
      showForm.value = false
    } else {
      alert("Fehler beim Erstellen. Bist du eingeloggt?")
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Posten:", error)
  }
}

const filteredPosts = computed(() => {
  let result = allPosts.value

  if (activeCategory.value !== 'Alle') {
    result = result.filter(p => p.tags && p.tags.includes(activeCategory.value))
  }

  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) ||
      (post.user && post.user.name.toLowerCase().includes(query))
    )
  }

  if (sortBy.value === 'votes') {
    return [...result].sort((a, b) => b.votes - a.votes)
  }
  
  return result
})

const vote = (post, val) => { post.votes += val }
</script>

<style scoped>
/* Stylings für das neue Diskussions-Formular */
.create-post-form {
  background: #0f172a;
  border: 1px solid #1a3a5c;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.create-post-form h3 { margin-top: 0; color: #fff; }
.form-group { margin-bottom: 12px; }
.form-group input, .form-group textarea {
  width: 100%;
  background: #060f1a;
  border: 1px solid #1a3a5c;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  outline: none;
}
.form-actions { 
  display: flex; gap: 10px; 
}
.submit-btn { 
  background: #1e90ff; 
  color: white; 
  border: none; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-weight: bold; 
}
.cancel-btn { 
  background: transparent; 
  color: #64748b; 
  border: 1px solid #1a3a5c; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer; 
}
.post-body-text { 
  color: #cbd5e1; 
  font-size: 0.95rem; 
  margin: 8px 0; 
}
.new-post-btn { 
  background: #1e90ff; 
  color: #060f1a; 
  border: none; 
  padding: 6px 14px; 
  border-radius: 6px; 
  font-weight: bold; 
  cursor: pointer; 
  text-decoration: none; 
}

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