import clsx from 'clsx';
import React, { useEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import { ColorHelper } from '../../helpers/ColorHelper';
import DatesHelper from '../../helpers/DatesHelper';
import Tooltip from '../../simple/Tooltip';
import s from './DaysSelector.module.scss';
import DaysSelectorHelper, { END_HOUR_MORNING, RequestPeriod } from './helpers/DaysSelectorHelper';

export interface IBusyDays {
    id: number
    start: Date
    end: Date
    title?: string
    color?: string
    notification?: boolean
}

interface ISelection {
    start: Date
    startPeriod: RequestPeriod
    end: Date
    endPeriod: RequestPeriod
}

export interface IDaysSelectorI18n {
    Days: string[]
    Months: string[]
}

interface IDaysSelectorProps {
    /**
         * List of weekdays considered as days off (e.g., weekends).
         * Represented as numbers where 0 = Sunday, 1 = Monday, etc.
         */
    weekDaysOff?: number[];

    /**
     * Specific dates that should be marked as off days.
     * These are individual Date objects.
     */
    offDays?: Date[];

    /**
     * List of busy days, represented by the IBusyDays interface.
     */
    busyDays?: IBusyDays[];

    /**
     * Number of months to display in the selector at once.
     * For example, 1 for a single month view, 2 for two months, etc...
     */
    monthsDisplay?: number;

    /**
     * Callback triggered when a period (range of dates) is selected.
     * Receives an ISelection object containing the selection details.
     */
    onPeriodSelect?: (selection: ISelection) => void;

    /**
     * Callback triggered when the displayed month changes.
     * Provides the start and finish dates of the new view.
     */
    onMonthChange?: (start: Date, finish: Date) => void;

    /**
     * Callback triggered when a holiday is clicked.
     * Receives the clicked holiday as an IBusyDays object.
     */
    onBusyDayClick?: (holiday: IBusyDays) => void;

    /**
     * Disables all dates before this specified Date.
     * Useful for restricting selection to a certain range.
     */
    disableDaysBefore?: Date;

    /**
     * Disables all dates after this specified Date.
     * Useful for restricting selection to a certain range.
     */
    disableDaysAfter?: Date;

    /**
     * If true, disables changing months using the mouse wheel.
     */
    noMouseWheel?: boolean;

    /**
     * The initial date to display when the selector is rendered.
     */
    startDate?: Date;

    /**
     * List of selections that are not managed by the component internally.
     * Useful for external state management. Initialize it to an array to disable the internal managment
     * of selected periods
     */
    unManagedSelections?: ISelection[];

    /**
     * If true, makes the selector read-only (no interaction allowed).
     */
    readonly?: boolean;

    /**
     * Internationalization settings for the selector.
     * Provides translations and locale-specific configurations.
     */
    i18n?: IDaysSelectorI18n;

    /**
     * Customize the previous month button
     */
    previousButton?: ReactNode

    /**
     * Customize the next month button
     */
    nextButton?: ReactNode

    /**
     * Customize the user selection color
     */    
    selectionColor?: string

}

export const DaysSelector = ({
    weekDaysOff = [6, 0],
    offDays = [],
    busyDays = [],
    monthsDisplay = 5,
    onPeriodSelect,
    onMonthChange,
    onBusyDayClick: onHolidayClick,
    disableDaysBefore,
    disableDaysAfter,
    noMouseWheel,
    startDate = new Date(),
    unManagedSelections,
    readonly,
    i18n = { Days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], Months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
    previousButton = '˅',
    nextButton = '˄',
    selectionColor = '#FF9539'
}: IDaysSelectorProps) => {
    const [startMonth, setStartMonth] = useState<number>(startDate.getMonth());
    const [startYear, setStartYear] = useState<number>(startDate.getFullYear());
    const [selectionInProgress, setSelectionInProgress] = useState<ISelection | undefined>(undefined);
    const [selections, setSelections] = useState<ISelection[] | undefined>(unManagedSelections);
    let captureWhell = useRef<boolean>(false);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (captureWhell.current && noMouseWheel !== true) {
                const delta = e.deltaY > 0 ? 1 : -1;
                handleMonthSelectionChange(delta);
                e.preventDefault();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [startMonth, captureWhell, noMouseWheel]);



    const pickedMomentAlreadyInSelections = (pickedMomentStart: Date, pickedMomentEnd: Date) => {
        if (selections)
            for (let idx = 0; idx < selections.length; idx++) {
                let selection = selections[idx];

                if (selection && DatesHelper.isSameOrAfter(pickedMomentStart, selection.start) && DatesHelper.isSameOrBefore(pickedMomentEnd, selection.end)) {
                    return true;
                }
            }

        return false;
    }


    //select a period ans send a postback to the props
    const selectPeriod = (startDate: Date, endDate: Date) => {
        if (!readonly) {
            if (pickedMomentAlreadyInSelections(startDate, endDate)) {
                return;
            }

            if (selectionInProgress === undefined) {
                setSelectionInProgress({ start: startDate, startPeriod: DaysSelectorHelper.getPeriod(startDate), end: endDate, endPeriod: DaysSelectorHelper.getPeriod(endDate) });
            }
            else {
                let startSelection = selectionInProgress.start;
                let endSelection = endDate;

                //reverse selection if begin is before finish
                if (DatesHelper.isBefore(endDate, selectionInProgress.end)) {
                    startSelection = startDate;
                    endSelection = selectionInProgress.end;
                }

                setSelectionInProgress(undefined);

                const newPeriod = {
                    start: startSelection,
                    startPeriod: DaysSelectorHelper.getPeriod(startSelection),
                    end: endSelection,
                    endPeriod: DaysSelectorHelper.getPeriod(endSelection)
                };

                if (unManagedSelections === undefined) {
                    let selectionsUpdate = selections !== undefined ? [...selections] : [];

                    // Check for overlap
                    const hasOverlap = selectionsUpdate.some(sel =>
                        newPeriod.start <= sel.end && newPeriod.end >= sel.start
                    );
                    if (!hasOverlap) {
                        selectionsUpdate.push(newPeriod);
                        setSelections(selectionsUpdate);
                    }
                }
                onPeriodSelect && onPeriodSelect(newPeriod);
            }
        }
    }

    //When a click on an holiday appear
    const selectHoliday = (holiday: IBusyDays | undefined) => {
        onHolidayClick && holiday && onHolidayClick(holiday);
    }

    //Show the next or previous month in the calendar
    const handleMonthSelectionChange = (amount: number, e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e !== undefined) {
            e.preventDefault();
            e.stopPropagation();
        }

        let endMonth = DatesHelper.utc(new Date(startYear, startMonth, 1));
        endMonth = DatesHelper.addMonth(endMonth, + monthsDisplay);
        let newStartMonth = DatesHelper.utc(new Date(startYear, startMonth, 1));
        newStartMonth = DatesHelper.addMonth(newStartMonth, amount);

        setStartMonth(newStartMonth.getMonth());
        setStartYear(newStartMonth.getFullYear());

        onMonthChange && onMonthChange(newStartMonth, DatesHelper.endOf(endMonth, "month"));
    };

    const isPeriodInCompleteSelection = (momentInDay: Date, midDay: Date, period: RequestPeriod): string => {
        if (selections)
            for (let idx = 0; idx < selections.length; idx++) {
                let selection = selections[idx];

                if (selection === undefined) return '';

                if (period === selection.startPeriod && period === selection.endPeriod && DatesHelper.isSame(momentInDay, selection.start, 'day') && DatesHelper.isSame(momentInDay, selection.end, 'day'))
                    return s['days-selector__month__day__select-period--state-full'] ?? ''

                if (DatesHelper.isSame(momentInDay, selection.start, 'day') && period === selection.startPeriod)
                    return s['days-selector__month__day__select-period--state-start'] ?? ''

                if (DatesHelper.isSame(momentInDay, selection.end, 'day') && period === selection.endPeriod)
                    return s['days-selector__month__day__select-period--state-finish'] ?? ''


                if ((DatesHelper.isSameOrAfter(momentInDay, selection.start) && DatesHelper.isSameOrBefore(momentInDay, selection.end))
                    || (period === RequestPeriod.Morning && DatesHelper.isSame(momentInDay, selection.start, 'day') && DatesHelper.isSameOrBefore(DatesHelper.utc(selection.start), midDay))
                    || (period === RequestPeriod.Afternoon && DatesHelper.isSame(momentInDay, selection.end, 'day') && DatesHelper.isSameOrAfter(DatesHelper.utc(selection.end), midDay))
                ) {
                    return s['days-selector__month__day__select-period--state-select'] ?? '';
                }
            }
        return '';
    }

    //Check if a periode has been selected ans return the good css className
    const isPeriodInSelection = (momentInDay: Date, midDay: Date, period: RequestPeriod): string => {
        if (selectionInProgress) {
            if ((DatesHelper.isSameOrAfter(momentInDay, selectionInProgress.start) && DatesHelper.isSameOrBefore(momentInDay, selectionInProgress.end))
                || (period === RequestPeriod.Morning && DatesHelper.isSame(momentInDay, selectionInProgress.start, 'day') && DatesHelper.isSameOrBefore(DatesHelper.utc(selectionInProgress.start), midDay))
                || (period === RequestPeriod.Afternoon && DatesHelper.isSame(momentInDay, selectionInProgress.end, 'day') && DatesHelper.isSameOrAfter(DatesHelper.utc(selectionInProgress.end), midDay))
            ) {

                return s['days-selector__month__day__select-period--state-start'] ?? '';
            }
        }

        return isPeriodInCompleteSelection(momentInDay, midDay, period);
    }

    const BusyDayElement = (request: IBusyDays | undefined, className: string, hasAction: boolean): JSX.Element => {
        if (request === undefined)
            return <div className={s['days-selector__month__day__days-offs__fake-period']}>
            </div>

        return <Tooltip title={request.title ?? ''} placement='bottom'>
            <div>
                <div className={clsx(s['days-selector__month__day__days-offs__period'], className)}
                    style={{ background: request.color ?? '' }}
                    onClick={request && selectHoliday.bind(this, request)}
                >
                    {hasAction && <div className={s['days-selector__month__day__days-offs__period__action']}></div>}
                </div>
            </div>
        </Tooltip>
    }

    //Display already registered holidays
    const BusyDaysOnDay = (currentDate: Date, isOff: boolean): JSX.Element => {

        let startDay = DatesHelper.utc(currentDate);
        let midDay = DatesHelper.utc(currentDate);
        let endDay = DatesHelper.utc(currentDate);
        midDay.setHours(END_HOUR_MORNING);
        endDay.setHours(23);
        endDay.setMinutes(59);
        endDay.setSeconds(59);

        //check if we are in the start date of an holiday
        let morningDetails = busyDays.find(holi =>
        ((DatesHelper.isAfter(midDay, DatesHelper.utc(holi.start)) && DatesHelper.isSameOrBefore(midDay, DatesHelper.utc(holi.end)))
            || DatesHelper.isBetween(DatesHelper.utc(holi.start), startDay, midDay)
            || DatesHelper.isBetween(DatesHelper.utc(holi.end), startDay, midDay))
        );

        let afternoonDetails = busyDays.find(holi =>
        ((DatesHelper.isSameOrAfter(midDay, DatesHelper.utc(holi.start)) && DatesHelper.isSameOrBefore(endDay, DatesHelper.utc(holi.end)))
            || DatesHelper.isBetween(DatesHelper.utc(holi.start), midDay, endDay)
            || DatesHelper.isBetween(DatesHelper.utc(holi.end), midDay, endDay))
        );


        if (morningDetails || afternoonDetails) {
            let firstMorning = morningDetails && DatesHelper.isBetween(DatesHelper.utc(morningDetails.start), startDay, midDay) ? s['days-selector__month__day__days-offs__period--state-first'] : '';
            let lastMorning = morningDetails && DatesHelper.isSameOrAfter(DatesHelper.utc(morningDetails.end), startDay) && DatesHelper.isSameOrBefore(DatesHelper.utc(morningDetails.end), midDay) ? s['days-selector__month__day__days-offs__period--state-last'] : '';
            let firstAfternoon = afternoonDetails && DatesHelper.isSameOrAfter(DatesHelper.utc(afternoonDetails.start), midDay) && DatesHelper.isSameOrBefore(DatesHelper.utc(afternoonDetails.start), endDay) ? s['days-selector__month__day__days-offs__period--state-first'] : '';
            let lastAfternoon = afternoonDetails && DatesHelper.isBetween(DatesHelper.utc(afternoonDetails.end), midDay, endDay) ? s['days-selector__month__day__days-offs__period--state-last'] : '';

            return <>
                {BusyDayElement(morningDetails, `${firstMorning} ${lastMorning} ${isOff && s['days-selector__month__day__days-offs__period--state-off']}`, lastMorning !== '' && morningDetails?.notification === true)}
                {BusyDayElement(afternoonDetails, `${firstAfternoon} ${lastAfternoon} ${isOff && s['days-selector__month__day__days-offs__period--state-off']}`, lastAfternoon !== '' && afternoonDetails?.notification === true)}
            </>
        }

        return <></>
    }

    //Create a month line with all days
    const buildMonth = (month: Date): React.ReactNode => {
        let daysInMonth = DatesHelper.daysInMonth(month);

        let result: JSX.Element[] = [];

        result.push(<div
            className={s['days-selector__month__title']}
            key={'lcmt' + month.toISOString()}>
            <div className={s['days-selector__month__title__month']}>
                {i18n.Months[month.getMonth()]}
            </div>
            <div className={s['days-selector__month__title__year']}>
                {month.getFullYear()}
            </div>
        </div>
        )

        for (let d = 1; d <= daysInMonth; d++) {
            let currentDate = DatesHelper.utc(new Date(month.getFullYear(), month.getMonth(), d, 0, 0, 0));

            //check if the day is not selectable
            let isOff = weekDaysOff.some(wdo => currentDate.getDay() === wdo) ||
                offDays.some(off => DatesHelper.isSameDay(currentDate, off));

            //Days disabled for selection
            let isDisabled = disableDaysBefore !== undefined && DatesHelper.isAfter(DatesHelper.utc(disableDaysBefore), currentDate);

            if (disableDaysAfter) {
                isDisabled = isDisabled || DatesHelper.isBefore(disableDaysAfter, currentDate);
            }

            //Check is it's today
            var todayMoment = DatesHelper.utc(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0));
            let isToday = DatesHelper.isSameDay(currentDate, todayMoment) ? s['days-selector__month__day--today'] : '';

            //Do periods selections. A morning period starts at 8AM, and afternoon at 2PM
            let morningDateStart = DaysSelectorHelper.getStartMoment(currentDate, RequestPeriod.Morning);
            let morningDateEnd = DaysSelectorHelper.getEndMoment(currentDate, RequestPeriod.Morning);

            let afternoonDateStart = DaysSelectorHelper.getStartMoment(currentDate, RequestPeriod.Afternoon);
            let afternoonDateEnd = DaysSelectorHelper.getEndMoment(currentDate, RequestPeriod.Afternoon);

            let morningSelection = !isOff && isPeriodInSelection(morningDateEnd, morningDateEnd, RequestPeriod.Morning);
            let afterNoonSelection = !isOff && isPeriodInSelection(afternoonDateStart, afternoonDateStart, RequestPeriod.Afternoon);

            let className = `${s['days-selector__month__day']} ${isToday} ` +
                (isOff ? s['days-selector__month__day--state-off'] : '') + ' ' +
                ((morningSelection !== '' || afterNoonSelection !== '') ? s['days-selector__month__day--state-selected'] : '') + ' ' +
                (isDisabled ? s['days-selector__month__day--state-disabled'] : '')

            result.push(
                <div className={className} key={'lcmd' + currentDate.toISOString()}>
                    <div className={clsx(s['days-selector__month__day__select-period'], morningSelection)} onClick={() => selectPeriod(morningDateStart, morningDateEnd)}></div>
                    <div className={clsx(s['days-selector__month__day__select-period'], afterNoonSelection)} onClick={() => selectPeriod(afternoonDateStart, afternoonDateEnd)}></div>
                    <div className={s['days-selector__month__day__days-offs']}>
                        {BusyDaysOnDay(currentDate, isOff)}
                    </div>
                    <div className={s['days-selector__month__day__name']}>
                        {i18n.Days[currentDate.getDay()]}
                    </div>
                </div>
            )
        }

        return result;
    }

    //Render a number of month
    const renderMonths = (): React.ReactNode => {
        let nodes: JSX.Element[] = [];

        for (let i = 0; i < monthsDisplay; i++) {
            let newMonth = DatesHelper.utc(new Date(startYear, startMonth, 15));
            newMonth = DatesHelper.addMonth(newMonth, i);

            nodes.push(
                <div className={s['days-selector__month']} key={newMonth.toISOString()}>
                    {buildMonth(newMonth)}
                </div>
            );
        }

        return nodes;
    }

    const todayIsInCalendar = (currentDayNumber: number) => {
        var startMoment = DatesHelper.utc(new Date(startYear, startMonth, 1));
        var endMoment = DatesHelper.addMonth(startMoment, monthsDisplay);
        var today = DatesHelper.utc(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

        return DatesHelper.isSameOrBefore(startMoment, today) && DatesHelper.isSameOrAfter(endMoment, today) && new Date().getDate() === currentDayNumber;
    }

    //Render the header
    const renderHeader = (): React.ReactNode => {
        return <div className={s['days-selector__header']}>
            <div className={s['days-selector__header__year']}>
                {startYear}
            </div>
            {[...Array(31)].map((x, currentDayNumber) =>
                <div key={currentDayNumber + 1} className={clsx(s['days-selector__header__day'], todayIsInCalendar(currentDayNumber + 1) ? s['days-selector__header__day--today'] : '')}>
                    {currentDayNumber + 1}
                </div>
            )}
        </div>
    }

    return <>
        <div>
            <div className={clsx(s['days-selector'], readonly ? s['days-selector--state-readonly'] : '')}
                onMouseEnter={() => captureWhell.current = true}
                onMouseLeave={() => captureWhell.current = false}
                style={{['--uib-selection-color' as any]: ColorHelper.HexToRgb(selectionColor)}}
            >
                {renderHeader()}
                {renderMonths()}
                <div className={s['days-selector__move-icons']}>
                    <div onDoubleClick={(e) => handleMonthSelectionChange(-1, e)} onClick={(e) => handleMonthSelectionChange(-1, e)} >{previousButton}</div>
                    <div onDoubleClick={(e) => handleMonthSelectionChange(1, e)} onClick={(e) => handleMonthSelectionChange(1, e)} >{nextButton}</div>
                </div>
            </div>
        </div>
    </>
}

export default DaysSelector