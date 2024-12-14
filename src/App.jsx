import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './Components/Menu';
import Home from './Pages/Home';
import Bikes from './Pages/Bikes';
import NotFound from './Pages/NotFound';
import Helpme from './Pages/Helpme';
import Login from './Components/LogIn';
import SignUp from './Components/SignUp';
import Verify from './Components/Verify'; // Nueva página de verificación
import Footer from './Components/Footer';

function App() {
  return (
    <>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/helpme" element={<Helpme />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify/:userId" element={<Verify />} /> {/* Ruta de verificación */}
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
