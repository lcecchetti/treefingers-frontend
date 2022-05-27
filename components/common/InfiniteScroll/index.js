import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ApiError } from 'components/common';
import { Spinner } from 'components/ui';

const InfiniteScroll = ({ className, onLoadMore, error, loading, children, hasMore, backwards = false, direction = 'vertical' }) => {
  const [scrollBottom, setScrollBottom] = useState(0);
  const [scrollRight, setScrollRight] = useState(0);

  const ref = useRef(null);
  const reachEndRef = useRef(null);

  useEffect(() => {
    if (backwards && !loading) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight - scrollBottom,
        left: ref.current.scrollWidth - scrollRight,
      });
    }
  }, [loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        setScrollBottom(ref.current.scrollHeight - ref.current.scrollTop);
        setScrollRight(ref.current.scrollWidth - ref.current.scrollLeft);
        onLoadMore({ notifyOnNetworkStatusChange: true });
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
    <div ref={ref} className={clsx(
      'overflow-auto flex',
      direction === 'vertical' && 'flex-col',
      direction === 'horizontal' && 'flex-row',
    )}>
        {backwards &&
          <div ref={reachEndRef}>
            <Spinner loading={loading} className="my-lg"/>
            <ApiError error={error} className="my-lg"/>
          </div>
        }
        <div className={className}>
          {children}
        </div>
        {!backwards &&
          <div ref={reachEndRef}>
            <Spinner loading={loading} className="my-lg"/>
            <ApiError error={error} className="my-lg"/>
          </div>
        }
    </div>
  );
};

export default InfiniteScroll;