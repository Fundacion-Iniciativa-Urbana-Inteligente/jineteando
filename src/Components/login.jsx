import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Por ahora solo simularemos un login exitoso
    console.log('Usuario ha iniciado sesión');
    // Podríamos redirigir al usuario a su perfil
    navigate('/perfil');
  };

  return (
    <button 
      onClick={handleLogin}
    >
      Iniciar Sesión
    </button>
  );
};

export default LoginButton;