import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ApiError } from 'components/common';
import { Spinner } from 'components/ui';

const InfiniteScroll = ({ className, onLoadMore, error, loading, children, hasMore, backwards = false }) => {
  const [scrollBottom, setScrollBottom] = useState(0);
  const [scrollRight, setScrollRight] = useState(0);

  const ref = useRef(null);
  const reachEndRef = useRef(null);

  useEffect(() => {
    const scrollableElement = ref.current;

    if (backwards) {
      scrollableElement.scrollTo({
        top: scrollableElement.scrollHeight - scrollBottom,
        left: scrollableElement.scrollWidth - scrollRight,
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        setScrollBottom(scrollableElement.scrollHeight - scrollableElement.scrollTop);
        setScrollRight(scrollableElement.scrollWidth - scrollableElement.scrollLeft);
        onLoadMore();
      }
    });

    if (hasMore) {
      observer.observe(reachEndRef.current, {
        root: ref.current,
        threshold: 1,
      });
    }

    return () => observer.disconnect();
  }, [children]);

  return (
    <div ref={ref} className={clsx('overflow-auto' , className)}>
        {backwards &&
          <>
            <Spinner loading={loading}/>
            <ApiError error={error}/>
            <div ref={reachEndRef}></div>
          </>
        }
        {children}
        {!backwards &&
          <>
            <div ref={reachEndRef}></div>
            <Spinner loading={loading}/>
            <ApiError error={error}/>
          </>
        }
    </div>
  );
};

export default InfiniteScroll;