'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { ApolloError } from '@apollo/client';
import { ApiError } from '@/components/common';
import { Spinner } from '@/components/ui';

interface InfiniteScrollProps {
  className?: string;
  onLoadMore: (opt?: { notifyOnNetworkStatusChange?: boolean; variables?: Record<string, unknown> }) => void;
  error?: ApolloError | false;
  loading: boolean;
  children?: React.ReactNode;
  hasMore?: boolean;
  backwards?: boolean;
  direction?: 'vertical' | 'horizontal';
}

export const InfiniteScroll = ({ className, onLoadMore, error, loading, children, hasMore, backwards = false, direction = 'vertical' }: InfiniteScrollProps) => {
  const [scrollBottom, setScrollBottom] = useState(0);
  const [scrollRight, setScrollRight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const reachEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backwards && !loading) {
      ref.current?.scrollTo({
        top: ref.current.scrollHeight - scrollBottom,
        left: ref.current.scrollWidth - scrollRight,
      });
    }
  }, [loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        setScrollBottom(ref.current!.scrollHeight - ref.current!.scrollTop);
        setScrollRight(ref.current!.scrollWidth - ref.current!.scrollLeft);
        onLoadMore({ notifyOnNetworkStatusChange: true });
      }
    }, {
      root: ref.current,
      threshold: 1,
    });

    if (hasMore && reachEndRef.current) {
      observer.observe(reachEndRef.current);
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
            <ApiError error={error ?? false} className="my-lg"/>
          </div>
        }
        <div className={className}>
          {children}
        </div>
        {!backwards &&
          <div ref={reachEndRef}>
            <Spinner loading={loading} className="my-lg"/>
            <ApiError error={error ?? false} className="my-lg"/>
          </div>
        }
    </div>
  );
};
