<template>
  <div class="login-container">
    <h2>Willkommen zu SONIC</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="email">E-Mail</label>
        <input type="email" id="email" v-model="email" placeholder="name@beispiel.de" required />
      </div>
      <div class="input-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" v-model="password" placeholder="••••••••" required />
      </div>
      <div class="button-container" style="flex-direction: column; gap: 0;">
        <button type="submit" class="btn-primary">Anmelden</button>
        <RouterLink to="/"><button type="button" class="btn-back">Zurück</button></RouterLink>
      </div>
      <p class="login-footer">
        Noch kein Account? <RouterLink to="/register">Registrieren</RouterLink>
      </p>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || []
  const found = users.find(u => u.email === email.value && u.password === password.value)
  if (found) {
    router.push('/')
  } else {
    errorMessage.value = 'Ungültige E-Mail oder falsches Passwort.'
  }
}
</script>
