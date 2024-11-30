import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import MapButton from './MapButton';
const posadas = [-27.366666666667, -55.893];
const ubicBici =[-27.37069, -55.88535];
const ubiMacro =[-27.365910, -55.894624]

export default function Mapa(){
    return(
        
        <MapContainer center={posadas} zoom={15}>
              <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapButton/>
      <Marker position={ubicBici}>
        <Popup><b>3</b> Eco-Bicis disponibles</Popup>
      </Marker>
      <Marker position={ubiMacro}>
        <Popup><b>7</b> Eco-Bicis disponibles</Popup>
      </Marker> 
        </MapContainer>
    
    )
}