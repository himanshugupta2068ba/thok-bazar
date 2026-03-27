import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  initialInView?: boolean;
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
};

export const useInView = <T extends Element>({
  initialInView = false,
  once = true,
  rootMargin = "0px",
  threshold = 0,
}: UseInViewOptions = {}) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(initialInView);

  useEffect(() => {
    if (inView && once) {
      return;
    }

    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);

          if (once) {
            observer.disconnect();
          }
          return;
        }

        if (!once) {
          setInView(false);
        }
      },
      {
        rootMargin,
        threshold,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [inView, once, rootMargin, threshold]);

  return { inView, ref };
};
