import {
    agregarTarea,
    obtenerTarea,
    actualziarTarea,
    eliminarTarea,
    cambiarEstado,
} from "../controllers/tareaController.js";
import express from "express";
import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();

router.post("/", checkAuth, agregarTarea);
router.route("/:id")
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, actualziarTarea)
    .delete(checkAuth, eliminarTarea);


router.post("/estado/:id", checkAuth, cambiarEstado);

export default router