import { cn } from '@/lib/utils';
import { Button, Container, FormField, Text, Link } from '@/components/ui';
import { ToastDemo } from './toast-demo';
import type { ReactNode } from 'react';

interface UiSectionProps {
  children: ReactNode;
  className?: string;
  title: string;
}

const UiSection = ({ children, className, title }: UiSectionProps) => {
  return (
    <div className={cn('mb-lg', className)}>
      <Text variant="h2">{title}</Text>
      {children}
    </div>
  );
}

export default function UiPage() {
  return (
    <Container>
      <Text variant="h1">Ui demo page</Text>

      <UiSection title="Typography">
        <Text variant="h1">Lorem ipsum dolor sit amet</Text>
        <Text variant="h2">Lorem ipsum dolor sit amet</Text>
        <Text variant="h3">Lorem ipsum dolor sit amet</Text>
        <Text variant="h4">Lorem ipsum dolor sit amet</Text>
        <Text variant="h5">Lorem ipsum dolor sit amet</Text>
        <Text variant="h6">Lorem ipsum dolor sit amet</Text>

        <Text variant="p">Lorem ipsum dolor sit amet</Text>
        <Text variant="label">Lorem ipsum dolor sit amet</Text>
        <Text variant="span">Lorem ipsum dolor sit amet</Text>

        <Link href="#" className="block my-sm">This is a link</Link>
      </UiSection>

      <UiSection title="Buttons">
        <Button>Button</Button>
        <Button size="sm">Button</Button>
        <Button size="lg" loading>Button</Button>
        <Button loading>Button</Button>
        <Button disabled>Button</Button>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined" loading>Button</Button>
        <Button variant="outlined" disabled>Button</Button>
        <Button as={Link} href="#">This is a link</Button>
      </UiSection>


      <UiSection title="Inputs">
        <div className="w-1/3">
          <FormField name="text" type="text" placeholder="Placeholder" label="label" />
          <FormField name="text-error" type="text" placeholder="Placeholder" label="label" error="An error has occurred" />
          <FormField name="number" type="number" placeholder="Placeholder" label="label" />
          <FormField name="date" type="date" placeholder="Placeholder" label="label" />
          <FormField name="textarea" type="textarea" placeholder="Placeholder" label="label" />
          <FormField name="select" type="select" label="label" options={[{ value: 1, label: '' }, { value: 2, label: '' }, { value: 3, label: '' }]} />
        </div>
      </UiSection>

      <UiSection title="Toasts">
        <ToastDemo />
      </UiSection>
    </Container>
  );
}
