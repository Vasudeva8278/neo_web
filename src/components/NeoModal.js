import React from "react";
import "../styles/NeoModal.css"; // Import custom CSS if needed

const NeoModal = ({ isOpen, onClose, children, templates = [], selectedTemplate, setSelectedTemplate }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className='fixed inset-0 z-40 bg-gray-900 bg-opacity-50'
        onClick={onClose}
      ></div>
      <div className='fixed inset-0 z-50 overflow-auto flex justify-center items-center'>
        
        <div className='relative bg-white rounded-lg shadow-lg w-1/2 mx-auto'>
          <button
            className='absolute top-4 right-4 text-black text-3xl'
            onClick={onClose}
          >
            &times;
          </button>
          {/* Render templates list if provided */}
          {templates && templates.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Templates</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                {templates.map((template) => (
                  <label key={template._id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="template"
                      value={template._id}
                      checked={selectedTemplate === template._id}
                      onChange={() => setSelectedTemplate(template._id)}
                    />
                    <span>{template.fileName}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : templates && (
            <div></div>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export default NeoModal;
