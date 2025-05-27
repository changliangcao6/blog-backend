import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: 'Missing postId in query' });
    }

    try {
      const comments = await prisma.comment.findMany({
        where: { postId: Number(postId) },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (method === 'POST') {
    const { postId, text, imageUrl } = req.body;

    if (!postId || !text) {
      return res.status(400).json({ error: 'Missing postId or text in request body' });
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          postId: Number(postId),
          text,
          imageUrl: imageUrl || null,
        },
      });
      return res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}