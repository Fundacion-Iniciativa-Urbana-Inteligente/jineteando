// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Lógica para registrar usuario y enviar OTP
    navigate('/login');
  };

  return (
    <div>
      <h2>Registro</h2>
      <input
        type="text"
        placeholder="Número de teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleSignUp}>Registrarse</button>
    </div>
  );
};

export default SignUp;
