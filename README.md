# @meumobi/mmb-media-provider

A angular service to handle media on meumobi apps.

## Dependencies
- [plugins list]

## Installation
```bash
$ npm install @meumobi/mmb-media-provider --save
```

## Use 
In order to use the same instance in your project, only add MediaService on your AppModule
On app.module.js
```ts
...
import { MediaModule, MediaService } from '@meumobi/mmb-media-provider';

@NgModule({
  declarations: [...],
  bootstrap: [...],
  entryComponents: [...],
  imports: [
    MediaModule,
    ...
  ]
  providers: [
    MediaService,
    ...
  ]
})
export class AppModule {}
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
  // use functions
}
```

## Functions
### getFilesObserver(): `Observable<object>`. 
It loads which files were downloaded, and is realtime updated when you dowload or remove a file in your project. 
```ts
this.mediaService.getFilesObserver()
.subscribe(
  (data) => {
    console.log(data);
  }
);
```

### decorateFile(file)
Based on file extension it identifies what are the possibilities to handle the file.
```ts
this.mediaService.decorateFile(file)
.subscribe(
  data => {
    console.log(data);
  }
);
```
You need to pass a file with at least `url`, `type` and `extension`.
```ts
{
  "url": "https://firebasestorage.googleapis.com/v0/b/meumobi-sitebuilder.appspot.com/o/files%2F60ba01aa-c8c1-bfc9-4eb3-5c714ce23c16.pdf?alt=media&token=8ec283ec-bbab-4f3b-919c-75b30e73fe13",
  "type": "application/pdf",
  "extension": "pdf"
}
```
It will return the file decorated as the following sample.
```ts
{
  "url": "https://firebasestorage.googleapis.com/v0/b/meumobi-sitebuilder.appspot.com/o/files%2F60ba01aa-c8c1-bfc9-4eb3-5c714ce23c16.pdf?alt=media&token=8ec283ec-bbab-4f3b-919c-75b30e73fe13",
  "type": "application/pdf",
  "extension": "pdf",
  "status": "download",
  "behavior": {
    "label": "View",
    "icon": "eye",
    "download": true
  },
  "name": "3607048e713531f1b8785722adcc31af.pdf",
  "path": "Downloads/3607048e713531f1b8785722adcc31af.pdf",
  "fullPath": "file:///Users/danielconte/Library/Developer/CoreSimulator/Devices/A6EA4805-EA1D-403F-8E7C-2A97680CB49A/data/Containers/Data/Application/62A1207F-BBD8-4ACC-B3B0-443047245868/Library/NoCloud/Downloads/3607048e713531f1b8785722adcc31af.pdf"
}
```
### download(file): BehaviorSubject<any>
If after decoration `file.behaviour.download is true` the file could be downloaded
```ts
this.mediaService.download(file)
.subscribe(
  data => {
    console.log(data);
  }
);
```
When it start to download the it returns file.status `downloading`, once it was finished the file.status is updated to `downloaded`.
The service is able to handle simultaneous downloads.

#### abort(file)
If you want to interrupt the download before it finishes just call abort
```ts
this.mediaService.abort(file);
```
It will stop the download and update the file.status to `download`.

### remove(file)
If the file has been downloaded and you want to delete
```ts
this.mediaService.remove(file)
```

### openFile(file)
If the file were download you can open it. Using the default app on your device to handle the file type.
```ts
this.mediaService.openFile(file)
```
