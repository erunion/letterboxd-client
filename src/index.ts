//
// These type definitions were last updated on 2024-10-02.
//
/* eslint-disable typescript-sort-keys/interface */
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
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-auth_forgotten-password-request}
     */
    forgottenPasswordRequest: (body: defs.ForgottenPasswordRequest) => {
      return request<
        | {
            status: 429;
            data: never;
            reason: "Too many forgotten password requests have been received for this email address. Check the member's spam/junk folder.";
          }
        | { status: 204; data: never; reason: 'Success (the email was dispatched if it matched an existing account)' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad rquest' }
      >({
        method: 'post',
        path: '/auth/forgotten-password-request',
        auth: this.credentials,
        body,
      });
    },

    /**
     * Generate a single-use token for the current member, which can be used to sign the member into the Letterboxd
     * website by passing it as the value of the `urt` query parameter.
     *
     * Usage of this API method requires an access token with the `user:owner` scope.
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-auth_get-login-token}
     */
    getLoginTokenRequest: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.LoginTokenResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
      >({
        method: 'get',
        path: '/auth/get-login-token',
        auth: this.credentials,
      });
    },

    /**
     * Generate a single-use upload url for the current member, which can be used to upload a data file for the member.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `client:firstparty`
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-auth_get-upload-url}
     */
    getUploadUrl: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.UploadUrlResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
      >({
        method: 'get',
        path: '/auth/get-upload-url',
        auth: this.credentials,
      });
    },

    /**
     * Check if a username is available to register.
     *
     * Use this endpoint to check the validity and availability of a given username. Usernames must be between 2 and 15
     * characters long and may only contain upper or lowercase letters, numbers or the underscore (`_`) character.
     * Usernames associated with deactivated accounts are not automatically released to the pool of available names
     * (members will need to contact Letterboxd Support for assistance).
     *
     * @param username The username to check.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-auth_username-check}
     */
    checkUsername: (username: string) => {
      return request<{ status: 200; data: defs.UsernameCheckResponse; reason: 'Success' }>({
        method: 'get',
        path: '/auth/username-check',
        auth: this.credentials,
        params: {
          username,
        },
      });
    },
  };

  public comments = {
    /**
     * Delete a comment.
     *
     * Comments may be deleted by their owner, or by the owner of the thread to which they are posted.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the comment/reply.
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-DELETE-comment_id}
     */
    deleteComment: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 403; data: defs.ErrorResponse; reason: 'The window for deleting this comment has expired' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No comment matches the specified ID' }
      >({
        method: 'delete',
        path: `/comment/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * Update the message portion of a comment.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the comment/reply.
     * @param params {defs.CommentUpdateRequest}
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-comment_id}
     */
    updateComment: (id: string, params: defs.CommentUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.CommentUpdateResponse; reason: 'Completed, possibly with messages' }
        | { status: 403; data: defs.ErrorResponse; reason: 'Not your comment' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No comment matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the comment/reply.
     * @param params {defs.ReportCommentRequest}
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-comment_id_report}
     */
    reportComment: (id: string, params: defs.ReportCommentRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No comment matches the specified ID' }
      >({
        method: 'post',
        path: `/comment/${id}/report`,
        auth: this.credentials,
        params,
      });
    },
  };

  public contributors = {
    /**
     * Get details about a film contributor by ID or TMDb ID.
     *
     * Contributors include the film's director(s), cast, crew and studio(s).
     *
     * @param id The LID of the contributor or the TMDb ID prefixed with `tmdb`: e.g. `tmdb:3`
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-contributor_id}
     */
    contributor: (id: string) => {
      return request<
        | { status: 200; data: defs.Contributor; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No contributor matches the specified ID' }
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
     *
     * @see {@link https://api-docs.letterboxd.com/#path--contributor--id--contributions}
     */
    contributions: (
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
         * Specify up to 100 Letterboxd IDs or TMDB IDs prefixed with `tmdb:`, or IMDB IDs prefixed with `imdb:`
         * @example ['b8wK', 'imdb:tt1396484']
         */
        filmId?: string[];

        /**
         * Specify the LID of a genre to limit films to those within the specified genre.
         */
        genre?: string;

        /**
         * Specify the LID of a film to limit films to those similar to the specified film.
         * @private
         */
        similarTo?: string;

        /**
         * Specify the code of a theme to limit films to those within the specified theme.
         * @private
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         * @private
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
         * @private
         */
        nanogenre?: string;

        /**
         * Specify the LID of up to 100 genres to limit films to those within all of the specified genres.
         */
        includeGenre?: string[];

        /**
         * Specify the LID of up to 100 genres to limit films to those within none of the specified genres.
         */
        excludeGenre?: string[];

        /**
         * Specify the ISO 3166-1 defined code of the country to limit films to those produced by the specified country.
         */
        country?: string;

        /**
         * Specify the ISO 639-1 defined code of the language to limit films to those using the specified spoken
         * language.
         */
        language?: string;

        /**
         * Specify the starting year of a decade (must end in 0) to limit films to those released during the decade.
         * @example 1990
         */
        decade?: number;

        /**
         * Specify a year to limit films to those released during that year.
         * @example 1994
         */
        year?: number;

        /**
         * Specify the ID of a supported service to limit films to those available from that service. The list of
         * available services can be found by using the
         * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        service?: string;

        /**
         * Specify the availability types to limit films to those with those availability types. The list of
         * availability types can be found by using the
         * [/films/availability-types](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        availabilityType?: string[];

        /**
         * Set to `true` to limit films to those available on only one service.
         */
        exclusive?: boolean;

        /**
         * Set to `true` to limit films to those not available on any services.
         */
        unavailable?: boolean;

        /**
         * Set to `true` to include films that the user owns.
         */
        includeOwned?: boolean;

        /**
         * Set to `true` to invert the current service filtering options.
         */
        negate?: boolean;

        /**
         * Specify one or more values to limit the list of films accordingly.
         * @example ['Watched', 'Released']
         */
        where?: defs.FilmWhereClause[];

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films for
         * the member to those with a rating equal to or higher than the specified rating.
         */
        memberMinRating?: number;

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films for
         * the member to those with a rating equal to or lower than the specified rating.
         */
        memberMaxRating?: number;

        /**
         * Specify the LID of a member to limit the returned films according to the value set in `memberRelationship`
         * or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of relationship to limit
         * the returned films accordingly. Use `Ignore` if you only intend to specify the member for use with
         * `sort=MemberRating*`.
         */
        memberRelationship?: defs.FilmMemberRelationship;

        /**
         * Must be used in conjunction with `member`. Defaults to `None, which only returns films from the member's
         * account. Use `Only` to return films from the member's friends, and `All` to return films from both the
         * member and their friends.
         */
        includeFriends?: defs.IncludeFriends;

        /**
         * @deprecated Use `tagCode instead.
         * @see tagCode
         */
        tag?: string;

        /**
         * Specify a tag code to limit the returned films to those tagged accordingly.
         */
        tagCode?: string;

        /**
         * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
         * member.
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None,` which filters tags set by the member. Use
         * `Only` to filter tags set by the member's friends, and `All` to filter tags set by both the member and their
         * friends.
         */
        includeTaggerFriends?: defs.IncludeFriends;

        /**
         * Specify a list of tag codes to limit the returned films to those with all the specified tags.
         */
        includeTags?: string[];

        /**
         * Specify a list of tag codes to limit the returned films to those with none of the specified tags.
         */
        excludeTags?: string[];

        /**
         * The order in which the films should be returned. Defaults to `FilmPopularity`, which is an all-time
         * measurement of the amount of activity the film has received. The `*WithFriends` values are only available to
         * signed-in members and consider popularity amongst the signed-in member's friends.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with `member` and are only available when specifying a
         * single member (i.e. `IncludeFriends=None`).
         *
         * @deprecated The `Rating*` options are deprecated in favor of `AverageRating*`.
         */
        sort?:
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'Billing'
          | 'FilmDurationLongestFirst'
          | 'FilmDurationShortestFirst'
          | 'FilmName'
          | 'FilmPopularity'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisYear'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'RatingHighToLow'
          | 'RatingLowToHigh'
          | 'ReleaseDateEarliestFirst'
          | 'ReleaseDateLatestFirst';

        /**
         * The type of contribution.
         */
        type?: defs.ContributionType;
      },
    ) => {
      return request<
        | { status: 200; data: defs.FilmContributionsResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No contributor matches the specified ID' }
      >({
        method: 'get',
        path: `/contributor/${id}/contributions`,
        auth: this.credentials,
        params,
      });
    },
  };

  public filmCollections = {
    /**
     * Get details about a film collection by ID. The response will include the film relationships for the signed-in
     * member and the member indicated by the `member` LID if specified.
     *
     * @param id The LID of the film collection.
     * @param params
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film-collection_id}
     */
    getFilmCollectionDetails: (
      id: string,
      params?: {
        /**
         * Specify up to 100 Letterboxd IDs or TMDB IDs prefixed with `tmdb:`, or IMDB IDs prefixed with `imdb:`
         * @example ['b8wK', 'imdb:tt1396484']
         */
        filmId?: string[];

        /**
         * Specify the LID of a genre to limit films to those within the specified genre.
         */
        genre?: string;

        /**
         * Specify the LID of a film to limit films to those similar to the specified film.
         * @private
         */
        similarTo?: string;

        /**
         * Specify the code of a theme to limit films to those within the specified theme.
         * @private
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         * @private
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
         * @private
         */
        nanogenre?: string;

        /**
         * Specify the LID of up to 100 genres to limit films to those within all of the specified genres.
         */
        includeGenre?: string[];

        /**
         * Specify the LID of up to 100 genres to limit films to those within none of the specified genres.
         */
        excludeGenre?: string[];

        /**
         * Specify the ISO 3166-1 defined code of the country to limit films to those produced by the specified country.
         */
        country?: string;

        /**
         * Specify the ISO 639-1 defined code of the language to limit films to those using the specified spoken
         * language.
         */
        language?: string;

        /**
         * Specify the starting year of a decade (must end in 0) to limit films to those released during the decade.
         * @example 1990
         */
        decade?: number;

        /**
         * Specify a year to limit films to those released during that year.
         * @example 1994
         */
        year?: number;

        /**
         * Specify the ID of a supported service to limit films to those available from that service. The list of
         * available services can be found by using the
         * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        service?: string;

        /**
         * Specify the availability types to limit films to those with those availability types. The list of
         * availability types can be found by using the
         * [/films/availability-types](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        availabilityType?: string[];

        /**
         * Set to `true` to limit films to those available on only one service.
         */
        exclusive?: boolean;

        /**
         * Set to `true` to limit films to those not available on any services.
         */
        unavailable?: boolean;

        /**
         * Set to `true` to include films that the user owns.
         */
        includeOwned?: boolean;

        /**
         * Set to `true` to invert the current service filtering options.
         */
        negate?: boolean;

        /**
         * Specify one or more values to limit the list of films accordingly.
         * @example ['Watched', 'Released']
         */
        where?: defs.FilmWhereClause[];

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films
         * for the member to those with a rating equal to or higher than the specified rating.
         */
        memberMinRating?: number;

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films
         * for the member to those with a rating equal to or lower than the specified rating.
         */
        memberMaxRating?: number;

        /**
         * Specify the LID of a member to limit the returned films according to the value set in `memberRelationship`
         * or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of relationship to limit
         * the returned films accordingly. Use `Ignore` if you only intend to specify the member for use with `sort=MemberRating*`.
         */
        memberRelationship?: defs.FilmMemberRelationship;

        /**
         * Must be used in conjunction with `member`. Defaults to `None`, which only returns films from the member's
         * account. Use `Only` to return films from the member's friends, and `All` to return films from both the member
         * and their friends.
         */
        includeFriends?: defs.IncludeFriends;

        /**
         * @deprecated Use `tagCode` instead.
         * @see tagCode
         */
        tag?: string;

        /**
         * Specify a tag code to limit the returned films to those tagged accordingly.
         */
        tagCode?: string;

        /**
         * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
         * member.
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by the member. Use
         * `Only` to filter tags set by the member's friends, and `All` to filter tags set by both the member and their
         * friends.
         */
        includeTaggerFriends?: defs.IncludeFriends;

        /**
         * Specify a list of tag codes to limit the returned films to those with all the specified tags.
         */
        includeTags?: string[];

        /**
         * Specify a list of tag codes to limit the returned films to those with none of the specified tags.
         */
        excludeTags?: string[];

        /**
         * The order in which the films should be returned. Defaults to `FilmPopularity`, which is an all-time
         * measurement of the amount of activity the film has received. The `*WithFriends` values are only available to
         * signed-in members and consider popularity amongst the signed-in member's friends.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with `member` and are only available when specifying a
         * single member (i.e. `IncludeFriends=None`).
         */
        sort?:
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'FilmDurationLongestFirst'
          | 'FilmDurationShortestFirst'
          | 'FilmName'
          | 'FilmPopularity'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisYear'
          | 'FilmPopularityWithFriends'
          | 'FilmPopularityWithFriendsThisMonth'
          | 'FilmPopularityWithFriendsThisWeek'
          | 'FilmPopularityWithFriendsThisYear'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'ReleaseDateEarliestFirst'
          | 'ReleaseDateLatestFirst';
      },
    ) => {
      return request<
        | { status: 200; data: defs.FilmCollection; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film collection matches the specified ID' }
      >({
        method: 'get',
        path: `/film-collection/${id}`,
        auth: this.credentials,
        params,
      });
    },
  };

  public films = {
    /**
     * A cursored window over the list of films.
     *
     * Use the `next` cursor to move through the list. The response will include the film relationships for the
     * signed-in member and the `member` indicated by the member LID if specified.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films}
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
       * Specify up to 100 Letterboxd IDs or TMDB IDs prefixed with `tmdb`:, or IMDB IDs prefixed with `imdb`:
       * @example ['b8wK', 'imdb:tt1396484']
       */
      filmId?: string[];

      /**
       * Specify the LID of a genre to limit films to those within the specified genre.
       */
      genre?: string;

      /**
       * Specify the LID of a film to limit films to those similar to the specified film.
       * @private
       */
      similarTo?: string;

      /**
       * Specify the code of a theme to limit films to those within the specified theme.
       * @private
       */
      theme?: string;

      /**
       * Specify the code of a minigenre to limit films to those within the specified minigenre.
       * @private
       */
      minigenre?: string;

      /**
       * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
       * @private
       */
      nanogenre?: string;

      /**
       * Specify the LID of up to 100 genres to limit films to those within all of the specified genres.
       */
      includeGenre?: string[];

      /**
       * Specify the LID of up to 100 genres to limit films to those within none of the specified genres.
       */
      excludeGenre?: string[];

      /**
       * Specify the ISO 3166-1 defined code of the country to limit films to those produced by the specified country.
       */
      country?: string;

      /**
       * Specify the ISO 639-1 defined code of the language to limit films to those using the specified spoken language.
       */
      language?: string;

      /**
       * Specify the starting year of a decade (must end in `0`) to limit films to those released during the decade.
       * @example 1990
       */
      decade?: number;

      /**
       * Specify a year to limit films to those released during that year.
       * @example 1994
       */
      year?: number;

      /**
       * Specify the ID of a supported service to limit films to those available from that service. The list of
       * available services can be found by using the
       * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
       */
      service?: string;

      /**
       * Specify the availability types to limit films to those with those availability types. The list of availability
       * types can be found by using the
       * [/films/availability-types](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
       */
      availabilityType?: string[];

      /**
       * Set to `true` to limit films to those available on only one service.
       */
      exclusive?: boolean;

      /**
       * Set to `true` to limit films to those not available on any services.
       */
      unavailable?: boolean;

      /**
       * Set to `true` to include films that the user owns.
       */
      includeOwned?: boolean;

      /**
       * Set to `true` to invert the current service filtering options.
       */
      negate?: boolean;

      /**
       * Specify one or more values to limit the list of films accordingly.
       * @example ['Watched', 'Released']
       */
      where?: defs.FilmWhereClause[];

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films for
       * the member to those with a rating equal to or higher than the specified rating.
       */
      memberMinRating?: number;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films for
       * the member to those with a rating equal to or lower than the specified rating.
       */
      memberMaxRating?: number;

      /**
       * Specify the LID of a member to limit the returned films according to the value set in `memberRelationship` or
       * to access the `MemberRating*` sort options.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of relationship to limit
       * the returned films accordingly. Use `Ignore` if you only intend to specify the member for use with
       * `sort=MemberRating*`.
       */
      memberRelationship?: defs.FilmMemberRelationship;

      /**
       * Must be used in conjunction with `member`. Defaults to `None`, which only returns films from the member's
       * account. Use `Only` to return films from the member's friends, and `All` to return films from both the member
       * and their friends.
       */
      includeFriends?: defs.IncludeFriends;

      /**
       * @deprecated Use `tagCode` instead.
       * @see tagCode
       */
      tag?: string;

      /**
       * Specify a tag code to limit the returned films to those tagged accordingly.
       */
      tagCode?: string;

      /**
       * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
       * member.
       */
      tagger?: string;

      /**
       * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by the member. Use `Only`
       * to filter tags set by the member's friends, and `All` to filter tags set by both the member and their friends.
       */
      includeTaggerFriends?: defs.IncludeFriends;

      /**
       * Specify a list of tag codes to limit the returned films to those with all the specified tags.
       */
      includeTags?: string[];

      /**
       * Specify a list of tag codes to limit the returned films to those with none of the specified tags.
       */
      excludeTags?: string[];

      /**
       * The order in which the films should be returned. Defaults to `FilmPopularity`, which is an all-time
       * measurement of the amount of activity the film has received. The `*WithFriends` values are only available to
       * signed-in members and consider popularity amongst the signed-in member's friends. The `Date` values are only
       * available when `member` is specified and using a `memberRelationship` of `Watched`, `Liked`, `Rated` or
       * `InWatchlist`. The `BestMatch` sort order is only available when specifying one of the following: `similarTo`,
       * `theme`, `minigenre` or `nanogenre`.
       *
       * The `AuthenticatedMember*` values are only available to signed-in members.
       *
       * The `MemberRating` values must be used in conjunction with `member` and are only available when specifying a
       * single member (i.e. `IncludeFriends=None`).
       *
       * @deprecated The `Rating*` options are deprecated in favor of `AverageRating*`.
       */
      sort?:
        | 'AuthenticatedMemberBasedOnLiked'
        | 'AuthenticatedMemberRatingHighToLow'
        | 'AuthenticatedMemberRatingLowToHigh'
        | 'AuthenticatedMemberRelatedToLiked'
        | 'AverageRatingHighToLow'
        | 'AverageRatingLowToHigh'
        | 'BestMatch'
        | 'DateEarliestFirst'
        | 'DateLatestFirst'
        | 'FilmDurationLongestFirst'
        | 'FilmDurationShortestFirst'
        | 'FilmName'
        | 'FilmPopularity'
        | 'FilmPopularityThisMonth'
        | 'FilmPopularityThisWeek'
        | 'FilmPopularityThisYear'
        | 'FilmPopularityWithFriends'
        | 'FilmPopularityWithFriendsThisMonth'
        | 'FilmPopularityWithFriendsThisWeek'
        | 'FilmPopularityWithFriendsThisYear'
        | 'MemberRatingHighToLow'
        | 'MemberRatingLowToHigh'
        | 'RatingHighToLow'
        | 'RatingLowToHigh'
        | 'ReleaseDateEarliestFirst'
        | 'ReleaseDateLatestFirst';

      /**
       * Set to `true` to include the total count of films matching this request. This is the total count of all films
       * matching the request, not just the count of films returned on this page.
       */
      countItems?: boolean;
    }) => {
      return request<
        | { status: 200; data: defs.FilmsResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
      >({
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
     * @deprecated Please use [/search?input={input}&searchMethod=Autocomplete&include=FilmSearchItem](https://api-docs.letterboxd.com/#operation--search-get) instead.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films_autocomplete}
     */
    autocompleteFilms: (params: {
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
      return request<{ status: 200; data: defs.FilmsAutocompleteResponse; reason: 'Success' }>({
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films_countries}
     */
    getCountryList: () => {
      return request<{ status: 200; data: defs.CountriesResponse; reason: 'Success' }>({
        method: 'get',
        path: '/films/countries',
        auth: this.credentials,
      });
    },

    /**
     * Get a list of services supported by the /films endpoint.
     *
     * Services are returned in logical order. Some services (including ‘My Services' options) are only available to
     * paying members, so results will vary based on the authenticated member's status.
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films_film-services}
     */
    getFilmServiceList: () => {
      return request<{ status: 200; data: defs.FilmServicesResponse; reason: 'Success' }>({
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films_genres}
     */
    getGenreList: () => {
      return request<{ status: 200; data: defs.GenresResponse; reason: 'Success' }>({
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films_languages}
     */
    getLanguageList: () => {
      return request<{ status: 200; data: defs.LanguagesResponse; reason: 'Success' }>({
        method: 'get',
        path: '/films/languages',
        auth: this.credentials,
      });
    },

    /**
     * Get details about a film by ID or TMDb ID. Supports an optional member ID to honor custom-poster settings.
     *
     * @param id The LID of the film or the TMDb ID prefixed with `tmdb`: e.g. `tmdb:11`.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film_id}
     */
    getFilmDetails: (
      id: string,
      params?: {
        /**
         * Specify the LID of a member to honor any custom-poster settings the member may have for the film, when
         * viewed within the context of their profile or content.
         */
        member?: string;
      },
    ) => {
      return request<
        | { status: 200; data: defs.Film; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
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
     * @private
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film_id_availability}
     */
    filmAvailability: (id: string) => {
      return request<
        | { status: 200; data: defs.FilmAvailabilityResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/availability`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of the authenticated member's friends' relationship with a film by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film_id_friends}
     */
    friendRelationships: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.FriendFilmRelationshipsResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/friends`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of the authenticated member's relationship with a film by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the film.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film_id_me}
     */
    myRelationshipToFilm: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.FilmRelationship; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film_id_members}
     */
    memberRelationships: (
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
         *  - When `film` is specified and `filmRelationship=Watched`, members who most recently watched the film appear
         *    first.
         *  - When `film` is specified and `filmRelationship=Liked`, members who most recently liked the film appear
         *    first.
         *  - When `film` is specified and `filmRelationship=InWatchlist`, members who most recently added the film to
         *    their watchlist appear first.
         *  - When `member` is specified and `memberRelationship=IsFollowing`, most recently followed members appear
         *    first.
         *  - When `member` is specified and `memberRelationship=IsFollowedBy`, most recent followers appear first.
         *
         * Otherwise, members who most recently joined the site appear first.
         *
         * The `*WithFriends` values are only available to authenticated members and consider popularity amongst the
         * member's friends.
         */
        sort?:
          | 'Date'
          | 'MemberPopularity'
          | 'MemberPopularityThisMonth'
          | 'MemberPopularityThisWeek'
          | 'MemberPopularityThisYear'
          | 'MemberPopularityWithFriends'
          | 'MemberPopularityWithFriendsThisMonth'
          | 'MemberPopularityWithFriendsThisWeek'
          | 'MemberPopularityWithFriendsThisYear'
          | 'Name';

        /**
         * Specify the LID of a member to return members who follow or are followed by that member.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `IsFollowing`, which returns the list of members
         * followed by the `member`. Use `IsFollowedBy` to return the list of members that follow the member.
         */
        memberRelationship?: 'IsFollowedBy' | 'IsFollowing';

        /**
         * Must be used in conjunction with `film`. Defaults to `Watched`, which returns the list of members who have
         * seen the `film`. Specify the type of relationship to limit the returned members accordingly.
         */
        filmRelationship?: defs.FilmMemberRelationship;
      },
    ) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.FilmRelationship; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/members`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Update the authenticated member's relationship with a film by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the film.
     * @param params {defs.FilmRelationshipUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-film_id_me}
     */
    updateMyRelationshipToFilm: (id: string, params: defs.FilmRelationshipUpdateRequest) => {
      return request<
        | { status: 200; data: defs.FilmRelationshipUpdateResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
      >({
        method: 'patch',
        path: `/film/${id}/me`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Report a film by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the film.
     * @param params {defs.ReportFilmRequest}
     * @see {@link https://api-docs.letterboxd.com/#path--film--id--report}
     */
    report: (id: string, params: defs.ReportFilmRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
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
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-film_id_statistics}
     */
    filmStatistics: (
      id: string,
      params?: {
        /**
         * Specify the LID of a member to return statistics for members followed by that member.
         */
        member?: string;
      },
    ) => {
      return request<
        | { status: 200; data: defs.FilmStatistics; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
      >({
        method: 'get',
        path: `/film/${id}/statistics`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get a list of availability types supported by the /films endpoint.
     *
     * Availability types are returned in alphabetical order.
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-films_availability-types}
     */
    getAvailabilityTypesList: () => {
      return request<{ status: 200; data: defs.AvailabilityTypesResponse; reason: 'Success' }>({
        method: 'get',
        path: '/films/availability-types',
        auth: this.credentials, // @todo does this need auth?
      });
    },
  };

  public lists = {
    /**
     * A cursored window over a list of lists.
     *
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-lists}
     */
    lists: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * Defaults to `Date`, which returns lists that were most recently created/updated first. The `*WithFriends`
       * values are only available to signed-in members and consider popularity amongst the signed-in member's friends.
       */
      sort?:
        | 'Date'
        | 'ListName'
        | 'ListPopularity'
        | 'ListPopularityThisMonth'
        | 'ListPopularityThisWeek'
        | 'ListPopularityThisYear'
        | 'ListPopularityWithFriends'
        | 'ListPopularityWithFriendsThisMonth'
        | 'ListPopularityWithFriendsThisWeek'
        | 'ListPopularityWithFriendsThisYear'
        | 'WhenAccessedEarliestFirst'
        | 'WhenAccessedLatestFirst'
        | 'WhenCreatedEarliestFirst'
        | 'WhenCreatedLatestFirst'
        | 'WhenLiked'
        | 'WhenPublishedEarliestFirst'
        | 'WhenPublishedLatestFirst';

      /**
       * Specify the LID of a film to return lists that include the film.
       */
      film?: string;

      /**
       * Specify the LID of a list to return lists that were cloned from the list.
       */
      clonedFrom?: string;

      /**
       * @deprecated Use `tagCode` instead.
       * @see tagCode
       */
      tag?: string;

      /**
       * Specify a tag code to limit the returned lists to those tagged accordingly.
       */
      tagCode?: string;

      /**
       * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
       * member.
       */
      tagger?: string;

      /**
       * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by the member. Use
       * `Only` to filter tags set by the member's friends, and `All` to filter tags set by both the member and their
       * friends.
       */
      includeTaggerFriends?: defs.IncludeFriends;

      /**
       * Specify a list of tag codes to limit the returned lists to those with all the specified tags.
       */
      includeTags?: string[];

      /**
       * Specify a list of tag codes to limit the returned lists to those with none of the specified tags.
       */
      excludeTags?: string[];

      /**
       * Specify the LID of a member to return lists that are owned or liked by the member (or their friends, when used
       * with `includeFriends`).
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `Owner`, which returns lists owned by the member. Use
       * `Liked` to return lists liked by the member or `Accessed` to return shared lists that have been viewed by the
       * member.
       */
      memberRelationship?: defs.ListMemberRelationship;

      /**
       * Must be used in conjunction with `member`. Defaults to `None`, which only returns lists from the member's
       * account. Use `Only` to return lists from the member's friends, and `All` to return lists from both the member
       * and their friends.
       */
      includeFriends?: defs.IncludeFriends;

      /**
       * Specify `Clean` to return lists that do not contain profane language. Specify `Published` to return the
       * member's lists that have been made public. Note that private lists for members other than the authenticated
       * member are never returned. Specify `NotPublished` to return the authenticated member's lists that have not
       * been made public.
       */
      where?: defs.ListWhereClause[];

      /**
       * Specify `NoDuplicateMembers` to limit the list to only the first list for each member. `NoDuplicateMembers` is
       * only available when using these sort orders: `Date`, `WhenPublishedLatestFirst`, `WhenCreatedLatestFirst`.
       *
       * @example ['NoDuplicateMembers']
       */
      filter?: 'NoDuplicateMembers'[];

      /**
       * Specify the LIDs of any film(s) you wish to see the status for in respect of the returned list(s). For each
       * nominated film, the response will indicate (for each returned list) whether the list contains the film, and if
       * so, its rank/position in the list.
       */
      filmsOfNote?: string[];
    }) => {
      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member does not own the resource (when requesting `where=NotPublished`).';
          }
        | { status: 200; data: defs.ListsResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film, member, tag or list matches the specified ID.' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param params {defs.ListCreationRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-lists}
     */
    createList: (params: defs.ListCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListCreateResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param params {defs.ListAdditionRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-lists}
     */
    addToLists: (params?: defs.ListAdditionRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListAdditionResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-lists_topics}
     */
    topics: () => {
      return request<{ status: 200; data: defs.TopicsResponse; reason: 'Success' }>({
        method: 'get',
        path: '/lists/topics',
        auth: this.credentials,
      });
    },

    /**
     * Forget a shared list by ID.
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-list_id_forget}
     */
    forgetList: (id: string) => {
      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
      >({
        method: 'post',
        path: `/list/${id}/forget`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of a list by ID.
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-list_id}
     */
    getList: (id: string) => {
      return request<
        | { status: 200; data: defs.List; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * Update a list by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the list.
     * @param params {defs.ListUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-list_id}
     */
    updateList: (id: string, params?: defs.ListUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListUpdateResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 403; data: defs.ErrorResponse; reason: 'Not your list' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation-DELETE-list_id}
     */
    deleteList: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 403; data: defs.ErrorResponse; reason: 'The authenticated member does not own the specified list' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-list_id_comments}
     */
    getListComments: (
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
         * Defaults to `Date`. The `Updates` sort order returns newest content first. Use this to get the most recently
         * posted or edited comments, and pass `includeDeletions=true` to remain consistent in the case where a comment
         * has been deleted.
         */
        sort?: 'Date' | 'DateLatestFirst' | 'Updates';

        /**
         * Use this to discover any comments that were deleted.
         */
        includeDeletions?: boolean;
      },
    ) => {
      return request<
        | { status: 200; data: defs.ListCommentsResponse; reason: 'Success' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the list.
     * @param params {defs.CommentCreationRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-list_id_comments}
     */
    createListComment: (id: string, params: defs.CommentCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member is not authorized to comment on this list';
          }
        | { status: 200; data: defs.ListComment; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-list_id_entries}
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
         * Specify up to 100 Letterboxd IDs or TMDB IDs prefixed with `tmdb:`, or IMDB IDs prefixed with `imdb:`
         * @example ['b8wK', 'imdb:tt1396484']
         */
        filmId?: string[];

        /**
         * Specify the LID of a genre to limit films to those within the specified genre.
         */
        genre?: string;

        /**
         * Specify the LID of a film to limit films to those similar to the specified film.
         * @private
         */
        similarTo?: string;

        /**
         * Specify the code of a theme to limit films to those within the specified theme.
         * @private
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         * @private
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
         * @private
         */
        nanogenre?: string;

        /**
         * Specify the LID of up to 100 genres to limit films to those within all of the specified genres.
         */
        includeGenre?: string[];

        /**
         * Specify the LID of up to 100 genres to limit films to those within none of the specified genres.
         */
        excludeGenre?: string[];

        /**
         * Specify the ISO 3166-1 defined code of the country to limit films to those produced by the specified country.
         */
        country?: string;

        /**
         * Specify the ISO 639-1 defined code of the language to limit films to those using the specified spoken
         * language.
         */
        language?: string;

        /**
         * Specify the starting year of a decade (must end in `0`) to limit films to those released during the decade.
         * @example 1990
         */
        decade?: number;

        /**
         * Specify a year to limit films to those released during that year.
         * @example 1994
         */
        year?: number;

        /**
         * Specify the ID of a supported service to limit films to those available from that service. The list of
         * available services can be found by using the
         * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        service?: string;

        /**
         * Specify the availability types to limit films to those with those availability types. The list of
         * availability types can be found by using the
         * [/films/availability-types](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        availabilityType?: string[];

        /**
         * Set to `true` to limit films to those available on only one service.
         */
        exclusive?: boolean;

        /**
         * Set to `true` to limit films to those not available on any services.
         */
        unavailable?: boolean;

        /**
         * Set to `true` to include films that the user owns.
         */
        includeOwned?: boolean;

        /**
         * Set to `true` to invert the current service filtering options.
         */
        negate?: boolean;

        /**
         * Specify one or more values to limit the list of films accordingly.
         * @example ['Watched', 'Released']
         */
        where?: defs.FilmWhereClause[];

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films for
         * the member to those with a rating equal to or higher than the specified rating.
         */
        memberMinRating?: number;

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films for
         * the member to those with a rating equal to or lower than the specified rating.
         */
        memberMaxRating?: number;

        /**
         * Specify the LID of a member to limit the returned films according to the value set in `memberRelationship` or
         * to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of relationship to limit
         * the returned films accordingly. Use `Ignore` if you only intend to specify the member for use with
         * `sort=MemberRating*`.
         */
        memberRelationship?: defs.FilmMemberRelationship;

        /**
         * Must be used in conjunction with `member`. Defaults to `None`, which only returns films from the member's
         * account. Use `Only` to return films from the member's friends, and `All` to return films from both the
         * member and their friends.
         */
        includeFriends?: defs.IncludeFriends;

        /**
         * @deprecated Use `tagCode` instead.
         * @see tagCode
         */
        tag?: string;

        /**
         * Specify a tag code to limit the returned films to those tagged accordingly.
         */
        tagCode?: string;

        /**
         * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
         * member.
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by the member. Use
         * `Only` to filter tags set by the member's friends, and `All` to filter tags set by both the member and their
         * friends.
         */
        includeTaggerFriends?: defs.IncludeFriends;

        /**
         * Specify a list of tag codes to limit the returned films to those with all the specified tags.
         */
        includeTags?: string[];

        /**
         * Specify a list of tag codes to limit the returned films to those with none of the specified tags.
         */
        excludeTags?: string[];

        /**
         * The order in which the entries should be returned. Defaults to `ListRanking`, which is the order specified
         * by the list owner.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with `member` and are only available when specifying a
         * single member (i.e. `IncludeFriends=None`).
         *
         * @deprecated The `FilmPopularityThisWeek`, `FilmPopularityThisMonth` and `FilmPopularityThisYear` options are
         * deprecated, and have never worked.
         *
         * The `Rating*` options are deprecated in favor of `AverageRating*`.
         */
        sort?:
          | 'AuthenticatedMemberBasedOnLiked'
          | 'AuthenticatedMemberDiaryEarliestFirst'
          | 'AuthenticatedMemberDiaryLatestFirst'
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'AuthenticatedMemberRelatedToLiked'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'FilmDurationLongestFirst'
          | 'FilmDurationShortestFirst'
          | 'FilmName'
          | 'FilmPopularity'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisYear'
          | 'ListRanking'
          | 'MemberDiaryEarliestFirst'
          | 'MemberDiaryLatestFirst'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'OwnerDiaryEarliestFirst'
          | 'OwnerDiaryLatestFirst'
          | 'OwnerRatingHighToLow'
          | 'OwnerRatingLowToHigh'
          | 'RatingHighToLow'
          | 'RatingLowToHigh'
          | 'ReleaseDateEarliestFirst'
          | 'ReleaseDateLatestFirst'
          | 'Shuffle'
          | 'WhenAddedToList'
          | 'WhenAddedToListEarliestFirst';
      },
    ) => {
      return request<
        | { status: 200; data: defs.ListEntriesResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the list.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-list_id_me}
     */
    myRelationshipToList: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListRelationship; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Update the authenticated member's relationship with a list by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the list.
     * @param params {defs.ListRelationshipUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-list_id_me}
     */
    updateMyRelationship: (id: string, params?: defs.ListRelationshipUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ListRelationshipUpdateResponse; reason: 'Success' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the list.
     * @param params {defs.ReportListRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-list_id_report}
     */
    reportList: (id: string, params: defs.ReportListRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-list_id_statistics}
     */
    getListStatistics: (id: string) => {
      return request<
        | { status: 204; data: defs.ListStatistics; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No list matches the specified ID' }
      >({
        method: 'get',
        path: `/list/${id}/statistics`,
        auth: this.credentials,
      });
    },
  };

  public logEntries = {
    /**
     * A cursored window over the log entries for a film or member. A log entry is either a diary entry (must have a
     * date) or a review (must have review text). Log entries can be both a diary entry and a review if they satisfy
     * both criteria.
     *
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-log-entries}
     */
    getLogEntries: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;

      /**
       * The order in which the log entries should be returned. Defaults to `WhenAdded`, which orders by creation date,
       * unless you specify `where=HasDiaryDate` in which case the default is `Date`.
       *
       * The `AuthenticatedMember*` values are only available to signed-in members.
       *
       * The `MemberRating` values must be used in conjunction with member and are only available when specifying a
       * single member (i.e. `IncludeFriends=None`).
       *
       * The `ReviewPopularity` values return reviews with more activity (likes/comments) first, and imply
       * `where=HasReview`.
       *
       * The `FilmPopularity` values return reviews for films with more combined activity first.
       *
       * The `*WithFriends` values are only available to signed-in members and consider popularity amongst the
       * signed-in member's friends.
       *
       * The `Date` value sorts by the diary date, and implies `where=HasDiaryDate`
       *
       * If a film is specified, the only applicable sort orders are `WhenAdded`, `Date`, `EntryRating*` or
       * `ReviewPopularity*`.
       *
       * @deprecated The `Rating*` options are deprecated in favor of `EntryRating*`.
       */
      sort?:
        | 'AuthenticatedMemberRatingHighToLow'
        | 'AuthenticatedMemberRatingLowToHigh'
        | 'AverageRatingHighToLow'
        | 'AverageRatingLowToHigh'
        | 'Date'
        | 'DiaryCount'
        | 'EntryRatingHighToLow'
        | 'EntryRatingLowToHigh'
        | 'FilmDurationLongestFirst'
        | 'FilmDurationShortestFirst'
        | 'FilmName'
        | 'FilmPopularity'
        | 'FilmPopularityThisMonth'
        | 'FilmPopularityThisWeek'
        | 'FilmPopularityThisYear'
        | 'FilmPopularityWithFriends'
        | 'FilmPopularityWithFriendsThisMonth'
        | 'FilmPopularityWithFriendsThisWeek'
        | 'FilmPopularityWithFriendsThisYear'
        | 'MemberRatingHighToLow'
        | 'MemberRatingLowToHigh'
        | 'RatingHighToLow'
        | 'RatingLowToHigh'
        | 'ReleaseDateEarliestFirst'
        | 'ReleaseDateLatestFirst'
        | 'ReviewCount'
        | 'ReviewPopularity'
        | 'ReviewPopularityThisMonth'
        | 'ReviewPopularityThisWeek'
        | 'ReviewPopularityThisYear'
        | 'ReviewPopularityWithFriends'
        | 'ReviewPopularityWithFriendsThisMonth'
        | 'ReviewPopularityWithFriendsThisWeek'
        | 'ReviewPopularityWithFriendsThisYear'
        | 'WhenAdded'
        | 'WhenLiked';

      /**
       * Specify the LID of a film to return log entries for that film. Must not be included if the `sort` value is one
       * of `FilmName`, `ReleaseDate*`, `FilmDuration*` or any of the `FilmPopularity` options.
       */
      film?: string;

      /**
       * Specify the LID of a member to limit the returned log entries according to the value set in
       * `memberRelationship` or to access the `MemberRating*` sort options.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Use `Owner` to limit the returned log entries to those created by
       * the specified member. Use `Liked` to limit the returned reviews to those liked by the specified member
       * (implies `where=HasReview`).
       */
      memberRelationship?: defs.ReviewMemberRelationship;

      /**
       * Must be used in conjunction with `member`. Specify the type of relationship to limit the returned films
       * accordingly. e.g. Use `Liked` to limit the returned reviews to those for films liked by the member.
       */
      filmMemberRelationship?: defs.FilmMemberRelationship;

      /**
       * Must be used in conjunction with `member`. Defaults to `None`, which only returns log entries created or
       * liked by the member. Use `Only` to return log entries created or liked by the member's friends, and `All` to
       * return log entries created or liked by both the member and their friends.
       */
      includeFriends?: defs.IncludeFriends;

      /**
       * If set, limits the returned log entries to those with date that falls during the specified year.
       */
      year?: number;

      /**
       * Accepts values of `1` through `12`. Must be used with `year`. If set, limits the returned log entries to those with a date that falls during the specified month and year.
       */
      month?: number;

      /**
       * Accepts values of `1` through `52`. Must be used with `year`. If set, limits the returned log entries to those
       * with a date that falls during the specified week and year.
       */
      week?: number;

      /**
       * Accepts values of `1` through `31`. Must be used with `month` and `year`. If set, limits the returned log
       * entries to those with a date that falls on the specified day, month and year.
       */
      day?: number;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned log
       * entries to those with a rating equal to or higher than the specified rating.
       */
      minRating?: number;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned log
       * entries to those with a rating equal to or lower than the specified rating.
       */
      maxRating?: number;

      /**
       * Specify the starting year of a decade (must end in `0`) to limit films to those released during the decade.
       * @example 1990
       */
      filmDecade?: number;

      /**
       * Specify a year to limit films to those released during that year.
       * @example 1994
       */
      filmYear?: number;

      /**
       * The LID of the genre. If set, limits the returned log entries to those for films that match the specified
       * genre.
       */
      genre?: string;

      /**
       * Specify the LID of up to 100 genres to limit the returned log entries to those for films within all of the
       * specified genres.
       */
      includeGenre?: string[];

      /**
       * Specify the LID of up to 100 genres to limit the returned log entries to those for films within none of the
       * specified genres.
       */
      excludeGenre?: string[];

      /**
       * Specify the ISO 3166-1 defined code of the country to limit films to those produced by the specified country.
       */
      country?: string;

      /**
       * Specify the ISO 639-1 defined code of the language to limit films to those using the specified spoken language.
       */
      language?: string;

      /**
       * @deprecated Use `tagCode` instead.
       * @see tagCode
       */
      tag?: string;

      /**
       * Specify a tag code to limit the returned log entries to those tagged accordingly.
       */
      tagCode?: string;

      /**
       * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
       * member.
       */
      tagger?: string;

      /**
       * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by the member. Use
       * `Only` to filter tags set by the member's friends, and `All` to filter tags set by both the member and their
       * friends.
       */
      includeTaggerFriends?: defs.IncludeFriends;

      /**
       * Specify a list of tag codes to limit the returned log entries to those with all the specified tags.
       */
      includeTags?: string[];

      /**
       * Specify a list of tag codes to limit the returned log entries to those with none of the specified tags.
       */
      excludeTags?: string[];

      /**
       * Specify the ID of a supported service to limit films to those available from that service. The list of
       * available services can be found by using the
       * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
       */
      service?: string;

      /**
       * Specify the availability types to limit films to those with those availability types. The list of availability
       * types can be found by using the
       * [/films/availability-types](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
       */
      availabilityType?: string[];

      /**
       * Set to `true` to limit films to those available on only one service.
       */
      exclusive?: boolean;

      /**
       * Set to `true` to limit films to those not available on any services.
       */
      unavailable?: boolean;

      /**
       * Set to `true` to include films that the user owns.
       */
      includeOwned?: boolean;

      /**
       * Set to `true` to invert the current service filtering options.
       */
      negate?: boolean;

      /**
       * Specify one or more values to limit the returned log entries accordingly. `Released`, `NotReleased`,
       * `FeatureLength` and `NotFeatureLength` refer to properties of the associated film rather than to the relevant
       * log entry. Use `InWatchlist` or `NotInWatchlist` to limit the returned log entries based on the contents of
       * the authenticated member's watchlist. Use `Watched` and `NotWatched` to limit the returned log entries based
       * on the authenticated member's list of watched films. (Note: you can specify `member` and
       * `filmMemberRelationship` to further limit returned entries based on another member's films or watchlist.) Use
       * `HasDiaryDate` to limit the returned log entries to those that appear in a member's diary. Use `HasReview` to
       * limit the returned log entries to those containing a review. Use `Clean` to exclude reviews that contain
       * profane language. Use `NoSpoilers` to exclude reviews where the owner has indicated that the review text
       * contains plot spoilers for the film. Use `Rated` to limit the returned log entries to those that have a rating
       * (use `minRating` and `maxRating` for more control). Use `NotRated` to limit the returned log entries to those
       * that do not have a rating. Use `Fiction` to exclude log entries of documentaries. Use `Film` to exclude log
       * entries of tv shows. Use `TV` to only return log entries of tv shows.
       * @example ['Clean', 'NoSpoilers']
       */
      where?: defs.LogEntryWhereClause[];

      /**
       * Specify `NoDuplicateMembers` to return only the first log entry for each member. If `film` is not provided,
       * only recent Log Entries will be returned (i.e. entries logged in the past 30 days). `NoDuplicateMembers` is
       * only available when using these sort orders: `WhenAdded`, `Date`, `ReviewPopularity*`. You may not use
       * `NoDuplicateMembers` with `filmMemberRelationship`, `filmDecade`, `filmYear`, `genre`, `tagCode`, `service`,
       * or `where` except `HasDiaryDate`, `HasReview`, `Clean`, and/or `NoSpoilers`.
       * @example ['NoDuplicateMembers']
       */
      filter?: 'NoDuplicateMembers'[];
    }) => {
      return request<
        | { status: 200; data: defs.LogEntriesResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'Film or Member not found' }
      >({
        method: 'get',
        path: '/log-entries',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Create a log entry. A log entry is either a diary entry (must have a date) or a review (must have review text).
     * Log entries can be both a diary entry and a review if they satisfy both criteria.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param params {defs.LogEntryCreationRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-log-entries}
     */
    createLogEntry: (params: defs.LogEntryCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.LogEntry; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'The film was not found' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-log-entry_id}
     */
    getLogEntry: (id: string) => {
      return request<
        | { status: 200; data: defs.LogEntry; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
      >({
        method: 'get',
        path: `/log-entry/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * Update a log entry by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the log entry.
     * @param params {defs.LogEntryUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-log-entry_id}
     */
    updateLogEntry: (id: string, params?: defs.LogEntryUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ReviewUpdateResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the log entry.
     * @see {@link https://api-docs.letterboxd.com/#operation-DELETE-log-entry_id}
     */
    deleteLogEntry: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member is not authorized to delete this log entry';
          }
        | { status: 204; data: never; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-log-entry_id_comments}
     */
    getReviewComments: (
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
         * Defaults to `Date`. The `Updates` sort order returns newest content first. Use this to get the most recently
         * posted or edited comments, and pass `includeDeletions=true` to remain consistent in the case where a comment
         * has been deleted.
         */
        sort?: 'Date' | 'DateLatestFirst' | 'Updates';

        /**
         * Use this to discover any comments that were deleted.
         */
        includeDeletions?: boolean;
      },
    ) => {
      return request<
        | { status: 200; data: defs.ReviewCommentsResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the log entry.
     * @param params {defs.CommentCreationRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-log-entry_id_comments}
     */
    createReviewComment: (id: string, params: defs.CommentCreationRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member is not authorized to comment on this review';
          }
        | { status: 200; data: defs.ReviewComment; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the log entry.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-log-entry_id_me}
     */
    myRelationshipToReview: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.ReviewRelationship; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
      >({
        method: 'get',
        path: `/log-entry/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Update the authenticated member's relationship with a log entry's review by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the log entry.
     * @param params {defs.ReviewRelationshipUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-log-entry_id_me}
     */
    updateMyRelationshipToReview: (id: string, params?: defs.ReviewRelationshipUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member is not authorized to like or subscribe to this review';
          }
        | { status: 200; data: defs.ReviewRelationshipUpdateResponse; reason: 'Success' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the log entry.
     * @param params {defs.ReportReviewRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-log-entry_id_report}
     */
    reportReviewComment: (id: string, params: defs.ReportReviewRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 204; data: never; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-log-entry_id_statistics}
     */
    getReviewStatistics: (id: string) => {
      return request<
        | { status: 200; data: defs.ReviewStatistics; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No log entry matches the specified ID' }
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
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-me}
     */
    whoAmI: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<{ status: 200; data: defs.MemberAccount; reason: 'Success' }>({
        method: 'get',
        path: '/me',
        auth: this.credentials,
      });
    },

    /**
     * Check whether a tag is being merged before update.
     *
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param params {defs.TagCheckRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-me_check-tag}
     */
    checkTag: (params: defs.TagCheckRequest) => {
      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The signed-in user does not have permission to mass-edit tags.';
          }
        | { status: 200; data: defs.TagCheckResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
      >({
        method: 'get',
        path: '/me',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Update the tag code of a tagging.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param params {defs.TagUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-me_update-tag}
     */
    updateTag: (params: defs.TagUpdateRequest) => {
      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The signed-in user does not have permission to mass-edit tags.';
          }
        | { status: 200; data: never; reason: 'Success' }
      >({
        method: 'patch',
        path: '/me/update-tag',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Delete a tag.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param params {defs.TagDeleteRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-DELETE-me_delete-tag}
     */
    deleteTag: (params: defs.TagDeleteRequest) => {
      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The signed-in user does not have permission to mass-edit tags.';
          }
        | { status: 204; data: never; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
      >({
        method: 'delete',
        path: '/me/delete-tag',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Collect a hunt item.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param params {defs.CollectRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-me_collect-item}
     */
    collect: (params: defs.CollectRequest) => {
      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The signed-in user does not have permission to mass-edit tags';
          }
        | { status: 200; data: never; reason: 'Success' }
      >({
        method: 'post',
        path: '/me/collect-item',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Update the account settings for the authenticated member.
     *
     * Usage of this API method requires an access token with following scopes: `user:owner`, `profile:modify`
     *
     * @param params {defs.MemberSettingsUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-me}
     */
    update: (params?: defs.MemberSettingsUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | { status: 200; data: defs.MemberSettingsUpdateResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 403; data: defs.ErrorResponse; reason: 'The request was not allowed' }
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
     * Usage of this API method requires an access token with following scopes: `client:firstparty`
     *
     * @private
     * @param params {defs.DeregisterPushNotificationsRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-me_deregister-push-notifications}
     */
    deregisterPushNotifications: (params: defs.DeregisterPushNotificationsRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<{ status: 204; data: never; reason: 'Success' }>({
        method: 'post',
        path: '/me/deregister-push-notifications',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Deactivate account.
     *
     * Usage of this API method requires an access token with following scopes: `user:owner`, `security:modify`
     *
     * @param params {defs.DisableAccountRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-me_disable}
     */
    disable: (params: defs.DisableAccountRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member provided incorrect authentication details (password and or two-factor auth code)';
          }
        | { status: 204; data: never; reason: 'Success' }
      >({
        method: 'post',
        path: '/me/disable',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Register a device so it can receive push notifications. Letterboxd uses Firebase to send notifications, so the
     * token provided must be obtained from Firebase.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `client:firstparty`
     *
     * @private
     * @param params {defs.RegisterPushNotificationsRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-me_register-push-notifications}
     */
    registerPushNotifications: (params: defs.RegisterPushNotificationsRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<{ status: 204; data: never; reason: 'Success' }>({
        method: 'post',
        path: '/me/register-push-notifications',
        auth: this.credentials,
        params,
      });
    },

    /**
     * Request a validation link via email.
     *
     * If the email address associated with a member's account has not been validated and the validation link has
     * expired or been lost, use this endpoint to request a new validation link.
     *
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-me_validation-request}
     */
    validationEmailRequest: () => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: "The authenticated member's email address was already successfully validated";
          }
        | {
            status: 429;
            data: never;
            reason: "Too many validation requests have been made (the email is probably in the member's spam or junk folder)";
          }
        | { status: 204; data: never; reason: 'Success (the email was dispatched if it matched an existing account)' }
      >({
        method: 'post',
        path: '/me/validation-request',
        auth: this.credentials,
      });
    },
  };

  public members = {
    /**
     * A cursored window over the list of members.
     *
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-members}
     */
    members: (params?: {
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
       * When `review` is specified, members who most recently liked the review appear first.
       *
       * When `list` is specified, members who most recently liked the list appear first.
       *
       * When `film` is specified and `filmRelationship=Watched`, members who most recently watched the film appear
       * first.
       *
       * When `film` is specified and `filmRelationship=Liked`, members who most recently liked the film appear first.
       *
       * When `film` is specified and `filmRelationship=InWatchlist`, members who most recently added the film to their
       * watchlist appear first.
       *
       * When `member` is specified and `memberRelationship=IsFollowing`, most recently followed members appear first.
       *
       * When `member` is specified and `memberRelationship=IsFollowedBy`, most recent followers appear first.
       *
       * Otherwise, members who most recently joined the site appear first.
       *
       * The `*WithFriends` values are only available to authenticated members and consider popularity amongst the
       * member's friends.
       */
      sort?:
        | 'Date'
        | 'MemberPopularity'
        | 'MemberPopularityThisMonth'
        | 'MemberPopularityThisWeek'
        | 'MemberPopularityThisYear'
        | 'MemberPopularityWithFriends'
        | 'MemberPopularityWithFriendsThisMonth'
        | 'MemberPopularityWithFriendsThisWeek'
        | 'MemberPopularityWithFriendsThisYear'
        | 'Name';

      /**
       * Specify the LID of a member to return members who follow or are followed by the member.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `IsFollowing`, which returns the list of members
       * followed by the `member`. Use `IsFollowedBy` to return the list of members that follow the `member`.
       */
      memberRelationship?: 'IsFollowedBy' | 'IsFollowing';

      /**
       * Specify the LID of a film to return members who have interacted with the film.
       */
      film?: string;

      /**
       * Must be used in conjunction with `film`. Defaults to `Watched`, which returns the list of members who have
       * seen the `film`. Specify the type of relationship to limit the returned members accordingly. You must specify
       * a `member` in order to use `InWatchlist`.
       */
      filmRelationship?: defs.FilmMemberRelationship;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned members
       * for the film to those with a rating equal to or higher than the specified rating.
       */
      filmMinRating?: number;

      /**
       * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned members
       * for the film to those with a rating equal to or lower than the specified rating.
       */
      filmMaxRating?: number;

      /**
       * Specify the LID of a story to return members who like the story.
       */
      list?: string;

      /**
       * Must be used in conjunction with `list`. Defaults to `Liked`, which returns the list of members who have liked
       * the `list`. Use `Accessed` to return the list of members who have viewed the shared `list`. The authenticated
       * member must be the owner of the list in order to use `Accessed`.
       */
      listRelationship?: defs.ListMemberRelationship;

      /**
       * Specify the LID of a review to return members who like the review.
       */
      review?: string;

      /**
       * Must be used in conjunction with `story`. Defaults to `Liked`, which returns the list of members who have
       * liked the `story`.
       */
      storyRelationship?: defs.StoryMemberRelationship;
    }) => {
      return request<
        | { status: 200; data: defs.MembersResponse; reason: 'Success' }
        | { status: 403; data: defs.ErrorResponse; reason: 'The request was not allowed' }
      >({
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-members_pronouns}
     */
    getPronounList: () => {
      return request<{ status: 200; data: defs.PronounsResponse; reason: 'Success' }>({
        method: 'get',
        path: '/members/pronouns',
        auth: this.credentials,
      });
    },

    /**
     * Create a new account.
     *
     * Use this endpoint to register a new member account with the Letterboxd network. Usernames must be between 2 and
     * 15 characters long and may only contain upper or lowercase letters, numbers or the underscore (`_`) character.
     *
     * @param params {defs.RegisterRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-members_register}
     */
    register: (params?: defs.RegisterRequest) => {
      return request<
        | { status: 201; data: defs.Member; reason: 'Success' }
        | { status: 400; data: never; reason: 'The username was already taken or is invalid.' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id}
     */
    getMemberDetails: (id: string) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.Member; reason: 'Success' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_activity}
     */
    activity: (
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
         * _Only supported for paying members._
         *
         * Use `include` to specify the subset of activity to be returned. If neither `include` nor `exclude` is set,
         * the activity types included depend on the `where` parameter:
         *
         * If `where=OwnActivity` is specified, all activity except `FilmLikeActivity`, and `FilmWatchActivity` is
         * included.
         *
         * Otherwise all activity except `FilmLikeActivity`, `FilmWatchActivity`, `FilmRatingActivity` and
         * `FollowActivity` is included.
         *
         * These defaults mimic those shown on the website.
         */
        include?: defs.ActivityFilter[];

        /**
         * _Only supported for paying members._
         *
         * @deprecated Use `include` instead.
         * @see include
         */
        exclude?: defs.ActivityFilter[];

        /**
         * Use `where` to reduce the subset of activity to be returned. If `where` is not set, all default activity
         * types relating to the member are returned. If multiple values are supplied, only activity matching all terms
         * will be returned, e.g. `where=OwnActivity&where=NotIncomingActivity` will return all activity by the member
         * except their comments on their own lists and reviews. `NetworkActivity` is activity performed either by the
         * member or their followers. Use `where=NetworkActivity&where=NotOwnActivity` to only see activity from
         * followers. If you don't specify any of `NetworkActivity`, `OwnActivity` or `NotIncomingActivity`, you will
         * receive activity related to the member's content from members outside their network (e.g. comments and likes
         * on the member's lists and reviews).
         */
        where?: ('IncomingActivity' | 'NotIncomingActivity' | 'NotOwnActivity' | 'OwnActivity')[];

        /**
         * Whether to include activity related to adult content. Default to `false`.
         */
        adult?: boolean;

        /**
         * Whether to group related activity into combined events. Default to `false`.
         */
        combine?: boolean;

        /**
         * The parent combined activity for which to retrieve the related child activity. Defaults to `null`.
         */
        parentActivity?: string;
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.ActivityResponse; reason: 'Success' }
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
     * The tags will be returned in order of relevance. All tags previously used by the member will be returned if no
     * search prefix is specified.
     *
     * @deprecated Please use [/list-tags-2](https://api-docs.letterboxd.com/#operation--member--id--list-tags-2-get) instead.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_list-tags}
     */
    autocompleteListTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional". An empty `input`
         * will match all tags.
         */
        input?: string;
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.TagsResponse; reason: 'Success' }
      >({
        method: 'get',
        path: `/member/${id}/list-tags`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get the list of a member's tags, or those that match an optional search prefix.
     *
     * The tags will be returned in order of relevance. All tags previously used by the member will be returned if no
     * search prefix is specified.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_list-tags-2}
     */
    autocompleteListTagInfo: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional". An empty `input`
         * will match all tags.
         */
        input?: string;
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.MemberTagsResponse; reason: 'Success' }
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
     * The tags will be returned in order of relevance. All tags previously used by the member will be returned if no
     * search prefix is specified.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_log-entry-tags}
     */
    autocompleteLogEntryTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional". An empty `input`
         * will match all tags.
         */
        input?: string;
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.MemberTagsResponse; reason: 'Success' }
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
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the other member.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_me}
     */
    relationship: (id: string) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.MemberRelationship; reason: 'Success' }
      >({
        method: 'get',
        path: `/member/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * @deprecated Please use [/log-entry-tags](https://api-docs.letterboxd.com/#operation--member--id--log-entry-tags-get)
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_review-tags}
     */
    autocompleteReviewTags: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional". An empty `input`
         * will match all tags.
         */
        input?: string;
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.TagsResponse; reason: 'Success' }
      >({
        method: 'get',
        path: `/member/${id}/review-tags`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * @deprecated Please use [/log-entry-tags](https://api-docs.letterboxd.com/#operation--member--id--log-entry-tags-get) instead
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_review-tags-2}
     */
    autocompleteReviewTagInfo: (
      id: string,
      params?: {
        /**
         * A case-insensitive prefix match. E.g. "pro" will match "pro", "project" and "Professional". An empty `input`
         * will match all tags.
         */
        input?: string;
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.MemberTagsResponse; reason: 'Success' }
      >({
        method: 'get',
        path: `/member/${id}/review-tags-2`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Update the authenticated member's relationship with another member by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the other member.
     * @param params {defs.MemberRelationshipUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-member_id_me}
     */
    updateRelationship: (id: string, params?: defs.MemberRelationshipUpdateRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.MemberRelationshipUpdateResponse; reason: 'Success' }
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
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the member.
     * @param params {defs.ReportMemberRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-member_id_report}
     */
    reportMember: (id: string, params: defs.ReportMemberRequest) => {
      if (!this.credentials.accessToken) {
        return Promise.reject(new MissingAccessTokenError());
      }

      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 204; data: never; reason: 'Success' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_statistics}
     */
    getMemberStatistics: (id: string) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.MemberStatistics; reason: 'Success' }
      >({
        method: 'get',
        path: `/member/${id}/statistics`,
        auth: this.credentials,
      });
    },

    /**
     * Get details of a member's public watchlist by ID.
     *
     * The response will include the film relationships for the signed-in member, the watchlist's owner, and the member
     * indicated by the `member` LID if specified (the `member` and `memberRelationship` parameters are optional, and
     * can be used to perform comparisons between the watchlist owner and another member). Use the
     * [/film/{id}/me](https://api-docs.letterboxd.com/#path--film--id--me) endpoint to add or remove films from a
     * member's watchlist.
     *
     * @param id The LID of the member.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-member_id_watchlist}
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
         * Specify up to 100 Letterboxd IDs or TMDB IDs prefixed with `tmdb:`, or IMDB IDs prefixed with `imdb:`
         * @example ['b8wK', 'imdb:tt1396484']
         */
        filmId?: string[];

        /**
         * Specify the LID of a genre to limit films to those within the specified genre.
         */
        genre?: string;

        /**
         * Specify the LID of a film to limit films to those similar to the specified film.
         * @private
         */
        similarTo?: string;

        /**
         * Specify the code of a theme to limit films to those within the specified theme.
         * @private
         */
        theme?: string;

        /**
         * Specify the code of a minigenre to limit films to those within the specified minigenre.
         * @private
         */
        minigenre?: string;

        /**
         * Specify the code of a nanogenre to limit films to those within the specified nanogenre.
         * @private
         */
        nanogenre?: string;

        /**
         * Specify the LID of up to 100 genres to limit films to those within all of the specified genres.
         */
        includeGenre?: string[];

        /**
         * Specify the LID of up to 100 genres to limit films to those within none of the specified genres.
         */
        excludeGenre?: string[];

        /**
         * Specify the ISO 3166-1 defined code of the country to limit films to those produced by the specified country.
         */
        country?: string;

        /**
         * Specify the ISO 639-1 defined code of the language to limit films to those using the specified spoken
         * language.
         */
        language?: string;

        /**
         * Specify the starting year of a decade (must end in `0`) to limit films to those released during the decade.
         * @example 1990
         */
        decade?: number;

        /**
         * Specify a year to limit films to those released during that year.
         * @example 1994
         */
        year?: number;

        /**
         * Specify the ID of a supported service to limit films to those available from that service. The list of
         * available services can be found by using the
         * [/films/film-services](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        service?: string;

        /**
         * Specify the availability types to limit films to those with those availability types. The list of
         * availability types can be found by using the
         * [/films/availability-types](https://api-docs.letterboxd.com/#path--films-film-services) endpoint.
         */
        availabilityType?: string[];

        /**
         * Set to `true` to limit films to those available on only one service.
         */
        exclusive?: boolean;

        /**
         * Set to `true` to limit films to those not available on any services.
         */
        unavailable?: boolean;

        /**
         * Set to `true` to include films that the user owns.
         */
        includeOwned?: boolean;

        /**
         * Set to `true` to invert the current service filtering options.
         */
        negate?: boolean;

        /**
         * Specify one or more values to limit the list of films accordingly.
         * @example ['Watched', 'Released']
         */
        where?: defs.FilmWhereClause[];

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films
         * for the member to those with a rating equal to or higher than the specified rating.
         */
        memberMinRating?: number;

        /**
         * Allowable values are between `0.5` and `5.0`, with increments of `0.5`. If set, limits the returned films
         * for the member to those with a rating equal to or lower than the specified rating.
         */
        memberMaxRating?: number;

        /**
         * Specify the LID of a member to limit the returned films according to the value set in `memberRelationship`
         * or to access the `MemberRating*` sort options.
         */
        member?: string;

        /**
         * Must be used in conjunction with `member`. Defaults to `Watched`. Specify the type of relationship to limit
         * the returned films accordingly. Use `Ignore` if you only intend to specify the member for use with
         * `sort=MemberRating*`.
         */
        memberRelationship?: defs.FilmMemberRelationship;

        /**
         * Must be used in conjunction with `member`. Defaults to `None`, which only returns films from the member's
         * account. Use `Only` to return films from the member's friends, and `All` to return films from both the
         * member and their friends.
         */
        includeFriends?: defs.IncludeFriends;

        /**
         * @deprecated Use `tagCode` instead.
         * @see tagCode
         */
        tag?: string;

        /**
         * Specify a tag code to limit the returned films to those tagged accordingly.
         */
        tagCode?: string;

        /**
         * Must be used with `tagCode` or `includeTags`. Specify the LID of a member to focus the tag filter on the
         * member.
         */
        tagger?: string;

        /**
         * Must be used in conjunction with `tagger`. Defaults to `None`, which filters tags set by the member. Use
         * `Only` to filter tags set by the member's friends, and `All` to filter tags set by both the member and their
         * friends.
         */
        includeTaggerFriends?: defs.IncludeFriends;

        /**
         * Specify a list of tag codes to limit the returned films to those with all the specified tags.
         */
        includeTags?: string[];

        /**
         * Specify a list of tag codes to limit the returned films to those with none of the specified tags.
         */
        excludeTags?: string[];

        /**
         * The order in which the entries should be returned. Defaults to `Added`, which is the order that the films
         * were added to the watchlist, most recent first.
         *
         * The `AuthenticatedMember*` values are only available to signed-in members.
         *
         * The `MemberRating` values must be used in conjunction with `member` and are only available when specifying a
         * single member (i.e. `IncludeFriends=None`).
         *
         * @deprecated The `FilmPopularityThisWeek`, `FilmPopularityThisMonth` and `FilmPopularityThisYear` options are
         * deprecated, and have never worked.
         *
         * The `Rating*` options are deprecated in favor of `AverageRating*`.
         */
        sort?:
          | 'Added'
          | 'AuthenticatedMemberBasedOnLiked'
          | 'AuthenticatedMemberRatingHighToLow'
          | 'AuthenticatedMemberRatingLowToHigh'
          | 'AuthenticatedMemberRelatedToLiked'
          | 'AverageRatingHighToLow'
          | 'AverageRatingLowToHigh'
          | 'DateEarliestFirst'
          | 'DateLatestFirst'
          | 'FilmDurationLongestFirst'
          | 'FilmDurationShortestFirst'
          | 'FilmName'
          | 'FilmPopularity'
          | 'FilmPopularityThisMonth'
          | 'FilmPopularityThisWeek'
          | 'FilmPopularityThisYear'
          | 'MemberRatingHighToLow'
          | 'MemberRatingLowToHigh'
          | 'OwnerRatingHighToLow'
          | 'OwnerRatingLowToHigh'
          | 'RatingHighToLow'
          | 'RatingLowToHigh'
          | 'ReleaseDateEarliestFirst'
          | 'ReleaseDateLatestFirst'
          | 'Shuffle';
      },
    ) => {
      return request<
        | {
            status: 404;
            data: defs.ErrorResponse;
            reason: 'No member matches the specified ID, or the member has opted out of appearing in the API.';
          }
        | { status: 200; data: defs.FilmsResponse; reason: 'Success' }
        | { status: 403; data: defs.ErrorResponse; reason: "The specified member's watchlist is private" }
      >({
        method: 'get',
        path: `/member/${id}/watchlist`,
        auth: this.credentials,
        params,
      });
    },
  };

  public news = {
    /**
     * Get recent news from the Letterboxd editors.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-news}
     */
    recentNews: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is `20`, maximum is `100`).
       */
      perPage?: number;
    }) => {
      return request<{ status: 200; data: defs.NewsResponse; reason: 'Success' }>({
        method: 'get',
        path: '/news',
        params,
      });
    },
  };

  public search = {
    /**
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-search}
     */
    search: (params: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       * The number of items to include per page (default is 20, maximum is 100).
       */
      perPage?: number;

      /**
       * The word, partial word or phrase to search for.
       */
      input: string;

      /**
       * The type of search to perform. Defaults to `FullText`, which performs a standard search considering text in
       * all fields. `Autocomplete` only searches primary fields.
       */
      searchMethod?: 'Autocomplete' | 'FullText' | 'NamesAndKeywords';

      /**
       * The types of results to search for. Default to all SearchResultTypes.
       */
      include?: defs.SearchResultType[];

      /**
       * The type of contributor to search for. Implies `include=ContributorSearchItem`.
       */
      contributionType?: defs.ContributionType;

      /**
       * Whether to include adult content in search results. Default to `false`.
       */
      adult?: boolean;
    }) => {
      return request<{ status: 200; data: defs.SearchResponse; reason: 'The search results' }>({
        method: 'get',
        path: '/search',
        params,
      });
    },
  };

  public stories = {
    /**
     * A cursored window over a list of stories.
     *
     * Use the `next` cursor to move through the list.
     *
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-stories}
     */
    stories: (params?: {
      /**
       * The pagination cursor.
       */
      cursor?: string;

      /**
       */
      perPage?: number;

      /**
       * Defaults to `WhenUpdatedLatestFirst`, which returns stories that were most recently created/updated first.
       */
      sort?:
        | 'PinnedFirst'
        | 'StoryTitle'
        | 'WhenCreatedEarliestFirst'
        | 'WhenCreatedLatestFirst'
        | 'WhenLiked'
        | 'WhenPublishedEarliestFirst'
        | 'WhenPublishedLatestFirst'
        | 'WhenUpdatedEarliestFirst'
        | 'WhenUpdatedLatestFirst';

      /**
       * Specify the LID of a member to return stories from that member's account.
       */
      member?: string;

      /**
       * Must be used in conjunction with `member`. Defaults to `Owner`, which returns stories owned by the member. Use
       * `Liked` to return stories liked by the member.
       */
      memberRelationship?: defs.StoryMemberRelationship;

      /**
       * Specify `Published` to return the member's stories that have been made public. Note that unpublished stories
       * for members other than the authenticated member are never returned. Specify `NotPublished` to return the
       * authenticated member's stories that have not been made public.
       */
      where?: ('NotPublished' | 'Published')[];
    }) => {
      return request<
        | { status: 200; data: defs.StoriesResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No film, member, tag or list matches the specified ID.' }
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
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-story_id}
     */
    getStory: (id: string) => {
      return request<
        | { status: 200; data: defs.Story; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'get',
        path: `/story/${id}`,
        auth: this.credentials,
      });
    },

    /**
     * A cursored window over the comments for a story.
     *
     * Use the `next` cursor to move through the comments.
     *
     * @param id The LID of the story.
     * @param params
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-story_id_comments}
     */
    getStoryComments: (
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
         * Defaults to `Date`. The `Updates` sort order returns newest content first. Use this to get the most recently
         * posted or edited comments, and pass `includeDeletions=true` to remain consistent in the case where a comment
         * has been deleted.
         */
        sort?: 'Date' | 'DateLatestFirst' | 'Updates';

        /**
         * Use this to discover any comments that were deleted.
         */
        includeDeletions?: boolean;
      },
    ) => {
      return request<
        | { status: 200; data: defs.StoryCommentsResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'get',
        path: `/story/${id}/comments`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Get details of the authenticated member's relationship with a story by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`
     *
     * @param id The LID of the story.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-story_id_me}
     */
    myRelationshipToStory: (id: string) => {
      return request<
        | { status: 200; data: defs.StoryRelationship; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'get',
        path: `/story/${id}/me`,
        auth: this.credentials,
      });
    },

    /**
     * Get statistical data about a story by ID.
     *
     * @param id The LID of the story.
     * @see {@link https://api-docs.letterboxd.com/#operation-GET-story_id_statistics}
     */
    getStoryStatistics: (id: string) => {
      return request<
        | { status: 200; data: defs.StoryStatistics; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'get',
        path: `/story/${id}/statistics`,
        auth: this.credentials,
      });
    },

    /**
     * Create a comment on a story.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the story.
     * @param params {defs.CommentCreationRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-POST-story_id_comments}
     */
    createStoryComment: (id: string, params: defs.CommentCreationRequest) => {
      return request<
        | {
            status: 403;
            data: defs.ErrorResponse;
            reason: 'The authenticated member is not authorized to comment on this review';
          }
        | { status: 200; data: defs.ReviewComment; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'post',
        path: `/story/${id}/comments`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Update a story by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the story.
     * @param params {defs.StoryUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-story_id}
     */
    updateStory: (id: string, params: defs.StoryUpdateRequest) => {
      return request<
        | { status: 200; data: defs.StoryUpdateResponse; reason: 'Success' }
        | { status: 400; data: defs.ErrorResponse; reason: 'Bad request' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'patch',
        path: `/story/${id}`,
        auth: this.credentials,
        params,
      });
    },

    /**
     * Update the authenticated member's relationship with a story by ID.
     *
     * Usage of this API method requires an access token with following scopes: `user`, `content:modify`
     *
     * @param id The LID of the story.
     * @param params {defs.StoryRelationshipUpdateRequest}
     * @see {@link https://api-docs.letterboxd.com/#operation-PATCH-story_id_me}
     */
    updateMyRelationshipToStory: (id: string, params: defs.StoryRelationshipUpdateRequest) => {
      return request<
        | { status: 200; data: defs.StoryRelationshipUpdateResponse; reason: 'Success' }
        | { status: 404; data: defs.ErrorResponse; reason: 'No story matches the specified ID' }
      >({
        method: 'patch',
        path: `/story/${id}/me`,
        auth: this.credentials,
        params,
      });
    },
  };
}
