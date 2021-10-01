import { UploadService } from './upload.service';
import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  time = timer(0, 1000).pipe(map(() => new Date()));

  file: File;
  error: string;
  uploadResponse = 0;

  constructor(
    private uploadService: UploadService
  ) { }

  onFileChange({ target }: { target: HTMLInputElement }) {
    if (target.files.length > 0) {
      this.file = target.files[0];
      console.log(this.file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.uploadResponse = res;
      },
      (err) => {
        console.error(err);
      });
  }

  onSubmitAsync() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.uploadService.uploadAsync(formData).subscribe(
      (res) => {
        this.uploadResponse = res;
      },
      (err) => {
        console.error(err);
      });
  }

}
