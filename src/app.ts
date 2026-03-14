import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { ROUTES } from "./constants/route.constant";
import { errorHandler } from "./common/middlewares/errorHandler.middleware";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(`${ROUTES.API_VERSION}${ROUTES.AUTH}`, authRoutes);

app.use(errorHandler);

export default app;
