<template>
  <transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      {{ message }}
      <button @click="close">×</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "info", // info, success, error, warning
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const visible = ref(false);
let timeoutId = null;

function close() {
  visible.value = false;
  clearTimeout(timeoutId);
}

watch(
  () => props.message,
  (newMsg) => {
    if (newMsg) {
      visible.value = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  }
);

onMounted(() => {
  if (props.message) {
    visible.value = true;
    timeoutId = setTimeout(() => {
      visible.value = false;
    }, props.duration);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}
.toast button {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
}

.toast.info {
  background-color: #2196f3;
}

.toast.success {
  background-color: #4caf50;
}

.toast.error {
  background-color: #f44336;
}

.toast.warning {
  background-color: #ff9800;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
