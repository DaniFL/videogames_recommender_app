// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { UserProvider } from './context/UserContext';

// --- Componentes Guardianes ---
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute'; 

// --- Páginas ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import UserSettings from './pages/UserSettings';
import News from './pages/News';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UserProvider>
      <Router>
      <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#2d3748',
              color: '#fff',
              border: '1px solid #4a5568',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          {/* Si el usuario está autenticado, será redirigido a /user-home */}
          <Route path="/" element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* --- RUTAS PROTEGIDAS (Para usuarios normales) --- */}
          {/* Si el usuario no está autenticado, será redirigido a /login */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/user-home" element={<UserHome />} />
            <Route path="/user-settings" element={<UserSettings />} />
            <Route path="/news" element={<News />} />
          </Route>

          {/* --- RUTA PROTEGIDA PARA ADMINS --- */}
          {/* Solo usuarios autenticados Y con rol de admin podrán acceder */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* Aquí podrías añadir más rutas de admin en el futuro, como /admin/users, etc. */}
          </Route>

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;