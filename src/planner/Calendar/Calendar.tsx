import clsx from "clsx";
import type { HtmlHTMLAttributes } from "react";
import { ButtonSize } from "../../buttons/models/ButtonSize";
import SplitButton from "../../buttons/SplitButton";
import { WeekDay } from "../../models/WeekDay";
import s from './Calendar.module.scss';
import CalendarMonth from "./CalendarMonth";
import type { MonthCalendarI18n } from "./i18n/MonthCalendarI18n";
import type { CalendarEvent } from "./Models/CalendarEvent";

export type CalendarI18n = MonthCalendarI18n & {};

interface ICalendarProps extends HtmlHTMLAttributes<HTMLDivElement> {
    startDayOfWeek?: WeekDay
    defautlDisplayMode?: 'month' | 'week' | 'day'
    startDay?: Date
    calendarEvents?: CalendarEvent[]
    i18n: CalendarI18n
}


const Calendar = ({
    startDayOfWeek = WeekDay.Sunday,
    defautlDisplayMode = 'month',
    startDay = new Date(),
    calendarEvents = [],
    className,
    i18n,
    ...props
}: ICalendarProps) => {

    return <div className={clsx(s.calendar, className)} {...props}>
        <div className={s['calendar__mode-selector']}>
            <SplitButton
                activeTab={0}
                className="custom"
                size={ButtonSize.small}
            >
                <SplitButton.Action title="Month" onClick={() => console.log('Month')} />
                <SplitButton.Action title="Week" onClick={() => console.log('Week')} />
                <SplitButton.Action title="Day" onClick={() => console.log('Day')} />
            </SplitButton>
        </div>
        <Calendar.Month
            startDayOfWeek={startDayOfWeek}
            startDate={startDay}
            calendarEvents={calendarEvents}
            i18n={i18n}
        />
    </div>
}

Calendar.Month = CalendarMonth;
(Calendar.Month as any).displayName = 'Calendar.Month';
export default Calendar;