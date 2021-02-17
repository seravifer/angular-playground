import { UploadService } from './upload.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  file: File;
  error: string;
  uploadResponse = {
    status: '',
    message: '',
    filePath: ''
  };

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
    return this.uploadService.testHelloWorld().subscribe();
    const formData = new FormData();
    formData.append('file', this.file);
    this.uploadService.upload(formData).subscribe(
      (res) => this.uploadResponse = res,
      (err) => {
        console.error(err);
      });
  }

}
