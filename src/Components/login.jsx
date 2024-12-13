// src/components/Login.js
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Lógica para enviar OTP
    setStep(2);
  };

  const handleVerify = async () => {
    // Lógica para verificar OTP y manejar autenticación
    localStorage.setItem('token', 'dummy-token'); // Reemplaza con el token real
    navigate('/');
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Número de teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleLogin}>Enviar OTP</button>
        </>
      ) : (
        <>
          <h2>Verificar OTP</h2>
          <input
            type="text"
            placeholder="Código OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerify}>Verificar</button>
        </>
      )}
    </div>
  );
};

export default Login;