import Joi from "joi";

export const bookExist = (
  requestedBook,
  books,
) => {
  let existingBook;
  if(requestedBook.id) {
    existingBook = books.filter((book) => 
      book.author === requestedBook.author && 
      book.title === requestedBook.title &&
      Number(book.id) !== requestedBook.id
    );
  } else {
    existingBook = books.filter((book) => 
      book.author === requestedBook.author && 
      book.title === requestedBook.title
    );  
  }

  if (existingBook.length) {
    return true;
  }
  return false;
}

export function formHandler(
  title,
  description,
  author
) {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.base": `title: '${title}' should be a type of 'text'`,
        "string.empty": `title: '${title}' cannot be an empty field`,
        "string.min": `title: '${title}' should have a minimum length of {#limit}`,
        "string.max": `title: '${title}' should have a maximum length of {#limit}`,
        "any.required": `title: '${title}' is a required field`,
      }),
    description: Joi.string()
      .allow('')
      .messages({
        "string.base": `description: '${description}' should be a type of 'text'`,
      }),
    author: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.base": `author: '${author}' should be a type of 'text'`,
        "string.empty": `author: '${author}' cannot be an empty field`,
        "string.min": `author: '${author}' should have a minimum length of {#limit}`,
        "string.max": `author: '${author}' should have a maximum length of {#limit}`,
        "any.required": `author: '${author}' is a required field`,
      }),
  }).options({ abortEarly: false });

  const { error } = schema.validate({ title, description, author });

  if (error) {
    const arrayError = error.details.map((value) => {
      return value.message;
    });
    return { status: false, messages: arrayError };
  }

  return { status: true };
}