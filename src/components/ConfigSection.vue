<script setup lang="ts">
interface Props {
  tagName: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:tag-name': [value: string]
  reset: []
}>()

/**
 * Actualiza el nombre de la etiqueta y emite el evento
 */
const updateTagName = (event: Event): void => {
  const input = event.target as HTMLInputElement
  emit('update:tag-name', input.value)
}

/**
 * Resetea el nombre de la etiqueta al valor por defecto
 */
const handleReset = (): void => {
  emit('reset')
}
</script>

<template>
  <div class="config">
    <h2 class="config__title">
      <span class="config__title-icon"><i class="pi pi-cog"></i></span>
      <span class="config__title-text">Configuración</span>
    </h2>

    <div class="config__form">
      <div class="config__form-group">
        <label for="tagName" class="config__label">Nombre de la etiqueta a buscar:</label>

        <div class="config__input-group">
          <InputText
            id="tagName"
            :value="tagName"
            @input="updateTagName"
            placeholder="Nombre de la etiqueta"
            aria-label="Nombre de la etiqueta"
            class="config__input"
          />
          <Button
            icon="pi pi-undo"
            @click="handleReset"
            class="p-button-sm p-button-secondary config__reset-button"
            title="Restablecer a valor por defecto"
            aria-label="Restablecer a valor por defecto"
          />
        </div>

        <small class="config__help-text">Por defecto: "contenido"</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.config:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.config__title {
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

.config__title-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #42b3e5, #2980b9);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.config__title-text {
  background: linear-gradient(135deg, #34495e, #2c3e50);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  transition: all 0.3s ease;
}

.config__title-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #42b3e5, transparent);
  transition: width 0.3s ease;
}

.config__title:hover .config__title-text::after {
  width: 100%;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(41, 128, 185, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(41, 128, 185, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(41, 128, 185, 0);
  }
}

.config__form-group {
  margin-bottom: 0.5rem;
}

.config__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.config__input-group {
  display: flex;
  gap: 0.5rem;
}

.config__input {
  flex: 1;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.config__input:focus {
  border-color: #42b3e5;
  box-shadow: 0 0 0 2px rgba(66, 179, 229, 0.2);
}

.config__reset-button {
  transition: all 0.3s ease;
}

.config__reset-button:hover {
  transform: rotate(45deg);
}

.config__help-text {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
  font-size: 0.875rem;
  transition: opacity 0.3s ease;
}

.config__input:focus + .config__help-text {
  opacity: 0.7;
}
</style>
