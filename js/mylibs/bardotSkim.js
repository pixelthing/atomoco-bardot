/* Author: Atomoco: Craig Morey */

(function($){

	
	bardotSkimInit = function(){

		// copy the track to the skim
		var spreads = $( '.spread' );
		
		// add in the skim area
		$( 'body' ).append( '<div id="skim_outer"><div id="skim_inner"></div><div id="skim_hit_container"><div id="skim_hit_areas"></div></div><a id="skim_bookmark" class="zippy" href="#"><span id="skim_page_active" class="skim_page_no">0%</span><canvas id="skim_head"></canvas><canvas id="skim_tail"></canvas></a><a id="skim_ghostmark" href="#"><span id="skim_page_ghost" class="skim_page_no">0%</span></a></div>' );
		
		// clone the track contents into the skim area
		$( '.spread' ).clone().appendTo( $( '#skim_inner' ) );
		
		// set the height of the thumbnails
		$("#skim_outer img ").css({'height':'48px'});
		
		// clean up
		$( '#skim_inner header' ).remove();
		$( '#skim_inner div.bob' ).remove();
		var skimSpreads = $( '#skim_outer .spread' );
		$( skimSpreads ).each(function( key , el ) {
			
			$( el ).attr( 'id' , $( el ).attr( 'id' ) + 'skim' );
			
		})
		
		// add the skim hit areas
		for ( var i = 0 ; i < spreads.length ; i++ ) {
			$( '#skim_hit_areas' ).append('<a href="#">' + i + '</a>');
		}
		
		
		// initialise all the hit areas in the skim nav
		bardotSkimHitAreaInit();
		// set the size of the bookmarks
		bardotSkimMarkSize();
		
		// 
		SkimOpen = undefined;
		
		// hide the skim nav
		$( '#skim_outer' ).addClass( 'hidden' );
		
		// 
		$( '#skim_outer' ).mouseover( function () {
			bardotSkimOpen () ;
		} );
		$( '#skim_outer' ).mouseout( function () {
			bardotSkimHide () ;
		} );
	
	};
	
	bardotSkimOpen = function () {
	
		// open the skim nav bar
		$( '#skim_outer' ).removeClass( 'hidden' );
		// tell the system the skim bar is open
		SkimOpen = true;
	
	}
	
	bardotSkimHide = function (  ) {
	
		// if the skim nab isn't open, exit;
		if ( SkimOpen == undefined ) {
			return;
		}
		// move the ghost bookmark back to the current spread
		bardotSkimMarkMove( 'ghost' , bardot.currentSpread );
		// kill all the skim hover states
		$( '#skim_outer .spread' ).removeClass( 'hover' );
		// hide the skim nav bar
		$( '#skim_outer' ).addClass( 'hidden' );
		SkimOpen = '';
	
	}
 
 
	bardotSkimHitAreaInit = function(){
		
		var hitAreas = $( '#skim_hit_areas a' );
	
		$(hitAreas).each(function(key,el) {
			
			$(el).click( function ( e ) {
			
				e.preventDefault();
				bardotNavJumpToSpread( key )
			
			} );
			
			$(el).mouseover( function ( e ) {
				bardotSkimHitHover( key );
			} );
			
			el.addEventListener("touchStart", bardotSkimHitHover, false);
		
		})
	
	};
 
 
	bardotSkimHitHover = function( key ){
	
		// grab all the spreads in the skim nav
		var skimSpreads = $('#skim_outer div.spread');
		// remove the hover state from all spreads
		$( skimSpreads ).removeClass( 'hover' );
		// add the hover state to the required spread
		$( skimSpreads[key] ).addClass( 'hover' );
		// move the ghost book mark to the right place
		bardotSkimMarkMove( 'ghost' , key );
	
	};
	
	bardotSkimMarkSize = function() {
	
		// grab all the spreads in the skim nav
		var skimSpreads = $('#skim_outer .spread');
		// divide the window width by the amount of spreads
		var windowW = $(window).width();
		markWidth = Math.round ( windowW / skimSpreads.length );
		// set the book mark and the ghost bookmark as that size
		$( '#skim_bookmark' ).css({ 'width':markWidth - 6 });
		//$( '#skim_ghostmark' ).css({ 'width':markWidth });
		// move to correct position
		bardotSkimMarkMove( 'book' , bardot.currentSpread );
		//bardotSkimMarkMove( 'ghost' , bardot.currentSpread );
		
		bardotSkimMarkDrawTail ( markWidth ) ;
		bardotSkimMarkDrawHead ( markWidth ) ;
	
	} 
	
	bardotSkimMarkMove = function ( mark , slot ) {
	
		// have we got the size of a bookmark?
		if ( markWidth == undefined ) {
			bardotSkimMarkSize();
		}
	
		// position
		var newX = markWidth * ( slot );
		
		// grab all the spreads in the skim nav
		var skimSpreads = $('#skim_outer .spread');
		
		// move
		if ( mark == 'ghost' ) {
			bardotNavMoveTo ( '#skim_ghostmark' , newX , 0 , 300 ) ;
			$('#skim_page_ghost').text( Math.round( ( slot / skimSpreads.length ) * 100 ) + '%' );
		} else {
			bardotNavMoveTo ( '#skim_bookmark' , newX , 0 , 300 ) ;
			$('#skim_page_active').text( Math.round( ( slot / skimSpreads.length ) * 100 ) + '%' );
		}
	
	}
	
	bardotSkimMarkDrawTail = function ( width ){  
	
		if ( width < 46 ) {
			width = 46;
		}
	
		var canvas = document.getElementById('skim_tail');
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			
			ctx.clearRect ( 0 , 0 , '100%' , '100%' );
			
			ctx.beginPath();
			ctx.moveTo( 0 , 0 );
			ctx.lineTo( width , 0 ) ;
			ctx.lineTo( width , 10 );
			ctx.lineTo( width/2 , 0 );
			ctx.lineTo( 0 , 10 );
			ctx.fillStyle = '#990000';
			ctx.fill();
			
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY= 4;
			ctx.shadowBlur = 4;
			ctx.shadowColor = 'rgba( 0 , 0 , 0 , 1 )';
		}
		
	} 
	
	bardotSkimMarkDrawHead = function ( width ){  
	
		if ( width < 46 ) {
			width = 46;
		}
	
		var canvas = document.getElementById('skim_head');
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			
			ctx.clearRect ( 0 , 0 , '100%' , '100%' );
			
			ctx.beginPath();
			ctx.moveTo( 0 , 5 );
			ctx.lineTo( 5 , 5 ) ;
			ctx.lineTo( 5 , 0 );
			ctx.fillStyle = '#000';
			ctx.fill();
			
			ctx.beginPath();
			ctx.moveTo( width + 5 , 0 );
			ctx.lineTo( width + 10 , 5 ) ;
			ctx.lineTo( width + 5 , 5 );
			ctx.fillStyle = '#000';
			ctx.fill();
			
			/*
			ctx.beginPath();
			ctx.moveTo( width + 5 , 0 );
			ctx.lineTo( width + 10 , 5 ) ;
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#c00';
			ctx.stroke(); 
			*/
		}
		
	} 
 
 
})(jQuery);

