# Deployment Guide

## Production Deployment

This guide covers deploying the Marketplace backend to production environments.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console.error logs in code
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] API endpoints tested
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Logging enabled
- [ ] Error monitoring set up

---

## Environment Setup

### Production .env Configuration

```env
# Server
PORT=5000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketplace?retryWrites=true&w=majority

# JWT (Use strong random string)
JWT_SECRET=generate_strong_random_string_here_min_32_chars
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Optional: Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Generate Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

## Deployment Options

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create marketplace-api
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
```

5. **Add MongoDB Atlas Connection String**
```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/marketplace"
```

6. **Deploy**
```bash
git push heroku main
```

7. **View Logs**
```bash
heroku logs --tail
```

---

### Option 2: Deploy to AWS EC2

1. **Create EC2 Instance**
   - Launch Ubuntu 20.04 LTS instance
   - Allow ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (API)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm nginx
```

4. **Clone Repository**
```bash
git clone your-repo-url
cd backend
npm install
```

5. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

6. **Configure Nginx as Reverse Proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Start Application with PM2**
```bash
npm install -g pm2
pm2 start src/server.js --name "marketplace-api"
pm2 startup
pm2 save
```

8. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

---

### Option 3: Deploy to DigitalOcean App Platform

1. **Push code to GitHub**

2. **Connect DigitalOcean to GitHub**
   - Go to DigitalOcean Dashboard
   - Create new App
   - Connect GitHub repository

3. **Configure App Spec**
```yaml
name: marketplace-api
services:
- name: api
  github:
    repo: your-username/marketplace-backend
    branch: main
  build_command: npm install
  run_command: npm start
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}
  http_port: 5000
```

4. **Add Database**
   - Create MongoDB cluster in DigitalOcean
   - Link to application

5. **Deploy**
   - DigitalOcean will automatically deploy on Git pushes

---

### Option 4: Deploy with Docker

1. **Create Dockerfile**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

2. **Create .dockerignore**
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.example
README.md
```

3. **Build Docker Image**
```bash
docker build -t marketplace-api:1.0.0 .
```

4. **Run Container**
```bash
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb+srv://... \
  -e JWT_SECRET=your_secret \
  marketplace-api:1.0.0
```

5. **Push to Docker Hub**
```bash
docker tag marketplace-api:1.0.0 your-username/marketplace-api:1.0.0
docker push your-username/marketplace-api:1.0.0
```

---

## Database Setup

### MongoDB Atlas Free Tier

1. **Create Account** - https://www.mongodb.com/cloud/atlas

2. **Create Cluster**
   - Select Free tier (M0)
   - Choose region
   - Create cluster

3. **Add Database User**
   - Username: marketplace_user
   - Auto-generated password (save it)

4. **Whitelist IP**
   - Add your server IP
   - Or use 0.0.0.0/0 for testing (not recommended for production)

5. **Get Connection String**
   - Click "Connect"
   - Copy connection string
   - Update MONGODB_URI in .env

---

## Security Recommendations

### 1. Environment Variables
- Never commit .env to version control
- Use strong, random values
- Rotate secrets regularly
- Use different secrets for each environment

### 2. HTTPS/SSL
- Use Let's Encrypt (free)
- Redirect HTTP to HTTPS
- Set secure cookie flags

### 3. Rate Limiting
```bash
npm install express-rate-limit
```

Add to app.js:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. CORS
- Specify allowed origins
- Don't use wildcard in production
- Set credentials: true only when needed

### 5. Password Requirements
- Enforce strong passwords
- Hash with bcrypt (already implemented)
- Implement password expiry

### 6. Input Validation
- Validate all inputs
- Sanitize data
- Use express-validator (already implemented)

### 7. Logging & Monitoring
```bash
npm install winston
```

### 8. Database
- Regular backups
- Use strong credentials
- Enable authentication
- Restrict network access

---

## Performance Optimization

### 1. Database Indexing
- Already implemented for common queries
- Monitor slow queries
- Use explain() for query analysis

### 2. Caching
```bash
npm install redis
```

### 3. CDN
- Use Cloudinary or AWS S3 for images
- Implement image optimization
- Use CDN for serving static files

### 4. Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 5. Load Balancing
- Use reverse proxy (Nginx)
- Implement sticky sessions if needed
- Monitor server resources

---

## Monitoring & Logging

### 1. Application Monitoring
```bash
npm install sentry-node
```

### 2. Error Tracking
Use Sentry dashboard to monitor errors in real-time

### 3. Log Files
```bash
# Keep logs in files
const winston = require('winston');
```

### 4. Performance Monitoring
- Monitor API response times
- Track database query times
- Monitor server resources (CPU, memory)

---

## Rollback Plan

1. **Maintain Previous Version**
   - Keep backup of previous deployment
   - Document version numbers
   - Tag releases in Git

2. **Quick Rollback**
```bash
# Using PM2
pm2 list
pm2 restart app-name

# Using Docker
docker run -p 5000:5000 marketplace-api:previous-version
```

3. **Database Rollback**
   - Keep MongoDB backups
   - Document data migrations
   - Test rollback procedures

---

## Maintenance

### Regular Tasks
- [ ] Monitor application logs
- [ ] Check error rates
- [ ] Review database performance
- [ ] Update dependencies (npm audit)
- [ ] Backup database
- [ ] Review security logs
- [ ] Monitor disk space
- [ ] Update SSL certificates

### Weekly
- [ ] Review error logs
- [ ] Monitor API performance
- [ ] Check database size

### Monthly
- [ ] Security audit
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Backup verification

---

## Scaling Considerations

### Horizontal Scaling
1. Load balancer (nginx, HAProxy)
2. Multiple application instances
3. Shared MongoDB instance
4. Redis for caching/sessions

### Vertical Scaling
1. Increase server resources
2. Database optimization
3. Query caching
4. Image optimization

### Cost Optimization
- Use free tier databases (MongoDB Atlas M0)
- Auto-scaling based on demand
- Monitor and optimize usage
- Remove unused services

---

## Support & Troubleshooting

### Common Issues

**High Memory Usage**
- Check for memory leaks
- Monitor database connections
- Implement connection pooling

**Slow API Responses**
- Check database indexes
- Implement caching
- Monitor query performance

**Database Connection Errors**
- Verify connection string
- Check IP whitelist
- Verify credentials

**Application Crashes**
- Review error logs
- Check system resources
- Implement proper error handling

---

## Post-Deployment Checklist

- [ ] Health check endpoint responding
- [ ] All API endpoints working
- [ ] Authentication functional
- [ ] Database connected
- [ ] Logging working
- [ ] Monitoring active
- [ ] Backups automated
- [ ] SSL certificate valid
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Error handling working
- [ ] Performance acceptable

---

**Happy Deployment! 🚀**
