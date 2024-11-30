//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Menu from './Components/Menu'
import Home from './Pages/Home'
import Bikes from './Pages/Bikes'
import NotFound from './Pages/NotFound'
import Perfil from './Pages/Perfil'
import Helpme from './Pages/Helpme'
import LoginButton from './Components/login'
import LogoutButton from './Components/logout'
import Profile from './Components/profile'
/*import CallbackPage from "./Pages/callback-page";/*/

function App() {
 
  return (
    <>
      <Router>
        <Menu/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/Helpme" element={<Helpme />} />
          <Route path="/login" element={<LoginButton />} />
          <Route path="/logout" element={<LogoutButton />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
