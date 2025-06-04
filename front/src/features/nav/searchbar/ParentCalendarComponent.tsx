import Calendar from './features/Calendar';
import { useState } from 'react';

function ParentComponent() {
  const [openCalendarId, setOpenCalendarId] = useState<string | null>(null);

  return (
    <div className="flex gap-4">
      <Calendar
        id="checkin"
        label="Check In"
        openCalendarId={openCalendarId}
        setOpenCalendarId={setOpenCalendarId}
      />
      <Calendar
        id="checkout"
        label="Check Out"
        openCalendarId={openCalendarId}
        setOpenCalendarId={setOpenCalendarId}
      />
    </div>
  );
}

export default ParentComponent;
