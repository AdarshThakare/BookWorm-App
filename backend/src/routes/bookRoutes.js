import express from "express";
import {
  addBook,
  getBooks,
  deleteBook,
  myBook,
} from "../controllers/bookController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", protectRoute, addBook);
router.get("/", protectRoute, getBooks);
router.delete("/:id", protectRoute, deleteBook);
router.get("/user", protectRoute, myBook);
export default router;
