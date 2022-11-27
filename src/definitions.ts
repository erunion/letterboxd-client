export interface AbstractActivity {
  /**
   * The type of activity.
   */
  type:
    | DiaryEntryActivity
    | FilmLikeActivity
    | FilmRatingActivity
    | FilmWatchActivity
    | FollowActivity
    | InvitationAcceptedActivity
    | ListActivity
    | ListCommentActivity
    | ListLikeActivity
    | RegistrationActivity
    | ReviewActivity
    | ReviewCommentActivity
    | ReviewLikeActivity
    | StoryActivity
    | WatchlistActivity;

  /**
   * The member associated with the activity.
   */
  member: MemberSummary;

  /**
   * The timestamp of the activity, in ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;
}

export interface AbstractComment {
  /**
   * The type of comment.
   */
  type: ListComment | ReviewComment;

  /**
   * The LID of the comment/reply.
   */
  id: string;

  /**
   * The member who posted the comment.
   */
  member: MemberSummary;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenUpdated: string;

  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  commentLbml: string;

  /**
   * If Letterboxd moderators have removed the comment from the site, `removedByAdmin` will be true
   * and `comment` will not be included.
   */
  removedByAdmin: boolean;

  /**
   * If the content owner has removed the comment from the site, `removedByContentOwner` will be
   * true and `comment` will not be included.
   */
  removedByContentOwner: boolean;

  /**
   * If the comment owner has removed the comment from the site, `deleted` will be true and
   * `comment` will not be included.
   */
  deleted: boolean;

  /**
   * If the authenticated member has blocked the commenter, `blocked` will be true and `comment`
   * will not be included.
   */
  blocked: boolean;

  /**
   * If the content owner has blocked the commenter, `blockedByOwner` will be true and `comment`
   * will not be included.
   */
  blockedByOwner: boolean;

  /**
   * If the authenticated member posted this comment, and the comment is still editable, this value
   * shows the number of seconds remaining until the editing window closes.
   */
  editableWindowExpiresIn: number;

  /**
   * The message portion of the comment formatted as HTML.
   */
  comment: string;
}

export interface AbstractSearchItem {
  /**
   * The type of the search result.
   */
  type:
    | ContributorSearchItem
    | FilmSearchItem
    | ListSearchItem
    | MemberSearchItem
    | ReviewSearchItem
    | TagSearchItem
    | StorySearchItem
    | ArticleSearchItem
    | PodcastSearchItem;

  /**
   * A relevancy value that can be used to order results.
   */
  score: number;
}

export interface AccessToken {
  /**
   * The access token that grants the member access. Combine this with the `token_type` to form the
   * `Authorization` header.
   */
  access_token: string;

  /**
   * The type of the access token. Use value: `bearer`
   */
  token_type: string;

  /**
   * The refresh token is used to obtain a new access token, after the access token expires, without
   * needing to prompt the member for their credentials again. The refresh token only expires if it
   * is explicitly invalidated by Letterboxd, in which case the member should be prompted for their
   * credentials (or stored credentials used).
   */
  refresh_token: string;

  /**
   * The number of seconds before the access token expires.
   */
  expires_in: number;

  issuer: string;
}

export interface ActivityResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of activity items.
   */
  items: AbstractActivity[];
}

export interface AListAddition {
  /**
   * The list.
   */
  list: ListIdentifier;

  /**
   * The number of films added to the list.
   */
  additions: number;
}

export interface AListEntryOccurrence {
  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1.
   */
  rank: number;

  /**
   * The film LID for this entry.
   */
  filmId: string;
}

export interface AListTopic {
  /**
   * The topic name.
   */
  name: string;

  /**
   * The list of featured lists for the topic.
   */
  items: ListSummary[];
}

export type ArticleSearchItem = AbstractSearchItem & {
  /**
   * The article.
   */
  article: NewsItem;
};

export interface CommentCreationRequest {
  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of
   * 100,000 characters.
   */
  comment: string;
}

export interface CommentUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'MissingComment'
    | 'CommentOnContentYouBlocked'
    | 'CommentOnBlockedContent'
    | 'CommentBan'
    | 'CommentEditWindowExpired'
    | 'CommentTooLong';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface CommentUpdateRequest {
  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of
   * 100,000 characters.
   */
  comment: string;
}

export interface CommentUpdateResponse {
  /**
   * The response object.
   */
  data: AbstractComment;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: CommentUpdateMessage[];
}

export interface ContributionStatistics {
  /**
   *  The type of contribution.
   */
  type:
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
   * The number of films for this contribution type.
   */
  filmCount: number;
}

export interface Contributor {
  /**
   * The LID of the contributor.
   */
  id: string;

  /**
   * The name of the contributor.
   */
  name: string;

  /**
   * The ID of the contributor on TMDB, if known
   */
  tmdbid: string;

  /**
   * An array of the types of contributions made, with a count of films for each contribution type.
   */
  statistics: ContributorStatistics;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];
}

export type ContributorSearchItem = AbstractSearchItem & {
  /**
   * Details of the contributor.
   */
  contributor: Contributor;
};

export interface ContributorStatistics {
  /**
   * The statistics for each contribution type.
   */
  contributions: ContributionStatistics[];
}

export interface ContributorSummary {
  /**
   * The LID of the contributor.
   */
  id: string;

  /**
   * The name of the contributor.
   */
  name: string;

  /**
   * The character name if available (only if the contribution is as an `Actor`; see the `type`
   * field in FilmContributions).
   *
   * @see FilmContributions
   */
  characterName: string;

  /**
   * The ID of the contributor on TMDB, if known
   */
  tmdbid: string;
}

export interface CountriesResponse {
  /**
   * The list of countries.
   */
  items: Country[];
}

export interface Country {
  /**
   * The ISO 3166-1 defined code of the country.
   */
  code: string;

  /**
   * The name of the country.
   */
  name: string;
}

/**
 * A cursor is a string value provided by the API. It should be treated as an opaque value — don't
 * change it.
 */
export type Cursor = string;

export interface DeregisterPushNotificationsRequest {
  /**
   * The device ID.
   */
  deviceId: string;
}

export interface DiaryDetails {
  /**
   * The date the film was watched, if specified, in ISO 8601 format, i.e. `YYYY-MM-DD`
   */
  diaryDate: string;

  /**
   * Will be `true` if the member has indicated (or it can be otherwise determined) that the member
   * has seen the film prior to this date.
   */
  rewatch: boolean;
}

export type DiaryEntryActivity = AbstractActivity & {
  /**
   * The log entry associated with this activity
   */
  diaryEntry: LogEntry;
};

export interface DisableAccountRequest {
  /**
   * The member's current password.
   */
  currentPassword: string;

  /**
   * The disable account mode - defaults to 'Disable' if not specified.
   */
  mode?: 'Disable' | 'Delete';
}

export interface Film {
  /**
   * The LID of the film.
   */
  id: string;

  /**
   * The title of the film.
   */
  name: string;

  /**
   * The original title of the film, if it was first released with a non-English title.
   */
  originalName: string;

  /**
   * The other names by which the film is known (including alternative titles and/or foreign
   * translations).
   */
  alternativeNames: string[];

  /**
   * The year in which the film was first released.
   */
  releaseYear: number;

  /**
   * The list of directors for the film.
   */
  directors: ContributorSummary[];

  /**
   * The film's poster image (2:3 aspect ratio in multiple sizes). Will contain only a single
   * obfuscated image if the `adult` flag is `true.
   */
  poster: Image;

  /**
   * The film's unobfuscated poster image (2:3 aspect ratio in multiple sizes), only populated if
   * the `adult` flag is `true`, may contain adult content.
   */
  adultPoster: Image;

  /**
   * The film's position in the official Letterboxd Top 250 list of narrative feature films, null
   * if the film is not in the list.
   */
  top250Position: number;

  /**
   * `true` if the film is in TMDb's 'Adult' category.
   */
  adult: boolean;

  /**
   * `true` if reviews for the film are hidden due to a high volume of moderation traffic.
   */
  reviewsHidden: boolean;

  /**
   * The LID of the collection containing this film.
   */
  filmCollectionId: string;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * Relationships to the film for the authenticated member (if any) and other members where
   * relevant.
   */
  relationships: MemberFilmRelationship[];

  /**
   * The film's genres.
   */
  genres: Genre[];

  /**
   * The tagline for the film.
   */
  tagline: string;

  /**
   * A synopsis of the film.
   */
  description: string;

  /**
   * The film's duration (in minutes).
   */
  runTime: number;

  /**
   * The film's backdrop image (16:9 ratio in multiple sizes).
   */
  backdrop: Image;

  /**
   * The backdrop's vertical focal point, expressed as a proportion of the image's height, using
   * values between `0.0` and `1.0`. Use when cropping the image into a shorter space, such as in
   * the page for a film on the Letterboxd site.
   */
  backdropFocalPoint: number;

  /**
   * The film's trailer.
   */
  trailer: FilmTrailer;

  /**
   * The film's production countries.
   */
  countries: Country[];

  /**
   * The film's spoken languages.
   */
  languages: Language[];

  /**
   * The film's contributors (director, cast and crew) grouped by discipline.
   */
  contributions: FilmContributions[];

  /**
   * The related news items for the film.
   */
  news: NewsItem[];

  /**
   * The related recent stories for the film.
   */
  recentStories: Story[];

  /**
   * The other films most similar to the film.
   *
   * @private First party API clients only
   */
  similarTo: FilmSummary[];

  /**
   * The film's themes.
   *
   * @private First party API clients only
   */
  themes: Theme[];

  /**
   * The film's minigenres.
   *
   * @private First party API clients only
   */
  minigenres: Minigenre[];

  /**
   * The film's nanogenres.
   *
   * @private First party API clients only
   */
  nanogenres: Nanogenre[];
}

export interface FilmAvailability {
  /**
   * @deprecated Use `displayName` instead.
   * @see FilmAvailability.displayName
   */
  service: 'Amazon' | 'AmazonVideo' | 'AmazonPrime' | 'iTunes' | 'Netflix';

  /**
   * The name of the service.
   */
  displayName: string;

  /**
   * The URL of the thumbnail image for the service.
   */
  icon: string;

