import UnlockDevice from "./UnlockDevice"
//Botón para escanear el QR de la bicicleta
const clickCamera = ()=>{
    alert("Abrir cámara")
}

export default function MapButton(){
    return(
        <div className="bt-escaner">
            <button className="btn btn-light escaner" onClick={clickCamera}>
                
                <UnlockDevice />
            </button>
        </div>
    )
}