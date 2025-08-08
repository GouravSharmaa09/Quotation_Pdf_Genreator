import { useState, useEffect } from 'react';

import axios from 'axios';

const QuotationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Client details
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientGstin: '', // Added GSTIN field
    
    // Quotation metadata
    quotationNumber: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    terms: 'Net 30 days',
    gstRate: 18,
    discountPercentage: 0, // New discount percentage field
    
    // Service and Warranty details
    serviceWarranty: {
      description: '',
      duration: '12 months',
      conditions: 'Standard terms and conditions apply'
    },
    
    // Company details (can be made dynamic later)
    companyName: 'Your Company Name',
    companyAddress: 'Your Company Address',
    companyEmail: 'company@example.com',
    companyPhone: '+1 234 567 8900',
    companyGstin: '', // Added Company GSTIN field
    companyLogo: '', // Base64 or URL
    
    // Items
    items: [
      { id: 1, name: '', description: '', quantity: 1, rate: 0 }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { id: formData.items.length + 1, name: '', description: '', quantity: 1, rate: 0 }
      ]
    });
    
    // Clear error if we now have 1 or more items
    if (formData.items.length + 1 >= 1) {
      setError('');
    }
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: updatedItems
      });
      
      // Show error if removing would result in less than 1 item
      if (updatedItems.length < 1) {
        setError('Please add at least 1 item to the quotation');
      }
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * item.rate);
    }, 0);
  };

  const calculateGST = () => {
    return (calculateSubtotal() * formData.gstRate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    const discountPercentage = parseFloat(formData.discountPercentage) || 0;
    const discountAmount = (subtotal * discountPercentage) / 100;
    return subtotal + gst - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate minimum 1 item
    if (formData.items.length < 1) {
      setError('Please add at least 1 item to the quotation');
      return;
    }
    
    setLoading(true);
    
     try {
      const backendUrl = 'https://quotation-111.onrender.com';
      const response = await axios.post(`${backendUrl}/api/generate-pdf`, formData, {
        responseType: 'blob' // Important for handling PDF binary data
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation-${formData.quotationNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      setLoading(false);
    }
  };

  // Add initial items to reach minimum 1 if needed
  const addInitialItems = () => {
    if (formData.items.length < 1) {
      const itemsToAdd = 1 - formData.items.length;
      const newItems = [...formData.items];
      
      for (let i = 0; i < itemsToAdd; i++) {
        newItems.push({ 
          id: formData.items.length + i + 1, 
          name: '', 
          description: '', 
          quantity: 1, 
          rate: 0 
        });
      }
      
      setFormData({
        ...formData,
        items: newItems
      });
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-4 sm:px-0 fade-in">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded flex justify-between items-center" role="alert">
          <p>{error}</p>
          <button 
            type="button" 
            onClick={addInitialItems}
            className="btn-primary text-xs py-1 px-2"
          >
            Add {1 - formData.items.length} More Items
          </button>
        </div>
  
      )}
      
      {/* Client Information Section */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="input-field hover:border-purple-400 h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              name="clientCompany"
              value={formData.clientCompany}
              onChange={handleChange}
              className="input-field hover:border-purple-400 h-10 text-lg border border-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GSTIN Number</label>
            <input
              type="text"
              name="clientGstin"
              value={formData.clientGstin}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              placeholder="e.g., 22AAAAA0000A1Z5"
            />
          </div>
        </div>
      </div>

      {/* Quotation Details Section */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quotation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
            <input
              type="text"
              name="quotationNumber"
              value={formData.quotationNumber}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="quotationDate"
              value={formData.quotationDate}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Terms</label>
            <input
              type="text"
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GST Rate (%)</label>
            <input
              type="number"
              name="gstRate"
              value={formData.gstRate}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Service and Warranty Section */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Service & Warranty Information</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service & Warranty Description</label>
            <textarea
              name="serviceWarranty.description"
              value={formData.serviceWarranty.description}
              onChange={(e) => setFormData({
                ...formData,
                serviceWarranty: {
                  ...formData.serviceWarranty,
                  description: e.target.value
                }
              })}
              className="input-field h-20 text-lg w-full border border-gray-400"
              placeholder="Describe the service and warranty terms here..."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Warranty Duration</label>
              <input
                type="text"
                name="serviceWarranty.duration"
                value={formData.serviceWarranty.duration}
                onChange={(e) => setFormData({
                  ...formData,
                  serviceWarranty: {
                    ...formData.serviceWarranty,
                    duration: e.target.value
                  }
                })}
                className="input-field h-10 text-lg border border-gray-400"
                placeholder="e.g., 12 months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
              <input
                type="text"
                name="serviceWarranty.conditions"
                value={formData.serviceWarranty.conditions}
                onChange={(e) => setFormData({
                  ...formData,
                  serviceWarranty: {
                    ...formData.serviceWarranty,
                    conditions: e.target.value
                  }
                })}
                className="input-field h-10 text-lg border border-gray-400"
                placeholder="e.g., Standard terms and conditions apply"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Company Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Email</label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Phone</label>
            <input
              type="text"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              className="input-field h-10 text-lg border border-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company GSTIN</label>
            <input
              type="text"
              name="companyGstin"
              value={formData.companyGstin}
              onChange={handleChange}
              className="input-field hover:border-purple-400 h-10 text-lg border border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Discount Section */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Discount</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              className="input-field hover:border-green-400 h-10 text-lg border border-gray-400"
              min="0"
              max="100"
              placeholder="e.g., 10 for 10%"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
        <div className="space-y-4">
        
        {formData.items.map((item, index) => (
          <div key={item.id} className="mb-6 p-4 border border-gray-200 rounded-md transition-all duration-300 hover:border-purple-300 hover:shadow-md bg-white card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Item #{index + 1}</h3>
              <button 
                type="button" 
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-110"
                disabled={formData.items.length === 1}
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="input-field h-10 text-lg border border-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="input-field h-10 text-lg border border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="input-field h-10 text-lg border border-gray-400"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rate</label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                  className="input-field h-10 text-lg border border-gray-400"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <p className="text-right font-medium">
                  Item Total: ₹{(item.quantity * item.rate).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addItem}
          className="mt-4 btn-primary"
        >
          Add Another Item
        </button>

        {/* Summary Section */}
        <div className="mt-8 border-t border-gray-200 pt-6 bg-white p-4 rounded-md shadow-sm">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
            <p>Subtotal</p>
            <p>₹{calculateSubtotal().toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
            <p>GST ({formData.gstRate}%)</p>
            <p>₹{calculateGST().toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
            <p>Total</p>
            <p>₹{calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>



      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:scale-105 btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : 'Generate Quotation PDF'}
        </button>
      </div>
    </form>
  );
};

export default QuotationForm;
