import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // Maneja pasos: 1=Solicitar OTP, 2=Validar OTP, 3=Restablecer contraseña

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
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
      alert(data.message);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setError(error.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar OTP.');
      }

      const data = await response.json();
      alert(data.message);
      setStep(2); // Cambiar a paso 2: Validar OTP
    } catch (error) {
      console.error('Error al enviar OTP:', error);
      setError(error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al validar OTP.');
      }

      const data = await response.json();
      alert(data.message);
      setStep(3); // Cambiar a paso 3: Restablecer contraseña
    } catch (error) {
      console.error('Error al validar OTP:', error);
      setError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer contraseña.');
      }

      const data = await response.json();
      alert(data.message);
      setShowForgotPassword(false); // Volver al formulario de inicio de sesión
      setStep(1);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
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
        <form onSubmit={handleForgotPassword}>
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
        <form onSubmit={handleVerifyOtp}>
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
        <form onSubmit={handleResetPassword}>
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
