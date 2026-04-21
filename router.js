// router.js
import { Router } from "https://deno.land/x/oak/mod.ts";
import { getPublishedProgrammes, getAllProgrammes, createProgramme, togglePublish, deleteProgramme } from "./controllers/programmeController.js";
import { registerInterest } from "./controllers/studentController.js";
import { getProgrammeModules } from "./controllers/moduleController.js";

const router = new Router();

// Student-facing routes
router.get("/api/programmes", getPublishedProgrammes);
router.get("/api/programmes/:id/modules", getProgrammeModules);
router.post("/api/students/register", registerInterest);

// Admin routes
router.get("/api/admin/programmes", getAllProgrammes);
router.post("/api/admin/programmes", createProgramme);
router.put("/api/admin/programmes/:id/publish", togglePublish);
router.delete("/api/admin/programmes/:id", deleteProgramme);

export default router;