  /**
   * The regional store for the service. Not all countries are supported on all services.
   */
  country:
    | 'AIA'
    | 'ARE'
    | 'ARG'
    | 'ARM'
    | 'ATG'
    | 'AUS'
    | 'AUT'
    | 'AZE'
    | 'BEL'
    | 'BFA'
    | 'BGR'
    | 'BHR'
    | 'BHS'
    | 'BLR'
    | 'BLZ'
    | 'BMU'
    | 'BOL'
    | 'BRA'
    | 'BRB'
    | 'BRN'
    | 'BWA'
    | 'CAN'
    | 'CHE'
    | 'CHL'
    | 'CHN'
    | 'COL'
    | 'CPV'
    | 'CRI'
    | 'CYM'
    | 'CYP'
    | 'CZE'
    | 'DEU'
    | 'DMA'
    | 'DNK'
    | 'DOM'
    | 'ECU'
    | 'EGY'
    | 'ESP'
    | 'EST'
    | 'FIN'
    | 'FJI'
    | 'FRA'
    | 'FSM'
    | 'GBR'
    | 'GHA'
    | 'GMB'
    | 'GNB'
    | 'GRC'
    | 'GRD'
    | 'GTM'
    | 'HKG'
    | 'HND'
    | 'HRV'
    | 'HUN'
    | 'IDN'
    | 'IND'
    | 'IRL'
    | 'ISR'
    | 'ITA'
    | 'ISL'
    | 'JOR'
    | 'JPN'
    | 'KAZ'
    | 'KEN'
    | 'KGZ'
    | 'KHM'
    | 'KNA'
    | 'KOR'
    | 'LAO'
    | 'LBN'
    | 'LKA'
    | 'LTU'
    | 'LUX'
    | 'LVA'
    | 'MAC'
    | 'MDA'
    | 'MEX'
    | 'MLT'
    | 'MNG'
    | 'MOZ'
    | 'MUS'
    | 'MYS'
    | 'NAM'
    | 'NER'
    | 'NGA'
    | 'NIC'
    | 'NLD'
    | 'NOR'
    | 'NPL'
    | 'NZL'
    | 'OMN'
    | 'PAN'
    | 'PER'
    | 'PHL'
    | 'PNG'
    | 'POL'
    | 'PRT'
    | 'PRY'
    | 'QAT'
    | 'ROU'
    | 'RUS'
    | 'SAU'
    | 'SGP'
    | 'SLV'
    | 'SVK'
    | 'SVN'
    | 'SWE'
    | 'SWZ'
    | 'THA'
    | 'TJK'
    | 'TKM'
    | 'TTO'
    | 'TUR'
    | 'TWN'
    | 'UGA'
    | 'UKR'
    | 'USA'
    | 'UZB'
    | 'VEN'
    | 'VGB'
    | 'VNM'
    | 'ZAF'
    | 'ZWE'
    | 'GUF'
    | 'YEM'
    | 'KWT'
    | 'LBY'
    | 'MAR'
    | 'DZA'
    | 'TUN'
    | 'GIB'
    | 'SMR'
    | 'MCO'
    | 'LIE'
    | 'URY'
    | 'JAM'
    | 'CIV'
    | 'GNQ'
    | 'GGY'
    | 'SRB'
    | 'PAK'
    | 'PYF'
    | 'LCA'
    | 'SYC'
    | 'IRQ'
    | 'TCA'
    | 'ZMB'
    | 'SEN'
    | 'TZA'
    | 'AND'
    | 'ALB'
    | 'BIH'
    | 'VAT';

  /**
   * The unique ID (if any) for the film on this service.
   */
  id: string;

  /**
   * The URL for the film on this service.
   */
  url: string;

  /**
   * The types of the availability, possible options included buy, rent and stream
   */
  types: string[];

  /**
   * The code for the service.
   */
  serviceCode: string;
}

export interface FilmAvailabilityResponse {
  /**
   * The list of stores where the film is available for streaming or purchasing, in order of
   * preference. If the member has not specified their preferred stores for a service, the USA
   * store will be assumed.
   */
  items: FilmAvailability[];
}

export interface FilmCollection {
  /**
   * The LID of the film collection.
   */
  id: string;

  /**
   * The name of the collection.
   */
  name: string;

  /**
   * The list of films in the collection.
   */
  films: FilmSummary[];

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];
}

export interface FilmContribution {
  /**
   * The type of contribution.
   */
  type:
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
   * The film.
   */
  film: FilmSummary;

  /**
   * The name of the character (only when type is Actor).
   */
  characterName: string;
}

export interface FilmContributions {
  /**
   * The type of contribution.
   */
  type:
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
   * The list of contributors of the specified type for the film.
   */
  contributors: ContributorSummary[];
}

export interface FilmContributionsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of contributions.
   */
  items: FilmContribution[];

  /**
   * Metadata about the contributor's contributions.
   */
  metadata: FilmContributorMetadata[];

  /**
   * The relationships to the contributor for the members referenced in the request.
   */
  relationships: FilmContributorMemberRelationship[];
}

export interface FilmContributorMemberRelationship {
  /**
   * The member.
   */
  member: MemberSummary;

  /**
   * The relationship details.
   */
  relationships: FilmContributorRelationship[];
}

export interface FilmContributorMetadata {
  /**
   * The type of contribution.
   */
  type:
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
   * The details for this contribution type.
   */
  data: FilmsMetadata;
}

export interface FilmContributorRelationship {
  /**
   * The type of contribution.
   */
  type:
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
   * The relationship the member has with the (filtered) films.
   */
  relationship: FilmsRelationship;
}

export interface FilmIdentifier {
  /**
   * The LID of the film.
   */
  id: string;
}

export type FilmLikeActivity = AbstractActivity & {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who
   * added the activity.
   *
   * @see MemberFilmRelationship
   */
  film: FilmSummary;
};

export type FilmRatingActivity = AbstractActivity & {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who
   * added the activity.
   *
   * @see MemberFilmRelationship
   */
  film: FilmSummary;

  /**
   * The member's rating for the film. Allowable values are between `0.5` and `5.0`, with increments
   * of `0.5`.
   */
  rating: number;
};

export interface FilmRelationship {
  /**
   * Will be `true` if the member has indicated they've seen the film (via the 'eye' icon) or has a
   * log entry for the film.
   */
  watched: boolean;

  /**
   * If `watched=true`, `whenWatched` will contain the time when the member marked the film as
   * watched. ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenWatched: string;

  /**
   * Will be `true` if the member likes the film (via the 'heart' icon).
   */
  liked: boolean;

  /**
   * If `liked=true`, `whenLiked` will contain the time when the member marked the film as liked.
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenLiked: string;

  /**
   * Will be `true` if the member listed the film as one of their four favorites.
   */
  favorited: boolean;

  /**
   * Will be `true` if the film is in the member's watchlist.
   */
  inWatchlist: boolean;

  /**
   * If `inWatchlist=true`, `whenAddedToWatchlist` will contain the time when the member added the
   * film to their watchlist. ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenAddedToWatchlist: string;

  /**
   * If the member used to have the film in their watchlist, and subsequently watched the film,
   * `whenCompletedInWatchlist` will contain the time when the member marked the film as watched.
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCompletedInWatchlist: string;

  /**
   * The member's rating for the film.
   */
  rating: number;

  /**
   * A list of LIDs for reviews the member has written for the film in the order they were added,
   * with most recent reviews first.
   */
  reviews: string[];

  /**
   * A list of LIDs for log entries the member has added for the film in diary order, with most
   * recent entries first.
   */
  diaryEntries: string[];
}

export interface FilmRelationshipUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code: 'InvalidRatingValue' | 'UnableToRemoveWatch';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

/**
 * When PATCHing a film relationship, you may send all of the current property values, or just
 * those you wish to change. Properties that violate business rules (see watched below) or contain
 * invalid values will be ignored.
 */
export interface FilmRelationshipUpdateRequest {
  /**
   * Set to `true` to change the film's status for the authenticated member to 'watched' or `false`
   * for 'not watched'. If the status is changed to 'watched' and the film is in the member's
   * watchlist, it will be removed as part of this action. You may not change the status of a film
   * to 'not watched' if there is existing activity (a rating, review or diary entry) for the
   * authenticated member—check the messages returned from this endpoint to ensure no such business
   * rules have been violated.
   */
  watched: boolean;

  /**
   * Set to `true` to change the film's status for the authenticated member to 'liked' or `false`
   * for 'not liked'.
   */
  liked: boolean;

  /**
   * Set to `true` to add the film to the authenticated member's watchlist, or `false` to remove it.
   */
  inWatchlist: boolean;

  /**
   * Accepts values between `0.5` and `5.0`, with increments of `0.5`, or `null` (to remove the
   * rating). If set, `watched` is assumed to be `true`.
   */
  rating: number;
}

export interface FilmRelationshipUpdateResponse {
  /**
   * The response object.
   */
  data: FilmRelationship;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: FilmRelationshipUpdateMessage[];
}

export interface FilmsAutocompleteResponse {
  /**
   * The list of films.
   */
  items: FilmSummary[];
}

export type FilmSearchItem = AbstractSearchItem & {
  /**
   * The film returned by the search.
   */
  film: FilmSummary;
};

export interface FilmServicesResponse {
  /**
   * The list of film services.
   */
  items: Service[];
}

export interface FilmsMemberRelationship {
  /**
   * The member.
   */
  member: MemberSummary;

  /**
   * The relationship details.
   */
  relationship: FilmsRelationship;
}

export interface FilmsMetadata {
  /**
   * The total number of films.
   */
  totalFilmCount: number;

  /**
   * The number of films that match the filter for this request.
   */
  filteredFilmCount: number;
}

export interface FilmsRelationship {
  /**
   * The number of watches and likes for the films.
   */
  counts: FilmsRelationshipCounts;
}

export interface FilmsRelationshipCounts {
  /**
   * The number of films the member has indicated they've seen (via the 'eye' icon) or has a log
   * entry for.
   */
  watches: number;

  /**
   * The number of films the member has indicated they liked.
   */
  likes: number;
}

export interface FilmsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of films.
   */
  items: FilmSummary[];
}

export interface FilmStatistics {
  /**
   * The film for which statistics were requested.
   */
  film: FilmIdentifier;

  /**
   * The number of watches, ratings, likes, etc. for the film.
   */
  counts: FilmStatisticsCounts;

  /**
   * The weighted average rating of the film between `0.5` and `5.0`. Will not be present if the
   * film has not received sufficient ratings.
   */
  rating: number;

  /**
   * A summary of the number of ratings at each increment between `0.5` and `5.0`.
   */
  ratingsHistogram: RatingsHistogramBar[];
}

export interface FilmStatisticsCounts {
  /**
   * The number of members who have watched the film.
   */
  watches: number;

  /**
   * The number of members who have liked the film.
   */
  likes: number;

  /**
   * The number of members who have rated the film.
   */
  ratings: number;

  /**
   * The number of members who have the film as one of their four favorites.
   */
  fans: number;

  /**
   * The number of lists in which the film appears.
   */
  lists: number;

  /**
   * The number of reviews for the film.
   */
  reviews: number;
}

export interface FilmSummary {
  /**
   * The LID of the film.
   */
  id: string;

  /**
   * The title of the film.
   */
  name: string;

  /**
   * The original title of the film, if it was first released with a non-English title.
   */
  originalName: string;

