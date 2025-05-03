import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateTimeFormat',
  standalone: true,
})
export class DateTimeFormatPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) { }

  transform(unixTimestamp?: number): string {
    if (!unixTimestamp) return '';

    const date = new Date(unixTimestamp);
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss');

    return formattedDate ?? '';
  }
}
