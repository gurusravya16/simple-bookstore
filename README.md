# simple-bookstore
This is a small online bookstore built with React (for the website) and Node.js with Express (for the server). It uses SQLite to store book info and orders.  You can browse books, add or remove them from your cart, and then checkout. When you checkout, your order is saved in the database with the book details and quantity.
# Simple Bookstore

A basic full-stack online bookstore app built with React, Node.js, Express, and SQLite.

## Features
- Browse a list of books with images, titles, and authors
- Add or remove books from your cart with quantity counters
- Checkout to save your order details in the database

## Technologies Used
- Frontend: React, Bootstrap for styling
- Backend: Node.js, Express
- Database: SQLite

## How It Works
- The frontend fetches book data from the backend API and displays it.
- You can add/remove books to/from your cart.
- When you checkout, your order with book details and quantities is saved in the SQLite database.


## Project Setup Commands

```bash
# Create folders
mkdir simple-bookstore
cd simple-bookstore
mkdir backend frontend

# Setup backend
cd backend
npm init -y
npm install express sqlite3 cors

# Setup frontend
cd ../frontend
npx create-react-app .
npm install axios bootstrap

