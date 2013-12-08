/* Author: Atomoco: Craig Morey */
		
(function($){
 
	$.fn.bardotSkimTouch = function(){
	
		if (!isTouchDevice()) {
			return;
		}
		
		// no this?
		if (!this) return false;
	
		// kill all default scrolling
		document.ontouchmove = function(e){
			e.preventDefault();
		}
		
		// each item
		return this.each(function(key,el) {
		
			var touchCoord = { x: 0, y: 0 }
			var touchSpread = -1;
			var touchLastSpread = bardot.currentSpread;
			
			function touchStart(e) {
				
				e.preventDefault();
				
				// open the skim bar
    			bardotSkimOpen () ;
				
		    	// have we got the size of a bookmark?
		    	if ( markWidth == undefined ) {
		    		bardotSkimMarkSize();
		    	}
				
				// detect which button is touched
				touchCoord.x = e.targetTouches[0].pageX ;
				touchSpread = Math.floor ( touchCoord.x / markWidth ) ;
				
				// if we're hitting a new spread, pop the thumbnail
				if ( touchSpread != touchLastSpread ) {
					bardotSkimHitHover( touchSpread );
				}
			}
			
			function touchMove(e) {
				
				// detect which button is touched
				touchCoord.x = e.targetTouches[0].pageX ;
				touchSpread = Math.floor ( touchCoord.x / markWidth ) ;
				
				// if we're hitting a new spread, pop the thumbnail
				if ( touchSpread != touchLastSpread ) {
					bardotSkimHitHover( touchSpread );
				}
				
				// set the last button we touched
				touchLastSpread = touchSpread;
			}
			
			function touchEnd(e) {
			
				// if we haven't started by touching a tile, exit
				if ( touchSpread < 0 ) {
					return;
				}
			
				// if we've lifted the finger on a spread that's not the current one
				if ( touchSpread != bardot.currentSpread ) {
				
					// grab all the spreads in the skim nav
					var skimSpreads = $('#skim_outer .spread');
		
					// ask the user to jump to there
					var response = confirm( 'Jump to ' + Math.round ( ( touchSpread / skimSpreads.length ) * 100 ) + '%?' ) ;
					if ( !response ) {					
						touchSpread = -1;
						touchLastSpread = bardot.currentSpread;
					}
				}
				
				// close the skim bar
				setTimeout( function () {
					bardotSkimHide();
				} , 50 )
				
				// run the jump to after the bar has retreated
				if ( touchSpread >= 0 ) {
					setTimeout( function () {
						bardotNavJumpToSpread( touchSpread ) ;
					} , 300 )
				}
			
			}
			
			// Swipe was canceled
			function touchCancel(e) { 
				
				e.preventDefault();
			
				touchSpread = -1;
				touchLastSpread = bardot.currentSpread;
			}
			
			// Add gestures to all swipable areas
			this.addEventListener("touchstart", touchStart, false);
			this.addEventListener("touchmove", touchMove, false);
			this.addEventListener("touchend", touchEnd, false);
			this.addEventListener("touchcancel", touchCancel, false);
		
		})
		
		
	};
 
})(jQuery);