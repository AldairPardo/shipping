import { AppDataSource } from "./utils-modules/database/config/database";
import express from "express";
import { AuthRoutes } from "@modules/auth/domain/routes/auth.routes";
import { ShipmentRoutes } from "@modules/shipments/domain/routes/shipment.routes";
import { RouteRoutes } from "@modules/shipment-routes/domain/routes/route.routes";
import redisClient from "@utils/database/config/redisClient";

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

async function startServer() {
    try {
        // Verificar conexión a Redis
        await redisClient.ping();
        console.log("🔴 Conectado a Redis");

        // Conectar a la base de datos
        await AppDataSource.initialize();
        console.log("📦 Conectado a la base de datos");

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar la aplicación:", error);
        process.exit(1); // Detiene la aplicación si hay error
    }
}

// Iniciar la app
startServer();
