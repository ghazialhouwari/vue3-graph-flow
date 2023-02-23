import type { Offset } from "@/utils/types";

export const getNewPanOffset = (
  deltaX: number,
  deltaY: number,
  offset: Offset,
  pan: HTMLElement
): Offset => {
  if (!offset || !pan) return { x: 0, y: 0 };
  const top = window.innerHeight - pan.offsetHeight;
  const right = window.innerWidth - pan.offsetWidth;

  let newOffset: Offset = offset;

  // Calculate the amount of offset If the pan didn't cross the boundaries
  if (newOffset.x >= right && newOffset.x <= 0) {
    newOffset.x += deltaX;
    if (deltaX + newOffset.x >= 0) {
      newOffset.x = 0;
    } else if (deltaX + newOffset.x <= right) {
      newOffset.x = right;
    }
  } else if (newOffset.x >= right && newOffset.x >= 0 && deltaX < 0) {
    newOffset.x += deltaX;
  } else if (newOffset.x < right && newOffset.x < 0 && deltaX > 0) {
    newOffset.x += deltaX;
  }

  if (newOffset.y >= top && newOffset.y <= 0) {
    newOffset.y += deltaY;
    if (deltaY + newOffset.y >= 0) {
      newOffset.y = 0;
    } else if (deltaY + newOffset.y <= top) {
      newOffset.y = top;
    }
  } else if (newOffset.y >= top && newOffset.y >= 0 && deltaY < 0) {
    newOffset.y += deltaY;
  } else if (newOffset.y < top && newOffset.y < 0 && deltaY > 0) {
    newOffset.y += deltaY;
  }
  return newOffset;
};
