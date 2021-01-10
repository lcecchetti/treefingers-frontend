import { DefaultLayout } from 'components/layout';
import { Button, Container, Heading, Text } from 'components/ui';

const UiPage = () => {
  return (
    <Container>
      <Heading variant="h1">Ui demo page</Heading>

      <div>
        <Heading variant="h2">typography</Heading>
        <Heading variant="h1">Lorem ipsum dolor sit amet</Heading>
        <Heading variant="h2">Lorem ipsum dolor sit amet</Heading>
        <Heading variant="h3">Lorem ipsum dolor sit amet</Heading>
        <Heading variant="h4">Lorem ipsum dolor sit amet</Heading>
        <Heading variant="h5">Lorem ipsum dolor sit amet</Heading>
        <Heading variant="h6">Lorem ipsum dolor sit amet</Heading>

        <Text variant="p">Lorem ipsum dolor sit amet</Text>
        <Text variant="span">Lorem ipsum dolor sit amet</Text>
      </div>

      <div>
        <Heading variant="h2">Buttons</Heading>
        <Button>Button</Button>
        <Button loading>Button</Button>
        <Button disabled>Button</Button>
        <Button variant="secondary">Button</Button>
        <Button variant="secondary" loading>Button</Button>
        <Button variant="secondary" disabled>Button</Button>
        <Button variant="outlined">Button</Button>
        <Button variant="outlined" loading>Button</Button>
        <Button variant="outlined" disabled>Button</Button>
      </div>
    </Container>
  );
};

UiPage.Layout = DefaultLayout;

export default UiPage;