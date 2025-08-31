// AddCategory.tsx
import React from "react";

interface AddCategoryProps {
  onChange: (category: string) => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ onChange }) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700">Category</h3>
      <select 
        onChange={handleCategoryChange}
        className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="">Select a category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default AddCategory;




