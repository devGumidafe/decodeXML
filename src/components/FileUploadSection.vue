<script setup lang="ts">
import { computed } from 'vue'
import { useFileUpload } from '../composables/useFileUpload'

const emit = defineEmits<{
  'file-selected': [file: File]
  'process-file': [file: File]
  'clear-file': []
}>()

const {
  selectedFile,
  isDragging,
  state,
  handleFileSelect,
  handleDragEnter,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  clearSelectedFile,
} = useFileUpload()

/**
 * Clase computada para el área de drop
 */
const dropAreaClass = computed(() => {
  return {
    'file-upload__drop-area': true,
    'file-upload__drop-area--dragging': isDragging.value,
  }
})

/**
 * Nombre del archivo seleccionado
 */
const selectedFileName = computed(() => {
  return selectedFile.value ? selectedFile.value.name : ''
})

/**
 * Maneja la selección de archivo del input
 */
const onFileSelect = (event: Event): void => {
  if (handleFileSelect(event)) {
    emit('file-selected', selectedFile.value as File)
  }
}

/**
 * Maneja el drop de un archivo
 */
const onFileDrop = (event: DragEvent): void => {
  if (handleDrop(event)) {
    emit('file-selected', selectedFile.value as File)
  }
}

/**
 * Inicia el procesamiento del archivo seleccionado
 */
const processFile = (): void => {
  if (selectedFile.value) {
    emit('process-file', selectedFile.value)
  }
}

/**
 * Elimina el archivo seleccionado
 */
const removeFile = (): void => {
  clearSelectedFile()
  emit('clear-file')
}
</script>

<template>
  <div class="file-upload">
    <h2 class="file-upload__title"><i class="pi pi-upload"></i> Cargar archivo XML</h2>

    <div
      :class="dropAreaClass"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="onFileDrop"
    >
      <i class="pi pi-cloud-upload file-upload__icon"></i>
      <p class="file-upload__text">Arrastra y suelta tu archivo XML aquí</p>
      <p class="file-upload__text">o</p>

      <label class="file-upload__label">
        <i class="pi pi-folder-open"></i> Seleccionar archivo
        <input
          type="file"
          accept=".xml"
          @change="onFileSelect"
          aria-label="Seleccionar archivo XML"
          class="file-upload__input"
        />
      </label>

      <div v-if="selectedFileName" class="file-upload__selected-file">
        <i class="pi pi-file"></i>
        <span class="file-upload__filename">{{ selectedFileName }}</span>
        <button
          class="file-upload__remove-btn"
          @click.stop="removeFile"
          type="button"
          aria-label="Eliminar archivo"
          v-tooltip="'Eliminar archivo seleccionado'"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div v-if="state.status === 'error'" class="file-upload__error">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ state.errorMessage }}</span>
      </div>
    </div>

    <Button
      label="Procesar archivo"
      icon="pi pi-cog"
      class="p-button-primary file-upload__button"
      :disabled="!selectedFile"
      @click="processFile"
    />
  </div>
</template>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
}

.file-upload__title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-upload__drop-area {
  padding: 2rem;
  border: 2px dashed #dce7f1;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-upload__drop-area--dragging {
  border-color: #2196f3;
  background-color: #e3f2fd;
  transform: scale(1.01);
}

.file-upload__icon {
  font-size: 2.5rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.file-upload__text {
  margin: 0.5rem 0;
  color: #495057;
}

.file-upload__label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.file-upload__label:hover {
  background-color: #0b7dda;
  transform: translateY(-2px);
}

.file-upload__label:active {
  transform: translateY(0);
}

.file-upload__input {
  display: none;
}

.file-upload__selected-file {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: #e9ecef;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
  width: 100%;
  max-width: 300px;
  word-break: break-all;
  position: relative;
}

.file-upload__filename {
  max-width: calc(100% - 50px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-upload__remove-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #e0e0e0;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #455a64;
  transition: all 0.2s ease;
  padding: 0;
}

.file-upload__remove-btn:hover {
  background-color: #f44336;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.file-upload__error {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: #ffebee;
  color: #b71c1c;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  width: 100%;
  max-width: 300px;
}

.file-upload__button {
  width: 100%;
  margin-top: 0.5rem;
  transition: transform 0.2s ease;
}

.file-upload__button:not(:disabled):hover {
  transform: translateY(-2px);
}
</style>
