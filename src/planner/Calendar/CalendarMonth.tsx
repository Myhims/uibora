import clsx from "clsx"
import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react"
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import { WeekDay } from "../../models/WeekDay"
import s from './Calendar.module.scss'
import { CalendarHelper } from "./CalendarHelper"
import type { CalendarDay } from "./Models/CalendarDay"
import type { CalendarEvent } from "./Models/CalendarEvent"
import type { MonthCalendarI18n } from "./i18n/MonthCalendarI18n"

export interface ICalendarMonthProps {
    startDayOfWeek: WeekDay
    startDay: Date
    calendarEvents: CalendarEvent[]
    i18n: MonthCalendarI18n
}

const CalendarMonth = ({
    startDayOfWeek = WeekDay.Sunday,
    startDay = new Date(),
    calendarEvents = [],
    i18n
}: ICalendarMonthProps) => {
    const [calendarInDays, setCalendarInDays] = useState<CalendarDay[][]>();
    const [eventsPortals, setEventsPortals] = useState<React.ReactPortal[]>([]);

    useEffect(() => {
        const displayDays = CalendarHelper.generateCalendarDays(startDay.getFullYear(), startDay.getMonth(), startDayOfWeek);
        setCalendarInDays(displayDays);
    }, [])

    const uniqueCalendarId = useMemo(() => {
        return uuidv4();
    }, [])

    const headerDays = useMemo(() => {
        const days = CalendarHelper.getWeekDays(startDayOfWeek, i18n);
        return <div className={s.calendar__header}>
            {days.map(d => {
                return <div className={s.calendar__header__day}>
                    {d}
                </div>
            })}
        </div>

    }, [startDayOfWeek])

    const monthEvents = (day: CalendarDay, eventsAmountByDay: { day: Number, amount: number }[], maxHeight: number | undefined) => {
        let events : ReactNode[] = [];

        if (calendarInDays === undefined)
            return events;

        const sortedEvents = [...calendarEvents].sort((a, b) => {
            const startedDiff = a.startedOn.getTime() - b.startedOn.getTime();
            return startedDiff !== 0 ? startedDiff : a.finishedOn.getTime() - b.finishedOn.getTime();
        });

        let moreEvents = 0;
        for (let event of sortedEvents) {
            const segments = CalendarHelper.getEventSegments(event, calendarInDays);
            for (let daySeg of segments) {
                if (daySeg.start === day.date?.getDate() && daySeg.end !== null) {
                    const size = (daySeg.end - daySeg.start + 1);

                    let minimalDayAmount = 1;
                    for (let i = 0; i < size; i++) {
                        const dayAmount = eventsAmountByDay.find(d => d.day === ((day.date?.getDate() ?? 0) + i));
                        if (dayAmount) {
                            dayAmount.amount++;
                            minimalDayAmount = dayAmount.amount;
                        }
                        else {
                            //get the amount from the actual delta
                            eventsAmountByDay.push({ day: day.date?.getDate() + i, amount: minimalDayAmount })
                        }
                    }

                    const eventsOfDay = eventsAmountByDay.find(d => d.day === day.date?.getDate())?.amount ?? 0;

                    if (maxHeight && ((eventsOfDay + 1) * 25) < maxHeight) {
                        events.push(<div
                            key={`event-${event.title}`}
                            style={{ width: `calc(${size * 100}% - 4px)`, top: `${(eventsOfDay - 1) * 25}px` }}
                            className={s.calendar__event}
                        >
                            <div className={s.calendar__event__content}>
                                {event.title}
                            </div>
                        </div>);
                    }
                    else {
                        moreEvents++;
                    }
                }
            }
        }

        if (moreEvents > 0) {
            events.push(<span className={s["calendar__week-line__single-day__more-event"]}>+{moreEvents}</span>)
        }

        return events;
    }

    const showCalendarDays = useMemo(() => {
        const today = new Date();

        return calendarInDays?.map((weeks, i) => {
            return <div key={`day-${i}`}
                className={s["calendar__week-line"]}
            >
                {weeks.map((day, index) => {
                    //search events starting today
                    return <div
                        data-guid={`calendar-${uniqueCalendarId}-day-${day.date?.getDate()}`}
                        key={`day-${day.date}-${index}`}
                        className={clsx(
                            s["calendar__week-line__single-day"],
                            day.isCurrentMonth ? '' : s["calendar__week-line__single-day--state-disabled"],
                            day.date?.getDate() === today.getDate() ? s["calendar__week-line__single-day--state-today"] : ''
                        )}>
                        {day.date?.getDate()}
                    </div>
                })}
            </div>
        })
    }, [calendarInDays]);

    const appendEvents = () => {
        let eventsAmountByDay: { day: Number, amount: number }[] = [];
        const newPortals: React.ReactPortal[] = [];

        calendarInDays?.map((weeks, i) => {
            weeks.filter(d => d.date !== null).map((day, index) => {
                //search events starting today
                const dataGuid = `calendar-${uniqueCalendarId}-day-${day.date?.getDate()}`;
                const dayCase = document.querySelectorAll(`[data-guid="${dataGuid}"]`);
                const events = monthEvents(day, eventsAmountByDay, dayCase[0]?.clientHeight);

                if (dayCase.length && dayCase[0])
                    newPortals.push(ReactDOM.createPortal(events, dayCase[0]));
            })
        })

        setEventsPortals(newPortals);
    }


    useLayoutEffect(() => {
        const handleResize = () => {
            appendEvents();
        };

        appendEvents();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showCalendarDays]);



    return <>
        {headerDays}
        {showCalendarDays}
        {eventsPortals}
    </>
}

export default CalendarMonth