import DatesHelper from "../../../helpers/DatesHelper";

export const START_HOUR_MORNING = 8;
export const END_HOUR_MORNING = 12;
export const START_HOUR_AFTERNOON = 13;
export const END_HOUR_AFTERNOON = 17;

export enum RequestPeriod {
    Morning = 0,
    Afternoon = 1
}

export default class DaysSelectorHelper {
    public static getStartMoment(start: Date, period: RequestPeriod) {

        let dateWithoutHours = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
        let startMoment = DatesHelper.utc(dateWithoutHours);

        if (period === RequestPeriod.Afternoon) {
            return DatesHelper.addHours(startMoment, START_HOUR_AFTERNOON);
        }
        else {
            return DatesHelper.addHours(startMoment, START_HOUR_MORNING);
        }
    }

    public static getEndMoment(end: Date, period: RequestPeriod) {
        let dateWithoutHours = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0);
        let endMoment = DatesHelper.utc(dateWithoutHours);

        if (period === RequestPeriod.Afternoon) {
            return DatesHelper.addHours(endMoment, END_HOUR_AFTERNOON);
        }
        else {
            return DatesHelper.addHours(endMoment, END_HOUR_MORNING);
        }
    }

    public static getPeriod(date: Date) {
        if (date.getHours() <= END_HOUR_MORNING) {
            return RequestPeriod.Morning
        }
        return RequestPeriod.Afternoon;
    }
}