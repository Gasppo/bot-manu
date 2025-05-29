import express from 'express';

export const createDevRoutes = (app: express.Application) => {
  // Only enable in development
  if (process.env.NODE_ENV !== 'production') {
    
    // Simulate Instagram message for testing
    app.get('/test/instagram', (req, res) => {
      res.json({
        message: "Test the Instagram flow",
        testUrl: "wa.me/5491140887031?text=Hola%2C%20quiero%20más%20información%20sobre%20Znapp",
        instructions: "Use this message to test: 'Hola, quiero más información sobre Znapp'"
      });
    });

    // Test service selection
    app.get('/test/services', (req, res) => {
      res.json({
        message: "Test service selection",
        options: [
          "Send '1' for Znapp flow",
          "Send '2' for Znapp Lite flow", 
          "Send '3' for other inquiries"
        ]
      });
    });

    // Database viewer
    app.get('/test/db', (req, res) => {
      try {
        const fs = require('fs');
        const dbContent = fs.readFileSync('./db.json', 'utf8');
        res.json(JSON.parse(dbContent));
      } catch (error) {
        res.json({ error: "No database file found or empty" });
      }
    });

    // Clear database (for testing)
    app.post('/test/clear-db', (req, res) => {
      try {
        const fs = require('fs');
        fs.writeFileSync('./db.json', '{}');
        res.json({ message: "Database cleared successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to clear database" });
      }
    });

    console.log("🔧 Development test routes enabled:");
    console.log("   GET /test/instagram - Instagram flow test info");
    console.log("   GET /test/services - Service selection test info");  
    console.log("   GET /test/db - View database contents");
    console.log("   POST /test/clear-db - Clear database for testing");
  }
};
