<template>
  <div v-if="isLoading" class="loader-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { useLoading } from '@/composables/useLoading'
const { isLoading } = useLoading()
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 8px solid #eee;
  border-top: 8px solid yellow;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
