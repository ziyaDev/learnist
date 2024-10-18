import { NextRequest } from 'next/server';

export const parse = (req: NextRequest) => {
  let domain = req.headers.get('host') as string;
  // path is the path of the URL (e.g. example.com/2123/dashboard -> /2123/dashboard)
  let path = req.nextUrl.pathname;
  const tenant = getTenant(path);

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : '';
  const fullPath = `${path}${searchParamsString}`;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  const key = decodeURIComponent(path.split('/')[1]); // key is the first part of the path (e.g. dub.sh/stats/github -> stats)
  const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. d.to/github/repo -> github/repo)

  return { domain, path, fullPath, key, fullKey, tenant, searchParamsString };
};

export const getTenant = (pathname: string) => {
  const regex = new RegExp(`^/([a-zA-Z0-9]+)(/.*)?$`);
  const match = pathname.match(regex);
  if (match) {
    return match[1]; // Return tenant ID
  }
  return null; // Return null if no match found
};
