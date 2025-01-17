import { useRef, useState, useEffect } from "react";

/**
 * useContainerSize()
 * 
 * Returns:
 *  - ref (to attach to the container)
 *  - size object { width, height } updated in real time via ResizeObserver
 */
export function useContainerSize() {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a ResizeObserver to watch for container size changes
    const observer = new ResizeObserver((entries) => {
      if (!entries || !entries.length) return;
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(containerRef.current);

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return [containerRef, size];
}
