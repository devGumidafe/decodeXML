<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { DecodedResult } from '@/types/xml-decoder'

interface Props {
  results: DecodedResult[]
  isLoading: boolean
  hasResults: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  export: []
  'copy-all': []
  clear: []
}>()

const hasContent = computed<boolean>(() => props.results.length > 0)

/**
 * Maneja la exportación de los resultados
 */
const handleExport = (): void => {
  emit('export')
}

/**
 * Maneja la copia de todos los resultados
 */
const handleCopyAll = (): void => {
  emit('copy-all')
}

/**
 * Maneja la limpieza de los resultados
 */
const handleClear = (): void => {
  emit('clear')
}

/**
 * Formatea el XML con colores para etiquetas y contenido
 */
const formatXml = (text: string): string => {
  if (!text) return ''

  // Escapar primero para evitar XSS
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // Usamos un enfoque diferente para mejor colorear las etiquetas y contenido
  let result = ''
  let inTag = false
  let currentTag = ''
  let currentContent = ''

  for (let i = 0; i < escaped.length; i++) {
    const char = escaped[i]
    const nextChar = escaped[i + 1] || ''

    if (char === '&' && nextChar === 'l' && escaped[i + 2] === 't' && escaped[i + 3] === ';') {
      // Inicio potencial de etiqueta
      if (currentContent) {
        result += `<span class="xml-content">${currentContent}</span>`
        currentContent = ''
      }
      inTag = true
      currentTag = '&lt;'
      i += 3 // Saltar 'lt;'
    } else if (
      char === '&' &&
      nextChar === 'g' &&
      escaped[i + 2] === 't' &&
      escaped[i + 3] === ';' &&
      inTag
    ) {
      // Fin de etiqueta
      currentTag += '&gt;'
      result += `<span class="xml-tag">${currentTag}</span>`
      currentTag = ''
      inTag = false
      i += 3 // Saltar 'gt;'
    } else if (inTag) {
      // Dentro de una etiqueta
      currentTag += char
    } else {
      // Contenido normal entre etiquetas
      currentContent += char
    }
  }

  // Agregar cualquier contenido restante
  if (currentContent) {
    result += `<span class="xml-content">${currentContent}</span>`
  }

  return result
}
</script>

<template>
  <div class="results">
    <h2 class="results__title"><i class="pi pi-file-code"></i> Contenido Decodificado</h2>

    <div class="results__container">
      <div v-if="isLoading" class="results__loading">
        <i class="pi pi-spin pi-spinner results__loading-icon"></i>
        <span class="results__loading-text">Procesando...</span>
      </div>

      <div v-else-if="!hasContent" class="results__empty">
        <i class="pi pi-info-circle results__empty-icon"></i>
        <p class="results__empty-text">
          Carga o pega un XML y procésalo para ver los resultados aquí
        </p>
      </div>

      <div v-else class="results__content">
        <Card v-for="(result, index) in results" :key="index" class="results__card">
          <template #title>
            <div class="results__card-header">
              <span class="results__card-title">Resultado {{ index + 1 }}</span>
              <div v-if="result.isBase64" class="results__tag results__tag--base64">Base64</div>
              <div v-else class="results__tag results__tag--not-base64">No es Base64</div>
            </div>
          </template>

          <template #content>
            <div class="results__card-content">
              <h3 class="results__section-title">
                <i class="pi pi-tag"></i> Etiqueta {{ result.tagName }}
              </h3>

              <div v-if="result.isBase64" class="results__decoded">
                <div class="results__code-block results__code-block--decoded">
                  <pre class="results__pre" v-html="formatXml(result.decodedText)"></pre>
                </div>
              </div>

              <div v-else class="results__not-decoded">
                <div class="results__code-block results__code-block--original">
                  <pre class="results__pre">{{ result.originalBase64 }}</pre>
                </div>
                <p class="results__message">El contenido no está en formato Base64</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <div class="results__actions">
      <Button
        label="Exportar a XML"
        icon="pi pi-download"
        class="p-button-primary results__button"
        :disabled="!hasContent"
        @click="handleExport"
        v-tooltip="'Descargar como archivo XML'"
      />

      <Button
        label="Copiar todo"
        icon="pi pi-copy"
        class="p-button-secondary results__button"
        :disabled="!hasContent"
        @click="handleCopyAll"
        v-tooltip="'Copiar todos los resultados al portapapeles'"
      />

      <Button
        label="Limpiar"
        icon="pi pi-trash"
        class="p-button-danger results__button"
        :disabled="!hasContent"
        @click="handleClear"
        v-tooltip="'Borrar todos los resultados'"
      />
    </div>
  </div>
</template>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.results__title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.results__container {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
}

.results__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  gap: 1rem;
  color: #6c757d;
}

.results__loading-icon {
  font-size: 2rem;
  color: #2196f3;
}

.results__loading-text {
  font-size: 1.2rem;
}

.results__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  background-color: white;
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  color: #6c757d;
}

.results__empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #90a4ae;
}

.results__empty-text {
  font-size: 1.1rem;
  text-align: center;
  max-width: 300px;
  line-height: 1.5;
}

.results__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.results__card {
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.results__card :deep(.p-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.results__card :deep(.p-card-content) {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.results__card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.results__card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.results__card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.results__card-title {
  font-weight: 600;
  color: #455a64;
}

.results__tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.results__tag--base64 {
  background-color: #e1f5fe;
  color: #01579b;
}

.results__tag--not-base64 {
  background-color: #ffebee;
  color: #b71c1c;
}

.results__section-title {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #455a64;
}

.results__code-block {
  background-color: #f5f7f9;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  flex: 1;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.results__code-block--original {
  border-left: 3px solid #673ab7;
}

.results__code-block--decoded {
  border-left: 3px solid #2196f3;
}

.results__pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
  flex: 1;
}

.results__decoded {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.results__message {
  color: #b71c1c;
  font-style: italic;
  margin-top: 0;
}

.results__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: auto;
  flex-shrink: 0;
  width: 100%;
}

.results__button {
  flex: 1;
  width: 100%;
  transition: transform 0.2s ease;
}

.results__button:not(:disabled):hover {
  transform: translateY(-2px);
}

:deep(.xml-tag) {
  color: #e53935;
  font-weight: 500;
}

:deep(.xml-content) {
  color: #43a047;
}

/* Maximizar área de resultados en pantallas grandes */
@media (min-height: 800px) {
  .results__container {
    height: calc(100vh - 250px);
  }
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  .results__actions {
    flex-direction: column;
  }

  .results__container {
    height: 500px;
  }
}
</style>
