import { Router } from "https://deno.land/x/oak/mod.ts";
import { getPublishedProgrammes, getAllProgrammes } from "./controllers/programmeController.js";
import { registerInterest } from "./controllers/studentController.js";
import { getProgrammeModules } from "./controllers/moduleController.js"; // <-- Add this import

const router = new Router();

// Student-facing routes
router.get("/api/programmes", getPublishedProgrammes);
router.get("/api/programmes/:id/modules", getProgrammeModules); // <-- Add this route
router.post("/api/students/register", registerInterest);

// Admin routes
router.get("/api/admin/programmes", getAllProgrammes);

export default router;