import { Router } from "express";
import { validateBody } from "../../common/middlewares/validation.middleware";

import * as UserController from "./user.controller";

const router = Router();

router.get("/profile", validateBody, UserController.getProfile);
router.put("/update", validateBody, UserController.updateProfile);

export default router;
