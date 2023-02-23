import { onMounted, onUnmounted, ref, nextTick, type Ref } from "vue";
import type { Offset, PanCallback, Rect } from "@/utils/types";
import { getNewPanOffset } from "@/utils/utils";

export function usePan(pan: Ref<HTMLElement | null>, callbacks: PanCallback) {
  const panRect = ref<Rect>();
  const scale = ref(1);
  const step = 0.95;
  const originOffsetCenter = ref<Offset>();
  const offset = ref<Offset>({ x: 0, y: 0 });
  let mouseIsDown = false;

  function mouseDown(evt: MouseEvent) {
    mouseIsDown = true;
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
  }

  function mouseUp() {
    mouseIsDown = false;
    // stop moving when mouse button is released:
    removePanDragListeners();
  }

  function mouseMove(evt: MouseEvent) {
    if (!mouseIsDown || !panRect.value || !offset.value || !pan.value) return;
    const newOffset = getNewPanOffset(
      evt.movementX,
      evt.movementY,
      offset.value,
      pan.value
    );
    updatePanOffset(newOffset);
  }

  function removePanDragListeners() {
    document.removeEventListener("mouseup", mouseUp);
    document.removeEventListener("mousemove", mouseMove);
  }

  function updatePanOffset(newOffset: Offset) {
    offset.value = newOffset;
    callbacks.onPanDrag(offset.value);
  }

  const updateOffset = (scaleBy: number) => {
    if (!originOffsetCenter.value || !panRect.value) return;

    const currentOffsetCenter = {
      x: panRect.value.left + panRect.value.width / 2,
      y: panRect.value.top + panRect.value.height / 2,
    };

    // Get the distance between window center offset to the current center offset of the pan
    const windowCenterOffsetDistance = {
      x: window.innerWidth / 2 - currentOffsetCenter.x,
      y: window.innerHeight / 2 - currentOffsetCenter.y,
    };

    const newOffsetCenter = {
      x: currentOffsetCenter.x + windowCenterOffsetDistance.x * (1 - scaleBy),
      y: currentOffsetCenter.y + windowCenterOffsetDistance.y * (1 - scaleBy),
    };

    offset.value.x = newOffsetCenter.x - originOffsetCenter.value.x;
    offset.value.y = newOffsetCenter.y - originOffsetCenter.value.y;
  };

  const setOffsetCenter = () => {
    if (!panRect.value) return;

    originOffsetCenter.value = {
      x: panRect.value.left + panRect.value.width / 2,
      y: panRect.value.top + panRect.value.height / 2,
    };
  };

  const updateRect = () => {
    if (pan.value) {
      panRect.value = pan.value.getBoundingClientRect();
    }
  };

  const zoom = (scaleBy: number) => {
    scale.value *= scaleBy;
    nextTick(() => {
      updateRect();
      updateOffset(scaleBy);
    });

    callbacks.onScale(scaleBy);
  };

  const zoomIn = () => {
    const scaleBy = Math.pow(step, -1);
    if (scale.value * scaleBy < 1) {
      zoom(scaleBy);
    }
  };
  const zoomOut = () => {
    const scaleBy = Math.pow(step, 1);
    if (scale.value * scaleBy > 0.25) {
      zoom(scaleBy);
    }
  };

  onMounted(() => {
    if (pan.value) {
      updateRect();
      setOffsetCenter();
      pan.value.addEventListener("mousedown", mouseDown);
    }
  });

  onUnmounted(() => {
    pan.value?.removeEventListener("mousedown", mouseDown);
    removePanDragListeners();
  });

  return { panRect, offset, scale, zoomIn, zoomOut };
}
