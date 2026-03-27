import express from "express";
import {
  createService,
  deleteService,
  getAllService,
  updateService,          // ← add this import
} from "../controllers/serviceController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";

const serviceRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "image",  maxCount: 4 },
  { name: "avatar", maxCount: 1 },
]);

serviceRouter.post(  "/",    verifyToken, uploadFields, createService);
serviceRouter.get(   "/",                               getAllService);
serviceRouter.put(   "/:id", verifyToken, uploadFields, updateService);  // ← new
serviceRouter.delete("/:id", verifyToken,               deleteService);

export default serviceRouter;