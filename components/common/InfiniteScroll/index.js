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
    if (backwards) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight - scrollBottom,
        left: ref.current.scrollWidth - scrollRight,
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        setScrollBottom(ref.current.scrollHeight - ref.current.scrollTop);
        setScrollRight(ref.current.scrollWidth - ref.current.scrollLeft);
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