export function BloomLogo({ className = "h-8 w-8" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Scalloped outer rosette outline */}
        <path
          d="M 18,1.5
             C 19.8,1.5 20.6,3.6 22.3,4.2
             C 24.0,4.8 26.2,4.3 27.5,5.6
             C 28.8,6.9 28.3,9.1 29.0,10.7
             C 29.6,12.4 31.8,13.2 32.0,15.0
             C 32.1,16.8 30.2,18.0 29.9,19.8
             C 29.6,21.5 30.6,23.5 29.8,25.0
             C 28.9,26.6 26.8,26.9 25.5,28.2
             C 24.2,29.4 23.8,31.7 22.1,32.5
             C 20.5,33.2 18.9,31.8 17.1,32.0
             C 15.3,32.2 13.7,33.9 12.0,33.5
             C 10.3,33.1 9.7,30.9 8.2,30.1
             C 6.7,29.3 4.5,29.5 3.5,28.0
             C 2.4,26.6 3.4,24.5 2.8,22.9
             C 2.2,21.2 0.5,20.0 0.5,18.2
             C 0.5,16.4 2.4,15.3 2.9,13.6
             C 3.4,11.9 2.5,9.8 3.5,8.4
             C 4.6,7.0 6.7,7.1 8.0,5.9
             C 9.4,4.7 10.0,2.5 11.7,1.9
             C 13.4,1.3 15.0,2.8 16.8,2.7
             Z"
          className="stroke-zinc-300 dark:stroke-zinc-700"
          strokeWidth="1.25"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Inner dark circular pill */}
        <circle cx="18" cy="18" r="11" className="fill-[#141416] dark:fill-black" />

        {/* Multi-color iridescent gradient star flower */}
        <defs>
          <linearGradient id="bloomGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA07A" />
            <stop offset="50%" stopColor="#FF69B4" />
            <stop offset="100%" stopColor="#9370DB" />
          </linearGradient>
          <linearGradient id="bloomGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEFA" />
            <stop offset="50%" stopColor="#FFB6C1" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>

        {/* 6-spoke iridescent bloom asterisk */}
        <g strokeWidth="1.75" strokeLinecap="round" opacity="0.95">
          {/* Vertical spoke */}
          <line x1="18" y1="12" x2="18" y2="24" stroke="url(#bloomGrad1)" />
          {/* 60 deg spoke */}
          <line x1="12.8" y1="15" x2="23.2" y2="21" stroke="url(#bloomGrad2)" />
          {/* 120 deg spoke */}
          <line x1="12.8" y1="21" x2="23.2" y2="15" stroke="url(#bloomGrad1)" />
        </g>

        {/* Central glowing core dot */}
        <circle cx="18" cy="18" r="1.5" fill="#FFE4B5" />
      </svg>
    </div>
  );
}
