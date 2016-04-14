
 /**
  *
  *  Import Manager: detects the platform at runtime and loads the platform specific styles
 **/

    // to do: need to add version specific check for platform detection
    
    appez.env = 'prod';
    appez.weinre = false;    
    appez.smartwebPrefix = ''; // used to accommodate changes in smart web structure
    
    if (!appez['smartweb']) {
    	
    	appez.smartwebPrefix = '';
     }
    var appezDebug = {    	
    	
        webTheme: 'ios-seven'
    },        
	
     lessUrl =  '<script src="' + appez.smartwebPrefix + 'appez/uic/uic-dependency/less-1.7.0.min.js"></script>',
     styleUrl = '<link rel="{rel}" type="text/css" href="' + appez.smartwebPrefix + 'appez/uic/resources/styles/{fileName}{fileExtention}">',
     weinreUrl = '<script src="http://172.26.39.60:8081/target/target-script-min.js#revamp"></script>',
     styleFile = ''; 
     
     if(appez.weinre){
    	
    	document.write(weinreUrl);
     }
     
     
    
	 
	 if(platform.os.family === 'Android'){	
	 	
	 	if(parseInt(platform.os.version) < 4){
	 		
	 		styleUrl = getStyleUrl(styleUrl,'android-gb');
	 	}
	 	else{
	 		
	 		styleUrl = getStyleUrl(styleUrl,'android-ics');
	 	}		
		  
	 }
	 else if(platform.os.family === 'iOS'){
	 	
	 	if(parseInt(platform.os.version) < 7){
	 		
	 		styleUrl = getStyleUrl(styleUrl,'ios-six');
	 	}
	 	else{
	 		
	 		styleUrl = getStyleUrl(styleUrl,'ios-seven');
	 	}
		
		
	 }
	 else if(platform.name === 'IE Mobile' || platform.name === 'IE'){
		
		    styleUrl = getStyleUrl(styleUrl,'wp-eight'); 	
	 }
	 else if(platform.name === 'Chrome'){
	 
	 // styles that gets loaded when platform is web
	 
	    styleUrl = getStyleUrl(styleUrl,appezDebug.webTheme);
	 }
	 
	 console.log(' Loading ' + styleUrl);	
	 
    document.write(styleUrl);
    
    if(appez.env === 'dev'){    	
    	
	  less = {
	    env: "development"
	  };
    	
      document.write(lessUrl);
    }
    
    function getStyleUrl(styleUrl,fileName){  
	 		
	 	styleUrl = styleUrl.replace('{fileName}',fileName);	 	
	 
		if(appez.env === 'dev'){
						
			styleUrl = styleUrl.replace('{rel}','stylesheet/less').replace('{fileExtention}', '.less');
		}
		else{
			
			styleUrl = styleUrl.replace('{rel}','stylesheet').replace('{fileExtention}', '.css');
		}		
		return styleUrl;
    }
    
    
    
    
    
    
    
    
    
    
    
