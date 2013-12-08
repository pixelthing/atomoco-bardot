<?php

	ini_set( 'display_errors', true );
	require( 'functions.php' );

	// get a list of all the directories in the pages directory
	
	define ( 'PATH' , 'pages/' );
	
	$pages_array = dir_array( PATH , 'dir' );
	
	$pages_array = array_flip( $pages_array );
	$spreads_array = array();
	global $spreads_array;
	
	//echo '<pre>';print_r($pages_array);exit;
	
	// for each page directory
	$spreads = 1;
	$pagesperspread = 0;
	
	// firstly, deal with pages that have a spread already assigned to them (ie, the page is called something like '3-2' for spread 3, page 2)
	foreach ( $pages_array AS $key => $val ) {
	
		// ignore special pages
		if ( in_array( $key , array( 'cover' , 'back' ) ) ) {
			continue;
		}
	
		// does the file name suggest the spread the page should go in?
		if ( stristr( $key , '-' ) ) {
			$key_exploded = explode( '-' , $key );
			// spread name
			$spreads = $key_exploded[0];
			// page name
			$page = $key_exploded[1];
			
			// look up the files associated with that page and enter into the spread array
			process_page ( $key , $spreads , $page ) ;
	
			$pagesperspread++ ;
		}
	
	}
		
	// secondly, deal with pages that have NO spread already assigned to them (ie, the page is just called '15' or 'bob')
	foreach ( $pages_array AS $key => $val ) {
	
		if ($spreads > 25) {
			//break;
		}
	
		// ignore special pages
		if ( in_array( $key , array( 'cover' , 'back' ) ) ) {
			continue;
		}
	
		// does the file name suggest the spread the page should go in?
		if ( !stristr( $key , '-' ) ) {
		
			// if not already assigned a spread, assume there's 2 pages to each spread
			if ( $pagesperspread >= 2 ) {
				$pagesperspread = 0;
				// spread name
				while ( isset( $spreads_array[$spreads] ) ) {
					$spreads++;
				}
			}
			// page name
			$page = $key;
			
			// look up the files associated with that page and enter into the spread array
			process_page ( $key , $spreads , $page ) ;
	
			$pagesperspread++ ;
		
		}
	
	
	}
	
	// if there's a cover, move it to the start
	
	if ( $pages_array[ 'cover' ] ) {
		// look up the files associated with that page and enter into the spread array
		process_page ( 'cover' , 0 , 'cover' ) ;
	}
	
	// if there's a back, move it to the end
	if ( $pages_array[ 'back' ] ) {
		// look up the files associated with that page and enter into the spread array
		process_page ( 'back' , sizeof( $spreads_array ) , 'back' ) ;
	}
	
	//echo '<pre>';print_r($spreads_array);exit;

?><!DOCTYPE html>

<!-- 
320 and Up boilerplate extension
Author: Andy Clarke
Version: 0.9b
URL: http://stuffandnonsense.co.uk/projects/320andup 
-->

<!--[if IEMobile 7 ]><html class="no-js iem7"><![endif]-->
<!--[if lt IE 7 ]><html class="no-js ie6" lang="en"><![endif]-->
<!--[if IE 7 ]><html class="no-js ie7" lang="en"><![endif]-->
<!--[if IE 8 ]><html class="no-js ie8" lang="en"><![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7)|!(IEMobile)|!(IE)]><!--><html class="no-js" lang="en"><!--<![endif]-->

<head>
<meta charset="utf-8">

<title>Bardot</title>
<meta name="description" content="">
<meta name="author" content="">
<meta http-equiv="cache-control" content="no-cache">


<!-- http://t.co/dKP3o1e -->
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320">
<meta name="viewport" content="width=device-width, target-densitydpi=160dpi, initial-scale=1, maximum-scale=1">

<!-- For less capable mobile browsers
<link rel="stylesheet" media="handheld" href="css/handheld.css?v=1">  -->

