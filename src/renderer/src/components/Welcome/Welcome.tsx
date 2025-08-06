import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Mantine
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This starter Vite project includes a minimal setup, if you want to learn more on Mantine +
        Vite integration follow{' '}
        <Anchor href="https://mantine.dev/guides/vite/" size="lg" target="_blank">
          this guide
        </Anchor>
        . To get started edit pages/Home.page.tsx file.
      </Text>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        To learn more about Mantine components, visit{' '}
        <Anchor href="https://mantine.dev/" size="lg" target="_blank">
          mantine.dev
        </Anchor>
        .
      </Text>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        To learn more about Mantine Datatable, visit{' '}
        <Anchor href="https://icflorescu.github.io/mantine-datatable/" size="lg" target="_blank">
          mantine-datatable
        </Anchor>
        .
      </Text>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        To learn more about React, visit{' '}
        <Anchor href="https://www.w3schools.com/react/default.asp" size="lg" target="_blank">
          w3schools
        </Anchor>
        .
      </Text>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        To learn more about Typescript, visit{' '}
        <Anchor href="https://www.w3schools.com/typescript/index.php" size="lg" target="_blank">
          w3schools
        </Anchor>
        .
      </Text>
    </>
  );
}
