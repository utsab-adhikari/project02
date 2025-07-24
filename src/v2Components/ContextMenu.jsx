import { useState, useRef, useEffect } from 'react';
import { FaEllipsisV } from 'react-icons/fa';

export function ContextMenu({ blogId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white p-2 hover:bg-white/20 rounded-full"
      >
        <FaEllipsisV size={16} />
      </button>

      {open && (
        <div className="absolute right-7 top-0 w-36 bg-gray-800 text-white rounded-md shadow-lg z-50">
          <ul className="text-sm">
            <li className="hover:bg-gray-700 border-b border-white px-4 py-2 cursor-pointer">Edit</li>
            <li className="hover:bg-gray-700 px-4 py-2 border-1/2 border-b border-white cursor-pointer">Publish</li>
            <li className="hover:bg-gray-700 px-4 py-2 border-b border-white cursor-pointer text-red-400">🗑️ Discard</li>
          </ul>
        </div>
      )}
    </div>
  );
}
