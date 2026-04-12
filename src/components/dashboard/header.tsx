interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white">{heading}</h1>
        {text && <p className="text-slate-400">{text}</p>}
      </div>
      {children}
    </div>
  );
}
