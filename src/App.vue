<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import Pan from "@/components/Pan.vue";
import type { NodeModel, ConnectorModel } from "@/utils/types";
import flow from "@/data/flow";

const nodes = reactive<NodeModel[]>(flow.nodes);
const connectors = reactive<ConnectorModel[]>(flow.connectors);
</script>

<template>
  <Pan :nodes="nodes" :connectors="connectors"></Pan>
</template>
