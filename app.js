import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
];


const events = [];


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({ error: 'Invalid Credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
  res.send({ token });
});


app.post('/events', (req, res) => {
  const { name, description, date, time, category } = req.body;
  const event = { name, description, date, time, category };
  events.push(event);
  res.send(event);
});


app.get('/events/categories', (req, res) => {
  const categories = events.reduce((categories, event) => {
    if (!categories.includes(event.category)) {
      categories.push(event.category);
    }
    return categories;
  }, []);

  res.send(categories);
});

app.post('/events/:id/reminders', (req, res) => {
  const { id } = req.params;
  const event = events.find((event) => event.id === parseInt(id));
  if (!event) {
    return res.status(404).send({ error: 'Event Not Found' });
  }

  const reminder = { event, time: req.body.time };

  res.send(reminder);
});


app.get('/events', (req, res) => {
  const { category, reminder } = req.query;
  const filteredEvents = events.filter((event) => {
    if (category && event.category !== category) {
      return false;
    }

    if (reminder && event.reminders.find((reminder) => reminder.time < Date.now())) {
      return false;
    }

    return true;
  });

  res.send(filteredEvents);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
