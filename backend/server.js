import express from 'express';
import cors from 'cors';
import { generatePDF } from './pdfGenerator.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData.clientName || !formData.clientEmail || !formData.items || formData.items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate PDF
    const pdfBuffer = await generatePDF(formData);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Quotation-${formData.quotationNumber}.pdf`);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});