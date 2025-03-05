# Decodificador XML Base64

Una aplicación web moderna construida con Vue 3 y TypeScript para decodificar contenido XML en Base64.

## Características

- Interfaz de usuario moderna y responsiva con PrimeVue
- Carga de archivos XML mediante arrastrar y soltar
- Pegar contenido XML directamente
- Decodificación automática de contenido Base64 dentro de etiquetas XML específicas
- Exportación de resultados como XML
- Copiado fácil al portapapeles

## Tecnologías utilizadas

- Vue 3
- TypeScript
- Composition API
- PrimeVue (componentes UI)
- CSS moderno con variables

## Requisitos

- Node 20.11.0 o superior
- npm 10.9.0 o superior

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Uso

1. Configura el nombre de la etiqueta a buscar (por defecto: "contenido")
2. Carga un archivo XML o pega el contenido XML en el área designada
3. Haz clic en "Procesar archivo" o "Procesar XML pegado"
4. Visualiza los resultados decodificados
5. Exporta los resultados o cópialos al portapapeles

## Estructura del proyecto

```
src/
  ├── assets/                 # Recursos estáticos (CSS, imágenes)
  ├── components/             # Componentes Vue
  │   ├── ConfigSection.vue   # Configuración de etiquetas
  │   ├── FileUploadSection.vue # Carga de archivos
  │   ├── MessageDisplay.vue  # Mensajes de error/éxito
  │   ├── PasteSection.vue    # Sección para pegar XML
  │   └── ResultSection.vue   # Visualización de resultados
  ├── composables/            # Lógica reutilizable (Composition API)
  │   ├── useFileUpload.ts    # Manejo de carga de archivos
  │   └── useXmlDecoder.ts    # Lógica de decodificación XML
  ├── App.vue                 # Componente principal
  └── main.ts                 # Punto de entrada
```

## Licencia

MIT
