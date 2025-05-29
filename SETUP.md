# Znapp WhatsApp Bot - Setup Guide

## 🚀 Quick Start

The bot is now fully configured and ready to run! Here's what has been completed:

### ✅ Completed Features

1. **Complete Flow System**:
   - **Instagram Welcome Flow**: Handles "Hola, quiero más información sobre Znapp" message
   - **Service Selection Flow**: Routes users to appropriate services
   - **Znapp Flow**: 4-step process for field services
   - **Znapp Lite Flow**: 3-step process for team management software

2. **Technical Setup**:
   - TypeScript configuration with BuilderBot framework
   - Meta WhatsApp provider integration
   - JSON file database for persistence
   - Health check endpoint
   - Error handling and validation

3. **Bot Capabilities**:
   - Multi-step conversation flows
   - State management between steps
   - Input validation and error handling
   - Lead capture with console logging (CRM-ready)

## 🔧 Environment Configuration

Before deploying to production, update the `.env` file with your actual WhatsApp Business API credentials:

```env
PORT=3008
VERIFY_TOKEN=your_actual_verify_token
JWT_TOKEN=your_actual_jwt_token
NUMBER_ID=your_actual_number_id
VERSION=v17.0
NODE_ENV=production
```

## 📱 Instagram Link Integration

The bot is configured to handle the specific Instagram link:
```
wa.me/5491140887031?text=Hola%2C%20quiero%20más%20información%20sobre%20Znapp
```

When users click this link, they'll be automatically routed to the Instagram Welcome Flow.

## 🏃‍♂️ Running the Bot

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Health Check
Visit: http://localhost:3008/v1/health

## 📋 Next Steps for Production

1. **WhatsApp Business API Setup**:
   - Get your WhatsApp Business API credentials from Meta
   - Update the `.env` file with real credentials
   - Configure webhook URL in Meta Developer Console

2. **Deployment**:
   - Deploy to a cloud service (AWS, Google Cloud, Heroku, etc.)
   - Ensure the webhook URL is publicly accessible with HTTPS
   - Configure environment variables in your hosting platform

3. **CRM Integration**:
   - The bot logs all leads to console
   - Integrate with your CRM system by modifying the console.log statements
   - Add database persistence for leads if needed

4. **Testing**:
   - Test all conversation flows
   - Verify Instagram link integration
   - Test error handling scenarios

## 🔍 Conversation Flow Summary

### Instagram Welcome → Service Selection
Users arriving from Instagram link get a personalized welcome and service options.

### Znapp Flow (Field Services)
1. **Ubicaciones**: Number of locations (1-20, 21-50, 51-100, 100+)
2. **Localización**: Geographic areas
3. **Empresa**: Company type/industry
4. **Contacto**: Contact preference (now or later)

### Znapp Lite Flow (Team Management)
1. **Empresa**: Company type/industry  
2. **Equipo**: Team size (1-10, 11-50, 51-200, 200+)
3. **Contacto**: Contact preference (now or later)

## 📊 Lead Capture

All leads are logged to console with structured data including:
- Phone number
- Service type (Znapp or Znapp Lite)
- All collected information
- Timestamp

This data is ready for CRM integration or database storage.
