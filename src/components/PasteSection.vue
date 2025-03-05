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
    <h2 class="paste__title">
      <span class="paste__title-icon"><i class="pi pi-code"></i></span>
      <span class="paste__title-text">Pegar contenido XML</span>
    </h2>

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
  height: 100%;
}

.paste__title {
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

.paste__title-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

.paste__title:hover .paste__title-icon {
  transform: rotate(-15deg) scale(1.1);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.paste__title-text {
  background: linear-gradient(135deg, #34495e, #2c3e50);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  transition: all 0.3s ease;
}

.paste__title-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #4caf50, transparent);
  transition: width 0.3s ease;
}

.paste__title:hover .paste__title-text::after {
  width: 100%;
}

.paste__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.paste__textarea-wrapper {
  padding: 0;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  height: 100%;
  flex: 1;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 250px;
}

.paste__textarea-wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.paste__textarea-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.paste__textarea {
  width: 100%;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  resize: none;
  min-height: 250px;
  height: 100%;
  font-family: 'Courier New', monospace;
  padding: 1.5rem;
  padding-right: 40px;
  padding-bottom: 0;
  background-color: #f8f9fa;
  background-image: linear-gradient(rgba(76, 175, 80, 0.03) 1px, transparent 1px);
  background-size: 100% 2em;
  background-position: 0 0;
  background-attachment: local;
  overflow-y: auto;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-out;
  outline: none;
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.paste__textarea:focus {
  border-color: #4caf50;
  box-shadow:
    0 0 0 2px rgba(76, 175, 80, 0.2),
    inset 0 1px 3px rgba(0, 0, 0, 0.05);
  background-color: #f1f8e9;
  outline: none;
}

.paste__clear-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.paste__clear-btn:hover {
  background-color: #f44336;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 2px 5px rgba(244, 67, 54, 0.3);
}

.paste__actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.paste__button {
  flex: 1;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  height: 42px;
  position: relative;
  overflow: hidden;
}

.paste__button.p-button-primary {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  border: none;
  box-shadow: 0 1px 3px rgba(76, 175, 80, 0.2);
}

.paste__button.p-button-primary:enabled:hover {
  background: linear-gradient(135deg, #43a047, #1b5e20);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
  transform: none;
}

.paste__button.p-button-primary:enabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.paste__button.p-button-primary:enabled:hover::after {
  opacity: 1;
}

.paste__button--clear {
  background: linear-gradient(135deg, #f44336, #c62828);
  color: white;
  border: none;
  box-shadow: 0 1px 3px rgba(244, 67, 54, 0.2);
}

.paste__button--clear:enabled:hover {
  background: linear-gradient(135deg, #e53935, #b71c1c);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
  transform: none;
}

.paste__button--clear:enabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.paste__button--clear:enabled:hover::after {
  opacity: 1;
}

.paste__button:not(:disabled):active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 576px) {
  .paste__actions {
    flex-direction: column;
  }
}
</style>
