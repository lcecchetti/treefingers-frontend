import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { debounce } from 'lodash';

const InfiniteScroll = ({ className, onLoadMore, loading, children, hasMore, backwards = false, useWindow = false }) => {
  const [scrollBottom, setScrollBottom] = useState(0);
  const ref = useRef(null);

  const adjustScrollPosition = () => {
    ref.current.scrollTo({ top: ref.current.scrollHeight - scrollBottom });
  };  

  useEffect(() => {
    if (backwards) {
      setScrollBottom(0);
      adjustScrollPosition()
    }
  }, [children]);

  const onScroll = debounce(() => {
    setScrollBottom(ref.current.scrollHeight - ref.current.scrollTop);

    const hasReachedEnd = backwards ? 0 : ref.current.scrollHeight;
    if (!loading && ref.current.scrollTop === hasReachedEnd && hasMore) {
      onLoadMore();
    }
  }, 100);

  return (
    <div className={clsx({ 'overflow-y-auto': !useWindow }, className)} onScroll={onScroll} ref={ref}>
      {children}
    </div>
  );
};

export default InfiniteScroll;