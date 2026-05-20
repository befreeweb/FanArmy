import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FilmsPage from './pages/FilmsPage';
import FilmDetailPage from './pages/FilmDetailPage';
import ArmiesPage from './pages/ArmiesPage';
import ArmyDetailPage from './pages/ArmyDetailPage';
import MissionsPage from './pages/MissionsPage';
import RankingsPage from './pages/RankingsPage';
import DashboardPage from './pages/DashboardPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminFilms from './pages/admin/AdminFilms';
import AdminActors from './pages/admin/AdminActors';
import AdminMissions from './pages/admin/AdminMissions';
import AdminDaily from './pages/admin/AdminDaily';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/films/:slug" element={<FilmDetailPage />} />
            <Route path="/armies" element={<ArmiesPage />} />
            <Route path="/armies/:slug" element={<ArmyDetailPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="films" element={<AdminFilms />} />
              <Route path="actors" element={<AdminActors />} />
              <Route path="missions" element={<AdminMissions />} />
              <Route path="daily" element={<AdminDaily />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
