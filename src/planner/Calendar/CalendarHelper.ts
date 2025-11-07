import type { WeekDay } from "../../models/WeekDay";
import type { MonthCalendarI18n } from "./i18n/MonthCalendarI18n";
import type { CalendarDay } from "./Models/CalendarDay";
import type { CalendarEvent } from "./Models/CalendarEvent";
import type { EventSegment } from "./Models/EventSegment";

export class CalendarHelper {


    public static getWeekDays(startDay: WeekDay, i18n: MonthCalendarI18n): string[] {
        const days = [
            i18n.sunday,
            i18n.monday,
            i18n.tuesday,
            i18n.wednesday,
            i18n.thursday,
            i18n.friday,
            i18n.saturday
        ];

        // Rotate the array based on the start day
        return [...days.slice(startDay), ...days.slice(0, startDay)];
    }


    /**
         * Returns all days of a given month as an array of Date objects.
         * @param year The year (e.g., 2025)
         * @param month The month (0 = January, 11 = December)
         */
    public static getDaysInMonth(year: number, month: number): Date[] {
        const date = new Date(year, month, 1);
        const days: Date[] = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }


    /**
         * Generates a matrix representing the weeks of the month.
         * Each week contains 7 elements (Date or null).
         * @param year The year (e.g., 2025)
         * @param month The month (0 = January)
         * @param startDayOfWeek The first day of the week
         * @returns A 2D array where each sub-array represents a week.
         */
    public static generateCalendarDays(
        year: number,
        month: number,
        startDayOfWeek: WeekDay
    ): CalendarDay[][] {
        const daysInMonth = this.getDaysInMonth(year, month);
        const firstDayOfWeek = new Date(year, month, 1).getDay();

        // Calculate offset
        let offset = firstDayOfWeek - startDayOfWeek;
        if (offset < 0) offset += 7;

        const weeks: CalendarDay[][] = [];
        let currentWeek: CalendarDay[] = Array(offset).fill({ date: null, isCurrentMonth: false });

        for (const day of daysInMonth) {
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push({ date: day, isCurrentMonth: true });
        }

        while (currentWeek.length < 7) {
            currentWeek.push({ date: null, isCurrentMonth: false });
        }
        weeks.push(currentWeek);

        return weeks;
    }

    public static getEventSegments(
        event: CalendarEvent,
        weeks: CalendarDay[][],
    ): EventSegment[] {


        const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

        const segments: EventSegment[] = [];

        let segmentCropped = false;
        weeks.map(week => {
            const realWeek = week.filter(w => w.date !== null);
            let lastWeekDate = realWeek[realWeek.length - 1]?.date;
            let weekSeg: EventSegment = { start: null, end: null };

            for (const cell of week) {
                if (cell.date !== null) {
                    if (cell.date.getDate() == event.startedOn.getDate() || segmentCropped) {
                        //save segment start
                        weekSeg.start = cell.date.getDate()
                        segmentCropped = false;
                    }
                    if (cell.date.getDate() == event.finishedOn.getDate()) {
                        weekSeg.end = cell.date.getDate()
                        segments.push({ ...weekSeg });
                        segmentCropped = false;
                    }
                    //if the segment is not finished, stop it at the end of the week
                    //and start a new one on the following week
                    if (weekSeg.start !== null && weekSeg.end === null && lastWeekDate !== null && cell.date.getDate() === lastWeekDate?.getDate()) {
                        weekSeg.end = cell.date.getDate()
                        segments.push({ ...weekSeg });
                        //clear the segment to create a new one
                        segmentCropped = true;
                    }
                }
            }
        });

        return segments;
    }

    public static MoveEventOn(
        moveTo: CalendarEvent,
        day: CalendarDay,
        sourceMap: CalendarEvent[]
    ): CalendarEvent[] {
        if (!day.date) return sourceMap;

        // Search the event from the source
        const indexToMove = sourceMap.findIndex(e => e.id === moveTo.id);
        if (indexToMove === -1) return sourceMap;

        const eventToMove = sourceMap[indexToMove];

        if(eventToMove === undefined) return sourceMap;

        // get event duration
        const duration = eventToMove.finishedOn.getTime() - eventToMove.startedOn.getTime();

        // Create the nex start based on the day
        const newStart = new Date(day.date);
        const newEnd = new Date(newStart.getTime() + duration);

        // Update the event
        const updatedEvent: CalendarEvent = {
            ...eventToMove,
            startedOn: newStart,
            finishedOn: newEnd
        };

        // Rempalce in the list
        const updatedSourceMap = [...sourceMap];
        updatedSourceMap[indexToMove] = updatedEvent;

        return updatedSourceMap;
    }

    public static ResizeEventOn(
        moveTo: CalendarEvent,
        day: CalendarDay,
        sourceMap: CalendarEvent[]
    ): CalendarEvent[] {
        if (!day.date) return sourceMap;

        // Search the event from the source
        const indexToMove = sourceMap.findIndex(e => e.id === moveTo.id);
        if (indexToMove === -1) return sourceMap;

        const eventToMove = sourceMap[indexToMove];

        if(eventToMove === undefined) return sourceMap;

        // Create the nex start based on the day
        const newStart = new Date(day.date);

        if(newStart > eventToMove.finishedOn )
            return sourceMap;

        // Update the event
        const updatedEvent: CalendarEvent = {
            ...eventToMove,
            startedOn: newStart,
            finishedOn: eventToMove.finishedOn
        };

        // Rempalce in the list
        const updatedSourceMap = [...sourceMap];
        updatedSourceMap[indexToMove] = updatedEvent;

        return updatedSourceMap;
    }


}
