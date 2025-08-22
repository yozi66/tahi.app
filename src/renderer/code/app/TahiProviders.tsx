import App from '@renderer/App';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from '@renderer/app/RootContext';
import { theme } from '@renderer/theme';

export function TahiProviders(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </Provider>
  );
}
