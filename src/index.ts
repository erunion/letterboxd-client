import type * as defs from './definitions';
import type { Auth } from './lib/core';

import { request } from './lib/core';
import { MissingAccessTokenError } from './lib/errors';

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
     * Request a link via email to reset the password for a member's account.
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
     * the Letterboxd website by passing it as the value of the `urt` query parameter.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-get-login-token}
     */
    getLoginToken: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<{ status: 200; res: defs.LoginTokenResponse } | { status: 400 } | { status: 401 }>({
        method: 'get',
        path: '/auth/get-login-token',
        auth: this.credentials,
      });
    },

    /**
     * Revoke a users' access token.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-revoke}
     */
    revokeAuth: () => {
      if (this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request({
        method: 'post',
        path: '/auth/revoke',
        auth: this.credentials,
      });
    },

    /**
     * Use a member's credentials to sign in and receive an authentication token.
     *
     * Use this endpoint to generate or refresh an auth token. See
     * [Authentication](https://api-docs.letterboxd.com/#auth) for more details.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--auth-token}
     */
    requestAuthToken: (username: string, password: string) => {
      if (this.credentials.accessToken) {
        return Promise.reject(
          new Error(
            'You cannot retrieve tokens on a client that has already been configured with a token. Create a new client instance without providing any `accessToken` parameter to the constructor.'
          )
        );
      }

      return request<
        | { status: 200; data: defs.AccessToken }
        | {
            status: 400;
            data: defs.OAuthError;
            reason: 'The credentials were not correct for the member, or the account was not found';
          }
        | {
            status: 401;
            data: { message: string; type: string };
            reason: 'An invalid API key or computed signature was supplied.';
          }
      >({
        method: 'post',
        path: '/auth/token',
        auth: this.credentials,
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
     * @param id The LID of the comment/reply.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--comment--id-}
     */
    update: (id: string, params: defs.CommentUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.CommentUpdateResponse }
        | {
            status: 401;
            data: never;
            reason: 'There is no authenticated member, or the authenticated member does not own the resource';
          }
        | { status: 404; data: never; reason: 'No comment matches the specified ID' }
      >({
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
     * @param id The LID of the comment/reply.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--comment--id--report}
     */
    report: (id: string, params: defs.ReportCommentRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: never }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No comment matches the specified ID' }
      >({
        method: 'post',
        path: `/comment/${id}/report`,
        auth: this.credentials,
        params,
      });
    },
  };

  public contributor = {
    /**
     * Get details about a film contributor by ID.
     *
     * Contributors include the film's director(s), cast, crew and studio(s).
     *
     * @param id The LID of the contributor.
     * @see {@link https://api-docs.letterboxd.com/#path--contributor--id-}
     */
    getContributor: (id: string) => {
      return request<
        | { status: 200; data: defs.Contributor }
        | { status: 404; data: never; reason: 'No contributor matches the specified ID' }
      >({
        method: 'get',
        path: `/contributor/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * A cursored window over the list of contributions to films for a contributor.
     *
     * Use the `next` cursor to move through the list
     *
     * @param id The LID of the contributor.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--contributor--id--contributions}
     */
    getContributions: (
      id: string,
      params?: {
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
         * Specify the code of a theme to limit films to those within the specified theme.
         *
         * @private First party API clients only
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         *
         * @private First party API clients only
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
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
         * Specify the starting year of a decade (must end in `0`) to limit films to those released
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
          | 'NotRewatched,'
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
         * `memberRelationship` or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of
         * relationship to limit the returned films accordingly. Use `Ignore` if you only intend to
         * specify the member for use with `sort=MemberRating*`.
         *
         * @see params.member
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
         * from the member's account. Use `Only` to return films from the member's friends, and
         * `All` to return films from both the member and their friends.
         *
         * @see params.member
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
         *
         * @see params.tagCode
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
         * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter
         * tags set by both the member and their friends.
         *
         * @see params.tagger
         */
        includeTaggerFriends?: 'None' | 'All' | 'Only';

        /**
         * The order in which the films should be returned. Defaults to `FilmPopularity`, which is
         * an all-time measurement of the amount of activity the film has received. The
         * `*WithFriends` values are only available to signed-in members and consider popularity
         * amongst the signed-in member's friends.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with member and are only available
         * when specifying a single member (i.e. `IncludeFriends=None`).
         *
         * DEPRECATED The `Rating*` options are deprecated in favor of `AverageRating*`.
         */
        sort?:
          | 'Billing'
          | 'FilmName'
          | 'ReleaseDateLatestFirst'
          | 'ReleaseDateEarliestFirst'
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'RatingHighToLow'
          | 'RatingLowToHigh'
          | 'FilmDurationShortestFirst'
          | 'FilmDurationLongestFirst'
          | 'FilmPopularity'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisYear';

        /**
         * The type of contribution.
         */
        type?:
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
      }
    ) => {
      return request<
        | { status: 200; data: defs.FilmContributionsResponse }
        | { status: 404; data: never; reason: 'No contributor matches the specified ID' }
      >({
        method: 'get',
        path: `/contributor/${id}/contributions`,
        auth: this.credentials,
        params,
      });
    },
  };

  public filmCollection = {
    /**
     * Get details about a film collection by ID. The response will include the film relationships
     * for the signed-in member and the member indicated by the `member` LID if specified.
     *
     * @param id The LID of the film collection.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--film-collection--id-}
     */
    get: (
      id: string,
      params?: {
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
         * Specify the code of a theme to limit films to those within the specified theme.
         *
         * @private First party API clients only
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         *
         * @private First party API clients only
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
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
         * Specify the ISO 3166-1 defined code of the country to limit films to those produced in the
         * specified country.
         */
        country?: string;

        /**
         * Specify the ISO 639-1 defined code of the language to limit films to those using the
         * specified spoken language.
         */
        language?: string;

        /**
         * Specify the starting year of a decade (must end in `0`) to limit films to those released
         * during the decade.
         */
        decade?: number;

        /**
         * Specify a year to limit films to those released during that year.
         */
        year?: number;

        /**
         * Specify the ID of a supported service to limit films to those available from that service.
         * The list of available services can be found by using the
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
         * `memberRelationship` or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of
         * relationship to limit the returned films accordingly. Use `Ignore` if you only intend to
         * specify the member for use with `sort=MemberRating*`.
         *
         * @see params.member
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
         * from the member's account. Use `Only` to return films from the member's friends, and
         * `All` to return films from both the member and their friends.
         *
         * @see params.member
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
         *
         * @see params.tagCode
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
         * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter
         * tags set by both the member and their friends.
         *
         * @see params.tagger
         */
        includeTaggerFriends?: 'None' | 'All' | 'Only';

        /**
         * The order in which the films should be returned. Defaults to `FilmPopularity`, which is
         * an all-time measurement of the amount of activity the film has received. The
         * `*WithFriends` values are only available to signed-in members and consider popularity
         * amongst the signed-in member's friends.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with member and are only available
         * when specifying a single member (i.e. `IncludeFriends=None`).
         */
        sort?:
          | 'FilmName'
          | 'ReleaseDateLatestFirst'
          | 'ReleaseDateEarliestFirst'
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'FilmDurationShortestFirst'
          | 'FilmDurationLongestFirst'
          | 'FilmPopularity'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisYear'
          | 'FilmPopularityWithFriends'
          | 'FilmPopularityWithFriendsThisWeek'
          | 'FilmPopularityWithFriendsThisMonth'
          | 'FilmPopularityWithFriendsThisYear';
      }
    ) => {
      return request<
        | { status: 200; data: defs.FilmCollection }
        | { status: 404; data: never; reason: 'No film collection matches the specified ID' }
      >({
        method: 'get',
        path: `/film-collection/${id}`,
        auth: this.credentials,
        params,
      });
    },
  };

  public film = {
    /**
     * A cursored window over the list of films.
     *
     * Use the `next` cursor to move through the list. The response will include the film
     * relationships for the signed-in member and the member indicated by the `member` LID if
     * specified.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--films}
     */
    all: (params?: {
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
       * Specify the code of a theme to limit films to those within the specified theme.
       *
       * @private First party API clients only
       */
      theme?: string;

      /**
       * Specify the code of a minigenre to limit films to those within the specified minigenre.
       *
       * @private First party API clients only
       */
      minigenre?: string;

      /**
       * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
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
       * Specify the ISO 3166-1 defined code of the country to limit films to those produced in the
       * specified country.
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
       * Specify the ID of a supported service to limit films to those available from that service.
       * The list of available services can be found by using the
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
       * `memberRelationship` or to access the `MemberRating*` sort options.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of
       * relationship to limit the returned films accordingly. Use `Ignore` if you only intend to
       * specify the member for use with `sort=MemberRating*`.
       *
       * @see params.member
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
       * from the member's account. Use `Only` to return films from the member's friends, and `All`
       * to return films from both the member and their friends.
       *
       * @see params.member
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
       *
       * @see params.tagCode
       */
      tagger?: string;

      /**
       * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
       * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter tags
       * set by both the member and their friends.
       *
       * @see params.tagger
       */
      includeTaggerFriends?: 'None' | 'All' | 'Only';

      /**
       * The order in which the films should be returned. Defaults to `FilmPopularity`, which is an
       * all-time measurement of the amount of activity the film has received. The `*WithFriends`
       * values are only available to signed-in members and consider popularity amongst the
       * signed-in member's friends. The `Date` values are only available when member is specified
       * and using a `memberRelationship` of `Watched`, `Liked`, `Rated` or `InWatchlist`. The
       * `BestMatch` sort order is only available when specifying one of the following: `similarTo`,
       * `theme`, `minigenre` or `nanogenre`.
       *
       * The `AuthenticatedMember*` values are only available to signed-in members.
       *
       * The `MemberRating` values must be used in conjunction with `member` and are only available
       * when specifying a single member (i.e. `IncludeFriends=None`).
       *
       * DEPRECATED The `Rating*` options are deprecated in favor of `AverageRating*`.
       */
      sort?:
        | 'FilmName'
        | 'DateLatestFirst'
        | 'DateEarliestFirst'
        | 'ReleaseDateLatestFirst'
        | 'ReleaseDateEarliestFirst'
        | 'AuthenticatedMemberRatingHighToLow'
        | 'AuthenticatedMemberRatingLowToHigh'
        | 'MemberRatingHighToLow'
        | 'MemberRatingLowToHigh'
        | 'AverageRatingHighToLow'
        | 'AverageRatingLowToHigh'
        | 'RatingHighToLow'
        | 'RatingLowToHigh'
        | 'FilmDurationShortestFirst'
        | 'FilmDurationLongestFirst'
        | 'BestMatch'
        | 'FilmPopularity'
        | 'FilmPopularityThisWeek'
        | 'FilmPopularityThisMonth'
        | 'FilmPopularityThisYear'
        | 'FilmPopularityWithFriends'
        | 'FilmPopularityWithFriendsThisWeek'
        | 'FilmPopularityWithFriendsThisMonth'
        | 'FilmPopularityWithFriendsThisYear';
    }) => {
      return request<{ status: 200; data: defs.FilmsResponse }>({
        method: 'get',
        path: '/films',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get a list of films matching a given search term.
     *
     * Titles are returned in order of relevance. Up to 100 films will be returned.
     *
     * @deprecated Please use `/search?input={input}&searchMethod=Autocomplete&include=FilmSearchItem` instead.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--films-autocomplete}
     */
    autocomplete: (params: {
      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * The word, partial word or phrase to match against.
       */
      input: string;

      /**
       * Whether to include adult content in search results. Default to `false`.
       */
      adult?: boolean;
    }) => {
      return request<{ status: 200; data: defs.FilmsAutocompleteResponse }>({
        method: 'get',
        path: '/films/autocomplete',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get a list of countries supported by the /films endpoint.
     *
     * Countries are returned in alphabetical order.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--films-countries}
     */
    countries: () => {
      return request<{ status: 200; data: defs.CountriesResponse }>({
        method: 'get',
        path: '/films/countries',
        auth: this.credentials,
      });
    },

    /**
     * Get a list of services supported by the /films endpoint.
     *
     * Services are returned in logical order. Some services (including 'My Services' options) are
     * only available to paying members, so results will vary based on the authenticated member's
     * status.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--films-film-services}
     */
    services: () => {
      return request<{ status: 200; data: defs.FilmServicesResponse }>({
        method: 'get',
        path: '/films/film-services',
        auth: this.credentials,
      });
    },

    /**
     * Get a list of genres supported by the /films endpoint.
     *
     * Genres are returned in alphabetical order.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--films-genres}
     */
    genres: () => {
      return request<{ status: 200; data: defs.GenresResponse }>({
        method: 'get',
        path: '/films/genres',
        auth: this.credentials,
      });
    },

    /**
     * Get a list of languages supported by the /films endpoint.
     *
     * Languages are returned in alphabetical order.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--films-languages}
     */
    languages: () => {
      return request<{ status: 200; data: defs.LanguagesResponse }>({
        method: 'get',
        path: '/films/languages',
        auth: this.credentials,
      });
    },

    /**
     * Get details about a film by ID. Supports an optional member ID to honor custom-poster
     * settings.
     *
     * @param id The LID of the film.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--film--id-}
     */
    get: (
      id: string,
      params?: {
        /**
         * Specify the LID of a member to honor any custom-poster settings the member may have for
         * the film, when viewed within the context of their profile or content.
         */
        member?: string;
      }
    ) => {
      return request<
        { status: 200; data: defs.Film } | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get availability data for a film by ID.
     *
     * @private First party API clients only
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--availability}
     */
    getAvailability: (id: string) => {
      return request<
        | { status: 200; data: defs.FilmAvailabilityResponse }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/availability`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of the authenticated member's friends' relationship with a film by ID.
     *
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--friends}
     */
    getMemberFriends: (id: string) => {
      return request<
        | { status: 200; data: defs.FilmRelationship }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/friends`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of the authenticated member's relationship with a film by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--me}
     */
    getMemberRelationship: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.FilmRelationship }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of members' relationships with a film by ID.
     *
     * @param id The LID of the film.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--members}
     */
    getMembers: (
      id: string,
      params?: {
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
         *  - Otherwise, members who most recently joined the site appear first.
         *  - The `*WithFriends` values are only available to authenticated members and consider
         *    popularity amongst the member's friends.
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
         * list of members followed by the `member`. Use `IsFollowedBy` to return the list of
         * members that follow the `member`.
         *
         * @see params.member
         */
        memberRelationship?: 'IsFollowing' | 'IsFollowedBy';

        /**
         * Must be used in conjunction with `film`. Defaults to `Watched`, which returns the list of
         * members who have seen the `film`. Specify the type of relationship to limit the returned
         * members accordingly.
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
      }
    ) => {
      return request<
        | { status: 200; data: defs.MemberFilmRelationshipsResponse }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/members`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Report a film by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--report}
     */
    report: (id: string, params: defs.ReportFilmRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'post',
        path: `/film/${id}/report`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get statistical data about a film by ID.
     *
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--statistics}
     */
    statistics: (id: string) => {
      return request<
        | { status: 200; data: defs.FilmStatistics }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/statistics`,
        auth: this.credentials,
      });
    },
  };

  public list = {
    /**
     * A cursored window over a list of lists.
     *
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--lists-get}
     */
    all: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * Defaults to `Date`, which returns lists that were most recently created/updated first. The
       * `*WithFriends` values are only available to signed-in members and consider popularity
       * amongst the signed-in member's friends.
       */
      sort?:
        | 'Date'
        | 'WhenPublishedLatestFirst'
        | 'WhenPublishedEarliestFirst'
        | 'WhenCreatedLatestFirst'
        | 'WhenCreatedEarliestFirst'
        | 'ListName'
        | 'ListPopularity'
        | 'ListPopularityThisWeek'
        | 'ListPopularityThisMonth'
        | 'ListPopularityThisYear'
        | 'ListPopularityWithFriends'
        | 'ListPopularityWithFriendsThisWeek'
        | 'ListPopularityWithFriendsThisMonth'
        | 'ListPopularityWithFriendsThisYear';

      /**
       * Specify the LID of a film to return lists that include that film.
       */
      film?: string;

      /**
       * Specify the LID of a list to return lists that were cloned from that list.
       */
      clonedFrom?: string;

      /**
       * @deprecated Use `tagCode` instead.
       * @see params.tagCode
       */
      tag?: string;

      /**
       * Specify a tag code to limit the returned lists to those tagged accordingly.
       */
      tagCode?: string;

      /**
       * Must be used with `tagCode`. Specify the LID of a member to focus the tag filter on the
       * member.
       *
       * @see params.tagCode
       */
      tagger?: string;

      /**
       * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
       * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter
       * tags set by both the member and their friends.
       *
       * @see params.tagger
       */
      includeTaggerFriends?: 'None' | 'All' | 'Only';

      /**
       * Specify the LID of a member to return lists that are owned or liked by the member (or
       * their friends, when used with `includeFriends`).
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `Owner`, which returns lists owned
       * by the specified member. Use `Liked` to return lists liked by the member.
       *
       * @see params.member
       */
      memberRelationship?: 'Owner' | 'Liked';

      /**
       * Must be used in conjunction with `member`. Defaults to `None`, which only returns lists
       * from the member's account. Use `Only` to return lists from the member's friends, and `All`
       * to return lists from both the member and their friends.
       *
       * @see params.member
       */
      includeFriends?: 'None' | 'All' | 'Only';

      /**
       * Specify `Clean` to return lists that do not contain profane language. Specify `Published`
       * to return the member's lists that have been made public. Note that unpublished lists for
       * members other than the authenticated member are never returned. Specify NotPublished to
       * return the authenticated member's lists that have not been made public.
       */
      where?: 'Clean' | 'Published' | 'NotPublished';

      /**
       * Specify `NoDuplicateMembers` to limit the list to only the first list for each member.
       * `NoDuplicateMembers` is only available when using these sort orders: `Date`,
       * `WhenPublishedLatestFirst`, `WhenCreatedLatestFirst`.
       */
      filter?: 'NoDuplicateMembers';

      /**
       * Specify the LIDs of any film(s) you wish to see the status for in respect of the returned
       * list(s). For each nominated film, the response will indicate (for each returned list)
       * whether the list contains the film, and if so, its rank position.
       */
      filmsOfNote?: string[];
    }) => {
      return request<
        | { status: 200; data: defs.ListsResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | {
            status: 403;
            data: never;
            reason: 'There is no authenticated member, or the authenticated member does not own the resource (when requesting where=NotPublished)';
          }
        | { status: 404; data: never; reason: 'No film, member, tag or list matches the specified ID.' }
      >({
        method: 'get',
        path: '/lists',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Create a list.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--lists-post}
     */
    create: (params: defs.ListCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListCreateResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'post',
        path: '/lists',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Add one or more films to one or more lists.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--lists-patch}
     */
    updateLists: (params?: defs.ListAdditionRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListAdditionResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
      >({
        method: 'patch',
        path: '/lists',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get a list of featured topics/lists (e.g. for display in the Browse tab of our apps).
     *
     * @see {@link https://api-docs.letterboxd.com/#path--lists-topics}
     */
    topics: () => {
      return request<{ status: 200; data: defs.TopicsResponse }>({
        method: 'get',
        path: '/lists/topics',
        auth: this.credentials,
      });
    },

    /**
     * Get details of a list by ID.
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--get}
     */
    get: (id: string) => {
      return request<
        { status: 200; data: defs.List } | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * Update a list by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the list.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--patch}
     */
    update: (id: string, params?: defs.ListUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListUpdateResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | {
            status: 401;
            data: never;
            reason: 'There is no authenticated member, or the authenticated member does not own the resource';
          }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'patch',
        path: `/list/${id}`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Delete a list by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--delete}
     */
    delete: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 403; data: never; reason: 'The authenticated member does not own the specified list' }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'delete',
        path: `/list/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * A cursored window over the comments for a list.
     *
     * Use the `next` cursor to move through the comments.
     *
     * @param id The LID of the list.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--comments-get}
     */
    getComments: (
      id: string,
      params?: {
        /**
         * The pagination cursor.
         */
        cursor?: string;

        /**
         * The number of items to include per page (default is `20`, maximum is `100`).
         */
        perPage?: number;

        /**
         * Defaults to `Date`. The Updates sort order returns newest content first. Use this to get
         * the most recently posted or edited comments, and pass `includeDeletions=true` to remain
         * consistent in the case where a comment has been deleted.
         */
        sort?: 'Date' | 'DateLatestFirst' | 'Updates';

        /**
         * Use this to discover any comments that were deleted.
         */
        includeDeletions?: boolean;
      }
    ) => {
      return request<
        | { status: 200; data: defs.ListCommentsResponse }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}/comments`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Create a comment on a list.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--comments-post}
     */
    createComment: (id: string, params: defs.CommentCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 201; data: defs.ListComment }
        | { status: 204; data: never; reason: 'A comment with the same message already exists (no action was taken)' }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 403; data: never; reason: 'The authenticated member is not authorized to comment on this list' }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'post',
        path: `/list/${id}/comments`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get entries for a list by ID.
     *
     * @param id The LID of the list.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--list--id--entries}
     */
    getEntries: (
      id: string,
      params?: {
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
         * Specify the code of a theme to limit films to those within the specified theme.
         *
         * @private First party API clients only
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         *
         * @private First party API clients only
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
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
         * Specify the starting year of a decade (must end in `0`) to limit films to those released
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
         * `memberRelationship` or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of
         * relationship to limit the returned films accordingly. Use `Ignore` if you only intend to
         * specify the member for use with `sort=MemberRating*`.
         *
         * @see params.member
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
         * from the member's account. Use `Only` to return films from the member's friends, and
         * `All` to return films from both the member and their friends.
         *
         * @see params.member
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
         * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter
         * tags set by both the member and their friends.
         */
        includeTaggerFriends?: 'None' | 'All' | 'Only';

        /**
         * The order in which the entries should be returned. Defaults to `ListRanking`, which is
         * the order specified by the list owner.
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
          | 'ListRanking'
          | 'WhenAddedToList'
          | 'WhenAddedToListEarliestFirst'
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
          | 'RatingHighToLow'
          | 'RatingLowToHigh'
          | 'ReleaseDateLatestFirst'
          | 'ReleaseDateEarliestFirst'
          | 'FilmDurationShortestFirst'
          | 'FilmDurationLongestFirst'
          | 'FilmPopularity'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisYear';
      }
    ) => {
      return request<
        | { status: 200; data: defs.ListEntriesResponse }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}/entries`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details of the authenticated member's relationship with a list by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--me-get}
     */
    getRelationship: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListRelationship }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Update the authenticated member's relationship with a list by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the list.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--list--id--me-patch}
     */
    updateRelationship: (id: string, params?: defs.ListRelationshipUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListRelationshipUpdateResponse }
        | {
            status: 401;
            data: never;
            reason: 'There is no authenticated member, or the authenticated member does not own the resource';
          }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'patch',
        path: `/list/${id}/me`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Report a list by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the list.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--list--id--report}
     */
    report: (id: string, params: defs.ReportListRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'post',
        path: `/list/${id}/report`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get statistical data about a list by ID.
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#path--list--id--statistics}
     */
    statistics: (id: string) => {
      return request<
        | { status: 204; data: defs.ListStatistics }
        | { status: 404; data: never; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}/statistics`,
        auth: this.credentials,
      });
    },
  };

  public logEntry = {
    /**
     * A cursored window over the log entries for a film or member. A log entry is either a diary
     * entry (must have a date) or a review (must have review text). Log entries can be both a
     * diary entry and a review if they satisfy both criteria.
     *
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entries-get}
     */
    all: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * The order in which the log entries should be returned. Defaults to `WhenAdded`, which
       * orders by creation date, unless you specify `where=HasDiaryDate` in which case the default
       * is `Date`.
       *
       * The `AuthenticatedMember*` values are only available to signed-in members.
       *
       * The `MemberRating` values must be used in conjunction with `member` and are only available
       * when specifying a single member (i.e. `IncludeFriends=None`).
       *
       * The `ReviewPopularity` values return reviews with more activity (likes/comments) first,
       * and imply `where=HasReview`.
       *
       * The `FilmPopularity` values return reviews for films with more combined activity first.
       *
       * The `*WithFriends` values are only available to signed-in members and consider popularity
       * amongst the signed-in member's friends.
       *
       * The `Date` value sorts by the diary date, and implies `where=HasDiaryDate`
       *
       * If a film is specified, the only applicable sort orders are `WhenAdded`, `Date`,
       * `EntryRating*` or `ReviewPopularity*`.
       *
       * DEPRECATED The `Rating*` options are deprecated in favor of `EntryRating*`.
       */
      sort?:
        | 'WhenAdded'
        | 'Date'
        | 'DiaryCount'
        | 'ReviewCount'
        | 'WhenLiked'
        | 'EntryRatingHighToLow'
        | 'EntryRatingLowToHigh'
        | 'RatingHighToLow'
        | 'RatingLowToHigh'
        | 'AuthenticatedMemberRatingHighToLow'
        | 'AuthenticatedMemberRatingLowToHigh'
        | 'MemberRatingHighToLow'
        | 'MemberRatingLowToHigh'
        | 'AverageRatingHighToLow'
        | 'AverageRatingLowToHigh'
        | 'ReleaseDateLatestFirst'
        | 'ReleaseDateEarliestFirst'
        | 'FilmName'
        | 'FilmDurationShortestFirst'
        | 'FilmDurationLongestFirst'
        | 'ReviewPopularity'
        | 'ReviewPopularityThisWeek'
        | 'ReviewPopularityThisMonth'
        | 'ReviewPopularityThisYear'
        | 'ReviewPopularityWithFriends'
        | 'ReviewPopularityWithFriendsThisWeek'
        | 'ReviewPopularityWithFriendsThisMonth'
        | 'ReviewPopularityWithFriendsThisYear'
        | 'FilmPopularity'
        | 'FilmPopularityThisWeek'
        | 'FilmPopularityThisMonth'
        | 'FilmPopularityThisYear'
        | 'FilmPopularityWithFriends'
        | 'FilmPopularityWithFriendsThisWeek'
        | 'FilmPopularityWithFriendsThisMonth'
        | 'FilmPopularityWithFriendsThisYear';

      /**
       * Specify the LID of a film to return log entries for that film. Must not be included if the
       * `sort` value is one of `FilmName`, `ReleaseDate*`, `FilmDuration*` or any of the
       * `FilmPopularity` options.
       */
      film?: string;

      /**
       * Specify the LID of a member to limit the returned log entries according to the value set
       * in `memberRelationship` or to access the `MemberRating*` sort options.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Use `Owner` to limit the returned log entries
       * to those created by the specified member. Use `Liked` to limit the returned reviews to
       * those liked by the specified member (implies `where=HasReview`).
       *
       * @see params.member
       */
      memberRelationship?: 'Ignore' | 'Owner' | 'Liked';

      /**
       * Must be used in conjunction with `member`. Specify the type of relationship to limit the
       * returned films accordingly. e.g. Use `Liked` to limit the returned reviews to those for
       * films liked by the member.
       *
       * @see params.member
       */
      filmMemberRelationship?:
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
       * Must be used in conjunction with `member`. Defaults to `None`, which only returns log
       * entries created or liked by the member. Use `Only` to return log entries created or liked
       * by the member's friends, and All to return log entries created or liked by both the member
       * and their friends.
       *
       * @see params.member
       */
      includeFriends?: 'None' | 'All' | 'Only';

      /**
       * If set, limits the returned log entries to those with date that falls during the specified
       * year.
       */
      year?: number;

      /**
       * Accepts values of `1` through `12`. Must be used with `year`. If set, limits the returned
       * log entries to those with a date that falls during the specified month and year.
       *
       * @see parmas.year
       */
      month?: number;

      /**
       * Accepts values of `1` through `52`. Must be used with `year`. If set, limits the returned
       * log entries to those with a date that falls during the specified week and year.
       *
       * @see params.year
       */
      week?: number;

      /**
       * Accepts values of `1` through `31`. Must be used with `month` and `year`. If set, limits the
       * returned log entries to those with a date that falls on the specified day, month and year.
       *
       * @see params.month
       * @see params.year
       */
      day?: number;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the
       * returned log entries to those with a rating equal to or higher than the specified rating.
       */
      minRating?: number;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the
       * returned log entries to those with a rating equal to or lower than the specified rating.
       */
      maxRating?: number;

      /**
       * Specify the starting year of a decade (must end in `0`) to limit films to those released
       * during the decade.
       */
      filmDecade?: number;

      /**
       * Specify a year to limit films to those released during that year.
       */
      filmYear?: number;

      /**
       * The LID of the genre. If set, limits the returned log entries to those for films that
       * match the specified genre.
       */
      genre?: string;

      /**
       * Specify the LID of up to 100 genres to limit the returned log entries to those for films
       * within all of the specified genres.
       */
      includeGenre?: string[];

      /**
       * Specify the LID of up to 100 genres to limit the returned log entries to those for films
       * within none of the specified genres.
       */
      excludeGenre?: string[];

      /**
       * Specify the ISO 3166-1 defined code of the country to limit films to those produced in the
       * specified country.
       */
      country?: string;

      /**
       * Specify the ISO 639-1 defined code of the language to limit films to those using the
       * specified spoken language.
       */
      language?: string;

      /**
       * @deprecated Use `tagCode` instead.
       * @see params.tagCode
       */
      tag?: string;

      /**
       * Specify a tag code to limit the returned log entries to those tagged accordingly.
       */
      tagCode?: string;

      /**
       * Must be used with `tagCode`. Specify the LID of a member to focus the tag filter on the
       * member.
       *
       * @see params.tagCode
       */
      tagger?: string;

      /**
       * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
       * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter
       * tags set by both the member and their friends.
       *
       * @see params.tagger
       */
      includeTaggerFriends?: 'None' | 'All' | 'Only';

      /**
       * Specify the ID of a supported service to limit films to those available from that service.
       * The list of available services can be found by using the
       * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services)
       * endpoint.
       */
      service?: string;

      /**
       * Specify one or more values to limit the returned log entries accordingly.
       *
       *  - `Released`, `NotReleased`, `FeatureLength` and `NotFeatureLength` refer to properties
       *    of the associated film rather than to the relevant log entry.
       *  - Use `InWatchlist` or `NotInWatchlist` to limit the returned log entries based on the
       *    contents of the authenticated member's watchlist. Use `Watched` and `NotWatched` to
       *    limit the returned log entries based on the authenticated member's list of watched
       *    films. (Note: you can specify `member` and `filmMemberRelationship` to further limit
       *    returned entries based on another  member's films or watchlist.)
       *  - Use `HasDiaryDate` to limit the returned log entries to those that appear in a member's
       *    diary.
       *  - Use `HasReview` to limit the returned log entries to those containing a review.
       *  - Use `Clean` to exclude reviews that contain profane language.
       *  - Use `NoSpoilers` to exclude reviews where the owner has indicated that the review text
       *    contains plot spoilers for the film.
       *  - Use `Rated` to limit the returned log entries to those that have a rating (use
       *    `minRating` and `maxRating` for more control).
       *  - Use `NotRated` to limit the returned log entries to those that do not have a rating.
       *  - Use `Fiction` to exclude log entries of documentaries.
       *  - Use `Film` to exclude log entries of tv shows. Use `TV` to only return log entries of
       *    tv shows.
       */
      where?:
        | 'HasDiaryDate'
        | 'HasReview'
        | 'Clean'
        | 'NoSpoilers'
        | 'Released'
        | 'NotReleased'
        | 'FeatureLength'
        | 'NotFeatureLength'
        | 'InWatchlist'
        | 'NotInWatchlist'
        | 'Watched'
        | 'NotWatched'
        | 'Rated'
        | 'NotRated'
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
        | 'Liked'
        | 'NotLiked'
        | 'Fiction'
        | 'Film'
        | 'TV';

      /**
       * Specify `NoDuplicateMembers` to return only the first log entry for each member. If `film`
       * is not provided, only recent Log Entries will be returned (i.e. entries logged in the past
       * 30 days). `NoDuplicateMembers` is only available when using these sort orders: `WhenAdded`,
       * `Date`, `ReviewPopularity*`. You may not use `NoDuplicateMembers` with
       * `filmMemberRelationship`, `filmDecade`, `filmYear`, `genre`, `tagCode`, `service`, or
       * `where` except `HasDiaryDate`, `HasReview`, `Clean`, and/or `NoSpoilers`.
       */
      filter?: 'NoDuplicateMembers';
    }) => {
      return request<
        | { status: 200; data: defs.LogEntriesResponse }
        | { status: 404; data: never; reason: 'Film or Member not found' }
      >({
        method: 'get',
        path: '/log-entries',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Create a log entry. A log entry is either a diary entry (must have a date) or a review (must
     * have review text). Log entries can be both a diary entry and a review if they satisfy both
     * criteria.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entries-post}
     */
    create: (params: defs.LogEntryCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 201; data: defs.LogEntry }
        | { status: 204; data: never; reason: 'No action was taken, as the log entry already exists' }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'The film was not found' }
      >({
        method: 'post',
        path: '/log-entries',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details about a log entry by ID.
     *
     * @param id The LID of the log entry.
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--get}
     */
    get: (id: string) => {
      return request<
        | { status: 200; data: defs.LogEntry }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'get',
        path: `/log-entry/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * Update a log entry by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the log entry.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--patch}
     */
    update: (id: string, params?: defs.LogEntryUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ReviewUpdateResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | {
            status: 401;
            data: never;
            reason: 'There is no authenticated member, or the authenticated member does not own the resource';
          }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'patch',
        path: `/log-entry/${id}`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Delete a log entry by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the log entry.
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--delete}
     */
    delete: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 403; data: never; reason: 'The authenticated member is not authorized to delete this log entry' }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'delete',
        path: `/log-entry/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * A cursored window over the comments for a log entry's review.
     *
     * Use the `next` cursor to move through the comments.
     *
     * @param id The LID of the log entry.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--comments-get}
     */
    getComments: (
      id: string,
      params?: {
        /**
         * The pagination cursor.
         */
        cursor?: string;

        /**
         * The number of items to include per page (default is `20`, maximum is `100`).
         */
        perPage?: number;

        /**
         * Defaults to `Date`. The `Updates` sort order returns newest content first. Use this to
         * get the most recently posted or edited comments, and pass `includeDeletions=true` to
         * remain consistent in the case where a comment has been deleted.
         */
        sort?: 'Date' | 'DateLatestFirst' | 'Updates';

        /**
         * Use this to discover any comments that were deleted.
         */
        includeDeletions?: boolean;
      }
    ) => {
      return request<
        | { status: 200; data: defs.ReviewCommentsResponse }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'get',
        path: `/log-entry/${id}/comments`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Create a comment on a review.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the log entry.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--comments-post}
     */
    createComment: (id: string, params: defs.CommentCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 201; data: defs.ReviewComment }
        | { status: 204; data: never; reason: 'A comment with the same message already exists (no action was taken)' }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 403; data: never; reason: 'The authenticated member is not authorized to comment on this review' }
        | { status: 404; data: never; reason: 'No film matches the specified ID' }
      >({
        method: 'post',
        path: `/log-entry/${id}/comments`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details of the authenticated member's relationship with a log entry's review by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the log entry.
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--me-get}
     */
    getRelationship: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ReviewRelationship }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'get',
        path: `/log-entry/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Update the authenticated member's relationship with a log entry's review by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the log entry.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--log-entry--id--me-patch}
     */
    updateRelationship: (id: string, params?: defs.ReviewRelationshipUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ReviewRelationshipUpdateResponse }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | {
            status: 403;
            data: never;
            reason: 'The authenticated member is not authorized to like or subscribe to this review';
          }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'patch',
        path: `/log-entry/${id}/me`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Report a log entry's review by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the log entry.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--log-entry--id--report}
     */
    report: (id: string, params: defs.ReportReviewRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'post',
        path: `/log-entry/${id}/report`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get statistical data about a log-entry's review by ID.
     *
     * @param id The LID of the log entry.
     * @see {@link https://api-docs.letterboxd.com/#path--log-entry--id--statistics}
     */
    statistics: (id: string) => {
      return request<
        | { status: 200; data: defs.ReviewStatistics }
        | { status: 404; data: never; reason: 'No log entry matches the specified ID' }
      >({
        method: 'get',
        path: `/log-entry/${id}/statistics`,
        auth: this.credentials,
      });
    },
  };

  public me = {
    /**
     * Get details about the authenticated member.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @see {@link https://api-docs.letterboxd.com/#operation--me-get}
     */
    get: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--me-patch}
     */
    update: (params?: defs.MemberSettingsUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--me-deregister-push-notifications}
     */
    deregisterPushNotifications: (params: defs.DeregisterPushNotificationsRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--me-disable}
     */
    deactivate: (params: defs.DisableAccountRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * @see {@link https://api-docs.letterboxd.com/#path--me-register-push-notifications}
     */
    registerPushNotifications: (params: defs.RegisterPushNotificationsRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * with a member's account has not been validated and the validation link has expired or been
     * lost, use this endpoint to request a new validation link.
     *
     * @see {@link https://api-docs.letterboxd.com/#path--me-validation-request}
     */
    validationRequest: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success (the email was dispatched if it matched an existing account)' }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | {
            status: 403;
            data: never;
            reason: "The authenticated member's email address was already successfully validated";
          }
        | {
            status: 429;
            data: never;
            reason: "Too many validation requests have been made (the email is probably in the member's spam or junk folder)";
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
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--members}
     */
    all: (params?: {
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
       * popularity amongst the member's friends.
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
       *
       * @see params.member
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
       *
       * @see params.film
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
    pronouns: () => {
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
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--members-register}
     */
    register: (params?: defs.RegisterRequest) => {
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
     * @param id The LID of the member.
     * @see {@link https://api-docs.letterboxd.com/#path--member--id-}
     */
    get: (id: string) => {
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
     * Use the `next` cursor to move through the list.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--activity}
     */
    getMemberActivity: (
      id: string,
      params?: {
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
         * @see params.include
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
         * you don't specify any of `NetworkActivity`, `OwnActivity` or `NotIncomingActivity`, you
         * will receive activity related to the member's content from members outside their network
         * (e.g. comments and likes on the member's lists and reviews).
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
     * Get the list of a member's tags, or those that match an optional search prefix.
     *
     * The tags will be returned in order of relevance. All tags previously used by the member will
     * be returned if no search prefix is specified.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--list-tags-2}
     */
    getMemberListTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional".
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
     * Get the list of a member's tags, or those that match an optional search prefix.
     *
     * The tags will be returned in order of relevance. All tags previously used by the member will
     * be returned if no search prefix is specified.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--log-entry-tags}
     */
    getMemberLogEntryTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional".
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
     * Get details of the authenticated member's relationship with another member by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the other member.
     * @see {@link https://api-docs.letterboxd.com/#operation--member--id--me-get}
     */
    getMemberRelationship: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * Update the authenticated member’s relationship with another member by ID.
     *
     * Calls to this endpoint must include the access token for an authenticated member (see
     * [Authentication](https://api-docs.letterboxd.com/#auth)).
     *
     * @param id The LID of the other member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation--member--id--me-patch}
     */
    updateMemberRelationship: (id: string, params?: defs.MemberRelationshipUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.MemberRelationshipUpdateResponse }
        | { status: 401; data: never; reason: 'There is no authenticated member' }
        | {
            status: 404;
            data: never;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API';
          }
      >({
        method: 'patch',
        path: `/member/${id}/me`,
        auth: this.credentials,
        params,
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
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--report}
     */
    report: (id: string, params: defs.ReportMemberRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
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
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--statistics}
     */
    statistics: (id: string) => {
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
     * Get details of a member's public watchlist by ID.
     *
     * The response will include the film relationships for the signed-in member, the watchlist's
     * owner, and the member indicated by the `member` LID if specified (the `member` and
     * `memberRelationship` parameters are optional, and can be used to perform comparisons between
     * the watchlist owner and another member). Use the
     * [/film/{id}/me](https://api-docs.letterboxd.com/#path--film--id--me) endpoint to add or
     * remove films from a member's watchlist.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--member--id--watchlist}
     */
    watchlist: (
      id: string,
      params?: {
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
         *
         * @see parmas.member
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
         * from the member's account. Use `Only` to return films from the member's friends, and
         * `All` to return films from both the member and their friends.
         *
         * @see params.member
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
         *
         * @see params.tagCode
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by
         * the member. Use `Only` to filter tags set by the member's friends, and `All` to filter
         * tags set by both the member and their friends.
         *
         * @see params.tagger
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
        | { status: 403; data: never; reason: "The specified member's watchlist is private" }
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
   * @param params
   * @see {@link https://api-docs.letterboxd.com/#path--news}
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
   * @param params
   * @see {@link https://api-docs.letterboxd.com/#path--search}
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
     * The type of search to perform. Defaults to `FullText`, which performs a standard search
     * considering text in all fields. `Autocomplete` only searches primary fields.
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
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#path--stories}
     */
    all: (params?: {
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
       * Specify `Published` to return the member's stories that have been made public. Note that
       * unpublished stories for members other than the authenticated member are never returned.
       * Specify `NotPublished` to return the authenticated member's stories that have not been made
       * public.
       */
      where?: ('Published' | 'NotPublished')[];
    }) => {
      return request<
        | { status: 200; data: defs.StoriesResponse }
        | { status: 400; data: never; reason: 'Bad request' }
        | { status: 404; data: never; reason: 'No film, member, tag or list matches the specified ID.' }
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
     * @param id The LID of the story.
     * @see {@link https://api-docs.letterboxd.com/#path--story--id-}
     */
    get: (id: string) => {
      return request<
        { status: 200; data: defs.Story } | { status: 404; data: never; reason: 'No story matches the specified ID' }
      >({
        method: 'get',
        path: `/stories/${id}`,
        auth: this.credentials,
      });
    },
  };
}
