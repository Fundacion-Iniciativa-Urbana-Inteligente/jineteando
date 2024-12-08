import React, { useState, useEffect } from "react";
import axios from "axios";

const DeviceLocation = ({ accessToken, heartbeat }) => {
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [error, setError] = useState(null);

  const fetchDeviceLocation = async () => {
    const endpoint = "https://us-open.tracksolidpro.com/route/rest";
    const appKey = "8FB345B8693CCD00A85859F91CC77D2A339A22A4105B6558";
    const target = "gazzimon@gmail.com";
    const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
    const signature = "123456"; // Aquí puedes implementar lógica de firma si es necesario

    const payload = {
      method: "jimi.user.device.location.list",
      timestamp,
      app_key: appKey,
      sign: signature,
      sign_method: "md5",
      v: "0.9",
      format: "json",
      access_token: accessToken,
      target,
      map_type: "",
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setDeviceLocation(response.data.result);
      setError(null); // Limpiar errores previos
      console.log("Device Location:", response.data.result);
    } catch (err) {
      setError(err.message || "Error al consultar la ubicación del dispositivo.");
      console.error("Error al hacer la solicitud de localización:", err);
    }
  };

  useEffect(() => {
    if (!accessToken) return; // No iniciar si no hay un accessToken

    // Llamada inicial
    fetchDeviceLocation();

    // Configurar intervalo según el valor de `heartbeat`
    const interval = setInterval(() => {
      fetchDeviceLocation();
    }, heartbeat * 1000); // Convertir segundos a milisegundos

    // Limpiar intervalo al desmontar
    return () => clearInterval(interval);
  }, [accessToken, heartbeat]);

  return (
    <div>
      <h2>Localización del Dispositivo</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {deviceLocation ? (
        <pre>{JSON.stringify(deviceLocation, null, 2)}</pre>
      ) : (
        <p>Cargando localización...</p>
      )}
    </div>
  );
};

export default DeviceLocation;
