import '../styles/logo3d.css';

export default function Logo3D({ size = 80, animated = false }) {
  return (
    <div
      className={`logo-3d ${animated ? 'logo-3d--animated' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="logoFlap" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="logoCoin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <ellipse cx="50" cy="90" rx="28" ry="4" fill="#0F172A" opacity="0.15" />
        <rect x="14" y="36" width="72" height="44" rx="10" fill="url(#logoBody)" />
        <path d="M14 46 Q50 26 86 46 L86 54 Q50 38 14 54 Z" fill="url(#logoFlap)" />
        <rect x="58" y="54" width="20" height="14" rx="3" fill="#0F172A" opacity="0.25" />
        <circle cx="72" cy="32" r="14" fill="url(#logoCoin)" stroke="#FFFDF5" strokeWidth="1.5" />
        <path
          d="M65 32 L70 37 L80 24"
          fill="none"
          stroke="#FFFDF5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
