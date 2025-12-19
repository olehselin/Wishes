# API Setup for Production

## Current Implementation

The API is currently set up with **ephemeral in-memory storage**. This means:
- ✅ API routes work correctly
- ✅ All CRUD operations function
- ⚠️ **Data does NOT persist** between serverless function invocations

## Why This Limitation Exists

Vercel serverless functions have a **read-only filesystem**. File writes are not possible, and even if they were, each function invocation is isolated, so data wouldn't persist.

## Upgrade to Persistent Storage

For production, you should use one of these options:

### Option 1: Vercel KV (Recommended for Simple Use Cases)

Vercel KV is a Redis-compatible key-value store, perfect for this use case.

1. **Install Vercel KV:**
   ```bash
   npm install @vercel/kv
   ```

2. **Set up Vercel KV in your Vercel dashboard:**
   - Go to your project settings
   - Navigate to "Storage" → "Create Database" → "KV"
   - Follow the setup instructions

3. **Update `lib/wish-handler.ts`:**
   ```typescript
   import { kv } from '@vercel/kv';
   
   export const getWishes = async (): Promise<Wish[]> => {
     const wishes = await kv.get<Wish[]>('wishes') || [];
     return wishes;
   };
   
   export const createWish = async (wishData: Omit<Wish, 'id'>): Promise<Wish> => {
     const wishes = await getWishes();
     const newWish: Wish = {
       ...wishData,
       id: generateId(),
       createdAt: wishData.createdAt || new Date().toISOString()
     };
     wishes.push(newWish);
     await kv.set('wishes', wishes);
     return newWish;
   };
   
   // Similar updates for other functions...
   ```

### Option 2: Vercel Postgres (Recommended for Complex Data)

For more complex queries and relationships:

1. **Set up Vercel Postgres in your dashboard**
2. **Install the Postgres client:**
   ```bash
   npm install @vercel/postgres
   ```
3. **Create a schema and update handlers accordingly**

### Option 3: External Database Service

Use services like:
- **MongoDB Atlas** (free tier available)
- **Supabase** (PostgreSQL with great DX)
- **PlanetScale** (MySQL)
- **Firebase Firestore**

## Environment Variables

If using an external API, set the `VITE_API_BASE_URL` environment variable in Vercel:
- Go to Project Settings → Environment Variables
- Add `VITE_API_BASE_URL` with your API URL

## Testing Locally

For local development, continue using `json-server`:
```bash
npm run server
```

The API client automatically detects the environment and uses:
- Development: `http://localhost:3000` (json-server)
- Production: Relative URLs pointing to `/api/wishes` (Vercel serverless functions)

## Current API Endpoints

- `GET /api/wishes` - Get all wishes
- `GET /api/wishes/:id` - Get a specific wish
- `POST /api/wishes` - Create a new wish
- `PUT /api/wishes/:id` - Update a wish (full replacement)
- `PATCH /api/wishes/:id` - Partially update a wish
- `DELETE /api/wishes/:id` - Delete a wish

All endpoints include CORS headers and proper error handling.

