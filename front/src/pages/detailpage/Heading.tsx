interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

function Heading({ title, subtitle, center = false }: HeadingProps) {
  return (
    <div className={`w-full ${center ? 'text-center' : 'text-start'}`}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export default Heading;