  /**
   * The other names by which the film is known (including alternative titles and/or foreign translations).
   */
  alternativeNames: string[];

  /**
   * The year in which the film was first released.
   */
  releaseYear: number;

  /**
   * The list of directors for the film.
   */
  directors: ContributorSummary[];

  /**
   * The film's poster image (2:3 aspect ratio in multiple sizes). Will contain only a single
   * obfuscated image if the `adult` flag is `true`.
   */
  poster: Image;

  /**
   * The film's unobfuscated poster image (2:3 aspect ratio in multiple sizes), only populated if
   * the `adult` flag is `true`, may contain adult content.
   */
  adultPoster: Image;

  /**
   * The film's position in the official Letterboxd Top 250 list of narrative feature films, `null`
   * if the film is not in the list.
   */
  top250Position: number | null;

  /**
   * `true` if the film is in TMDb's 'Adult' category.
   */
  adult: boolean;

  /**
   * `true` if reviews for the film are hidden due to a high volume of moderation traffic.
   */
  reviewsHidden: boolean;

  /**
   * The LID of the collection containing this film.
   */
  filmCollectionId: string;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * Relationships to the film for the authenticated member (if any) and other members where
   * relevant.
   */
  relationships: MemberFilmRelationship[];

  /**
   * The film's genres.
   */
  genres: Genre[];
}

export interface FilmTrailer {
  /**
   * The YouTube ID of the trailer.
   *
   * @example ICp4g9p_rgo
   */
  id: string;

  /**
   * The YouTube URL for the trailer.
   *
   * @example https://www.youtube.com/watch?v=ICp4g9p_rgo
   */
  url: string;
}

export type FilmWatchActivity = AbstractActivity & {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who
   * added the activity.
   *
   * @see MemberFilmRelationship
   */
  film: FilmSummary;
};

export type FollowActivity = AbstractActivity & {
  /**
   * A summary of the member that was followed.
   */
  followed: MemberSummary;
};

export interface ForgottenPasswordRequest {
  emailAddress: string;
}

export interface FriendFilmRelationshipsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of film relationships for members.
   */
  items: MemberFilmViewingRelationship[];

  /**
   * The number of friends who have watched the film
   */
  watchCount: number;

  /**
   * The number of friends who want to watch the film
   */
  watchListCount: number;
}

export interface Genre {
  /**
   * The LID of the genre.
   */
  id: string;

  /**
   * The name of the genre.
   */
  name: string;
}

export interface GenresResponse {
  /**
   * The list of genres.
   */
  items: Genre[];
}

export interface Image {
  /**
   * The available sizes for the image.
   */
  sizes: ImageSize[];
}

export interface ImageSize {
  /**
   * The image width in pixels.
   */
  width: number;

  /**
   * The image height in pixels.
   */
  height: number;

  /**
   * The URL to the image file.
   */
  url: string;
}

export type InvitationAcceptedActivity = AbstractActivity & {
  type: InvitationAcceptedActivity;
  invitor: MemberSummary;
};

export interface Language {
  /**
   * The ISO 639-1 defined code of the language.
   */
  code: string;

  /**
   * The name of the language.
   */
  name: string;
}

export interface LanguagesResponse {
  /**
   * The list of languages.
   */
  items: Language[];
}

export interface Link {
  /**
   * Denotes which site the link is for.
   */
  type:
    | 'letterboxd'
    | 'tmdb'
    | 'imdb'
    | 'gwi'
    | 'justwatch'
    | 'facebook'
    | 'instagram'
    | 'twitter'
    | 'youtube'
    | 'ticket';

  /**
   * The object ID for the linked entity on the destination site.
   */
  id: string;

  /**
   * The fully qualified URL on the destination site.
   */
  url: string;
}

export interface List {
  /**
   * The LID of the list.
   */
  id: string;

  /**
   * The name of the list.
   */
  name: string;

  /**
   * The number of films in the list.
   */
  filmCount: number;

  /**
   * Will be `true` if the owner has elected to publish the list for other members to see.
   */
  published: boolean;

  /**
   * Will be `true` if the owner has elected to make this a ranked list.
   */
  ranked: boolean;

  /**
   * Will be `true` if the owner has added notes to any entries.
   */
  hasEntriesWithNotes: boolean;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>`
   * `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  descriptionLbml: string;

  /**
   * @deprecated Use `tags2` instead.
   * @see List.tags2
   */
  tags: string[];

  /**
   * The tags for the list.
   */
  tags2: Tag[];

  /**
   * The third-party service or services to which this list can be shared. Only included if the
   * authenticated member is the list's owner.
   *
   * @deprecated No longer supported by Facebook.
   */
  canShareOn: 'Facebook';

  /**
   * The third-party service or services to which this list has been shared. Only included if the
   * authenticated member is the list's owner.
   *
   * @deprecated No longer supported by Facebook.
   */
  sharedOn: 'Facebook';

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z"
   */
  whenPublished: string;

  /**
   * The policy determining who can post comments to the list. `You` in this context refers to the
   * content owner. Use the `commentThreadState` property of the `ListRelationship` to determine
   * the signed-in member's ability to comment (or not).
   *
   * @see ListRelationship
   */
  commentPolicy: 'Anyone' | 'Friends' | 'You';

  /**
   * The member who owns the list.
   */
  owner: MemberSummary;

  /**
   * The list this was cloned from, if applicable.
   */
  clonedFrom: ListIdentifier;

  /**
   * The first 12 entries in the list. To fetch more than 12 entries, and to fetch the entry notes,
   * use the `/list/{id}/entries` endpoint.
   */
  previewEntries: ListEntrySummary[];

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The list's backdrop image at multiple sizes, sourced from the first film in the list, if
   * available. Only returned for [Patron](https://letterboxd.com/patrons/) members.
   */
  backdrop: Image;

  /**
   * The vertical focal point of the list's backdrop image, if available. Expressed as a proportion
   * of the image's height, using values between `0.0` and `1.0`. Use when cropping the image into
   * a shorter space, such as in the page for a film on the Letterboxd site.
   */
  backdropFocalPoint: number;

  /**
   * The list description formatted as HTML.
   */
  description: string;
}

export type ListActivity = AbstractActivity & {
  /**
   * The list associated with the activity.
   */
  list: ListSummary;

  /**
   * The list that was cloned, if applicable
   */
  clonedFrom: ListSummary;
};

export interface ListAdditionRequest {
  /**
   * Specify the LIDs of lists to be added to.
   */
  lists?: string[];

  /**
   * Specify the LIDs of films to be added to each of the specified lists.
   */
  films?: string[];
}

export interface ListAdditionResponse {
  /**
   * The list of additions to each list.
   */
  items: AListAddition[];
}

export interface ListComment {
  /**
   * The LID of the comment/reply.
   */
  id: string;

  /**
   * The member who posted the comment.
   */
  member: MemberSummary;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenUpdated: string;

  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  commentLbml: string;

  /**
   * If Letterboxd moderators have removed the comment from the site, `removedByAdmin` will be
   * `true` and comment will not be included.
   */
  removedByAdmin: boolean;

  /**
   * If the content owner has removed the comment from the site, `removedByContentOwner` will be
   * `true` and comment will not be included.
   */
  removedByContentOwner: boolean;

  /**
   * If the comment owner has removed the comment from the site, `deleted` will be `true` and
   * comment will not be included.
   */
  deleted: boolean;

  /**
   * If the authenticated member has blocked the commenter, `blocked` will be true and `comment`
   * will not be included.
   */
  blocked: boolean;

  /**
   * If the list owner has blocked the commenter, `blockedByOwner` will be true and `comment` will
   * not be included.
   */
  blockedByOwner: boolean;

  /**
   * If the authenticated member posted this comment, and the comment is still editable, this value
   * shows the number of seconds remaining until the editing window closes.
   */
  editableWindowExpiresIn: number;

  /**
   * The list on which the comment was posted.
   */
  list: ListIdentifier;

  /**
   * The message portion of the comment formatted as HTML.
   */
  comment: string;
}

export type ListCommentActivity = AbstractActivity & {
  /**
   * The list associated with the activity.
   */
  list: ListSummary;

  /**
   * The comment associated with the activity.
   */
  comment: ListComment;
};

export interface ListCommentsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of comments.
   */
  items: ListComment[];
}

export interface ListCreateEntry {
  /**
   * The LID of the film.
   */
  film: string;

  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1. If not set, the
   * entry will be appended to the end of the list. Sending two or more `ListCreateEntry`s with the
   * same rank will return an error.
   */
  rank?: number;

  /**
   * The notes for the list entry in LBML. May contain the following HTML tags: `<br>` `<strong>`
   * `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  notes?: string;

  /**
   * Set to `true` if the member has indicated that the `notes` field contains plot spoilers for
   * the film.
   */
  containsSpoilers?: boolean;
}

export interface ListCreateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'ListNameIsBlank'
    | 'UnknownFilmCode'
    | 'InvalidRatingValue'
    | 'DuplicateRank'
    | 'EmptyPublicList'
    | 'CloneSourceNotFound'
    | 'SharingServiceNotAuthorized'
    | 'CannotSharePrivateList'
    | 'ListDescriptionIsTooLong'
    | 'ListEntryNotesTooLong';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface ListCreateResponse {
  /**
   * The response object.
   */
  data: List;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: ListCreateMessage[];
}

export interface ListCreationRequest {
  /**
   * Set to `true` if the owner has elected to publish the list for other members to see.
   */
  published: boolean;

  /**
   * The name of the list.
   */
  name: string;

  /**
   * The policy determining who can post comments to the list. `You` in this context refers to the
   * content owner. Use the `commentThreadState` property of the `ListRelationship` to determine
   * the signed-in member's ability to comment (or not).
   *
   * @see ListRelationship
   */
  commentPolicy?: 'Anyone' | 'Friends' | 'You';

  /**
   * Set to `true` if the owner has elected to make this a ranked list.
   */
  ranked: boolean;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>`
   * `<b>` `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  description?: string;

  /**
   * The LID of a list to clone from. Only supported for paying members.
   */
  clonedFrom?: string;

  /**
   * The tags for the list.
   */
  tags?: string[];

  /**
   * The films that comprise the list. Required unless `source` is set.
   */
  entries?: ListCreateEntry[];

  /**
   * The third-party service or services to which this list should be shared. Valid options are
   * found in `MemberAccount.authorizedSharing*` (see the
   * [/me](https://api-docs.letterboxd.com/#path--me) endpoint).
   *
   * @deprecated No longer supported by Facebook.
   * @see MemberAccount
   */
  share?: 'Facebook';
}

export interface ListEntriesResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of entries.
   */
  items: ListEntry[];

  /**
   * The filtered and total count of films in the list.
   */
  metadata: FilmsMetadata;

  /**
   * The relationships to the films in the list for the members referenced in the request.
   */
  relationships: FilmsMemberRelationship[];
}

