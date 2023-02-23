import { ref, onMounted, onUnmounted, nextTick, type Ref } from "vue";
import type { Position } from "@/utils/types";

export function useNode(
  nodeId: string,
  x: number,
  y: number,
  panScale: Ref<number>,
  pan: HTMLElement
) {
  const nodePosition = ref<Position>({ top: y, left: x });
  let down = false;
  let node: HTMLElement;
  let cursorPosition = { x, y };

  function mouseDown(evt: MouseEvent) {
    evt.stopPropagation();

    setCursor(evt);
    down = true;
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
  }

  function mouseUp() {
    down = false;
    // stop moving when mouse button is released:
    removeAllListeners();
  }
  function removeAllListeners() {
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("mousemove", mouseMove);
  }
  function mouseMove(evt: MouseEvent) {
    if (!down || !node) return;

    nodePosition.value = getNewNodePosition(evt);
    setCursor(evt);
  }

  function getNewNodePosition(evt: MouseEvent): Position {
    // calculate the new cursor position:
    const shiftCursor = {
      x: (cursorPosition.x - evt.clientX) / panScale.value,
      y: (cursorPosition.y - evt.clientY) / panScale.value,
    };

    let position: Position = {
      left: node.offsetLeft - shiftCursor.x,
      top: node.offsetTop - shiftCursor.y,
    };

    const newPosition: Position = position;

    // limit the node to pan top and bottom boundaries
    if (position.top <= 0) {
      newPosition.top = 0;
    } else if (position.top + node.offsetHeight >= pan.offsetHeight) {
      newPosition.top = pan.offsetHeight - node.offsetHeight;
    }
    // limit the node to pan left and right boundaries
    if (position.left <= pan.offsetLeft) {
      newPosition.left = 0;
    } else if (position.left + node.offsetWidth >= pan.offsetWidth) {
      newPosition.left = pan.offsetWidth - node.offsetWidth;
    }

    return newPosition;
  }

  function setCursor(evt: MouseEvent) {
    cursorPosition.x = evt.clientX;
    cursorPosition.y = evt.clientY;
  }

  onMounted(() => {
    nextTick(() => {
      const el = document.getElementById(nodeId);
      if (el) {
        node = el;
        node.addEventListener("mousedown", mouseDown);
      }
    });
  });
  onUnmounted(() => {
    node.removeEventListener("mousedown", mouseDown);
    removeAllListeners();
  });

  return { position: nodePosition };
}
