import { Router } from "express";
import * as AuthController from "./auth.controller";
import { validateBody } from "../../common/middlewares/validation.middleware";

const router = Router();

router.post("/register", validateBody, AuthController?.register);
router.post("/login", validateBody, AuthController?.login);
router.post("/refreshToken", validateBody, AuthController?.refreshToken);

export default router;
