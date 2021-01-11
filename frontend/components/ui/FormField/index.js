import clsx from 'clsx';
import { Text } from 'components/ui';

const FormField = ({ className, fieldClassName, labelClassName, type, name, label, options, error, ...rest }) => {

  let Component;

  // pick component
  switch (type) {
    case 'select':
      Component = 'select';
      break;
    case 'textarea':
      Component = 'textarea';
      break;
    default:
      Component = 'input';
  }

  return (
    <fieldset className={clsx(
      'mb-2',
      className,
      {
        ['']: !!error,
      },
    )}>
      {!!label &&
        <label className={clsx(
          'block mb-1',
          labelClassName,
          {
            ['text-error']: !!error,
          },
        )}
          for={name}>
          {label}
        </label>
      }

      <Component className={clsx(
        'border-0 border-b-2 border-primary w-full focus:outline-none focus:border-primary-dark focus:ring-0',
        {
          ['']: type === 'select',
          ['']: type === 'textarea',
        },
        fieldClassName,
        {
          ['border-error']: !!error,
        }
      )}
        name={name}
        type={type}
        {...rest}>

        {options &&
          options.map(({ value, selected }, index) => (
            <option key={index} selected>{value}</option>
          ))
        }

      </Component>

      {!!error &&
        <Text className="text-error" variant="span">
          {error}
        </Text>
      }
    </fieldset >
  )
};

export default FormField;
