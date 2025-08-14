import App from './App'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { TechnologyPage } from './pages/Technology.page'
import { TodolistPage } from './pages/Todolist.page'
import { Error404Page } from './pages/Error.404.page'
import { ElectronPage } from './pages/Electron.page'

export function TahiRouter(): React.JSX.Element {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  )
}
export function TahiRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/technology" element={<TechnologyPage />} />
      <Route path="/electron" element={<ElectronPage />} />
      <Route path="/" element={<TodolistPage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  )
}
