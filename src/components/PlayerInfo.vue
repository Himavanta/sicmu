<template>
  <div :class="$style.info">
    <h2 :class="$style.title">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style module lang="scss">
.info {
  min-width: 0;
}

.title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
