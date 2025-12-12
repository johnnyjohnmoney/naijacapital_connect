# Supabase Setup Guide for NaijaConnect Capital

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **Start your project** (or **Sign In** if you have an account)
3. Click **New Project**
4. Fill in project details:
   - **Name**: `naijacapital` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `West EU (London)` or `US East`)
   - **Pricing Plan**: Select **Free** tier
5. Click **Create new project**
6. Wait 2-3 minutes for project to be provisioned

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, click **Settings** (gear icon in sidebar)
2. Click **Database** in the left menu
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 1

## Step 3: Update Vercel Environment Variables

### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/emmaorevba-5208s-projects/naijaconnectcapital
2. Click **Settings** tab
3. Click **Environment Variables** in left menu
4. Find `DATABASE_URL` and click **Edit**
5. Replace the value with your Supabase connection string from Step 2
6. Make sure it's enabled for **Production**, **Preview**, and **Development**
7. Click **Save**

### Option B: Via Vercel CLI

```bash
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production
# Paste your Supabase connection string when prompted
```

## Step 4: Run Database Migration

```bash
# Pull the new DATABASE_URL from Vercel
vercel env pull .env --environment production

# Generate Prisma Client for PostgreSQL
npx prisma generate

# Push the schema to Supabase
npx prisma db push --accept-data-loss

# Or create and apply migration (recommended)
npx prisma migrate dev --name init_supabase
```

## Step 5: Create Admin Account

After migration is complete, create your admin account:

```bash
npm run create-admin
```

Or via API:

```bash
curl -X POST https://naijaconnectcapital.vercel.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@naijacapital.com",
    "password": "YourSecurePassword",
    "adminSecretKey": "your-super-secret-admin-key-change-this"
  }'
```

## Step 6: Redeploy to Vercel

```bash
# Commit the Prisma schema change
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL with Supabase"
git push

# Or trigger manual deployment
vercel --prod
```

## Step 7: Verify Database Connection

1. Visit: https://naijaconnectcapital.vercel.app
2. Try signing up or signing in
3. Check Supabase dashboard → **Table Editor** to see if users table was created

## Troubleshooting

### Connection Issues

- Make sure you replaced `[YOUR-PASSWORD]` in the connection string
- Verify the password doesn't contain special characters that need URL encoding
- Check Vercel logs: `vercel logs naijaconnectcapital.vercel.app`

### Migration Errors

If you get errors during migration:

```bash
# Reset the database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema directly
npx prisma db push --accept-data-loss
```

### Enable SSL (if needed)

If you get SSL errors, add `?sslmode=require` to the end of your DATABASE_URL:

```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require
```

## Supabase Features You Can Use

- **Table Editor**: View/edit data directly
- **SQL Editor**: Run custom queries
- **Database Backups**: Available in dashboard
- **Logs**: Monitor database performance
- **Extensions**: Enable useful Postgres extensions

## Free Tier Limits

- 500 MB database space
- Unlimited API requests
- 50,000 monthly active users
- 1 GB file storage
- Community support

## Next Steps

After setup is complete:

1. Update `ADMIN_SECRET_KEY` environment variable in Vercel
2. Set up `NEXTAUTH_URL` if not already set: `https://naijaconnectcapital.vercel.app`
3. Test all functionality (sign up, investments, admin dashboard)
4. Enable Row Level Security (RLS) in Supabase for extra security (optional)
