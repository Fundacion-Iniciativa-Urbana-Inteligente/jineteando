import { NavLink } from "react-router-dom"
import LoginButton from "./login"
import LogoutButton from "./logout"
import Profile from "./profile"
import { useAuth0 } from "@auth0/auth0-react";

const Menu = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary" data-bs-theme="light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">Inicio</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/perfil">Perfil</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Helpme">Asi Funciona</NavLink>
              </li>
              <li className="nav-item">
                {!isAuthenticated && <LoginButton />}
                <LogoutButton />
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">Nombre </NavLink>
                <Profile />
              </li>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Configuracion
                </NavLink>
                <ul className="dropdown-menu">
                  <li><NavLink className="dropdown-item" to="/edit-data">Editar datos</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/edit-password">Modificar contraseña</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/logout">Cerrar Sesión</NavLink></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Menu;