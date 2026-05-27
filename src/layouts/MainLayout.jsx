import { Outlet, useLocation } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';

export default function MainLayout({ bgVariant = 'default' }) {
  const { pathname } = useLocation();
  const hideChrome = pathname === '/transition';
  const bgVariantResolved = pathname === '/' ? 'home' : bgVariant;

  return (
    <>
      <AnimatedBackground variant={bgVariantResolved} />
      <Outlet />
    </>
  );
}
