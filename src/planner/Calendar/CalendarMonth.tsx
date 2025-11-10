import clsx from "clsx"
import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react"
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import { WeekDay } from "../../models/WeekDay"
import { CalendarHelper } from "./CalendarHelper"
import s from './CalendarMonth.module.scss'
import type { CalendarDay } from "./Models/CalendarDay"
import type { CalendarEvent } from "./Models/CalendarEvent"
import type { MonthCalendarI18n } from "./i18n/MonthCalendarI18n"

export interface ICalendarMonthProps {
    startDayOfWeek: WeekDay
    startDate: Date
    calendarEvents: CalendarEvent[]
    i18n: MonthCalendarI18n
}

type DragAndDropElement = {
    event: CalendarEvent
    type: 'drag' | 'resize-start' | 'resize-end'
}

const CalendarMonth = ({
    startDayOfWeek = WeekDay.Sunday,
    startDate = new Date(),
    calendarEvents = [],
    i18n
}: ICalendarMonthProps) => {
    const [calendarInDays, setCalendarInDays] = useState<CalendarDay[][]>();
    const [eventsPortals, setEventsPortals] = useState<React.ReactPortal[]>([]);
    const [calendarEventsManaged, setCalendarEventsManaged] = useState<CalendarEvent[]>(CalendarHelper.FilterEventsForMonth(calendarEvents, startDate));

    useEffect(() => {
        const displayDays = CalendarHelper.generateCalendarDays(startDate.getFullYear(), startDate.getMonth(), startDayOfWeek);
        setCalendarInDays(displayDays);
    }, [])

    const uniqueCalendarId = useMemo(() => {
        return uuidv4();
    }, [])

    const headerDays = useMemo(() => {
        const days = CalendarHelper.getWeekDays(startDayOfWeek, i18n);
        return <div className={s['calendar-month__header']}>
            {days.map((d, i) => {
                return <div className={s['calendar-month__header__day']} key={`cmhd-${d}-${i}`}>
                    {d}
                </div>
            })}
        </div>

    }, [startDayOfWeek])

    /* Drag and Drop */
    const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, event: CalendarEvent) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ event, type: 'drag' } as DragAndDropElement));
    }, [calendarEventsManaged]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, day: CalendarDay) => {
        e.preventDefault();
        e.currentTarget.classList.add(s['calendar-month__week-line__single-day--state-drag-over'] ?? '');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove(s['calendar-month__week-line__single-day--state-drag-over'] ?? '');
    };

    const handleDropResize = useCallback((e: React.DragEvent<HTMLDivElement>, day: CalendarDay) => {
        e.preventDefault();

        dragAndDropDraw(e, day);
    }, [calendarEventsManaged]);

    const dragAndDropDraw = useCallback((e: React.DragEvent<HTMLDivElement>, day: CalendarDay) => {
        e.preventDefault();

        let newEvents: CalendarEvent[] = [...calendarEventsManaged];
        const data = JSON.parse(e.dataTransfer.getData('text/plain')) as DragAndDropElement;

        switch (data.type) {
            case 'drag': newEvents = CalendarHelper.MoveEventOn(data.event, day, calendarEventsManaged);
                break;
            case "resize-start": newEvents = CalendarHelper.ResizeEventOnFromStart(data.event, day, calendarEventsManaged);
                break;
            case "resize-end": newEvents = CalendarHelper.ResizeEventOnFromEnd(data.event, day, calendarEventsManaged);
                break;
        }
        setCalendarEventsManaged(newEvents);
        handleDragLeave(e);
    }, [calendarEventsManaged]);

    /* Resize */
    const handleResizeStart = useCallback((e: React.DragEvent<HTMLDivElement>, event: CalendarEvent) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ event, type: 'resize-start' } as DragAndDropElement));
    }, [calendarEventsManaged]);

    const handleResizeEnd = useCallback((e: React.DragEvent<HTMLDivElement>, event: CalendarEvent) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ event, type: 'resize-end' } as DragAndDropElement));
    }, [calendarEventsManaged]);

    /* Events display */
    const monthEvents = (day: CalendarDay, eventsAmountByDay: { day: Number, amount: number }[], maxHeight: number | undefined) => {
        let events: ReactNode[] = [];

        if (calendarInDays === undefined)
            return events;

        const sortedEvents = [...calendarEventsManaged].sort((a, b) => {
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
                            className={s['calendar-month__event']}
                        >
                            <div className={s['calendar-month__event__resizer-left']}
                                draggable onDragStart={(e) => handleResizeStart(e, event)}
                            ></div>
                            <div className={s['calendar-month__event__content']}
                                draggable
                                onDragStart={(e) => handleDragStart(e, event)}
                            >
                                <div>
                                    {event.title}
                                </div>
                            </div>
                            <div className={s['calendar-month__event__resizer-right']}
                                draggable onDragStart={(e) => handleResizeEnd(e, event)}
                            ></div>
                        </div>);
                    }
                    else {
                        moreEvents++;
                    }
                }
            }
        }

        if (moreEvents > 0) {
            events.push(<span className={s["calendar-month__week-line__single-day__more-event"]}>+{moreEvents}</span>)
        }

        return events;
    }

    const showCalendarDays = useMemo(() => {
        const today = new Date();

        return calendarInDays?.map((weeks, i) => {
            return <div key={`day-${i}`}
                className={s["calendar-month__week-line"]}
            >
                {weeks.map((day, index) => {
                    //search events starting today
                    const dandProps = day.isCurrentMonth ? {
                        onDragOver: (e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, day),
                        onDrop: (e: React.DragEvent<HTMLDivElement>) => handleDropResize(e, day)
                    } : {}

                    return <div
                        data-guid={`calendar-month-${uniqueCalendarId}-day-${day.date?.getDate()}`}
                        key={`day-${day.date}-${index}`}
                        onDragLeave={handleDragLeave}
                        {...dandProps}
                        className={clsx(
                            s["calendar-month__week-line__single-day"],
                            day.isCurrentMonth ? '' : s["calendar-month__week-line__single-day--state-disabled"],
                            day.date?.getDate() === today.getDate() ? s["calendar-month__week-line__single-day--state-today"] : ''
                        )}>
                        {day.date?.getDate()}
                    </div>
                })}
            </div>
        })
    }, [calendarInDays, calendarEventsManaged]);

    const appendEvents = () => {
        let eventsAmountByDay: { day: Number, amount: number }[] = [];
        const newPortals: React.ReactPortal[] = [];

        calendarInDays?.map((weeks, i) => {
            weeks.filter(d => d.date !== null).map((day, index) => {
                //search events starting today
                const dataGuid = `calendar-month-${uniqueCalendarId}-day-${day.date?.getDate()}`;
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
    }, [showCalendarDays, calendarEventsManaged]);



    return <>
        {headerDays}
        {showCalendarDays}
        {eventsPortals}
    </>
}

export default CalendarMonth