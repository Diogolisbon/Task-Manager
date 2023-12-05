const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 3000;

const db = new sqlite3.Database('./database.db');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, status, due_date } = req.body;
  const query = 'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)';
  db.run(query, [title, description, status, due_date], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('Task added successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



app.put('/tasks/:id', (req, res) => {
  const { title, description, status, due_date } = req.body;
  const taskId = req.params.id;
  const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?';
  db.run(query, [title, description, status, due_date, taskId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Task with id ${taskId} updated successfully`);
  });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.run(query, [taskId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`Task with id ${taskId} deleted successfully`);
  });
});



