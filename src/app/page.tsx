export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-body">
      <main className="flex flex-col items-center gap-8 px-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary">
          Welcome
        </h1>
        <p className="max-w-md text-lg text-text-secondary">
          Your Next.js app is ready with a custom color palette configured.
        </p>
      </main>
    </div>
  );
}
