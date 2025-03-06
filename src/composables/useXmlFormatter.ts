/**
 * Composable para manejar el formateo de XML con colores y estructura
 */

/**
 * Formatea el XML con colores para etiquetas y contenido
 * @param text El XML en texto plano
 * @returns HTML formateado con clases para colorear
 */
export const useXmlFormatter = () => {
  /**
   * Escapa los caracteres especiales en el XML para evitar XSS
   */
  const escapeXml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * Formatea el XML con colores y estructura
   */
  const formatXml = (text: string): string => {
    if (!text) return ''

    // Escapar primero para evitar XSS
    const escaped = escapeXml(text)

    // Algoritmo para procesar XML línea por línea
    let formatted = ''
    let depth = 0
    let position = 0
    let chunk = ''
    let inTag = false

    // Función para procesar un trozo de texto
    const processChunk = (): void => {
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
        const tagEnd = escaped.indexOf('&gt;', position)
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

  return {
    formatXml,
    escapeXml,
  }
}
