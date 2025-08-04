import React from "react";

interface SemiDonutProps {
  percentage: number; // 0-100
  segments?: number;
}

const SemiDonut: React.FC<SemiDonutProps> = ({ percentage, segments = 7 }) => {
  const activeSegments = Math.round((percentage / 100) * segments);
  const radius = 100;

  const items = Array.from({ length: segments }, (_, i) => {
    const angle = (180 / (segments - 1)) * i;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    return (
      <div
        key={i}
        className={`absolute w-10 h-24 origin-bottom rounded-md transition-colors top-100 ${
          i < activeSegments ? "bg-blue-500" : "bg-gray-200"
        }`}
        style={{
          transform: `rotate(${angle - 90}deg) translateY(-${radius}px)`,
        }}
      />
    );
  });

  return (
    <div className="relative w-[220px] h-[120px] mx-auto my-10">
      {/* Szeletek */}
      {items}
      {/* Középső felirat */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold"></div>
    </div>
  );
};

export default SemiDonut;
