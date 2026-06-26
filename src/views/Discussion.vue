<template>
  <div>
    <!-- Topbar -->
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

    <!-- Kategorie-Filter (zusätzliche Sidebar-Logik hier inline) -->
    <div class="category-filter">
      <button
        class="cat-btn"
        :class="{ active: activeCategory === 'Alle' }"
        @click="activeCategory = 'Alle'"
      >Alle</button>
      <button
        class="cat-btn"
        v-for="cat in categories"
        :key="cat"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </div>

    <!-- Post Liste -->
    <div class="post-list">
      <article class="post-card" v-for="post in filteredPosts" :key="post.id">
        <div class="vote-col">
          <button class="vote-btn" @click="vote(post, 1)">▲</button>
          <span class="vote-count" :class="{ positive: post.votes > 0 }">{{ post.votes }}</span>
          <button class="vote-btn" @click="vote(post, -1)">▼</button>
        </div>
        <div class="post-content">
          <a href="#" class="post-title">{{ post.title }}</a>
          <div class="post-meta">
            <span class="post-tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
            <span>von {{ post.author }}</span>
            <span>· {{ post.date }}</span>
          </div>
          <p class="post-comments">{{ post.comments }} Kommentare</p>
        </div>
      </article>

      <div class="empty-state" v-if="filteredPosts.length === 0">
        <p>Keine Beiträge in dieser Kategorie.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = ref(['JavaScript', 'CSS', 'Python', 'HTML', 'Allgemein'])
const activeCategory = ref('Alle')
const sortBy = ref('votes')

const allPosts = ref([
  { id: 1, title: "Wie funktioniert CSS Flexbox wirklich?",           author: "maxmuster",   tags: ["CSS"],                    votes: 42, comments: 12, date: "vor 2 Stunden" },
  { id: 2, title: "JavaScript async/await – wann benutze ich was?",   author: "lernprofi",   tags: ["JavaScript"],             votes: 28, comments: 7,  date: "vor 5 Stunden" },
  { id: 3, title: "Python oder JavaScript als Einstieg?",             author: "newbie99",    tags: ["Python", "JavaScript"],   votes: 15, comments: 23, date: "vor 1 Tag" },
  { id: 4, title: "Was ist der Unterschied zwischen == und === in JS?",author: "jsfreak",     tags: ["JavaScript"],             votes: 67, comments: 31, date: "vor 2 Tagen" },
  { id: 5, title: "CSS Grid vs Flexbox – wann was benutzen?",         author: "cssmaster",   tags: ["CSS"],                    votes: 54, comments: 18, date: "vor 3 Tagen" },
  { id: 6, title: "Wie lerne ich am besten programmieren als Anfänger?",author: "starter2024",tags: ["Allgemein"],              votes: 89, comments: 45, date: "vor 4 Tagen" },
  { id: 7, title: "Python Listen und Dictionaries erklärt",           author: "pydev",       tags: ["Python"],                 votes: 33, comments: 9,  date: "vor 5 Tagen" },
  { id: 8, title: "Warum sollte ich Vue.js lernen?",                  author: "vuefan",      tags: ["JavaScript"],             votes: 21, comments: 14, date: "vor 1 Woche" },
])

const filteredPosts = computed(() => {
  let result = activeCategory.value === 'Alle'
    ? allPosts.value
    : allPosts.value.filter(p => p.tags.includes(activeCategory.value))

  if (sortBy.value === 'votes')    return [...result].sort((a, b) => b.votes - a.votes)
  if (sortBy.value === 'comments') return [...result].sort((a, b) => b.comments - a.comments)
  return result
})

const vote = (post, val) => { post.votes += val }
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.cat-btn {
  padding: 6px 14px;
  background: transparent;
  border: 1px solid #1a3a5c;
  border-radius: 6px;
  color: #8ab4d4;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  width: auto;
  margin-top: 0;
}

.cat-btn:hover,
.cat-btn.active {
  background-color: #1e90ff;
  border-color: #1e90ff;
  color: #060f1a;
}
</style>
