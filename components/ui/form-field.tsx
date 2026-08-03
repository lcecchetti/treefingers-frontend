import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

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

export const FormField = ({ className, fieldClassName, labelClassName, type, name, label, hint, options, error, touched, ...rest }: FormFieldProps) => {
  const hasError = !!error && touched;

  const fieldClassName_ = cn(
    hasError ? 'border-error focus:border-error' : 'focus:border-primary',
    fieldClassName
  );

  return (
    <fieldset className={cn('flex flex-col gap-xs', className)}>
      {!!label &&
        <Label htmlFor={name} className={cn(hasError && 'text-error', labelClassName)}>
          {label}
        </Label>
      }

      {type === 'textarea' ? (
        <Textarea id={name} name={name} className={fieldClassName_} {...rest} />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          className={cn(
            'border-primary w-full rounded-full focus:outline-none focus:ring-0 bg-primary-contrast',
            fieldClassName_
          )}
          {...rest}>
          {options?.map(({ value, label }, index) => (
            <option key={index} value={value}>{label}</option>
          ))}
        </select>
      ) : (
        <Input id={name} name={name} type={type} className={fieldClassName_} {...rest} />
      )}

      {!!hint && !error &&
        <Text variant="label" className={cn('block text-xs', hasError && 'text-error')}>
          {hint}
        </Text>
      }

      {!!error && error !== true && touched &&
        <Text className="text-error text-xs" variant="span">
          {error}
        </Text>
      }
    </fieldset>
  );
};
