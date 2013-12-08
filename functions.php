<?php

	function dir_array($basepath,$type=false) {
		
		$output = array();
		
		if ( !( $hook = @opendir( $basepath ) ) ) {
			return false;
		}
		
		## HOW MANY READABLE ITEMS ARE IN THIS DIRECTORY?
		while ( ( $file = readdir( $hook ) ) !== false ) {
		
			$fullpath = $basepath.$file;
			
			// no hidden files
			if ( substr( $file , 0 , 1 ) == '.' ) {
				continue;
			}
			
			if ( file_exists($fullpath ) ) {
				if ( $type == 'file' AND is_dir( $fullpath ) ) {
					continue;
				} elseif ( $type == 'dir' AND is_file( $fullpath ) ) {
					continue;
				}
				array_push( $output , $file );
			}
		}
		sort( $output );
		
		rewinddir( $hook );
		closedir( $hook );
		
		return $output;
	
	} 

	function process_page ( $dir , $spread , $page ) {

		global $spreads_array;

		// the output detail
		$row_array = array( 
			'dir' => $dir,
			'imgs' => array()
		);
		
		// get the list of files in this directory
		$page_array = dir_array( PATH.$dir.'/' , 'file' );
		
		// loop through the files
		foreach ( $page_array AS $key2 => $val2 ) {
			
			$file_info = pathinfo( PATH.$dir.'/'.$val2 );
			
			// if it's an image
			if ( in_array( strtolower( $file_info['extension'] ) , array( 'jpg', 'jpeg' , 'gif' , 'png' ) ) ) {
			
				// get the size of the image
				$image_size = getimagesize( PATH.$dir.'/'.$val2 );
				
				// stick it in the results with the key of the height
				$row_array['imgs'][$image_size[1]]['file'] = $val2 ;
				$row_array['imgs'][$image_size[1]]['w'] = $image_size[0] ;
				$row_array['imgs'][$image_size[1]]['h'] = $image_size[1] ;
				
				ksort($row_array['imgs']);
			
			// if it's the index file
			} elseif ( substr( $val2 , 0 , 5 ) == 'index' ) {
			
				$row_array['index'] = $val2;
			
			}
		
		}
		
		//*
		// check there's at least a placeholder for the thumbnail
		if ( sizeof( $row_array['imgs'] ) > 0 ) {
			
			$page_size_array = array_keys( $row_array['imgs'] );
			$page_size_array_large = $page_size_array;
			sort($page_size_array);
			rsort($page_size_array_large);
			
			if ( $page_size_array[0] > 48 ) {
				
				$inputfile = PATH.$dir.'/'.$row_array['imgs'][$page_size_array_large[0]]['file'];
				$outputwidth = round ( $image_size[0] * 48 ) / $image_size[1];
				$outputfile = resize_gd( $inputfile , $outputwidth , 48 );
			
				$row_array['imgs'][48]['file'] = basename( $outputfile );
				$row_array['imgs'][48]['w'] = $outputwidth;
				$row_array['imgs'][48]['h'] = 48;
			}
			
			
			if ( !$row_array['imgs'][1024] ) {
				
				$inputfile = PATH.$dir.'/'.$row_array['imgs'][$page_size_array_large[0]]['file'];
				$outputwidth = round ( $image_size[0] * 1024 ) / $image_size[1];
				$outputfile = resize_gd( $inputfile , $outputwidth , 1024 );
			
				$row_array['imgs'][1024]['file'] = basename( $outputfile );
				$row_array['imgs'][1024]['w'] = $outputwidth;
				$row_array['imgs'][1024]['h'] = 1024;
			}
			
			
			ksort($row_array['imgs']);
			
		} else {
			
			return;
			
		}
		//*/	
	
	
	
		$spreads_array[$spread][$page] = $row_array;
		ksort( $spreads_array );
		
	}
	
	
	#### RESIZE IMAGE WITH GD
	
	function resize_gd( $input , $w , $h ) {
	
		# error check
		if ( !is_file( $input ) OR !$w OR !$h ) {
			return false;
		}
	    
	    # file info
		$file_info = pathinfo( $input );
		$file_ext = strtolower( $file_info['extension'] );
		
		# is there already a file that's the right size?
		if ( stristr( $input , '.'.$h.'.jpg' ) ) {
			return;
		}
		
		# DYNAMICALLY CHANGE MEMORY LIMIT BASED ON IMAGE
		
		$imageInfo = getimagesize( $input );
		$current_memory = ini_get( 'memory_limit' );
		$current_execution_time = ini_get( 'max_execution_time' );
		$memoryNeeded = round($imageInfo[0] * $imageInfo[1] * $imageInfo['bits'] * $imageInfo['channels']);	// width x height x bits per channel x channels
	    if ( function_exists( 'memory_get_usage' ) AND (memory_get_usage() + $memoryNeeded) > (intval(ini_get('memory_limit')) * pow(1024, 2))) {
	    	$new_memory = $current_memory + ceil(((memory_get_usage() + $memoryNeeded) - $current_memory * pow(1024, 2)) / pow(1024, 2));
	    	$new_memory_ini = $new_memory.'M';
	    	ini_set('memory_limit', $new_memory_ini);
	    	$new_executiontime = ceil($memoryNeeded/500000);
	    	ini_set('max_execution_time', $new_executiontime);
	    } else {
	    	ini_set('memory_limit', '128M');
			ini_set("max_execution_time","600");
	    }
	    
		if ($imageInfo['mime']=='image/png' OR $file_ext=='png') {
			$img_src=imagecreatefrompng( $input );
			if (!$img_src) {
				return false;
			}
		} elseif ($imageInfo['mime']=='image/gif' OR $file_ext=='gif') {
			$img_src=imagecreatefromgif( $input );
			if (!$img_src) {
				return false;
			}
		} elseif ($imageInfo['mime']=='image/jpeg' OR $file_ext=='jpg' OR $file_ext=='jpeg') {
			$img_src=imagecreatefromjpeg( $input );
			if (!$img_src) {
				return false;
			}
		} elseif ($imageInfo['mime']=='image/bmp' OR $file_ext=='bmp') {
			$img_src=imagecreatefromwbmp( $input );
			if (!$img_src) {
				return false;
			}
		} else {
			return false;
		}
		

		$img_dst = imagecreatetruecolor( $w , $h );
		if (!$img_dst) {
			return;
		}
		imagecopyresampled( $img_dst, $img_src, 0, 0, 0, 0, $w, $h, $imageInfo[0], $imageInfo[1]); 
		imagedestroy( $img_src ); 
		unset( $img_src );
		
		# quality of the saved jpeg
		$quality = 85;
		if ($w<150 AND $h<150) {
			$quality = 100;
		} elseif ($w<300 AND $h<300) {
			$quality = 90;
		}
		# outputs are always jpegs, so alter the file extenstion of the output file path
		$output = $file_info['dirname'].'/'.$file_info['filename'].'.'.$h.'.jpg';
			
		# create the new jpeg file!
		if ( !imagejpeg( $img_dst , $output , $quality ) ) {
			return false;
		}
		ImageDestroy( $img_dst );
		unset( $img_dst );
		
		# reset memory limit
		ini_set( 'memory_limit' , $current_memory );
	    ini_set( 'max_execution_time' , $current_execution_time );
	
		if (is_file($output)) {
			# check that we can modify the incoming file
			if ( !chmod( $output , 0777 ) ) {
				return false;
			}
		} else {
			return false;
		}
		return $output;
		
	}

?>