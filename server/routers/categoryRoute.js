import express from "express"
import { createCategory, deleteCategory, getAllCategory, updateCatgory } from "../controllers/categoryController.js"

const categoryRoute = express.Router()

categoryRoute.post("/",createCategory)
categoryRoute.get("/",getAllCategory)
categoryRoute.delete("/:id",deleteCategory)
categoryRoute.put("/:id",updateCatgory)

export default categoryRoute