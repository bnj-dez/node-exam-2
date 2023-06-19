import express from "express";
import path from "node:path";
import fs from "node:fs";

import { fileURLToPath } from "node:url";
import { bookExist, formHandler } from "../service/book.service.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// get all books
export const getBooks = (
  req,
  res
) => {
  try {
    const limit = 3;
    const fileToRead = path.join(__dirname, "..", "database", "library.json");
    let books = JSON.parse(fs.readFileSync(fileToRead, "utf-8")).books;

    const { search, sort, page } = req.query;
    if(search) {
      books = books.filter((book) => book.author.toLowerCase().includes(search.toLowerCase()));
    }
    if(sort === "desc") {
      //sort DESC
      books = books.sort((a, b) => {
        if (a.title > b.title) {
          return -1;
        }
        if (b.title > a.title) {
            return 1;
        }
        return 0;
      });
    } else {
      //sort ASC
      books = books.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (b.title < a.title) {
            return 1;
        }
        return 0;
      });
    }
    const countBook = books.length;
    // if page first element of page > count block, we use page as last page
    if(page && Number(page) * limit - limit > countBook) {
      page = Math.floor(countBook/limit);
    }
    // if page < 1 or not defined wet use page as first page
    if(page > 0) {
      books = books.slice(Number(page) * limit - limit, Number(page) * limit);
    } else  {
      books = books.slice(1 * limit - limit, 1 * limit);
    }
    return res.send(books);
  } catch (error) {
    return res.status(500).send("Une erreur s'est produite lors de la récupération des livres");
  }
}

// add one book
export const addBook = (
  req,
  res
) => {
  try {
    const {title, description, author} = req.body;

    // Verify input with Joi if error send array of messages error
    const isValid = formHandler(title, description, author);
    if (!isValid.status) {
      return res.status(400).send({ messages: isValid.messages });
    }

    const fileToRead = path.join(__dirname, "..", "database", "library.json");
    const books = JSON.parse(fs.readFileSync(fileToRead, "utf-8")).books;

    const lastInsertId = Math.max(...books.map(k => k.id));
    const newBook = {id: lastInsertId + 1, author: author, title: title, description: description};

    // Verify if book already exist (can t add a second book with same author AND title)
    const isExisting = bookExist(newBook, books);
    if(isExisting) {
      return res.status(500).send(`Un livre du même nom (${newBook.title}) éxiste déjà pour l'auteur "${newBook.author}"`);
    }

    books.push(newBook);
    fs.writeFileSync(fileToRead, JSON.stringify({books: books}, null, 4), "utf-8");
    return res.send(`Votre livre '${title}' à bien été ajouté`);
  } catch (error) {
    return res.status(500).send("Une erreur s'est produite lors de la récupération des livres");
  }
}

// get 1 book by id
export const getBook = (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);
    const fileToRead = path.join(__dirname, "..", "database", "library.json");
    const books = JSON.parse(fs.readFileSync(fileToRead, "utf-8")).books
    const bookIndex = books.findIndex((book) => Number(book.id) === id);

    if(bookIndex === -1) {
      return res.status(500).send(`Aucun livre trouvé pour l'id "${id}"`);
    }
    return res.send(books[bookIndex]);
  } catch (error) {
    return res.status(500).send("Une erreur s'est produite lors de la récupération du livre");
  }
}

// delete 1 book by id
export const deleteBook = (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);
    const fileToRead = path.join(__dirname, "..", "database", "library.json");
    const books = JSON.parse(fs.readFileSync(fileToRead, "utf-8")).books;

    // Verify if id exist
    const bookIndex = books.findIndex((book) => Number(book.id) === id);
    if(bookIndex === -1) {
      return res.status(500).send(`Aucun livre trouvé pour l'id "${id}"`);
    }

    // Filter all book who are not equal to parameter id and rewrite json file
    fs.writeFileSync(fileToRead, JSON.stringify({
      books: books.filter((book) => Number(book.id) !== id)
    }, null, 4), "utf-8");

    return res.send(`Le livre avec l'id "${id}" à bien été supprimé`);
  } catch (error) {
    return res.status(500).send("Une erreur s'est produite lors de la récupération du livre");
  }
}

// update one book
export const updateBook = (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);
    const {title, description, author} = req.body;
    
    // Verify input with Joi if error send array of messages error
    const isValid = formHandler(title, description, author);
    if (!isValid.status) {
      return res.status(400).send({ messages: isValid.messages });
    }

    const fileToRead = path.join(__dirname, "..", "database", "library.json");
    const books = JSON.parse(fs.readFileSync(fileToRead, "utf-8")).books;
    // Verify if id exist
    const bookIndex = books.findIndex((book) => Number(book.id) === id);
    if(bookIndex === -1) {
      return res.status(500).send(`Aucun livre trouvé pour l'id "${id}"`);
    }
    const updateBook = {id: id, author: author, title: title, description: description};

    // Verify if book already exist on other book than this id (can t add a second book with same author AND title)
    const isExisting = bookExist(updateBook, books);

    if(isExisting) {
      return res.status(500).send(`Un livre du même nom (${updateBook.title}) éxiste déjà pour l'auteur "${updateBook.author}"`);
    }

    const foundIndex = books.findIndex(book => Number(book.id) === id);
    books[foundIndex] = {...updateBook};
    fs.writeFileSync(fileToRead, JSON.stringify({
      books: books
    }, null, 4), "utf-8");
    return res.send(`Votre livre avec l'id '${id}' à bien été modifié`);
  } catch (error) {
    return res.status(500).send("Une erreur s'est produite lors de la récupération des livres");
  }
}