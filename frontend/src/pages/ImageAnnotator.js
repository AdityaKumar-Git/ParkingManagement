import React, { useState, useRef } from 'react';

const ImageAnnotator = () => {
  const [rectangles, setRectangles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / rect.width; // Normalize X
    const startY = (e.clientY - rect.top) / rect.height; // Normalize Y
    setStartCoords({ x: startX, y: startY });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = imageRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / rect.width; // Normalize X
    const currentY = (e.clientY - rect.top) / rect.height; // Normalize Y
    const width = Math.abs(currentX - startCoords.x);
    const height = Math.abs(currentY - startCoords.y);
    
    // Calculate center coordinates
    const centerX = Math.min(startCoords.x, currentX) + width / 2;
    const centerY = Math.min(startCoords.y, currentY) + height / 2;

    setCurrentRect({
      x: centerX,
      y: centerY,
      width: width,
      height: height,
    });
  };

  const handleMouseUp = () => {
    if (currentRect) {
      setRectangles([...rectangles, currentRect]);
      setCurrentRect(null);
    }
    setIsDrawing(false);
  };

  const handleRectangleClick = (index) => {
    const newRectangles = rectangles.filter((_, i) => i !== index);
    setRectangles(newRectangles);
  };

  const handleSubmit = () => {
    alert(JSON.stringify(rectangles));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative inline-block mb-4">
        <img
          ref={imageRef}
          src="https://www.parking.net/upload/about-parking/iStock-519196006.jpg"
          alt="Annotate"
          className="w-500 h-auto border border-gray-300 shadow-md"
          onContextMenu={handleContextMenu}
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        {rectangles.map((rect, index) => (
          <div
            key={index}
            onClick={() => handleRectangleClick(index)}
            className="absolute border-2 border-red-500 cursor-pointer"
            style={{
              left: `${(rect.x - rect.width / 2) * 100}%`, // Adjust for center
              top: `${(rect.y - rect.height / 2) * 100}%`, // Adjust for center
              width: `${rect.width * 100}%`, // Convert normalized width to percentage
              height: `${rect.height * 100}%`, // Convert normalized height to percentage
            }}
          />
        ))}
        {currentRect && (
          <div
            className="absolute border-2 border-dashed border-blue-500"
            style={{
              left: `${(currentRect.x - currentRect.width / 2) * 100}%`, // Adjust for center
              top: `${(currentRect.y - currentRect.height / 2) * 100}%`, // Adjust for center
              width: `${currentRect.width * 100}%`, // Convert normalized width to percentage
              height: `${currentRect.height * 100}%`, // Convert normalized height to percentage
            }}
          />
        )}
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default ImageAnnotator;
