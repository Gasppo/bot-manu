# 🚀 Znapp WhatsApp Bot - Deployment Guide

## Current Status ✅

Your Znapp WhatsApp Bot is **COMPLETE** and ready for deployment! 

### What's Working:
- ✅ Complete conversation flows (Instagram welcome, service selection, Znapp, Znapp Lite)
- ✅ Error handling and fallback responses
- ✅ Lead capture with console logging (CRM-ready)
- ✅ Health check and status endpoints
- ✅ WhatsApp webhook verification endpoint
- ✅ TypeScript compilation and build system
- ✅ JSON database for conversation persistence

### Available Endpoints:
- `GET /v1/health` - Health check
- `GET /v1/status` - Detailed status and uptime
- `GET /webhook` - WhatsApp webhook verification
- `POST /webhook` - WhatsApp message handling (handled by BuilderBot)

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
Update `.env` with your actual WhatsApp Business API credentials:

```env
PORT=3008
VERIFY_TOKEN=your_actual_whatsapp_verify_token
JWT_TOKEN=your_actual_whatsapp_jwt_token  
NUMBER_ID=your_actual_whatsapp_number_id
VERSION=v17.0
NODE_ENV=production
```

### 2. WhatsApp Business API Setup
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app and add WhatsApp Business API
3. Get your credentials:
   - **JWT Token**: From App Settings > WhatsApp > Configuration
   - **Number ID**: Your WhatsApp Business phone number ID
   - **Verify Token**: Create a secure random string

### 3. Choose Deployment Platform

#### Option A: Railway (Recommended - Free tier available)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option B: Heroku
```bash
# Install Heroku CLI and login
heroku create znapp-whatsapp-bot
git push heroku main
```

#### Option C: DigitalOcean App Platform
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with one click

#### Option D: AWS/Google Cloud
Use their container services or EC2/Compute Engine instances

### 4. Configure Webhook URL
Once deployed, configure your webhook URL in Meta Developer Console:
```
https://your-app-domain.com/webhook
```

## 🧪 Testing Your Deployed Bot

### 1. Health Checks
```bash
curl https://your-app-domain.com/v1/health
curl https://your-app-domain.com/v1/status
```

### 2. Webhook Verification
Meta will automatically verify your webhook when you save the configuration.

### 3. Instagram Link Test
Test the Instagram link integration:
```
wa.me/5491140887031?text=Hola%2C%20quiero%20más%20información%20sobre%20Znapp
```

## 📊 Monitoring & Maintenance

### Log Monitoring
Monitor your application logs for:
- Lead captures: `Nueva consulta Znapp:` and `Nueva consulta Znapp Lite:`
- Errors: `[Error` messages
- Performance: Response times and memory usage

### Database Backups
The bot uses `db.json` for conversation state. In production, consider:
- Regular backups of the JSON file
- Upgrading to a proper database (PostgreSQL, MongoDB)
- Implementing log rotation

### CRM Integration
Currently, leads are logged to console. To integrate with your CRM:

1. **Find the lead capture logs** in these files:
   - `src/flows/ZnappFlow.ts` (around line 95)
   - `src/flows/ZnappLiteFlow.ts` (around line 75)

2. **Replace console.log with your CRM API calls**:
```typescript
// Example: Replace this
console.log("Nueva consulta Znapp:", leadData);

// With this
await sendToCRM(leadData);
```

## 🔧 Performance Optimization

### For High Volume
If expecting high message volume:

1. **Add rate limiting**:
```bash
npm install express-rate-limit
```

2. **Implement queue system**:
```bash
npm install bull redis
```

3. **Use a real database**:
```bash
npm install @builderbot/database-postgres
# or
npm install @builderbot/database-mongo
```

## 🆘 Troubleshooting

### Common Issues:

**1. Webhook not receiving messages**
- Check that your URL is publicly accessible via HTTPS
- Verify the verify token matches exactly
- Check Meta Developer Console for webhook errors

**2. Bot not responding**
- Check application logs for errors
- Verify environment variables are set correctly
- Test health endpoint

**3. Messages getting stuck**
- Check the `db.json` file for corrupted conversation state
- Clear conversation state if needed
- Monitor memory usage

### Support Resources:
- [BuilderBot Documentation](https://builderbot.vercel.app/)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Meta Developer Support](https://developers.facebook.com/support)

## 🎉 You're Ready!

Your Znapp WhatsApp Bot is fully functional and ready for production use. The bot will:

1. **Handle Instagram traffic** with the specific welcome message
2. **Guide users through service selection** (Znapp vs Znapp Lite)
3. **Collect comprehensive lead information** through multi-step flows
4. **Provide fallback responses** for unexpected messages
5. **Log all leads** in a structured format ready for CRM integration

Just deploy it with your WhatsApp Business API credentials and you're live! 🚀
