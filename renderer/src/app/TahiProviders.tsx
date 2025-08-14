import App from '../App';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from '../data/RootContext';
import { theme } from '../theme';

export function TahiProviders(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </Provider>
  );
}
