'use client';

import * as React from 'react';
import * as SelectPrimitives from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitives.Root;
const SelectGroup = SelectPrimitives.Group;
const SelectValue = SelectPrimitives.Value;

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitives.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger>>(({ className, children, ...props }, ref) => (
  <SelectPrimitives.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitives.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitives.Icon>
  </SelectPrimitives.Trigger>
));
SelectTrigger.displayName = SelectPrimitives.Trigger.displayName;

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitives.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitives.Portal>
    <SelectPrimitives.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitives.Viewport
        className={cn(
          'p-1',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitives.Viewport>
    </SelectPrimitives.Content>
  </SelectPrimitives.Portal>
));
SelectContent.displayName = SelectPrimitives.Content.displayName;

const SelectLabel = React.forwardRef<React.ElementRef<typeof SelectPrimitives.Label>, React.ComponentPropsWithoutRef<typeof SelectPrimitives.Label>>(({ className, ...props }, ref) => (
  <SelectPrimitives.Label ref={ref} className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)} {...props} />
));
SelectLabel.displayName = SelectPrimitives.Label.displayName;

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitives.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>>(({ className, children, ...props }, ref) => (
  <SelectPrimitives.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitives.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitives.ItemIndicator>
    </span>
    <SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
  </SelectPrimitives.Item>
));
SelectItem.displayName = SelectPrimitives.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
};
