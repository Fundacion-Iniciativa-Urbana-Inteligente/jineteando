import { useParams } from "react-router-dom";
import VehiculoEnPerfil from "../Components/VehiculoEnPerfil";
import { FaUserCircle, FaWallet, FaQrcode } from 'react-icons/fa';
import './Perfil.css';

export default function Perfil() {
    // Simular estado de invitado
    const isGuest = true;

    return (
        <>
            <div className="profile-banner">
                <div className="profile-avatar">
                    <FaUserCircle size={80} />
                </div>
            </div>
            <div className="container">
                <div className="profile">
                    <div className="user-info">
                        <h2>Cuenta Invitado</h2>
                        <span className="badge bg-secondary mb-4">No verificado</span>
                    </div>

                    <div className="balance-card">
                        <div className="balance-header">
                            <FaWallet className="wallet-icon" />
                            <h3>Mi Saldo</h3>
                        </div>
                        <div className="balance-amount">
                            <h2>$0.00</h2>
                        </div>
                        <div className="balance-actions">
                            <button className="btn btn-mercadopago">
                                <img 
                                    src="/mp-logo.png" 
                                    alt="Mercado Pago" 
                                    className="mp-logo"
                                />
                                Cargar saldo
                            </button>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <button className="btn btn-outline-primary">
                            <FaQrcode /> Escanear QR
                        </button>
                    </div>

                    <div className="guest-message alert alert-info mt-4">
                        <h4>¡Bienvenido a Misio-Bike! 🚲</h4>
                        <p>Para acceder a todas las funcionalidades, te invitamos a crear una cuenta.</p>
                        <button className="btn btn-primary mt-2">
                            Crear cuenta
                        </button>
                    </div>

                    {!isGuest && <VehiculoEnPerfil/>}
                </div>
            </div>
        </>
    );
}