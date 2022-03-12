import clsx from 'clsx';
import { Text } from 'components/ui';

const FormField = ({ className, fieldClassName, labelClassName, type, name, label, hint, options, error, touched, ...rest }) => {

  const componentMap = {
    'select': 'select',
    'textarea': 'textarea',
  };

  const Component = componentMap[type] ?? 'input';

  return (
    <fieldset className={clsx(
      "flex flex-col gap-xs",
      className,
    )}>

      {!!label &&
        <Text variant="label"
          className={clsx(
            'block',
            error && touched && 'text-error',
            labelClassName
          )}
          htmlFor={name}>
          {label}
        </Text>
      }

      <Component className={clsx(
        'border-primary w-full bg-transparent focus:outline-none focus:ring-0',
        {
          ['']: type === 'select',
          ['rounded-xl']: type === 'textarea',
          ['rounded-full']: type !== 'textarea',
        },
        fieldClassName,
        {
          ['border-error focus:border-error']: error && touched,
          ['focus:border-primary']: !error,
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

      {!!hint && !error &&
        <Text variant="label"
          className={clsx(
            'block text-xs',
            error && touched && 'text-error',
          )}>
          {hint}
        </Text>
      }

      {!!error && error !== true && touched &&
        <Text className="text-error text-xs" variant="span">
          {error}
        </Text>
      }
    </fieldset >
  );
};

export default FormField;
