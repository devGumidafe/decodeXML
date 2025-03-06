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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 1;
  transform: translateX(0);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.message-display__item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.message-display__item--error {
  border-left: 4px solid #f44336;
  background: linear-gradient(to right, rgba(244, 67, 54, 0.1), transparent 30%);
}

.message-display__item--success {
  border-left: 4px solid #4caf50;
  background: linear-gradient(to right, rgba(76, 175, 80, 0.1), transparent 30%);
}

.message-display :deep(.p-message-wrapper) {
  padding: 1rem;
}

.message-display :deep(.p-message-icon) {
  transition: transform 0.3s ease;
}

.message-display__item:hover :deep(.p-message-icon) {
  transform: scale(1.2);
}

.message-display :deep(.p-message-close) {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.message-display :deep(.p-message-close:hover) {
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 1;
  transform: rotate(90deg);
}

.message-fade-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.message-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

.message-display__item--error:hover {
  animation: shake 0.5s ease-in-out;
}
</style>
