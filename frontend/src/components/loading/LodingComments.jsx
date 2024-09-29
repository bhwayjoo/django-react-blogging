import React from 'react'

function LodingComments() {
    return (
        <div className="bg-white animate-pulse p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
            <div className="w-1/5 h-3 bg-gray-300 rounded"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/5 h-3 bg-gray-300 rounded mb-2"></div>
        </div>
      );
    };

export default LodingComments
