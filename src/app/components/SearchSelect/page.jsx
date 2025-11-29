"use client";
import { useCombobox } from "downshift";
import React, { useState, useEffect, useRef } from "react";

function SearchSelect({ items }) {
  const [inputItems, setInputItems] = useState(items);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    selectedItem,
    getComboboxProps,
    getLabelProps,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? item.label : ""),
    onInputValueChange({ inputValue }) {
      setInputItems(
        items.filter((item) =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    },
  });

  return (
    <main className="w-64">
      <label {...getLabelProps()} className="block mb-1 font-medium">
        เลือกข้อมูล
      </label>
      <div {...getComboboxProps()} className="relative">
        {/* Input */}
        <input
          {...getInputProps()}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 outline-none"
          placeholder="ค้นหา..."
        />
        {/* Dropdown */}

        <ul
          {...getMenuProps()}
          className={`absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-50
          max-h-60 overflow-auto ${
            isOpen && inputItems.length > 0 ? "" : "hidden"
          } `}
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                key={item.value}
                {...getItemProps({ item, index })}
                className={`px-4 py-2 cursor-pointer ${
                  highlightedIndex === index ? "bg-blue-100" : ""
                }
                ${
                  selectedItem === item ? "bg-blue-200 font-semibold" : ""
                }            
            `}
              >
                {item.label}
              </li>
            ))}
        </ul>
      </div>
    </main>
  );
}

export default SearchSelect;
