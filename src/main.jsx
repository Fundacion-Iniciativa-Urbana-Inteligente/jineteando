import { createRoot } from 'react-dom/client';
import Footer from './Components/Footer';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
/* import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";*/


createRoot(document.getElementById('root')).render(
    <Auth0Provider
    domain="dev-fxlyp2lwts1h3fbx.us.auth0.com"
    clientId="Pjc2pDPhCN0Rvn4imHMxQLnnMCDgdTdl"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
    <Footer/>,
)