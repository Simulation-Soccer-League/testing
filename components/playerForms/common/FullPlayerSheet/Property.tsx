import { VisuallyHidden } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const Property = ({
  label,
  value,
  className,
  children,
}: PropsWithChildren<{
  label: string;
  value?: string | number | null;
  className?: string;
}>) => (
  <div className="flex flex-nowrap items-center whitespace-nowrap">
    <VisuallyHidden>{`${label}: ${value}`}</VisuallyHidden>
    <span className="mr-2 font-bold" aria-hidden={Boolean(value)}>
      {label}:{' '}
    </span>
    <p
      className={`max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap lg:max-w-[400px] ${
        className ?? ''
      }`}
    >
      {!children && <span aria-hidden={Boolean(value)}>{value}</span>}
      {children}
    </p>
  </div>
);
