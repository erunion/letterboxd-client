//
// These type definitions were last updated on 2024-10-02.
//
export type AbstractActivity = {
  /**
   * The member associated with the activity.
   */
  member: MemberSummary;

  /**
   * The type of activity.
   */
  type: ActivityType;

  /**
   * The timestamp of the activity, in ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCreated: string;
} & (
  | (CombinedIncomingActivity & { type: ActivityType.CombinedIncomingActivity })
  | (CombinedPersonActivity & { type: ActivityType.CombinedPersonActivity })
  | (DiaryEntryActivity & { type: ActivityType.DiaryEntryActivity })
  | (FilmLikeActivity & { type: ActivityType.FilmLikeActivity })
  | (FilmRatingActivity & { type: ActivityType.FilmRatingActivity })
  | (FilmWatchActivity & { type: ActivityType.FilmWatchActivity })
  | (FollowActivity & { type: ActivityType.FollowActivity })
  | (ListActivity & { type: ActivityType.ListActivity })
  | (ListCommentActivity & { type: ActivityType.ListCommentActivity })
  | (ListLikeActivity & { type: ActivityType.ListLikeActivity })
  | (ReviewActivity & { type: ActivityType.ReviewActivity })
  | (ReviewCommentActivity & { type: ActivityType.ReviewCommentActivity })
  | (ReviewLikeActivity & { type: ActivityType.ReviewLikeActivity })
  | (ReviewResponseActivity & { type: ActivityType.ReviewResponseActivity })
  | (StoryActivity & { type: ActivityType.StoryActivity })
  | (StoryCommentActivity & { type: ActivityType.StoryCommentActivity })
  | (StoryLikeActivity & { type: ActivityType.StoryLikeActivity })
  | (WatchlistActivity & { type: ActivityType.WatchlistActivity })
);

export type AbstractComment = {
  /**
   * If the authenticated member has blocked the commenter, `blocked` will be true and `comment` will not be included.
   */
  blocked: boolean;

  /**
   * If the content owner has blocked the commenter, `blockedByOwner` will be true and `comment` will not be included.
   */
  blockedByOwner: boolean;

  /**
   * The message portion of the comment formatted as HTML.
   */
  comment?: string;

  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`.
   */
  commentLbml?: string;

  /**
   * If the comment owner has removed the comment from the site, `deleted` will be true and `comment` will not be
   * included.
   */
  deleted: boolean;

  /**
   * If the authenticated member posted this comment, and the comment is still editable, this value shows the number of
   * seconds remaining until the editing window closes.
   * @deprecated
   */
  editableWindowExpiresIn?: number;

  /**
   * The LID of the comment/reply.
   */
  id: string;

  /**
   * The member who posted the comment.
   */
  member: MemberSummary;

  /**
   * If Letterboxd moderators have removed the comment from the site, `removedByAdmin` will be true and `comment` will
   * not be included.
   */
  removedByAdmin: boolean;

  /**
   * If the content owner has removed the comment from the site, `removedByContentOwner` will be true and `comment` will
   * not be included.
   */
  removedByContentOwner: boolean;

  /**
   * The type of comment.
   */
  type: CommentType;

  /**
   * ISO 8601 format with UTC timezone, i.e. YYYY-MM-DDThh:mm:ssZ
   */
  whenCreated: string;

  /**
   * If the authenticated member posted this comment, and the comment is still editable, this value shows when the
   * editing window closes. ISO 8601 format with UTC timezone, i.e.  `YYYY-MM-DDThh:mm:ssZ`
   */
  whenEditingWindowExpires?: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenUpdated: string;
} & (
  | (ListComment & { type: CommentType.ListComment })
  | (ReviewComment & { type: CommentType.ReviewComment })
  | (StoryComment & { type: CommentType.StoryComment })
);

export type AbstractSearchItem = {
  /**
   * A relevancy value that can be used to order results.
   */
  score: number;

  /**
   * The type of the search result.
   */
  type: SearchResultType;
} & (
  | (ArticleSearchItem & { type: SearchResultType.ArticleSearchItem })
  | (ContributorSearchItem & { type: SearchResultType.ContributorSearchItem })
  | (FilmSearchItem & { type: SearchResultType.FilmSearchItem })
  | (ListSearchItem & { type: SearchResultType.ListSearchItem })
  | (MemberSearchItem & { type: SearchResultType.MemberSearchItem })
  | (PodcastSearchItem & { type: SearchResultType.PodcastSearchItem })
  | (ReviewSearchItem & { type: SearchResultType.ReviewSearchItem })
  | (StorySearchItem & { type: SearchResultType.StorySearchItem })
  | (TagSearchItem & { type: SearchResultType.TagSearchItem })
);

export enum AccountStatus {
  Active = 'Active',
  Memorialized = 'Memorialized',
}

export enum ActivityFilter {
  CombinedIncomingActivity = 'CombinedIncomingActivity',
  CombinedPersonActivity = 'CombinedPersonActivity',
  DiaryEntryActivity = 'DiaryEntryActivity',
  FilmLikeActivity = 'FilmLikeActivity',
  FilmRatingActivity = 'FilmRatingActivity',
  FilmWatchActivity = 'FilmWatchActivity',
  FollowActivity = 'FollowActivity',
  ListActivity = 'ListActivity',
  ListCommentActivity = 'ListCommentActivity',
  ListLikeActivity = 'ListLikeActivity',
  ReviewActivity = 'ReviewActivity',
  ReviewCommentActivity = 'ReviewCommentActivity',
  ReviewLikeActivity = 'ReviewLikeActivity',
  ReviewResponseActivity = 'ReviewResponseActivity',
  StoryActivity = 'StoryActivity',
  StoryCommentActivity = 'StoryCommentActivity',
  StoryLikeActivity = 'StoryLikeActivity',
  WatchlistActivity = 'WatchlistActivity',
}

export interface ActivityResponse {
  itemCount?: number;

  /**
   * The list of activity items.
   */
  items: AbstractActivity[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export enum ActivityType {
  CombinedIncomingActivity = 'CombinedIncomingActivity',
  CombinedPersonActivity = 'CombinedPersonActivity',
  DiaryEntryActivity = 'DiaryEntryActivity',
  FilmLikeActivity = 'FilmLikeActivity',
  FilmRatingActivity = 'FilmRatingActivity',
  FilmWatchActivity = 'FilmWatchActivity',
  FollowActivity = 'FollowActivity',
  ListActivity = 'ListActivity',
  ListCommentActivity = 'ListCommentActivity',
  ListLikeActivity = 'ListLikeActivity',
  ReviewActivity = 'ReviewActivity',
  ReviewCommentActivity = 'ReviewCommentActivity',
  ReviewLikeActivity = 'ReviewLikeActivity',
  ReviewResponseActivity = 'ReviewResponseActivity',
  StoryActivity = 'StoryActivity',
  StoryCommentActivity = 'StoryCommentActivity',
  StoryLikeActivity = 'StoryLikeActivity',
  WatchlistActivity = 'WatchlistActivity',
}

export interface AGoogleBillingSubscription {
  /**
   * The number of days until the subscription ends. Only included if the subscription is current. May be 0, in which
   * case the subscription is current but will end today.
   */
  subscriptionDaysRemaining?: number;
}

export interface AListAddition {
  /**
   * The number of films added to the list.
   */
  additions: number;

  /**
   * The list.
   */
  list: ListIdentifier;
}

export interface AListTopic {
  /**
   * The list of featured lists for the topic.
   */
  items: ListSummary[];

  /**
   * The topic name.
   */
  name: string;
}

export interface AppleIAPSubscription {
  /**
   * The number of days until the subscription ends. Only included if the subscription is current. May be 0, in which
   * case the subscription is current but will end today.
   */
  subscriptionDaysRemaining?: number;
}

export interface AppleIAPSubscriptionMessage {
  /**
   * The error message code.
   */
  code: 'SubscriptionAlreadyExpired' | 'SubscriptionBelongsToAnotherMember' | 'UnexpectedError';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface AppleIAPSubscriptionRequest {
  /**
   * The receipt token (Base-64 encoded).
   */
  receiptToken: string;
}

export interface AppleIAPSubscriptionResponse {
  /**
   * The response object.
   */
  data: AppleIAPSubscription;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: AppleIAPSubscriptionMessage[];
}

/**
 * @inherits AbstractSearchItem
 */
export interface ArticleSearchItem {
  /**
   * The article.
   */
  article: NewsItem;
}

export interface AvailabilityType {
  /**
   * The key value of the availability type.
   */
  key: string;

  /**
   * The display name of the availability type.
   */
  label: string;
}

export interface AvailabilityTypesResponse {
  /**
   * The list of availability types.
   */
  items?: AvailabilityType[];
}

export interface CollectRequest {
  itemId?: string;
  nonce?: string;
  token?: string;
}

/**
 * @inherits AbstractActivity
 */
export interface CombinedIncomingActivity {
  /**
   * The number of follow actions grouped under this combined activity
   */
  follows?: number;

  id?: string;

  /**
   * The number of film list comments grouped under this combined activity
   */
  listComments?: number;

  /**
   * The number of film list likes grouped under this combined activity
   */
  listLikes?: number;

  /**
   * The number of review comments grouped under this combined activity
   */
  reviewComments?: number;

  /**
   * The number of review likes grouped under this combined activity
   */
  reviewLikes?: number;

  /**
   * The number of story comments grouped under this combined activity
   */
  storyComments?: number;

  /**
   * The number of story likes grouped under this combined activity
   */
  storyLikes?: number;
}

/**
 * @inherits
 */
export interface CombinedPersonActivity {
  /**
   * The number of film likes grouped under this combined activity
   */
  filmLikes?: number;
  /**
   * The number of film ratings grouped under this combined activity
   */
  filmRatings?: number;

  /**
   * The number of film watches grouped under this combined activity
   */
  filmWatches?: number;

  /**
   * The number of films watchlisted grouped under this combined activity
   */
  filmsWatchlisted?: number;

  /**
   * The number of follow actions grouped under this combined activity
   */
  follows?: number;

  id?: string;

  /**
   * The number of film list comments grouped under this combined activity
   */
  listComments?: number;

  /**
   * The number of film list likes grouped under this combined activity
   */
  listLikes?: number;

  /**
   * The number of review comments grouped under this combined activity
   */
  reviewComments?: number;

  /**
   * The number of review likes grouped under this combined activity
   */
  reviewLikes?: number;

  /**
   * The number of story comments grouped under this combined activity
   */
  storyComments?: number;

  /**
   * The number of story likes grouped under this combined activity
   */
  storyLikes?: number;
}

export interface CommentCreationRequest {
  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  comment: string;
}

export enum CommentPolicy {
  Anyone = 'Anyone',
  Friends = 'Friends',
  You = 'You',
}

export enum CommentSubscriptionState {
  NotSubscribed = 'NotSubscribed',
  Subscribed = 'Subscribed',
  Unsubscribed = 'Unsubscribed',
}

export enum CommentThreadState {
  Banned = 'Banned',
  Blocked = 'Blocked',
  BlockedThem = 'BlockedThem',
  CanComment = 'CanComment',
  Closed = 'Closed',
  FriendsOnly = 'FriendsOnly',
  Moderated = 'Moderated',
  NotCommentable = 'NotCommentable',
  NotValidated = 'NotValidated',
}

export enum CommentType {
  ListComment = 'ListComment',
  ReviewComment = 'ReviewComment',
  StoryComment = 'StoryComment',
}

export interface CommentUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'CommentBan'
    | 'CommentEditWindowExpired'
    | 'CommentOnBlockedContent'
    | 'CommentOnContentYouBlocked'
    | 'CommentTooLong'
    | 'MissingComment';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface CommentUpdateRequest {
  /**
   * The message portion of the comment in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
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
   * The number of films for this contribution type.
   */
  filmCount: number;

  /**
   * The type of contribution.
   */
  type: ContributionType;
}

export enum ContributionType {
  Actor = 'Actor',
  AdditionalDirecting = 'AdditionalDirecting',
  AdditionalPhotography = 'AdditionalPhotography',
  ArtDirection = 'ArtDirection',
  AssistantDirector = 'AssistantDirector',
  CameraOperator = 'CameraOperator',
  Casting = 'Casting',
  Choreography = 'Choreography',
  Cinematography = 'Cinematography',
  CoDirector = 'CoDirector',
  Composer = 'Composer',
  Costumes = 'Costumes',
  Director = 'Director',
  Editor = 'Editor',
  ExecutiveProducer = 'ExecutiveProducer',
  Hairstyling = 'Hairstyling',
  Lighting = 'Lighting',
  MakeUp = 'MakeUp',
  OriginalWriter = 'OriginalWriter',
  Producer = 'Producer',
  ProductionDesign = 'ProductionDesign',
  SetDecoration = 'SetDecoration',
  Songs = 'Songs',
  Sound = 'Sound',
  SpecialEffects = 'SpecialEffects',
  Story = 'Story',
  Studio = 'Studio',
  Stunts = 'Stunts',
  TitleDesign = 'TitleDesign',
  VisualEffects = 'VisualEffects',
  Writer = 'Writer',
}

export interface Contributor {
  /**
   * The biography of the contributor on TMDB, if known
   */
  bio?: string;

  /**
   * The custom poster for this contributor, if there is one for the currently logged in user (16:9 ratio in multiple
   * sizes).
   */
  customPoster?: Image;

  /**
   * The treasure hunt items related to the contributor.
   * @private
   */
  huntItems?: TreasureHuntItem[];

  /**
   * The LID of the contributor.
   */
  id: string;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The name of the contributor.
   */
  name: string;

  /**
   * An array of the types of contributions made, with a count of films for each contribution type.
   */
  statistics: ContributorStatistics;

  /**
   * The ID of the contributor on TMDB, if known
   */
  tmdbid?: string;
}

/**
 * @inherits AbstractSearchItem
 */
export interface ContributorSearchItem {
  /**
   * Details of the contributor.
   */
  contributor?: Contributor;
}

export interface ContributorStatistics {
  /**
   * The statistics for each contribution type.
   */
  contributions: ContributionStatistics[];
}

export interface ContributorSummary {
  /**
   * The character name if available (only if the contribution is as an `Actor`; see the type field in
   * `FilmContributions`).
   * @see FilmContributions.type
   */
  characterName?: string;

  /**
   * The custom poster for this contributor, if there is one for the currently logged in user (16:9 ratio in multiple
   * sizes).
   */
  customPoster?: Image;

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
  tmdbid?: string;
}

export interface CountriesResponse {
  /**
   * The list of countries.
   */
  items?: Country[];
}

export interface Country {
  /**
   * The ISO 3166-1 defined code of the country.
   */
  code: string;

  /**
   * The URL of the SVG image representing the country's flag.
   */
  flagUrl?: string;

  /**
   * The name of the country.
   */
  name: string;
}

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
   * Will be `true` if the member has indicated (or it can be otherwise determined) that the member has seen the film
   * prior to this date.
   */
  rewatch: boolean;
}

/**
 * @inherits AbstractActivity
 */
export interface DiaryEntryActivity {
  /**
   * The log entry associated with this activity
   */
  diaryEntry?: LogEntry;
}

export interface DisableAccountRequest {
  /**
   * The member's current two-factor authentication code. Only required for members that have two-factor authentication
   * enabled.
   */
  authenticationCode?: string;

  /**
   * The member's current password.
   */
  currentPassword: string;

  /**
   * The disable account mode - defaults to 'Disable' if not specified.
   */
  mode?: 'Delete' | 'Disable';
}

export interface ErrorResponse {
  code?: string;
  error: boolean;
  message: string;
}

export interface Film {
  /**
   * `true` if the film is in TMDb's ‘Adult' category.
   */
  adult: boolean;

  /**
   * The film's unobfuscated poster image (2:3 aspect ratio in multiple sizes), only populated if the `adult` flag is
   * `true`, may contain adult content.
   */
  adultPoster?: Image;

  /**
   * The other names by which the film is known (including alternative titles and/or foreign translations).
   * @private
   */
  alternativeNames?: string[];

  /**
   * The film's backdrop image (16:9 ratio in multiple sizes).
   */
  backdrop?: Image;

  /**
   * The backdrop's vertical focal point, expressed as a proportion of the image's height, using values between `0.0`
   * and `1.0`. Use when cropping the image into a shorter space, such as in the page for a film on the Letterboxd site.
   */
  backdropFocalPoint?: number;

  /**
   * The film's contributors (director, cast and crew) grouped by discipline.
   */
  contributions: FilmContributions[];

  /**
   * The film's production countries.
   * @private
   */
  countries?: Country[];

  /**
   * A synopsis of the film.
   */
  description?: string;

  /**
   * The LID of the collection containing this film.
   */
  filmCollectionId?: string;

  /**
   * The film's genres.
   */
  genres: Genre[];

  /**
   * The treasure hunt items related to the film.
   * @private
   */
  huntItems?: TreasureHuntItem[];

  /**
   * The LID of the film.
   */
  id: string;

  /**
   * The film's spoken languages.
   * @private
   */
  languages?: Language[];

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The film's minigenres.
   * @private
   */
  minigenres?: Minigenre[];

  /**
   * The title of the film.
   */
  name: string;

  /**
   * The film's nanogenres.
   * @private
   */
  nanogenres?: Nanogenre[];

  /**
   * The related news items for the film.
   */
  news?: NewsItem[];

  /**
   * The film's original language.
   */
  originalLanguage?: Language;

  /**
   * The original title of the film, if it was first released with a non-English title.
   * @private
   */
  originalName?: string;

  /**
   * The film's poster image (2:3 aspect ratio in multiple sizes). Will contain only a single obfuscated image if the
   * `adult` flag is `true`.
   */
  poster?: Image;

  /**
   * `true` if the poster for this film can be customised by any member.
   */
  posterCustomisable: boolean;

  /**
   * The film's primary spoken language.
   */
  primaryLanguage?: Language;

  /**
   * The film's original production language.
   * @private
   */
  productionLanguage?: Language;

  /**
   * The weighted average rating of the film between `0.5` and `5.0`. Only available for films that have received
   * sufficient ratings.
   */
  rating?: number;

  /**
   * The related recent stories for the film.
   */
  recentStories?: Story[];

  /**
   * Relationships to the film for the authenticated member (if any) and other members where relevant.
   */
  relationships?: MemberFilmRelationship[];

  /**
   * The year in which the film was first released.
   */
  releaseYear?: number;

  /**
   * The film's release information.
   * @private
   */
  releases?: Release[];

  /**
   * `true` if reviews for the film are hidden due to a high volume of moderation traffic.
   */
  reviewsHidden: boolean;

  /**
   * The film's duration (in minutes).
   */
  runTime?: number;

  /**
   * The other films most similar to the film.
   * @private
   */
  similarTo?: FilmSummary[];

  /**
   * A modified version of the name that has been normalized for consistent sorting.
   */
  sortingName: string;

  /**
   * The tagline for the film.
   */
  tagline?: string;

  /**
   * The ad targeting values.
   * @private
   */
  targeting?: string[];

  /**
   * The film's themes.
   * @private
   */
  themes?: Theme[];

  /**
   * The film's position in the official Letterboxd Top 250 list of narrative feature films, `null` if the film is not
   * in the list.
   */
  top250Position?: number;

  /**
   * The film's trailer.
   */
  trailer?: FilmTrailer;
}

export interface FilmAvailability {
  /**
   * The regional store for the service. Not all countries are supported on all services.
   */
  country:
    | 'AGO'
    | 'AIA'
    | 'ALB'
    | 'AND'
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
    | 'BIH'
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
    | 'CIV'
    | 'CMR'
    | 'COD'
    | 'COL'
    | 'CPV'
    | 'CRI'
    | 'CUB'
    | 'CYM'
    | 'CYP'
    | 'CZE'
    | 'DEU'
    | 'DMA'
    | 'DNK'
    | 'DOM'
    | 'DZA'
    | 'ECU'
    | 'EGY'
    | 'ESP'
    | 'EST'
    | 'FIN'
    | 'FJI'
    | 'FRA'
    | 'FSM'
    | 'GBR'
    | 'GGY'
    | 'GHA'
    | 'GIB'
    | 'GMB'
    | 'GNB'
    | 'GNQ'
    | 'GRC'
    | 'GRD'
    | 'GTM'
    | 'GUF'
    | 'GUY'
    | 'HKG'
    | 'HND'
    | 'HRV'
    | 'HUN'
    | 'IDN'
    | 'IND'
    | 'IRL'
    | 'IRQ'
    | 'ISL'
    | 'ISR'
    | 'ITA'
    | 'JAM'
    | 'JOR'
    | 'JPN'
    | 'KAZ'
    | 'KEN'
    | 'KGZ'
    | 'KHM'
    | 'KNA'
    | 'KOR'
    | 'KWT'
    | 'LAO'
    | 'LBN'
    | 'LBY'
    | 'LCA'
    | 'LIE'
    | 'LKA'
    | 'LTU'
    | 'LUX'
    | 'LVA'
    | 'MAC'
    | 'MAR'
    | 'MCO'
    | 'MDA'
    | 'MDG'
    | 'MEX'
    | 'MKD'
    | 'MLI'
    | 'MLT'
    | 'MNE'
    | 'MNG'
    | 'MOZ'
    | 'MUS'
    | 'MWI'
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
    | 'PAK'
    | 'PAN'
    | 'PER'
    | 'PHL'
    | 'PNG'
    | 'POL'
    | 'PRT'
    | 'PRY'
    | 'PSE'
    | 'PYF'
    | 'QAT'
    | 'ROU'
    | 'RUS'
    | 'SAU'
    | 'SEN'
    | 'SGP'
    | 'SLV'
    | 'SMR'
    | 'SRB'
    | 'SVK'
    | 'SVN'
    | 'SWE'
    | 'SWZ'
    | 'SYC'
    | 'TCA'
    | 'TCD'
    | 'THA'
    | 'TJK'
    | 'TKM'
    | 'TTO'
    | 'TUN'
    | 'TUR'
    | 'TWN'
    | 'TZA'
    | 'UGA'
    | 'UKR'
    | 'URY'
    | 'USA'
    | 'UZB'
    | 'VAT'
    | 'VEN'
    | 'VGB'
    | 'VNM'
    | 'YEM'
    | 'ZAF'
    | 'ZMB'
    | 'ZWE';

  /**
   * The name of the service.
   */
  displayName: string;

  /**
   * The URL of the thumbnail image for the service.
   */
  icon?: string;

  /**
   * The unique ID (if any) for the film on this service.
   */
  id?: string;

  /**
   * @deprecated Use `displayName` instead.
   * @see displayName
   */
  service?: 'Amazon' | 'AmazonPrime' | 'AmazonVideo' | 'iTunes' | 'Netflix';

  /**
   * The code for the service.
   */
  serviceCode?: string;

  /**
   * The types of the availability.
   */
  types: ('buy' | 'cinema' | 'rent' | 'stream')[];

  /**
   * The URL for the film on this service.
   */
  url: string;
}

export interface FilmAvailabilityResponse {
  /**
   * The list of stores where the film is available for streaming or purchasing, in order of preference. If the member
   * has not specified their preferred stores for a service, the USA store will be assumed.
   */
  items?: FilmAvailability[];
}

export interface FilmCollection {
  /**
   * The list of films in the collection.
   */
  films: FilmSummary[];

  /**
   * The LID of the film collection.
   */
  id: string;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The name of the collection.
   */
  name: string;
}

export interface FilmContribution {
  /**
   * The name of the character (only when `type` is `Actor`).
   */
  characterName?: string;

  /**
   * Will be `true` if the contribution contains plot spoilers for the film.
   */
  containsSpoilers: boolean;

  /**
   * The film.
   */
  film: FilmSummary;

  /**
   * The type of contribution.
   */
  type: ContributionType;
}

export interface FilmContributions {
  /**
   * The list of contributors of the specified type for the film.
   */
  contributors: ContributorSummary[];

  /**
   * The type of contribution.
   */
  type: ContributionType;
}

export interface FilmContributionsResponse {
  itemCount?: number;

  /**
   * The list of contributions.
   */
  items: FilmContribution[];

  /**
   * Metadata about the contributor's contributions.
   */
  metadata?: FilmContributorMetadata[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;

  /**
   * The relationships to the contributor for the members referenced in the request.
   */
  relationships?: FilmContributorMemberRelationship[];
}

export interface FilmContributorMemberRelationship {
  /**
   * The member.
   */
  member?: MemberSummary;

  /**
   * The relationship details.
   */
  relationships?: FilmContributorRelationship[];
}

export interface FilmContributorMetadata {
  /**
   * The details for this contribution type.
   */
  data: FilmsMetadata;

  /**
   * The type of contribution.
   */
  type: ContributionType;
}

export interface FilmContributorRelationship {
  /**
   * The relationship the member has with the (filtered) films.
   */
  relationship: FilmsRelationship;

  /**
   * The type of contribution.
   */
  type: ContributionType;
}

export interface FilmIdentifier {
  /**
   * The LID of the film.
   */
  id: string;
}

/**
 * @inherits AbstractActivity
 */
export interface FilmLikeActivity {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who added the activity.
   */
  film?: FilmSummary;
}

export enum FilmMemberRelationship {
  Favorited = 'Favorited',
  Ignore = 'Ignore',
  InWatchlist = 'InWatchlist',
  Liked = 'Liked',
  NotInWatchlist = 'NotInWatchlist',
  NotLiked = 'NotLiked',
  NotRated = 'NotRated',
  NotWatched = 'NotWatched',
  Rated = 'Rated',
  Values = 'Values',
  Watched = 'Watched',
}

/**
 * @inherits AbstractActivity
 */
export interface FilmRatingActivity {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who added the activity.
   */
  film?: FilmSummary;

  /**
   * The member's rating for the film. Allowable values are between `0.5` and `5.0`, with increments of `0.5`.
   */
  rating?: number;
}

export interface FilmRelationship {
  /**
   * A list of LIDs for log entries the member has added for the film in diary order, with most recent entries first.
   */
  diaryEntries: string[];

  /**
   * Will be `true` if the member has the film as one of their four favorites.
   */
  favorited: boolean;

  /**
   * Will be `true` if the film is in the member's watchlist.
   */
  inWatchlist: boolean;

  /**
   * Will be `true` if the member likes the film (via the ‘heart' icon).
   */
  liked: boolean;

  /**
   * Will be `true` if the member owns the film. Only returned for paying members.
   */
  owned?: boolean;

  /**
   * The member's rating for the film.
   */
  rating?: number;

  /**
   * A list of LIDs for reviews the member has written for the film in the order they were added, with most recent
   * reviews first.
   */
  reviews: string[];

  /**
   * Will be `true` if the member has indicated they've seen the film (via the ‘eye' icon) or has a log entry for the
   * film.
   */
  watched: boolean;

  /**
   * If `inWatchlist=true`, `whenAddedToWatchlist` will contain the time when the member added the film to their
   * watchlist. ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenAddedToWatchlist?: string;

  /**
   * If the member used to have the film in their watchlist, and subsequently watched the film,
   * `whenCompletedInWatchlist` will contain the time when the member marked the film as watched. ISO 8601 format with
   * UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCompletedInWatchlist?: string;

  /**
   * If `liked=true`, `whenLiked` will contain the time when the member marked the film as liked. ISO 8601 format with
   * UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenLiked?: string;

  /**
   * If `watched=true`, `whenWatched` will contain the time when the member marked the film as
   * watched. ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenWatched?: string;
}

export interface FilmRelationshipUpdateMessage {
  /**
   * The error message code.
   */
  code: 'InvalidRatingValue' | 'UnableToRemoveWatch';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

/**
 * When `PATCH`ing a film relationship, you may send all of the current property values, or just those you wish to
 * change. Properties that violate business rules (see `watched` below) or contain invalid values will be ignored.
 *
 */
export interface FilmRelationshipUpdateRequest {
  /**
   * Set to `true` to add the film to the authenticated member's watchlist, or `false` to remove it.
   */
  inWatchlist?: boolean;

  /**
   * Set to `true` to change the film's status for the authenticated member to ‘liked' or `false` for ‘not liked'.
   */
  liked?: boolean;

  /**
   * Accepts values between `0.5` and `5.0`, with increments of `0.5`, or `null` (to remove therating). If set,
   * `watched` is assumed to be `true`.
   */
  rating?: number | null;

  /**
   * Set to `true` to change the film's status for the authenticated member to ‘watched' or `false` for ‘not watched'.
   * If the status is changed to ‘watched' and the film is in the member's watchlist, it will be removed as part of this
   * action. You may not change the status of a film to ‘not watched' if there is existing activity (a rating, review or
   *  diary entry) for the authenticated member—check the messages returned from this endpoint to ensure no such
   * business rules have been violated.
   */
  watched?: boolean;
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
  itemCount?: number;

  /**
   * The list of films.
   */
  items: FilmSummary[];
}

/**
 * @inherits AbstractSearchItem
 */
export interface FilmSearchItem {
  /**
   * The film returned by the search.
   */
  film?: FilmSummary;
}

export interface FilmServicesResponse {
  /**
   * The list of film services.
   */
  items?: Service[];
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
   * The number of films that match the filter for this request.
   */
  filteredFilmCount: number;

  /**
   * The total number of films.
   */
  totalFilmCount: number;
}

export interface FilmsRelationship {
  /**
   * The number of watches and likes for the films.
   */
  counts: FilmsRelationshipCounts;
}

export interface FilmsRelationshipCounts {
  /**
   * The number of films the member has indicated they liked.
   */
  likes: number;

  /**
   * The number of films the member has indicated they've seen (via the ‘eye' icon) or has a log entry for.
   */
  watches: number;
}

export interface FilmsResponse {
  itemCount?: number;

  /**
   * The list of films.
   */
  items: FilmSummary[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface FilmStatistics {
  /**
   * The number of watches, ratings, likes, etc. for the film.
   */
  counts: FilmStatisticsCounts;

  /**
   * The film for which statistics were requested.
   */
  film: FilmIdentifier;

  /**
   * A summary of the number of ratings at each increment between `0.5` and `5.0`.
   */
  rating?: number;

  /**
   * A summary of the number of ratings at each increment between `0.5` and `5.0`.
   */
  ratingsHistogram?: RatingsHistogramBar[];
}

export interface FilmStatisticsCounts {
  /**
   * The number of members who have the film as one of their four favorites.
   */
  fans: number;

  /**
   * The number of members who have liked the film.
   */
  likes: number;

  /**
   * The number of lists in which the film appears.
   */
  lists: number;

  /**
   * The number of members who have rated the film.
   */
  ratings: number;

  /**
   * The number of reviews for the film.
   */
  reviews: number;

  /**
   * The number of members who have watched the film.
   */
  watches: number;
}

export interface FilmSummary {
  /**
   * `true` if the film is in TMDb's ‘Adult' category.
   */
  adult: boolean;

  /**
   * The film's unobfuscated poster image (2:3 aspect ratio in multiple sizes), only populated if the `adult` flag is
   * `true`, may contain adult content.
   */
  adultPoster?: Image;

  /**
   * The other names by which the film is known (including alternative titles and/or foreign translations).
   * @private
   */
  alternativeNames?: string[];

  /**
   * The list of directors for the film.
   */
  directors: ContributorSummary[];

  /**
   * The LID of the collection containing this film.
   */
  filmCollectionId?: string;

  /**
   * The film's genres.
   */
  genres: Genre[];

  /**
   * The LID of the film.
   */
  id: string;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The title of the film.
   */
  name: string;

  /**
   * The original title of the film, if it was first released with a non-English title.
   * @private
   */
  originalName?: string;

  /**
   * The film's poster image (2:3 aspect ratio in multiple sizes). Will contain only a single obfuscated image if the
   * `adult` flag is `true`.
   */
  poster?: Image;

  /**
   * `true` if the poster for this film can be customised by any member.
   */
  posterCustomisable: boolean;

  /**
   * The weighted average rating of the film between `0.5` and `5.0`. Only available for films that have received
   * sufficient ratings.
   */
  rating?: number;

  /**
   * Relationships to the film for the authenticated member (if any) and other members where relevant.
   */
  relationships?: MemberFilmRelationship[];

  /**
   * The year in which the film was first released.
   */
  releaseYear?: number;

  /**
   * `true` if reviews for the film are hidden due to a high volume of moderation traffic.
   */
  reviewsHidden: boolean;

  /**
   * The film's duration (in minutes).
   */
  runTime?: number;

  /**
   * A modified version of the name that has been normalized for consistent sorting.
   */
  sortingName: string;

  /**
   * The film's position in the official Letterboxd Top 250 list of narrative feature films, `null` if the film is not
   * in the list.
   */
  top250Position?: number;
}

export interface FilmTrailer {
  /**
   * The YouTube ID of the trailer.
   */
  id: string;

  /**
   * The YouTube URL for the trailer.
   */
  url: string;
}

/**
 * @inherits AbstractActivity
 */
export interface FilmWatchActivity {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who added the activity.
   */
  film?: FilmSummary;
}

export enum FilmWhereClause {
  Customised = 'Customised',
  FeatureLength = 'FeatureLength',
  Fiction = 'Fiction',
  Film = 'Film',
  InWatchlist = 'InWatchlist',
  Liked = 'Liked',
  Logged = 'Logged',
  NotCustomised = 'NotCustomised',
  NotFeatureLength = 'NotFeatureLength',
  NotInWatchlist = 'NotInWatchlist',
  NotLiked = 'NotLiked',
  NotLogged = 'NotLogged',
  NotOwned = 'NotOwned',
  NotRated = 'NotRated',
  NotReleased = 'NotReleased',
  NotReviewed = 'NotReviewed',
  NotRewatched = 'NotRewatched',
  NotWatched = 'NotWatched',
  Owned = 'Owned',
  Rated = 'Rated',
  Released = 'Released',
  Reviewed = 'Reviewed',
  Rewatched = 'Rewatched',
  TV = 'TV',
  Watched = 'Watched',
  WatchedFromWatchlist = 'WatchedFromWatchlist',
}

/**
 * @inherits AbstractActivity
 */
export interface FollowActivity {
  /**
   * A summary of the member that was followed.
   */
  followed?: MemberSummary;
}

export interface ForgottenPasswordRequest {
  emailAddress?: string;
}

export interface FriendFilmRelationshipsResponse {
  itemCount?: number;

  /**
   * The list of film relationships for members.
   */
  items: MemberFilmViewingRelationship[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;

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
  items?: Genre[];
}

export interface GoogleBillingSubscriptionMessage {
  /**
   * The error message code.
   */
  code: 'SubscriptionAlreadyExpired' | 'SubscriptionBelongsToAnotherMember' | 'UnexpectedError';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface GoogleBillingSubscriptionRequest {
  /**
   * The package name.
   */
  packageName: string;

  /**
   * The purchase token.
   */
  purchaseToken: string;

  /**
   * The subscription ID.
   */
  subscriptionId: string;
}

export interface GoogleBillingSubscriptionResponse {
  /**
   * The response object.
   */
  data: AGoogleBillingSubscription;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: GoogleBillingSubscriptionMessage[];
}

export interface Image {
  /**
   * The available sizes for the image.
   */
  sizes: ImageSize[];
}

export interface ImageSize {
  /**
   * The image height in pixels.
   */
  height: number;

  /**
   * The URL to the image file.
   */
  url: string;

  /**
   * The image width in pixels.
   */
  width: number;
}

export enum IncludeFriends {
  All = 'All',
  None = 'None',
  Only = 'Only',
}

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
  items?: Language[];
}

export interface Link {
  /**
   * The optional check url.
   */
  checkUrl?: string;

  /**
   * The object ID for the linked entity on the destination site.
   */
  id: string;

  /**
   * The optional label for the link, may be empty or missing.
   */
  label?: string;

  /**
   * Denotes which site the link is for.
   */
  type:
    | 'boxd'
    | 'facebook'
    | 'imdb'
    | 'instagram'
    | 'justwatch'
    | 'letterboxd'
    | 'tickets'
    | 'tiktok'
    | 'tmdb'
    | 'twitter'
    | 'youtube';

  /**
   * The fully qualified URL on the destination site.
   */
  url: string;
}

export interface List {
  /**
   * The list's backdrop image at multiple sizes, sourced from the first film in the list, if available. Only returned
   * for [Patron](https://letterboxd.com/patrons/) members.
   */
  backdrop?: Image;

  /**
   * The vertical focal point of the list's backdrop image, if available. Expressed as a proportion of the image's
   * height, using values between `0.0` and `1.0`. Use when cropping the image into a shorter space, such as in the
   * page for a film on the Letterboxd site.
   */
  backdropFocalPoint?: number;

  /**
   * The list this was cloned from, if applicable.
   */
  clonedFrom?: ListIdentifier;

  /**
   * The policy determining who can post comments to the list. `You` in this context refers to the content owner. Use
   * the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to comment
   * (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * The list description formatted as HTML.
   */
  description?: string;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`.
   */
  descriptionLbml?: string;

  /**
   * The number of films in the list.
   */
  filmCount: number;

  /**
   * Will be `true` if the owner has added notes to any entries.
   */
  hasEntriesWithNotes: boolean;

  /**
   * The LID of the list.
   */
  id: string;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * The name of the list.
   */
  name: string;

  /**
   * The member who created the list.
   */
  owner: MemberSummary;

  /**
   * The first 12 entries in the list. To fetch more than 12 entries, and to fetch the entry notes, use the
   * `/list/{id}/entries` endpoint.
   */
  previewEntries: ListEntrySummary[];

  /**
   * Will be `true` if the owner has elected to publish the list for other members to see.
   */
  published: boolean;

  /**
   * Will be `true` if the owner has elected to make this a ranked list.
   */
  ranked: boolean;

  /**
   * The policy determining who has access to the list.
   */
  sharePolicy: SharePolicy;

  /**
   * Use `tags2` instead.
   * @see tags2
   */
  tag?: string[];

  /**
   * The tags for the list.
   */
  tags2: Tag[];

  /**
   * The list version, used to avoid editing collisions.
   */
  version?: number;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenPublished?: string;
}

