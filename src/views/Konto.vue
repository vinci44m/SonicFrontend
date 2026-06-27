<template>
  <div class="profile-container">
    <h1 class="content-title">Mein Studenten-Profil</h1>

    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">👤</div>
        <div class="profile-info">
          <h2>{{ userProfile.name }}</h2>
          <p class="profile-email">📧 {{ userProfile.email }}</p>
          <div class="profile-badges">
            <span class="badge-role">🎓 Student</span>
            <span class="badge-semester">{{ userProfile.semester }}</span>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <div class="profile-settings">
        <h3>⚙️ Einstellungen</h3>
        <div class="form-group">
          <label>Anzeigename:</label>
          <input type="text" v-model="userProfile.name" />
        </div>
        <div class="form-group">
          <label>Aktuelles Semester:</label>
          <select v-model="userProfile.semester">
            <option>1. Semester</option>
            <option>2. Semester</option>
            <option>3. Semester</option>
            <option>4. Semester und höher</option>
          </select>
        </div>
        <button class="save-btn" @click="saveSettings">Änderungen speichern</button>
        <p v-if="showSaveMessage" class="save-message">✅ Profil erfolgreich aktualisiert!</p>
      </div>
    </div>

    <div class="activity-section">
      <h3>📜 Deine letzten Aktivitäten</h3>
      <div class="activity-list">
        <div v-for="act in activities" :key="act.id" class="activity-item">
          <span class="activity-icon">{{ act.icon }}</span>
          <div class="activity-details">
            <p class="activity-text"><strong>{{ act.type }}:</strong> {{ act.content }}</p>
            <p class="activity-time">{{ act.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reaktive Profildaten des angemeldeten Studenten
const userProfile = ref({
  name: "Max Mustermann",
  email: "max.mustermann@stud.fh-bochum.de",
  semester: "2. Semester"
})

const showSaveMessage = ref(false)

// Lokale Liste simulierter Aktivitäten, passend zu den vorherigen Features
const activities = ref([
  { id: 1, icon: "💬", type: "Kommentar verfasst", content: "Richtig gutes Video zu Webentwicklung! Das hat mir...", time: "Vor 5 Minuten" },
  { id: 2, icon: "📺", type: "Video angesehen", content: "Beispielvideo 3 (Modul: Webentwicklung)", time: "Vor 20 Minuten" },
  { id: 3, icon: "🔍", type: "Suche benutzt", content: "Gesucht nach: 'Vue 3'", time: "Vor 1 Stunde" },
  { id: 4, icon: "👋", type: "Konto erstellt", content: "Willkommen auf der Lernplattform!", time: "Vor 2 Tagen" }
])

const saveSettings = () => {
  showSaveMessage.value = true
  // Nachricht nach 3 Sekunden automatisch wieder ausblenden
  setTimeout(() => {
    showSaveMessage.value = false
  }, 3000)
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  background-color: var(--card-bg, #0f172a);
  border: 1px solid var(--border-color, #1a3a5c);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.profile-avatar {
  font-size: 3.5rem;
  background-color: var(--bg-color, #060f1a);
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid var(--primary-color, #1e90ff);
}

.profile-info h2 {
  margin: 0 0 4px 0;
  color: #fff;
}

.profile-email {
  color: var(--text-muted, #64748b);
  margin: 0 0 10px 0;
  font-size: 0.95rem;
}

.profile-badges {
  display: flex;
  gap: 8px;
}

.badge-role, .badge-semester {
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
}

.badge-role {
  background-color: rgba(30, 144, 255, 0.15);
  color: var(--primary-color, #1e90ff);
}

.badge-semester {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.divider {
  border: 0;
  height: 1px;
  background: var(--border-color, #1a3a5c);
  margin: 24px 0;
}

/* Einstellungen Formular */
.profile-settings h3 {
  margin: 0 0 16px 0;
  color: #fff;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--text-muted, #64748b);
}

.form-group input, .form-group select {
  background-color: var(--bg-color, #060f1a);
  border: 1px solid var(--border-color, #1a3a5c);
  color: var(--text-color, #e0e0e0);
  padding: 10px;
  border-radius: 6px;
  outline: none;
  font-size: 1rem;
}

.form-group input:focus, .form-group select:focus {
  border-color: var(--primary-color, #1e90ff);
}

.save-btn {
  background-color: var(--primary-color, #1e90ff);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-message {
  color: #10b981;
  font-size: 0.9rem;
  margin-top: 10px;
  font-weight: 500;
}

/* Aktivitäts-Verlauf */
.activity-section h3 {
  color: #fff;
  margin-bottom: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 14px;
  background-color: var(--card-bg, #0f172a);
  border: 1px solid var(--border-color, #1a3a5c);
  padding: 14px;
  border-radius: 8px;
  align-items: center;
}

.activity-icon {
  font-size: 1.3rem;
}

.activity-text {
  margin: 0 0 2px 0;
  color: var(--text-color, #e0e0e0);
  font-size: 0.95rem;
}

.activity-time {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
}
</style>