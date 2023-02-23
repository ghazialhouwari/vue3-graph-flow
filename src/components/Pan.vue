<script setup lang="ts">
import { ref } from "vue";
import Connector from "@/components/Connector.vue";
import Node from "@/components/Node.vue";
import Controls from "@/components/Controls.vue";
import type { NodeModel, ConnectorModel, Offset } from "@/utils/types";
import { usePan } from "@/composables/pan";

const props = defineProps<{
  nodes: NodeModel[];
  connectors: ConnectorModel[];
}>();
const pan = ref<HTMLElement | null>(null);
const { panRect, offset, scale, zoomIn, zoomOut } = usePan(pan, {
  onScale,
  onPanDrag,
});

function onPanDrag(offset: Offset) {}

function onScale(scaleBy: number) {}

defineExpose({
  zoomIn,
  zoomOut,
});
</script>

<template>
  <div class="surface">
    <div class="pan-wrapper">
      <div
        id="g4-pan"
        ref="pan"
        class="pan"
        :style="{
          transform: `matrix(${scale}, 0, 0, ${scale}, ${offset.x}, ${offset.y})`,
        }"
      >
        <template v-if="pan && panRect">
          <Node
            v-for="node in nodes"
            :key="node.id"
            v-bind="node"
            :pan="pan"
            :panOffset="offset"
            :panScale="scale"
          >
            {{ node.id }}
          </Node>
          <Connector
            v-for="connector in connectors"
            :key="connector.id"
            v-bind="connector"
          />
        </template>
      </div>
      <Controls @zoomIn="zoomIn" @zoomOut="zoomOut" />
    </div>

    <!-- <span class="dot"></span> -->
  </div>
</template>

<style>
.surface {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
.surface::-webkit-scrollbar {
  display: none;
}
.pan-wrapper {
  width: 100%;
  height: 100%;
  background: #10171dee;
}
.pan {
  position: relative;
  width: 2000px;
  height: 2000px;
  background: #10171d;
  overflow: visible;
  cursor: grab;
  will-change: transform;
  border-radius: 8px;
  box-shadow: 5px 5px 5px #1a202c, -5px -5px 5px #1a202ccc;
}
.pan:before {
  content: "";
  background: 0 0 / 80px repeat
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQBAMAAAB8P++eAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAC1QTFRF////////AAAA////////////////////////////////////////////////X1WHLgAAAA90Uk5TOTsABBAIFAw+HxdHQTwR1/xIjAAAAIRJREFUeJxjYBQkDjAowYCyE4ylGgRjqRjBWIqjCkcVDk2FysZQYJoMY5kXw1hmwTCWBYOKCxS4TYGxvJbAWJ4pMJb3kPD1qMJRheQrVA2FgvClMFaIK4wVVQpjxRCvcCj4elThqELyFRJdfRBdIQ0FX48qHJwKdYeAG5EVPsJUqIfwDAAuIeblJ+43FAAAAABJRU5ErkJggg==);
  opacity: 0.4;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.dot {
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 25px;
  height: 25px;
  margin: auto;
  background: #f60;
  border: 2px solid #fff;
  border-radius: 50%;
}
</style>
