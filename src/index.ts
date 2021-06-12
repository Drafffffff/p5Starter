// import { Scene } from './scene';
import p5 from "p5";
import Graph from "./graph";
import poster from "./poster.png";

const sketch = (p: p5): void => {
  let pos: p5.Vector;
  let graph: Graph;
  let img: p5.Image;
  p.preload = (): void => {
    img = p.loadImage(poster);
  };

  p.setup = (): void => {
    p.createCanvas(p.windowWidth, p.windowWidth * 1.5);
    pos = p.createVector(p.width / 2, p.height / 2);
    graph = new Graph(p, pos);
    // mic.start();

    // const amp = p.constrain(mic.getLevel() * 10, 1, 10);
    // console.log(amp);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowWidth * 1.5);
  };
  p.draw = (): void => {
    p.background(255);
    graph.update();
    graph.draw();
    p.image(img, 0, 0, p.width, p.height);
  };
};

new p5(sketch);
