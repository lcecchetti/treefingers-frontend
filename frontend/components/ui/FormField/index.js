import clsx from 'clsx';
import { Text } from 'components/ui';

const FormField = ({ className, fieldClassName, labelClassName, type, name, label, options, error, ...rest }) => {

  const componentMap = {
    'select': 'select',
    'textarea': 'textarea',
  };

  const Component = componentMap[type] ?? 'input';

  return (
    <fieldset className={clsx(
      className,
    )}>
      <Component className={clsx(
        'border-0 border-b-2 border-primary w-full bg-transparent focus:outline-none focus:border-primary-dark focus:ring-0',
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

      {!!label &&
        <Text variant="label"
          className={clsx(
            'block',
            error && 'text-error',
            labelClassName
          )}
          htmlFor={name}>
          {label}
        </Text>
      }

      {!!error &&
        <Text className="text-error text-xs" variant="span">
          {error}
        </Text>
      }
    </fieldset >
  );
};

export default FormField;
