interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="min-h-0 flex-1 py-5">
      <p className="text-text-muted max-h-48 overflow-y-auto pe-3 leading-relaxed lg:max-h-56">
        {description}
      </p>
    </div>
  );
}
