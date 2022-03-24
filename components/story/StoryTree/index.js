import { useRef, useEffect } from 'react';
import clsx from 'clsx';

const TreeView = function(canvas) {
	this.canvas = canvas;
	this.ratio = window.devicePixelRatio >= 1 ? window.devicePixelRatio : 1;
	this.context = this.canvas.getContext( '2d' );
	
	this.numberOfChildNodes = 3;
	this.childLength = 0.9;
	this.baseTheta = Math.PI * (80 / 180);
	this.nodeLevels = 7;
	this.lineWidth = 8;
	
	
	this.addEventListeners();
	this.hue = Math.random() * 360;

  this.resizeCanvas();
  this.render();
};
		
TreeView.prototype = {
	addEventListeners : function() {
    window.onresize = function () {
      this.resizeCanvas();
      this.render();
    };
	},
	
	resizeCanvas : function(e) {
		this.canvas.width = this.canvas.offsetWidth * this.ratio;
		this.canvas.height = this.canvas.offsetHeight * this.ratio;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	},
			
	loop : function() {
		requestAnimationFrame( this.loop.bind(this) );
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
	
	generateLine : function( prevLineNode, prevLevel, totalLevels ) {
		const lineNode = new LineNode();
		const currentLevel = prevLevel - 1;
		const ratioTop = (totalLevels - currentLevel) / totalLevels;
		const randomness = 2 * (Math.random() - 0.5);
		const thetaChange = this.baseTheta * randomness * ratioTop;
		const theta = prevLineNode.theta - thetaChange; //Theta is the previous angle, minus base theta
		const hyp = prevLineNode.distance * this.childLength;
		
		lineNode.beg.copy(prevLineNode.end);
		lineNode.end.x = prevLineNode.end.x + ( hyp ) * Math.cos( theta );
		lineNode.end.y = prevLineNode.end.y + ( hyp ) * Math.sin( theta );
		
		lineNode.update();
		
		prevLineNode.children.push( lineNode );
				
		if(currentLevel > 0) {
			for(const i=0; i < this.numberOfChildNodes; i++) {
				this.generateLine( lineNode, currentLevel, totalLevels );
			}
		}
		
	},
	
	renderTree : function( lineNode, prevLevel, totalLevels ) {
		
		const ratio = prevLevel / totalLevels;
		const ratio2 = ( (ratio * ratio) + ratio ) / 2;
		
		this.context.lineWidth = ratio2 * this.lineWidth;
		
		this.context.beginPath();
		this.context.moveTo( lineNode.beg.x, lineNode.beg.y );
		this.context.lineTo( lineNode.end.x, lineNode.end.y );
		this.context.strokeStyle = this.hslToFillStyle(
			this.hue - 90 * ratio,
			30 * (1 - ratio2) + 10,
			(30 * (1 - ratio) + 30) * this.random(0.8, 1),
			0.9
		);
		this.context.stroke();
		this.context.closePath();
		
	   	for(const i=0; i < lineNode.children.length; i++) {
	   		this.renderTree( lineNode.children[i], prevLevel - 1, totalLevels );
	   	}
	},
	
	render : function() {
		this.reset();
		
		this.context.fillStyle = this.rgbToFillStyle(255, 255, 255, 0.002);
		this.context.fillRect(0,0,this.width, this.height);
		
		const lineNode = new LineNode();
		
		lineNode.beg.x = 0;
		lineNode.beg.y = this.height / 2;
		lineNode.end.x = this.width / 10;
		lineNode.end.y = this.height / 2;
		lineNode.update();
		
		this.generateLine( lineNode, this.nodeLevels, this.nodeLevels );
		
		this.context.strokeStyle = this.hslToFillStyle(180, 50, 50);
		this.context.lineCap = "round";
		
		this.renderTree( lineNode, this.nodeLevels, this.nodeLevels );
	},

  reset : function() {
		this.context.fillStyle = this.rgbToFillStyle(255, 255, 255);
		this.context.fillRect(0,0,this.width, this.height);
	},
};

const LineNode = function() {
	this.beg = new Point();
	this.end = new Point();
	this.segment = new Point();
	this.distance = undefined;
	
	this.children = [];
};

LineNode.prototype = {
	update : function() {
		this.segment.x = this.end.x - this.beg.x;
		this.segment.y = this.end.y - this.beg.y;
		
		this.distance = Math.sqrt( this.segment.x * this.segment.x + this.segment.y * this.segment.y );
		this.theta = Math.atan2( this.segment.y, this.segment.x );
	}
};

const Point = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Point.prototype = {
	constructor: Point,

	copy: function ( v ) {
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