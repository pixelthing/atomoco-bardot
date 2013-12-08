/* Author: Atomoco: Craig Morey */

(function($){
  
 
    bardotSize = function(options){

		// find the screen sizes    
		bardot.window = {};
		bardot.window.w = document.documentElement.clientWidth;
		bardot.window.h = document.documentElement.clientHeight;

	    // extend the options from pre-defined values:
	    var options = $.extend({
	        callback: function() {}
	    }, arguments[0] || {});
    
    	// is this site running in "standalone" mode (ie iOS webApp launched from homescreen)
    	var standalone = false;
    	if (window.navigator.standalone != undefined && window.navigator.standalone != false) {
    		standalone = true;
    		$("html").addClass("standalone");
    	}
		
		// calculate the orientation
		if ( bardot.window.w < bardot.window.h ) {
			bardot.orient = 'v' ;
		} else {
			bardot.orient = 'h' ;
		}
	
		//log( 'width: ' + $(window).width() + 'px - height: ' + $(window).height() + 'px');
	
		bardotNavMoveTo( bardot.currentSpread , false , false, false );
		
    	// build catalogue dimensions
		setTimeout( function () {
    		bardotCatalogueDims();
		} , 2000 )
				
		// set the css class of the body
		if ( bardot.orient == 'v' ) {
			$("body").removeClass("horiz").addClass("vert");
		} else {
			$("body").removeClass("vert").addClass("horiz");
		}
		
		// adjust the bookmarks to the correct size and position (only if they're there - on first load we do sizing before we've created the skim nav)
		if ( $('#skim_outer').length ) {
			bardotSkimMarkSize();
		}
		
		// debug
		$("#orient").html( bardot.orient );
	
		// set the width/height of the body and reset the height of the images
		var bodyHeight = (standalone ? bardot.window.h-20 : bardot.window.h );
		$("body").css({'position':'relative','width':bardot.window.w + 'px','height':bodyHeight + 'px'});
		//$(".page ").css({'height':bodyHeight - 9 + 'px'});
		$("#track_outer .thumb img ").css({'height':bodyHeight - 8 + 'px'}); // note the -8 - that's the height of the skim navigation at rest

		// on resize
		resizingNow = false;
		if (!isTouchDevice()) {
			$(window).resize(function() {
				// give it a moment to settle, so it doesn't try to keep calculating while resizing
				if ( resizingNow != false ) {
					return;
				}
				resizingNow = setTimeout( function() {
					// check screensize
					bardotSize();
				} , 500 );
				
			});
		} else {
			window.onorientationchange = detectIPadOrientation;  
		}
		
	    // call the callback and apply the scope:
	    options.callback.call(this);

		function detectIPadOrientation () { 
		  
			if ( orientation == 0 || orientation == 180 ) { 
				bardot.orient = 'v';
			} else {  
				bardot.orient = 'h';
			} 
			bardotSize();
			
		}
		
    };
 
 
})(jQuery);


