interface ErrorMessageProps {
  errors: string[];
}

export default function ErrorMessage({ errors }: ErrorMessageProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="text-red-500 text-sm ">
      {errors.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </div>
  );
}
