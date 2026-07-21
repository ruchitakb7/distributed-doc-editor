interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({
  size = "md",
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex h-full w-full items-center justify-center py-6">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-300 border-t-black`}
      />
    </div>
  );
}