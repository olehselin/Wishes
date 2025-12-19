# Deployment Guide

## Quick Start

Your application is now configured for Vercel deployment with:
- ✅ Client-side routing (SPA support)
- ✅ API routes (serverless functions)
- ✅ Automatic environment detection

## What Was Fixed

### 1. Routing Configuration (`vercel.json`)
- Added rewrites to handle all client-side routes
- Configured API route handling
- Set up proper build output directory

### 2. API Setup
- Created Vercel serverless functions in `/api/wishes/`
- Implemented all CRUD operations
- Added CORS headers for cross-origin requests
- Updated API client to use `/api/wishes` in production

### 3. Environment Configuration
- API base URL automatically switches between:
  - Development: `http://localhost:3000` (json-server)
  - Production: Relative URLs (Vercel API routes)

## Deployment Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build locally (optional, to test):**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in Vercel
   - Vercel will automatically detect the configuration

   OR use Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```

## Important Notes

### Data Persistence
⚠️ **Current implementation uses ephemeral storage** - data resets on each function invocation.

For production, you MUST upgrade to a database. See `API_SETUP.md` for detailed instructions.

### Environment Variables
If you need to override the API URL, set `VITE_API_BASE_URL` in Vercel project settings.

## Testing After Deployment

1. **Test routing:**
   - Visit your deployed URL
   - Navigate to `/wish/1` directly
   - Refresh the page - it should work (no 404)

2. **Test API:**
   - Open browser DevTools → Network tab
   - Create a new wish
   - Check that requests go to `/api/wishes`
   - Verify responses are correct

## Troubleshooting

### Still getting 404 errors?
- Check that `vercel.json` is in the project root
- Verify the build output directory is `dist`
- Check Vercel project settings for correct root directory

### API not working?
- Check Vercel function logs in the dashboard
- Verify API routes are in `/api/` directory
- Ensure `@vercel/node` is installed

### Data not persisting?
- This is expected with current setup
- See `API_SETUP.md` to upgrade to a database

## Project Structure

```
wish-list/
├── api/                    # Vercel serverless functions
│   └── wishes/
│       ├── index.ts        # GET, POST /api/wishes
│       └── [id].ts         # GET, PUT, PATCH, DELETE /api/wishes/:id
├── lib/                     # Shared utilities
│   └── wish-handler.ts     # Data operations
├── src/                     # React application
├── vercel.json              # Vercel configuration
└── package.json
```

## Next Steps

1. ✅ Deploy to Vercel
2. ⚠️ Set up persistent database (see `API_SETUP.md`)
3. ✅ Test all functionality
4. ✅ Monitor function logs for errors

