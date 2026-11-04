/**
 * Title shown at the top of an auth form (e.g. "Welcome back!").
 * Each auth form sets its own title while the surrounding shell stays the same.
 */
export default function FormTitle({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-monsieur text-center text-5xl font-normal text-white sm:text-6xl">
        {title}
      </h1>
      <div className="mt-6 border-t border-zinc-700/60" />
    </div>
  );
}
