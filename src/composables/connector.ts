import { ref, onMounted, onUnmounted, nextTick } from "vue";
import type { Stub, Segment } from "@/utils/types";

export function useConnector(sourceId: number, targetId: number) {
  const path = ref("");
  const arrowPath = ref("");
  const svgRect = ref({ top: 0, left: 0, width: 0, height: 0 });
  const svgPadding = 50;

  let observer: MutationObserver;

  function updateConnection(sourceNode: HTMLElement, targetNode: HTMLElement) {
    const endpoints = getEndpoints(sourceNode, targetNode);
    const stubs = getStubs(endpoints);
    const segments = getSegments(stubs);
    path.value = getPath(segments);
    arrowPath.value = getArrowPath(stubs[stubs.length - 1]);
  }

  function getDirections(endpoints: any) {
    return {
      isDown: endpoints.target.y > endpoints.source.y,
      isRight: endpoints.target.x > endpoints.source.x,
    };
  }

  function getSVGRect(endpoints: any, dir: any) {
    const diff = {
      x: endpoints.target.x - endpoints.source.x,
      y: endpoints.target.y - endpoints.source.y,
    };

    const width = Math.abs(diff.x) + (dir.isRight ? 0 : 100) + svgPadding * 2;
    const height = Math.abs(diff.y) + svgPadding * 2;

    const top = dir.isDown
      ? endpoints.source.y - svgPadding
      : Math.abs(endpoints.source.y) - Math.abs(diff.y) - svgPadding;
    let left = dir.isRight
      ? endpoints.source.x - svgPadding
      : Math.abs(endpoints.source.x) - Math.abs(diff.x) - 50 - svgPadding;

    return {
      width,
      height,
      top,
      left,
    };
  }

  function getEndpoints(sourceNode: HTMLElement, targetNode: HTMLElement) {
    return {
      source: {
        y: sourceNode.offsetTop + sourceNode.offsetHeight / 2,
        x: sourceNode.offsetLeft + sourceNode.offsetWidth,
        top: sourceNode.offsetTop,
        left: sourceNode.offsetLeft,
      },
      target: {
        y: targetNode.offsetTop + targetNode.offsetHeight / 2,
        x: targetNode.offsetLeft,
        top: targetNode.offsetTop,
        left: targetNode.offsetLeft,
      },
    };
  }

  function getPath(segments: Segment[]): string {
    return segments.reduce((acc: string, segment: Segment) => {
      return `${acc} ${segment.key} ${segment.x} ${segment.y}`;
    }, "");
  }
  function getArrowPath(endStub: Stub): string {
    const width = 10;
    const height = 15;
    const endX = endStub.x - 5;
    const endY = endStub.y + 4.5;
    return `
      M ${endX} ${endY - height / 2}
      L ${endX - width} ${endY}
      L ${endX - width} ${endY - height}
      L ${endX} ${endY - height / 2}`;
  }

  function getStubs(endpoints: any): Stub[] {
    const dir = getDirections(endpoints);
    svgRect.value = getSVGRect(endpoints, dir);

    const startStub: Stub = {
      x: dir.isRight ? svgPadding : svgRect.value.width - 50 - svgPadding,
      y: dir.isDown ? svgPadding : svgRect.value.height - svgPadding,
    };

    const endStub: Stub = {
      x: dir.isRight ? svgRect.value.width - svgPadding : 50 + svgPadding,
      y: dir.isDown ? svgRect.value.height - svgPadding : svgPadding,
    };
    const midStubs = getMidStubs(startStub, endStub, dir);

    return [startStub, ...midStubs, endStub];
  }

  function getMidStubs(startStub: Stub, endStub: Stub, dir: any): Stub[] {
    const midPoint = {
      x: startStub.x + (endStub.x - startStub.x) / 2,
      y: startStub.y + (endStub.y - startStub.y) / 2,
    };

    if (dir.isRight) {
      return [
        {
          x: midPoint.x,
          y: startStub.y,
        },
        {
          x: midPoint.x,
          y: endStub.y,
        },
      ];
    }
    return [
      {
        x: startStub.x + 50,
        y: startStub.y,
      },
      {
        x: startStub.x + 50,
        y: midPoint.y,
      },
      {
        x: endStub.x - 50,
        y: midPoint.y,
      },
      {
        x: endStub.x - 50,
        y: endStub.y,
      },
    ];
  }

  function getSegments(stubs: Stub[]): any {
    return stubs.map((stub, index) => ({
      x: stub.x,
      y: stub.y,
      key: index === 0 ? "M" : "L",
    }));
  }

  onMounted(() => {
    nextTick(() => {
      const sourceNode = document.getElementById(`node-${sourceId}`);
      const targetNode = document.getElementById(`node-${targetId}`);
      if (!sourceNode || !targetNode) {
        throw new Error(`source/target node doesn't exist`);
      }

      updateConnection(sourceNode, targetNode);

      const config = { attributes: true, childList: true, subtree: true };
      observer = new MutationObserver(() =>
        updateConnection(sourceNode, targetNode)
      );
      observer.observe(sourceNode, config);
      observer.observe(targetNode, config);
    });
  });
  onUnmounted(() => observer.disconnect());

  return { path, svgRect, arrowPath };
}
