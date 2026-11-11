import type { Request, Response } from 'express';

export default function handler(_req: Request, res: Response) {
  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'aura-numerology-vercel-serverless',
  });
}
