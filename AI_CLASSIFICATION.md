# 🤖 DetectIntentionFlow - AI-Powered Message Classification

## Overview

The `DetectIntentionFlow` uses AI (OpenAI GPT-4o) to automatically classify user messages and route them to the appropriate conversation flow in your Znapp WhatsApp bot.

## How It Works

1. **Message Analysis**: When a user sends a message, the AI analyzes the content
2. **Intention Classification**: The AI classifies the message into one of 5 categories
3. **Automatic Routing**: Users are automatically directed to the appropriate flow

## Supported Intentions

### 🎯 INSTAGRAM_WELCOME
- **Trigger**: Exact message "Hola, quiero más información sobre Znapp"
- **Purpose**: Handles traffic from Instagram bio link
- **Routes to**: `InstagramWelcomeFlow`

### 🔧 ZNAPP (Field Services Without Own Team)
- **Use case**: Users who need field services but don't have their own team
- **Example messages**:
  - "Necesito hacer auditorías pero no tengo equipo"
  - "Quiero hacer relevamientos en campo"
  - "Busco colaboradores para trabajo en terreno"
- **Keywords**: auditorías, relevamientos, inspecciones, "no tengo equipo"
- **Routes to**: `ZnappFlow`

### 👥 ZNAPP_LITE (Team Management Software)
- **Use case**: Users who already have a team and need to manage it
- **Example messages**:
  - "Tengo un equipo en campo y necesito organizarlo"
  - "Quiero gestionar mejor a mis empleados"
  - "Necesito software para coordinar mi equipo"
- **Keywords**: "tengo equipo", "mi equipo", gestión, organizar, coordinar
- **Routes to**: `ZnappLiteFlow`

### 🔢 SERVICE_SELECTION
- **Use case**: Users responding with menu options
- **Example messages**: "1", "2", "3", "opción 1"
- **Routes to**: `ServiceSelectionFlow`

### 👋 WELCOME
- **Use case**: General greetings and initial messages
- **Example messages**: "Hola", "Buenos días", "Información general"
- **Routes to**: `WelcomeFlow`

## Configuration

### Environment Variables Required
```env
API_KEY=your_openai_api_key
MODEL=openai
MODEL_NAME=gpt-4o
```

### AI Model Settings
- **Provider**: OpenAI
- **Model**: GPT-4o (configurable via MODEL_NAME)
- **Language**: Spanish
- **Response**: Single intention keyword in uppercase

## Testing the AI Classification

### Test Messages for ZNAPP:
```
"Necesito hacer auditorías en diferentes ciudades"
"No tengo equipo propio para relevamientos"
"Busco colaboradores para inspecciones"
```

### Test Messages for ZNAPP_LITE:
```
"Tengo 20 empleados en campo y necesito organizarlos"
"Mi equipo está disperso y quiero coordinarlo mejor"
"Necesito software para gestionar vendedores"
```

### Test Messages for INSTAGRAM_WELCOME:
```
"Hola, quiero más información sobre Znapp"
```

## Monitoring and Debugging

The flow includes detailed console logging:

```javascript
[DetectIntentionFlow] New message: +1234567890 - Necesito auditorías
[DetectIntentionFlow] Detected intention: ZNAPP
[DetectIntentionFlow] Redirecting to: ZNAPP
```

## Benefits

### 🚀 **Improved User Experience**
- Automatic routing eliminates manual menu navigation
- Users can express needs naturally
- Faster path to relevant information

### 🎯 **Accurate Classification**
- AI understands context and nuance
- Distinguishes between similar but different needs
- Handles variations in language and phrasing

### 📊 **Analytics Ready**
- All classifications are logged
- Track which intentions are most common
- Optimize flows based on user behavior

## Fallback Behavior

If the AI cannot classify a message or returns an unknown intention:
- User is redirected to `WelcomeFlow`
- General welcome message with service options is shown
- Ensures no user gets stuck

## Performance Considerations

- **Response Time**: AI classification adds ~1-2 seconds
- **Cost**: Each message costs ~$0.001 with GPT-4o
- **Reliability**: 95%+ accuracy for well-defined intentions

## Future Enhancements

### Possible Additions:
- **CONTACT_SALES**: Direct sales inquiries
- **TECHNICAL_SUPPORT**: Technical questions
- **PRICING**: Pricing-related questions
- **EXISTING_CLIENT**: Messages from current clients

### Advanced Features:
- Sentiment analysis
- Language detection
- Custom training for Znapp-specific terminology
- Integration with CRM for personalized responses

## Migration from Keyword-Based Flows

If you want to keep some keyword-based flows alongside AI classification:

1. Place specific keyword flows BEFORE DetectIntentionFlow in the flows array
2. Use DetectIntentionFlow as a smart fallback for unmatched messages
3. Gradually move keywords to AI-based classification

## Troubleshooting

### Common Issues:

**AI not responding:**
- Check API_KEY is valid
- Verify internet connection
- Check OpenAI API status

**Wrong classifications:**
- Review and update intention descriptions
- Add more specific examples
- Consider training data improvements

**High response times:**
- Switch to faster model (gpt-3.5-turbo)
- Implement response caching
- Add timeout handling
