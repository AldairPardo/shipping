import { AppDataSource } from "./utils-modules/database/config/database";
import express from "express";
import { AuthRoutes } from "@modules/auth/domain/routes/auth.routes";
import { ShipmentRoutes } from "@modules/shipments/domain/routes/shipment.routes";
import { RouteRoutes } from "@modules/shipment-routes/domain/routes/route.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡Servidor en Express con TypeScript funcionando! 🚀");
});

// Rutas
app.use("/auth", AuthRoutes);
app.use("/shipments", ShipmentRoutes);
app.use("/routes", RouteRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("📦 Conectado a la base de datos");
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.error("Error en la conexión a BD:", error));
