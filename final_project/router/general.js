const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Promise-based helper functions for Tasks 10-13
const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject({ status: 500, message: "Error fetching book list" });
        }
    });
};

const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });
};

const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        let matchingBooks = [];
        const keys = Object.keys(books);
        keys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "Author not found" });
        }
    });
};

const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        let matchingBooks = [];
        const keys = Object.keys(books);
        keys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "Title not found" });
        }
    });
};

// Task 1 & Task 10: Get the book list available in the shop using Promise / async-await
public_users.get('/', function (req, res) {
    getAllBooks()
        .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
        .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 2 & Task 11: Get book details based on ISBN using Promise / async-await
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
        .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
        .catch((err) => res.status(err.status || 404).json({ message: err.message }));
});

// Task 3 & Task 12: Get book details based on author using Promise / async-await
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getBooksByAuthor(author)
        .then((booksByAuthor) => res.status(200).send(JSON.stringify(booksByAuthor, null, 4)))
        .catch((err) => res.status(err.status || 404).json({ message: err.message }));
});

// Task 4 & Task 13: Get all books based on title using Promise / async-await
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBooksByTitle(title)
        .then((booksByTitle) => res.status(200).send(JSON.stringify(booksByTitle, null, 4)))
        .catch((err) => res.status(err.status || 404).json({ message: err.message }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Async-await with Axios helper functions for Tasks 10-13
const getBookListAxios = async (baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookByISBNAxios = async (isbn, baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookByAuthorAxios = async (author, baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookByTitleAxios = async (title, baseUrl = 'http://localhost:5000') => {
    try {
        const response = await axios.get(`${baseUrl}/title/${title}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.getBookListAxios = getBookListAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBookByAuthorAxios = getBookByAuthorAxios;
module.exports.getBookByTitleAxios = getBookByTitleAxios;
