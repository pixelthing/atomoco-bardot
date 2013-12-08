/* Author: Atomoco: Craig Morey */

(function($){


	// MOVE AN ELEMENT TO A POSITION USING APPROPRIATE TECH (normally moving a spread)
 
    bardotNavMoveTo = function( spreadNo , newX, newY, duration, method ) {
    
		//console.profile('bardotNavMoveTo');
		
    	if ( ( spreadNo == undefined || spreadNo == false ) && spreadNo != '0' ) {
    		el = '.spread';
    	} else if ( String(spreadNo).indexOf('.') != -1 || String(spreadNo).indexOf('#') != -1 ) {
    		el = spreadNo ;
    	} else {
    		el = '#spread' + spreadNo ;
    	}
    	if ( duration === 0 ) {
    		duration = '0';
    	} else if ( duration == undefined || duration == false ) {
    		duration = '';
    	}
    	if ( method == undefined ) {
    		method = false;
    	}
		//console.log( el + ' newX:' + newX + ' newY:' + newY );
    
    	// if killing any imposed transforms
    	if ( ( newX == false || newX == undefined ) && ( newY == false || newY == undefined ) ) {

			// css transforms
			if (Modernizr.csstransforms3d || Modernizr.csstransforms) {
			
				$(el).css({ 
					'-webkit-transition-duration' : duration ,
					'-webkit-transform' : '',
					'-moz-transition-duration' : duration ,
					'-moz-transform' : '',
					'-ms-transition-duration' : duration ,
					'-ms-transform' : '',
					'transition-duration' : duration ,
					'transform' : ''
				});
				
			// JQuery
			} else {
			
			}
    	
    	// if moving to a point
    	} else {
				
			// css 2D transforms
			if (Modernizr.csstransforms && method == false) {
			
				$(el).css({ 
					'-webkit-transition-duration' : duration ,
					'-webkit-transform' : 'translate( ' + newX + 'px,0)',
					'-moz-transition-duration' : duration ,
					'-moz-transform' : 'translate( ' + newX + 'px,0)',
					'-ms-transition-duration' : duration ,
					'-ms-transform' : 'translate( ' + newX + 'px,0)',
					'transition-duration' : duration ,
					'transform' : 'translate( ' + newX + 'px,0)'
				});
				
			// JQuery
			} else {
			
			}
    	}
		//console.profileEnd('bardotNavMoveTo');
    
    }
    
    
    
    
    // NEXT BUTTON EVENT
 
    bardotNavNext = function(  ){
    
    	var spreads = bardot.catalogue.total.spreads;
    
    	// don't go too far
    	if ( bardot.currentSpread >= spreads - 1 ) {
    		bardot.currentSpread = spreads - 1;
    		$("#html_spread").html( bardot.currentSpread );
    		bardotNavElastic();
    		bardotNavJudder();
    		return;
    	}
    	
    	// if vertical, move page by page
    	if ( bardot.orient == 'v' ) {
    		
    		bardotNavNextPage();
    		
    	// if horizontal, move spread by spread
    	} else {
    		
    		bardotNavJumpToSpread( bardot.currentSpread + 1 );
    	
    	}
		
	}

 
	
    // NEXT PAGE
    
    bardotNavNextPage = function(){
		
    	// get all the pages in the current spread
    
    	var pagesInSpread = bardot.catalogue.spreads[bardot.currentSpread].pages;
    
    	// are we already at the last page in a spread?
    	if ( bardot.currentPageInSpread >= ( pagesInSpread.length - 1 ) ) {
    		
    		bardotNavJumpToSpread ( bardot.currentSpread + 1 );
    		return;
    		
    	}
    	
    	// set new page in spread
    	bardot.currentPageInSpread++ ;
    	
    	bardotNavJumpToPageInSpread ( bardot.currentSpread , bardot.currentPageInSpread );
    	
    	// debug
    	$("#html_pageinspread").html( bardot.currentPageInSpread );
    	
    
    }
    
   
 
 
    // BACK BUTTON EVENT
    
    bardotNavBack = function(options){
    
    	// don't go too far
    	if ( bardot.currentSpread < 1 ) {
    	
    		bardot.currentSpread = 0;
    		$("#html_spread").html( bardot.currentSpread );
    		bardotNavElastic();
    		bardotNavJudder();
    		//alert( 'you\'re at the beginning' );
    		return;
    		
    	}
    	
    	// if vertical, move page by page
    	if ( bardot.orient == 'v' ) {
    		
    		bardotNavBackPage();
    		
    	// if horizontal, move spread by spread
    	} else {
   
    		bardotNavJumpToSpread( bardot.currentSpread - 1 , -1 );
    	
    	}
		
	} 
    
    
    
    
    // BACK PAGE
    
    bardotNavBackPage = function ( ){
		
    	// get all the pages in the current spread
    	var pagesInSpread = bardot.catalogue.spreads[bardot.currentSpread].pages;
    	
    	//log( bardot.currentPageInSpread + ' < ' + pagesInSpread.length );
    
    	// are we already at the first page in a spread?
    	if ( bardot.currentPageInSpread <= 0 ) {
    		
    		bardotNavJumpToSpread ( bardot.currentSpread -1 , -1 );
    		return;
    		
    	}
    	
    	// set new page in spread
    	bardot.currentPageInSpread-- ;
    	
    	bardotNavJumpToPageInSpread ( bardot.currentSpread , bardot.currentPageInSpread );
    	
    	// debug
    	$("#html_pageinspread").html( bardot.currentPageInSpread );
    
    }
	
	
	
	// ping everything back to it's original position (ie, kill any element styling)
	bardotNavElastic = function () {
	
		if ( bardot.orient == 'v' ) {
		
			bardotNavJumpToPageInSpread ( bardot.currentSpread , bardot.currentPageInSpread );
		
		} else {
		
			bardotNavMoveTo( );
		
		}
	
	}
	
	
	// JUMP TO A SPECIFIC SPREAD
 
    bardotNavJumpToSpread = function( spreadNo , pageInSpread ){
    
    	// pageInSpread goes direct to the page in the spread. By default it's page "0". If set to "-1", will always go to last page
    	
    	//log ( 'jump to spread ' + spreadNo );
    	
    	// set up the spread we're leaving
    	var oldSpread = bardot.currentSpread;
    	    	
    	bardotNavMoveTo( oldSpread , 0 , 0 );
    	
    	// if we're being asked to go to the same spread we're already looking at, just twang it back to the start of the spread
    	if ( oldSpread == spreadNo ) {
    		return;
    	}
    	
    	// set a delay before showing the final page, this gives the fake impression of flicking through intermediate pages
    	pageDist = Math.abs ( spreadNo - oldSpread ) ;
    	var delay = 200;
    	if ( pageDist == 1 ) {
    		delay = 0;
    	}
    	
    	// kill the current page
    	$('.spread').removeClass( 'active' );
    		
    	// forward
    	if ( spreadNo > oldSpread ) {
    	
	    	// unload the spread we're leaving behind
			setTimeout( function() {
	    		bardotUnLoadSpread( oldSpread );
			}, delay );
	    	
	    	// load up the new spread
	    	bardotLoadUpSpread( spreadNo );
    		
    		// remove the current spread from being "active"
	    	$( '#spread' + oldSpread).addClass( 'read' );
	    	$( '#spread' + oldSpread + 'skim').addClass( 'read' );
		    
		    // make all spreads in-between change from unread to read
    		for ( thisSpread = oldSpread + 1 ; thisSpread <= spreadNo - 1 ; thisSpread ++ ) {
		    	$( '#spread' + thisSpread).removeClass( 'unread' ).addClass( 'read' );
		    	$( '#spread' + thisSpread + 'skim').removeClass( 'unread' ).addClass( 'read' );
    		}
    		// make the new spread active
			setTimeout( function() {
				$( '#spread' + spreadNo).removeClass( 'unread' ).addClass( 'active' );
				$( '#spread' + spreadNo).find('.page').addClass( 'zippy' )
			}, delay );
			$( '#spread' + spreadNo + 'skim').removeClass( 'unread' ).addClass( 'active' );
    	
    	// backward
    	} else {
    	
	    	// unload the spread we're leaving behind
			setTimeout( function() {
	    		bardotUnLoadSpread( oldSpread );
			}, delay );
	    	
	    	// load up the new spread
			bardotLoadUpSpread( spreadNo );
    		
    		// remove the current spread from being "active"
	    	$( '#spread' + oldSpread).addClass( 'unread' );
	    	$( '#spread' + oldSpread + 'skim').addClass( 'unread' );
		    
		    // make all spreads in-between change from unread to read
    		for ( thisSpread = oldSpread - 1 ; thisSpread >= spreadNo + 1 ; thisSpread -- ) {
		    	$( '#spread' + thisSpread).removeClass( 'read' ).addClass( 'unread' );
		    	$( '#spread' + thisSpread + 'skim').removeClass( 'read' ).addClass( 'unread' );
    		}
    		// make the new spread active
			setTimeout( function() {
				$( '#spread' + spreadNo).removeClass( 'read' ).addClass( 'active' );
				$( '#spread' + spreadNo).find('.page').addClass( 'zippy' )
			}, delay );
			$( '#spread' + spreadNo + 'skim').removeClass( 'read' ).addClass( 'active' );
    	
    	}

		// remove the hardware acceleration from the old spread
    	setTimeout( function () {
    		$( '.read').find('.page').removeClass( 'zippy' );
    		$( '.unread').find('.page').removeClass( 'zippy' );
    	} , 300 );
    			
    	// reset the new current spread
    	bardot.currentSpread = spreadNo;
    	$("#html_spread").html( spreadNo );
    	
		// move the bookmarks to the right place
		bardotSkimMarkMove ( 'book' , bardot.currentSpread );
		bardotSkimMarkMove ( 'ghost' , bardot.currentSpread );
		
			
		// if we're requesting to go to the last page in the spread (i.e., we're going backwards page-by-page)
		if ( !pageInSpread ) {
		
			bardot.currentPageInSpread  = 0;
	    	
		} else if ( pageInSpread == -1 ) {
		
			bardot.currentPageInSpread  = bardot.catalogue.spreads[ spreadNo ].pages.length - 1;
		
		} else {
		
			bardot.currentPageInSpread  = pageInSpread;
		
		}
		
		bardotNavJumpToPageInSpread ( spreadNo , bardot.currentPageInSpread ) ;
    	
    	// debug
    	$("#html_pageinspread").html( bardot.currentPageInSpread );
    
    }
	
	
	// JUMP TO A SPECIFIC PAGE
 
    bardotNavJumpToPage = function( newPage ){
    
    	// check that we're looking at the correct spread
		
		// get the spread
		var spreadToMove = $( '#' + newPage ).parent();    	
    	// new scroll position
		var newLeft = '-' + $( '#' + newPage ).position().left;
    	
    	// move to that point
    	if ( $( spreadToMove ).position().left != newLeft ) {
	    	bardotNavMoveTo( spreadToMove, newLeft , 0 );
	    }
    
    }
	
	

    bardotNavJumpToPageInSpread = function ( spreadNo , pageInSpread ) {
    
    	var pagesInSpread = bardot.catalogue.spreads[ spreadNo ].pages;
    	
    	// if there's only one page in the spread, or the orientation is horizontal, just zero the position of the spread
    	if ( pagesInSpread.length <= 1 || bardot.orient == 'h' ) {
    	
    		return;
    	
    	}
    
    	// if first page in spread, take off the gap on the left
    	if ( pageInSpread == 0 ) {
    	
    		var newLeft = - bardot.catalogue.pages[ pagesInSpread[ 0 ] ].left;
    	
    	// if last page in a spread, total the width of all pages
    	} else if ( pageInSpread >= pagesInSpread.length - 1 ) {
    	
	    	var newLeft = 0
	    	$.each( pagesInSpread, function ( index , item) {
	    		
	    		if ( index >= pageInSpread ) {
	    			return;
	    		}
	    		newLeft -= bardot.catalogue.pages[item].width;
	    	
	    	} )
    	
    	// if a page in the middle of a three page spread, center on this page	
    	} else {
    	
	    	var newLeft = Math.round( ( bardot.window.w - bardot.catalogue.pages[ pagesInSpread[ pageInSpread ] ].width ) / 2 ) - bardot.catalogue.pages[ pagesInSpread[ 0 ] ].left; // the gap on either side of the page (the window width minus page width / 2), - page 0 left offset
	    	$.each( pagesInSpread, function ( index , item) {
	    		
	    		if ( index >= pageInSpread ) {
	    			return;
	    		}
	    		newLeft -= bardot.catalogue.pages[item].width;
	    	
	    	} )
    	
    	}
    	
    	//console.log( newLeft );
    		
	    	
    	// move to that point
    	//if ( $( '#spread' + spreadNo ).position().left != newLeft ) {
    		bardotNavMoveTo( spreadNo, newLeft , 0 );
    	//}
    	
    	
    }
	
	
	// ping everything back to it's original position (ie, kill any element styling)
	bardotNavJudder = function () {

		// if you're moving the page with your fingure, give it chance to return to the zero position before the judder.
		if (isTouchDevice()) {
		
			setTimeout(function() {
				$( '#spread' + bardot.currentSpread).addClass( 'judder' );
				setTimeout(function() {
					$( '#spread' + bardot.currentSpread).removeClass( 'judder' );
				},500);
			},300);

		} else {
		
			setTimeout(function() {
				$( '#spread' + bardot.currentSpread).addClass( 'judder' );
				setTimeout(function() {
					$( '#spread' + bardot.currentSpread).removeClass( 'judder' );
				},500);
			},0);
			
		}
	}
			
	// translation to cssTransform:translate3d
	get3DPosition = function (el) {
			
		var a = $(el).css( '-webkit-transform' );
		if (a == undefined) {
			a = $(el).css( '-moz-transform' );
		}
		if (a == undefined) {
			a = $(el).css( '-ms-transform' );
		}
		if (a == undefined) {
			var b = $(el).position();
			return {
				x : b.left,
				y : b.top
			}
		}
		if( a.toString() != 'none' )
		{
			var b = a.match(/translate3d\(([^)]+)\)/);
			var c = a.match(/matrix\(([^)]+)\)/);
			if (b != undefined) {
				var b = a.match(/translate3d\(([^)]+)\)/)[1].split( ',' );
				return {
					x : parseInt( b[0].replace( 'px', '' ) ),
					y : parseInt( b[1].replace( 'px', '' ) ),
					z : parseInt( b[2].replace( 'px', '' ) )
				}
			} else if (c != undefined) {
				var c = a.match(/matrix\(([^)]+)\)/)[1].split( ',' );
				return {
					x : parseInt( c[4].replace( 'px', '' ) ),
					y : parseInt( c[5].replace( 'px', '' ) )
				}
			} else {
				return {
					x : 0,
					y : 0,
					z : 0
				}
			}
		} else {
			return {
				x : 0,
				y : 0,
				z : 0
			}
		}
	}
	
	
	
})(jQuery);