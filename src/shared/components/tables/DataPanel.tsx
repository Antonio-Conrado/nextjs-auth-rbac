type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DataPanel({ children, className = "" }: Props) {
  return (
    <div className={`w-full border rounded-md p-5 ${className}`}>
      {children}
    </div>
  );
}
