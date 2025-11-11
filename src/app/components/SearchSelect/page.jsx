
"use client";
import React, { useState, useEffect, useRef } from "react";

function SearchSelect({
  options = [],
  onChange,
  onAddNew,
  placeholder = "ค้นหาหรือเพิ่มข้อมูลใหม่..",
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState(options);
  const [showList, setShowList] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // ปิด dropdown เมื่อคลิกนอก component

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setShowList(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, []);

  // ฟิวเตอร์ข้อมูล

  const filtered = list.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (value) => {
    setQuery(value);
    setShowList(false);
    if (onChange) onChange(value);
  };

  const handleAdd = async () => {
    const newItem = query.trim();
    if (!newItem) return;
    // เพิ่มลงใน List
    const updated = [...list, newItem].sort((a, b) => a.localeCompare(b, "th"));
    setList(updated);
    handleSelect(newItem);

    // ถ้ามี onAddNew -> เรียก API
    if (onAddNew) await onAddNew(newItem);

    // Focus กลับ input
    setTimeout(() => inputRef.current?.focus(), 150);
  };
  return (
    <div className={`relative w-72 ${className}`} ref={containerRef}>
      <input 
      ref={inputRef} 
      type="text" 
      className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
      placeholder={placeholder} 
      value={query} 
       
      onFocus={() => setShowList(true)} />
    </div>
  );
}

export default SearchSelect;
