import { Router } from "https://deno.land/x/oak/mod.ts";
import { getPublishedProgrammes, getAllProgrammes, createProgramme, togglePublish, deleteProgramme } from "./controllers/programmeController.js";
import { registerInterest } from "./controllers/studentController.js";
import { getProgrammeModules } from "./controllers/moduleController.js";
import { login, logout } from "./controllers/authController.js";
import { requireAdmin } from "./middleware/authMiddleware.js";

const router = new Router();

// Public routes (Students)
router.get("/api/programmes", getPublishedProgrammes);
router.get("/api/programmes/:id/modules", getProgrammeModules);
router.post("/api/students/register", registerInterest);

// Auth routes
router.post("/api/login", login);
router.post("/api/logout", logout);

// Protected Admin routes (Notice we added 'requireAdmin' as the middle argument)
router.get("/api/admin/programmes", requireAdmin, getAllProgrammes);
router.post("/api/admin/programmes", requireAdmin, createProgramme);
router.put("/api/admin/programmes/:id/publish", requireAdmin, togglePublish);
router.delete("/api/admin/programmes/:id", requireAdmin, deleteProgramme);

export default router;