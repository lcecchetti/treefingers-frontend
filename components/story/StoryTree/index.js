import { useRef, useEffect } from 'react';
import clsx from 'clsx';

class TreeView {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');

		this.root = undefined;

		this.childrenCount = 5;
		this.childLengthModifier = 0.9;
		this.baseTheta = Math.PI * (100 / 180);
		this.levels = 8;
		this.baseLineWidth = 20;
		this.hue = this.random(0, 360);

		this.addEventListeners();
		this.resizeCanvas();

		this.update();
		this.render();
	}

	addEventListeners() {
		window.onresize = (function () {
			this.resizeCanvas();
			this.update();
			this.render();
		}).bind(this);
	}

	resizeCanvas() {
		const devicePixelRatio = window.devicePixelRatio >= 1 ? window.devicePixelRatio : 1;

		this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
		this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}

	loop() {
		requestAnimationFrame(this.loop.bind(this));
		this.update();
		this.render();
	}

	rgbToFillStyle(r, g, b, a) {
		if (a === undefined) {
			return `rgb(${r},${g},${b})`;
		} else {
			return `rgb(${r},${g},${b},${a})`;
		}
	}

	hslToFillStyle(h, s, l, a) {
		if (a === undefined) {
			return `hsl(${h},${s}%,${l}%)`;
		} else {
			return `hsl(${h},${s}%,${l}%,${a})`;
		}
	}

	random(min, max) {
		return Math.random() * (max - min) + min;
	}

	update() {
		this.root = new Branch(
			new Node(this.width / 2, this.height),
			new Node(this.width / 2, this.height - (this.height / 6))
		);

		this.generateBranch(this.root);
	}

	generateBranch(parent) {
		const ratio = parent.level / this.levels;
		const thetaChange = this.baseTheta * ratio * this.random(-1, 1);
		const theta = parent.theta - thetaChange;
		const hyp = parent.length * this.childLengthModifier * this.random(.9, 1);

		const branch = new Branch(
			parent.to,
			new Node(
				parent.to.x + hyp * Math.cos(theta),
				parent.to.y + hyp * Math.sin(theta)
			),
			parent.level + 1
		);

		parent.children.push(branch);

		if (branch.level < this.levels) {
			for (const i = 0; i < this.childrenCount; i++) {
				this.generateBranch(branch);
			}
		}
	}

	renderTree(branch) {
		const ratio = (this.levels - branch.level) / this.levels;

		this.context.lineCap = 'round';
		this.context.lineWidth = ratio * this.baseLineWidth;

		this.context.beginPath();
		this.context.moveTo(branch.from.x, branch.from.y);
		this.context.lineTo(branch.to.x, branch.to.y);
		this.context.strokeStyle = this.hslToFillStyle(
			this.hue - 90 * ratio,
			30 * (1 - ratio) + 10,
			(30 * (1 - ratio) + 30) * this.random(.8, 1),
			.9
		);
		this.context.stroke();
		this.context.closePath();

		for (const i = 0; i < branch.children.length; i++) {
			this.renderTree(branch.children[i]);
		}
	}

	render() {
		this.reset();
		this.renderTree(this.root);
	}

	reset() {
		this.context.clearRect(0, 0, this.width, this.height);
	}
}
		
class Branch {
	constructor(from, to, level = 1) {
		this.from = from;
		this.to = to;
		this.level = level;
		this.children = [];

		const lengthX = this.to.x - this.from.x;
		const lengthY = this.to.y - this.from.y;

		this.length = Math.sqrt(lengthX ** 2 + lengthY ** 2);
		this.theta = Math.atan2(lengthY, lengthX);
	}
}

class Node {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
}

const StoryTree = ({ story, className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    new TreeView(canvasRef.current);
  }, [story])

  return (
    <div className={clsx('', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default StoryTree;