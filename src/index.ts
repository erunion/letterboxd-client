import type * as defs from './definitions';
import type { Auth } from './lib/core';

import { MissingAccessTokenError } from 'lib/errors';

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

  // public comment = {};
  // public contributor = {};
  // public filmCollection = {};
  // public film = {};
  // public list = {};
  // public logEntry = {};

  public me = {
    /**
     * Get details about the authenticated member.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--me}
     */
    get: () => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        | { status: 200; data: defs.MemberAccount }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'get',
        path: '/me',
        auth: this.credentials,
      });
    },

    /**
     * Update the profile settings for the authenticated member.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--me}
     * @param params
     */
    update: (params: defs.MemberSettingsUpdateRequest) => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        | { status: 200; data: defs.MemberSettingsUpdateResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'patch',
        path: '/me',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Deregister a device so it no longer receives push notifications.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--me-deregister-push-notifications}
     * @param params
     */
    deregisterPushNotifications: (params: defs.DeregisterPushNotificationsRequest) => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        { status: 204; data: never } | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'post',
        path: '/me/deregister-push-notifications',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Deactivate account.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--me-disable}
     * @param params
     */
    deactivate: (params: defs.DisableAccountRequest) => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        { status: 204; data: never } | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'post',
        path: '/me/disable',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Register a device so it can receive push notifications. Letterboxd uses Firebase to send
     * notifications, so the token provided must be obtained from Firebase.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param params
     */
    registerPushNotifications: (params: defs.RegisterPushNotificationsRequest) => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        { status: 204; data: never } | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'post',
        path: '/me/register-push-notifications',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Request a validation link via email.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)). If the email address associated
     * with a member’s account has not been validated and the validation link has expired or been
     * lost, use this endpoint to request a new validation link.
     */
    validationRequest: () => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        | { status: 204; data: never; reason: 'Success (the email was dispatched if it matched an existing account)' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | {
            status: 403;
            data: never;
            reason: 'The authenticated member’s email address was already successfully validated';
          }
        | {
            status: 429;
            data: never;
            reason: 'Too many validation requests have been made (the email is probably in the member’s spam or junk folder)';
          }
      >({
        method: 'post',
        path: '/me/validation-request',
        auth: this.credentials,
      });
    },
  };

  public member = {
    /**
     * A cursored window over the list of members.
     *
     * Use the ‘next’ cursor to move through the list.
     * @see {@link https://api-docs.letterboxd.com/#path--members}
     */
    get: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * Defaults to `Date`, which has different semantics based on the request:
       *
       *  - When `review` is specified, members who most recently liked the review appear first.
       *  - When `list` is specified, members who most recently liked the list appear first.
       *  - When `film` is specified and `filmRelationship=Watched`, members who most recently
       *    watched the film appear first.
       *  - When `film` is specified and `filmRelationship=Liked`, members who most recently liked
       *    the film appear first.
       *  - When `film` is specified and `filmRelationship=InWatchlist`, members who most recently
       *    added the film to their watchlist appear first.
       *  - When `member` is specified and `memberRelationship=IsFollowing`, most recently followed
       *    members appear first.
       *  - When `member` is specified and `memberRelationship=IsFollowedBy`, most recent followers
       *    appear first.
       *
       * Otherwise, members who most recently joined the site appear first.
       *
       * The `*WithFriends` values are only available to authenticated members and consider
       * popularity amongst the member’s friends.
       */
      sort?:
        | 'Date'
        | 'Name'
        | 'MemberPopularity'
        | 'MemberPopularityThisWeek'
        | 'MemberPopularityThisMonth'
        | 'MemberPopularityThisYear'
        | 'MemberPopularityWithFriends'
        | 'MemberPopularityWithFriendsThisWeek'
        | 'MemberPopularityWithFriendsThisMonth'
        | 'MemberPopularityWithFriendsThisYear';

      /**
       * Specify the LID of a member to return members who follow or are followed by that member.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `IsFollowing`, which returns the
       * list of members followed by the `member`. Use `IsFollowedBy` to return the list of members
       * that follow the `member`.
       */
      memberRelationship?: 'IsFollowing' | 'IsFollowedBy';

      /**
       * Specify the LID of a film to return members who have interacted with that film.
       */
      film?: string;

      /**
       * Must be used in conjunction with `film`. Defaults to `Watched`, which returns the list of
       * members who have seen the `film`. Specify the type of relationship to limit the returned
       * members accordingly. You must specify a `member` in order to use the `InWatchlist`
       * relationship.
       */
      filmRelationship?:
        | 'Ignore'
        | 'Watched'
        | 'NotWatched'
        | 'Liked'
        | 'NotLiked'
        | 'Rated'
        | 'NotRated'
        | 'InWatchlist'
        | 'NotInWatchlist'
        | 'Favorited';

      /**
       * Specify the LID of a list to return members who like that list.
       */
      list?: string;

      /**
       * Specify the LID of a review to return members who like that review.
       */
      review?: string;
    }) => {
      return request<{ status: 200; data: defs.MembersResponse }>({
        method: 'get',
        path: '/members',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get a list of pronouns supported by the `PATCH` [/me](https://api-docs.letterboxd.com/#operation--me-patch)
     * endpoint.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--members-pronouns}
     */
    getPronouns: () => {
      return request<{ status: 200; data: defs.PronounsResponse }>({
        method: 'get',
        path: '/members/pronouns',
        auth: this.credentials,
      });
    },

    /**
     * Create a new account.
     *
     * Use this endpoint to register a new member account with the Letterboxd network. Usernames
     * must be between 2 and 15 characters long and may only contain upper or lowercase letters,
     * numbers or the underscore (`_`) character.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--members-register}
     * @param params
     */
    register: (params: defs.RegisterRequest) => {
      return request<
        | { status: 201; data: defs.Member }
        | { status: 400; data: never; reason: 'The username was already taken or is invalid' }
      >({
        method: 'post',
        path: '/members/register',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details about a member by ID.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--member--id-}
     * @param id The LID of the member.
     */
    getMember: (id: string) => {
      return request<
        | { status: 200; data: defs.Member }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * A cursored window over the activity for a member.
     *
     * Use the ‘next’ cursor to move through the list.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--activity}
     * @param id The LID of the member.
     * @param params
     */
    getMemberActivity: (
      id: string,
      params: {
        /**
         * The pagination cursor.
         */
        cursor?: string;

        /**
         * The number of items to include per page (default is `20`, maximum is `100`).
         */
        perPage?: number;

        /**
         * Only supported for paying members.
         *
         * Use `include` to specify the subset of activity to be returned. If neither `include` nor
         * `exclude` is set, the activity types included depend on the `where` parameter:
         *
         *  - If `where=OwnActivity` is specified, all activity except `FilmLikeActivity`,
         *    `FilmWatchActivity` and `InvitationAcceptedActivity` is included.
         *  - Otherwise all activity except `FilmLikeActivity`, `FilmWatchActivity`,
         *    `FilmRatingActivity`, `FollowActivity`, `RegistrationActivity` and
         *    `InvitationAcceptedActivity` is included.
         *
         * These defaults mimic those shown on the website.
         */
        include?:
          | 'ReviewActivity'
          | 'ReviewCommentActivity'
          | 'ReviewLikeActivity'
          | 'ListActivity'
          | 'ListCommentActivity'
          | 'ListLikeActivity'
          | 'StoryActivity'
          | 'DiaryEntryActivity'
          | 'FilmRatingActivity'
          | 'FilmWatchActivity'
          | 'FilmLikeActivity'
          | 'WatchlistActivity'
          | 'FollowActivity'
          | 'RegistrationActivity'
          | 'InvitationAcceptedActivity';

        /**
         * *Only supported for paying members.*
         *
         * @deprecated Use `include` instead.
         */
        exclude?:
          | 'ReviewActivity'
          | 'ReviewCommentActivity'
          | 'ReviewLikeActivity'
          | 'ListActivity'
          | 'ListCommentActivity'
          | 'ListLikeActivity'
          | 'StoryActivity'
          | 'DiaryEntryActivity'
          | 'FilmRatingActivity'
          | 'FilmWatchActivity'
          | 'FilmLikeActivity'
          | 'WatchlistActivity'
          | 'FollowActivity'
          | 'RegistrationActivity'
          | 'InvitationAcceptedActivity';

        /**
         * Use `where` to reduce the subset of activity to be returned. If `where` is not set, all
         * default activity types relating to the member are returned. If multiple values are
         * supplied, only activity matching all terms will be returned, e.g.
         * `where=OwnActivity&where=NotIncomingActivity` will return all activity by the member
         * except their comments on their own lists and reviews. `NetworkActivity` is activity
         * performed either by the member or their followers. Use
         * `where=NetworkActivity&where=NotOwnActivity` to only see activity from followers. If
         * you don’t specify any of `NetworkActivity`, `OwnActivity` or `NotIncomingActivity`, you
         * will receive activity related to the member’s content from members outside their network
         * (e.g. comments and likes on the member’s lists and reviews).
         */
        where?: 'OwnActivity' | 'NotOwnActivity' | 'IncomingActivity' | 'NotIncomingActivity' | 'NetworkActivity';

        /**
         * Whether to include activity related to adult content. Default to `false`.
         */
        adult?: boolean;
      }
    ) => {
      return request<
        | { status: 200; data: defs.ActivityResponse }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}/activity`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get the list of a member’s tags, or those that match an optional search prefix.
     *
     * The tags will be returned in order of relevance. All tags previously used by the member will
     * be returned if no search prefix is specified.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--list-tags-2}
     * @param id The LID of the member.
     * @param params
     */
    getMemberListTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. “pro” will match “pro”, “project” and “Professional”.
         * An empty `input` will match all tags.
         */
        input?: string;
      }
    ) => {
      return request<
        | { status: 200; data: defs.MemberTagsResponse }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}/list-tags-2`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get the list of a member’s tags, or those that match an optional search prefix.
     *
     * The tags will be returned in order of relevance. All tags previously used by the member will
     * be returned if no search prefix is specified.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--log-entry-tags}
     * @param id The LID of the member.
     * @param params
     */
    getMemberLogEntryTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. “pro” will match “pro”, “project” and “Professional”.
         * An empty `input` will match all tags.
         */
        input: string;
      }
    ) => {
      return request<
        | { status: 200; data: defs.MemberTagsResponse }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}/log-entry-tags`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details of the authenticated member’s relationship with another member by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--me}
     * @param id The LID of the other member.
     */
    getMemberRelationship: (id: string) => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        | { status: 200; data: defs.MemberRelationship }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Report a member by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the member.
     * @param params
     */
    reportMember: (id: string, params: defs.ReportMemberRequest) => {
      if (!this.credentials.accessToken) {
        throw new MissingAccessTokenError();
      }

      return request<
        | { status: 204; data: never }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'post',
        path: `/member/${id}/report`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get statistical data about a member by ID.
     *
     * @param id The LID of the member.
     */
    getMemberStatistics: (id: string) => {
      return request<
        | { status: 200; data: defs.MemberStatistics }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}/statistics`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of a member’s public watchlist by ID.
     *
     * The response will include the film relationships for the signed-in member, the watchlist’s
     * owner, and the member indicated by the `member` LID if specified (the `member` and
     * `memberRelationship` parameters are optional, and can be used to perform comparisons between
     * the watchlist owner and another member). Use the
     * [/film/{id}/me](https://api-docs.letterboxd.com/#path--film--id--me) endpoint to add or
     * remove films from a member’s watchlist.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--watchlist}
     * @param id The LID of the member.
     * @param params
     */
    getMemberWatchlist: (
      id: string,
      params: {
        /**
         * The pagination cursor.
         */
        cursor?: string;

        /**
         * The number of items to include per page (default is `20`, maximum is `100`).
         */
        perPage?: number;

        /**
         * Specify up to 100 Letterboxd IDs or TMDB IDs prefixed with `tmdb:`, or IMDB IDs prefixed
         * with `imdb:`
         */
        filmId?: string[];

        /**
         * Specify the LID of a genre to limit films to those within the specified genre.
         */
        genre?: string;

        /**
         * Specify the LID of a film to limit films to those similar to the specified film.
         *
         * @private First party API clients only
         */
        similarTo?: string;

        /**
         * FIRST PARTY Specify the code of a theme to limit films to those within the specified
         * theme.
         *
         * @private First party API clients only
         */
        theme?: string;

        /**
         * FIRST PARTY Specify the code of a minigenre to limit films to those within the specified
         * minigenre.
         *
         * @private First party API clients only
         */
        minigenre?: string;

        /**
         * FIRST PARTY Specify the code of a nanogenre to limit films to those within the specified
         * nanogenre.
         *
         * @private First party API clients only
         */
        nanogenre?: string;

        /**
         * Specify the LID of up to 100 genres to limit films to those within all of the specified
         * genres.
         */
        includeGenre?: string[];

        /**
         * Specify the LID of up to 100 genres to limit films to those within none of the specified
         * genres.
         */
        excludeGenre?: string[];

        /**
         * Specify the ISO 3166-1 defined code of the country to limit films to those produced in
         * the specified country.
         */
        country?: string;

        /**
         * Specify the ISO 639-1 defined code of the language to limit films to those using the
         * specified spoken language.
         */
        language?: string;

        /**
         * Specify the starting year of a decade (must end in 0) to limit films to those released
         * during the decade.
         */
        decade?: number;

        /**
         * Specify a year to limit films to those released during that year.
         */
        year?: number;

        /**
         * Specify the ID of a supported service to limit films to those available from that
         * service. The list of available services can be found by using the
         * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services)
         * endpoint.
         */
        service?: string;

        /**
         * Specify one or more values to limit the list of films accordingly.
         */
        where?:
          | 'Released'
          | 'NotReleased'
          | 'InWatchlist'
          | 'NotInWatchlist'
          | 'Logged'
          | 'NotLogged'
          | 'Rewatched'
          | 'NotRewatched'
          | 'Reviewed'
          | 'NotReviewed'
          | 'Owned'
          | 'NotOwned'
          | 'Customised'
          | 'NotCustomised'
          | 'Rated'
          | 'NotRated'
          | 'Liked'
          | 'NotLiked'
          | 'WatchedFromWatchlist'
          | 'Watched'
          | 'NotWatched'
          | 'FeatureLength'
          | 'NotFeatureLength'
          | 'Fiction'
          | 'Film'
          | 'TV';

        /**
         * Specify the LID of a member to limit the returned films according to the value set in
         * `memberRelationship `or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of
         * relationship to limit the returned films accordingly. Use `Ignore` if you only intend to
         * specify the member for use with `sort=MemberRating*`.
         */
        memberRelationship?:
          | 'Ignore'
          | 'Watched'
          | 'NotWatched'
          | 'Liked'
          | 'NotLiked'
          | 'Rated'
          | 'NotRated'
          | 'InWatchlist'
          | 'NotInWatchlist'
          | 'Favorited';

        /**
         * Must be used in conjunction with `member`. Defaults to `None`, which only returns films
         * from the member’s account. Use `Only` to return films from the member’s friends, and
         * `All` to return films from both the member and their friends.
         */
        includeFriends?: 'None' | 'All' | 'Only';

        /**
         * @deprecated Use `tagCode` instead.
         * @see params.tagCode
         */
        tag?: string;

        /**
         * Specify a tag code to limit the returned films to those tagged accordingly.
         */
        tagCode?: string;

        /**
         * Must be used with `tagCode`. Specify the LID of a member to focus the tag filter on the
         * member.
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
         * the member. Use `Only` to filter tags set by the member’s friends, and `All` to filter
         * tags set by both the member and their friends.
         */
        includeTaggerFriends?: 'None' | 'All' | 'Only';

        /**
         * The order in which the entries should be returned. Defaults to `Added`, which is the
         * order that the films were added to the watchlist, most recent first.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with `member` and are only
         * available when specifying a single member (i.e. `IncludeFriends=None`).
         *
         * DEPRECATED The `FilmPopularityThisWeek`, `FilmPopularityThisMonth` and
         * `FilmPopularityThisYear` options are deprecated, and have never worked.
         *
         * The `Rating*` options are deprecated in favor of `AverageRating*`.
         */
        sort?:
          | 'Added'
          | 'DateLatestFirst'
          | 'DateEarliestFirst'
          | 'Shuffle'
          | 'FilmName'
          | 'OwnerRatingHighToLow'
          | 'OwnerRatingLowToHigh'
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'ReleaseDateLatestFirst'
          | 'ReleaseDateEarliestFirst'
          | 'FilmDurationShortestFirst'
          | 'FilmDurationLongestFirst'
          | 'FilmPopularity'
          | 'RatingHighToLow'
          | 'RatingLowToHigh'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisYear';
      }
    ) => {
      return request<
        | { status: 200; data: defs.FilmsResponse }
        | { status: 403; data: never; reason: 'The specified member’s watchlist is private' }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'get',
        path: `/member/${id}/watchlist`,
        auth: this.credentials,
        params,
      });
    },
  };

  /**
   * Get recent news from the Letterboxd editors.
   *
   * @see {@link https://api-docs.letterboxd.com/#path--news}
   * @param params
   */
  public news = (params?: {
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
  };

  /**
   * @see {@link https://api-docs.letterboxd.com/#path--search}
   * @param params
   */
  public search = (params: {
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
  };

  public story = {
    /**
     * A cursored window over a list of stories.
     *
     * Use the ‘next’ cursor to move through the list.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--stories}
     * @param params
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
      return request<
        | { status: 200; data: defs.StoriesResponse } // Success
        | { status: 400; data: never } // Bad request
        | { status: 404; data: never } // No film, member, tag or list matches the specified ID.
      >({
        method: 'get',
        path: '/stories',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details of a story by ID.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--story--id-}
     * @param id The LID of the story.
     */
    getStory: (id: string) => {
      return request<
        | { status: 200; data: defs.Story } // Success
        | { status: 404; data: never } // No story matches the specified ID
      >({
        method: 'get',
        path: `/stories/${id}`,
        auth: this.credentials,
      });
    },
  };
}
