# Apify Store Scraper

This repository contains an Apify actor that scrapes the Apify Store to retrieve information about actors, such as their IDs, names, descriptions, and user details. It uses Crawlee for web scraping and supports filtering by actor ID, username, or search queries.

## Primary Purpose

While this is a functional Apify actor, its main goal is to serve as supporting code for blog articles about Apify and Crawlee development practices. It demonstrates efficient testing workflows, including local debugging, E2E testing, snapshot testing, and unit testing.

## Installation

Install dependencies:

```bash
npm install
```

## Usage

### Running Locally

To run the actor locally with default settings prepare an input file at `storage/key_value_stores/INPUT.json` based on this example:

```json
{
    "limit": 3,
    "query": "google ads"
}
```

Then run the actor locally using Apify CLI:

```bash
apify run
```

### Output

The actor outputs an array of actor objects with fields like:

-   `actorId`: Unique identifier
-   `name`: Actor name
-   `title`: Display title
-   `username`: Creator's username
-   `categories`: Array of categories
-   `pictureUrl`: Profile picture URL

## Testing

This repository includes an example test suite demonstrating best practices for testing Apify actors:

-   **Unit tests**: Test individual functions like `buildFilters`
-   **Integration tests**: Test specific behaviors without snapshots
-   **Snapshot tests**: Capture and compare full actor outputs

Run all tests:

```bash
npm run test
```

Update snapshots when changes are intentional:

```bash
npm run test -- -u
```

## Contributing

This repository is primarily for educational purposes supporting blog content. However, feel free to open issues or pull requests for improvements.

## Links

-   [Apify Platform](https://apify.com)
-   [Crawlee Documentation](https://crawlee.dev)
-   [Jest Testing Framework](https://jestjs.io)
