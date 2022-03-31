import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import esJson from '../assets/i18n/es.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   *
   */

  constructor(private readonly translate: TranslateService, private config: PrimeNGConfig) {
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');

    const browserLang = translate.getBrowserLang();
    let lang = browserLang?.match(/es|en/) ? browserLang : 'en';
    this.changeLang(lang);
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    this.config.setTranslation(esJson.primeng);
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

}
