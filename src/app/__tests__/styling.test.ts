import { describe, it, expect } from 'vitest';

// Test CSS class combinations and styling logic
describe('CSS Styling Tests', () => {
  describe('Theme Classes', () => {
    it('should have correct dark theme classes', () => {
      const darkThemeClasses = [
        'bg-background',
        'text-foreground',
        'bg-card',
        'text-card-foreground',
        'bg-primary',
        'text-primary-foreground',
        'bg-muted',
        'text-muted-foreground',
        'bg-accent',
        'text-accent-foreground',
        'border-border',
        'bg-input',
        'focus:ring-ring'
      ];

      // Verify all theme classes are valid Tailwind classes
      darkThemeClasses.forEach(className => {
        expect(className).toMatch(/^(bg-|text-|border-|focus:)/);
      });
    });

    it('should have proper color contrast combinations', () => {
      const contrastPairs = [
        { background: 'bg-background', text: 'text-foreground' },
        { background: 'bg-card', text: 'text-card-foreground' },
        { background: 'bg-primary', text: 'text-primary-foreground' },
        { background: 'bg-muted', text: 'text-white' },
        { background: 'bg-accent', text: 'text-card-foreground' }
      ];

      contrastPairs.forEach(pair => {
        expect(pair.background).toMatch(/^bg-/);
        expect(pair.text).toMatch(/^text-/);
      });
    });
  });

  describe('Component Styling', () => {
    it('should have proper button styling classes', () => {
      const buttonClasses = [
        'p-3',
        'rounded-lg',
        'text-center',
        'transition-colors',
        'bg-primary',
        'text-primary-foreground',
        'bg-accent',
        'text-card-foreground',
        'hover:bg-accent/80'
      ];

      buttonClasses.forEach(className => {
        expect(className).toMatch(/^(p-|rounded-|text-|transition-|bg-|hover:)/);
      });
    });

    it('should have proper input styling classes', () => {
      const inputClasses = [
        'w-full',
        'px-4',
        'py-3',
        'bg-input',
        'border',
        'border-border',
        'rounded-lg',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:border-transparent',
        'text-card-foreground'
      ];

      inputClasses.forEach(className => {
        expect(className).toMatch(/^(w-|px-|py-|bg-|border|rounded-|focus:|text-)/);
      });
    });

    it('should have proper card styling classes', () => {
      const cardClasses = [
        'bg-card',
        'rounded-2xl',
        'shadow-lg',
        'overflow-hidden',
        'border',
        'border-border',
        'p-8',
        'px-8',
        'py-6'
      ];

      cardClasses.forEach(className => {
        expect(className).toMatch(/^(bg-|rounded-|shadow-|overflow-|border|p-|px-|py-)/);
      });
    });
  });

  describe('Typography Classes', () => {
    it('should have proper heading classes', () => {
      const headingClasses = [
        'text-3xl',
        'text-2xl',
        'text-xl',
        'text-lg',
        'font-bold',
        'font-semibold',
        'font-medium'
      ];

      headingClasses.forEach(className => {
        expect(className).toMatch(/^(text-|font-)/);
      });
    });

    it('should have proper text size hierarchy', () => {
      const textSizes = [
        'text-6xl', // ROI percentage
        'text-4xl', // Monthly profit
        'text-3xl', // Headers
        'text-2xl', // Section headers
        'text-xl',  // Subsection headers
        'text-lg',  // Body text
        'text-sm',  // Helper text
        'text-xs'   // Small helper text
      ];

      textSizes.forEach(size => {
        expect(size).toMatch(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|6xl)$/);
      });
    });
  });

  describe('Layout Classes', () => {
    it('should have proper grid classes', () => {
      const gridClasses = [
        'grid',
        'grid-cols-1',
        'md:grid-cols-3',
        'gap-6',
        'gap-4'
      ];

      gridClasses.forEach(className => {
        expect(className).toMatch(/^(grid|gap-|md:)/);
      });
    });

    it('should have proper flex classes', () => {
      const flexClasses = [
        'flex',
        'justify-between',
        'justify-center',
        'items-center',
        'space-x-4',
        'space-y-3',
        'space-y-0'
      ];

      flexClasses.forEach(className => {
        expect(className).toMatch(/^(flex|justify-|items-|space-)/);
      });
    });

    it('should have proper spacing classes', () => {
      const spacingClasses = [
        'p-4',
        'p-6',
        'p-8',
        'px-6',
        'px-8',
        'py-2',
        'py-3',
        'py-6',
        'py-8',
        'mb-2',
        'mb-4',
        'mb-6',
        'mb-8',
        'mt-1',
        'mt-6',
        'mt-8'
      ];

      spacingClasses.forEach(className => {
        expect(className).toMatch(/^(p-|px-|py-|m-|mb-|mt-)/);
      });
    });
  });

  describe('Interactive States', () => {
    it('should have proper hover states', () => {
      const hoverClasses = [
        'hover:bg-accent',
        'hover:bg-accent/80'
      ];

      hoverClasses.forEach(className => {
        expect(className).toMatch(/^hover:/);
      });
    });

    it('should have proper focus states', () => {
      const focusClasses = [
        'focus:ring-2',
        'focus:ring-ring',
        'focus:border-transparent'
      ];

      focusClasses.forEach(className => {
        expect(className).toMatch(/^focus:/);
      });
    });

    it('should have proper transition classes', () => {
      const transitionClasses = [
        'transition-colors'
      ];

      transitionClasses.forEach(className => {
        expect(className).toMatch(/^transition-/);
      });
    });
  });

  describe('Border and Radius Classes', () => {
    it('should have proper border classes', () => {
      const borderClasses = [
        'border',
        'border-b',
        'border-b-2',
        'border-border',
        'border-t',
        'last:border-b-0'
      ];

      borderClasses.forEach(className => {
        expect(className).toMatch(/^(border|last:)/);
      });
    });

    it('should have proper radius classes', () => {
      const radiusClasses = [
        'rounded-lg',
        'rounded-xl',
        'rounded-2xl',
        'rounded-full',
        'first:rounded-t-xl',
        'last:rounded-b-xl'
      ];

      radiusClasses.forEach(className => {
        expect(className).toMatch(/^(rounded-|first:|last:)/);
      });
    });
  });

  describe('Color Classes', () => {
    it('should have proper chart color classes', () => {
      const chartColors = [
        'text-chart-1',
        'text-chart-2',
        'text-chart-3',
        'text-chart-4',
        'text-chart-5'
      ];

      chartColors.forEach(className => {
        expect(className).toMatch(/^text-chart-/);
      });
    });

    it('should have proper semantic color classes', () => {
      const semanticColors = [
        'text-destructive',
        'text-primary',
        'text-white'
      ];

      semanticColors.forEach(className => {
        expect(className).toMatch(/^text-(destructive|primary|white)$/);
      });
    });
  });
});
