import React, { useState, useRef, useEffect } from "react";
import { FaHourglassHalf, FaSyncAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const statusOptions = [
  { value: "begin", label: "Begin", icon: <FaHourglassHalf className="text-yellow-500" /> },
  { value: "processing", label: "Processing", icon: <FaSyncAlt className="text-blue-500 animate-spin" /> },
  { value: "complete", label: "Complete", icon: <FaCheckCircle className="text-green-500" /> },
  { value: "reject", label: "Reject", icon: <FaTimesCircle className="text-red-500" /> },
];

const CustomStatusDropdown = ({ value, rowId, handleStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleSelect = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  const onUpdateClick = () => {
    if (selectedStatus !== value) {
      handleStatusChange(rowId, selectedStatus);
    }
  };
  useEffect(() => {
    setSelectedStatus(value); // Sync with external prop updates
  }, [value]);
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = statusOptions.find((opt) => opt.value === selectedStatus);

  return (
    <div className="" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-1 border rounded bg-white text-sm"
      >
        <span className="flex items-center gap-2 w-23">
          {selected?.icon}
          {selected?.label}
        </span>
        <span className="ml-1">&#x25BC;</span>
      </button>

      {isOpen && (
        <div className=" z-10 w-full mt-1 border bg-white rounded shadow">
          {statusOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-3 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-sm"
            >
              {opt.icon}
              {opt.label}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onUpdateClick}
        disabled={selectedStatus === value}
        className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 cursor-pointer"
      >
        Update
      </button>
    </div>
  );
};

export default CustomStatusDropdown;
