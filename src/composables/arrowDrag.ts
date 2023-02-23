import { ref, onMounted, onUnmounted } from "vue";

export function useDrag() {
  const down = ref(false);
  const target = ref({ x: 100, y: 100 });

  function mouseDown() {
    down.value = true;
  }
  function mouseUp() {
    down.value = false;
  }
  function mouseMove(evt: MouseEvent) {
    if (!down.value) return;
    [target.value.x, target.value.y] = [evt.clientX - 200, evt.clientY - 200];
  }

  onMounted(() => {
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
  });
  onUnmounted(() => {
    window.removeEventListener("mousedown", mouseDown);
    window.removeEventListener("mouseup", mouseUp);
    window.removeEventListener("mousemove", mouseMove);
  });

  return { target };
}
