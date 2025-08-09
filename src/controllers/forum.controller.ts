import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, content } = req.body;

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating post'
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.forumPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: { posts }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching posts'
    });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    res.json({
      status: 'success',
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching post'
    });
  }
};

export const createReply = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { content } = req.body;

    const reply = await prisma.forumReply.create({
      data: {
        content,
        userId,
        postId: id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: { reply }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating reply'
    });
  }
};

export const voteReply = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'

    const reply = await prisma.forumReply.findUnique({
      where: { id }
    });

    if (!reply) {
      return res.status(404).json({
        status: 'error',
        message: 'Reply not found'
      });
    }

    const updatedReply = await prisma.forumReply.update({
      where: { id },
      data: {
        upvotes: voteType === 'up' ? reply.upvotes + 1 : reply.upvotes,
        downvotes: voteType === 'down' ? reply.downvotes + 1 : reply.downvotes
      }
    });

    res.json({
      status: 'success',
      data: { reply: updatedReply }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error voting on reply'
    });
  }
}; 