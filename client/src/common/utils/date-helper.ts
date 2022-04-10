import moment from 'moment';

export function today(): string {
  const date = new Date();
  return (
    date.getFullYear().toString() +
    '-' +
    ('0' + (date.getMonth() + 1).toString()).substr(-2) +
    '-' +
    ('0' + date.getDate().toString()).substr(-2)
  );
}

export function diffDay(date1: string | Date, date2?: string | Date): number {
  const seconds = diffSeconds(date1, date2);
  return Math.ceil(seconds / 36 / 24 / 10) / 10;
}

export function diffHours(date1: string | Date, date2?: string | Date): number {
  const seconds = diffSeconds(date1, date2);
  return Math.ceil(seconds / 36) / 100;
}

export function diffMinutes(date1: string | Date, date2?: string | Date): number {
  const seconds = diffSeconds(date1, date2);
  return Math.ceil(seconds / 0.6) / 100;
}

export function diffSeconds(date1: string | Date, date2?: string | Date): number {
  const seconds = moment(date1).diff(date2 || moment(), 'seconds');
  return Math.abs(seconds);
}

class DateHelper {
  get currentTime(): string {
    const date = new Date();
    const seperator1 = '-';
    const seperator2 = ':';
    let month: any = date.getMonth() + 1;
    let strDate: any = date.getDate();
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let seconds: any = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    if (hours >= 0 && hours <= 9) {
      hours = '0' + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = '0' + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = '0' + seconds;
    }
    const currentdate =
      date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
  }

  diffDay(date1: string | Date, date2?: string | Date): number {
    return diffDay(date1, date2);
  }

  dateString(date1: Date) {

  }
}

export const dateHelper = new DateHelper();
