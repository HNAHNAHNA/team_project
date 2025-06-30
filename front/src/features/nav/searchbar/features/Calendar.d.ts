import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
type Props = {
    id: string;
    label: string;
    openCalendarId: string | null;
    setOpenCalendarId: (id: string | null) => void;
};
declare function Calendar({ id, label, openCalendarId, setOpenCalendarId }: Props): import("react/jsx-runtime").JSX.Element;
export default Calendar;
