export const AttributeSectionWrapper = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="pb-4">
      <div className="bg-grey900 p-2 text-grey100">{heading}</div>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6 p-2">
        {children}
      </div>
    </div>
  );
};
