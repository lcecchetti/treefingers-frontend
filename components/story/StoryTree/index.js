import { useRef, useEffect } from 'react';
import clsx from 'clsx';

const TreeView = function(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext( '2d' );
	
	this.root = undefined;

	this.numberOfChildNodes = 3;
	this.childLengthModifier = 0.9;
	this.baseTheta = Math.PI * (80 / 180);
	this.nodeLevels = 7;
	this.lineWidth = 15;
	this.hue = Math.random() * 360;
	
	this.addEventListeners();
  this.resizeCanvas();
	
	this.update();
	this.render();
};
		
TreeView.prototype = {
	addEventListeners : function() {
    window.onresize = (function() {
			this.resizeCanvas();
			this.update();
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
	
	update: function() {
		this.root = new Branch();	
    this.root.from.x = this.width / 2;
		this.root.from.y = this.height;
		this.root.to.x = this.width / 2;
		this.root.to.y = this.height - (this.height / 6);
		this.root.update();
		
		this.generateBranch(this.root);
	},

	generateBranch : function(parent) {
		const ratioTop = parent.level / this.nodeLevels;
		const randomness = 2 * (Math.random() - 0.5);
		const thetaChange = this.baseTheta * randomness * ratioTop;
		const theta = parent.theta - thetaChange; //Theta is the previous angle, minus base theta
		const hyp = parent.length * this.childLengthModifier;

		const branch = new Branch();
		branch.from.copy(parent.to);
		branch.to.x = parent.to.x + hyp * Math.cos(theta);
		branch.to.y = parent.to.y + hyp * Math.sin(theta);
		branch.level = parent.level + 1;
		branch.update();
		
		parent.children.push(branch);
				
		if(branch.level < this.nodeLevels) {
			for(const i = 0; i < this.numberOfChildNodes; i++) {
				this.generateBranch(branch);
			}
		}
	},
	
	renderTree : function(branch) {
		this.context.strokeStyle = this.hslToFillStyle(180, 50, 50);
		this.context.lineCap = 'round';

		const ratio =  (this.nodeLevels - branch.level) / this.nodeLevels;
		const ratio2 = ((ratio ** 2) + ratio) / 2;
		
		this.context.lineWidth = ratio2 * this.lineWidth;
		
		this.context.beginPath();
		this.context.moveTo(branch.from.x, branch.from.y);
		this.context.lineTo(branch.to.x, branch.to.y);
		this.context.strokeStyle = this.hslToFillStyle(
			this.hue - 90 * ratio,
			30 * (1 - ratio2) + 10,
			(30 * (1 - ratio) + 30) * this.random(0.8, 1),
			0.9
		);
		this.context.stroke();
		this.context.closePath();
		
	   	for(const i = 0; i < branch.children.length; i++) {
	   		this.renderTree(branch.children[i]);
	   	}
	},
	
	render : function() {		
    this.reset();
		this.renderTree(this.root);
	},

  reset : function() {
		this.context.fillStyle = this.rgbToFillStyle(255, 255, 255, 0);
		this.context.fillRect(0,0,this.width, this.height);
	},
};

const Branch = function() {
	this.from = new Node();
	this.to = new Node();
	this.length = undefined;
	this.theta = undefined;
	this.level = 1;
	
	this.children = [];
};

Branch.prototype = {
	update : function() {
		const lengthX = this.to.x - this.from.x;
		const lengthY = this.to.y - this.from.y;
		
		this.length = Math.sqrt(lengthX ** 2 + lengthY ** 2);
		this.theta = Math.atan2(lengthY, lengthX);
	}
};

const Node = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Node.prototype = {
	constructor: Node,

	copy: function (v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	},
};

const StoryTree = ({ story, className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    new TreeView(canvasRef.current);
  }, [])

  return (
    <div className={clsx('', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default StoryTree;