<!-- For all browsers -->
<link rel="stylesheet" media="screen" href="css/style.css?v=1">
<link rel="stylesheet" media="print" href="css/print.css?v=1">
<!-- For progressively larger displays -->
<link rel="stylesheet" media="only screen and (min-width: 480px)" href="css/480.css?v=1">
<link rel="stylesheet" media="only screen and (min-width: 768px)" href="css/768.css?v=1">
<link rel="stylesheet" media="only screen and (min-width: 992px)" href="css/992.css?v=1">
<link rel="stylesheet" media="only screen and (min-width: 1382px)" href="css/1382.css?v=1">
<!-- For Retina displays -->
<link rel="stylesheet" media="only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)" href="css/2x.css?v=1">

<!-- JavaScript at bottom except for Modernizr -->
<script src="js/libs/modernizr-1.7.min.js"></script>

<!-- For iPhone 4 -->
<link rel="apple-touch-thumb" sizes="114x114" href="thumbs/h/apple-touch-thumb.png">
<!-- For iPad 1-->
<link rel="apple-touch-thumb" sizes="72x72" href="thumbs/m/apple-touch-thumb.png">
<!-- For iPhone 3G, iPod Touch and Android -->
<link rel="apple-touch-thumb" href="thumbs/l/apple-touch-thumb.png">
<!-- For Nokia -->
<link rel="shortcut thumb" href="thumbs/l/apple-touch-thumb.png">
<!-- For everything else -->
<link rel="shortcut thumb" href="/favthumb.ico">

<!--iOS. Delete if not required -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-startup-image" href="pages/startup.png">

<!--Microsoft. Delete if not required -->
<meta http-equiv="cleartype" content="on">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<!-- http://t.co/y1jPVnT -->
<link rel="canonical" href="/">

</head>

<body>
	
	<div id="track_outer">	
		<div id="track_inner" role="main">
		
		
			<?php
			
				// each spread
				foreach ( $spreads_array AS $key1 => $val1 ) {
				
					echo '
			<div id="spread'.$key1.'" class="spread'.( sizeof($val1)>1 ? ' spread'.sizeof($val1) : '' ).'">
				<div class="spread_inner">';
					
					// each page
					foreach ( $val1 AS $key2 => $val2 ) {
						
						// get the page images, pop off the smallest one and use it was the thumb
						$page_imgs = $val2['imgs'];
						$page_imgs_thumb = array_shift ($page_imgs);
						$page_imgs_thumb = $page_imgs_thumb['file'];
						$page_imgs_std = false;
						if ( @$val2['imgs'][1024] ) {
							$page_imgs_std = $val2['imgs'][1024]['file'];
						}
						
					
						echo '
					<div id="page'.$key2.'" class="page">
						<a href="'.PATH.$val2['dir'].'/'.$page_imgs_std.'" class="thumb"><img src="'.PATH.$val2['dir'].'/'.$page_imgs_thumb.'" alt="page" ></a>
					</div>';
					
					}
					
					echo '
				</div>
			</div>';
				
				}
			
			?>
			
			
		</div>
	</div>
	
	<div style="position:absolute;left:50%;bottom:0;margin-left:-50px;padding:5px;background:#fff;">
		<a href="#" onclick="bardotNavBack();return false;">left</a>
		<b id="orient">?</b>
		<a href="#" onclick="bardotNavNext();return false;">right</a>
		<b id="html_spread">?</b>
		:
		<b id="html_pageinspread">??</b>
	</div>

<!-- mathiasbynens.be/notes/async-analytics-snippet Change UA-XXXXX-X to be your site's ID -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js"></script>
<!--<script>window.jQuery || document.write('<script src="js/libs/jquery-1.5.1.min.js">\x3C/script>')</script>-->
<!-- Scripts -->

<!--<script src="js/zepto.min.js"></script>-->
<script src="js/plugins.js"></script>
<script src="js/mylibs/bardotControl.js"></script>
<script src="js/mylibs/bardotSize.js"></script>
<script src="js/mylibs/bardotNav.js"></script>
<script src="js/mylibs/bardotTouchNavZoom.js"></script>
<script src="js/mylibs/bardotSkim.js"></script>
<script src="js/mylibs/bardotTouchSkim.js"></script>


<script type="text/javascript">

	// on load
	$(document).ready(function() {
		
		jQuery().bardotInit();
		
	});

</script>

<script>
/*
var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']]; // Change UA-XXXXX-X to be your site's ID
(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
s.parentNode.insertBefore(g,s)}(document,'script'));
*/
</script>
<noscript>Your browser does not support JavaScript!</noscript>
</body>
</html>