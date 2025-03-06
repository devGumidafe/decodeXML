<script setup lang="ts">
import { ref } from 'vue'
import ConfigSection from './components/ConfigSection.vue'
import FileUploadSection from './components/FileUploadSection.vue'
import PasteSection from './components/PasteSection.vue'
import ResultSection from './components/ResultSection.vue'
import MessageDisplay from './components/MessageDisplay.vue'
import { useXmlDecoder } from './composables/useXmlDecoder'

const {
  tagName,
  xmlContent,
  results,
  isLoading,
  hasResults,
  errorMessage,
  successMessage,
  resetTagName,
  clearResults,
  processXml,
  processFile,
  downloadXml,
  copyAllText,
} = useXmlDecoder()

// Control para saber si el contenido viene de un archivo o de pegado
const isFromFile = ref(false)

/**
 * Manejador de eventos para cuando se selecciona un archivo
 * @param file Archivo seleccionado
 */
const handleFileSelected = (file: File): void => {
  // Solo registra que se seleccionó un archivo
  console.log('Archivo seleccionado:', file.name)
  isFromFile.value = true
}

/**
 * Manejador de eventos para procesar un archivo
 * @param file Archivo a procesar
 */
const handleProcessFile = (file: File): void => {
  isFromFile.value = true
  // Al procesar un archivo, limpiamos el área de pegado
  xmlContent.value = ''
  processFile(file)
}

/**
 * Manejador para cuando se elimina un archivo
 */
const handleClearFile = (): void => {
  isFromFile.value = false
  // Si había resultados procesados del archivo, los limpiamos
  if (hasResults.value) {
    clearResults()
  }
}

/**
 * Manejador de eventos para procesar contenido pegado
 * @param content Contenido XML a procesar
 */
const handleProcessContent = (content: string): void => {
  isFromFile.value = false
  xmlContent.value = content
  processXml()
}

/**
 * Manejador de eventos para exportar los resultados
 */
const handleExport = (): void => {
  downloadXml()
}

/**
 * Manejador de eventos para copiar todos los resultados
 */
const handleCopyAll = (): void => {
  copyAllText()
}

/**
 * Manejador de eventos para limpiar los resultados
 */
const handleClear = (): void => {
  clearResults()
}

/**
 * Manejador para limpiar el contenido del área de pegado
 */
const handleClearContent = (): void => {
  xmlContent.value = ''
}
</script>

<template>
  <div class="app">
    <MessageDisplay :error-message="errorMessage" :success-message="successMessage" />

    <header class="app__header">
      <div class="app__header-content">
        <div class="app__logo">
          <i class="pi pi-code app__logo-icon"></i>
        </div>
        <h1 class="app__title">Decodificador XML Base64</h1>
        <p class="app__subtitle">Herramienta para procesar y decodificar contenido XML en Base64</p>
      </div>
    </header>

    <main class="app__main">
      <!-- Sección de configuración (arriba) -->
      <section class="app__section app__section--config">
        <ConfigSection
          :tag-name="tagName"
          @update:tag-name="(value) => (tagName = value)"
          @reset="resetTagName"
        />
      </section>

      <!-- Sección de entrada de datos (fila del medio) -->
      <section class="app__section app__section--inputs">
        <div class="app__inputs-container">
          <div class="app__input-column">
            <FileUploadSection
              @file-selected="handleFileSelected"
              @process-file="handleProcessFile"
              @clear-file="handleClearFile"
            />
          </div>

          <div class="app__input-column">
            <PasteSection
              :content="isFromFile ? '' : xmlContent"
              @update:content="(value) => (xmlContent = value)"
              @process="handleProcessContent"
              @clear="handleClearContent"
            />
          </div>
        </div>
      </section>

      <!-- Sección de resultados (abajo, ancho completo) -->
      <section class="app__section app__section--result">
        <ResultSection
          :results="results"
          :is-loading="isLoading"
          :has-results="hasResults"
          @export="handleExport"
          @copy-all="handleCopyAll"
          @clear="handleClear"
        />
      </section>
    </main>

    <footer class="app__footer">
      <div class="app__footer-content">
        <div class="app__footer-section">
          <h3 class="app__footer-title">Decodificador XML Base64</h3>
          <p class="app__footer-text">
            Herramienta avanzada para procesar y decodificar contenido XML en Base64.
          </p>
        </div>

        <div class="app__footer-section">
          <h3 class="app__footer-title">Características</h3>
          <ul class="app__footer-list">
            <li><i class="pi pi-check"></i> Carga de archivos XML</li>
            <li><i class="pi pi-check"></i> Decodificación de contenido Base64</li>
            <li><i class="pi pi-check"></i> Exportación a XML</li>
          </ul>
        </div>

        <div class="app__footer-copyright">
          <p>&copy; {{ new Date().getFullYear() }} Decodificador XML Base64</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fd;
}

/* Header Styles */
.app__header {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.app__header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.app__header-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.app__logo {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: 1rem;
}

.app__logo-icon {
  font-size: 2rem;
}

.app__title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.app__subtitle {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Main content area */
.app__main {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 2rem;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app__section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* Inputs container (middle row) */
.app__inputs-container {
  display: flex;
  gap: 2rem;
  width: 100%;
}

.app__input-column {
  flex: 1;
  min-width: 0;
}

/* Footer Styles */
.app__footer {
  background: linear-gradient(135deg, #263238 0%, #37474f 100%);
  color: #eceff1;
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.app__footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.app__footer-section {
  margin-bottom: 2rem;
}

.app__footer-title {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #90caf9;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;
}

.app__footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: #2196f3;
}

.app__footer-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.85;
}

.app__footer-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.app__footer-list li {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app__footer-list i {
  color: #4caf50;
}

.app__footer-copyright {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Media queries */
@media (max-width: 992px) {
  .app__main {
    padding: 1rem;
  }

  .app__title {
    font-size: 2rem;
  }

  .app__subtitle {
    font-size: 1rem;
  }

  .app__footer-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .app__inputs-container {
    flex-direction: column;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.app__section {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
