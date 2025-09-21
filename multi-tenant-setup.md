# Multi-Tenant Church Management System Setup

## Overview
The application has been converted to a multi-tenant architecture where each church has its own database. This allows for complete data isolation between different churches.

## Architecture Changes

### 1. Database Structure
- **Before**: Single database with `Church` model and `churchId` foreign key
- **After**: Separate database per church, no `Church` model needed

### 2. Key Components

#### Database Connection Management (`src/lib/database.ts`)
- Manages multiple database connections
- Creates church-specific database URLs
- Handles connection caching and cleanup

#### Middleware (`src/middleware.ts`)
- Determines church slug from subdomain/domain
- Adds church context to request headers
- Handles localhost development scenarios

#### Updated API Routes
- All routes now use dynamic database connections
- Fallback to mock data if database unavailable
- Church-specific data isolation

## Configuration

### Environment Variables
```env
# Base database URL (without database name)
DATABASE_URL="postgresql://user:password@localhost:5432"
```

### Church Database Naming Convention
Each church gets its own database named: `{churchSlug}_church_db`

Examples:
- `demo_church_db`
- `iglesia_ejemplo_church_db`
- `first_baptist_church_db`

## Development Setup

### 1. For Localhost Development
The application defaults to using the `demo` church when running on localhost.

You can also specify a church using query parameters:
```
http://localhost:3000?church=demo
```

### 2. For Production with Subdomains
```
https://demo.churchapp.com -> demo church
https://iglesia-ejemplo.churchapp.com -> iglesia-ejemplo church
```

### 3. For Production with Custom Domains
```
https://firstbaptist.org -> firstbaptist church
https://iglesia-ejemplo.org -> iglesia-ejemplo church
```

## Database Setup

### 1. Create Church Database
```sql
CREATE DATABASE demo_church_db;
```

### 2. Run Migrations
```bash
# Set DATABASE_URL to specific church database
DATABASE_URL="postgresql://user:password@localhost:5432/demo_church_db" npx prisma migrate dev
```

### 3. Seed Data
```bash
# Seed specific church
npm run seed demo

# Or run the seed script directly
node src/mock/seed.ts demo
```

## Testing the Setup

### 1. Local Testing
1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000?church=demo`
3. The middleware will set the church context
4. API calls will use the demo church database (or fallback to mock data)

### 2. Multi-Church Testing
1. Create multiple church databases
2. Seed each with different data
3. Test switching between churches using query parameters

### 3. Subdomain Testing (Advanced)
1. Set up local DNS or hosts file entries
2. Configure subdomains to point to localhost:3000
3. Test subdomain-based church routing

## Fallback Behavior

The system includes robust fallback mechanisms:

1. **Database Connection Failure**: Falls back to mock data
2. **Invalid Church Slug**: Redirects to error page
3. **Missing Church Context**: Defaults to 'demo' church

## Security Considerations

1. **Data Isolation**: Each church's data is completely isolated
2. **Church Slug Validation**: Prevents injection attacks
3. **Connection Caching**: Efficient resource usage
4. **Error Handling**: Graceful degradation

## Monitoring

The system logs important events:
- Database connection creation
- Church context determination
- Fallback activations
- Connection health checks

## Next Steps

1. Set up actual church databases
2. Configure production domain routing
3. Implement church onboarding process
4. Add database migration management
5. Set up monitoring and alerting