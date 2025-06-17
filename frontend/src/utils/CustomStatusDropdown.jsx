import React, { useState, useRef, useEffect } from 'react';
import { FaHourglassHalf, FaSyncAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const statusOptions = [
  { value: 'begin', label: 'Begin', icon: <FaHourglassHalf /> },
  { value: 'processing', label: 'Processing', icon: <FaSyncAlt className=' text-yellow-500'/> },
  { value: 'complete', label: 'Complete', icon: <FaCheckCircle className=' text-green-500'/> },
  { value: 'reject', label: 'Reject', icon: <FaTimesCircle className=' text-red-500'/> },
];

const CustomStatusDropdown = ({ value, rowId, handleStatusChange }) => {
  const [open, setOpen] = useState(false);
  // Local state is used to immediately reflect the new selection.
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  // When the parent value changes, update the local state.
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Determine the selected option based on selectedValue.
  const selectedOption = statusOptions.find((option) => option.value === selectedValue);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const onOptionSelect = (option) => {
    setOpen(false);
    setSelectedValue(option.value);
    // Notify the parent about the change.
    handleStatusChange(rowId, option.value);
  };

  // Close dropdown when clicked outside.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      <div
        onClick={toggleDropdown}
        className="border px-2 py-1 rounded text-sm cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <span className="ml-2">{selectedOption.label}</span>
            </>
          ) : (
            <span>Select status</span>
          )}
        </div>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => onOptionSelect(option)}
              className="px-3 py-2 flex items-center hover:bg-gray-200 cursor-pointer"
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomStatusDropdown;
