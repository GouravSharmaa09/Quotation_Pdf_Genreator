import { useState } from 'react'
import QuotationForm from './components/QuotationForm'
import './App.css'

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 py-6 flex flex-col justify-center sm:py-12">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 sm:hidden">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-40 bg-purple-900 bg-opacity-90 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out sm:hidden`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
          <h2 className="text-2xl font-bold text-white">Quotation Generator</h2>
          <button 
            onClick={toggleMobileMenu}
            className="text-white hover:text-purple-200 transition-colors duration-300"
          >
            Close Menu
          </button>
        </div>
      </div>
      
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl opacity-20"></div>
        <div className="relative px-4 py-10 bg-white shadow-xl sm:rounded-3xl sm:p-12 md:p-16 lg:p-20 backdrop-blur-sm bg-white/90">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6 slide-in-heading" style={{ backgroundSize: '200% auto', animation: 'gradientText 3s ease infinite, slideInFromLeft 1s ease-out forwards' }}>Quotation PDF Generator</h1>
              <p className="text-gray-600 mb-8 text-lg fade-in" style={{ animationDelay: '0.5s' }}>Fill in the form below to generate a professional quotation PDF</p>
            </div>
            <QuotationForm />
          </div>
        </div>
      </div>
      
      {/* Floating Help Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:scale-105"
          aria-label="Help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowHelp(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">How to Use the Quotation Generator</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">2. Add at least 1 item to your quotation (required).</p>
                      <p className="text-sm text-gray-500 mb-2">3. Set the GST rate as needed.</p>
                      <p className="text-sm text-gray-500 mb-2">4. Click "Generate Quotation PDF" to create and download your PDF.</p>
                      <p className="text-sm text-gray-500 mt-4 font-semibold">Note: All fields marked with * are required.</p>
                    <p className="text purple colour-purple mt-12 ml-10 bg-white font-semibold">Devloped By Gourav Sharma</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-base font-medium text-white hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowHelp(false)}
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App