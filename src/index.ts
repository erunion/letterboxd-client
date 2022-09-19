import type * as defs from './definitions';
import type { Auth } from './lib/core';

import { request } from './lib/core';

export default class Client {
  private credentials: Auth = {};

  constructor(apiKey: string, apiSecret: string, accessToken?: string) {
    this.credentials.apiKey = apiKey;
    this.credentials.apiSecret = apiSecret;

    if (accessToken) {
      this.credentials.accessToken = accessToken;
    }
  }

  public auth = {
    /**
     * Request a link via email to reset the password for a member’s account.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-forgotten-password-request}
     */
    forgottenPasswordRequest: (body: defs.ForgottenPasswordRequest) => {
      return request<{ status: 204 } | { status: 400 } | { status: 429 }>({
        method: 'post',
        path: '/auth/forgotten-password-request',
        auth: this.credentials,
        body,
      });
    },

    /**
     * Generate a single-use token for the current member, which can be used to sign the member into
     * the Letterboxd website by passing it as the value of the urt query parameter.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-get-login-token}
     */
    getLoginToken: () => {
      return request<{ status: 200; res: defs.LoginTokenResponse } | { status: 400 } | { status: 401 }>({
        method: 'get',
        path: '/auth/get-login-token',
        auth: this.credentials,
      });
    },

    /**
     * @module Auth
     * @see {@link https://api-docs.letterboxd.com/#path--auth-revoke}
     */
    revokeAuth: () => {
      return request({
        method: 'post',
        path: '/auth/revoke',
        auth: this.credentials,
      });
    },

    /**
     * Use a member’s credentials to sign in and receive an authentication token.
     *
     * Use this endpoint to generate or refresh an auth token. See
     * [Authentication](https://api-docs.letterboxd.com/#auth) for more details.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-token}
     */
    requestAuthToken: (username: string, password: string) => {
      if (this.credentials.accessToken) {
        throw new Error(
          'You cannot retrieve tokens on a client that has already been configured with a token. Create a new client instance without providing any `accessToken` parameter to the constructor.'
        );
      }

      return request({
        method: 'post',
        path: '/auth/token',
        body: {
          grant_type: 'password',
          username,
          password,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    },

    /**
     * Check if a username is available to register.
     *
     * Use this endpoint to check the validity and availability of a given username. Usernames must
     * be between 2 and 15 characters long and may only contain upper or lowercase letters, numbers
     * or the underscore (`_`) character. Usernames associated with deactivated accounts are not
     * automatically released to the pool of available names (members will need to contact Letterboxd
     * Support for assistance).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-username-check}
     */
    usernameCheck: (username: string) => {
      return request<{ status: 200; data: defs.UsernameCheckResponse }>({
        method: 'get',
        path: '/auth/username-check',
        auth: this.credentials,
        params: {
          username,
        },
      });
    },
  };

  public comment = {
    /**
     * Update the message portion of a comment.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)). Comments may only be edited by
     * their owner.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--comment--id-}
     */
    getComment: (id: string, params: defs.CommentUpdateRequest) => {
      return request<{ status: 200; data: defs.CommentUpdateResponse }>({
        method: 'patch',
        path: `/comment/${id}`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Report a comment by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--comment--id--report}
     */
    reportComment: (id: string, params: defs.ReportCommentRequest) => {
      // | { status: 401 } | { status: 404 }
      return request<{ status: 204 }>({
        method: 'post',
        path: `/comment/${id}/report`,
        auth: this.credentials,
        params,
      });
    },
  };

  // public contributor = {};
  // public filmCollection = {};
  // public film = {};
  // public list = {};
  // public logEntry = {};
  // public me = {};
  // public member = {};

  public news = {
    /**
     * Get recent news from the Letterboxd editors.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--news}
     */
    getNews: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;
    }) => {
      return request<{ status: 200; data: defs.NewsResponse }>({
        method: 'get',
        path: '/news',
        params,
      });
    },
  };

  public search = {
    /**
     * @see {@link https://api-docs.letterboxd.com/#path--search}
     */
    search: (params: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * The word, partial word or phrase to search for.
       */
      input: string;

      /**
       * The type of search to perform. Defaults to `FullText`, which performs a standard search considering text in all
       * fields. `Autocomplete` only searches primary fields.
       */
      searchMethod?: 'FullText' | 'Autocomplete' | 'NamesAndKeywords';

      /**
       * The types of results to search for. Default to all SearchResultTypes.
       */
      include?: (
        | 'ContributorSearchItem'
        | 'FilmSearchItem'
        | 'ListSearchItem'
        | 'MemberSearchItem'
        | 'ReviewSearchItem'
        | 'TagSearchItem'
        | 'StorySearchItem'
        | 'ArticleSearchItem'
        | 'PodcastSearchItem'
      )[];

      /**
       * The type of contributor to search for. Implies `include=ContributorSearchItem`.
       */
      contributionType?:
        | 'Director'
        | 'CoDirector'
        | 'Actor'
        | 'Producer'
        | 'Writer'
        | 'Editor'
        | 'Cinematography'
        | 'ProductionDesign'
        | 'ArtDirection'
        | 'SetDecoration'
        | 'VisualEffects'
        | 'Composer'
        | 'Sound'
        | 'Costumes'
        | 'MakeUp'
        | 'Studio';

      /**
       * Whether to include adult content in search results. Default to `false`.
       */
      adult?: boolean;
    }) => {
      return request<{ status: 200; data: defs.SearchResponse }>({
        method: 'get',
        path: '/search',
        params,
      });
    },
  };

  public story = {
    /**
     * A cursored window over a list of stories.
     *
     * Use the ‘next’ cursor to move through the list.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--stories}
     */
    getStories: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * Defaults to `WhenUpdatedLatestFirst`, which returns stories that were most recently
       * created/updated first.
       */
      sort?:
        | 'WhenUpdatedLatestFirst'
        | 'WhenUpdatedEarliestFirst'
        | 'WhenPublishedLatestFirst'
        | 'WhenPublishedEarliestFirst'
        | 'WhenCreatedLatestFirst'
        | 'WhenCreatedEarliestFirst'
        | 'StoryTitle';

      /**
       * Specify the LID of a member to return stories that are owned by the member.
       */
      member?: string;

      /**
       * Specify `Published` to return the member’s stories that have been made public. Note that
       * unpublished stories for members other than the authenticated member are never returned.
       * Specify `NotPublished` to return the authenticated member’s stories that have not been made
       * public.
       */
      where?: ('Published' | 'NotPublished')[];
    }) => {
      // @fixme Adding these other possible returns kills the `StoriesResponse` typing on `data` for `status=200`.
      // | { status: 400 } | { status: 404 }
      return request<{ status: 200; data: defs.StoriesResponse }>({
        method: 'get',
        path: '/stories',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details of a story by ID.
     *
     * @module Story
     * @see {@link https://api-docs.letterboxd.com/#path--story--id-}
     */
    getStory: (id: string) => {
      // | { status: 404 }
      return request<{ status: 200; data: defs.Story }>({
        method: 'get',
        path: `/stories/${id}`,
        auth: this.credentials,
      });
    },
  };
}
