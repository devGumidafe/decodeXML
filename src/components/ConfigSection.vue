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
    <h2 class="config__title"><i class="pi pi-cog"></i> Configuración</h2>

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
}

.config__title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
}

.config__help-text {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
  font-size: 0.875rem;
}

/* Transiciones */
.config {
  transition: box-shadow 0.3s ease;
}

.config:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