export interface ListEntry {
  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1.
   */
  rank: number;

  /**
   * A unique id for this entry in the list
   */
  entryId: number;

  /**
   * The notes for the list entry in LBML. May contain the following HTML tags: `<br>` `<strong>`
   * `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  notesLbml: string;

  /**
   * Will be `true` if the member has indicated that the `notes` field contains plot spoilers for
   * the film.
   */
  containsSpoilers: boolean;

  /**
   * The film for this entry. Includes a `MemberFilmRelationship` for the member who created the list.
   *
   * @see MemberFilmRelationship
   */
  film: FilmSummary;

  /**
   * The notes for the list entry formatted as HTML.
   */
  notes: string;
}

export interface ListEntrySummary {
  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1.
   */
  rank: number;

  /**
   * The film for this entry.
   */
  film: FilmSummary;
}

export interface ListIdentifier {
  /**
   * The LID of the list.
   */
  id: string;
}

export type ListLikeActivity = AbstractActivity & {
  /**
   * The list associated with the activity.
   */
  list: ListSummary;
};

export interface ListRelationship {
  /**
   * Will be `true` if the member likes the list (via the 'heart' icon). A member may not like their
   * own list.
   */
  liked: boolean;

  /**
   * Will be `true` if the member is subscribed to comment notifications for the list.
   */
  subscribed: boolean;

  /**
   * Defaults to `Subscribed` for the list's owner, and `NotSubscribed` for other members. The
   * subscription value may change when a member (other than the owner) posts a comment, as follows:
   * the member will become automatically `Subscribed` unless they have previously `Unsubscribed`
   * from the comment thread via the web interface or API, or unless they have disabled comment
   * notifications in their profile settings.
   *
   * `NotSubscribed` and `Unsubscribed` are maintained as separate states so the UI can, if needed,
   * indicate to the member how their subscription state will be affected if/when they post a
   * comment.
   */
  subscriptionState: 'Subscribed' | 'NotSubscribed' | 'Unsubscribed';

  /**
   * The authenticated member's state with respect to posting comments to the list.
   *
   *  - `Banned` means the Letterboxd community managers have restricted the member's ability to
   *      post comments.
   *  - `Blocked` means the owner has blocked the member from posting comments
   *  - `BlockedThem` means the member has blocked the owner and is therefore unable to post
   *    comments.
   *  - `CanComment` means the authenticated member is authorized to post a comment (also known as
   *    a "reply"). All other values mean the authenticated member is not authorized to post a
   *    comment.
   *  - `Closed` means the owner has closed the comment thread to all other members.
   *  - `FriendsOnly` means the owner is only accepting comments from members they follow.
   *  - `Moderated` means the Letterboxd community managers have removed the content (applies to
   *    reviews only).
   *  - `NotCommentable` means that comments may not be posted to this thread.
   *   -`NotValidated` means the owner has not validated their email address.
   */
  commentThreadState:
    | 'Banned'
    | 'Blocked'
    | 'BlockedThem'
    | 'CanComment'
    | 'Closed'
    | 'FriendsOnly'
    | 'Moderated'
    | 'NotCommentable'
    | 'NotValidated';
}

export interface ListRelationshipUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'LikeBlockedContent'
    | 'LikeOwnList'
    | 'LikeRateLimit'
    | 'SubscribeWhenOptedOut'
    | 'SubscribeToContentYouBlocked'
    | 'SubscribeToBlockedContent';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface ListRelationshipUpdateRequest {
  /**
   * Set to `true` if the member likes the list (via the 'heart' icon). A member may not like their
   * own list.
   */
  liked?: boolean;

  /**
   * Set to `true` to subscribe the member to comment notifications for the list, or `false` to
   * unsubscribe them. A value of `true` will be ignored if the member has disabled comment
   * notifications in their profile settings.
   */
  subscribed?: boolean;
}

export interface ListRelationshipUpdateResponse {
  /**
   * The response object.
   */
  data: ListRelationship;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: ListRelationshipUpdateMessage[];
}

export type ListSearchItem = AbstractSearchItem & {
  /**
   * The list.
   */
  list: ListSummary;
};

export interface ListsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of lists.
   */
  items: ListSummary[];
}

export interface ListStatistics {
  /**
   * The list for which statistics were requested.
   */
  list: ListIdentifier;

  /**
   * The number of comments and likes for the list.
   */
  counts: ListStatisticsCounts;
}

export interface ListStatisticsCounts {
  /**
   * The number of comments for the list.
   */
  comments: number;

  /**
   * The number of members who like the list.
   */
  likes: number;
}

export interface ListSummary {
  /**
   * The LID of the list.
   */
  id: string;

  /**
   * The name of the list.
   */
  name: string;

  /**
   * The number of films in the list.
   */
  filmCount: number;

  /**
   * Will be `true` if the owner has elected to publish the list for other members to see.
   */
  published: boolean;

  /**
   * Will be `true` if the owner has elected to make this a ranked list.
   */
  ranked: boolean;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>`
   * `<b>` `<i>` `<a href="">` `<blockquote>`. The text is a preview extract, and may be truncated
   * if it's too long.
   */
  descriptionLbml: string;

  /**
   * Will be `true` if the list description was truncated because it's very long.
   */
  descriptionTruncated: boolean;

  /**
   * The member who owns the list.
   */
  owner: MemberSummary;

  /**
   * The list this was cloned from, if applicable.
   */
  clonedFrom: ListIdentifier;

  /**
   * The first 12 entries in the list. To fetch more than 12 entries, and to fetch the entry notes,
   * use the `/list/{id}/entries` endpoint.
   */
  previewEntries: ListEntrySummary[];

  /**
   * Returned when one or more `filmsOfNote` is specified in the request. Contains, for each list
   * in the response, the rank position of each film of note (if in the list) or `-1` (if not).
   */
  entriesOfNote: AListEntryOccurrence[];

  /**
   * The list description formatted as HTML. The text is a preview extract, and may be truncated if
   * it's too long.
   */
  description: string;
}

export interface ListUpdateEntry {
  /**
   * The LID of the film.
   */
  film?: string;

  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1. If not set, the
   * entry will stay in the same place (if already in the list) or be appended to the end of the
   * list (if not in the list). If set, any entries at or after this position will be incremented
   * by one. Sending two or more `ListUpdateEntry`s with the same rank will return an error.
   */
  rank?: number;

  /**
   * The notes for the list entry in LBML. May contain the following HTML tags: `<br>` `<strong>`
   * `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000
   * characters.
   */
  notes?: string;

  /**
   * Set to `true` if the member has indicated that the `notes` field contains plot spoilers for
   * the film.
   */
  containsSpoilers?: boolean;

  /**
   * The update action to take. If not set then any existing entry for the film will be updated, if
   * there is no existing entry for the film it will be added into the list.
   */
  action?:
    | 'ADD'
    | 'DELETE'
    | 'UPDATE'
    | 'SORT_NAME'
    | 'SORT_RELEASE_NEWEST'
    | 'SORT_RELEASE_OLDEST'
    | 'SORT_RATING_HIGHEST'
    | 'SORT_RATING_LOWEST'
    | 'SORT_AVR_RATING_HIGHEST'
    | 'SORT_AVR_RATING_LOWEST';

  /**
   * The entry position (numbered from 0) to update or delete. Required for UPDATE and DELETE
   * actions.
   */
  position?: number;

  /**
   * The new entry position (numbered from 0) for the updated or added entry. If not set, the
   * entry will stay in the same place (for UPDATE actions) or be appended to the end of the list
   * (for ADD actions).
   */
  newPosition?: number;
}

export interface ListUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'ListNameIsBlank'
    | 'UnknownFilmCode'
    | 'InvalidRatingValue'
    | 'DuplicateRank'
    | 'EmptyPublicList'
    | 'SharingServiceNotAuthorized'
    | 'CannotSharePrivateList'
    | 'ListDescriptionIsTooLong'
    | 'ListEntryNotesTooLong';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface ListUpdateRequest {
  /**
   * Set to `true` if the owner has elected to publish the list for other members to see.
   */
  published?: boolean;

  /**
   * The name of the list.
   */
  name?: string;

  /**
   * The policy determining who can post comments to the list. `You` in this context refers to the
   * content owner. Use the `commentThreadState` property of the `ListRelationship` to determine
   * the signed-in member's ability to comment (or not).
   *
   * @see ListRelationship
   */
  commentPolicy?: 'Anyone' | 'Friends' | 'You';

  /**
   * Set to `true` if the owner has elected to make this a ranked list.
   */
  ranked?: boolean;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>`
   * `<b>` `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  description?: string;

  /**
   * The tags for the list.
   */
  tags?: string[];

  /**
   * Specify the LIDs of films to be removed from the list.
   */
  filmsToRemove?: string[];

  /**
   * The specified entries will be inserted/appended to the list if they are not already present,
   * or updated if they are present.
   */
  entries?: ListUpdateEntry[];

  /**
   * The third-party service or services to which this list should be shared. Valid options are
   * found in `ListRelationship` (see the
   * [/list/{id}/me](https://api-docs.letterboxd.com/#path--list--id--me) endpoint).
   *
   * @deprecated No longer supported by Facebook.
   * @see ListRelationship
   */
  share?: 'Facebook';
}

export interface ListUpdateResponse {
  /**
   * The response object.
   */
  data: List;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: ListUpdateMessage[];
}

export interface LogEntriesResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of log entries.
   */
  items: LogEntry[];
}

export interface LogEntry {
  /**
   * The LID of the log entry.
   */
  id: string;

  /**
   * A descriptive title for the log entry.
   */
  name: string;

  /**
   * The member who created the log entry.
   */
  owner: MemberSummary;

  /**
   * The film being logged. Includes a `MemberFilmRelationship` for the member who created the log
   * entry.
   *
   * @see MemberFilmRelationship
   */
  film: FilmSummary;

  /**
   * Details about the log entry, if present.
   */
  diaryDetails: DiaryDetails;

  /**
   * Review details for the log entry, if present.
   */
  review: Review;

  /**
   * @deprecated Use `tags2` instead.
   * @see LogEntry.tags2
   */
  tags: string[];

  /**
   * The tags for the log entry.
   */
  tags2: Tag[];

  /**
   * The timestamp of when the log entry was created, in ISO 8601 format with UTC timezone, i.e.
   * `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * The timestamp of when the log entry was last updated, in ISO 8601 format with UTC timezone,
   * i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenUpdated: string;

  /**
   * The member's rating for the film. Allowable values are between `0.5` and `5.0`, with
   * increments of `0.5`.
   */
  rating: number;

  /**
   * Will be `true` if the member likes the film (via the 'heart' icon).
   */
  like: boolean;

