"use client";

type DisplacementTextProps = {
  text: string;
  fontSize?: number;
  className?: string;
  lightColor?: string;
  darkColor?: string;
};

export default function DisplacementText({
  text,
  fontSize = 300,
  className = "",
  lightColor = "#171717",
  darkColor = "#e5e5e5",
}: DisplacementTextProps) {
  return (
    <div className={`overflow-hidden select-none ${className}`}>
      <svg
        viewBox={`0 0 ${text.length * 180} 200`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lightColor} stopOpacity="0.08" />
            <stop offset="50%" stopColor={lightColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={lightColor} stopOpacity="0.08" />
          </linearGradient>
          <filter id="displacement">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="900"
          fill="url(#textGradient)"
          filter="url(#displacement)"
          className="dark:hidden"
        >
          {text}
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="900"
          fill={darkColor}
          fillOpacity="0.08"
          filter="url(#displacement)"
          className="hidden dark:block"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
