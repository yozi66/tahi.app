import { HashRouter, Routes, Route } from 'react-router-dom';
import { TechnologyPage } from '@renderer/features/technology/Technology.page';
import { TodolistPage } from '@renderer/features/todolist/Todolist.page';
import { Error404Page } from './Error.404.page';
import { ElectronPage } from '@renderer/features/technology/Electron.page';
import { TahiProviders } from '@renderer/app/TahiProviders';

export function TahiRouter(): React.JSX.Element {
  return (
    <HashRouter>
      <TahiProviders />
    </HashRouter>
  );
}
export function TahiRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/technology" element={<TechnologyPage />} />
      <Route path="/electron" element={<ElectronPage />} />
      <Route path="/" element={<TodolistPage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}
