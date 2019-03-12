import { NgModule, ModuleWithProviders } from '@angular/core';
import { MediaService } from './media.service';


@NgModule()
export class MediaModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaModule,
      providers: [
        MediaService
      ]
    }
  }
}