  /**
   * Will be `true` if comments can be posted to the log entry by the member. This is determined
   * according to the existence of review text and other factors such as the content owner's
   * comment policy.
   */
  commentable: boolean;

  /**
   * The policy determining who can post comments to the log entry. `You` in this context refers to
   * the content owner. Use the commentThreadState property of the ListRelationship to determine
   * the signed-in member's ability to comment (or not).
   */
  commentPolicy: 'Anyone' | 'Friends' | 'You';

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The log entry's backdrop image at multiple sizes, sourced from the film being logged, if
   * available. Only returned for [Patron](https://letterboxd.com/patrons/) members.
   */
  backdrop: Image;

  /**
   * The vertical focal point of the log entry's backdrop image, if available. Expressed as a
   * proportion of the image's height, using values between `0.0` and `1.0`. Use when cropping the
   * image into a shorter space, such as in the page for a film on the Letterboxd site.
   */
  backdropFocalPoint: number;
}

export interface LogEntryCreationRequest {
  /**
   * The film being logged.
   */
  filmId: string;

  /**
   * Information about this log entry if adding to the member's diary.
   */
  diaryDetails?: LogEntryCreationRequestDiaryDetails;

  /**
   * Information about the review if adding a review.
   */
  review?: LogEntryCreationRequestReview;

  /**
   * The tags for the log entry.
   */
  tags?: string[];

  /**
   * Allowable values are between `0.5` and `5.0`, with increments of `0.5`.
   */
  rating?: number;

  /**
   * Set to `true` if the member likes the review (via the 'heart' icon). A member may not like
   * their own review.
   */
  like?: boolean;

  /**
   * The policy determining who can post comments to the log entry. `You` in this context refers to
   * the content owner. Use the `commentThreadState` property of the `ListRelationship` to determine
   * the signed-in member's ability to comment (or not).
   *
   * @see ListRelationship.commentThreadState
   */
  commentPolicy?: 'Anyone' | 'Friends' | 'You';
}

export interface LogEntryCreationRequestDiaryDetails {
  /**
   * The date the film was watched, if specified, in ISO 8601 format, i.e. `YYYY-MM-DD`
   */
  diaryDate: string;

  /**
   * Set to `true` if the member has indicated (or it can be otherwise determined) that the member
   * has seen the film prior to this date.
   */
  rewatch: boolean;
}

export interface LogEntryCreationRequestReview {
  /**
   * The review text in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  text: string;

  /**
   * Set to `true` if the member has indicated that the `review` field contains plot spoilers for
   * the film.
   */
  containsSpoilers: boolean;

  /**
   * The third-party service or services to which this review should be shared. Valid options are
   * found in `MemberAccount.authorizedSharing*` (see the
   * [/me](https://api-docs.letterboxd.com/#path--me) endpoint).
   *
   * @deprecated No longer supported by Facebook.
   * @see MemberAccount
   */
  share: 'Facebook';
}

export interface LogEntrySummary {
  /**
   * The LID of the log entry.
   */
  id: string;

  name: string;

  /**
   * Does this log entry contain a review.
   */
  review: boolean;

  /**
   * Does this log entry specify a diary entry.
   */
  diaryEntry: boolean;

  /**
   * The member's rating for this viewing of the film. Allowable values are between `0.5` and `5.0`,
   * with increments of `0.5`.
   */
  rating: number;
}

export interface LogEntryUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'InvalidRatingValue'
    | 'InvalidDiaryDate'
    | 'ReviewWithNoText'
    | 'ReviewIsTooLong'
    | 'LogEntryWithNoReviewOrDiaryDetails';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface LogEntryUpdateRequest {
  /**
   * Information about this log entry if adding to the member's diary. Set to `null` to remove this
   * log entry from the diary.
   */
  diaryDetails?: LogEntryUpdateRequestDiaryDetails | null;

  /**
   * Information about the review. Set to `null` to remove the review from this log entry.
   */
  review?: LogEntryUpdateRequestReview | null;

  /**
   * The tags for the log entry.
   */
  tags?: string[];

  /**
   * Accepts values between `0.5` and `5.0`, with increments of `0.5`, or null (to remove the
   * rating).
   */
  rating?: number;

  /**
   * Set to `true` if the member likes the review (via the 'heart' icon). A member may not like
   * their own review.
   */
  like?: boolean;

  /**
   * The policy determining who can post comments to the log entry. `You` in this context refers to
   * the content owner. Use the `commentThreadState` property of the `ListRelationship` to
   * determine the signed-in member's ability to comment (or not).
   *
   * @see ListRelationship.commentThreadState
   */
  commentPolicy?: 'Anyone' | 'Friends' | 'You';
}

export interface LogEntryUpdateRequestDiaryDetails {
  /**
   * The date the film was watched, if specified, in ISO 8601 format, i.e. `YYYY-MM-DD`
   */
  diaryDate?: string;

  /**
   * Set to `true` if the member has indicated (or it can be otherwise determined) that the member
   * has seen the film prior to this date.
   */
  rewatch?: boolean;
}

export interface LogEntryUpdateRequestReview {
  /**
   * The review text in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`.
   */
  text?: string;

  /**
   * Set to `true` if the member has indicated that the `review` field contains plot spoilers for
   * the film.
   */
  containsSpoilers?: boolean;

  /**
   * The third-party service or services to which this review should be shared. Valid options are
   * found in `ReviewRelationship.canShareOn` (see the
   * [/log-entry/{id}/me](https://api-docs.letterboxd.com/#path--log-entry--id--me) endpoint).
   *
   * @deprecated No longer supported by Facebook.
   * @see ReviewRelationship.canShareOn
   */
  share?: 'Facebook';
}

export interface LoginTokenResponse {
  /**
   * A single-use token for signing into the Letterboxd website.
   */
  token: string;
}

export interface Member {
  /**
   * The LID of the member.
   */
  id: string;

  /**
   * The member's Letterboxd username. Usernames must be between 2 and 15 characters long and may
   * only contain upper or lowercase letters, numbers or the underscore (`_`) character.
   */
  username: string;

  /**
   * The given name of the member.
   */
  givenName: string;

  /**
   * The family name of the member.
   */
  familyName: string;

  /**
   * A convenience method that returns the member's given name and family name concatenated with a
   * space, if both are set, or just their given name or family name, if one is set, or their
   * username, if neither is set. Will never be empty.
   */
  displayName: string;

  /**
   * A convenience method that returns the member's given name, if set, or their username. Will
   * never be empty.
   */
  shortName: string;

  /**
   * The member's preferred pronoun. Use the
   * [/members/pronouns](https://api-docs.letterboxd.com/#path--members-pronouns) endpoint to
   * request all available pronouns.
   */
  pronoun: Pronoun;

  /**
   * The member's avatar image at multiple sizes. Avatar images to not have an enforced aspect
   * ratio, so should be center-cropped to a square if they are not 1:1.
   */
  avatar: Image;

  /**
   * The member's account type.
   */
  memberStatus: 'Crew' | 'Alum' | 'Hq' | 'Patron' | 'Pro' | 'Member';

  /**
   * `true` if ads should not be shown on the member's content.
   */
  hideAdsInContent: boolean;

  /**
   * The member's default policy determing who can post comments to their content. Supported
   * options are `Anyone`, `Friends` and `You`. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in
   * member's ability to comment (or not).
   *
   * @see ListRelationship.commentThreadState
   */
  commentPolicy: 'Anyone' | 'Friends' | 'You';

  /**
   * The member's account status.
   */
  accountStatus: 'Active' | 'Locked' | 'Memorialized';

  /**
   * `true` if member should not be shown ads.
   */
  hideAds: boolean;

  /**
   * The member's Twitter username, if they have authenticated their account.
   */
  twitterUsername: string;

  /**
   * The member's bio in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`.
   */
  bioLbml: string;

  /**
   * The member's location.
   */
  location: string;

  /**
   * The member's website URL. URLs are not validated, so sanitizing may be required.
   */
  website: string;

  /**
   * The member's backdrop image at multiple sizes, sourced from the first film in the member's
   * list of favorite films, if available. Only returned for
   * [Patron](https://letterboxd.com/patrons/) members.
   */
  backdrop: Image;

  /**
   * The vertical focal point of the member's backdrop image, if available. Expressed as a
   * proportion of the image's height, using values between 0.0 and 1.0. Use when cropping the
   * image into a shorter space, such as in the page for a film on the Letterboxd site.
   */
  backdropFocalPoint: number;

  /**
   * A summary of the member's favorite films, up to a maximum of four.
   */
  favoriteFilms: FilmSummary[];

  /**
   * The reviews the member has pinned on their profile page, up to a maximum of two. *Only
   * returned for paying members.*
   */
  pinnedReviews: LogEntry[];

  /**
   * A link to the member's profile page on the Letterboxd website.
   */
  links: Link[];

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has elected to hide their
   * watchlist from other members.
   */
  privateWatchlist: boolean;

  /**
   * A summary of the member's featured list. Only returned for HQ members.
   */
  featuredList: ListSummary;

  /**
   * A summary of the member's team members. Only returned for HQ members.
   */
  teamMembers: MemberSummary[];

  /**
   * The member's organisation type. Only returned for HQ members.
   */
  orgType:
    | 'Society'
    | 'Educator'
    | 'Exhibitor'
    | 'Festival'
    | 'Single_Film'
    | 'Genre'
    | 'Association'
    | 'Media_Publisher'
    | 'Product_Platform'
    | 'Podcast'
    | 'Streamer'
    | 'Studio';

  /**
   * The member's bio formatted as HTML.
   */
  bio: string;
}

export interface MemberAccount {
  /**
   * The member's email address.
   */
  emailAddress: string;

