import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({ include: { comments: true } })
    res.json(posts)
  } else if (req.method === 'POST') {
    const { title, content, imageUrl, tags } = req.body
    const post = await prisma.post.create({
      data: { title, content, imageUrl, tags }
    })
    res.status(201).json(post)
  }
}
