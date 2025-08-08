# Quotation PDF Generator

A web-based application that allows users to generate professional quotation PDFs by filling a simple form. The system takes input data, structures it properly, and generates a downloadable PDF using a predefined template.

## Features

### Frontend (React + Vite)
- Responsive form to collect:
  - Client details (name, company, email, phone)
  - Item details (name, description, quantity, rate)
  - Quotation metadata (quotation number, date, terms, GST, etc.)
- Button to "Generate PDF"

### Backend (Node.js + Puppeteer)
- Accepts form data from frontend
- Uses HTML/CSS template to generate quotation layout
- Converts HTML to PDF using Puppeteer (headless Chrome)
- Sends back the generated PDF to frontend for download

### PDF Template Structure
- Company logo & details
- Client details
- Table of quoted items with subtotal, tax, total
- Notes / Terms & Conditions
- Signature block

## Tech Stack

- **Frontend**: React (Vite), Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, Puppeteer
- **PDF Styling**: HTML/CSS with inline stylesheet

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

2. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Frontend Deployment (Vercel)

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Backend Deployment (Render)

1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your repository
4. Configure the build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set the environment variables as needed

## Future Enhancements

- Email PDF directly to client
- Save quote history in database
- Authentication for company users
- Multi-currency and multi-language support

## License

This project is licensed under the MIT License