import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import type { Range, RangeKeyDict } from 'react-date-range';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  id: string;
  label: string;
  openCalendarId: string | null;
  setOpenCalendarId: (id: string | null) => void;
};

function Calendar({ id, label, openCalendarId, setOpenCalendarId }: Props) {
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);

  const isOpen = openCalendarId === id;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenCalendarId(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setOpenCalendarId]);

  const handleClick = () => {
    setOpenCalendarId(isOpen ? null : id);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative w-[200px] h-[64px] px-8 flex flex-col justify-center rounded-full hover:bg-gray-100 cursor-pointer"
      onClick={handleClick}
    >
      <p>{label}</p>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 z-50"
          >
            <DateRange
              onChange={(ranges: RangeKeyDict) =>
                setState([ranges.selection])
              }
              ranges={state}
              months={1}
              direction="vertical"
              moveRangeOnFirstSelection={false}
              showSelectionPreview={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Calendar;