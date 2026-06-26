<template>
  <div class="auth-container">
    <h2>Konto erstellen</h2>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <label for="reg-email">E-Mail-Adresse</label>
        <input type="email" id="reg-email" v-model="regEmail" placeholder="name@beispiel.de" required />
      </div>
      <div class="input-group">
        <label for="reg-password">Passwort</label>
        <input type="password" id="reg-password" v-model="regPassword" placeholder="Mind. 4 Zeichen" required />
      </div>
      <div class="input-group">
        <label for="reg-confirm">Passwort bestätigen</label>
        <input type="password" id="reg-confirm" v-model="regConfirm" placeholder="••••••••" required />
      </div>
      <div style="display: flex; flex-direction: column; gap: 0;">
        <button type="submit" class="btn-primary">Registrieren</button>
        <button type="button" class="btn-secondary" @click="router.push('/login')">Zurück zum Login</button>
      </div>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const regEmail = ref('')
const regPassword = ref('')
const regConfirm = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (regPassword.value.length < 4) {
    errorMessage.value = 'Das Passwort muss mindestens 4 Zeichen lang sein.'
    return
  }
  if (regPassword.value !== regConfirm.value) {
    errorMessage.value = 'Die Passwörter stimmen nicht überein.'
    return
  }

  const users = JSON.parse(localStorage.getItem('registeredUsers')) || []
  if (users.some(u => u.email === regEmail.value)) {
    errorMessage.value = 'Diese E-Mail ist bereits registriert.'
    return
  }

  users.push({ email: regEmail.value, password: regPassword.value })
  localStorage.setItem('registeredUsers', JSON.stringify(users))

  successMessage.value = 'Konto erfolgreich erstellt! Du wirst zum Login weitergeleitet...'
  regEmail.value = ''
  regPassword.value = ''
  regConfirm.value = ''

  setTimeout(() => router.push('/login'), 2000)
}
</script>
