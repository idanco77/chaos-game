import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sierpinski', {static: true}) canvas: ElementRef;
  @ViewChild('pixelExample', {static: true}) canvasExample: ElementRef;
  contextExample: CanvasRenderingContext2D;
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  width = 900;
  height = 400;
  pixelWidth = 3;
  pixelHeight = 3;
  speed = 1000;
  canvasSubs: Subscription;
  canvasObs: Observable<any>;
  interval;
  isSubmit = false;
  isStop = false;
  triangleVertexes: Array<object>;
  counter = 0;
  color = '#000000';

  ngOnInit(): void {
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
    this.contextExample = (<HTMLCanvasElement>this.canvasExample.nativeElement).getContext('2d');
    this.canvasObs = new Observable(observer => {
      this.interval = setInterval(() => {
        this.counter++;
        this.isSubmit = true;
        observer.next();
        this.chaosGame();
      }, this.speed);
    });
  }

  ngAfterViewInit(): void {
    this.createTriangle();
    this.onPixelSet();
  }

  createTriangle() {
    this.counter = 0;
    this.triangleVertexes = [{x: 0, y: 0}, {x: this.width, y: 0}, {x: this.width / 2, y: this.height}];
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.lineJoin = 'round';
    this.context.moveTo(this.triangleVertexes[2]['x'], this.triangleVertexes[2]['y']);
    this.context.lineTo(this.triangleVertexes[0]['x'], this.triangleVertexes[0]['y']);
    this.context.lineTo(this.triangleVertexes[1]['x'], this.triangleVertexes[1]['y']);
    this.context.lineTo(this.triangleVertexes[2]['x'], this.triangleVertexes[2]['y']);
    this.context.stroke();
  }

  chaosGame() {
    if (!this.x && !this.y) {
      this.x = Math.random() * this.width;
      this.y = Math.random() * this.height;
    }
    const triangleVertex = this.triangleVertexes[Math.floor(Math.random() * this.triangleVertexes.length)];
    this.x = (this.x + triangleVertex['x']) / 2;
    this.y = (this.y + triangleVertex['y']) / 2;
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.pixelWidth, this.pixelHeight);
  }

  onContinue() {
    this.isSubmit = false;
    this.canvasSubs = this.canvasObs.subscribe(() => {
    });
  }

  onStop() {
    this.isStop = true;
    this.canvasSubs.unsubscribe();
    clearInterval(this.interval);
    this.isSubmit = false;
  }

  onSubmit(form: NgForm) {
    this.speed = form.controls.speed.value;
    this.width = form.controls.width.value;
    this.height = form.controls.height.value;
    this.pixelWidth = form.controls.pixWidth.value;
    this.pixelHeight = form.controls.pixHeight.value;
    this.color = form.controls.color.value;
    if (this.isSubmit) {
      this.onContinue();
      return;
    }
    this.isSubmit = false;
    this.canvasSubs = this.canvasObs.subscribe(() => {
    });

  }

  onPixelSet() {
    this.contextExample.fillStyle = this.color;
    this.contextExample.fillRect(0, 0, this.pixelWidth, this.pixelHeight);
  }

  onReset() {
    location.reload();
  }

  ngOnDestroy(): void {
    this.canvasSubs.unsubscribe();
  }
}

