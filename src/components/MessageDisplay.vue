<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  errorMessage: string
  successMessage: string
}

defineProps<Props>()
</script>

<template>
  <div class="message-display">
    <transition name="message-fade" mode="out-in">
      <Message
        v-if="errorMessage"
        severity="error"
        :closable="true"
        class="message-display__item message-display__item--error"
      >
        {{ errorMessage }}
      </Message>
    </transition>

    <transition name="message-fade" mode="out-in">
      <Message
        v-if="successMessage"
        severity="success"
        :closable="true"
        class="message-display__item message-display__item--success"
      >
        {{ successMessage }}
      </Message>
    </transition>
  </div>
</template>

<style scoped>
.message-display {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-display__item {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transform: translateX(0);
}

.message-display__item--error {
  border-left: 4px solid #f44336;
}

.message-display__item--success {
  border-left: 4px solid #4caf50;
}

/* Animaciones */
.message-fade-enter-active,
.message-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
