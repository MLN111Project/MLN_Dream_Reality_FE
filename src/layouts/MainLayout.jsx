import { Outlet, useLocation } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Particles from '../components/Particles';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function MainLayout({ bgVariant = 'default' }) {
  const { pathname } = useLocation();
  const hideChrome = pathname === '/transition';

  return (
    <>
      <AnimatedBackground variant={bgVariant} />
      {!hideChrome && <Particles />}
      {!hideChrome && <LanguageSwitcher />}
      <Outlet />
    </>
  );
}
