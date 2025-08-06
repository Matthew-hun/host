import React, { FC, JSX } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type BadgeType = "legendary" | "epic" | "rare" | "common";

export type BadgeProps = {
  icon: React.ComponentType<any>;
  label: string;
  desc: string;
  type: BadgeType;
};

const Badge: FC<BadgeProps> = ({ icon, label, desc, type }) => {
  const IconComponent = icon;
  return (
    <div className="absolute -right-3 -top-3">
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`
                relative w-8 h-8 flex justify-center items-center p-1 rounded-full border-2 backdrop-blur-sm
                hover:scale-110 transition-all duration-200
                ${
                  type === "legendary"
                    ? "border-[#FFB300] bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
                    : type === "epic"
                    ? "border-[#7E57C2] bg-gradient-to-br from-purple-500/20 to-pink-600/20"
                    : type === "rare"
                    ? "border-[#42A5F5] bg-gradient-to-br from-yellow-500/20 to-orange-600/20"
                    : "border-[#B0BEC5] bg-gradient-to-br from-gray-500/20 to-gray-600/20"
                }
              `}
          >
            <IconComponent
              size={20}
              color={
                type == "legendary"
                  ? "#FFB300"
                  : type == "epic"
                  ? "#7E57C2"
                  : type == "rare"
                  ? "#42A5F5"
                  : "#B0BEC5"
              }
            />
            {type === "legendary" && (
              <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400/20"></div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{label}</p>
            <p>{desc}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Badge;
