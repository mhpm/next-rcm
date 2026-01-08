import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  className?: string;
  withText?: boolean;
}

const sizeClasses: Record<LogoSize, { container: string; icon: string }> = {
  sm: {
    container: 'h-8 w-8 rounded-lg',
    icon: 'w-5 h-5',
  },
  md: {
    container: 'h-10 w-10 rounded-xl',
    icon: 'w-6 h-6',
  },
  lg: {
    container: 'h-14 w-14 rounded-2xl',
    icon: 'w-8 h-8',
  },
  xl: {
    container: 'h-24 w-24 rounded-3xl',
    icon: 'w-14 h-14',
  },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const { container, icon } = sizeClasses[size];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center text-white shrink-0',
        // Enhanced gradient with an extra step ("degradado extra")
        'bg-linear-to-br from-primary via-primary/90 to-primary/70',
        'shadow-lg shadow-primary/25',
        'ring-1 ring-white/20',
        container,
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className={cn('fill-current', icon)}
      >
        <path d="M206,44H178L128,124L78,44H50C42,44,36,50,36,58V198C36,206,42,212,50,212H74C82,212,88,206,88,198V106L122,160C123,162,125,164,128,164C131,164,133,162,134,160L168,106V198C168,206,174,212,182,212H206C214,212,220,206,220,198V58C220,50,214,44,206,44Z" />
      </svg>
    </div>
  );
}
