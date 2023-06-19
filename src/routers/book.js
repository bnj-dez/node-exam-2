import { Router } from "express";
import { updateBook, getBook, addBook, getBooks, deleteBook } from "../controller/book.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const booksRouter = Router();

booksRouter.get("", getBooks);
booksRouter.post("", addBook);
booksRouter.get("/:id", getBook);
booksRouter.put("/:id", updateBook);
booksRouter.use(isAuthenticated);
booksRouter.delete("/:id", deleteBook);

export default booksRouter;