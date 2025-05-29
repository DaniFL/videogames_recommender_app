import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import UserSettings from './pages/UserSettings';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/user-settings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App
