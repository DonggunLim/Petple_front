import { useCallback, useEffect, useRef } from "react";

interface UseInfinityScrollProps {
  cb: () => void;
  observerOptions?: IntersectionObserverInit;
}

const useInfinityScroll = ({ cb, observerOptions }: UseInfinityScrollProps) => {
  const targetRef = useRef(null);

  const observerCallback: IntersectionObserverCallback = useCallback(
    (entries) => {
      const { isIntersecting } = entries[0];
      if (isIntersecting) {
        cb();
      }
    },
    [cb]
  );

  useEffect(() => {
    if (!targetRef.current) return;
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [observerCallback]);

  return { targetRef };
};

export default useInfinityScroll;
