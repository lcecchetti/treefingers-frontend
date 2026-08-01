import clsx from 'clsx';
import { useUI } from 'lib/ui/context';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { FormField, Container } from 'components/ui';
import { getSearchUrl } from 'lib/helper/search';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

interface SearchFormValues {
  q: string;
}

const SearchBar = () => {
  const { isSearchOpen, closeSearch } = useUI();
  const router = useRouter();

  return (
    <div className={clsx('h-full w-full absolute bg-base -top-full left-0 transition-transform transform-gpu', {
      ['translate-y-full']: isSearchOpen,
    })}>
      <Container className="h-full">
        {isSearchOpen &&
          <Formik<SearchFormValues>
            validateOnChange={false}
            initialValues={{
              q: (router.query.q as string | undefined) ?? '',
            }}
            onSubmit={({ q }, { resetForm }) => {
              closeSearch();
              resetForm();
              router.push(getSearchUrl(q));
            }}
            validationSchema={Yup.object().shape({
              q: Yup.string().required('').min(3, 'Cmon, be more precise!'),
            })}
          >
          {({ errors, touched }) => (
            <Form className="h-full flex items-center gap-sm">
              <Field as={FormField} type="text" placeholder="Search" className="flex-grow" name="q" error={errors.q} touched={touched.q} autoFocus={isSearchOpen} />
              <button type="submit" className="focus:outline-none">
                <FaSearch className="text-2xl cursor-pointer" />
              </button>
              <FaTimes onClick={closeSearch} className="text-2xl cursor-pointer" />
            </Form>
          )}
        </Formik>
        }
      </Container>
    </div>
  )
};

export default SearchBar;
