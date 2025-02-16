import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dtoSchema from "../../../dto-schema.json";
import { title } from "process";

// Configuración de Swagger
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Paquetería",
            version: "1.0.0",
            description: "Documentación generada automáticamente con Swagger",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Servidor Local",
            },
        ],
        tags: [
            { name: "Auth", description: "Endpoints de autenticación" },
            { name: "Shipments", description: "Endpoints de envíos" },
            { name: "Routes", description: "Endpoints de rutas de envíos" },
        ],
        components: {
            schemas: dtoSchema.definitions,
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        definitions: dtoSchema.definitions,
    },
    apis: [
        "./src/modules/**/*.routes.ts", // Rutas dentro de los módulos
        "./src/main.ts", // 🔥 Ahora Swagger también leerá las rutas en main.ts
    ],
};

// Generar documentación
const swaggerSpec = swaggerJsdoc(options);

// Función para inicializar Swagger
export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(
        `📜 Swagger Docs disponible en http://localhost:${process.env.PORT}/api-docs`
    );
};
