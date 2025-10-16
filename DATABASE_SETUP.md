# Database Setup Guide for Modeling Copilot

This guide will help you set up and connect your Neon database to the Modeling Copilot application.

## 1. Neon Database Setup

### Create a Neon Account and Project
1. Visit [Neon Console](https://console.neon.tech/app/projects/delicate-meadow-50568017)
2. Sign in to your Neon account
3. Create a new project or use your existing project

### Get Connection String
1. In your Neon project dashboard, go to the "Connection Details" section
2. Copy your connection string (it should look like this):
   ```
   postgresql://username:password@hostname:5432/database_name?sslmode=require
   ```
3. For pooled connections (recommended), use:
   ```
   postgresql://user:password@pooled-hostname.pool.region.neon.tech/dbname?sslmode=require&channel_binding=require
   ```

## 2. Environment Configuration

### Create Environment File
1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Add your database connection string to `.env.local`:
   ```env
   VITE_DATABASE_URL=postgresql://username:password@hostname:5432/database_name?sslmode=require
   ```

### Vercel Deployment
If deploying to Vercel, add the environment variable in your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `VITE_DATABASE_URL` with your connection string

## 3. Database Schema Setup

### Generate and Run Migrations
1. Generate migration files:
   ```bash
   npm run db:generate
   ```

2. Push schema to your database:
   ```bash
   npm run db:push
   ```

### Alternative: Manual Schema Creation
If you prefer to create the schema manually, run this SQL in your Neon console:

```sql
-- Create workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create variables table
CREATE TABLE variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    default_value TEXT,
    min_value NUMERIC,
    max_value NUMERIC,
    step NUMERIC,
    unit TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create scenarios table
CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft' NOT NULL,
    tags JSONB DEFAULT '[]',
    variables JSONB DEFAULT '{}',
    assumptions TEXT,
    constraints JSONB DEFAULT '[]',
    time_horizon NUMERIC DEFAULT '10',
    base_scenario UUID REFERENCES scenarios(id),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create projections table
CREATE TABLE projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    scenario_ids JSONB DEFAULT '[]',
    variable_ids JSONB DEFAULT '[]',
    time_horizon NUMERIC DEFAULT '10',
    projection_data JSONB,
    assumptions TEXT,
    confidence NUMERIC,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create comparisons table
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    scenario_ids JSONB NOT NULL,
    comparison_type TEXT DEFAULT 'scenario' NOT NULL,
    comparison_data JSONB,
    metrics JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create lrp_runs table
CREATE TABLE lrp_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    run_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    region TEXT,
    target NUMERIC,
    constraints JSONB DEFAULT '[]',
    arr_before NUMERIC,
    arr_after NUMERIC,
    total_delta NUMERIC,
    results JSONB,
    status TEXT DEFAULT 'pending' NOT NULL,
    error TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_variables_workspace_id ON variables(workspace_id);
CREATE INDEX idx_scenarios_workspace_id ON scenarios(workspace_id);
CREATE INDEX idx_projections_workspace_id ON projections(workspace_id);
CREATE INDEX idx_comparisons_workspace_id ON comparisons(workspace_id);
CREATE INDEX idx_lrp_runs_workspace_id ON lrp_runs(workspace_id);
CREATE INDEX idx_lrp_runs_run_id ON lrp_runs(run_id);
```

## 4. Database Connection Testing

### Test Connection in Settings
1. Start your application: `npm run dev`
2. Navigate to Settings page
3. Enter your database connection string
4. Click "Test Connection" to verify the setup

### Database Studio (Optional)
To explore your database visually:
```bash
npm run db:studio
```

## 5. Usage

Once set up, your Modeling Copilot will automatically:
- Store all scenarios, variables, projections, and comparisons in the database
- Track LRP Copilot analysis runs
- Provide data persistence across sessions
- Enable multi-user collaboration (when workspace sharing is implemented)

## 6. Troubleshooting

### Common Issues

**Connection Refused**
- Verify your connection string is correct
- Check if your IP is whitelisted in Neon (if using IP restrictions)
- Ensure SSL mode is set to `require`

**Authentication Failed**
- Double-check username and password
- Verify the database name is correct

**Schema Errors**
- Ensure you've run the migrations or created the tables manually
- Check that all required tables exist

### Getting Help
- Check the [Neon Documentation](https://neon.tech/docs)
- Review the console logs for detailed error messages
- Test your connection string directly in the Neon console

## 7. Security Best Practices

1. **Never commit connection strings** to version control
2. **Use environment variables** for all sensitive data
3. **Enable SSL** for all connections (`sslmode=require`)
4. **Use pooled connections** for production
5. **Regularly rotate passwords** and connection strings
6. **Monitor database usage** in the Neon console

Your database is now ready to power your Modeling Copilot application! 🚀
