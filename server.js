const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('books.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    book_title TEXT,
    book_author TEXT,
    quantity INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(book_id) REFERENCES books(id)
  )`);

  db.run(`INSERT OR IGNORE INTO books (id, title, author, image) VALUES 
    (1, 'Harry Potter', 'J.K. Rowling', "https://d5i0fhmkm8zzl.cloudfront.net/9780545790352_2.jpg"),
    (2, 'Lord of Rings', 'J.R.R. Tolkien', "https://m.media-amazon.com/images/I/7125%2B5E40JL.jpg"),
    (3, '1984', 'George Orwell', "https://book-website.com/wp-content/uploads/2023/10/nineteen-eighty-four-1984-george.jpg")`);
});

app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', (err, books) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(books);
  });
});

app.post('/api/checkout', (req, res) => {
  const { items } = req.body; // [{bookId, quantity}, ...]

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid.' });
  }

  db.serialize(() => {
    const insertOrder = db.prepare(`INSERT INTO orders (book_id, book_title, book_author, quantity) VALUES (?, ?, ?, ?)`);

    // Helper to process items sequentially with callbacks
    const processItem = (index) => {
      if (index >= items.length) {
        insertOrder.finalize();
        return res.json({ success: true, message: 'Order saved successfully.' });
      }

      const item = items[index];

      // Fetch book details by id
      db.get('SELECT title, author FROM books WHERE id = ?', [item.bookId], (err, row) => {
        if (err || !row) {
          // Skip or handle error, here skipping the item
          console.error(`Book not found for id ${item.bookId}`);
          processItem(index + 1);
        } else {
          insertOrder.run(item.bookId, row.title, row.author, item.quantity, (err) => {
            if (err) console.error('Insert order error:', err);
            processItem(index + 1);
          });
        }
      });
    };

    processItem(0);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
