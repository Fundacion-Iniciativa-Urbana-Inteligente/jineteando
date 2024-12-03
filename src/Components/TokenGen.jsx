import md5 from 'md5';
import axios from 'axios';
import { useState } from 'react';

export default function TokenGen() {
    //Genero el token de acceso para traer los datos del candado
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const endpoint = "https://us-open.tracksolidpro.com/route/rest";
    const appKey = "8FB345B8693CCD00A85859F91CC77D2A339A22A4105B6558";
    const userPwd = "Pajaro01"; // Contraseña original
    const userId = "gazzimon@gmail.com";
  
    // Generar valores dinámicos
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    const userPwdMd5 = md5(userPwd);
    const signature = "123456"; // Aquí puedes agregar tu lógica de firma
  
    const payload = {
      method: "jimi.oauth.token.get",
      timestamp,
      app_key: appKey,
      sign: signature,
      sign_method: "md5",
      v: "0.9",
      format: "json",
      user_id: userId,
      user_pwd_md5: userPwdMd5,
      expires_in: 7200,
    };
  
    const handleApiCall = async () => {
      try {
        // Hacer la solicitud POST
        const response = await axios.post(endpoint, payload, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
  
        // Parsear la respuesta
        const { result } = response.data;
        const { accessToken, refreshToken, time, expiresIn } = result;
  
        // Calcular `TimeEnd`
        const timeObject = new Date(time);
        const timeEndObject = new Date(timeObject.getTime() + expiresIn * 1000);
  
        // Actualizar el estado
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setTimeEnd(timeEndObject.toISOString());
  
        console.log("AccessToken:", accessToken);
        console.log("RefreshToken:", refreshToken);
        console.log("Time:", time);
        console.log("TimeEnd:", timeEndObject.toISOString());
      } catch (error) {
        console.error("Error al hacer la solicitud:", error);
      }
    };
    handleApiCall();

  return (
    <>
    </>
  )
}
