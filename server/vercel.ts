import app from './server';

export default function handler(req: unknown, res: unknown) {
  // @vercel/node adapts Express apps automatically when exported as default
  // but to be explicit we call the app as a handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app as any)(req, res);
}

