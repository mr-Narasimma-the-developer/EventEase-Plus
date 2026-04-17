import React, { useState } from 'react';
import { eventTemplates } from '../data/eventTemplates';

const EventTemplateSelector = ({ onSelectTemplate }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template.template);
    setShowTemplates(false);
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setShowTemplates(!showTemplates)}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold flex items-center space-x-2"
      >
        <span>📋</span>
        <span>Use Event Template</span>
      </button>

      {showTemplates && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {eventTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-600 hover:shadow-lg transition"
            >
              <div className="text-4xl text-center mb-2">{template.icon}</div>
              <h3 className="font-bold text-center mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-3">{template.description}</p>
              
              <div className="bg-purple-50 rounded p-2 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{template.template.maxAttendees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-semibold">₹{template.template.suggestedBudget.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm font-semibold">
                Use This Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTemplateSelector;