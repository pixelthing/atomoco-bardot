/* Author: Atomoco: Craig Morey */

// only touch capable
isTouchDevice = function (){
	var el = document.createElement('div');
  eventName = 'ontouchstart';
  var isSupported = (eventName in el);
  if (!isSupported) {
    el.setAttribute(eventName, 'return;');
    isSupported = typeof el[eventName] == 'function';
  }
  el = null;
  return isSupported;
};


		
(function($){
 
	$.fn.bardotTouch = function(options){
	
		if (!isTouchDevice()) {
			return;
		}
		
		// no this?
		if (!this) return false;
	
		// kill all default scrolling
		document.ontouchmove = function(e){
			e.preventDefault();
		}
		
		// Default thresholds & swipe functions
		var defaults = {
			
		};
		var options = $.extend(defaults, options);
		
		// each item
		return this.each(function( key , el ) {
			
			// Private variables for each element
			var spreadNo = false;
			var fingers = 0;
			var originalCoord = { x: 0, y: 0 }
			var finalCoord = { x: 0, y: 0 }
			var originalCoord1 = { x: 0, y: 0 }
			var finalCoord1 = { x: 0, y: 0 }
			var originalTime = 0;
			var originalTime1 = 0;
			var originalDist = 0;				// starting distance (px) between fingers 1 & 2 on the screen (for pinch/zoom)
			var originalScale = 1;				// starting scale of the spread
			var originalTranslate = {};
			var prevOriginalTime = {};
			var prevOriginalCoord = {};
			var zooming = false;	// are we currently pinch to zooming the page (i.e., kill all tap/slide gestures during this process)
			var zoom = 1;	// the zoom factor on the current spread
			
			// Swipe was started
			function touchStart(event) {
			
				event.preventDefault();
				
				spreadNo = $(el).attr( 'id' ).replace( 'spread' , '' );
			
				// set up memory to use in the next touch event
				prevOriginalTime = originalTime;
				prevOriginalCoord = originalCoord;
				
				// existing scale
				originalScale = $(el).css('-webkit-transform');
				
				// first finger position
				originalCoord.x = event.targetTouches[0].pageX
				originalCoord.y = event.targetTouches[0].pageY
				finalCoord.x = originalCoord.x
				finalCoord.y = originalCoord.y
				
				originalTime = new Date().getTime();
				originalTranslate = get3DPosition(el);
				
				fingers = event.targetTouches.length;
			}
			
			// Store coordinates as finger is moving
			function touchMove( event ) {
			
				if ( zooming == true ) {
					return;
				}
			
				// first finger
				finalCoord.x = event.targetTouches[0].pageX // Updated X,Y coordinates
				finalCoord.y = event.targetTouches[0].pageY
				
				var changeX = finalCoord.x - originalCoord.x;
				var changeY = finalCoord.y - originalCoord.y;
				
				// move the spread under the finger
				if( changeX != 0 ) {
				
					var newX = originalTranslate.x + changeX;
					var newY = originalTranslate.y + changeY;
					
					bardotNavMoveTo ( spreadNo , newX , 0 , 0 );
					
				}
			}
			
			// Done Swiping
			// Swipe should only be on X axis, ignore if swipe on Y axis
			// Calculate if the swipe was left or right
			function touchEnd(event) {
				if ( zooming == true ) {
					return;
				}
			
				var finalTime = new Date().getTime();
				
				// first finger displacement whilst down
				var changeX = finalCoord.x - originalCoord.x;
				var changeY = finalCoord.y - originalCoord.y;
				var changeXAbs = Math.abs(changeX);
				
				// dimensions/positions of the spread
				//var spreadPosTrans = get3DPosition('#spread' + bardot.currentSpread);
				//var spreadPosX = spreadPosTrans.x;
				var spreadWidth = $('#spread' + bardot.currentSpread).width();
				
				//log( 'tap start/end : ' + originalTime + ' -> ' + finalTime + ' = ' + ( finalTime - originalTime ) );
				//log( 'last tap start/this tap start : ' + prevOriginalTime + ' ->  ' + originalTime + ' = ' + ( originalTime - prevOriginalTime ) );				
				//log( "spreadPos: " + spreadPosX + " + spread width:" + spreadWidth + " > " + $(document).width() );
				
				// double tap
				if ( ( ( originalTime - prevOriginalTime ) < 400 && changeXAbs < 20 ) && fingers == 1 ) {
				
					log( "DOUBLETAP! TIME: " + ( originalTime - prevOriginalTime ) + ' DIST: ' + changeXAbs + 'px FINGERS: ' + fingers );
				
				// single tap
				} else if ( ( finalTime - originalTime ) < 250 && changeXAbs < 20 && fingers == 1 ) {
				
					log( "SINGLETAP! TIME: " + ( finalTime - originalTime ) + ' DIST: ' + changeXAbs + 'px FINGERS: ' + fingers );
				
				// quick flick back
				} else if ( changeX > 0 && changeXAbs < ($(document).width()/3) && ( finalTime - originalTime ) < 250 ) {
				
					log( "QFLICKBACK! TIME: " + ( finalTime - originalTime ) + ' DIST: ' + changeXAbs + 'px < ' + ($(document).width()/3) + 'px FINGERS: ' + fingers );
					bardotNavBack();
					return; 
					
				// quick flick fwd
				} else if ( changeX < 0 && changeXAbs < ($(document).width()/3) && ( finalTime - originalTime ) < 250 ) {
				
					log( "QFLICKFWD! TIME: " + ( finalTime - originalTime ) + ' DIST: ' + changeXAbs + 'px < ' + ($(document).width()/3) + 'px FINGERS: ' + fingers );
					bardotNavNext();
					return; 
				
				// slow flick back, past the whole spread
				} else if ( changeX > 0 && changeXAbs >= ($(document).width()/3) ) {
				
					log( "SFLICKBACK! TIME: " + ( finalTime - originalTime ) + " DIST: " + changeXAbs + 'px >= ' + ($(document).width()/3) + 'px FINGERS: ' + fingers );
					bardotNavBack();
					return; 
				
				// slow flick forward, past the whole spread
				} else if ( changeX < 0 && changeXAbs >= ($(document).width()/3) ) {
				
					log( "SFLICKFWD! " + ( finalTime - originalTime ) + " DIST: " + changeXAbs + 'px >= ' + ($(document).width()/3) + 'px FINGERS: ' + fingers );
					bardotNavNext();
					return; 
				
				// twang!
				} else if ( zoom == 1 ) {
				
					log( "TWANG! TIME: " + ( finalTime - originalTime ) + " DIST: " + changeXAbs + 'px < ' + ($(document).width()/3) + 'px FINGERS: ' + fingers );
					zoom = 1;
					bardotNavElastic();
					return; 
				
				}
				
			}
			
			// Swipe was canceled
			function touchCancel(event) { 
				//log('Canceling swipe gesture...')
			}
			
			
			// pinch zoom
			function touchPinch ( event ) {
			
				event.preventDefault();
			
				zooming = true;
				
				//log( 'zoom: ' + event.scale + ' * ' + zoom + ' = ' + ( event.scale * zoom ) );
				
				if (Modernizr.csstransforms3d) {
					$(el).css({ 
						'-webkit-transition-duration' : '0' ,
						'-webkit-transform-origin' : event.pageX + 'px ' + event.pageY + 'px' ,
						/*'-webkit-transform' : 'scale(' + scale + ')'*/
					});
					$(el).webkitTransform('-webkit-transform : scale(' + event.scale * zoom + ')');
				} else if (Modernizr.csstransforms) {
				} else {
				}
			
			}
			
			// pinch zoom end
			function touchPinchEnd ( event ) {
			
				zooming = false;
				zoom = event.scale * zoom;
				
				// if you've gone to small, spring back to min size
				if ( zoom < 1 ) {
					zoom = 1;
					bardotNavElastic();
				} else {
					// fetch the right image to match the zoom level
				}
			
			}
			
			// Add gestures to all swipable areas
			this.addEventListener("touchstart", touchStart, false);
			this.addEventListener("touchmove", touchMove, false);
			this.addEventListener("touchend", touchEnd, false);
			this.addEventListener("touchcancel", touchCancel, false);
		
		})
		
		
	};
 
})(jQuery);








