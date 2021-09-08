import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss']
})
export class WorkerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.runWorker();
  }

  runWorker() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(new URL('./web-worker.worker', import.meta.url), { type: 'module' });

      worker.onmessage = ({ data }) => {
        console.log(`Worker send message: ${data}`);
      };

      worker.onerror = (error) => {
        console.error('Worker send error', error);
      };

      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

}
