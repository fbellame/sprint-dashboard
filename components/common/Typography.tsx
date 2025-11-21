import { ReactNode, HTMLAttributes, ElementType } from 'react';

/**
 * Typography Component
 *
 * Provides consistent typography styles throughout the application.
 * Can be used as components or via Tailwind classes.
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Heading 1</Typography>
 * <Typography variant="body">Body text</Typography>
 * ```
 */

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-3xl font-bold text-gray-900',
  h3: 'text-2xl font-semibold text-gray-900',
  h4: 'text-xl font-semibold text-gray-900',
  h5: 'text-lg font-medium text-gray-900',
  h6: 'text-base font-medium text-gray-900',
  body: 'text-base text-gray-700',
  'body-sm': 'text-sm text-gray-700',
  caption: 'text-xs text-gray-500',
  label: 'text-sm font-medium text-gray-700',
};

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'label',
};

export function Typography({
  variant,
  children,
  as,
  className = '',
  ...props
}: TypographyProps) {
  const Component = as || defaultElements[variant];
  const baseStyles = variantStyles[variant];

  return (
    <Component className={`${baseStyles} ${className}`} {...props}>
      {children}
    </Component>
  );
}

/**
 * Typography Usage Guide
 *
 * You can use the Typography component or Tailwind classes directly:
 *
 * Component approach:
 * ```tsx
 * <Typography variant="h1">Heading</Typography>
 * ```
 *
 * Tailwind classes approach (recommended for flexibility):
 * ```tsx
 * <h1 className="text-4xl font-bold text-gray-900">Heading</h1>
 * ```
 *
 * Available Tailwind typography classes:
 * - Headings: text-4xl, text-3xl, text-2xl, text-xl, text-lg, text-base
 * - Font weights: font-bold, font-semibold, font-medium, font-normal
 * - Text colors: text-gray-900, text-gray-700, text-gray-500
 * - Line heights: Default line heights are configured in tailwind.config.ts
 */

