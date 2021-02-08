import clsx from 'clsx';
import { DefaultLayout } from 'components/layout';
import { Button, Container, FormField, Text, Link } from 'components/ui';


const UiSection = ({ children, className, title }) => {
  return (
    <div className={clsx('mb-lg', className)}>
      <Text variant="h2">{title}</Text>
      {children}
    </div>
  );
}

const UiPage = () => {
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

        <Link className="block my-sm">This is a link</Link>
      </UiSection>

      <UiSection title="Buttons">
        <Button>Button</Button>
        <Button size="sm">Button</Button>
        <Button size="lg" loading>Button</Button>
        <Button loading>Button</Button>
        <Button disabled>Button</Button>
        <Button variant="secondary">Button</Button>
        <Button variant="secondary" loading>Button</Button>
        <Button variant="secondary" disabled>Button</Button>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined" loading>Button</Button>
        <Button variant="outlined" disabled>Button</Button>
        <Button as={Link} styleAsLink={false}>This is a link</Button>
      </UiSection>


      <UiSection title="Inputs">
        <div className="w-1/3">
          <FormField type="text" placeholder="Placeholder" label="label" />
          <FormField type="text" placeholder="Placeholder" label="label" error="An error has occurred" />
          <FormField type="number" placeholder="Placeholder" label="label" />
          <FormField type="date" placeholder="Placeholder" label="label" />
          <FormField type="textarea" placeholder="Placeholder" label="label" />
          <FormField type="select" label="label" options={[{ value: 1 }, { value: 2 }, { value: 3, selected: true }]} />
        </div>
      </UiSection>
    </Container>
  );
};

UiPage.Layout = DefaultLayout;

export default UiPage;