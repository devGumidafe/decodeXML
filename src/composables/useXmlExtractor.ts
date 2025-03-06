import { ref } from 'vue'
import type { DecodedResult } from '@/types/xml-decoder'

/**
 * Composable para extraer contenido específico de XML
 */
export const useXmlExtractor = () => {
  const copyStatus = ref<'idle' | 'success' | 'error'>('idle')
  const copyMessage = ref<string>('')

  /**
   * Resetea el estado de copia después de un tiempo
   */
  const resetCopyStatus = (delay = 3000): void => {
    setTimeout(() => {
      copyStatus.value = 'idle'
      copyMessage.value = ''
    }, delay)
  }

  /**
   * Da formato legible a una cadena XML
   */
  const prettyFormatXml = (xml: string): string => {
    // Remover espacios en blanco iniciales/finales
    let formatted = xml.trim()

    // Asegurarse de que todas las etiquetas de cierre tengan un salto de línea
    formatted = formatted.replace(/>\s*</g, '>\n<')

    // Aplicar indentación
    let depth = 0
    const lines = formatted.split('\n')
    formatted = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Reducir nivel de indentación para etiquetas de cierre
      if (line.match(/^<\//) && depth > 0) {
        depth--
      }

      // Añadir la línea con indentación
      formatted += '  '.repeat(depth) + line + '\n'

      // Aumentar nivel para etiquetas de apertura que no se cierran en la misma línea
      if (line.match(/^<[^\/](?!.*?\/\s*>)/) && !line.includes('</')) {
        depth++
      }
    }

    return formatted
  }

  /**
   * Extrae el elemento webFormData completo incluyendo etiquetas y lo formatea
   */
  const extractWebFormData = (results: DecodedResult[]): string => {
    for (const result of results) {
      if (result.isBase64 && result.decodedText) {
        // Buscar el elemento webFormData completo
        const regex = /(<webformData[\s\S]*?<\/webformData>)/g
        const match = regex.exec(result.decodedText)

        if (match && match[1]) {
          // Aplicar formato al XML antes de devolverlo
          return prettyFormatXml(match[1])
        }
      }
    }

    return ''
  }

  /**
   * Copia contenido al portapapeles con manejo de estado
   */
  const copyToClipboard = async (content: string): Promise<boolean> => {
    if (!content) {
      copyStatus.value = 'error'
      copyMessage.value = 'No hay contenido XML para copiar'
      resetCopyStatus()
      return false
    }

    try {
      await navigator.clipboard.writeText(content)
      copyStatus.value = 'success'
      copyMessage.value = 'XML copiado al portapapeles'
      resetCopyStatus()
      return true
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error)
      copyStatus.value = 'error'
      copyMessage.value = 'Error al copiar el XML al portapapeles'
      resetCopyStatus()
      return false
    }
  }

  return {
    extractWebFormData,
    copyToClipboard,
    copyStatus,
    copyMessage,
  }
}
