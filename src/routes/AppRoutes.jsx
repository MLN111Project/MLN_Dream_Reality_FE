import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomeMulti from '../pages/multiplayer/HomeMulti';
import AdminCreate from '../pages/multiplayer/AdminCreate';
import AdminDashboard from '../pages/multiplayer/AdminDashboard';
import PlayerJoin from '../pages/multiplayer/PlayerJoin';
import PlayerRoom from '../pages/multiplayer/PlayerRoom';
import Landing from '../pages/Landing/Landing';
import DreamSelection from '../pages/DreamSelection/DreamSelection';
import CinematicTransition from '../pages/Transition/CinematicTransition';
import WorkEnvironment from '../pages/Simulation/WorkEnvironment';
import Timeline from '../pages/Timeline/Timeline';
import Ending from '../pages/Ending/Ending';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomeMulti />} />
        <Route path="/admin/create" element={<AdminCreate />} />
        <Route path="/admin/room/:code" element={<AdminDashboard />} />
        <Route path="/play/join" element={<PlayerJoin />} />
        <Route path="/play/room/:code" element={<PlayerRoom />} />
        <Route path="/solo" element={<Landing />} />
        <Route path="/dream" element={<DreamSelection />} />
        <Route path="/transition" element={<CinematicTransition />} />
        <Route path="/environment" element={<WorkEnvironment />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/ending" element={<Ending />} />
      </Route>
    </Routes>
  );
}
