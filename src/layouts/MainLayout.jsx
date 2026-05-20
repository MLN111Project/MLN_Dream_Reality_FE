import { Outlet } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Particles from '../components/Particles';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function MainLayout({ bgVariant = 'default' }) {
  return (
    <>
      <AnimatedBackground variant={bgVariant} />
      <Particles />
      <LanguageSwitcher />
      <Outlet />
    </>
  );
}
