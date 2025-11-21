/* eslint-env browser */

const SESSION_KEY = 'letterboxd-oauth-demo/session';
const PREF_KEY = 'letterboxd-oauth-demo/prefs';
const DEFAULT_AUTHORIZE_URL = 'https://letterboxd.com/oauth/authorize';

const form = document.getElementById('oauth-form');
const statusLog = document.getElementById('status-log');
const tokenPanel = document.getElementById('token-panel');
const tokenOutput = document.getElementById('token-output');
const refreshButton = document.getElementById('refresh-token');
const clearButton = document.getElementById('clear-session');

function log(message, isError = false) {
  const entry = document.createElement('span');
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  if (isError) {
    entry.style.color = '#ff7676';
  }

  statusLog.prepend(entry);
}

function savePreferences(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

function loadPreferences() {
  const stored = localStorage.getItem(PREF_KEY);
  if (!stored) return;

  try {
    const prefs = JSON.parse(stored);
    form.apiKey.value = prefs.apiKey ?? '';
    form.redirectUri.value = prefs.redirectUri ?? '';
    form.authorizeUrl.value = prefs.authorizeUrl ?? DEFAULT_AUTHORIZE_URL;
    form.scope.value = prefs.scope ?? '';
  } catch (err) {
    console.warn('Unable to load saved preferences', err); // eslint-disable-line no-console
  }
}

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function loadSession() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (err) {
    console.warn('Unable to parse session payload', err); // eslint-disable-line no-console
    return null;
  }
}

function clearSession(message = 'Session cleared.') {
  sessionStorage.removeItem(SESSION_KEY);
  tokenPanel.hidden = true;
  tokenOutput.value = '';
  log(message);
}

function base64UrlEncode(data) {
  const binary = Array.from(data, byte => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function createPkcePair() {
  const random = new Uint8Array(64);
  crypto.getRandomValues(random);

  const codeVerifier = base64UrlEncode(random);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const codeChallenge = base64UrlEncode(new Uint8Array(digest));

  return { codeVerifier, codeChallenge };
}

function buildAuthorizationUrl({ apiKey, authorizeUrl, redirectUri, codeChallenge, scope, state }) {
  const url = new URL(authorizeUrl || DEFAULT_AUTHORIZE_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', apiKey);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  if (scope) {
    url.searchParams.set('scope', scope.trim());
  }

  if (state) {
    url.searchParams.set('state', state);
  }

  return url.toString();
}

async function exchangeAuthorizationCode(code, returnedState) {
  const session = loadSession();
  if (!session) {
    log('Cannot exchange code because session data is missing.', true);
    return;
  }

  if (session.state && returnedState && session.state !== returnedState) {
    log('State mismatch detected. Aborting exchange.', true);
    return;
  }

  log('Exchanging authorization code for tokens...');

  const response = await fetch('/api/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: session.apiKey,
      apiSecret: session.apiSecret,
      code,
      codeVerifier: session.codeVerifier,
      redirectUri: session.redirectUri,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    log(payload.error || 'Failed to exchange authorization code.', true);
    return;
  }

  tokenPanel.hidden = false;
  tokenOutput.value = JSON.stringify(payload, null, 2);
  log('Success! Access token ready.');

  saveSession({
    ...session,
    codeVerifier: undefined,
    state: undefined,
    refreshToken: payload.refresh_token,
  });
}

async function refreshAccessToken() {
  const session = loadSession();
  if (!session?.refreshToken) {
    log('No refresh token available for this session.', true);
    return;
  }

  log('Refreshing access token...');

  const response = await fetch('/api/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: session.apiKey,
      apiSecret: session.apiSecret,
      refreshToken: session.refreshToken,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    log(payload.error || 'Unable to refresh token.', true);
    return;
  }

  tokenOutput.value = JSON.stringify(payload, null, 2);
  log('Access token refreshed.');

  saveSession({
    ...session,
    refreshToken: payload.refresh_token ?? session.refreshToken,
  });
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  const apiKey = form.apiKey.value.trim();
  const apiSecret = form.apiSecret.value.trim();
  const redirectUri = form.redirectUri.value.trim();
  const authorizeUrl = form.authorizeUrl.value.trim() || DEFAULT_AUTHORIZE_URL;
  const scope = form.scope.value.trim();

  if (!apiKey || !apiSecret || !redirectUri) {
    log('Please provide API key, secret, and redirect URI.', true);
    return;
  }

  savePreferences({ apiKey, redirectUri, authorizeUrl, scope });

  const pkce = await createPkcePair();
  const state = crypto.randomUUID();

  saveSession({
    apiKey,
    apiSecret,
    redirectUri,
    authorizeUrl,
    codeVerifier: pkce.codeVerifier,
    state,
    scope,
  });

  const authorizationUrl = buildAuthorizationUrl({
    apiKey,
    authorizeUrl,
    redirectUri,
    codeChallenge: pkce.codeChallenge,
    scope,
    state,
  });

  log('Redirecting to Letterboxd for authorization...');
  window.location.assign(authorizationUrl);
});

refreshButton.addEventListener('click', () => {
  refreshAccessToken().catch(err => log(err.message, true));
});

clearButton.addEventListener('click', () => {
  clearSession();
});

window.addEventListener('load', () => {
  loadPreferences();

  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  if (code) {
    exchangeAuthorizationCode(code, state).catch(err => log(err.message, true));
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
