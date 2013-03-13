var canvas=null, ctx=null;
var time=0,acumDt=0,interval=10,FPS=0;
var xscale=1,yscale=1;
var mousex=-1,mousey=-1;
var timer=0;
var map;
var matAux;
var max=50;
var puntos=0;
var mouseFlag = 0;

var start = new Image();
start.src = "images/start.png";
var walkable = new Image();
walkable.src = "images/walkable.png";
var unwalkable = new Image();
unwalkable.src = "images/unwalkable.png";
var end = new Image();
end.src = "images/end.png";

$( document ).ready( function() {
	$( "#i_width" ).change( function() {
		map.w = $( this ).val();
		recalculateScale();
	});
	$( "#i_height" ).change( function() {
		map.h=$( this ).val();
		recalculateScale();
	});

	$( window ).on( "mousedown", function mouseClick( evt ) {
		mouseDown( evt );
		mouseFlag = 1;
	});
	$( window ).on( "mouseup", function() {
		mouseFlag = 0;
	});
	$( window ).on( "keydown", function keyDown( evt ) {
		if ( evt.keyCode == 83 ) { // S
			map.set( mousex, mousey, 2 );
		}
		if ( evt.keyCode == 69 && !map.isEnd() ) { // E
			map.set( mousex,mousey, 3 );
		}
	});
	
	$( window ).on( "mousemove", function mouseMove( evt ) {
		var mousexx = evt.pageX - canvas.offsetLeft;
		var mouseyy = evt.pageY - canvas.offsetTop;
		
		var xcorrection = 0.5,
			ycorrection = 0.5;

		mousexx=parseInt( ( ( mousexx / xscale ) - xcorrection ).toFixed( 0 ) ); //parseInt for deny the -0 demon.
		mouseyy=parseInt( ( ( mouseyy / yscale ) - ycorrection ).toFixed( 0 ) );
		
		if ( map.isInside( mousexx,mouseyy ) ) {
			mousex=mousexx;
			mousey=mouseyy;
		}
		
		if ( mouseFlag == 1 ) {
			//drag
			mouseDown(evt);
		}
	});

	canvas=document.getElementById( 'canvas' );
	canvas.style.background = '#000';
	ctx=canvas.getContext( '2d' );
	canvas.addEventListener( "mouseout", function mouseOut( evt ) {
		mousex=-1;
		mousey=-1;
	});
	canvas.onselectstart = function () { return false; } //Prevents double-click selection.
	$( "#canvas" ).mousedown( function( event ){ //Prevents Drag selection.
		event.preventDefault();
	});
	
	//Init
	objetosInit();
	
	//
	run();
});
function recalculateScale() {
	xscale = canvas.width / map.w;
	yscale = canvas.height / map.h;
}
function objetosInit() {
	rectangulos = new Array();
	map = new Map( $( "#i_width" ).val(), $( "#i_height" ).val() );	
	recalculateScale();	
}
function run() {
	//setTimeout(run,50);
	requestAnimFrame( run );
	var now=new Date().getTime();
	var dt = now - ( time || now );
	FPS = 1000 / dt;
	time = now;
	acumDt += dt;
	 
	while ( acumDt > interval ) {
		acumDt-=interval;
	}
	paint( ctx );
}

function game() {
	timer++;
	if ( timer == 60 ) timer = 0;
}
function paint( ctx ) {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	for ( var i = 0; i < map.h; i++ ) {
		for ( var j = 0; j < map.w; j++ ) {	
			var img;
			switch ( map.get( j, i ) ) {
				case 0:
					img = walkable;
					break;
				case 1:
					img = unwalkable;
					break;
				case 2:
					img = start;
					break;
				case 3:
					img = end;
					break;
			}
				
			ctx.drawImage( img, j * xscale, i * yscale, xscale, yscale );
			//bordes
			ctx.strokeStyle = '#888';
			ctx.strokeRect( j * xscale, i * yscale, xscale, yscale);			
		}
	}	
	
	
}
function toRad( a ) {
    return a * Math.PI / 180;
}
function reiniciar() {
	objetosInit();
}
var tmp;
function getMapArrayCode() {
	var m = "";
	var tab = "<pre style='display:inline'>&#09;</pre>";
	
	m += "&quotmapArray&quot: [<br>";
	for ( var i = 0; i < map.h; i++ ) {
		m += tab;
		for ( var j = 0; j < map.w; j++ ) {
			if ( j == 0 ) m += '[';
			m = m + map.get( j, i );
			if ( j == map.w - 1 ) {
				m += "]";
				if ( i < map.h - 1 ) m += ",";
				m += '<br>';
			} else {
				m += ', ';
			}
		}
	}
	m += "]";
	$( '#code' ).html( m );
	selectText( "code" );
	$( "#pop" ).show();
	$( "#pop" ).fadeOut( 1500 );
	
}
function selectText( element ) {
    var doc = document;
    var text = doc.getElementById( element );    

    if ( doc.body.createTextRange ) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText( text );
        range.select();
    } else if ( window.getSelection ) { // moz, opera, webkit
        var selection = window.getSelection();            
        var range = doc.createRange();
        range.selectNodeContents( text );
        selection.removeAllRanges();
        selection.addRange( range );
    }
}
function getSelectedText () {
	if ( window.getSelection ) {  // all browsers, except IE before version 9
		var range = window.getSelection ();                                        
		return ( range.toString() );
	} else {
		if ( document.selection.createRange ) { // Internet Explorer
			var range = document.selection.createRange();
			return range.text;
		}
	}
}

function mouseDown( evt ) {	
	if ( map.isInside( mousex, mousey ) ) {
		switch ( evt.which ) {
			case 1:
				map.set( mousex, mousey, 1 );
				break;
			case 2:
				break;
			case 3:
				map.set(mousex,mousey,0);
				break;
		}
	}
}

window.requestAnimFrame = (function(){
 return window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  function( callback ) { window.setTimeout( callback, 17 ); };
})();


function Map( w, h ) {
	this.w = w;
	this.h = h;
	this.mat = new Array( max );
	

	for ( var i = 0; i < max; i++ ) {
		this.mat[i] = new Array( max );
	}
	//Initializes all to 0
	for ( var i = 0; i < max; i++ ) {
		for( var j = 0; j < max; j++ )
		{
			this.mat[i][j] = 0;
		}
	}		
		
	this.isThisIn = function( e ) {
		var thereIs = false;
		for( var i = 0; i < this.h && !thereIs; i++ ) {
			for ( var j = 0; j < this.w && !thereIs; j++ ) {	
				if ( this.mat[i][j] === e ) thereIs = true;
			}
		}
		return thereIs;
	};
	this.isEnd = function() {
		return this.isThisIn( 3 );
	};		
	this.set = function( x, y, e ) {
		this.mat[y][x] = e;
	};
	this.get = function( x, y ) {
		return this.mat[y][x];
	};	
	this.isInside = function( x, y ) {
		return ( x >= 0 && x < this.w ) && ( y >= 0 && y < this.h );
	};
}



