import { Pipe, PipeTransform } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-scheme';
import 'prismjs/components/prism-ocaml';

@Pipe({
  name: 'prismHighlight'
})
export class PrismHighlightPipe implements PipeTransform {
  transform(code: string, lang: string = 'scheme'): string {
    if (!code) return '';
    if (!Prism.languages[lang]) lang = 'clike';
    return Prism.highlight(code, Prism.languages[lang], lang);
  }
}