/************************

jQuerx Plugin webkitTransform for a simple webkitTransform which does not forget the previous settings.
use freely with the "do whatever your want with it" public domain license 
http://www.facesaerch.com/banana.html

*************************/
(function($){

	jQuery.fn.webkitTransform = function(cssstring) {

		return this.each(function() {
			var element = $(this);
			var wtstring;
			if($(element).attr('remember_webkit_transform'))
			{
				wtstring=$(element).attr('remember_webkit_transform');
			}
			else
			{
				;
			}
		
			if(!wtstring)
			{
				wtstring=cssstring;
			}
			else
			{
				
				csA= new Array();
				csA=cssstring.split(' ');
				csAA=new Array();
				for (var i=0; i<csA.length; i++)
				{
				
					tempA=csA[i].split('(');
					
					if(tempA.length==2)
					{
						tempA[0]=jQuery.trim(tempA[0]);
						tempA[1]=jQuery.trim(tempA[1]);
						tempA[1]=tempA[1].substring(0,(tempA[1].length-1));
					}
					csAA[tempA[0]]=tempA[1];
				}
			
				
				wtA= new Array();
				wtA=wtstring.split(' ');
				wtAA=new Array();
				for (var i=0; i<wtA.length; i++)
				{
				
					tempA=wtA[i].split('(');
					
					if(tempA.length==2)
					{
						tempA[0]=jQuery.trim(tempA[0]);
						tempA[1]=jQuery.trim(tempA[1]);
						tempA[1]=tempA[1].substring(0,(tempA[1].length-1));
					}
				
					wtAA[tempA[0]]=tempA[1];
					
				}
			
				for (j in csAA)
				{
					wtAA[j]=csAA[j];
				}
				
				var tempwtstring='';
				for(z in wtAA)
				{
					if(wtAA[z])
					{
						tempwtstring=tempwtstring+z+'('+wtAA[z]+') ';
					}
				}
			
				wtstring=tempwtstring;
			}
 	
			$(element).css('-webkit-transform', wtstring);
			$(element).css('-moz-transform', wtstring);
			$(element).css('-o-transform', wtstring);
			$(element).attr('remember_webkit_transform', wtstring)
   	
			return element;
		});
	};
 
	
 
})(jQuery);