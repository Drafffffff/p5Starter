import p5 from "p5";

export default class Graph {
  private p: p5;
  private centerPoints: p5.Vector[] = [];
  private outerPoints: p5.Vector[] = [];
  private pos: p5.Vector;
  private r: number;
  private rO: number;
  private controlPointsNum = 15;
  private outerOffset: p5.Vector[] = [];
  private centerOffset: p5.Vector[] = [];
  private lerpTime = 30;
  private lerpedArray: p5.Vector[][] = [];
  private xMoveRange: number;
  private outerMoveRange: number;
  private colorFrom: p5.Color;
  private colorTo: p5.Color;
  private mouseOffset: p5.Vector;
  public constructor(p: p5, postion: p5.Vector) {
    this.p = p;
    this.pos = postion;
    this.colorFrom = p.color("#2B33FC");
    this.colorTo = p.color("#FFFFFF");
    this.r = p.width / 23;
    this.rO = p.width / 2.7;
    this.xMoveRange = p.width;
    this.outerMoveRange = p.width / 5;
    this.initCenterPoints();
    this.initOuterPoints();
    // console.log(this.centerPoints);
  }
  public update(): void {
    this.mouseOffset = this.p.createVector(
      (this.p.mouseX - this.p.width / 2) / 3,
      (this.p.mouseY - this.p.height / 2) / 3
    );
    // console.log(this.mouseOffset);
    this.p.noiseDetail(1.5, 0.6);
    const xxo = this.p.noise(this.p.frameCount / 100) * this.xMoveRange;
    const xyo = this.p.noise(this.p.frameCount / 100 + 100) * this.xMoveRange;
    for (let i = 0; i < this.centerPoints.length; i++) {
      const pos = this.p.createVector(
        xxo - this.xMoveRange / 2 + this.mouseOffset.x,
        xyo - this.xMoveRange / 2 + this.mouseOffset.y
      );
      this.centerOffset[i] = pos;
    }
    this.p.noiseDetail(10, 0.2);

    for (let i = 0; i < this.outerPoints.length; i++) {
      const oxo =
        this.p.noise(this.p.frameCount / 100 + i * 100) * this.outerMoveRange;
      const oyo =
        this.p.noise(this.p.frameCount / 100 + 100 + i * 100) *
        this.outerMoveRange;
      const pos = this.p.createVector(
        oxo - this.outerMoveRange / 2,
        oyo - this.outerMoveRange / 2
      );
      this.outerOffset[i] = pos;
    }
    this.culLerpArray();
  }

  public draw(): void {
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);
    this.p.stroke(50);
    this.p.strokeWeight(0.2);
    this.p.noFill();
    const cp = this.arrayComplate(this.centerPoints);
    const op = this.arrayComplate(this.outerPoints);
    const co = this.arrayComplate(this.centerOffset);
    const oo = this.arrayComplate(this.outerOffset);
    this.p.beginShape();
    op.forEach((point, index): void => {
      const x: number = point.x + oo[index].x;
      const y: number = point.y + oo[index].y;
      this.p.curveVertex(x, y);
    });
    this.p.endShape();
    this.lerpedArray.forEach((points, index): void => {
      const c = this.p.lerpColor(
        this.colorFrom,
        this.colorTo,
        1 - index / this.lerpTime
      );
      this.p.fill(c);
      const pp = this.arrayComplate(points);
      this.drawShape(pp);
    });

    this.p.fill(this.colorFrom);
    this.p.beginShape();
    cp.forEach((point, index): void => {
      const x: number = point.x + co[index].x;
      const y: number = point.y + co[index].y;
      this.p.curveVertex(x, y);
    });
    this.p.endShape();
    this.p.pop();
  }

  private initCenterPoints(): void {
    for (let i = 0; i < this.controlPointsNum; i++) {
      const a = (this.p.TWO_PI / this.controlPointsNum) * i;
      const x = this.p.cos(a) * this.r;
      const y = this.p.sin(a) * this.r;
      const point = this.p.createVector(x, y);
      this.centerPoints.push(point);
    }
  }

  private initOuterPoints(): void {
    for (let i = 0; i < this.controlPointsNum; i++) {
      const a = (this.p.TWO_PI / this.controlPointsNum) * i;
      const x = this.p.cos(a) * this.rO * 1.2;
      const y = this.p.sin(a) * this.rO * 1.5;
      const point = this.p.createVector(x, y);
      this.outerPoints.push(point);
    }
  }
  private arrayComplate(arr: p5.Vector[]): p5.Vector[] {
    const newarr = [...arr];
    newarr.push(...arr.slice(0, 3));
    return newarr;
  }

  private culLerpArray(): void {
    for (let i = 1; i < this.lerpTime; i++) {
      const lerpRate = 1 - i / this.lerpTime;
      this.lerpedArray[i] = [];
      for (let j = 0; j < this.centerPoints.length; j++) {
        const x = this.p.lerp(
          this.centerPoints[j].x + this.centerOffset[j].x,
          this.outerPoints[j].x + this.outerOffset[j].x,
          lerpRate
        );
        const y = this.p.lerp(
          this.centerPoints[j].y + this.centerOffset[j].y,
          this.outerPoints[j].y + this.outerOffset[j].y,
          lerpRate
        );
        this.lerpedArray[i][j] = this.p.createVector(x, y);
      }
    }
  }
  private drawShape(arr: p5.Vector[]): void {
    this.p.beginShape();
    arr.forEach((point): void => {
      const x: number = point.x;
      const y: number = point.y;
      this.p.curveVertex(x, y);
    });
    this.p.endShape();
  }
}
