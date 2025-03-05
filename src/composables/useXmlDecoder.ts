import { ref, computed } from 'vue'
import type { DecodedResult } from '@/types/xml-decoder'

/**
 * Composable para decodificar contenido XML con etiquetas Base64
 */
export function useXmlDecoder() {
  // Estado
  const tagName = ref<string>('contenido')
  const xmlContent = ref<string>('')
  const results = ref<DecodedResult[]>([])
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')
  const successMessage = ref<string>('')

  // Valores computados
  const hasResults = computed<boolean>(() => results.value.length > 0)

  // Constantes
  const DEFAULT_NOTIFICATION_TIMEOUT = 5000

  /**
   * Resetea el nombre de la etiqueta a buscar
   */
  const resetTagName = (): void => {
    tagName.value = 'contenido'
  }

  /**
   * Limpia todos los resultados y mensajes
   */
  const clearResults = (): void => {
    results.value = []
    xmlContent.value = ''
    errorMessage.value = ''
    successMessage.value = ''
  }

  /**
   * Muestra un mensaje de error temporal
   */
  const showError = (message: string, timeout: number = DEFAULT_NOTIFICATION_TIMEOUT): void => {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = ''
    }, timeout)
  }

  /**
   * Muestra un mensaje de éxito temporal
   */
  const showSuccess = (
    message: string = 'Procesamiento completado con éxito',
    timeout: number = DEFAULT_NOTIFICATION_TIMEOUT,
  ): void => {
    successMessage.value = message
    setTimeout(() => {
      successMessage.value = ''
    }, timeout)
  }

  /**
   * Decodifica una cadena Base64 a UTF-8
   */
  const decodeBase64UTF8 = (base64: string): string => {
    if (!base64 || typeof base64 !== 'string') {
      return ''
    }

    try {
      // Decodificar de base64 a binario
      const binaryString = window.atob(base64)

      // Convertir a UTF-8
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Convertir UTF-8 a string
      return new TextDecoder().decode(bytes)
    } catch (error) {
      console.error('Error al decodificar Base64:', error)
      return ''
    }
  }

  /**
   * Verifica si una cadena es Base64 válido
   */
  const isBase64 = (str: string): boolean => {
    if (!str || typeof str !== 'string') return false

    // Comprobar si la longitud es múltiplo de 4 (característica de Base64)
    if (str.length % 4 !== 0) return false

    // Comprobar si solo contiene caracteres válidos de Base64
    const validBase64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!validBase64Regex.test(str)) return false

    try {
      return btoa(atob(str)) === str
    } catch (err) {
      return false
    }
  }

  /**
   * Formatea una cadena XML para mejor legibilidad
   */
  const formatXml = (xml: string): string => {
    if (!xml || typeof xml !== 'string') return ''

    let formatted = ''
    let indent = ''

    /**
     * Procesa recursivamente los nodos del XML
     */
    const processNode = (node: Node, currentIndent: string): void => {
      // Elemento normal
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        const nodeName = element.nodeName

        // Agregar apertura de etiqueta
        formatted += `${currentIndent}<${nodeName}`

        // Procesar atributos
        Array.from(element.attributes).forEach((attr) => {
          formatted += ` ${attr.name}="${attr.value}"`
        })

        // Verificar si tiene hijos
        if (element.childNodes.length === 0) {
          formatted += '/>\n'
        } else {
          formatted += '>\n'

          // Procesar nodos hijos
          Array.from(element.childNodes).forEach((childNode) => {
            processNode(childNode, currentIndent + '  ')
          })

          // Cerrar etiqueta
          formatted += `${currentIndent}</${nodeName}>\n`
        }
      }
      // Nodo de texto
      else if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent?.trim()
        if (textContent) {
          formatted += `${currentIndent}${textContent}\n`
        }
      }
    }

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, 'text/xml')

      // Verificar errores de parsing
      const parseError = xmlDoc.querySelector('parsererror')
      if (parseError) {
        throw new Error('El documento XML no es válido.')
      }

      // Procesar el documento
      processNode(xmlDoc.documentElement, indent)

      return formatted
    } catch (error) {
      console.error('Error al formatear XML:', error)
      return xml
    }
  }

  /**
   * Procesa el contenido XML para encontrar y decodificar etiquetas Base64
   */
  const processXml = async (): Promise<void> => {
    if (!xmlContent.value.trim()) {
      showError('Por favor ingresa contenido XML para procesar.')
      return
    }

    isLoading.value = true
    results.value = []
    errorMessage.value = ''

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlContent.value, 'text/xml')

      // Verificar si hay errores de parsing
      const parseError = xmlDoc.querySelector('parsererror')
      if (parseError) {
        throw new Error('El documento XML no es válido.')
      }

      // Buscar etiquetas con el tagName especificado
      const tags = xmlDoc.getElementsByTagName(tagName.value)

      if (tags.length === 0) {
        showError(`No se encontraron etiquetas <${tagName.value}> en el XML.`)
        return
      }

      // Procesar cada etiqueta encontrada
      Array.from(tags).forEach((tag) => {
        const content = tag.textContent || ''
        const isBase64Content = isBase64(content)

        results.value.push({
          tagName: tagName.value,
          originalBase64: content,
          decodedText: isBase64Content ? decodeBase64UTF8(content) : '',
          isBase64: isBase64Content,
        })
      })

      if (results.value.length > 0) {
        showSuccess()
      }
    } catch (error) {
      console.error('Error al procesar XML:', error)
      showError(
        `Error al procesar el XML: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      )
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Genera un archivo XML con los resultados
   */
  const exportToXml = (): string => {
    if (results.value.length === 0) {
      return ''
    }

    let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n<resultados>\n'

    results.value.forEach((result, index) => {
      xmlOutput += `  <resultado indice="${index + 1}">\n`
      xmlOutput += `    <${result.tagName}>${result.originalBase64}</${result.tagName}>\n`

      if (result.isBase64) {
        xmlOutput += `    <contenidoDecodificado>\n`
        xmlOutput += `      ${formatXml(result.decodedText)
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => '      ' + line)
          .join('\n')}\n`
        xmlOutput += `    </contenidoDecodificado>\n`
      }

      xmlOutput += `  </resultado>\n`
    })

    xmlOutput += '</resultados>'
    return xmlOutput
  }

  /**
   * Descarga los resultados como un archivo XML
   */
  const downloadXml = (): void => {
    const xmlOutput = exportToXml()

    if (!xmlOutput) {
      showError('No hay contenido para exportar.')
      return
    }

    // Crear blob y generar descarga
    const blob = new Blob([xmlOutput], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const filename = `contenido_decodificado_${new Date().toISOString().slice(0, 10)}.xml`

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    // Limpiar recursos
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  }

  /**
   * Copia texto al portapapeles
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!text) return false

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err)
      return false
    }
  }

  /**
   * Copia todo el contenido XML al portapapeles
   */
  const copyAllText = async (): Promise<void> => {
    const xmlOutput = exportToXml()

    if (!xmlOutput) {
      showError('No hay contenido para copiar.')
      return
    }

    const success = await copyToClipboard(xmlOutput)

    if (success) {
      showSuccess('Contenido copiado al portapapeles.')
    } else {
      showError('Error al copiar al portapapeles.')
    }
  }

  /**
   * Procesa un archivo XML
   */
  const processFile = (file: File): void => {
    if (!file) {
      showError('No se ha seleccionado ningún archivo.')
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      if (!content) {
        showError('No se pudo leer el contenido del archivo.')
        return
      }

      xmlContent.value = content
      processXml()
    }

    reader.onerror = () => {
      showError('Error al leer el archivo.')
    }

    reader.readAsText(file)
  }

  return {
    // Estado
    tagName,
    xmlContent,
    results,
    isLoading,
    hasResults,
    errorMessage,
    successMessage,
    // Métodos
    resetTagName,
    clearResults,
    processXml,
    processFile,
    downloadXml,
    copyAllText,
    formatXml,
    isBase64,
    copyToClipboard,
  }
}
