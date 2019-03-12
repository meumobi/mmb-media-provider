# @meumobi/mmb-media-provider

A angular service to handle media on meumobi apps.

## Dependencies
- [plugins list]

## Installation
```bash
$ npm install @meumobi/mmb-media-provider --save
```

## Use 
On app.module.js
```ts
...
import { MediaService } from '@meumobi/mmb-media-provider';

@NgModule({
  declarations: [...],
  bootstrap: [...],
  entryComponents: [...],
  providers: [
    MediaService,
    ...
  ]
})
export class AppModule {}
```
your-component.module.ts
```ts
...
import { MediaService } from '@meumobi/mmb-media-provider';

@NgModule({
  declarations: [...],
  imports: [...],
  providers: [
    MediaService,
    ...
  ]
})
export class YourComponentModule {}
```
you-component.ts
```ts
...
import { MediaService } from '@meumobi/mmb-media-provider';
@Component({
  selector: 'your-component',
  templateUrl: 'your-component',
})
export class YourComponent  {

  constructor(
    private MediaService: MediaService,
    ...
  ) {}

  // list function

}
```

