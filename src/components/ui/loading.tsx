import React from 'react';
import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-white/20 border-t-primary',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingSkeleton({ className, children }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'loading-shimmer animate-pulse rounded-lg bg-gray-800/50',
        className
      )}
      role="status"
      aria-label="Loading content"
    >
      {children}
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('wow-card space-y-4', className)}>
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-4/5" />
        <LoadingSkeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export function LoadingState({
  isLoading,
  error,
  children,
  loadingComponent,
  errorComponent,
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        {loadingComponent || (
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-white/70">Loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        {errorComponent || (
          <div className="wow-card text-center">
            <div className="text-red-400 mb-2">Error</div>
            <p className="text-white/70">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
