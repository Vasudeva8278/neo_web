import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function generateHighlightId() {
  return 'highlight-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

const transformHighlight = (highlight) => ({
  labels: [
    {
      label: highlight.label,
      value: highlight.text
    }
  ],
  type: highlight.type || "text"
});

const LabelsComponent = ({
  newHighlight,
  setNewHighlight,
  onSave, // callback to parent to save
  existingLabels = [],
  labelType,
  content, // pass the current content (HTML) from parent
}) => {
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // For new label
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHighlight((prev) => ({
      ...prev,
      [name]: value,
      id: prev.id || generateHighlightId(),
      content, // always attach current content
    }));
  };

  // For existing label
  const handleLabelChange = (e) => {
    const selected = e.target.value;
    setSelectedLabel(selected);
    setNewHighlight((prev) => ({
      ...prev,
      label: selected,
      id: prev.id || generateHighlightId(),
      content,
    }));
  };

  const handleValueChange = (e) => {
    setNewHighlight((prev) => ({
      ...prev,
      text: e.target.value,
      id: prev.id || generateHighlightId(),
      content,
    }));
  };

  // Save handler
  const handleSave = async () => {
    if (newHighlight.label && newHighlight.text && newHighlight.id) {
      setIsSaving(true);
      try {
        // Transform highlight to backend format
        const transformed = transformHighlight(newHighlight);
        await onSave(transformed);
        toast.success("Saved successfully!");
      } catch (e) {
        toast.error("Failed to save. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className='w-full mx-auto bg-white rounded-lg shadow-md'>
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="text-white text-lg">Saving...</div>
        </div>
      )}
      {/* Tab Buttons */}
      <div className='flex border-b'>
        <button
          className={`w-1/2 py-2 text-center font-semibold ${
            activeTab === "existing"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("existing")}
        >
          Existing
        </button>
        <button
          className={`w-1/2 py-2 text-center font-semibold ${
            activeTab === "new"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("new")}
        >
          New
        </button>
      </div>

      {/* Tab Content */}
      <div className='p-6'>
        {activeTab === "existing" && (
          <div>
            <div className='mb-4'>
              <select
                value={selectedLabel}
                onChange={handleLabelChange}
                className='w-full border border-gray-300 p-2 rounded'
              >
                <option value='' disabled>
                  Select a label
                </option>
                {Array.isArray(existingLabels) &&
                  existingLabels.map((label, index) => (
                    <option key={index} value={label}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>
            <div className='flex border rounded-md px-2 py-2'>
              <input
                type='text'
                placeholder='Label'
                name='label'
                className='w-full border border-gray-300 p-2 rounded mr-2'
                value={newHighlight.label || ""}
                readOnly
              />
              <input
                type='text'
                placeholder='Value'
                name='text'
                className='w-full border border-gray-300 p-2 rounded'
                value={newHighlight.text || ""}
                onChange={handleValueChange}
                hidden={labelType === "text" ? false : true}
              />
            </div>
          </div>
        )}
        {activeTab === "new" && (
          <div className='flex border rounded-md px-2 py-2 w-full '>
            <input
              type='text'
              placeholder='Label'
              name='label'
              className='w-full border border-gray-300 p-2 rounded mr-2'
              value={newHighlight.label || ""}
              onChange={handleInputChange}
            />
            <input
              type='text'
              placeholder='Value'
              name='text'
              className='w-full border border-gray-300 p-2 rounded'
              value={newHighlight.text || ""}
              onChange={handleInputChange}
              hidden={labelType === "text" ? false : true}
            />
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            className={`px-4 py-2 rounded ${newHighlight.label && newHighlight.text && newHighlight.id ? "bg-indigo-600 text-white" : "bg-gray-400 text-gray-600 cursor-not-allowed"}`}
            onClick={handleSave}
            disabled={!(newHighlight.label && newHighlight.text && newHighlight.id)}
          >
            Save
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LabelsComponent;