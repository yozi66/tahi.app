import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './data/RootContext';
import { TahiRouter } from './TahiRouter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TahiRouter />
    </Provider>
  </StrictMode>,
);
