/**
 * Tipos relacionados con el decodificador XML
 */

/**
 * Representa un resultado de decodificación de contenido base64 en XML
 */
export interface DecodedResult {
    tagName: string
    originalBase64: string
    decodedText: string
    isBase64: boolean
}

/**
 * Estados posibles del proceso de decodificación XML
 */
export type XmlProcessStatus = 'idle' | 'processing' | 'success' | 'error'

/**
 * Tipos de notificación disponibles
 */
export type NotificationType = 'success' | 'error' | 'info' | 'none'

/**
 * Estructura de una notificación
 */
export interface Notification {
    type: NotificationType
    message: string
    timeout?: number
}
