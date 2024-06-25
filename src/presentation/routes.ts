import { Router } from "express";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use("/", () => {
      console.log("Hello World");
    });

    return router;
  }
}
