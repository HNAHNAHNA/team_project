declare module 'react-date-range' {
  import * as React from 'react';

  export interface Range {
    startDate?: Date;
    endDate?: Date;
    key?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    showDateDisplay?: boolean;
  }

  export interface RangeKeyDict {
    [key: string]: Range;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange: (ranges: RangeKeyDict) => void;
    showSelectionPreview?: boolean;
    moveRangeOnFirstSelection?: boolean;
    months?: number;
    direction?: 'horizontal' | 'vertical';
  }

  export class DateRange extends React.Component<DateRangeProps> {}
}