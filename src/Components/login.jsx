import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // Importar contexto del usuario

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Maneja pasos: 1=Solicitar OTP, 2=Validar OTP, 3=Restablecer contraseña
  const { setUser } = useContext(UserContext); // Obtener el setter del usuario desde el contexto
  const navigate = useNavigate();

  // Manejar inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Resetear error previo
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión.');
      }

      const data = await response.json();

      // Guardar el usuario en el contexto y en localStorage
      setUser({ name: data.name }); // Actualiza el contexto global
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name }));

      alert(data.message);
      navigate('/'); // Redirigir a la página principal
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!showForgotPassword ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit">Iniciar Sesión</button>
          <button type="button" onClick={() => setShowForgotPassword(true)}>
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      ) : step === 1 ? (
        <form onSubmit={(e) => handleForgotPassword(e)}>
          <h3>Recuperar Contraseña</h3>
          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit">Enviar OTP</button>
        </form>
      ) : step === 2 ? (
        <form onSubmit={(e) => handleVerifyOtp(e)}>
          <h3>Validar OTP</h3>
          <input
            type="text"
            placeholder="Código OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Validar</button>
        </form>
      ) : (
        <form onSubmit={(e) => handleResetPassword(e)}>
          <h3>Restablecer Contraseña</h3>
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Restablecer Contraseña</button>
        </form>
      )}
    </div>
  );
};

export default Login;

