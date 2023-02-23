<script lang="ts" setup>
defineEmits(["zoomIn", "zoomOut"]);
</script>

<template>
  <div class="controls">
    <button @click="$emit('zoomIn')" class="btn zoom-in">+</button>
    <button @click="$emit('zoomOut')" class="btn">-</button>
  </div>
</template>

<style>
.controls {
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px;
  margin: 20px;
  border-radius: 6px;
}
.btn {
  background: none;
  border: 1px solid #ccc;
  font-size: 25px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
}
.zoom-in {
  margin-right: 6px;
}
</style>
