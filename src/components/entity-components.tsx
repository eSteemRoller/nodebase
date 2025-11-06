



type EntityHeaderProps = { 
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & ( 
  | { onNew: () => void; newButtonHref? : never }
  | { newButtonHref: string; onNew? : never }
  | { onNew? : never; newButtonHref? : never }
);

export const EntityHeader = ({ 
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  newButtonHref,
} : EntityHeaderProps) => { 
  return ( 
    <div className="flex flex-row justify-between items-center gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description}
      </div>
    </div>
  );
};
