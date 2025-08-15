import { NavLink } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { IconArticle, IconTool } from '@/components/TahiIcons';

export function TahiNavbar(): React.JSX.Element {
  const location = useLocation();

  return (
    <>
      <NavLink
        href="#"
        label="List"
        leftSection={<IconArticle size={16} stroke={1.5} />}
        active={location.pathname === '/'}
      />
      <NavLink
        href="#electron"
        label="Electron"
        leftSection={<IconTool size={16} stroke={1.5} />}
        active={location.pathname === '/electron'}
      />
      <NavLink
        href="#technology"
        label="Technology"
        leftSection={<IconTool size={16} stroke={1.5} />}
        active={location.pathname === '/technology'}
      />
    </>
  );
}
