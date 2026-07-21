interface LoaderProps {
  text?: string;
}

export default function Loader({
  text = "Loading...",
}: LoaderProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />

        <span className="text-sm text-gray-600">
          {text}
        </span>
      </div>
    </div>
  );
}