type Props = {
  title: string;
  className?: string;
};

export default function Title({ title, className = "" }: Props) {
  return (
    <>
      <div
        className={`rounded-xl p-5 shadow-xl mb-5 bg-gradient-to-r from-zinc-800  to-zinc-600 ${className}`}
      >
        <h1 className="text-4xl text-white">{title}</h1>
      </div>
    </>
  );
}
