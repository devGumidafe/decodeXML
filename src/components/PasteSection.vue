<script setup lang="ts">
interface Props {
  content?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:content': [value: string]
  process: [value: string]
  clear: []
}>()

/**
 * Actualiza el contenido del textarea
 */
const updateContent = (event: Event): void => {
  const textarea = event.target as HTMLTextAreaElement
  emit('update:content', textarea.value)
}

/**
 * Procesa el contenido XML
 */
const processContent = (): void => {
  emit('process', props.content || '')
}

/**
 * Limpia el contenido insertado
 */
const clearContent = (): void => {
  emit('clear')
}
</script>

<template>
  <div class="paste">
    <h2 class="paste__title"><i class="pi pi-code"></i> Pegar contenido XML</h2>

    <div class="paste__container">
      <div class="paste__textarea-wrapper">
        <div class="paste__textarea-container">
          <Textarea
            :value="content"
            @input="updateContent"
            rows="10"
            placeholder="Pega aquí el contenido XML"
            aria-label="Contenido XML"
            class="paste__textarea"
          />
          <button
            v-if="content"
            class="paste__clear-btn"
            @click="clearContent"
            type="button"
            aria-label="Limpiar contenido"
            v-tooltip="'Borrar todo el contenido'"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>

      <div class="paste__actions">
        <Button
          label="Procesar XML"
          icon="pi pi-code"
          class="p-button-primary paste__button"
          :disabled="!content"
          @click="processContent"
          v-tooltip="'Procesar el contenido XML pegado'"
        />

        <Button
          label="Limpiar"
          icon="pi pi-trash"
          class="p-button-danger paste__button paste__button--clear"
          :disabled="!content"
          @click="clearContent"
          v-tooltip="'Borrar todo el contenido'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.paste {
  display: flex;
  flex-direction: column;
}

.paste__title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.paste__container {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.paste__textarea-wrapper {
  padding: 0;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  height: 100%;
}

.paste__textarea-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.paste__textarea {
  width: 100%;
  border: 1px solid #dce7f1;
  border-radius: 8px;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  resize: none;
  min-height: 265px;
  font-family: 'Courier New', monospace;
  padding: 1.5rem;
  padding-right: 40px;
  background-color: #f8f9fa;
  opacity: 0.9;
  cursor: default;
}

.paste__textarea:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  background-color: #e3f2fd;
}

.paste__clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #455a64;
  transition: all 0.2s ease;
  z-index: 2;
  padding: 0;
}

.paste__clear-btn:hover {
  background-color: #f44336;
  color: white;
  transform: scale(1.1);
}

.paste__actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.paste__button {
  flex: 1;
  transition: transform 0.2s ease;
  width: 100%;
}

.paste__button--clear {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
}

.paste__button--clear:hover:not(:disabled) {
  background-color: #d32f2f;
  border-color: #d32f2f;
}

.paste__button:not(:disabled):hover {
  transform: translateY(-2px);
}

.paste__button:not(:disabled):active {
  transform: translateY(0);
}

@media (max-width: 576px) {
  .paste__actions {
    flex-direction: column;
  }
}
</style>
