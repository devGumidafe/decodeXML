import { ref, reactive } from 'vue'
import type { FileUploadState } from '@/types/file-upload'

/**
 * Composable para manejar la carga de archivos XML mediante input y drag & drop
 */
export function useFileUpload() {
  const selectedFile = ref<File | null>(null)
  const isDragging = ref<boolean>(false)
  const state = reactive<FileUploadState>({
    status: 'idle',
    errorMessage: ''
  })

  // Constantes para mejorar la mantenibilidad
  const ALLOWED_MIME_TYPES = ['text/xml']
  const ALLOWED_EXTENSIONS = ['.xml']

  /**
   * Valida si un archivo es del tipo permitido (XML)
   */
  const isValidFile = (file: File): boolean => {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    return ALLOWED_MIME_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.some(ext => fileExtension === ext)
  }

  /**
   * Maneja la selección de archivos desde un input
   */
  const handleFileSelect = (event: Event): boolean => {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) {
      return false
    }

    const file = input.files[0]
    if (!isValidFile(file)) {
      state.status = 'error'
      state.errorMessage = 'El archivo debe ser un XML válido'
      return false
    }

    selectedFile.value = file
    state.status = 'ready'
    state.errorMessage = ''
    return true
  }

  /**
   * Maneja el evento de arrastrar un archivo sobre la zona de drop
   */
  const handleDragEnter = (event: DragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
    isDragging.value = true
  }

  /**
   * Maneja el evento de arrastrar un archivo sobre la zona de drop
   */
  const handleDragOver = (event: DragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
    isDragging.value = true
  }

  /**
   * Maneja el evento de salir de la zona de drop
   */
  const handleDragLeave = (event: DragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
    isDragging.value = false
  }

  /**
   * Maneja la suelta del archivo en la zona de drop
   */
  const handleDrop = (event: DragEvent): boolean => {
    event.preventDefault()
    event.stopPropagation()
    isDragging.value = false

    const files = event.dataTransfer?.files
    if (!files || files.length === 0) {
      state.status = 'error'
      state.errorMessage = 'No se seleccionó ningún archivo'
      return false
    }

    const file = files[0]
    if (!isValidFile(file)) {
      state.status = 'error'
      state.errorMessage = 'El archivo debe ser un XML válido'
      return false
    }

    selectedFile.value = file
    state.status = 'ready'
    state.errorMessage = ''
    return true
  }

  /**
   * Limpia el archivo seleccionado y resetea el estado
   */
  const clearSelectedFile = (): void => {
    selectedFile.value = null
    state.status = 'idle'
    state.errorMessage = ''
  }

  return {
    selectedFile,
    isDragging,
    state,
    handleFileSelect,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearSelectedFile,
    isValidFile
  }
}