/**
 * @inherits AbstractActivity
 */
export interface ListActivity {
  /**
   * The list that was cloned, if applicable
   */
  clonedFrom?: ListSummary;

  /**
   * The list associated with the activity.
   */
  list?: ListSummary;
}

export interface ListAdditionRequest {
  /**
   * Specify the LIDs of films to be added to each of the specified lists.
   */
  films?: string[];

  /**
   * Specify the LIDs of lists to be added to.
   */
  lists?: string[];
}

export interface ListAdditionResponse {
  /**
   * The list of additions to each list.
   */
  items: AListAddition[];
}

/**
 * @inherits AbstractComment
 */
export interface ListComment {
  /**
   * If the list owner has blocked the commenter, `blockedByOwner` will be `true` and comment will not be included.
   */
  blockedByOwner?: boolean;

  /**
   * The list on which the comment was posted.
   */
  list?: ListIdentifier;
}

/**
 * @inherits AbstractActivity
 */
export interface ListCommentActivity {
  /**
   * The comment associated with the activity.
   */
  comment?: ListComment;

  /**
   * The list associated with the activity.
   */
  list?: ListSummary;
}

export interface ListCommentsResponse {
  itemCount?: number;

  /**
   * The list of comments.
   */
  items: ListComment[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface ListCreateMessage {
  /**
   * The error message code.
   */
  code:
    | 'CannotSharePrivateList'
    | 'CloneSourceNotFound'
    | 'DuplicateRank'
    | 'EmptyPublicList'
    | 'InvalidRatingValue'
    | 'ListDescriptionIsTooLong'
    | 'ListEntryNotesTooLong'
    | 'ListNameIsBlank'
    | 'ListNameTooLong'
    | 'SharingServiceNotAuthorized'
    | 'UnknownFilmCode';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
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
   * The LID of a list to clone from. This property is deprecated, use `clonedList` instead. Only supported for paying
   * members.
   * @deprecated
   * @see clonedList
   */
  clonedFrom?: string;

  /**
   * The LID of a list to clone entries from. Only supported for paying members.
   */
  clonedList?: string;

  /**
   * The policy determining who can post comments to the list. `You` in this context refers to the content owner. Use
   * the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to comment
   * (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  description?: string;

  /**
   * The update actions used to build the list. If `clonedList` is set the entries from that list are first added and
   * then these updates are applied.
   */
  entries?: ListUpdateEntryForm[];

  /**
   * The name of the list.
   */
  name: string;

  /**
   * Set to `true` if the owner has elected to publish the list for other members to see.
   */
  published: boolean;

  /**
   * Set to `true` if the owner has elected to make this a ranked list.
   */
  ranked: boolean;

  /**
   * The policy determining who has access to the list.
   */
  sharePolicy?: SharePolicy;

  /**
   * The tags for the list.
   */
  tags?: string[];
}

export interface ListEntriesResponse {
  itemCount?: number;

  /**
   * The list of entries.
   */
  items: ListEntry[];

  /**
   * The filtered and total count of films in the list.
   */
  metadata: FilmsMetadata;

  /**
   * The cursor to the next page of results.
   */
  next?: string;

  /**
   * The relationships to the films in the list for the members referenced in the request.
   */
  relationships: FilmsMemberRelationship[];
}

export interface ListEntry {
  /**
   * Will be `true` if the member has indicated that the `notes` field contains plot spoilers for the film.
   */
  containsSpoilers?: boolean;

  /**
   * A unique ID for this entry in the list.
   */
  entryId: string;

  /**
   * The film for this entry. Includes a `MemberFilmRelationship` for the member who created the list.
   */
  film: FilmSummary;

  /**
   * The notes for the list entry formatted as HTML.
   */
  notes?: string;

  /**
   * The notes for the list entry in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`.
   */
  notesLbml?: string;

  /**
   * The custom poster picker URL.
   * @private
   */
  posterPickerUrl?: string;

  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1.
   */
  rank?: number;
}

export interface ListEntryOccurrence {
  /**
   * The film LID for this entry.
   */
  filmId: string;

  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1.
   */
  rank: number;
}

export interface ListEntrySummary {
  /**
   * The film for this entry.
   */
  film: FilmSummary;

  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1.
   */
  rank?: number;
}

export interface ListIdentifier {
  /**
   * The LID of the list.
   */
  id: string;
}

/**
 * @inherits AbstractActivity
 */
export interface ListLikeActivity {
  /**
   * The list associated with the activity.
   */
  list?: ListSummary;
}

export enum ListMemberRelationship {
  Accessed = 'Accessed',
  Liked = 'Liked',
  Owner = 'Owner',
}

export interface ListRelationship {
  /**
   * The authenticated member's state with respect to posting comments to the list.
   *
   * `Banned` means the Letterboxd community managers have restricted the member's ability to post comments.
   *
   * `Blocked` means the owner has blocked the member from posting comments.
   *
   * `BlockedThem` means the member has blocked the owner and is therefore unable to post comments.
   *
   * `CanComment` means the authenticated member is authorized to post a comment (also known as a "reply"). All other
   * values mean the authenticated member is not authorized to post a comment.
   *
   * `Closed` means the owner has closed the comment thread to all other members.
   *
   * `FriendsOnly` means the owner is only accepting comments from members they follow.
   *
   * `Moderated` means the Letterboxd community managers have removed the content (applies to reviews only).
   *
   * `NotCommentable` means that comments may not be posted to this thread.
   *
   * `NotValidated` means the owner has not validated their email address.
   */
  commentThreadState: CommentThreadState;

  /**
   * Will be `true` if the member likes the list (via the ‘heart' icon). A member may not like their own list.
   */
  liked: boolean;

  /**
   * Will be `true` if the member is subscribed to comment notifications for the list
   */
  subscribed: boolean;

  /**
   * Defaults to `Subscribed` for the list's owner, and `NotSubscribed` for other members. The subscription value may
   * change when a member (other than the owner) posts a comment, as follows: the member will become automatically
   * `Subscribed` unless they have previously `Unsubscribed` from the comment thread via the web interface or API, or
   * unless they have disabled comment notifications in their account settings.
   *
   * `NotSubscribed` and `Unsubscribed` are maintained as separate states so the UI can, if needed, indicate to the
   * member how their subscription state will be affected if/when they post a comment.
   */
  subscriptionState: CommentSubscriptionState;
}

export interface ListRelationshipUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'LikeBlockedContent'
    | 'LikeOwnList'
    | 'LikeRateLimit'
    | 'SubscribeToBlockedContent'
    | 'SubscribeToContentYouBlocked'
    | 'SubscribeWhenOptedOut';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface ListRelationshipUpdateRequest {
  /**
   * Set to `true` if the member likes the list (via the ‘heart' icon). A member may not like their own list.
   */
  liked?: boolean | null;

  /**
   * Set to `true` to subscribe the member to comment notifications for the list, or `false` to unsubscribe them. A
   * value of `true` will be ignored if the member has disabled comment notifications in their account settings.
   */
  subscribed?: boolean | null;
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

/**
 * @inherits AbstractSearchItem
 */
export interface ListSearchItem {
  /**
   * The list.
   */
  list?: ListSummary;
}

export interface ListsResponse {
  itemCount?: number;

  /**
   * The list of lists.
   */
  items: ListSummary[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface ListStatistics {
  /**
   * The number of comments and likes for the list.
   */
  counts: ListStatisticsCounts;

  /**
   * The list for which statistics were requested.
   */
  list: ListIdentifier;
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
   * The list this was cloned from, if applicable.
   */
  clonedFrom?: ListIdentifier;

  /**
   * The list description formatted as HTML. The text is a preview extract, and may be truncated if it's too long.
   */
  description?: string;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`. The text is a preview extract, and may be truncated if it's too long.
   */
  descriptionLbml?: string;

  /**
   * Will be `true` if the list description was truncated because it's very long.
   */
  descriptionTruncated?: boolean;

  /**
   * Returned when one or more `filmsOfNote` is specified in the request. Contains, for each list in the response, the
   * rank position of each film of note (if in the list) or -1 (if not).
   */
  entriesOfNote?: ListEntryOccurrence[];

  /**
   * The number of films in the list.
   */
  filmCount: number;

  /**
   * The LID of the list.
   */
  id: string;

  /**
   * The name of the list.
   */
  name: string;

  /**
   * The member who created the list.
   */
  owner: MemberSummary;

  /**
   * The first 12 entries in the list. To fetch more than 12 entries, and to fetch the entry notes, use the
   * `/list/{id}/entries` endpoint.
   */
  previewEntries: ListEntrySummary[];

  /**
   * Will be `true` if the owner has elected to publish the list for other members to see.
   */
  published: boolean;

  /**
   * Will be `true` if the owner has elected to make this a ranked list.
   */
  ranked: boolean;

  /**
   * The policy determining who has access to the list.
   */
  sharePolicy: SharePolicy;

  /**
   * The list version, used to avoid editing collisions.
   */
  version?: number;
}

export interface ListUpdateEntry {
  /**
   * The update action to take. If not set then any existing entry for the film will be updated, if there is no existing
   * entry for the film it will be added into the list.
   */
  action?:
    | 'ADD'
    | 'CLEAR'
    | 'DELETE'
    | 'SORT_AVR_RATING_HIGHEST'
    | 'SORT_AVR_RATING_LOWEST'
    | 'SORT_DIARY_NEWEST'
    | 'SORT_DIARY_OLDEST'
    | 'SORT_LENGTH_LONGEST'
    | 'SORT_LENGTH_SHORTEST'
    | 'SORT_NAME'
    | 'SORT_RATING_HIGHEST'
    | 'SORT_RATING_LOWEST'
    | 'SORT_RELEASE_NEWEST'
    | 'SORT_RELEASE_OLDEST'
    | 'UPDATE';

  /**
   * Set to `true` if the member has indicated that the notes field contains plot spoilers for the film.
   */
  containsSpoilers?: boolean;

  /**
   * The LID of the film. Required for ADD actions.
   */
  film?: string;

  /**
   * The new entry position (numbered from 0) for the updated or added entry. If not set, the entry will stay in the
   * same place (for UPDATE actions) or be appended to the end of the list (for ADD actions).
   */
  newPosition?: number;

  /**
   * The notes for the list entry in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  notes?: string;

  /**
   * The entry position (numbered from 0) to update or delete. Required for UPDATE and DELETE actions.
   */
  position?: number;

  /**
   * If the list is ranked, this is the entry's rank in the list, numbered from 1. If not set, the entry will stay in
   * the same place (if already in the list) or be appended to the end of the list (if not in the list). If set, any
   * entries at or after this position will be incremented by one. Sending two or more `ListUpdateEntrys` with the same
   * rank will return an error. This property has been deprecated in favour of newPosition. Note that rank is numbered
   * from 1 whereas newPosition is numbered from 0.
   * @deprecated
   */
  rank?: number;
}

export interface ListUpdateEntryForm {
  action?:
    | 'ADD'
    | 'CLEAR'
    | 'DELETE'
    | 'SORT_AVR_RATING_HIGHEST'
    | 'SORT_AVR_RATING_LOWEST'
    | 'SORT_DIARY_NEWEST'
    | 'SORT_DIARY_OLDEST'
    | 'SORT_LENGTH_LONGEST'
    | 'SORT_LENGTH_SHORTEST'
    | 'SORT_NAME'
    | 'SORT_RATING_HIGHEST'
    | 'SORT_RATING_LOWEST'
    | 'SORT_RELEASE_NEWEST'
    | 'SORT_RELEASE_OLDEST'
    | 'UPDATE';
  containsSpoilers?: boolean;
  film?: string;

  newPosition?: number;

  notes?: string;

  position?: number;

  rank?: number;
}

export interface ListUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'CannotSharePrivateList'
    | 'DuplicateEntry'
    | 'DuplicateRank'
    | 'EmptyPublicList'
    | 'InvalidEntry'
    | 'InvalidRatingValue'
    | 'ListDescriptionIsTooLong'
    | 'ListEntryNotesTooLong'
    | 'ListModerated'
    | 'ListNameIsBlank'
    | 'ListNameTooLong'
    | 'ListVersionMismatch'
    | 'MissingEntry'
    | 'SharingServiceNotAuthorized'
    | 'UnknownFilmCode';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface ListUpdateRequest {
  /**
   * The policy determining who can post comments to the list. `You` in this context refers to the content owner. Use
   * the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to comment
   * (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * The list description in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  description?: string;

  /**
   * The specified entries will be inserted/appended to the list if they are not already present, or updated if they
   * are present.
   */
  entries?: ListUpdateEntry[];

  /**
   * Specify the LIDs of films to be removed from the list.
   */
  filmsToRemove?: string[];

  /**
   * The name of the list.
   */
  name?: string;

  /**
   * Set to `true` if the owner has elected to publish the list for other members to see.
   */
  published?: boolean;

  /**
   * Set to `true` if the owner has elected to make this a ranked list.
   */
  ranked?: boolean;

  /**
   * The policy determining who has access to the list.
   */
  sharePolicy?: SharePolicy;

  /**
   * The tags for the list.
   */
  tags?: string[];

  /**
   * The list version, used to avoid editing collisions.
   */
  version?: number;
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

export enum ListWhereClause {
  Clean = 'Clean',
  Customized = 'Customized',
  NotPublished = 'NotPublished',
  NotPublishedOrShared = 'NotPublishedOrShared',
  Owned = 'Owned',
  Published = 'Published',
  SharedAnyone = 'SharedAnyone',
  SharedFriends = 'SharedFriends',
}

export interface LogEntriesResponse {
  itemCount?: number;

  /**
   * The list of log entries.
   */
  items: LogEntry[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface LogEntry {
  /**
   * The log entry's backdrop image at multiple sizes, sourced from the film being logged, if available. Only returned
   * for Patron members.
   */
  backdrop?: Image;

  /**
   * The vertical focal point of the log entry's backdrop image, if available. Expressed as a proportion of the image's
   * height, using values between `0.0` and `1.0`. Use when cropping the image into a shorter space, such as in the
   * page for a film on the Letterboxd site.
   */
  backdropFocalPoint?: number;

  /**
   * The policy determining who can post comments to the log entry. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to
   * comment (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * Will be `true` if comments can be posted to the log entry by the member. This is determined according to the
   * existence of review text and other factors such as the content owner's comment policy.
   */
  commentable: boolean;

  /**
   * Details about the log entry, if present.
   */
  diaryDetails?: DiaryDetails;

  /**
   * The film being logged. Includes a `MemberFilmRelationship` for the member who created the log entry.
   */
  film: FilmSummary;

  /**
   * The LID of the log entry.
   */
  id: string;

  /**
   * Will be `true` if the member likes the film (via the ‘heart' icon).
   */
  like: boolean;

  /**
   * A list of relevant URLs for this entity, on Letterboxd and external sites.
   */
  links: Link[];

  /**
   * A descriptive title for the log entry.
   */
  name: string;

  /**
   * The member who created the log entry.
   */
  owner: MemberSummary;

  /**
   * The custom poster picker URL.
   * @private
   */
  posterPickerUrl?: string;

  /**
   * The member's rating for the film. Allowable values are between `0.5` and `5.0`, with increments of `0.5`.
   */
  rating?: number;

  /**
   * Review details for the log entry, if present.
   */
  review?: Review;

  /**
   * @deprecated Use `tags2` instead.
   * @see tags2
   */
  tags?: string[];

  /**
   * The tags for the log entry.
   */
  tags2: Tag[];

  /**
   * The ad targeting values.
   * @private
   */
  targeting?: string[];

  /**
   * The timestamp of when the log entry was created, in ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCreated: string;

  /**
   * The timestamp of when the log entry was last updated, in ISO 8601 format with UTC timezone, i.e.
   * `YYYY-MM-DDThh:mm:ssZ`
   */
  whenUpdated: string;
}

export interface LogEntryCreationRequest {
  /**
   * The policy determining who can post comments to the log entry. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to
   * comment (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * Information about this log entry if adding to the member's diary.
   */
  diaryDetails?: LogEntryCreationRequestDiaryDetails;

  /**
   * The film being logged.
   */
  filmId: string;

  /**
   * Set to `true` if the member likes the review (via the ‘heart' icon). A member may not like their own review.
   */
  like?: boolean;

  /**
   * Allowable values are between `0.5` and `5.0`, with increments of `0.5`.
   */
  rating?: number;

  /**
   * Information about the review if adding a review.
   */
  review?: LogEntryCreationRequestReview;

  /**
   * The tags for the log entry.
   */
  tags?: string[];
}

export interface LogEntryCreationRequestDiaryDetails {
  /**
   * The date the film was watched, if specified, in ISO 8601 format, i.e. `YYYY-MM-DD`
   */
  diaryDate: string;

  /**
   * Set to `true` if the member has indicated (or it can be otherwise determined) that the member has seen the film
   * prior to this date.
   */
  rewatch?: boolean;
}

export interface LogEntryCreationRequestReview {
  /**
   * Set to `true` if the member has indicated that the `review` field contains plot spoilers forthe film.
   */
  containsSpoilers?: boolean;

  /**
   * The review text in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>` `<a href="">`
   * `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  text: string;
}

export interface LogEntrySummary {
  /**
   * Does this log entry specify a diary entry.
   */
  diaryEntry: boolean;

  /**
   * The LID of the log entry.
   */
  id: string;

  /**
   * The member's rating for this viewing of the film. Allowable values are between `0.5` and `5.0`, with increments of
   * `0.5`.
   */
  rating?: number;

  /**
   * Does this log entry contain a review.
   */
  review: boolean;
}

export interface LogEntryUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'InvalidDiaryDate'
    | 'InvalidRatingValue'
    | 'LogEntryWithNoReviewOrDiaryDetails'
    | 'ReviewIsTooLong'
    | 'ReviewWithNoText';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface LogEntryUpdateRequest {
  /**
   * The policy determining who can post comments to the log entry. `You` in this context refers to the content owner.
   * Use the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to
   * comment (or not).
   */
  commentPolicy?: CommentPolicy | null;

  /**
   * Information about this log entry if adding to the member's diary. Set to `null` to remove this log entry from the
   * diary.
   */
  diaryDetails?: DiaryDetails | null;

  /**
   * Set to `true` if the member likes the review (via the ‘heart' icon). A member may not like their own review.
   */
  like?: boolean | null;

  /**
   * Accepts values between `0.5` and `5.0`, with increments of `0.5`, or `null` (to remove the rating).
   */
  rating?: number | null;

  /**
   * Information about the review. Set to null to remove the review from this log entry.
   */
  review?: Review | null;

  /**
   * The tags for the log entry.
   */
  tags?: string[] | null;
}

export enum LogEntryWhereClause {
  Clean = 'Clean',
  Customised = 'Customised',
  FeatureLength = 'FeatureLength',
  Fiction = 'Fiction',
  Film = 'Film',
  HasDiaryDate = 'HasDiaryDate',
  HasReview = 'HasReview',
  InWatchlist = 'InWatchlist',
  Liked = 'Liked',
  Logged = 'Logged',
  NoSpoilers = 'NoSpoilers',
  NotCustomised = 'NotCustomised',
  NotFeatureLength = 'NotFeatureLength',
  NotInWatchlist = 'NotInWatchlist',
  NotLiked = 'NotLiked',
  NotLogged = 'NotLogged',
  NotOwned = 'NotOwned',
  NotRated = 'NotRated',
  NotReleased = 'NotReleased',
  NotReviewed = 'NotReviewed',
  NotRewatched = 'NotRewatched',
  NotWatched = 'NotWatched',
  Owned = 'Owned',
  Rated = 'Rated',
  Released = 'Released',
  Reviewed = 'Reviewed',
  Rewatched = 'Rewatched',
  TV = 'TV',
  Watched = 'Watched',
}

export interface LoginTokenResponse {
  /**
   * A single-use token for signing into the Letterboxd website.
   */
  token: string;
}

export interface Member {
  /**
   * The member's account status.
   * @deprecated
   */
  accountStatus: AccountStatus;

  /**
   * The member's avatar image at multiple sizes. Avatar images to not have an enforced aspect ratio, so should be
   * center-cropped to a square if they are not 1:1.
   */
  avatar?: Image;

  /**
   * The member's backdrop image at multiple sizes, sourced from the first film in the member's list of favorite films,
   * if available. Only returned for [Patron](https://letterboxd.com/patrons/) members.
   */
  backdrop?: Image;

  /**
   * The vertical focal point of the member's backdrop image, if available. Expressed as a proportion of the image's
   * height, using values between `0.0` and `1.0`. Use when cropping the image into a shorter space, such as in the
   * page for a film on the Letterboxd site.
   */
  backdropFocalPoint?: number;

  /**
   * The member's bio formatted as HTML.
   */
  bio?: string;

  /**
   * The member's bio in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>` `<a href="">`
   * `<blockquote>`.
   */
  bioLbml?: string;

  /**
   * The member's default policy determing who can post comments to their content. Supported options are `Anyone`,
   * `Friends` and `You`. `You` in this context refers to the content owner. Use the `commentThreadState` property of
   * the `ListRelationship` to determine the signed-in member's ability to comment (or not).
   * @deprecated
   */
  commentPolicy?: CommentPolicy;

  /**
   * A convenience method that returns the member's given name and family name concatenated with a space, if both are
   * set, or just their given name or family name, if one is set, or their username, if neither is set. Will never be
   * empty.
   */
  displayName: string;

  /**
   * The family name of the member.
   */
  familyName?: string;

  /**
   * A summary of the member's favorite films, up to a maximum of four.
   */
  favoriteFilms?: FilmSummary[];

  /**
   * A summary of the member's featured list. Only returned for HQ members.
   */
  featuredList?: ListSummary;

  /**
   * The given name of the member.
   */
  givenName?: string;

  /**
   * `true` if member should not be shown ads.
   * @deprecated
   */
  hideAds: boolean;

  /**
   * `true` if ads should not be shown on the member's content.
   */
  hideAdsInContent: boolean;

  /**
   * The LID of the member.
   */
  id: string;

  /**
   * A link to the member's profile page on the Letterboxd website.
   */
  links: Link[];

  /**
   * The member's location.
   */
  location?: string;

  /**
   * The member's account type.
   */
  memberStatus: MemberStatus;

  /**
   * The member's organisation type. Only returned for HQ members.
   */
  orgType?:
    | 'Association'
    | 'Educator'
    | 'Exhibitor'
    | 'Festival'
    | 'Genre'
    | 'Media_Publisher'
    | 'Podcast'
    | 'Product_Platform'
    | 'Single_Film'
    | 'Society'
    | 'Streamer'
    | 'Studio';

  /**
   * The film lists the member has pinned on their profile page, up to a maximum of two. Only returned for paying
   * members.
   */
  pinnedFilmLists?: ListSummary[];

  /**
   * The reviews the member has pinned on their profile page, up to a maximum of two. Only returned for paying members.
   */
  pinnedReviews?: LogEntry[];

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has elected to hide their watchlist from other
   * members.
   */
  privateWatchlist?: boolean;

  /**
   * The member's preferred pronoun. Use the [/members/pronouns](https://api-docs.letterboxd.com/#path--members-pronouns)
   * endpoint to request all available pronouns.
   */
  pronoun?: Pronoun;

  /**
   * A convenience method that returns the member's given name, if set, or their username. Will never be empty.
   */
  shortName: string;

  /**
   * A summary of the member's team members. Only returned for HQ members.
   */
  teamMembers?: MemberSummary[];

  /**
   * The member's Twitter username, if they have authenticated their account.
   */
  twitterUsername?: string;

  /**
   * The member's Letterboxd username. Usernames must be between 2 and 15 characters long and may only contain upper or
   * lowercase letters, numbers or the underscore (`_`) character.
   */
  username: string;

  /**
   * The member's website URL. URLs are not validated, so sanitizing may be required.
   */
  website?: string;
}

export interface MemberAccount {
  /**
   * The member's account status.
   */
  accountStatus?: AccountStatus;

  /**
   * The member's adult content policy determing whether or not they see adult content. Supported options are `Always`
   * or `Default`. `Default` means never show adult content.
   */
  adultContentPolicy?: 'Always' | 'Default';

  /**
   * The list of campaigns this account is involved in.
   */
  campaigns?: string[];

  /**
   * Indicates whether the member is able to change their app icon. Determined by Letterboxd based upon `memberStatus`.
   */
  canChangeAppIcon?: boolean;

  /**
   * Indicates whether the member is able to clone other members' lists. Determined by Letterboxd based upon
   * `memberStatus`.
   */
  canCloneLists?: boolean;

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has commenting privileges. Commenting is
   * disabled on new accounts until the member's `emailAddress` is validated. At present `canComment` is synonymous
   * with `emailAddressValidated` (unless the member is `suspended`) but this may change in future.
   */
  canComment?: boolean;

  /**
   * Indicates whether the member is able to filter activity by type. Determined by Letterboxd based upon
   * `memberStatus`.
   */
  canFilterActivity?: boolean;

  /**
   * Indicates whether the member is able to customise film posters. Determined by Letterboxd based upon `memberStatus`.
   */
  canHaveCustomPosters?: boolean;

  /**
   * Indicates whether the member is able to see likes and comments on stories.
   */
  canSeeStoryLikesComments?: boolean;

  /**
   * The member's default policy determing who can post comments to their content. Supported options are `Anyone`,
   * `Friends` and `You`. `You` in this context refers to the content owner. Use the `commentThreadState` property of
   * the `ListRelationship` to determine the signed-in member's ability to comment (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * The list of device IDs that may receive push notifications for this account.
   */
  devicesRegisteredForPushNotifications?: string[];

  /**
   * The member's email address.
   */
  emailAddress?: string;

  /**
   * Will be `true` if the member has validated their `emailAddress` via an emailed link.
   */
  emailAddressValidated?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an email notification
   * when films on their watchlist become available to stream on one of their favorite services.
   */
  emailAvailability?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive the 'Best In Show'
   * newsletter from Letterboxd.
   */
  emailBestInShow?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an email notification
   * when films on their watchlist become available to buy on one of their favorite services.
   */
  emailBuyAvailability?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive email notifications when
   * new comments are posted in threads they are subscribed to.
   */
  emailComments?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive personalized suggestions
   * for Letterboxd editorial content.
   */
  emailEditorial?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive email notifications for
   * individual activity only from members they follow.
   */
  emailFromFollowedOnly?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive regular email news
   * (including ‘Call Sheet') from Letterboxd.
   */
  emailNews?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive offers from trusted
   * partners via Letterboxd.
   */
  emailPartnerMessages?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an email notification
   * when films on their watchlist become available to rent on one of their favorite services.
   */
  emailRentAvailability?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive a weekly email digest of
   * new and popular content (called ‘Rushes').
   */
  emailRushes?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive the ‘Shelf Life'
   * newsletter from Letterboxd.
   */
  emailShelfLife?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive an email notification
   * when another member follows them.
   */
  emailWhenFollowed?: boolean;

  /**
   * Indicates whether the member has an active subscription that will auto-renew. Will return `false` for members who
   * did subscribe and then set their subscription to no longer renew, even if the original subscription period has not
   * yet expired.
   */
  hasActiveSubscription?: boolean;

  /**
   * `true` if member should not be shown ads.
   */
  hideAds?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to appear in the People section of
   * the Letterboxd website.
   */
  includeInPeopleSection?: boolean;

  /**
   * Standard member details.
   */
  member: Member;

  /**
   * The number of days the member has left in their subscription. Only returned for paying members.
   */
  membershipDaysRemaining?: number;

  /**
   * Indicates whether the member's subscription is expected to auto-renew. *Only returned for members who have
   * subscribed through IAP.*
   */
  membershipWillAutoRenewViaIAP?: boolean;

  /**
   * The member's poster mode determing whether or not they see custom posters. Supported options are `All`, `Yours` or
   * `None`.
   */
  posterMode?: PosterMode;

  /**
   * The list of acceptable values that may be used for poster mode for this account
   */
  posterModeOptions?: PosterMode[];

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has elected for their content to appear in the
   * API (other than in the /me endpoint).
   */
  privateAccount?: boolean;

  /**
   * Defaults to `false` for new accounts. Indicates whether the member has elected to hide their watchlist from other
   * members.
   *
   * @deprecated Found in `member` instead.
   * @see member
   */
  privateWatchlist?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * films on a members watchlist become available to stream on one of their favorite services.
   */
  pushNotificationsForAvailability?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * films on a members watchlist become available to buy on one of their favorite services.
   */
  pushNotificationsForBuyAvailability?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * new comments are posted in threads they are subscribed to.
   */
  pushNotificationsForComments?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications for
   * platform and account alerts.
   */
  pushNotificationsForGeneralAnnouncements?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * another member likes one of their lists.
   */
  pushNotificationsForListLikes?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * another member follows them.
   */
  pushNotificationsForNewFollowers?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications with
   * offers from trusted partners.
   */
  pushNotificationsForPartnerMessages?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * films on a members watchlist become available to rent on one of their favorite services.
   */
  pushNotificationsForRentAvailability?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * another member likes one of their reviews.
   */
  pushNotificationsForReviewLikes?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications when
   * another member likes one of their stories.
   */
  pushNotificationsForStoryLikes?: boolean;

  /**
   * Defaults to `true` for new accounts. Indicates whether the member has elected to receive push notifications for
   * individual activity only from members they follow.
   */
  pushNotificationsFromFollowedOnly?: boolean;

  /**
   * `true` if member should be shown ads for custom posters.
   */
  showCustomPostersAds?: boolean;

  /**
   * Indicates the member's subscription type, possible values are `apple`, `google` or `paddle`. Only returned for
   * members who have an active subscription.
   */
  subscriptionType?: string;

  /**
   * Indicates whether the member is suspended from commenting due to a breach of the
   * [Community Policy](https://letterboxd.com/legal/community-policy/).
   */
  suspended?: boolean;

  /**
   * Will be `true` if the member has enabled two-factor authentication.
   */
  twoFactorAuthenticationEnabled?: boolean;
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
  itemCount?: number;

  /**
   * The list of film relationships for members.
   */
  items: MemberFilmRelationship[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface MemberFilmViewingRelationship {
  /**
   * The log entry for the film.
   */
  logEntry?: LogEntrySummary;

  /**
   * The member.
   */
  member: MemberSummary;

  /**
   * The relationship details.
   */
  relationship: FilmRelationship;
}

export interface MemberIdentifier {
  /**
   * The LID of the member.
   */
  id: string;
}

export interface MemberRelationship {
  /**
   * Will be `true` if the member identified by ID has blocked the authenticated member.
   */
  blockedBy: boolean;

  /**
   * Will be `true` if the authenticated member has blocked the member identified by ID.
   */
  blocking: boolean;

  /**
   * Will be `true` if the member identified by ID follows the authenticated member.
   */
  followedBy: boolean;

  /**
   * Will be `true` if the authenticated member follows the member identified by ID.
   */
  following: boolean;
}

export interface MemberRelationshipUpdateMessage {
  /**
   * The error message code.
   */
  code: 'BlockYourself' | 'FollowBlockedMember' | 'FollowMemberYouBlocked' | 'FollowRateLimit' | 'FollowYourself';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface MemberRelationshipUpdateRequest {
  /**
   * Set to `true` if the authenticated member wishes to block the member identified by ID, or `false` if they wish to
   * unblock. A member may not block their own account.
   */
  blocking?: boolean;

  /**
   * Set to `true` if the authenticated member wishes to follow the member identified by ID, or `false` if they wish to
   * unfollow. A member may not follow their own account, or the account of a member they have blocked or that has
   * blocked them.
   */
  following?: boolean;
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

/**
 * @inherits AbstractSearchItem
 */
export interface MemberSearchItem {
  /**
   * The member returned by the search.
   */
  member?: MemberSummary;
}

export interface MemberSettingsUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'BioTooLong'
    | 'BlankPassword'
    | 'EmailAddressInUse'
    | 'IncorrectCurrentPassword'
    | 'InvalidEmailAddress'
    | 'InvalidFavoriteFilm'
    | 'InvalidPassword'
    | 'InvalidPronounOption';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface MemberSettingsUpdateRequest {
  /**
   * The member's adult content policy determing whether or not they see adult content. Supported options are `Always`
   * or `Default`. `Default` means never show adult content.
   */
  adultContentPolicy?: string;

  /**
   * The member's current authentication code. Required when updating the password for users with two-factor
   * authentication enabled.
   */
  authenticationCode?: string;

  /**
   * The member's bio in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>` `<a href="">`
   * `<blockquote>`. This field has a maximum size of 100,000 characters.
   */
  bio?: string;

  /**
   * The member's default policy determing who can post comments to their content. Supported options are `Anyone`,
   * `Friends` and `You`. `You` in this context refers to the content owner. Use the `commentThreadState` property of
   * the `ListRelationship` to determine the signed-in member's ability to comment (or not).
   */
  commentPolicy?: string;

  /**
   * The member's current password. Required when updating the password.
   */
  currentPassword?: string;

  /**
   * The member's email address.
   */
  emailAddress?: string;

  emailAvailability?: boolean;

  /**
   * Set to `true` if the member wishes to receive the 'Best In Show' newsletter from Letterboxd.
   */
  emailBestInShow?: boolean;

  emailBuyAvailability?: boolean;

  /**
   * Set to `true` if the member wishes to receive email notifications when new comments are posted in threads they are
   * subscribed to.
   */
  emailComments?: boolean;

  /**
   * Set to `true` if the member wishes to receive personalized suggestions for Letterboxd editorial content.
   */
  emailEditorial?: boolean;

  /**
   * Set to `true` if the member wishes to receive email notifications for individual activity only from members they
   * follow.
   */
  emailFromFollowedOnly?: boolean;

  /**
   * Set to `true` if the member wishes to receive regular email news (including ‘Call Sheet') from Letterboxd.
   */
  emailNews?: boolean;

  /**
   * Set to `true` if the member wishes to receive offers from trusted partners via Letterboxd.
   */
  emailPartnerMessages?: boolean;

  emailRentAvailability?: boolean;

  /**
   * Set to `true` if the member wishes to receive a weekly email digest of new and popular content
   * (called ‘Rushes').
   */
  emailRushes?: boolean;

  /**
   * Set to `true` if the member wishes to receive the ‘Shelf Life' newsletter from Letterboxd.
   */
  emailShelfLife?: boolean;

  /**
   * Set to `true` if the member wishes to receive an email notification when another member follows them.
   */
  emailWhenFollowed?: boolean;

  /**
   * The family name of the member.
   */
  familyName?: string;

  /**
   * The LIDs of the member's favorite films, in order, up to a maximum of four.
   */
  favoriteFilms?: string[];

  /**
   * The given name of the member.
   */
  givenName?: string;

  /**
   * Set to `false` to remove the account from the [Members](https://letterboxd.com/members/) section of the Letterboxd
   * website.
   */
  includeInPeopleSection?: boolean;

  /**
   * The member's location.
   */
  location?: string;

  /**
   * The member's new password.
   */
  password?: string;

  /**
   * The member's poster mode determing whether or not they see custom posters. Supported options are `All`, `Yours` or
   * `None`.
   */
  posterMode?: string;

  /**
   * Set to `true` to prevent the member's content from appearing in API requests other than the
   * [/me](https://api-docs.letterboxd.com/#path--me) endpoint.
   */
  privateAccount?: boolean;

  /**
   * The LID of the member's preferred pronoun. Use the
   * [/members/pronouns](https://api-docs.letterboxd.com/#path--members-pronouns) endpoint to request all available
   * pronouns.
   */
  pronoun?: string;

  pushNotificationsForAvailability?: boolean;

  pushNotificationsForBuyAvailability?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when new comments are posted in threads they are
   * subscribed to.
   */
  pushNotificationsForComments?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications for platform and account alerts.
   */
  pushNotificationsForGeneralAnnouncements?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member likes one of their lists.
   */
  pushNotificationsForListLikes?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member follows them.
   */
  pushNotificationsForNewFollowers?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications with offers from trusted partners.
   */
  pushNotificationsForPartnerMessages?: boolean;

  pushNotificationsForRentAvailability?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member likes one of their reviews.
   */
  pushNotificationsForReviewLikes?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications when another member likes one of their stories.
   */
  pushNotificationsForStoryLikes?: boolean;

  /**
   * Set to `true` if the member wishes to receive push notifications for individual activity only from members they
   * follow.
   */
  pushNotificationsFromFollowedOnly?: boolean;

  /**
   * The member's website URL. URLs are not validated, so sanitizing may be required.
   */
  website?: string;
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
  itemCount?: number;

  /**
   * The list of members.
   */
  items: MemberSummary[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface MemberStatistics {
  /**
   * The number of watches, ratings, likes, etc. for the member.
   */
  counts: MemberStatisticsCounts;

  /**
   * The member for which statistics were requested.
   */
  member: MemberIdentifier;

  /**
   * A summary of the number of ratings the member has made for each increment between `0.5` and `5.0`. Returns only
   * the integer increments between `1.0` and `5.0` if the member never (or rarely) awards half-star ratings.
   */
  ratingsHistogram: RatingsHistogramBar[];

  /**
   * A list of years the member has year-in-review pages for. Only supported for paying members.
   */
  yearsInReview: number[];
}

export interface MemberStatisticsCounts {
  /**
   * The number of shared lists accessed by the member. Only included if the request is made for the authenticated
   * member.
   */
  accessedSharedLists?: number;

  /**
   * The number of entries the member has in their diary.
   */
  diaryEntries: number;

  /**
   * The number of entries the member has in their diary for the current year.
   */
  diaryEntriesThisYear: number;

  /**
   * The number of films the member has liked.
   */
  filmLikes: number;

  /**
   * The number of tags the member has used for diary entries and reviews.
   */
  filmTags: number;

  /**
   * The number of unique films the member has in their diary for the previous year. The year before the current year.
   */
  filmsInDiaryLastYear: number;

  /**
   * The number of unique films the member has in their diary for the current year.
   */
  filmsInDiaryThisYear: number;

  /**
   * The number of members who follow the member.
   */
  followers: number;

  /**
   * The number of members the member is following.
   */
  following: number;

  /**
   * The number of lists the member has liked.
   */
  listLikes: number;

  /**
   * The number of tags the member has used for lists.
   */
  listTags: number;

  /**
   * The number of lists for the member. Includes unpublished lists if the request is made for the authenticated member.
   */
  lists: number;

  /**
   * The number of films the member has rated.
   */
  ratings: number;

  /**
   * The number of reviews the member has liked.
   */
  reviewLikes: number;

  /**
   * The number of films the member has reviewed.
   */
  reviews: number;

  /**
   * The number of stories the member has liked.
   */
  storyLikes: number;

  /**
   * The number of unpublished lists for the member. Only included if the request is made for the authenticated member.
   */
  unpublishedLists?: number;

  /**
   * The number of films the member has watched. This is a distinct total — films with multiple log entries are only
   * counted once.
   */
  watches: number;

  /**
   * The number of films the member has in their watchlist.
   */
  watchlist: number;
}

export enum MemberStatus {
  Alum = 'Alum',
  Crew = 'Crew',
  Hq = 'Hq',
  Member = 'Member',
  Patron = 'Patron',
  Pro = 'Pro',
}

export interface MemberSummary {
  /**
   * The member's account status.
   * @deprecated
   */
  accountStatus: AccountStatus;

  /**
   * The member's avatar image at multiple sizes. Avatar images to not have an enforced aspect ratio, so should be
   * center-cropped to a square if they are not 1:1.
   */
  avatar?: Image;

  /**
   * The member's default policy determing who can post comments to their content. Supported options are `Anyone`,
   * `Friends` and `You`. `You` in this context refers to the content owner. Use the `commentThreadState` property of
   * the `ListRelationship` to determine the signed-in member's ability to comment (or not).
   * @deprecated
   */
  commentPolicy?: CommentPolicy;

  /**
   * A convenience method that returns the member's given name and family name concatenated with a space, if both are
   * set, or just their given name or family name, if one is set, or their username, if neither is set. Will never be
   * empty.
   */
  displayName: string;

  /**
   * The family name of the member.
   */
  familyName?: string;

  /**
   * The given name of the member.
   */
  givenName?: string;

  /**
   * `true` if member should not be shown ads.
   */
  hideAds: boolean;

  /**
   * `true` if ads should not be shown on the member's content.
   */
  hideAdsInContent: boolean;

  /**
   * The LID of the member.
   */
  id: string;

  /**
   * The member's account type.
   */
  memberStatus: MemberStatus;

  /**
   * The member's preferred pronoun. Use the [/members/pronouns](https://api-docs.letterboxd.com/#path--members-pronouns)
   * endpoint to request all available pronouns.
   */
  pronoun?: Pronoun;

  /**
   * A convenience method that returns the member's given name, if set, or their username. Will never be empty.
   */
  shortName: string;

  /**
   * The member's Letterboxd username. Usernames must be between 2 and 15 characters long and may only contain upper or
   * lowercase letters, numbers or the underscore (_) character.
   */
  username: string;
}

export interface MemberTag {
  /**
   * The tag code.
   */
  code: string;

  /**
   * Counts of the member's uses of this tag.
   */
  counts: MemberTagCounts;

  /**
   * The tag text as entered by the tagger.
   */
  displayTag: string;

  /**
   * Use `displayTag` instead.
   * @deprecated
   * @see displaTag
   */
  tag?: string;
}

export interface MemberTagCounts {
  /**
   * The number of diary entries the member has used this tag on.
   */
  diaryEntries: number;

  /**
   * The number of films the member has used this tag on.
   */
  films: number;

  /**
   * The number of lists the member has used this tag on.
   */
  lists: number;

  /**
   * The number of log entries the member has used this tag on.
   */
  logEntries: number;

  /**
   * The number of reviews the member has used this tag on.
   */
  reviews: number;
}

export interface MemberTagsResponse {
  itemCount?: number;

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
   * The podcast episode number, if this news item is for a podcast
   */
  episode?: number;

  /**
   * The image.
   */
  image?: Image;

  /**
   * A long description of the news item in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`.
   */
  longDescription?: string;

  /**
   * The podcast season number, if this news item is for a podcast
   */
  season?: number;

  /**
   * A short description of the news item in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>`
   * `<i>` `<a href="">` `<blockquote>`.
   */
  shortDescription?: string;

  /**
   * The title of the news item.
   */
  title: string;

  /**
   * The URL of the news item.
   */
  url: string;
}

export interface NewsResponse {
  itemCount?: number;

  /**
   * The list of news items.
   */
  items: NewsItem[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

/**
 * @inherits AbstractSearchItem
 */
export interface PodcastSearchItem {
  /**
   * The podcast.
   */
  podcast?: NewsItem;
}

export enum PosterMode {
  All = 'All',
  None = 'None',
  Theirs = 'Theirs',
  Yours = 'Yours',
}

export interface Pronoun {
  /**
   * The LID for this pronoun.
   */
  id: string;

  /**
   * A label to describe this pronoun.
   */
  label: string;

  /**
   * The pronoun to use when the member is the object.
   */
  objectPronoun: string;

  /**
   * The adjective to use when describing a specified thing or things belonging to or associated with a member
   * previously mentioned.
   */
  possessiveAdjective: string;

  /**
   * The pronoun to use when referring to a specified thing or things belonging to or associated with a member
   * previously mentioned.
   */
  possessivePronoun: string;

  /**
   * The pronoun to use to refer back to the member.
   */
  reflexive: string;

  /**
   * The pronoun to use when the member is the subject.
   */
  subjectPronoun: string;
}

export interface PronounsResponse {
  /**
   * The list of pronouns.
   */
  items?: Pronoun[];
}

export interface RatingsHistogramBar {
  /**
   * The number of ratings made at this increment.
   */
  count: number;

  /**
   * The height of this rating increment's entry in a unit-height histogram, normalized between `0.0` and `1.0`. The
   * increment(s) with the highest number of ratings will always return `1.0` (unless there are no ratings for the
   * film).
   */
  normalizedWeight: number;

  /**
   * The rating increment between `0.5` and `5.0`.
   */
  rating: number;
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
   * Set to `true` if the person creating the account has agreed to being at least 16 years of age, and to accepting
   * Letterboxd's [Terms of Use](https://letterboxd.com/terms-of-use/).
   */
  acceptTermsOfUse?: boolean;

  /**
   * The captcha response value
   */
  captchaResponse?: string;

  /**
   * The email address for the new account.
   */
  emailAddress?: string;

  /**
   * The password for the new account.
   */
  password?: string;

  /**
   * The username for the new account. Use the `/auth/username-check` endpoint to check availability.
   */
  username?: string;
}

export interface Release {
  /**
   * The film's certification for release.
   */
  certification?: string;

  /**
   * The country of release.
   */
  country: Country;

  /**
   * The language of release.
   */
  language?: Language;

  note?: string;

  /**
   * The release date, in ISO 8601 format, i.e. `YYYY-MM-DD`
   */
  releaseDate: string;

  /**
   * The type of release.
   */
  type: 'Digital' | 'Physical' | 'Premiere' | 'Theatrical_limited' | 'Theatrical' | 'TV';
}

export interface ReportCommentRequest {
  /**
   * An optional, explanatory message to accompany the report. Required if the reason is `Plagiarism` or `Other`.
   */
  message?: string;

  /**
   * The reason why the comment was reported.
   */
  reason: 'Abuse' | 'Other' | 'Plagiarism' | 'Spam' | 'Spoilers';
}

export interface ReportFilmRequest {
  /**
   * An optional, explanatory message to accompany the report. Required if the reason is `Duplicate` or `Other`.
   */
  message?: string;

  /**
   * The reason why the film was reported.
   */
  reason: 'Duplicate' | 'Image' | 'NotAFilm' | 'Other';
}

export interface ReportListRequest {
  /**
   * An optional, explanatory message to accompany the report. Required if the reason is `Plagiarism` or `Other`.
   */
  message?: string;

  /**
   * The reason why the list was reported.
   */
  reason: 'Abuse' | 'Other' | 'Plagiarism' | 'Spam' | 'Spoilers';
}

export interface ReportMemberRequest {
  /**
   * An optional, explanatory message to accompany the report. Required if the reason is `Other`.
   */
  message?: string;

  /**
   * The reason why the member was reported.
   */
  reason:
    | 'AbusiveAccount'
    | 'HatefulAccount'
    | 'ManipulativeAccount'
    | 'OffensiveAccount'
    | 'Other'
    | 'ParodyAccount'
    | 'PiracyAccount'
    | 'PlagiaristAccount'
    | 'SolicitousAccount'
    | 'SpamAccount';
}

export interface ReportReviewRequest {
  /**
   * An optional, explanatory message to accompany the report. Required if the reason is `Plagiarism` or `Other`.
   */
  message?: string;

  /**
   * The reason why the review was reported.
   */
  reason: 'Abuse' | 'Other' | 'Plagiarism' | 'Spam' | 'Spoilers';
}

export interface Review {
  /**
   * Will be `true` if the member has indicated that the review field contains plot spoilers for the film.
   */
  containsSpoilers: boolean;

  /**
   * The review text in LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>` `<a href="">`
   * `<blockquote>`.
   */
  lbml: string;

  /**
   * Will be `true` if the review has been removed by a moderator.
   */
  moderated: boolean;

  /**
   * Will be `true` if the spoilers flag has been locked by a moderator.
   */
  spoilersLocked: boolean;

  /**
   * The review text formatted as HTML.
   */
  text: string;

  /**
   * The timestamp when this log entry's review was first published, in ISO 8601 format with UTC timezone, i.e.
   * `YYYY-MM-DDThh:mm:ssZ`
   */
  whenReviewed: string;
}

/**
 * @inherits AbstractActivity
 */
export interface ReviewActivity {
  /**
   * The log entry associated with this activity
   */
  review?: LogEntry;
}

/**
 * @inherits AbstractComment
 */
export interface ReviewComment {
  /**
   * If the review owner has blocked the commenter, `blockedByOwner` will be true and `comment` will not be included.
   */
  blockedByOwner?: boolean;

  /**
   * The review on which the comment was posted.
   */
  review?: ReviewIdentifier;
}

/**
 * @inherits AbstractActivity
 */
export interface ReviewCommentActivity {
  /**
   * The comment associated with the activity.
   */
  comment?: ReviewComment;

  /**
   * The review associated with the activity.
   */
  review?: LogEntry;
}

export interface ReviewCommentsResponse {
  itemCount?: number;

  /**
   * The list of comments.
   */
  items: ReviewComment[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface ReviewIdentifier {
  /**
   * The LID of the log entry.
   */
  id: string;
}

/**
 * @inherits AbstractActivity
 */
export interface ReviewLikeActivity {
  /**
   * The review associated with the activity.
   */
  review?: LogEntry;
}

export enum ReviewMemberRelationship {
  Ignore = 'Ignore',
  Liked = 'Liked',
  Owner = 'Owner',
}

export interface ReviewRelationship {
  /**
   * The authenticated member's state with respect to adding comments for this review.
   *
   * `Banned` means the Letterboxd community managers have restricted the member's ability to post comments.
   *
   * `Blocked` means the owner has blocked the member from posting comments.
   *
   * `BlockedThem` means the member has blocked the owner and is therefore unable to post comments.
   *
   * `CanComment` means the authenticated member is authorized to post a comment (also known as a "reply"). All other
   * values mean the authenticated member is not authorized to post a comment.
   *
   * `Closed` means the owner has closed the comment thread to all other members.
   *
   * `FriendsOnly` means the owner is only accepting comments from members they follow.
   *
   * `Moderated` means the Letterboxd community managers have removed the content (applies to reviews only).
   *
   * `NotCommentable` means that comments may not be posted to this thread.
   *
   * `NotValidated` means the owner has not validated their email address.
   */
  commentThreadState: CommentThreadState;

  /**
   * Will be `true` if the member likes the review (via the ‘heart' icon). A member may not like their own review.
   */
  liked: boolean;

  /**
   * Will be `true` if the member is subscribed to comment notifications for the review
   */
  subscribed: boolean;

  /**
   * Defaults to` Subscribed` for the review's author, and `NotSubscribed` for other members. The subscription value
   * may change when a member (other than the owner) posts a comment, as follows: the member will become automatically
   * `Subscribed` unless they have previously `Unsubscribed` from the comment thread via the web interface or API, or
   * unless they have disabled comment notifications in their account settings.
   *
   * `NotSubscribed` and `Unsubscribed` are maintained as separate states so the UI can, if needed, indicate to the
   * member how their subscription state will be affected if/when they post a comment.
   */
  subscriptionState: CommentSubscriptionState;
}

export interface ReviewRelationshipUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'LikeBlockedContent'
    | 'LikeLogEntryWithoutReview'
    | 'LikeOwnReview'
    | 'LikeRateLimit'
    | 'LikeRemovedReview'
    | 'SubscribeToBlockedContent'
    | 'SubscribeToContentYouBlocked'
    | 'SubscribeWhenOptedOut';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface ReviewRelationshipUpdateRequest {
  /**
   * Set to `true` if the member likes the review (via the ‘heart' icon). A member may not like their own review.
   */
  liked?: boolean | null;

  /**
   * Set to `true` to subscribe the member to comment notifications for the review, or `false` to unsubscribe them. A
   * value of `true` will be ignored if the member has disabled comment notifications in their account settings.
   */
  subscribed?: boolean | null;
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

/**
 * @inherits AbstractActivity
 */
export interface ReviewResponseActivity {
  /**
   * The comment associated with the activity.
   */
  response?: string;

  /**
   * The review associated with the activity.
   */
  review?: LogEntry;
}

/**
 * @inherits AbstractSearchItem
 */
export interface ReviewSearchItem {
  /**
   * Details of the review.
   */
  review?: LogEntry;
}

export interface ReviewStatistics {
  /**
   * The number of comments and likes for the review.
   */
  counts: ReviewStatisticsCounts;

  /**
   * The log entry for which statistics were requested.
   */
  logEntry: ReviewIdentifier;
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
  itemCount?: number;

  /**
   * The list of search results.
   */
  items: AbstractSearchItem[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export enum SearchResultType {
  ArticleSearchItem = 'ArticleSearchItem',
  ContributorSearchItem = 'ContributorSearchItem',
  FilmSearchItem = 'FilmSearchItem',
  ListSearchItem = 'ListSearchItem',
  MemberSearchItem = 'MemberSearchItem',
  PodcastSearchItem = 'PodcastSearchItem',
  ReviewSearchItem = 'ReviewSearchItem',
  StorySearchItem = 'StorySearchItem',
  TagSearchItem = 'TagSearchItem',
}

export interface Service {
  /**
   * The URL of the thumbnail image for the service.
   */
  icon?: string;

  /**
   * The LID of the service.
   */
  id: string;

  /**
   * The name of the service.
   */
  name: string;
}

export enum SharePolicy {
  Anyone = 'Anyone',
  Friends = 'Friends',
  You = 'You',
}

export interface Shift72AuthResponse {
  authToken?: string;
}

export interface StoriesResponse {
  itemCount?: number;

  /**
   * The list of stories.
   */
  items: StorySummary[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface Story {
  /**
   * The member who published the story.
   */
  author: MemberSummary;

  /**
   * The story body formatted as HTML. The text is a preview extract, and may be truncated if it's too long.
   */
  bodyHtml?: string;

  /**
   * The story body formatted as LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`. The text is a preview extract, and may be truncated if it's too long.
   */
  bodyLbml?: string;

  /**
   * The policy determining who can post comments to the story. `You` in this context refers to the content owner. Use
   * the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to comment
   * (or not).
   */
  commentPolicy?: CommentPolicy;

  /**
   * The LID of the story.
   */
  id: string;

  /**
   * The story's hero image, in multiple resolutions.
   */
  image?: Image;

  /**
   * The name of the story.
   */
  name: string;

  /**
   * If this story has been pinned by its author, `pinned` will be true.
   */
  pinned: boolean;

  /**
   * The publication name for the story (if applicable).
   */
  source?: string;

  /**
   * The external URL linked to by the story (if applicable).
   */
  url?: string;

  /**
   * The URL of the story's video (if applicable).
   */
  videoUrl?: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenUpdated?: string;
}

/**
 * @inherits AbstractActivity
 */
export interface StoryActivity {
  /**
   * The story associated with the activity.
   */
  story?: StorySummary;
}

/**
 * @inherits AbstractComment
 */
export interface StoryComment {
  /**
   * If the story owner has blocked the commenter, `blockedByOwner` will be true and `comment` will not be included.
   */
  blockedByOwner?: boolean;

  /**
   * The story on which the comment was posted.
   */
  story?: StoryIdentifier;
}

/**
 * @inherits AbstractActivity
 */
export interface StoryCommentActivity {
  /**
   * The comment associated with the activity.
   */
  comment?: StoryComment;

  /**
   * The story associated with the activity.
   */
  story?: StorySummary;
}

export interface StoryCommentsResponse {
  itemCount?: number;

  /**
   * The list of comments.
   */
  items: StoryComment[];

  /**
   * The cursor to the next page of results.
   */
  next?: string;
}

export interface StoryIdentifier {
  /**
   * The LID of the story.
   */
  id: string;
}

/**
 * @inherits AbstractActivity
 */
export interface StoryLikeActivity {
  /**
   * The story associated with the activity.
   */
  story?: StorySummary;
}

export enum StoryMemberRelationship {
  Liked = 'Liked',
  Owner = 'Owner',
}

export interface StoryRelationship {
  /**
   * The authenticated member's state with respect to posting comments to the story.
   *
   * `Banned` means the Letterboxd community managers have restricted the member's ability to post comments.
   *
   * `Blocked` means the owner has blocked the member from posting comments.
   *
   * `BlockedThem` means the member has blocked the owner and is therefore unable to post comments.
   *
   * `CanComment` means the authenticated member is authorized to post a comment (also known as a "reply"). All other
   * values mean the authenticated member is not authorized to post a comment.
   *
   * `Closed` means the owner has closed the comment thread to all other members.
   *
   * `FriendsOnly` means the owner is only accepting comments from members they follow.
   *
   * `Moderated` means the Letterboxd community managers have removed the content (applies to reviews only).
   *
   * `NotCommentable` means that comments may not be posted to this thread.
   *
   * `NotValidated` means the owner has not validated their email address.
   */
  commentThreadState: CommentThreadState;

  /**
   * Will be `true` if the member likes the story (via the ‘heart' icon). A member may not like their own story.
   */
  liked: boolean;

  /**
   * Will be `true` if the member is subscribed to comment notifications for the story
   */
  subscribed: boolean;

  /**
   * Defaults to `Subscribed` for the story's owner, and `NotSubscribed` for other members. The subscription value may
   * change when a member (other than the owner) posts a comment, as follows: the member will become automatically
   * `Subscribed` unless they have previously `Unsubscribed` from the comment thread via the web interface or API, or
   * unless they have disabled comment notifications in their account settings.
   *
   * `NotSubscribed` and `Unsubscribed` are maintained as separate states so the UI can, if needed, indicate to the
   * member how their subscription state will be affected if/when they post a comment.
   */
  subscriptionState: CommentSubscriptionState;
}

export interface StoryRelationshipUpdateMessage {
  /**
   * The error message code.
   */
  code:
    | 'LikeBlockedContent'
    | 'LikeOwnStory'
    | 'LikeRateLimit'
    | 'SubscribeToBlockedContent'
    | 'SubscribeToContentYouBlocked'
    | 'SubscribeWhenOptedOut';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface StoryRelationshipUpdateRequest {
  /**
   * Set to `true` if the member likes the story (via the ‘heart' icon). A member may not like their own story.
   */
  liked?: boolean | null;

  /**
   * Set to `true` to subscribe the member to comment notifications for the story, or `false` to unsubscribe them. A
   * value of `true` will be ignored if the member has disabled comment notifications in their account settings.
   */
  subscribed?: boolean | null;
}

export interface StoryRelationshipUpdateResponse {
  /**
   * The response object.
   */
  data: StoryRelationship;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: StoryRelationshipUpdateMessage[];
}

/**
 * @inherits AbstractSearchItem
 */
export interface StorySearchItem {
  /**
   * The story.
   */
  story?: StorySummary;
}

export interface StoryStatistics {
  /**
   * The number of comments and likes for the list.
   */
  counts: StoryStatisticsCounts;

  /**
   * The story for which statistics were requested.
   */
  story: StoryIdentifier;
}

export interface StoryStatisticsCounts {
  /**
   * The number of comments for the list.
   */
  comments: number;

  /**
   * The number of members who like the list.
   */
  likes: number;
}

export interface StorySummary {
  /**
   * The member who published the story.
   */
  author: MemberSummary;

  /**
   * The story body formatted as HTML. The text is a preview extract, and may be truncated if it's too long.
   */
  bodyHtml?: string;

  /**
   * The story body formatted as LBML. May contain the following HTML tags: `<br>` `<strong>` `<em>` `<b>` `<i>`
   * `<a href="">` `<blockquote>`. The text is a preview extract, and may be truncated if it's too long.
   */
  bodyLbml?: string;

  /**
   * Will be `true` if the story body was truncated because it's very long.
   */
  bodyTruncated?: boolean;

  /**
   * The LID of the story.
   */
  id: string;

  /**
   * The story's hero image, in multiple resolutions.
   */
  image?: Image;

  /**
   * The name of the story.
   */
  name: string;

  /**
   * If this story has been pinned by its author, `pinned` will be true.
   */
  pinned?: boolean;

  /**
   * The publication name for the story (if applicable).
   */
  source?: string;

  /**
   * The external URL linked to by the story (if applicable).
   */
  url?: string;

  /**
   * The URL of the story's video (if applicable).
   */
  videoUrl?: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenCreated: string;

  /**
   * ISO 8601 format with UTC timezone, i.e. `YYYY-MM-DDThh:mm:ssZ`
   */
  whenUpdated?: string;
}

export interface StoryUpdateMessage {
  /**
   * The error message code.
   */
  code: 'StoryIsTooLong' | 'StoryNameIsBlank' | 'StoryNameTooLong' | 'StoryWithNoImage' | 'StoryWithNoText';

  /**
   * The error message text in human-readable form.
   */
  title: string;

  /**
   * The type of message.
   */
  type: 'Error' | 'Success';
}

export interface StoryUpdateRequest {
  /**
   * The policy determining who can post comments to the story. `You` in this context refers to the content owner. Use
   * the `commentThreadState` property of the `ListRelationship` to determine the signed-in member's ability to comment
   * (or not).
   */
  commentPolicy?: CommentPolicy | null;
}

export interface StoryUpdateResponse {
  /**
   * The response object.
   */
  data: Story;

  /**
   * A list of messages the API client should show to the user.
   */
  messages: StoryUpdateMessage[];
}

export interface Tag {
  /**
   * The tag code.
   */
  code: string;

  /**
   * The tag text as entered by the tagger.
   */
  displayTag: string;

  /**
   * Use `displayTag` instead.
   * @deprecated
   */
  tag?: string;
}

export interface TagCheckRequest {
  /**
   * The code of the tag being checked.
   */
  tagCode: string;

  /**
   * The type of tag to update (`viewings` or `lists`).
   */
  type: string;
}

export interface TagCheckResponse {
  /**
   * The number of taggings for the current user matching the new tag name.
   */
  count: number;

  newTagCode?: string;

  /**
   * The type of tag to update (`viewings` or `lists`).
   */
  type?: string;
}

export interface TagDeleteRequest {
  /**
   * The raw value of the tag to delete.
   */
  rawTag: string;

  /**
   * The code of the tag to delete.
   */
  tagCode: string;

  /**
   * The type of tag to delete (`viewings` or `lists`).
   */
  type: string;
}

/**
 * @inherits AbstractSearchItem
 */
export interface TagSearchItem {
  /**
   * The tag.
   */
  tag?: Tag;
}

export interface TagsResponse {
  itemCount?: number;

  /**
   * The list of tags, ordered by frequency of use.
   */
  items: string[];
}

export interface TagUpdateRequest {
  /**
   * The code of the tag following the update (may result in a merge if the code already exists).
   */
  newTagCode: string;

  /**
   * The raw value of the tag to update.
   */
  rawTag: string;

  /**
   * The code of the tag to update.
   */
  tagCode: string;

  /**
   * The type of tag to update (`viewings` or `lists`).
   */
  type: string;
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

export interface TreasureHuntItem {
  /**
   * The action URL
   */
  actionUrl: string;

  /**
   * Whether the item has been marked as found by the current user
   */
  found: boolean;

  /**
   * The image
   */
  image: Image;

  /**
   * The item id
   */
  itemId?: string;

  /**
   * The location hint
   */
  locationHint: string;

  /**
   * The name
   */
  name: string;

  /**
   * The collect nonce
   */
  nonce?: string;

  /**
   * The collect token
   */
  token?: string;
}

export interface UploadUrlResponse {
  /**
   * A single-use url for uploading a data file.
   */
  url: string;
}

export interface UsernameCheckResponse {
  /**
   * Will be `Available` if the username is available to register, or `NotAvailable` if used by another member (or
   * attached to a deactivated account, or otherwise reserved). May return an appropriate error value if the username
   * doesn't meet Letterboxd's requirements: Usernames must be between 2 and 15 characters long and may only contain
   * upper or lowercase letters, numbers or the underscore (_) character.
   */
  result: 'Available' | 'Invalid' | 'NotAvailable' | 'TooLong' | 'TooShort';
}

/**
 * @inherits AbstractActivity
 */
export interface WatchlistActivity {
  /**
   * The film associated with the activity. Includes a `MemberFilmRelationship` for the member who added the activity.
   */
  film?: FilmSummary;
}
