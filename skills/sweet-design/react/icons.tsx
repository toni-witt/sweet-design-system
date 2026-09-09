type P = { className?: string };

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Icon = {
  skills: (p: P) => (
    <svg {...base} {...p}>
      <path d="M5 4.5h9l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V6a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M13.5 4.5V10H19M8.5 13.5h7M8.5 16.5h4" />
    </svg>
  ),
  proposals: (p: P) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 14l2.5 2.5L16 11" />
    </svg>
  ),
  team: (p: P) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0M16 6.2a3 3 0 0 1 0 5.6M17.5 14.4a5.5 5.5 0 0 1 3 5.1" />
    </svg>
  ),
  connections: (p: P) => (
    <svg {...base} {...p}>
      <path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0V8ZM12 17v4" />
    </svg>
  ),
  mcp: (p: P) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M8 9.5 10.5 12 8 14.5M13 15h3" />
    </svg>
  ),
  microsites: (p: P) => (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M3 9h18M6.5 6.8h.01M9 6.8h.01" />
    </svg>
  ),
  audit: (p: P) => (
    <svg {...base} {...p}>
      <path d="M5 4.5h9l5 5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19.5v-14A1 1 0 0 1 5 4.5Z" />
      <path d="M13.5 4.5V10H19M8 14h8M8 17.5h5" />
    </svg>
  ),
  settings: (p: P) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4.3 6.3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V2a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z" />
    </svg>
  ),
  search: (p: P) => (
    <svg {...base} strokeWidth={2} {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  ),
  bell: (p: P) => (
    <svg {...base} {...p}>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5.5-2 7-2 7h16s-2-1.5-2-7M13.7 19a2 2 0 0 1-3.4 0" />
    </svg>
  ),
  support: (p: P) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.4M12 17h.01" />
    </svg>
  ),
  panel: (p: P) => (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
    </svg>
  ),
  chevron: (p: P) => (
    <svg {...base} {...p}>
      <path d="m8 5 7 7-7 7" />
    </svg>
  ),
  plus: (p: P) => (
    <svg {...base} strokeWidth={2} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  copy: (p: P) => (
    <svg {...base} {...p}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" />
    </svg>
  ),
  external: (p: P) => (
    <svg {...base} {...p}>
      <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  ),
  lock: (p: P) => (
    <svg {...base} {...p}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </svg>
  ),
};
