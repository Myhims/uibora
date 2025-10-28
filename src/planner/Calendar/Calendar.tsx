import clsx from "clsx";
import type { HtmlAttributes } from "../../../node_modules/csstype/index";
import { WeekDay } from "../../models/WeekDay";
import s from './Calendar.module.scss';
import CalendarMonth from "./CalendarMonth";
import type { CalendarEvent } from "./Models/CalendarEvent";

interface ICalendarProps extends HtmlAttributes<HTMLDivElement> {
    startDayOfWeek?: WeekDay
    defautlDisplayMode?: 'month' | 'week' | 'day'
    startDay?: Date
    calendarEvents?: CalendarEvent[]
}

const Calendar = ({
    startDayOfWeek = WeekDay.Sunday,
    defautlDisplayMode = 'month',
    startDay = new Date(),
    calendarEvents = [],
    className,
    ...props
}: ICalendarProps) => {

    return <div className={clsx(s.calendar, className)}>
        <Calendar.Month
            startDayOfWeek={startDayOfWeek}
            startDay={startDay}
            calendarEvents={calendarEvents}
        />
    </div>
}

Calendar.Month = CalendarMonth
export default Calendar;