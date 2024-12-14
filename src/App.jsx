import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './Components/Menu';
import Home from './Pages/Home';
import Perfil from './Pages/Perfil';
import NotFound from './Pages/NotFound';
import Helpme from './Pages/Helpme';
import Login from './Components/LogIn';
import SignUp from './Components/SignUp';
import Verify from './Components/Verify'; // Nueva página de verificación
import Footer from './Components/Footer';
import { UserProvider } from './context/UserContext'; // Importar el proveedor del contexto

function App() {
  return (
    <UserProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/helpme" element={<Helpme />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify/:userId" element={<Verify />} /> {/* Ruta de verificación */}
          </Routes>
      <Footer />
      </Router>
      </UserProvider>
  );
}

export default App;
