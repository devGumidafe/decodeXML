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
    <h2 class="file-upload__title">
      <span class="file-upload__title-icon"><i class="pi pi-upload"></i></span>
      <span class="file-upload__title-text">Cargar archivo XML</span>
    </h2>

    <div
      :class="dropAreaClass"
      @dragenter="handleDragEnter"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="onFileDrop"
    >
      <template v-if="!selectedFile">
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
      </template>

      <div v-else class="file-upload__selected-file">
        <div class="file-upload__file-info">
          <i class="pi pi-file file-upload__file-icon"></i>
          <span class="file-upload__filename">{{ selectedFileName }}</span>
        </div>
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
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.file-upload__title-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.file-upload__title-text {
  background: linear-gradient(135deg, #34495e, #2c3e50);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  transition: all 0.3s ease;
}

.file-upload__title-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3498db, transparent);
  transition: width 0.3s ease;
}

.file-upload__title:hover .file-upload__title-text::after {
  width: 100%;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
}

.file-upload__drop-area {
  padding: 2rem;
  border: 2px dashed #dce7f1;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.file-upload__drop-area--dragging {
  border-color: #2196f3;
  background-color: #e3f2fd;
  transform: scale(1.01);
}

.file-upload__icon {
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.file-upload__text {
  margin: 0.5rem 0;
  color: #495057;
}

.file-upload__label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-upload__label:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.file-upload__label:active {
  transform: translateY(0);
}

.file-upload__input {
  display: none;
}

.file-upload__selected-file {
  width: 90%;
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  position: relative;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
  transition: all 0.3s ease;
  animation: fadeIn 0.4s ease-out;
  overflow: hidden; /* Contener desbordamientos */
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

.file-upload__selected-file:hover {
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.25);
  transform: translateY(-2px);
}

.file-upload__file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem;
}

.file-upload__file-icon {
  font-size: 2.5rem;
  color: #2196f3;
  animation: pulse 2s infinite;
}

.file-upload__filename {
  font-size: 1.1rem;
  font-weight: 500;
  color: #455a64;
  text-align: center;
  max-width: 100%;
  padding: 0 0.5rem;
  white-space: normal; /* Permitir varias líneas */
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.file-upload__remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #455a64;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-upload__remove-btn:hover {
  background-color: #f44336;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(244, 67, 54, 0.3);
}

.file-upload__error {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #ffebee;
  color: #b71c1c;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  width: 100%;
  max-width: 350px;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.file-upload__button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
  width: 100%;
  height: 42px; /* Altura estándar para igualar con PasteSection */
}

.file-upload__button:enabled:hover {
  background: linear-gradient(135deg, #2980b9, #1a5276);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
