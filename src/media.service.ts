import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FileOpener } from '@ionic-native/file-opener';
import { Md5 } from 'ts-md5/dist/md5';
import { Platform } from 'ionic-angular/platform/platform';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class MediaService {
  private files = {};
  private files$ = new BehaviorSubject({});
  private fileTranfers = {};

  private options = {
    localFolder: 'Downloads'
  };

  private mimes = {
    'application/pdf': {
      label: 'View',
      icon: 'eye',
      download: true
    },
    'text/html': {
      label: 'Open',
      icon: 'open',
      download: false
    },
    'application/vnd.youtube.video+html': {
      label: 'Play',
      icon: 'play',
      download: false
    },
    'application/vnd.ms-excel': {
      label: 'View',
      icon: 'eye',
      download: true
    },
    'audio/mpeg': {
      label: 'Play',
      icon: 'play',
      download: true
    },
    'video/mp4': {
      label: 'Play',
      icon: 'play',
      download: true
    },
    'application/vnd.ms-powerpoint': {
      class: 'fa-file-powerpoint-o',
      label: 'View',
      icon: 'download',
      download: true,
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      label: 'View',
      icon: 'eye',
      download: true
    }
  };

  constructor(
    private fileTransfer: FileTransfer,
    private storage: Storage,
    private file: File,
    private fileOpener: FileOpener,
    public plt: Platform
  ) {}

  public async getFilesFromStorage() {
    return this.storage.get('files')
    .then(
      (data) => {
        if (data) {
            this.files = data;
        }
        return this.files;
      }
    );
  }

  public remove(file) {    
    return this.getFileEntry(file.fullPath)
    .then(
      () => {
        this.file.removeFile(this.file.dataDirectory, file.path).then(
          () => {
            this.removeFile(file);
          }
        );
        file.status = 'download';
        return file;
      }
    );
  }  

  public async decorateFile(file) {
    file.behavior = this.getBehavior(file.type);
    console.log('Files Provider, decorateFile');
    console.log(file);
    if (file.behavior.download && this.plt.is('cordova')) {
      file.name = file.name || this.getFileName(file);
      file.path = file.path || this.getFilePath(file.name);
      file.status = this.getFileStatus(file.path);
      file.fullPath = this.getFileFullPath(file.path);
    } else {
      file.status = 'open_by_link';
    }
    return file;
  }

  public abort(file) {
    this.fileTranfers[file.path].abort();
  }

  public download(file): BehaviorSubject<any> {
    this.fileTranfers[file.path] = this.fileTransfer.create();
    const result = new BehaviorSubject<any>(file);
    file.status = 'downloading';
    result.next(file);
    this.fileTranfers[file.path]
    .download(file.url, file.fullPath)
    .then(
      () => {
        this.getFileEntry(file.fullPath)
        .then(
          (data) => {
            if (data.isFile) {
              file.status = 'downloaded';
              this.addFile(file);
              result.next(file);
            } else {
              file.status = 'download';
              result.next(file);
            }
          }
        );
      },
      (error) => {
        console.log(error);
        file.status = 'download';
        result.next(file);
      }
    );
    return result;
  }

  private getFileEntry(fullPath: string): Promise<any> {
    return this.file.resolveLocalFilesystemUrl(fullPath);
  }

  private getFilePath(fileName: string): string {
    return `${this.options.localFolder}/${fileName}`;
  }

  private getFileFullPath(filePath: string): string {
    return `${this.file.dataDirectory}${filePath}`;
  }

  private getFileName(file): string {
    const ext = file.extension;
    const name = Md5.hashStr(file.url);
    return `${name}.${ext}`;
  }

  private getFileStatus(filePath: string): string {
    return this.files[filePath] ? 'downloaded' : 'download';
  }

  private getBehavior(fileType: string) {
    const defaultBehavior = {
      label: 'View',
      icon: 'eye',
      download: true,
    };
    return fileType in this.mimes ? this.mimes[fileType] : defaultBehavior;
  }

  public openFile(file) {
    this.fileOpener.open(file.fullPath, file.type);
  }

  private addFile(file) {
    this.files[file.path] = file;
    this.storage.set('files', this.files)
    .then(
      () => this.files$.next(this.files)
    );
  }

  private removeFile(file) {
    delete this.files[file.path];
    this.storage.set('files', this.files).then(
      () => this.files$.next(this.files)
    );
  }

  public getFilesObserver(): Observable<any> {
    this.getFilesFromStorage()
    .then(
      () => this.files$.next(this.files)
    );   
    return this.files$.asObservable();
  }
}

