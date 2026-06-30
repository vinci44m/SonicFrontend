<template>
  <div class="auth-container">
    <h2>Konto erstellen</h2>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <label for="reg-name">Name</label>
        <input type="text" id="reg-name" v-model="regName" placeholder="Dein Name" required />
      </div>
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
import { API_URL } from '../config.js'

const router = useRouter()
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regConfirm = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  if (regPassword.value !== regConfirm.value) {
    errorMessage.value = 'Die Passwörter stimmen nicht überein.'
    return
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: regName.value,
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
<style>
/* Container für die Formular-Gruppen */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem; /* Abstand nach unten zum nächsten Feld */
  width: 100%;
  max-width: 400px; /* Begrenzt die Breite auf ein schönes Maß */
}

/* Styling für die Beschriftung (Label) */
.input-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568; /* Ein angenehmes Dunkelgrau */
  margin-bottom: 0.5rem; /* Abstand zum Eingabefeld darunter */
  text-align: left;
}

/* Styling für die Eingabefelder (Input) */
.input-group input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1; /* Heller, unauffälliger Rahmen */
  border-radius: 8px; /* Schöne, moderne Rundung */
  background-color: #ffffff;
  color: #1a202c;
  outline: none;
  transition: all 0.2s ease-in-out; /* Macht den Klick-Effekt flüssiger */
}

/* Platzhalter-Text (Placeholder) */
.input-group input::placeholder {
  color: #a0aec0; /* Dezentes Grau für den Beispiel-Text */
}

/* Effekt, wenn man in das Feld hineinklickt (Focus) */
.input-group input:focus {
  border-color: #4f46e5; /* Ändert den Rahmen z.B. zu einem modernen Indigo/Blau */
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); /* Sanfter Leuchteffekt außen herum */
}
</style>