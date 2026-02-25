import express from "express";
import { ROUTES } from "./constants/route.constant";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${ROUTES.API_VERSION}${ROUTES.AUTH}`, authRoutes);

export default app;
