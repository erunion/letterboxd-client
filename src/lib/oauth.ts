import crypto from 'node:crypto';

export const LETTERBOXD_OAUTH_AUTHORIZE_URL = 'https://api.letterboxd.com/api/v0/auth/authorize';

export type CodeChallengeMethod = 'plain' | 'S256';

export interface AuthorizationUrlOptions {
  baseUrl?: string;
  clientId: string;
  codeChallenge: string;
  codeChallengeMethod?: CodeChallengeMethod;
  redirectUri: string;
  responseType?: 'code';
  scope?: string[];
  state?: string;
}

const BASE64_URL_SAFE = /[+/=]/g;

function encodeBase64Url(buffer: Buffer | Uint8Array) {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(BASE64_URL_SAFE, char => {
      if (char === '+') return '-';
      if (char === '/') return '_';
      return '';
    });
}

export function createCodeVerifier(length = 64) {
  return encodeBase64Url(crypto.randomBytes(length));
}

export function createCodeChallenge(codeVerifier: string) {
  return encodeBase64Url(crypto.createHash('sha256').update(codeVerifier).digest());
}

export function createPkcePair(length = 64) {
  const codeVerifier = createCodeVerifier(length);
  const codeChallenge = createCodeChallenge(codeVerifier);

  return { codeVerifier, codeChallenge };
}

export function buildAuthorizationUrl({
  baseUrl = LETTERBOXD_OAUTH_AUTHORIZE_URL,
  clientId,
  codeChallenge,
  codeChallengeMethod = 'S256',
  redirectUri,
  responseType = 'code',
  scope,
  state,
}: AuthorizationUrlOptions) {
  const url = new URL(baseUrl);

  url.searchParams.set('response_type', responseType);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', codeChallengeMethod);

  if (scope?.length) {
    url.searchParams.set('scope', scope.join(' '));
  }

  if (state) {
    url.searchParams.set('state', state);
  }

  return url.toString();
}
