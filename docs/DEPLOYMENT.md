# Deployment Guide

## Prerequisites

- AWS account (or similar cloud provider)
- Domain name (optional but recommended)
- MongoDB Atlas account (or managed MongoDB service)
- Stripe production account
- DocuSign production account

---

## Backend Deployment (Heroku/AWS)

### Option 1: Heroku (Easiest for MVP)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create vr-escape-room-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="your_production_secret"
   heroku config:set NODE_ENV="production"
   # Set other env vars
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Monitor**
   ```bash
   heroku logs --tail
   ```

### Option 2: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t2.micro (free tier eligible)
   - Configure security group (allow ports 22, 80, 443)

2. **SSH into Instance**
   ```bash
   ssh -i key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx git
   ```

4. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd vr-escape-room/backend
   npm install
   ```

5. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

6. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "vr-api"
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add reverse proxy:
   ```nginx
   server {
     listen 80 default_server;
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

   ```bash
   sudo systemctl restart nginx
   ```

8. **Enable HTTPS (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Frontend Deployment (Netlify/Vercel)

### Option 1: Netlify

1. **Build Production Bundle**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect to Netlify**
   - Push code to GitHub
   - Connect GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Environment Variables**
   - Add in Netlify dashboard:
     - `REACT_APP_API_BASE_URL=https://your-api-domain.com`
     - `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...`

### Option 2: AWS S3 + CloudFront

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://vr-escape-room-frontend
   ```

3. **Upload Files**
   ```bash
   aws s3 sync build/ s3://vr-escape-room-frontend --delete
   ```

4. **Set Up CloudFront**
   - Create distribution pointing to S3 bucket
   - Enable caching
   - Use SSL/TLS certificate

---

## Database Deployment

### MongoDB Atlas

1. **Create Cluster**
   - Sign up at mongodb.com/cloud
   - Create free tier cluster
   - Configure IP whitelist (0.0.0.0/0 for testing, specific IPs for production)

2. **Create Database**
   - Create database user with strong password
   - Note connection string

3. **Set Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

4. **Run Migrations**
   ```bash
   NODE_ENV=production npm run migrate
   ```

---

## SSL/TLS Certificates

### Let's Encrypt (Free)

```bash
# On EC2 with Nginx
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## Monitoring & Logging

### Backend Monitoring

```javascript
// Add APM (Application Performance Monitoring)
const apm = require('elastic-apm-node');
apm.start({
  serviceName: 'vr-escape-room-api',
  serverUrl: 'https://your-elasticsearch.elastic.cloud'
});
```

### Logging

```javascript
// Use Winston for logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Alerts

Set up alerts in AWS CloudWatch:
- CPU usage > 80%
- Memory usage > 85%
- Error rate > 1%
- Response time > 1s

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "vr-escape-room-api"
          heroku_email: "your@email.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build React
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
```

---

## Environment Configuration

### Production .env

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=very_long_random_secret_key_min_32_chars
FRONTEND_URL=https://your-frontend-domain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
DOCUSIGN_ENABLED=true
DOCUSIGN_ACCOUNT_ID=production_id
# ... other production settings
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Use Redis for caching
- Implement database indexing
- Use CDN for static assets

### Frontend
- Enable lazy loading for images
- Use service workers for offline support
- Implement code splitting
- Minify and compress assets

---

## Backup & Disaster Recovery

### MongoDB Backup
```bash
# Create backup
mongodump --uri="mongodb+srv://..." --out=/backups/db-backup

# Restore backup
mongorestore --uri="mongodb+srv://..." /backups/db-backup
```

### Automated Backups
- Enable MongoDB Atlas automated backups
- Set up AWS S3 backup replication
- Test restore procedures monthly

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set CORS to specific domains
- [ ] Use environment variables for secrets
- [ ] Enable database authentication
- [ ] Set up API rate limiting
- [ ] Enable request validation
- [ ] Use CSRF tokens
- [ ] Implement API authentication
- [ ] Enable request logging
- [ ] Regular security audits

---

## Troubleshooting Deployments

### Application won't start
- Check logs: `heroku logs --tail` or AWS CloudWatch
- Verify environment variables
- Check database connection
- Review error messages

### API endpoints not responding
- Check backend health endpoint
- Verify CORS configuration
- Check firewall/security groups
- Review API documentation

### Frontend showing errors
- Check browser console
- Verify API URL configuration
- Check network requests
- Clear browser cache

