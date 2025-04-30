import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {


  constructor(private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platId: object) {

    if (isPlatformBrowser(this.platId)) { // Browser

      // this language will be used as a fallback when a translation isn't found in the current language this._TranslateService.setDefaultLang(  'en'  );
      //1- set default lang
      this.translateService.setDefaultLang('en')
      //2- get lang from localStorage 
      const savedLang = localStorage.getItem('lang');
      //3- use language if found
      if (savedLang) {
        this.translateService.use(savedLang);
      }

      //to change direction
      this.changeDirection()
    }

  }


  changeDirection(): void {
    if (localStorage.getItem('lang') === 'en') {
      // dir ltr
      document.documentElement.dir = 'ltr';
    }
    else if (localStorage.getItem('lang') === 'ar') {
      //dir rtl
      document.documentElement.dir = 'rtl';

    }


  }


  changeLang(lang: string): void {
    if (isPlatformBrowser(this.platId)) {
      localStorage.setItem('lang', lang);
    }

    this.translateService.use(lang);
    this.changeDirection();
  }



}
