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

const handleRegister = async () => {
  errorMessage.value = ''

  if (regPassword.value !== regConfirm.value) {
    errorMessage.value = 'Die Passwörter stimmen nicht überein.'
    return
  }

  try {
    // Hier schickt das Frontend die Daten an dein Laravel-Backend
    const response = await fetch('https://sonicbackend-production.up.railway.app/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: regEmail.value,
        password: regPassword.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'Fehler bei der Registrierung.'
      return
    }

    alert('Erfolg! Konto wurde erstellt.')
    router.push('/login')

  } catch (error) {
    errorMessage.value = 'Verbindung zum Server fehlgeschlagen.'
  }
}
</script>
