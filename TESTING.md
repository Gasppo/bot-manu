# 🧪 Znapp Bot Testing Guide

## Manual Testing Scenarios

### 1. Instagram Link Flow
**Test Message**: `Hola, quiero más información sobre Znapp`
**Expected**: Should trigger InstagramWelcomeFlow with personalized welcome message

### 2. Service Selection
**Test Messages**: 
- `1` or `znapp` (should go to ZnappFlow)
- `2` or `lite` (should go to ZnappLiteFlow)
- `3` or `otro` (should provide contact information)

### 3. Znapp Flow (Field Services)
**Step 1 - Locations**: Test responses:
- `A` or `1-20` → Should accept and move to step 2
- `B` or `21-50` → Should accept and move to step 2
- `C` or `51-100` → Should accept and move to step 2
- `D` or `más de 100` → Should accept and move to step 2
- `invalid input` → Should ask to choose again

**Step 2 - Geography**: 
- Any text input → Should accept and move to step 3

**Step 3 - Company Type**:
- Any text input → Should accept and move to step 4

**Step 4 - Contact Preference**:
- `1` or `ahora` → Should show summary and end
- `2` or `tarde` → Should show summary and end
- Any other text → Should treat as custom time preference

### 4. Znapp Lite Flow (Team Management)
**Step 1 - Company Type**:
- Any text input → Should accept and move to step 2

**Step 2 - Team Size**:
- `A` or `1-10` → Should accept and move to step 3
- `B` or `11-50` → Should accept and move to step 3
- `C` or `51-200` → Should accept and move to step 3
- `D` or `más de 200` → Should accept and move to step 3

**Step 3 - Contact Preference**:
- Same as Znapp Flow step 4

### 5. Fallback Scenarios
**Test Messages**:
- `hola` → Should show general welcome
- `ayuda` → Should show service options
- `equipo` → Should suggest Znapp Lite
- Random text → Should show service options

## Automated Testing Commands

### Health Check
```bash
curl http://localhost:3008/v1/health
```

### Status Check
```bash
curl http://localhost:3008/v1/status
```

### Webhook Verification
```bash
curl "http://localhost:3008/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test_challenge"
```

## Expected Console Logs

When testing leads capture, you should see console logs like:

```javascript
// For Znapp Flow
Nueva consulta Znapp: {
  telefono: "+1234567890",
  ubicaciones: "1-20",
  localizacion: "Buenos Aires",
  empresa: "Retail",
  contacto: "Quiere ser contactado ahora",
  timestamp: "2025-05-29T..."
}

// For Znapp Lite Flow
Nueva consulta Znapp Lite: {
  telefono: "+1234567890",
  empresa: "Logística",
  equipoSize: "11-50",
  contacto: "Horario preferido: mañana",
  timestamp: "2025-05-29T..."
}
```

## Database Verification

Check the `db.json` file to see stored conversation states:

```bash
cat db.json | jq '.'
```

## Performance Testing

Monitor memory and CPU usage during extended conversations:

```bash
# Check process stats
ps aux | grep node

# Monitor in real-time
top -pid $(pgrep -f "tsx watch")
```

## Error Testing

Test error scenarios:
1. Send very long messages (>1000 characters)
2. Send special characters and emojis
3. Send messages rapidly (rate limiting)
4. Test with invalid phone number formats

## Production Readiness Checklist

- [ ] All flows work correctly
- [ ] Error handling doesn't crash the bot
- [ ] Lead capture logs are complete
- [ ] Health checks respond correctly
- [ ] Webhook verification works
- [ ] Environment variables are properly configured
- [ ] Database persistence works across restarts
- [ ] Memory usage is stable over time
