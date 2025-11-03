Extensions are a big part of Raycast and what makes it so great. Here we put into words rules and guidelines to make sure we continue with the quality we are providing so far. It is also relevant to mention that guidelines for our community are also valid here, both when interacting with developers and Raycast engineers.

## Definition

A Raycast Extension is a piece of code written by Raycast or third-party developers to increase Raycast's functionality. They usually connect Raycast to a web service, but it is not limited to it.

## Creation and Review Process

-   Create your new extension by either forking an existing one or starting from scratch;

-   Here are instructions on how to begin: https://developers.raycast.com/basics/getting-started

-   Open your Pull Request (PR) in our extensions repository;
-   We will review the extensions in a first-in, first-out manner. The first contact will be made within a week, given all Community Managers are available;
-   It is expected that the Author answers the reviewer's comment. The lack of response will make the PR stale and, eventually, closed.
-   To keep our backlog clean and prioritize extensions under active development, PRs will be automatically marked as stale and closed as follows:

-   PRs will be marked as stale when inactive for 14 days after the last comment;
-   PRs will be closed when inactive for 21 days after the last comment;
-   Both stale and closed PRs (due to inactivity) can be re-opened whenever the Author is ready to get back to it.

## Before Acceptance

-   Make sure your extension is bringing value to Raycast's users;

-   We want your extension to bring something that Raycast or other extensions don't provide yet.
-   At the same time, we prefer to keep services grouped in one extension and would rather increment an existing extension than create a new one.
-   Your extension does more than use any of Raycast's native functionalities like Quicklinks, Snippets, Clipboard History, Calculator, etc;
-   Fun is a great value for Raycast! Just make sure that it is non-violent and respectful.

-   Make sure that the extension works and that the users have all the information they need to set it up and use it.

-   This information should be on the extension's README file;
-   State codes, APIs, credentials, and any other relevant information that the user might need to connect your extension and the service;
-   All this information collected from the user should not be used for other purposes other than connecting to the service and improving the extension's response.

## After Acceptance

-   You are responsible for your extension and issues/feature requests that might come up

-   You can easily keep track of them on the Developer Hub.

-   In case of a major bug in a popular extension (more than 1k downloads), Raycast has the right to step in to fix the issue as soon as possible.

-   Normally, this is done in conjunction with the Author or the developers from the service provided by the extension.

-   In case of abandonment, Raycast has the right to write and approve fixes without the extensions's Author consent.

-   Abandonment: The extension does not work anymore or the Author is not active anymore after the Raycast team contacted them at least 3 times.
-   Stalled PRs are also considered abandoned by the extension's Author.

-   Raycast reserves the right to build extensions with the same functionality as an existing one.

-   In that case, the Author will be informed in advance.
-   The existing extension does not need to be removed from the store.

## Reasons to be rejected

-   Violate our Terms of Services and/or Privacy Policy

-   Examples:

-   Providing access to content not intentionally made available or provided for through the Service;
-   Impersonation;
-   Promote criminal activity;
-   Etc.

-   Violate the Terms of Service of the service provided;

-   Example: scraping a website without previous permission.

-   There is a method to accomplish this directly in Raycast, which offers a comparable value.
-   There is an active extension available on our Store providing very similar value

-   We encourage the Author to iterate on existing extensions, add new functionality, fix bugs, or even re-write it.

-   There is an open PR for an extension providing very similar value
-   The extension does not follow our technical guidelines
-   We’re limiting certain words, so your extension may need to change its name. Currently, we are restricting the use of the word "Assistant”

## Featured Extensions

Every month our Community Managers will choose 3 extensions to be highlighted. The extension will be highlighted on our Store both online and on the Raycast Store extension for 1 month. Here are the criteria:

-   The extension hasn't been highlighted before;
-   The choice of which extensions to highlight is limited to the Raycast team and we take into account:

-   Innovation;
-   Popularity;
-   Demand;
-   Creativity.

-   Official extensions published by our partners may have precedence;

## The future of Raycast Developer API and breaking changes

Raycast may, in the future, make breaking changes to our API. This is what it means to developers:

-   A plan will be published beforehand;
-   A guideline will be provided by Raycast's engineers on how to proceed, the changes made, and the consequences;
-   Raycast engineers will be available to help with migration;
-   Authors will be responsible for migrating their extensions;