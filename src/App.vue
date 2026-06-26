<template>
  <!-- Login und Register haben eigenes Layout (kein Header/Sidebar) -->
  <div v-if="isAuthPage" class="auth-page">
    <RouterView />
  </div>

  <!-- Alle anderen Seiten: Header + Sidebar + Content -->
  <div v-else>
    <header>
      <RouterLink to="/"><h1>SONIC</h1></RouterLink>

      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Suchen..."
          @keyup.enter="search"
        />
        <button @click="search">🔍</button>
      </div>

      <div class="header-right">
        <RouterLink to="/" class="upload-btn">Upload</RouterLink>
        <RouterLink to="/login" class="login-btn">Login</RouterLink>
      </div>
    </header>

    <main>
      <!-- Sidebar -->
      <div class="sidebar">
        <h2>Filter</h2>
        <ul>
          <li>
            <RouterLink to="/videos" :class="{ active: $route.path === '/videos' }">
              Alle Videos
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/discussion" :class="{ active: $route.path === '/discussion' }">
              Chats/Gruppen/Diskussionen
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/live" :class="{ active: $route.path === '/live' }">
              Live-Streams
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Seiten-Inhalt -->
      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')

const isAuthPage = computed(() =>
  route.path === '/login' || route.path === '/register'
)

const search = () => {
  console.log('Suche nach:', searchQuery.value)
}
</script>
