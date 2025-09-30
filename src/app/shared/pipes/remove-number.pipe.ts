import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeNumber'
})
export class RemoveNumberPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/^\d+\.\s*/, '');
  }
}
