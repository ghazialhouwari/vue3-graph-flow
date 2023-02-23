<script lang="ts" setup>
import { ref } from "vue";
import { useConnector } from "../composables/connector";

const props = defineProps<{
  id: number;
  sourceId: number;
  targetId: number;
}>();

const stroke = ref(3);
const strokeColor = ref("#63b3ed");

const { path, svgRect, arrowPath } = useConnector(
  props.sourceId,
  props.targetId
);
</script>

<template>
  <svg
    :width="svgRect.width + stroke"
    :height="svgRect.height + stroke"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    class="connector"
    :style="{
      top: svgRect.top,
      left: svgRect.left,
    }"
  >
    <path
      :d="path"
      :transform="`translate(0, ${stroke / 2})`"
      pointer-events="visibleStroke"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      :stroke="strokeColor"
      :stroke-width="stroke"
      stroke-linejoin="round"
    ></path>
    <path
      pointer-events="all"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      :d="arrowPath"
      :stroke="strokeColor"
      :fill="strokeColor"
      stroke-linejoin="round"
      transform="translate(5,4.5)"
    ></path>
  </svg>
</template>

<style>
.connector {
  position: absolute;
  pointer-events: none;
  z-index: 5;
}
</style>
