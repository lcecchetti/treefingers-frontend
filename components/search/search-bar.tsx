'use client';

import clsx from 'clsx';
import { useUI } from '@/lib/ui/context';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { FormField, Container } from '@/components/ui';
import { getSearchUrl } from '@/lib/helper/search';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

const searchSchema = z.object({
  q: z.string().min(3, "C'mon, be more precise!"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export const SearchBar = () => {
  const { isSearchOpen, closeSearch } = useUI();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      q: searchParams.get('q') ?? '',
    },
  });

  const onSubmit = ({ q }: SearchFormValues) => {
    closeSearch();
    reset();
    router.push(getSearchUrl(q));
  };

  return (
    <div className={clsx('h-full w-full absolute bg-base -top-full left-0 transition-transform transform-gpu', {
      ['translate-y-full']: isSearchOpen,
    })}>
      <Container className="h-full">
        {isSearchOpen &&
          <form noValidate className="h-full flex items-center gap-sm" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="q"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <FormField
                  {...field}
                  type="text"
                  placeholder="Search"
                  className="flex-grow"
                  error={errors.q?.message}
                  touched={touchedFields.q}
                  autoFocus={isSearchOpen}
                />
              )}
            />
            <button type="submit" className="focus:outline-none">
              <FaSearch className="text-2xl cursor-pointer" />
            </button>
            <FaTimes onClick={closeSearch} className="text-2xl cursor-pointer" />
          </form>
        }
      </Container>
    </div>
  )
};
