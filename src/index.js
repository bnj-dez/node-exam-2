import express from "express";
import { logger } from "./middleware/logger.js";
import booksRouter from "./routers/book.js";
import session from "express-session";
import { login } from "./controller/login.controller.js";

const app = express();
const port = 3300;

app.use(express.json());

app.use(logger);

app.use(session({
  secret: "unTokenQuiEstCenséÊtreSecret",
  name: "user",
  resave: true,
  saveUninitialized: true
}));

app.get("/login", login);

app.use("/books", booksRouter);

app.use(function(req, res, next){
  res.status(404).send('404 page not found');
});

app.listen(port, () => {
    console.log("Serveur en écoute sur le port " + port);
});
