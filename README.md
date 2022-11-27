<p align="center">
  <img src="https://user-images.githubusercontent.com/33762/190890947-fae23b13-1149-4572-a967-46575b2031c0.png" alt="letterboxd logo" width="500" />
</p>

<p align="center">
  An unofficial <a href="https://letterboxd.com">Letterboxd</a> API client. 📽️
</p>

<p align="center">
  <a href="https://npm.im/letterboxd-client"><img src="https://img.shields.io/npm/v/letterboxd-client.svg?style=for-the-badge" alt="NPM Version"></a>
  <a href="https://npm.im/letterboxd-client"><img src="https://img.shields.io/node/v/letterboxd-client.svg?style=for-the-badge" alt="Node Version"></a>
  <a href="https://npm.im/letterboxd-client"><img src="https://img.shields.io/npm/l/letterboxd-client.svg?style=for-the-badge" alt="MIT License"></a>
  <a href="https://github.com/dashron/letterboxd-client"><img src="https://img.shields.io/github/workflow/status/dashron/letterboxd-client/CI.svg?style=for-the-badge" alt="Build status"></a>
</p>

---

- [Installation](https://api.readme.dev/docs/installation)
- [Usage](#usage)
  - [User Authentication](#user-authentication)
- [Available APIs](#apis)
  - [Auth](#auth)
  - [Comments](#comments)
  - [Contributors](#contributors)
  - [Film Collections](#film-collections)
  - [Films](#films)
  - [Lists](#lists)
  - [Log Entries](#log-entries)
  - [Me](#me)
  - [Members](#members)
  - [News](#news)
  - [Search](#search)
  - [Stories](#stories)
- [FAQ](#faq)

## Installation

```
npm install letterboxd-client
```

## Usage

```js
import Client from 'letterboxd-client';
// const { default: Client } = require('letterboxd-client')

const apiKey = 'your letterboxd api key';
const apiSecret = 'your letterboxd api secret';

const client = new Client(apiKey, apiSecret);
const { status, data } = await client.film.get('ljDs');

console.log(data.name) // RRR
console.log(data.tagline) // Rise Roar Revolt
```

### User Authentication

To authenticate a user you will need their Letterboxd credentials (`username` + `password`), which you will supply to `client.auth.requestAuthToken` like so:

```js
const { status, data } = await client.auth.requestAuthToken(username, password);
```

If successful you will receive back an `AccessToken` response that will contain the users `acessToken` that you can then pass back into the main `Client` instance in order to authenticate all API requests as that user.

## Available APIs

> **Note**
>
> For all documentation on parameters or responses see the TypeScript types that we export to the package or consult <a href="https://api-docs.letterboxd.com/">https://api-docs.letterboxd.com/</a> for the endpoint you're using.

<sub>* Requires an authenticated Letterboxd user access token.</sub>

### Auth

The following methods are available on the `client.auth.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#forgottenPasswordRequest()` | Request a link via email to reset the password for a member's account. |
| `#getLoginToken()`* | Generate a single-use token for the current member, which can be used to sign the member into the Letterboxd website by passing it as the value of the `urt` query parameter. |
| `#requestAuthToken()` | Use a member's credentials to sign in and receive an authentication token. |
| `#revokeAuth()`* | Revoke a users' access token. |
| `#usernameCheck()` | Check if a username is available to register. |
<!-- prettier-ignore-end -->

### Comments

The following methods are available on the `client.comment.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#report()`* | Report a comment by ID. |
| `#update()`* | Update the message portion of a comment. |
<!-- prettier-ignore-end -->

### Contributors

The following methods are available on the `client.contributor.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#getContributor()` | Get details about a film contributor by ID. |
| `#getContributions()` | A cursored window over the list of contributions to films for a contributor. |
<!-- prettier-ignore-end -->

### Film Collections

The following methods are available on the `client.filmCollection.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#get()` | Get details about a film collection by ID. |
<!-- prettier-ignore-end -->

### Films

The following methods are available on the `client.film.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#all()` | A cursored window over the list of films. |
| `#countries()` | Get a list of countries supported by the /films endpoint. |
| `#genres()` | Get a list of genres supported by the /films endpoint. |
| `#get()` | Get details about a film by ID.  |
| `#getMemberFriends()` | Get details of the authenticated member's friends' relationship with a film by ID. |
| `#getMemberRelationship()`* | Get details of the authenticated member's relationship with a film by ID. |
| `#getMembers()` | Get details of members' relationships with a film by ID. |
| `#languages()` | Get a list of languages supported by the /films endpoint. |
| `#report()`* | Report a film by ID. |
| `#services()` | Get a list of services supported by the /films endpoint. |
| `#statistics()` | Get statistical data about a film by ID. |
<!-- prettier-ignore-end -->

### Lists

The following methods are available on the `client.list.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#all()` | A cursored window over a list of lists. |
| `#create()`* | Create a list. |
| `#createComment()`* | Create a comment on a list. |
| `#delete()`* | Delete a list by ID. |
| `#get()` | Get details of a list by ID. |
| `#getComments()` | A cursored window over the comments for a list. |
| `#getEntries()` | Get entries for a list by ID. |
| `#getRelationship()`* | Get details of the authenticated member's relationship with a list by ID. |
| `#report()`* | Report a list by ID. |
| `#statistics()` | Get statistical data about a list by ID. |
| `#topics()` | Get a list of featured topics/lists (e.g. for display in the Browse tab of our apps). |
| `#update()`* | Update a list by ID. |
| `#updateLists()`* | Add one or more films to one or more lists. |
| `#updateRelationship()`* | Update the authenticated member's relationship with a list by ID. |
<!-- prettier-ignore-end -->

### Log Entries

The following methods are available on the `client.logEntry.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#all()` | A cursored window over the log entries for a film or member. |
| `#create()`* | Create a log entry. |
| `#createComment()`* | Create a comment on a review. |
| `#delete()`* | Delete a log entry by ID. |
| `#get()` | Get details about a log entry by ID. |
| `#getRelationship()`* | Get details of the authenticated member's relationship with a log entry's review by ID. |
| `#getComments()` | A cursored window over the comments for a log entry's review. |
| `#report()`* | Report a log entry's review by ID. |
| `#statistics()` | Get statistical data about a log-entry's review by ID. |
| `#update()`* | Update a log entry by ID. |
| `#updateRelationship()`* | Update the authenticated member's relationship with a log entry's review by ID. |
<!-- prettier-ignore-end -->

### Me

The following methods are available on the `client.me.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#deactivate()`* | Deactivate account. |
| `#deregisterPushNotifications()`* | Deregister a device so it no longer receives push notifications. |
| `#get()`* | Get details about the authenticated member. |
| `#registerPushNotifications()`* | Register a device so it can receive push notifications. |
| `#update()`* | Update the profile settings for the authenticated member. |
| `#validationRequest()`* | Request a validation link via email. |
<!-- prettier-ignore-end -->

### Members

The following methods are available on the `client.member.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#all()` | A cursored window over the list of members. |
| `#get()` | Get details about a member by ID. |
| `#getMemberActivity()` | A cursored window over the activity for a member. |
| `#getMemberListTags()` | Get the list of a member's tags, or those that match an optional search prefix. |
| `#getMemberLogEntryTags()` | Get the list of a member's tags, or those that match an optional search prefix. |
| `#getMemberRelationship()`* | Get details of the authenticated member's relationship with another member by ID. |
| `#pronouns()` | Get a list of pronouns supported by the `PATCH /me` endpoint |
| `#register()` | Create a new account. |
| `#report()`* | Report a member by ID. |
| `#statistics()` | Get statistical data about a member by ID. |
| `#updateMemberRelationship()`* | Update the authenticated member’s relationship with another member by ID. |
| `#watchlist()` | Get details of a member's public watchlist by ID. |
<!-- prettier-ignore-end -->

### News

`client.news` will return you back recent news from the Letterboxd editors at <a href="https://letterboxd.com/journal/">https://letterboxd.com/journal/</a>.

### Search

`client.search` is the main entry point for searching Letterboxd. See the parameter types or <a href="https://api-docs.letterboxd.com/#path--search>https://api-docs.letterboxd.com/#path--search</a> for documentation.

### Stories

The following methods are available on the `client.story.*` namespace:

<!-- prettier-ignore-start -->
| Method | Description |
| :--- | :--- |
| `#all()` | A cursored window over a list of stories. |
| `#get()` | Get details of a story by ID. |
<!-- prettier-ignore-end -->

## FAQ

#### How can I get access to the Letterboxd API?

https://letterboxd.com/api-beta/
