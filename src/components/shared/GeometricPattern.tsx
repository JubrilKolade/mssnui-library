export function GeometricPattern({
  className = "",
  id = "mssn-girih",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg aria-hidden="true" className={className} width="100%" height="100%">
      <defs>
        <pattern
          id={id}
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="56" cy="0" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="56" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="56" cy="56" r="24" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
