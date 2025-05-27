import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // First delete comments
      await prisma.comment.deleteMany({ where: { postId: Number(id) } });

      // Then delete the post
      await prisma.post.delete({ where: { id: Number(id) } });

      return res.status(200).json({ message: 'Post and related comments deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  if (req.method === 'PUT') {
    const { title, content, tags } = req.body;
    try {
      const updated = await prisma.post.update({
        where: { id: Number(id) },
        data: { title, content, tags },
      });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }

  res.setHeader('Allow', ['DELETE', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
