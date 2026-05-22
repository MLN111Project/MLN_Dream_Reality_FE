import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Landing from '../pages/Landing/Landing';
import DreamSelection from '../pages/DreamSelection/DreamSelection';
import CinematicTransition from '../pages/Transition/CinematicTransition';
import WorkEnvironment from '../pages/Simulation/WorkEnvironment';
import Timeline from '../pages/Timeline/Timeline';
import Ending from '../pages/Ending/Ending';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/dream" element={<DreamSelection />} />
          <Route path="/transition" element={<CinematicTransition />} />
          <Route path="/environment" element={<WorkEnvironment />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/ending" element={<Ending />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
