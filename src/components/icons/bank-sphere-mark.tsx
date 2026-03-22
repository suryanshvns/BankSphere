type BankSphereMarkProps = {
  className?: string;
};

/** Brand symbol: orbit arcs + core — use on gradient badge or `currentColor` surfaces */
export function BankSphereMark({ className }: BankSphereMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" opacity={0.4} />
      <path
        d="M12 3a9 9 0 016.364 15.364"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 21a9 9 0 01-6.364-15.364"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}
