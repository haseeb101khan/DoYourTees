export default function StorefrontLoading() {
  return (
    <div className="container-pad animate-pulse py-10" aria-label="Loading page">
      <div className="h-8 w-36 bg-ink/10" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <div className="aspect-[4/5] bg-ink/10" />
            <div className="mt-4 h-4 w-3/4 bg-ink/10" />
            <div className="mt-3 h-4 w-1/3 bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
