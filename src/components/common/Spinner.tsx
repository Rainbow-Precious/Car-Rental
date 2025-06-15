import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  fullScreen = false,
  text,
}) => {
  // Determine spinner size based on prop
  let spinnerSize: string;
  let fontSize: string;

  switch (size) {
    case "sm":
      spinnerSize = "w-8 h-8";
      fontSize = "text-xs";
      break;
    case "md":
      spinnerSize = "w-12 h-12";
      fontSize = "text-sm";
      break;
    case "lg":
      spinnerSize = "w-16 h-16";
      fontSize = "text-base";
      break;
    case "xl":
      spinnerSize = "w-24 h-24";
      fontSize = "text-lg";
      break;
    default:
      spinnerSize = "w-12 h-12";
      fontSize = "text-sm";
  }

  // The spinner component
  const SpinnerElement = (
    <div className={`relative ${spinnerSize}`}>
      {/* Background track */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-700 opacity-25"></div>

      {/* Animated gradient spinner */}
      <div className="absolute inset-0 rounded-full border-t-4 border-l-4 border-r-4 border-transparent animate-spin-slow">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-600 blur-sm opacity-20 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-75 -rotate-90 origin-center"></div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-transparent opacity-10 animate-pulse"></div>

      {/* Inner circle with CBT logo or initials */}
      <div className="absolute inset-0 m-2 rounded-full bg-black flex items-center justify-center">
        <span className="text-yellow-500 font-bold animate-pulse">CBT</span>
      </div>
    </div>
  );

  // For fullscreen mode
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        {SpinnerElement}
        {text && (
          <p
            className={`mt-4 text-yellow-500 font-medium ${fontSize} animate-pulse`}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  // For inline use
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {SpinnerElement}
      {text && (
        <p className={`mt-2 text-yellow-500 font-medium ${fontSize}`}>{text}</p>
      )}
    </div>
  );
};

export default Spinner;
