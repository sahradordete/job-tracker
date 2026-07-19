import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applications.controller.js";

const router = Router();

router.use(verifyToken); // protege todas as rotas abaixo

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;