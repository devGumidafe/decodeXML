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

  // Nuevo algoritmo para procesar XML línea por línea
  let formatted = ''
  let depth = 0
  let position = 0
  let chunk = ''
  let inTag = false
  let tagContent = ''

  // Función para procesar un trozo de texto
  const processChunk = () => {
    if (!chunk) return
    if (inTag) {
      // Es una etiqueta
      formatted += `<span class="xml-tag">${chunk}</span>`
      inTag = false
    } else if (chunk.trim()) {
      // Es contenido con texto
      formatted += `<span class="xml-content">${chunk}</span>`
    }
    chunk = ''
  }

  while (position < escaped.length) {
    // Comienza una etiqueta
    if (escaped.substring(position, position + 4) === '&lt;') {
      // Procesar cualquier contenido anterior
      processChunk()

      inTag = true
      chunk = '&lt;'
      position += 4

      // Buscar el final de la etiqueta
      let tagEnd = escaped.indexOf('&gt;', position)
      if (tagEnd !== -1) {
        chunk += escaped.substring(position, tagEnd + 4)
        position = tagEnd + 4

        // Detectar si es etiqueta de apertura o cierre
        const isClosingTag = chunk.includes('&lt;/')
        const isSelfClosingTag = chunk.includes('/&gt;')

        // Ajustar la indentación
        if (isClosingTag) {
          depth = Math.max(0, depth - 1)
        }

        // Añadir indentación
        const indentation = '  '.repeat(depth)
        formatted += indentation

        // Procesar la etiqueta
        processChunk()
        formatted += '<br>'

        // Incrementar profundidad para etiquetas de apertura
        if (!isClosingTag && !isSelfClosingTag) {
          depth++
        }
      } else {
        // No se encontró el cierre, tratar como texto normal
        chunk += escaped.substring(position)
        position = escaped.length
        processChunk()
      }
    } else {
      // Contenido normal
      const nextTagStart = escaped.indexOf('&lt;', position)
      if (nextTagStart !== -1) {
        chunk += escaped.substring(position, nextTagStart)
        position = nextTagStart

        // Si hay contenido significativo, indentarlo
        if (chunk.trim()) {
          const indentation = '  '.repeat(depth)
          formatted += indentation
          processChunk()
          formatted += '<br>'
        } else {
          chunk = ''
        }
      } else {
        // No hay más etiquetas
        chunk += escaped.substring(position)
        position = escaped.length

        // Si hay contenido significativo, indentarlo
        if (chunk.trim()) {
          const indentation = '  '.repeat(depth)
          formatted += indentation
          processChunk()
        } else {
          chunk = ''
        }
      }
    }
  }

  return formatted
}
</script>

<template>
  <div class="results">
    <h2 class="results__title">
      <span class="results__title-icon"><i class="pi pi-code"></i></span>
      <span class="results__title-text">Contenido Decodificado</span>
    </h2>

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
  transition: box-shadow 0.3s ease;
}

.results:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.results__title-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #9575cd, #673ab7);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

.results__title:hover .results__title-icon {
  transform: rotate(-15deg) scale(1.1);
  box-shadow: 0 4px 8px rgba(103, 58, 183, 0.3);
}

.results__title-text {
  background: linear-gradient(135deg, #34495e, #2c3e50);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  transition: all 0.3s ease;
}

.results__title-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #9575cd, transparent);
  transition: width 0.3s ease;
}

.results__title:hover .results__title-text::after {
  width: 100%;
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
  transition: all 0.3s ease;
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
  animation: fadeIn 0.5s ease-out;
}

.results__loading-icon {
  font-size: 2rem;
  color: #9575cd;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.results__loading-text {
  font-size: 1.2rem;
  background: linear-gradient(135deg, #9575cd, #673ab7);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results__empty:hover {
  border-color: #9575cd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.results__empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #9575cd;
  transition: all 0.3s ease;
}

.results__empty:hover .results__empty-icon {
  transform: scale(1.1);
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
  animation: fadeIn 0.5s ease-out;
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
  transition: all 0.3s ease;
}

.results__tag--base64 {
  background-color: #e1f5fe;
  color: #01579b;
}

.results__tag--base64:hover {
  background-color: #b3e5fc;
  transform: translateY(-1px);
}

.results__tag--not-base64 {
  background-color: #ffebee;
  color: #b71c1c;
}

.results__tag--not-base64:hover {
  background-color: #ffcdd2;
  transform: translateY(-1px);
}

.results__section-title {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #455a64;
  transition: all 0.3s ease;
}

.results__section-title:hover {
  color: #263238;
}

.results__section-title i {
  color: #9575cd;
  transition: all 0.3s ease;
}

.results__section-title:hover i {
  transform: rotate(-15deg);
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
  transition: all 0.3s ease;
}

.results__code-block--original {
  border-left: 3px solid #673ab7;
}

.results__code-block--original:hover {
  border-left-width: 5px;
  box-shadow: inset 0 0 10px rgba(103, 58, 183, 0.1);
}

.results__code-block--decoded {
  border-left: 3px solid #2196f3;
}

.results__code-block--decoded:hover {
  border-left-width: 5px;
  box-shadow: inset 0 0 10px rgba(33, 150, 243, 0.1);
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  height: 42px;
}

.results__button:not(:disabled):hover {
  transform: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.results__button:not(:disabled):active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.results__button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.results__button:not(:disabled):hover::after {
  opacity: 1;
}

.results__button.p-button-primary {
  background: linear-gradient(135deg, #9575cd, #673ab7);
  border: none;
  box-shadow: 0 1px 3px rgba(103, 58, 183, 0.2);
}

.results__button.p-button-primary:enabled:hover {
  background: linear-gradient(135deg, #8465bb, #5e35b1);
  box-shadow: 0 4px 8px rgba(103, 58, 183, 0.3);
}

.results__button.p-button-secondary {
  background: linear-gradient(135deg, #64b5f6, #2196f3);
  border: none;
  box-shadow: 0 1px 3px rgba(33, 150, 243, 0.2);
}

.results__button.p-button-secondary:enabled:hover {
  background: linear-gradient(135deg, #42a5f5, #1e88e5);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.results__button.p-button-danger {
  background: linear-gradient(135deg, #f44336, #c62828);
  border: none;
  box-shadow: 0 1px 3px rgba(244, 67, 54, 0.2);
}

.results__button.p-button-danger:enabled:hover {
  background: linear-gradient(135deg, #e53935, #b71c1c);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
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
