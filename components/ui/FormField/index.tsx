import clsx from 'clsx';
import Text from 'components/ui/Text';

export interface FormFieldOption { value: string | number; label: string; }
export interface FormFieldProps {
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  type?: string;
  name: string;
  label?: string;
  hint?: string;
  options?: FormFieldOption[];
  error?: string | boolean;
  touched?: boolean;
  rows?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
}

const FormField = ({ className, fieldClassName, labelClassName, type, name, label, hint, options, error, touched, ...rest }: FormFieldProps) => {
  const componentMap: Record<string, 'select' | 'textarea'> = {
    'select': 'select',
    'textarea': 'textarea',
  };

  const Component = type ? (componentMap[type] ?? 'input') : 'input';

  return (
    <fieldset className={clsx(
      "flex flex-col gap-xs",
      className,
    )}>

      {!!label &&
        <Text variant="label"
          as="label"
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
        'border-primary w-full focus:outline-none focus:ring-0 bg-primary-contrast',
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
          options.map(({ value, label }, index) => (
            <option key={index} value={value}>{label}</option>
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
