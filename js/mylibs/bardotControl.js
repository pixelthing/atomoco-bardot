/* Author: Atomoco: Craig Morey */
    	
(function($){
 
    $.fn.bardotInit = function () {
    
		bardot = {};
    	bardot.time = {}
    	bardot.time.start = new Date().getTime();
    	
    	bardot.currentSpread = 0;
    	bardot.currentPageInSpread  = 0;
    	
    	// check screensize
		bardotSize();
    	// build catalogue
    	bardotCatalogue();
    	
    	// build catalogue dimensions
		setTimeout( function () {
    		bardotCatalogueDims();
		} , 2000 )
		
		setTimeout( function () {
		
			// load the front page
			bardotLoadUpSpread( bardot.currentSpread );
			$( '#track_outer #spread' + bardot.currentSpread ).addClass( 'active' );
	    	
			// start up touch gestures
			$( '#track_outer .spread' ).bardotTouch();
			
			// set up the skim navigation
			bardotSkimInit();
			$('#skim_outer').bardotSkimTouch();
			
		} , 2200 )
		
		setTimeout( function () {
		
			console.log( bardot );
			
		} , 2300 )
		
		
	}
	
	
	bardotCatalogue = function () {
	
		bardot.catalogue = {};
		
    	var spreads = $('#track_outer .spread');
    	var maxSpreads = spreads.length;
    	var pages = $('#track_outer .page');
    	var maxPages = pages.length;
    	
    	log( maxSpreads + ' spreads, ' + maxPages + ' pages' );
    	
    	bardot.time.catalogue = new Date().getTime();
    	bardot.catalogue.total = {};
    	bardot.catalogue.total.spreads = spreads.length;
    	bardot.catalogue.total.pages = pages.length;
    	bardot.catalogue.pages = new Array();
    	bardot.catalogue.spreads = new Array();
    	
    	// find the contents of each page
		pages.each( function( key , el ) {
		
			// setup
			elDom = $(el).get(0);
			var pageObj = {}
			pageObj.thumb = {}
			pageObj.preview = {}
			
			// find the id 
			var pageId = $(el).attr('id');
			pageObj.id = pageId;
			
			// find the spread that this page belongs to
			pageObj.spread = $(el).parent().parent().attr('id').replace('spread','');
			
			// find the thumbnail image
			var thumbImg = $(el).find('.thumb img');
			pageObj.thumb.src = thumbImg.attr('src');
			
			// find the preview image
			var prevImg = $(el).find('.thumb');
			pageObj.preview.src = prevImg.attr('href');
			
			var ajaxArea = document.createElement('div');
			ajaxArea.className = 'detail';
			elDom.appendChild(ajaxArea);
			
			// find the link to the page
			//var thumbAnchor = $(el).find('.thumb');
			//pageObj.url = thumbAnchor.attr('href');
			
			// swap the thumb image for the background of the page (faster, easier scaled)
			$(el).css('background-image','url(' + escape( pageObj.thumb.src ) +' )' );

			bardot.catalogue.pages[pageId] = pageObj;
		})
		
		// find the relationship of spreads to pages
		spreads.each( function( key , el ) {
		
			var spreadObj = {}
			spreadObj.pages = new Array();
			
			// find the pages in the spread
			var spreadPages = $(el).find('.page');
			spreadPages.each( function( key , el ) {
			
				spreadObj.pages[key] = $(el).attr( 'id' );
			
			})
			
			bardot.catalogue.spreads[key] = spreadObj;
		})
	
	}
	
	// step through the pages in the catalogue and find their positions and dimesions
	
	bardotCatalogueDims = function () {
    	
    	var allPages = bardot.catalogue.pages;
    	
    	// find the contents of each page
    	for ( key in allPages ) {
		
			// setup
			elDom = $( '#' + key ).get(0);
			
			// find the position in the spread
			bardot.catalogue.pages[key].left = elDom.offsetLeft;
			
			// find the width of the page
			bardot.catalogue.pages[key].width = elDom.offsetWidth;
			
		}
	
	}
	

	
	bardotLoadUpSpread = function( spreadNo ) {
	
		// can't unload spreads that don't exist
		if ( bardot.catalogue.spreads[spreadNo] == undefined ) {
			return;
		}
		
		// find all the pages in the spread
		var pages = bardot.catalogue.spreads[spreadNo].pages;
		
		// load up each page
		$.each( pages , function( index , item ) {
			bardotLoadUpPage( item );
		})
		
		// set the spread up with the right classes.
		$( '#spread' + spreadNo ).find('.page').addClass( 'zippy' );
	
	}
	
	bardotUnLoadSpread = function( spreadNo ) {
	
		// can't unload spreads that don't exist
		if ( bardot.catalogue.spreads[spreadNo] == undefined ) {
			return;
		}
		
		// find all the pages in the spread
		var pages = bardot.catalogue.spreads[spreadNo].pages;
				
		// unload up each page
		$.each( pages , function( index , item ) {
			bardotUnLoadPage( item );
		})
	
	}
	
	bardotLoadUpPage = function( pageKey ) {
		
		var pageAjax = $( '#' + pageKey ).find('div');
		
		// if it's already loaded, don't load again
		if ( $( pageAjax ).html().length > 0 ) {
			log( 'ALREADY LOADED: ' + pageKey );
			return;
		}
		
		$( pageAjax ).css('background-image','url(' + escape( bardot.catalogue.pages[pageKey].preview.src ) +' )' );
		
		/*
		// get the page HTML
		$.ajax({
			url: pageUrl,
			success: function(data){
				
				// grab just the section
				var insertHTML = $(data).find('.page').html();
				
				// stick it in the page
				$(elDom).find('.bob1').append($(insertHTML));
				
				// change the fig background for the image
				
				var size1024 = imgUrl.replace('.48.','.1024.');
				//log(size1024);
				
				$(elDom).find('.page_scan').css('background-image','url(' + escape( size1024 ) +' )' );
				
			}
		});
		*/
		
	
	}
	
	bardotUnLoadPage = function( pageKey ) {
	
		if ( pageKey == undefined || pageKey == false ) {
			return;
		}
		
		// kill the page
		$('#' + pageKey + ' div.bob1').text('');
		$('#' + pageKey + ' div.bob1').css('background-image','' );
		
	}
	
})(jQuery);