  /**
   * Will be `true` if the member has validated their `emailAddress` via an emailed link.
   */
  emailAddressValidated: boolean;

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has elected for their
   * content to appear in the API (other than in the
   * [/me](https://api-docs.letterboxd.com/#path--me) endpoint).
   */
  privateAccount: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to appear in the
   * [People](https://letterboxd.com/people/) section of the Letterboxd website.
   */
  includeInPeopleSection: boolean;

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has elected to hide their
   * watchlist from other members.
   *
   * @deprecated Found in `member` instead.
   */
  privateWatchlist: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an
   * email notification when another member follows them.
   */
  emailWhenFollowed: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an
   * email notification when films on their watchlist become available to stream on one of their
   * favorite services.
   */
  emailAvailability: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an
   * email notification when films on their watchlist become available to buy on one of their
   * favorite services.
   */
  emailBuyAvailability: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an
   * email notification when films on their watchlist become available to rent on one of their
   * favorite services.
   */
  emailRentAvailability: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive email
   * notifications when new comments are posted in threads they are subscribed to.
   */
  emailComments: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive
   * regular email news (including 'Call Sheet') from Letterboxd.
   */
  emailNews: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive a
   * weekly email digest of new and popular content (called 'Rushes').
   */
  emailRushes: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive
   * offers from trusted partners via Letterboxd.
   */
  emailPartnerMessages: boolean;

  /**
   * The list of device IDs that may receive push notifications for this account.
   */
  devicesRegisteredForPushNotifications: string[];

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications for platform and account alerts.
   */
  pushNotificationsForGeneralAnnouncements: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications with offers from trusted partners.
   */
  pushNotificationsForPartnerMessages: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when new comments are posted in threads they are subscribed to.
   */
  pushNotificationsForComments: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when another member likes one of their lists.
   */
  pushNotificationsForListLikes: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when another member likes one of their reviews.
   */
  pushNotificationsForReviewLikes: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when another member follows them.
   */
  pushNotificationsForNewFollowers: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when films on a members watchlist become available to stream on one of their
   * favorite services.
   */
  pushNotificationsForAvailability: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when films on a members watchlist become available to buy on one of their
   * favorite services.
   */
  pushNotificationsForBuyAvailability: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push
   * notifications when films on a members watchlist become available to rent on one of their
   * favorite services.
   */
  pushNotificationsForRentAvailability: boolean;

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has commenting privileges.
   * Commenting is disabled on new accounts until the member's `emailAddress` is validated. At
   * present `canComment` is synonymous with `emailAddressValidated` (unless the member is
   * `suspended`) but this may change in future.
   */
  canComment: boolean;

  /**
   * Indicates whether the member is suspended from commenting due to a breach of the
   * [Community Policy](https://letterboxd.com/legal/community-policy/).
   */
  suspended: boolean;

  /**
   * Indicates whether the member is able to clone other members' lists. Determined by Letterboxd
   * based upon `memberStatus`.
   */
  canCloneLists: boolean;

  /**
   * Indicates whether the member is able to filter activity by type. Determined by Letterboxd
   * based upon `memberStatus`.
   */
  canFilterActivity: boolean;

  /**
   * The services the member has authorized Letterboxd to share lists to. More services may be
   * added in the future.
   *
   * @deprecated No longer supported by Facebook.
   */
  authorizedSharingServicesForLists: 'Facebook';

  /**
   * The services the member has authorized Letterboxd to share reviews to. More services may be
   * added in the future.
   *
   * @deprecated No longer supported by Facebook.
   */
  authorizedSharingServicesForReviews: 'Facebook';

  /**
   * The number of days the member has left in their subscription. *Only returned for paying
   * members.*
   */
  membershipDaysRemaining: number;

  /**
   * Indicates whether the member's subscription is expected to auto-renew via Apple's IAP
   * subscription. *Only returned for members who have subscribed through IAP.*
   */
  membershipWillAutoRenewViaIAP: boolean;

  /**
   * Indicates whether the member has an active subscription that will auto-renew. Will return
   * `false` for members who did subscribe and then set their subscription to no longer renew,
   * even if the original subscription period has not yet expired.
   */
  hasActiveSubscription: boolean;

  /**
   * Indicates the member's subscription type, possible values are `apple` or `paddle`. *Only
   * returned for members who have an active subscription.*
   */
  subscriptionType: string;

  /**
   * Standard member details.
   */
  member: Member;

  /**
   * The list of campaigns this account is involved in.
   */
  campaigns: string[];

  /**
   * The member's adult content policy determing whether or not they see adult content. Supported
   * options are `Always` or `Default`. `Default` means never show adult content.
   */
  adultContentPolicy: 'Always' | 'Default';

  /**
   * The member's poster mode determing whether or not they see custom posters. Supported options
   * are `All`, `Yours` or `None`.
   */
  posterMode: 'All' | 'Yours' | 'None';

  /**
   * The list of acceptable values that may be used for poster mode for this account
   */
  posterModeOptions: 'All' | 'Yours' | 'None';

  /**
   * The member's default policy determing who can post comments to their content. Supported
   * options are `Anyone`, `Friends` and `You`. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in
   * member's ability to comment (or not).
   *
   * @see ListRelationship.commentThreadState
   */
  commentPolicy: 'Anyone' | 'Friends' | 'You';

  /**
   * The member's account status.
   */
  accountStatus: 'Active' | 'Locked' | 'Memorialized';

  /**
   * `true` if member should not be shown ads.
   */
  hideAds: boolean;

  /**
   * `true` if member should be shown ads for custom posters.
   */
  showCustomPostersAds: boolean;

  /**
   * Indicates whether the member is able to customise film posters. Determined by Letterboxd based
   * upon `memberStatus`.
   */
  canHaveCustomPosters: boolean;
}

export interface MemberFilmRelationship {
  /**
   * The member.
   */
  member: MemberSummary;

  /**
   * The relationship details.
   */
  relationship: FilmRelationship;
}

export interface MemberFilmRelationshipsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of film relationships for members.
   */
  items: MemberFilmRelationship[];
}

export interface MemberFilmViewingRelationship {
  /**
   * The member.
   */
  member: MemberSummary;

  /**
   * The relationship details.
   */
  relationship: FilmRelationship;

  logEntry: LogEntrySummary;
}

export interface MemberIdentifier {
  /**
   * The LID of the member.
   */
  id: string;
}

export interface MemberRelationship {
  /**
   * Will be `true` if the authenticated member follows the member identified by ID.
   */
  following: boolean;

  /**
   * Will be `true` if the member identified by ID follows the authenticated member.
   */
  followedBy: boolean;

  /**
   * Will be `true` if the authenticated member has blocked the member identified by ID.
   */
  blocking: boolean;

  /**
   * Will be `true` if the member identified by ID has blocked the authenticated member.
   */
  blockedBy: boolean;
}

export interface MemberRelationshipUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code: 'BlockYourself' | 'FollowYourself' | 'FollowRateLimit' | 'FollowBlockedMember' | 'FollowMemberYouBlocked';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface MemberRelationshipUpdateRequest {
  /**
   * Set to `true` if the authenticated member wishes to follow the member identified by ID, or
   * `false` if they wish to unfollow. A member may not follow their own account, or the account of
   * a member they have blocked or that has blocked them.
   */
  following?: boolean;

  /**
   * Set to `true` if the authenticated member wishes to block the member identified by ID, or
   * `false` if they wish to unblock. A member may not block their own account.
   */
  blocking?: boolean;
}

export interface MemberRelationshipUpdateResponse {
  /**
   * The response object.
   */
  data: MemberRelationship;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: MemberRelationshipUpdateMessage[];
}

export type MemberSearchItem = AbstractSearchItem & {
  /**
   * The member returned by the search.
   */
  member: MemberSummary;
};

export interface MemberSettingsUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'IncorrectCurrentPassword'
    | 'BlankPassword'
    | 'InvalidPassword'
    | 'InvalidEmailAddress'
    | 'EmailAddressInUse'
    | 'InvalidFavoriteFilm'
    | 'BioTooLong'
    | 'InvalidPronounOption';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface MemberSettingsUpdateRequest {
  /**
   * The member's email address.
   */
  emailAddress?: string;

  /**
   * The member's current password. Required when updating the password.
   */
  currentPassword?: string;

  /**
   * The member's new password.
   */
  password?: string;

  /**
   * The given name of the member.
   */
  givenName?: string;

  /**
   * The family name of the member.
   */
  familyName?: string;

  /**
   * The LID of the member's preferred pronoun. Use the
   * [/members/pronouns](https://api-docs.letterboxd.com/#path--members-pronouns) endpoint to
   * request all available pronouns.
   */
  pronoun?: string;

  /**
   * The member's default policy determing who can post comments to their content. Supported
   * options are `Anyone`, `Friends` and `You`. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in
   * member's ability to comment (or not).
   *
   * @see ListRelationship.commentThreadState
   */
  commentPolicy?: string;

  /**
   * The member's adult content policy determing whether or not they see adult content. Supported
   * options are `Always` or `Default`. `Default` means never show adult content.
   */
  adultContentPolicy?: string;

  /**
   * The member's poster mode determing whether or not they see custom posters. Supported options
   * are `All`, `Yours` or `None`.
   */
  posterMode?: string;

  /**
   * The member's location.
   */
  location?: string;

  /**
   * The member's website URL. URLs are not validated, so sanitizing may be required.
   */
  website?: string;

  /**
   * The member's bio in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  bio?: string;

  /**
   * The LIDs of the member's favorite films, in order, up to a maximum of four.
   */
  favoriteFilms?: string[];

  /**
   * Set to `true` to prevent the member's content from appearing in API requests other than the
   * [/me](https://api-docs.letterboxd.com/#path--me) endpoint.
   */
  privateAccount?: boolean;

  /**
   * Set to `false` to remove the account from the [Members](https://letterboxd.com/members/)
   * section of the Letterboxd website.
   */
  includeInPeopleSection?: boolean;

  /**
   * Set to `true` if the member wishes to receive an email notification when another member
   * follows them.
   */
  emailWhenFollowed?: boolean;

  emailAvailability?: boolean;
  emailBuyAvailability?: boolean;
  emailRentAvailability?: boolean;

  /**
   * Set to `true` if the member wishes to receive email notifications when new comments are posted
   * in threads they are subscribed to.
   */
  emailComments?: boolean;

  /**
   * Set to `true` if the member wishes to receive regular email news (including 'Call Sheet') from
   * Letterboxd.
   */
  emailNews?: boolean;

  /**
   * Set to `true` if the member wishes to receive a weekly email digest of new and popular content
   * (called 'Rushes').
   */
  emailRushes?: boolean;

  /**
   * Set to `true` if the member wishes to receive offers from trusted partners via Letterboxd.
   */
  emailPartnerMessages?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications for platform and account
   * alerts.
   */
  pushNotificationsForGeneralAnnouncements?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications with offers from trusted
   * partners.
   */
  pushNotificationsForPartnerMessages?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when new comments are posted
   * in threads they are subscribed to.
   */
  pushNotificationsForComments?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member likes one
   * of their reviews.
   */
  pushNotificationsForReviewLikes?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member likes one
   * of their lists.
   */
  pushNotificationsForListLikes?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member follows
   * them.
   */
  pushNotificationsForNewFollowers?: boolean;

  pushNotificationsForAvailability?: boolean;
  pushNotificationsForBuyAvailability?: boolean;
  pushNotificationsForRentAvailability?: boolean;
}

export interface MemberSettingsUpdateResponse {
  /**
   * The response object.
   */
  data: MemberAccount;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: MemberSettingsUpdateMessage[];
}

export interface MembersResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of members.
   */
  items: MemberSummary[];
}

export interface MemberStatistics {
  /**
   * The member for which statistics were requested.
   */
  member: MemberIdentifier;

  /**
   * The number of watches, ratings, likes, etc. for the member.
   */
  counts: MemberStatisticsCounts;

