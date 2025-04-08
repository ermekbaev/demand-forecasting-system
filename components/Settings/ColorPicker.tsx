import React from 'react';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  colors, 
  selectedColor, 
  onColorSelect 
}) => {
  return (
    <div className="flex space-x-3">
      {colors.map((color, index) => (
        <div 
          key={index}
          className={`w-10 h-10 rounded-full border-2 border-white cursor-pointer ${
            color === selectedColor ? 'ring-2 ring-indigo-500' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;