import { useRef, useEffect } from 'react';
import clsx from 'clsx';

const TreeView = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext( '2d' );
	
	this.numberOfChildNodes = 3;
	this.childLengthModifier = 0.9;
	this.baseTheta = Math.PI * (80 / 180);
	this.nodeLevels = 7;
	this.lineWidth = 15;
	this.hue = Math.random() * 360;
	
	this.addEventListeners();
  this.resizeCanvas();
	this.render();
};
		
TreeView.prototype = {
	addEventListeners : function() {
    window.onresize = (function() {
			this.resizeCanvas();
			this.render();
		}).bind(this);
	},
	
	resizeCanvas : function(e) {
		const devicePixelRatio = window.devicePixelRatio >= 1 ? window.devicePixelRatio : 1;

		this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
		this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	},
			
	loop : function() {
		requestAnimationFrame(this.loop.bind(this));
		this.render();
	},
	
	rgbToFillStyle : function(r, g, b, a) {
		if(a === undefined) {
			return `rgb(${r},${g},${b})`;
		} else {
			return `rgb(${r},${g},${b},${a})`;
		}
	},
	
	hslToFillStyle : function(h, s, l, a) {
		if(a === undefined) {
			return `hsl(${h},${s}%,${l}%)`;
		} else {
			return `hsl(${h},${s}%,${l}%,${a})`;
		}
	},
	
	random : function(min, max) {
	  return Math.random() * (max - min) + min;
	},
	
	generateLine : function(prevLineNode, prevLevel) {
		const currentLevel = prevLevel - 1;
		const ratioTop = (this.nodeLevels - currentLevel) / this.nodeLevels;
		const randomness = 2 * (Math.random() - 0.5);
		const thetaChange = this.baseTheta * randomness * ratioTop;
		const theta = prevLineNode.theta - thetaChange; //Theta is the previous angle, minus base theta
		const hyp = prevLineNode.distance * this.childLengthModifier;
		
		const lineNode = new LineNode();
		lineNode.from.copy(prevLineNode.to);
		lineNode.to.x = prevLineNode.to.x + hyp * Math.cos(theta);
		lineNode.to.y = prevLineNode.to.y + hyp * Math.sin(theta);
		lineNode.update();
		
		prevLineNode.children.push(lineNode);
				
		if(currentLevel > 0) {
			for(const i=0; i < this.numberOfChildNodes; i++) {
				this.generateLine(lineNode, currentLevel);
			}
		}
	},
	
	renderTree : function(lineNode, prevLevel) {
		const ratio = prevLevel / this.nodeLevels;
		const ratio2 = ((ratio * ratio) + ratio) / 2;
		
		this.context.lineWidth = ratio2 * this.lineWidth;
		
		this.context.beginPath();
		this.context.moveTo(lineNode.from.x, lineNode.from.y);
		this.context.lineTo(lineNode.to.x, lineNode.to.y);
		this.context.strokeStyle = this.hslToFillStyle(
			this.hue - 90 * ratio,
			30 * (1 - ratio2) + 10,
			(30 * (1 - ratio) + 30) * this.random(0.8, 1),
			0.9
		);
		this.context.stroke();
		this.context.closePath();
		
	   	for(const i=0; i < lineNode.children.length; i++) {
	   		this.renderTree(lineNode.children[i], prevLevel - 1);
	   	}
	},
	
	render : function() {		
    this.reset();
		
		const lineNode = new LineNode();	
    lineNode.from.x = this.width / 2;
		lineNode.from.y = this.height;
		lineNode.to.x = this.width / 2;
		lineNode.to.y = this.height - (this.height / 6);
		lineNode.update();
		
		this.generateLine(lineNode, this.nodeLevels);
		
		this.context.strokeStyle = this.hslToFillStyle(180, 50, 50);
		this.context.lineCap = 'round';
		
		this.renderTree( lineNode, this.nodeLevels, this.nodeLevels );
	},

  reset : function() {
		this.context.fillStyle = this.rgbToFillStyle(255, 255, 255, 0);
		this.context.fillRect(0,0,this.width, this.height);
	},
};

const LineNode = function() {
	this.from = new Point();
	this.to = new Point();
	this.distance = undefined;
	
	this.children = [];
};

LineNode.prototype = {
	update : function() {
		const distanceX = this.to.x - this.from.x;
		const distanceY = this.to.y - this.from.y;
		
		this.distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
		this.theta = Math.atan2(distanceY, distanceX);
	}
};

const Point = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Point.prototype = {
	constructor: Point,

	copy: function (v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},
};

const StoryTree = ({ story, className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current
    new TreeView(canvas);
  }, [])

  return (
    <div className={clsx('', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default StoryTree;