  /**
   * A summary of the number of ratings the member has made for each increment between `0.5` and
   * `5.0`. Returns only the integer increments between `1.0` and `5.0` if the member never (or
   * rarely) awards half-star ratings.
   */
  ratingsHistogram: RatingsHistogramBar[];

  /**
   * A list of years the member has year-in-review pages for. *Only supported for paying members.*
   */
  yearsInReview: number[];
}

export interface MemberStatisticsCounts {
  /**
   * The number of films the member has liked.
   */
  filmLikes: number;

  /**
   * The number of lists the member has liked.
   */
  listLikes: number;

  /**
   * The number of reviews the member has liked.
   */
  reviewLikes: number;

  /**
   * The number of films the member has watched. This is a distinct total — films with multiple log
   * entries are only counted once.
   */
  watches: number;

  /**
   * The number of films the member has rated.
   */
  ratings: number;

  /**
   * The number of films the member has reviewed.
   */
  reviews: number;

  /**
   * The number of entries the member has in their diary.
   */
  diaryEntries: number;

  /**
   * The number of entries the member has in their diary for the current year. The current year
   * rolls over at midnight on 31 December in New Zealand Daylight Time (GMT + 13).
   */
  diaryEntriesThisYear: number;

  /**
   * The number of unique films the member has in their diary for the current year. The current
   * year rolls over at midnight on 31 December in New Zealand Daylight Time (GMT + 13).
   */
  filmsInDiaryThisYear: number;

  /**
   * The number of films the member has in their watchlist.
   */
  watchlist: number;

  /**
   * The number of lists for the member. Includes unpublished lists if the request is made for the
   * authenticated member.
   */
  lists: number;

  /**
   * The number of unpublished lists for the member. Only included if the request is made for the
   * authenticated member.
   */
  unpublishedLists: number;

  /**
   * The number of members who follow the member.
   */
  followers: number;

  /**
   * The number of members the member is following.
   */
  following: number;

  /**
   * The number of tags the member has used for lists.
   */
  listTags: number;

  /**
   * The number of tags the member has used for diary entries and reviews.
   */
  filmTags: number;
}

export interface MemberSummary {
  /**
   * The LID of the member.
   */
  id: string;

  /**
   * The member's Letterboxd username. Usernames must be between 2 and 15 characters long and may
   * only contain upper or lowercase letters, numbers or the underscore (`_`) character.
   */
  username: string;

  /**
   * The given name of the member.
   */
  givenName: string;

  /**
   * The family name of the member.
   */
  familyName: string;

  /**
   * A convenience method that returns the member's given name and family name concatenated with a
   * space, if both are set, or just their given name or family name, if one is set, or their
   * username, if neither is set. Will never be empty.
   */
  displayName: string;

  /**
   * A convenience method that returns the member's given name, if set, or their username. Will
   * never be empty.
   */
  shortName: string;

  /**
   * The member's preferred pronoun. Use the
   * [/members/pronouns](https://api-docs.letterboxd.com/#path--members-pronouns) endpoint to
   * request all available pronouns.
   */
  pronoun: Pronoun;

  /**
   * The member's avatar image at multiple sizes. Avatar images to not have an enforced aspect
   * ratio, so should be center-cropped to a square if they are not 1:1.
   */
  avatar: Image;

  /**
   * The member's account type.
   */
  memberStatus: 'Crew' | 'Alum' | 'Hq' | 'Patron' | 'Pro' | 'Member';

  /**
   * `true` if ads should not be shown on the member's content.
   */
  hideAdsInContent: boolean;

  /**
   * The member's default policy determing who can post comments to their content. Supported
   * options are `Anyone`, `Friends` and `You`. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in
   * member's ability to comment (or not).
   *
   * @see ListRelationship.commentThreadState
   */
  commentPolicy: 'Anyone' | 'Friends' | 'You';

  /**
   * The member's account status.
   */
  accountStatus: 'Active' | 'Locked' | 'Memorialized';

  /**
   * `true` if member should not be shown ads.
   */
  hideAds: boolean;
}

export interface MemberTag {
  /**
   * @deprecated Use `displayTag` instead.
   * @see MemberTag.displayTag
   */
  tag: string;

  /**
   * The tag code.
   */
  code: string;

  /**
   * The tag text as entered by the tagger.
   */
  displayTag: string;

  /**
   * Counts of the member's uses of this tag.
   */
  counts: MemberTagCounts;
}

export interface MemberTagCounts {
  /**
   * The number of films the member has used this tag on.
   */
  films: number;

  /**
   * The number of log entries the member has used this tag on.
   */
  logEntries: number;

  /**
   * The number of diary entries the member has used this tag on.
   */
  diaryEntries: number;

  /**
   * The number of reviews the member has used this tag on.
   */
  reviews: number;

  /**
   * The number of lists the member has used this tag on.
   */
  lists: number;
}

export interface MemberTagsResponse {
  /**
   * The list of tag items, ordered by frequency of use.
   */
  items: MemberTag[];
}

export interface Minigenre {
  /**
   * The identifying code for the minigenre.
   */
  code: string;

  /**
   * The name of the minigenre.
   */
  name: string;
}

export interface Nanogenre {
  /**
   * The identifying code for the nanogenre.
   */
  code: string;

  /**
   * The name of the nanogenre.
   */
  name: string;
}

export interface NewsItem {
  /**
   * The title of the news item.
   */
  title: string;

  /**
   * The image.
   */
  image: Image;

  /**
   * The URL of the news item.
   */
  url: string;

  /**
   * A short description of the news item in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  shortDescription: string;

  /**
   * A long description of the news item in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  longDescription: string;

  /**
   * The podcast episode number, if this news item is for a podcast
   */
  episode: number;

  /**
   * The podcast season number, if this news item is for a podcast
   */
  season: number;
}

export interface NewsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of news items.
   */
  items: NewsItem[];
}

export interface OAuthError {
  /**
   * The error code, usually `invalid_grant`.
   */
  error: string;

  /**
   * The error description.
   */
  errorDescription: string;
}

export type PodcastSearchItem = AbstractSearchItem & {
  /**
   * The podcast.
   */
  podcast: NewsItem;
};

export interface Pronoun {
  /**
   *
The LID for this pronoun.
   */
  id: string;

  /**
   * A label to describe this pronoun.
   */
  label: string;

  /**
   * The pronoun to use when the member is the subject.
   *
   * @example She went to the movies.
   */
  subjectPronoun: string;

  /**
   * The pronoun to use when the member is the object.
   *
   * @example I went with her to the cinema.
   */
  objectPronoun: string;

  /**
   * The adjective to use when describing a specified thing or things belonging to or associated
   * with a member previously mentioned.
   *
   * @example He bought his tickets.
   */
  possessiveAdjective: string;

  /**
   * The pronoun to use when referring to a specified thing or things belonging to or associated
   * with a member previously mentioned.
   *
   * @example That popcorn was hers.
   */
  possessivePronoun: string;

  /**
   * The pronoun to use to refer back to the member.
   *
   * @example He saw himself as a great director.
   */
  reflexive: string;
}

export interface PronounsResponse {
  /**
   * The list of pronouns.
   */
  items: Pronoun[];
}

export interface RatingsHistogramBar {
  /**
   * The rating increment between `0.5` and `5.0`.
   */
  rating: number;

  /**
   * The height of this rating increment's entry in a unit-height histogram, normalized between
   * `0.0` and `1.0`. The increment(s) with the highest number of ratings will always return `1.0`
   * (unless there are no ratings for the film).
   */
  normalizedWeight: number;

  /**
   * The number of ratings made at this increment.
   */
  count: number;
}

export interface RegisterPushNotificationsRequest {
  /**
   * The device ID.
   */
  deviceId: string;

  /**
   * The device name.
   */
  deviceName?: string;

  /**
   * The Firebase token.
   */
  token: string;
}

export interface RegisterRequest {
  /**
   * The username for the new account. Use the `/auth/username-check` endpoint to check availability.
   */
  username?: string;

  /**
   * The password for the new account.
   */
  password?: string;

  /**
   * The email address for the new account.
   */
  emailAddress?: string;

  /**
   * The captcha response value
   */
  captchaResponse?: string;

  /**
   * Set to `true` if the person creating the account has agreed to being at least 16 years of age,
   *  and to accepting Letterboxd's [Terms of Use](https://letterboxd.com/terms-of-use/).
   */
  acceptTermsOfUse?: string;
}

export type RegistrationActivity = AbstractActivity & {
  type: 'RegistrationActivity';
};

export interface ReportCommentRequest {
  /**
   * The reason why the comment was reported.
   */
  reason: 'Abuse' | 'Spoilers' | 'Spam' | 'Plagiarism' | 'Other';

  /**
   * An optional, explanatory message to accompany the report. Required if the `reason` is
   * `Plagiarism` or `Other`.
   */
  message?: string;
}

export interface ReportFilmRequest {
  /**
   * The reason why the film was reported.
   */
  reason: 'Duplicate' | 'NotAFilm' | 'Other';

  /**
   * An optional, explanatory message to accompany the report. Required if the `reason` is
   * `Duplicate` or `Other`.
   */
  message?: string;
}

export interface ReportListRequest {
  /**
   * The reason why the list was reported.
   */
  reason: 'Abuse' | 'Spoilers' | 'Spam' | 'Plagiarism' | 'Other';

  /**
   * An optional, explanatory message to accompany the report. Required if the `reason` is
   * `Plagiarism` or `Other`.
   */
  message?: string;
}

export interface ReportMemberRequest {
  /**
   * The reason why the member was reported.
   */
  reason:
    | 'AbusiveAccount'
    | 'HatefulAccount'
    | 'ManipulativeAccount'
    | 'OffensiveAccount'
    | 'ParodyAccount'
    | 'PiracyAccount'
    | 'PlagiaristAccount'
    | 'SolicitousAccount'
    | 'SpamAccount'
    | 'Other';

  /**
   * An optional, explanatory message to accompany the report. Required if the `reason` is `Other`.
   */
  message?: string;
}

export interface ReportReviewRequest {
  /**
   * The reason why the review was reported.
   */
  reason: 'Abuse' | 'Spoilers' | 'Spam' | 'Plagiarism' | 'Other';

  /**
   * An optional, explanatory message to accompany the report. Required if the `reason` is
   * `Plagiarism` or `Other`.
   */
  message?: string;
}

export interface Review {
  /**
   * The review text in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`.
   */
  lbml: string;

  /**
   * Will be `true` if the member has indicated that the `review` field contains plot spoilers for
   * the film.
   */
  containsSpoilers: boolean;

  /**
   * Will be `true` if the spoilers flag has been locked by a moderator.
   */
  spoilersLocked: boolean;

  /**
   * Will be `true` if the `review` has been removed by a moderator.
   */
  moderated: boolean;

