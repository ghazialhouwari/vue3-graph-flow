<script lang="ts" setup>
import { toRef } from "vue";
import { useNode } from "../composables/node";

const props = defineProps<{
  id: number;
  x: number;
  y: number;
  panScale: number;
  pan: HTMLElement;
}>();

const panScale = toRef(props, "panScale");

const { position } = useNode(
  `node-${props.id}`,
  props.x,
  props.y,
  panScale,
  props.pan
);
</script>

<template>
  <div
    :id="`node-${id}`"
    class="node"
    :style="{
      top: `${position.top}px`,
      left: `${position.left}px`,
    }"
  >
    <!-- transform: `translate(${position.left}px, ${position.top}px)`, -->
    <slot></slot>
    <br />
    {{ position.top.toFixed(2) }}, {{ position.left.toFixed(2) }}
  </div>
</template>

<style>
.node {
  width: 150px;
  height: 150px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  border: 2px solid #cbd5e0;
  color: #1a202c;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: move;
  position: absolute;
  z-index: 10;
  /* top: 0;
  left: 0; */
  will-change: top, left;
}
#node-2 {
  height: 200px;
}
.node:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  margin: auto 0;
  transform: translateX(50%);
  background: #71c7ef;
  border: 2px solid #fff;
  border-radius: 50%;
}
</style>
