# News App

A news application that fetches articles from Contentful CMS.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_API_KEY=your_api_key
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Security

The API key is now securely stored on the server-side and not exposed to the client. The frontend makes requests to `/api/articles` which proxies to Contentful with the credentials.

## Development

For development with auto-restart:
```bash
npm run dev
```