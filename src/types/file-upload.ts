/**
 * Tipos relacionados con la carga de archivos
 */

/**
 * Estados posibles del proceso de carga de archivos
 */
export type FileUploadStatus = 'idle' | 'ready' | 'error'

/**
 * Estado de la carga de archivos
 */
export interface FileUploadState {
    status: FileUploadStatus
    errorMessage: string
}
