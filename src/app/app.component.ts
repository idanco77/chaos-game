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

  ngOnInit(): void {
    this.context = (<HTMLCanvasElement>this.canvas.nativeElement).getContext('2d');
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
  }

  onChangeTriangle() {
    this.createTriangle();
  }

  createTriangle() {
    this.triangleVertexes = [{x: 0, y: 0}, {x: this.width, y: 0}, {x: this.width / 2, y: this.height}];
    this.context.fillStyle = 'black';
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
    if (this.isSubmit) {
      this.onContinue();
      return;
    }
    this.isSubmit = false;
    this.speed = form.controls.speed.value;
    this.width = form.controls.width.value;
    this.height = form.controls.height.value;
    this.pixelWidth = form.controls.pixWidth.value;
    this.pixelHeight = form.controls.pixHeight.value;
    this.canvasSubs = this.canvasObs.subscribe(() => {
    });

  }

  onReset() {
    location.reload();
  }

  ngOnDestroy(): void {
    this.canvasSubs.unsubscribe();
  }
}

