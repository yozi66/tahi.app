import React from 'react';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { Welcome } from './Welcome/Welcome';

export function TechnologyPage(): React.JSX.Element {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
