import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TahiRouter } from './TahiRouter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TahiRouter />
  </StrictMode>
);
