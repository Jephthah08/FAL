# Deployment Guide

This application is fully optimized for production with optimal chunk splitting, lazy loading, and error handling. 

## 1. Quick Vercel Deployment (Recommended)
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Sign in to [Vercel](https://vercel.com).
3. Click **Add New** > **Project** and import your repository.
4. Vercel will automatically detect Vite and set the correct build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

## 2. General Node/Static Hosting Deployment
Run the following commands locally or on your CI/CD server:
```bash
npm install
npm run build
```
This produces an optimized, minified production build in the `dist/` directory.

### Serving the `dist/` Directory
You can serve the static files using a tool like `serve`:
```bash
npx serve -s dist
```

## Production Optimizations Included:
- **Client-Side Routing**: SPA handled via `react-router-dom`. Ensure your host has rewrite rules for SPA fallback (e.g., serving `index.html` for all 404s). Vercel does this automatically for Vite.
- **Code Splitting**: Using `React.lazy()` and React Suspense, the application loads routes asynchronously, improving the initial First Contentful Paint (FCP) metric.
- **State Persistence**: User data in `zustand` is securely synced to LocalStorage.
- **Error Boundaries**: Component tree failures are gracefully caught by an `ErrorBoundary` which permits resetting without crashing the app shell.
- **Accessibility & SEO**: Semantic HTML tags, aria enhancements, focus visibility rings, responsive scaling across mobile/desktop, and appropriate contrast usage.
