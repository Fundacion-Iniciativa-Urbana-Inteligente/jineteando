import { NavLink } from "react-router-dom"
import LoginButton from "./login"
import { useEffect, useRef } from "react"

const Menu = () => {
  const navbarToggler = useRef(null);
  const navbarCollapse = useRef(null);

  const closeMenu = () => {
    // Verifica si el menú está expandido y si estamos en vista móvil
    if (window.innerWidth < 992 && navbarCollapse.current?.classList.contains('show')) {
      navbarToggler.current?.click();
    }
  };

  // Cerrar menú al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        navbarCollapse.current?.classList.remove('show');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary" data-bs-theme="light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/" onClick={closeMenu}>Inicio</NavLink>
          <button
            ref={navbarToggler}
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
          <div 
            ref={navbarCollapse}
            className="collapse navbar-collapse" 
            id="navbarNavDropdown"
          >
            <ul className="navbar-nav ms-auto"> {/* Alineación a la derecha */}
              <li className="nav-item">
                <NavLink 
                  className="nav-link" 
                  aria-current="page" 
                  to="/"
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className="nav-link" 
                  to="/perfil"
                  onClick={closeMenu}
                >
                  Perfil
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className="nav-link" 
                  to="/Helpme"
                  onClick={closeMenu}
                >
                  Asi Funciona
                </NavLink>
              </li>
              <li className="nav-item">
                <div onClick={closeMenu}>
                  <LoginButton />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Menu;