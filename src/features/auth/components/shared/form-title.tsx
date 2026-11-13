import FormDivider from "./form-divider";

/**
 * Title shown at the top of an auth form (e.g. "Welcome back!").
 * Each auth form sets its own title while the surrounding shell stays the same.
 */
export default function FormTitle({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-great-vibes text-primary mb-4 text-center text-xl font-medium sm:text-6xl">
        {title}
      </h1>
      <FormDivider />
    </div>
  );
}