  /**
   * The third-party service or services to which this review can be shared. Only included if the
   * authenticated member is the review's owner.
   *
   * @deprecated No longer supported by Facebook.
   */
  canShareOn: 'Facebook';

  /**
   * The third-party service or services to which this review has been shared. Only included if the
   * authenticated member is the review's owner.
   *
   * @deprecated No longer supported by Facebook.
   */
  sharedOn: 'Facebook';

  /**
   * The timestamp when this log entry's review was first published, in ISO 8601 format with UTC
   * timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenReviewed: string;

  /**
   * The review text formatted as HTML.
   */
  text: string;
}

export type ReviewActivity = AbstractActivity & {
  /**
   * The log entry associated with this activity
   */
  review: LogEntry;
};

export interface ReviewComment {
  /**
   * The LID of the comment/reply.
   */
  id: string;

  /**
   * The member who posted the comment.
   */
  member: MemberSummary;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenUpdated: string;

  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>`
   * `<strong>` `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`.
   */
  commentLbml: string;

  /**
   * If Letterboxd moderators have removed the comment from the site, `removedByAdmin` will be true
   * and `comment` will not be included.
   */
  removedByAdmin: boolean;

  /**
   * If the content owner has removed the comment from the site, `removedByContentOwner` will be
   * true and `comment` will not be included.
   */
  removedByContentOwner: boolean;

  /**
   * If the comment owner has removed the comment from the site, `deleted` will be true and
   * `comment` will not be included.
   */
  deleted: boolean;

  /**
   * If the authenticated member has blocked the commenter, `blocked` will be true and `comment`
   * will not be included.
   */
  blocked: boolean;

  /**
   * If the review owner has blocked the commenter, `blockedByOwner` will be true and `comment`
   * will not be included.
   */
  blockedByOwner: boolean;

  /**
   * If the authenticated member posted this comment, and the comment is still editable, this value
   * shows the number of seconds remaining until the editing window closes.
   */
  editableWindowExpiresIn: number;

  /**
   * The review on which the comment was posted.
   */
  review: ReviewIdentifier;

  /**
   * The message portion of the comment formatted as HTML.
   */
  comment: string;
}

export type ReviewCommentActivity = AbstractActivity & {
  /**
   * The review associated with the activity.
   */
  review: LogEntry;

  /**
   * The comment associated with the activity.
   */
  comment: ReviewComment;
};

export interface ReviewCommentsResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of comments.
   */
  items: ReviewComment[];
}

export interface ReviewIdentifier {
  /**
   * The LID of the log entry.
   */
  id: string;
}

export type ReviewLikeActivity = AbstractActivity & {
  /**
   * The review associated with the activity.
   */
  review: LogEntry;
};

export interface ReviewRelationship {
  /**
   * Will be `true` if the member likes the review (via the 'heart' icon). A member may not like
   * their own review.
   */
  liked: boolean;

  /**
   * Will be `true` if the member is subscribed to comment notifications for the review
   */
  subscribed: boolean;

  /**
   * Defaults to `Subscribed` for the review's author, and `NotSubscribed` for other members. The
   * subscription value may change when a member (other than the owner) posts a comment, as follows:
   * the member will become automatically `Subscribed` unless they have previously `Unsubscribed`
   * from the comment thread via the web interface or API, or unless they have disabled comment
   * notifications in their profile settings.
   *
   * `NotSubscribed` and `Unsubscribed` are maintained as separate states so the UI can, if needed,
   * indicate to the member how their subscription state will be affected if/when they post a
   * comment.
   */
  subscriptionState: 'Subscribed' | 'NotSubscribed' | 'Unsubscribed';

  /**
   * The authenticated member's state with respect to adding comments for this review.
   *
   *  - `Banned` means the Letterboxd community managers have restricted the member's ability to
   *    post comments.
   *  - `Blocked` means the owner has blocked the member from posting comments.
   *  - `BlockedThem` means the member has blocked the owner and is therefore unable to post
   *    comments.
   *  - `CanComment` means the authenticated member is authorized to post a comment (also known as
   *    a "reply"). All other values mean the authenticated member is not authorized to post a
   *    comment.
   *  - `Closed` means the owner has closed the comment thread to all other members.
   *  - `FriendsOnly` means the owner is only accepting comments from members they follow.
   *  - `Moderated` means the Letterboxd community managers have removed the content (applies to
   *    reviews only).
   *  - `NotCommentable` means that comments may not be posted to this thread.
   *  - `NotValidated` means the owner has not validated their email address.
   */
  commentThreadState:
    | 'Banned'
    | 'Blocked'
    | 'BlockedThem'
    | 'CanComment'
    | 'Closed'
    | 'FriendsOnly'
    | 'Moderated'
    | 'NotCommentable'
    | 'NotValidated';
}

export interface ReviewRelationshipUpdateMessage {
  /**
   * The type of message.
   */
  type: 'Error' | 'Success';

  /**
   * The error message code.
   */
  code:
    | 'LikeBlockedContent'
    | 'LikeOwnReview'
    | 'LikeRateLimit'
    | 'LikeRemovedReview'
    | 'LikeLogEntryWithoutReview'
    | 'SubscribeWhenOptedOut'
    | 'SubscribeToContentYouBlocked'
    | 'SubscribeToBlockedContent';

  /**
   * The error message text in human-readable form.
   */
  title: string;
}

export interface ReviewRelationshipUpdateRequest {
  /**
   * Set to `true` if the member likes the review (via the 'heart' icon). A member may not like
   * their own review.
   */
  liked?: boolean;

  /**
   * Set to `true` to subscribe the member to comment notifications for the review, or `false` to
   * unsubscribe them. A value of `true` will be ignored if the member has disabled comment
   * notifications in their profile settings.
   */
  subscribed?: boolean;
}

export interface ReviewRelationshipUpdateResponse {
  /**
   * The response object.
   */
  data: ReviewRelationship;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: ReviewRelationshipUpdateMessage[];
}

export type ReviewSearchItem = AbstractSearchItem & {
  /**
   * Details of the review.
   */
  review: LogEntry;
};

export interface ReviewStatistics {
  /**
   * The log entry for which statistics were requested.
   */
  logEntry: ReviewIdentifier;

  /**
   * The number of comments and likes for the review.
   */
  counts: ReviewStatisticsCounts;
}

export interface ReviewStatisticsCounts {
  /**
   * The number of comments for the review.
   */
  comments: number;

  /**
   * The number of members who like the review.
   */
  likes: number;
}

export interface ReviewUpdateResponse {
  /**
   * The response object.
   */
  data: LogEntry;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: LogEntryUpdateMessage[];
}

export interface SearchResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of search results.
   */
  items: AbstractSearchItem[];
}

export interface Service {
  /**
   * The LID of the service.
   */
  id: string;

  /**
   * The name of the service.
   */
  name: string;

  /**
   * The URL of the thumbnail image for the service.
   */
  icon: string;
}

export interface StoriesResponse {
  /**
   * The cursor to the next page of results.
   */
  next: Cursor;

  /**
   * The list of stories.
   */
  items: StorySummary[];
}

export interface Story {
  /**
   * The LID of the story.
   */
  id: string;

  /**
   * The name of the story.
   */
  name: string;

  /**
   * The member who published the story.
   */
  author: MemberSummary;

  /**
   * The external URL linked to by the story (if applicable).
   */
  url: string;

  /**
   * The publication name for the story (if applicable).
   */
  source: string;

  /**
   * The URL of the story's video (if applicable).
   */
  videoUrl: string;

  /**
   * The story body formatted as HTML. The text is a preview extract, and may be truncated if it's
   * too long.
   */
  bodyHtml: string;

  /**
   * The story body formatted as LBML. May contain the following HTML tags: `<br>` `<strong>`
   * `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`. The text is a preview extract, and may be
   * truncated if it's too long.
   */
  bodyLbml: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenUpdated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * The story's hero image, in multiple resolutions.
   */
  image: Image;
}

export type StoryActivity = AbstractActivity & {
  /**
   * The story associated with the activity.
   */
  story: StorySummary;
};

export type StorySearchItem = AbstractSearchItem & {
  /**
   * The story.
   */
  story: StorySummary;
};

export interface StorySummary {
  /**
   * The LID of the story.
   */
  id: string;

  /**
   * The name of the story.
   */
  name: string;

  /**
   * The member who published the story.
   */
  author: MemberSummary;

  /**
   * The external URL linked to by the story (if applicable).
   */
  url: string;

  /**
   * The publication name for the story (if applicable).
   */
  source: string;

  /**
   * The URL of the story's video (if applicable).
   */
  videoUrl: string;

  /**
   * The story body formatted as HTML. The text is a preview extract, and may be truncated if it's
   * too long.
   */
  bodyHtml: string;

  /**
   * The story body formatted as LBML. May contain the following HTML tags: `<br>` `<strong>`
   * `<em>` `<b>` `<i>` `<a href="">` `<blockquote>`. The text is a preview extract, and may be
   * truncated if it's too long.
   */
  bodyLbml: string;

  /**
   * Will be true if the story body was truncated because it's very long.
   */
  bodyTruncated: boolean;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenUpdated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   *
   * @example 1997-08-29T07:14:00Z
   */
  whenCreated: string;

  /**
   * The story's hero image, in multiple resolutions.
   */
  image: Image;
}

export interface Tag {
  /**
   * @deprecated Use `displayTag` instead.
   * @see Tag.displayTag
   */
  tag: string;

  /**
   * The tag code.
   */
  code: string;

  /**
   * The tag text as entered by the tagger.
   */
  displayTag: string;
}

export type TagSearchItem = AbstractSearchItem & {
  /**
   * The tag.
   */
  tag: Tag;
};

export interface TagsResponse {
  /**
   * The list of tags, ordered by frequency of use.
   */
  items: string[];
}

export interface Theme {
  /**
   * The identifying code for the theme.
   */
  code: string;

  /**
   * The name of the theme.
   */
  name: string;
}

export interface TopicsResponse {
  /**
   * The list of topics.
   */
  items: AListTopic[];
}

export interface UsernameCheckResponse {
  /**
   * Will be `Available` if the username is available to register, or `NotAvailable` if used by
   * another member (or attached to a deactivated account, or otherwise reserved). May return an
   * appropriate error value if the username doesn't meet Letterboxd's requirements: Usernames must
   * be between 2 and 15 characters long and may only contain upper or lowercase letters, numbers
   * or the underscore (`_`) character.
   */
  result: 'Available' | 'NotAvailable' | 'TooShort' | 'TooLong' | 'Invalid';
}

export type WatchlistActivity = AbstractActivity & {
  /**
   * The film associated with the activity. Includes a MemberFilmRelationship for the member who
   * added the activity.
   */
  film: FilmSummary;
};
