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
    <div className="flex flex-wrap gap-3">
      {colors.map((color, index) => (
        <div 
          key={index}
          className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
            color === selectedColor ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border-white'
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
          title={`Цвет ${index + 1}`}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;