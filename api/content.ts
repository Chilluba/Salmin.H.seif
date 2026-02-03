import { list, put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import type { SiteContent } from '../types';

const CONTENT_KEY = 'siteContent.json';
const BACKUP_KEY = 'siteContent.backup.json';

const getExistingBlobUrl = async () => {
  const { blobs } = await list({ prefix: CONTENT_KEY });
  const match = blobs.find((blob) => blob.pathname === CONTENT_KEY);
  return match?.url ?? null;
};

const fetchStoredContent = async () => {
  const url = await getExistingBlobUrl();
  if (!url) {
    return null;
  }
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as SiteContent;
};

const isAuthorized = (req: VercelRequest) => {
  const token = req.headers['x-admin-token'];
  const expected = process.env.ADMIN_TOKEN;
  return Boolean(expected && token === expected);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const storedContent = await fetchStoredContent();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(storedContent ?? DEFAULT_SITE_CONTENT);
  }

  if (req.method === 'POST') {
    if (!isAuthorized(req)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { content, expectedVersion } = req.body as {
      content?: SiteContent;
      expectedVersion?: number;
    };

    if (!content) {
      return res.status(400).json({ message: 'Missing content payload.' });
    }

    const storedContent = await fetchStoredContent();
    const currentVersion = storedContent?.meta?.version ?? 1;

    if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
      return res.status(409).json(storedContent ?? DEFAULT_SITE_CONTENT);
    }

    if (storedContent) {
      await put(BACKUP_KEY, JSON.stringify(storedContent), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
    }

    const updatedContent: SiteContent = {
      ...content,
      meta: {
        version: currentVersion + 1,
        updatedAt: new Date().toISOString(),
      },
    };

    await put(CONTENT_KEY, JSON.stringify(updatedContent), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(updatedContent);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ message: 'Method not allowed' });
}
