export function ComingSoonPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-1 py-6 text-center">
      <h2 className="text-[20px]">{title}</h2>
      <p className="body-text mt-2 text-[var(--color-muted)]">{description}</p>
    </div>
  );
}
