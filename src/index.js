const express = require('express');
const cors = require('cors');
const prisma = require('../prisma/client');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// === Posts Routes ===
app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany({ include: { comments: true } });
  res.json(posts);
});

app.post('/posts', async (req, res) => {
  const { title, content, imageUrl, tags } = req.body;
  const post = await prisma.post.create({
    data: { title, content, imageUrl, tags },
  });
  res.json(post);
});

app.delete('/posts/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.comment.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id } });
  res.status(204).end();
});

// === Comments Routes ===
app.get('/comments', async (req, res) => {
  const { postId } = req.query;
  const comments = await prisma.comment.findMany({ where: { postId: parseInt(postId) } });
  res.json(comments);
});

app.post('/comments', async (req, res) => {
  const { postId, text, imageUrl } = req.body;
  const comment = await prisma.comment.create({
    data: { postId, text, imageUrl },
  });
  res.json(comment);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
