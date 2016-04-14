
/**
*
*  Navigation Manager: Responsible for stack management for screen and facilitates 
                       in-app navigation   
**/

appez.isAnimating = false;


appez.uic.navigate = (function () { 
    
    var uv = appez.uic.vars,
        history = uv.history,
        activePageClass = appez.uic.vars.activePageClass;
       
 
        function navigateTo(pageId, controllerObj, animate) {
                      
                      if(appez.isAnimating){
                      
                          console.log('animation in progress');
                      
                         return false;
                      }                      
                      
                      
            console.log( "Navigating to page with id:" + pageId );
            if(controllerObj!=undefined && appez['smartweb']!=undefined){
            	//We are expecting this argument in case of SmartWeb only
            	appez.smartweb.navigateTo(pageId, controllerObj);              	
               
                // we need to handle back button for iOS after dom render
                if(platform.os.family === 'iOS'){
                	 console.log(' transforming iOs back button from navigator ');
                    transformiOSBackButton();
                }              
            }             
            
            
            if(uv.pageIdStack.indexOf(pageId) === -1){  
                console.log('pushing into pageIdStack ' + pageId);
               uv.pageIdStack.push(pageId);             
            } 
            
                          
            transitionTo(pageId, animate); 
            
             //if(!history.find(pageId)){                  
               history.add(pageId);             
            //} 
            
            history.direct({'url':pageId}); 
            
        }
        
        function transitionTo(pageId, animate){
        	
        	var activeIndex = uv.pageIdStack.indexOf(getUicPageId('active')), // history.activeIndex,
                pageIndex = uv.pageIdStack.indexOf(pageId);
        

        	if(animate === false) {        	  

        	    console.log('transitioning page without animation ');

                transitionWithoutAnimation(pageId, activePageClass);

        	    return false;
        	}
        	
        	if(platform.os.family === 'Android'){
        		
        		console.log('android animation trnasition');
        		
        		transitionWithoutAnimation(pageId, activePageClass);
        	}
        	else if(/*true*/  platform.os.family === 'iOS' ){
        		
        		console.log('ios animation transition pageIndex: '+ pageIndex +' activeIndex: '+ activeIndex);                      
                 
        		
        		if(pageIndex > activeIndex){
        			
                    transitionForward(pageId);
        			
        		}
        		else if(pageIndex < activeIndex){
        			transitionBackward(pageId);
        		}        		
        	}
        	else if(platform.name === 'IE Mobile' || platform.name === 'IE'){
        		
        	    console.log('wp animation transition');

        	  // transitionWithoutAnimation(pageId, activePageClass);
        		
        		 if(pageIndex > activeIndex){         			
        		    
        		     transitionForward(pageId);
        		}
        		else{            			
        		    transitionBackward(pageId);  
        		} 
        	}
        	else if(platform.name === 'Chrome'){
        		
        	    console.log('web animation trnasition');

        	    transitionWithoutAnimation(pageId, activePageClass);
        	
        	}
        }


        function transitionWithoutAnimation(pageId, activePageClass) {

            $('.' + activePageClass).removeClass(activePageClass);
            $('#' + pageId).addClass(activePageClass);
                      
            appez.isAnimating = false;

        }
        
        function transitionForward(pageId){
        	
            console.log('screen transition forward  active page id --> ' + getUicPageId('active'));
        	        	
                      var aniConfig = {
  	
			  	'activePageId': getUicPageId('active'),			  	
			  	'targetPageId': pageId,
			  	'dir': 'forward' 
			  };			  
			 
        	
        	appez.uic.animation.screenTransition(aniConfig);
        	
        }
    
        

        function transitionBackward(pageId){
        	
            console.log('screen transition backward active page id --> ' + getUicPageId('active'));
        	
        	var aniConfig = {
  	
			  	'activePageId': getUicPageId('active'),			  	
			  	'targetPageId': pageId,
			  	'dir': 'backward' 
			  };			  
			 
        	
        	appez.uic.animation.screenTransition(aniConfig);  
        	
        }
 
        function navigateToFirstScreen( ) {
            console.log( "Navigating to first page:");
            navigateTo(uv.pageIdStack[0]);
        }
 
        function navigateToBackScreen() {

        	
            console.log("Navigating back ");
          
            if((platform.name === 'IE Mobile' || platform.name === 'IE')){

                var callArgs = navigateToBackScreen.caller.arguments;               

                if (callArgs[0] !== 'native') {

                    console.log("preventing nav back from WP8 UI");

                    return false;  // don't entertain back nav request from WP8 soft back button
                }
            }
        	
        	 var nav = appez.uic.navigate;
     	 
     	     if(nav.getPageId('back') === 'NA'){       	     	
     	     	
     	     	
     	     	appez.mmi.showDecisionDialog({'message':'Exit app?'}, appExitCallBackHandler, this); 
     	     	
     	     	return false;
     	     }
     	     else  if(history.getPrev()){
            
                var pageId = history.getPrev().url;
                
                console.log("Navigating to back page:" + pageId);
                 
                 if(pageId!=undefined && appez['smartweb']!=undefined){
                 	//We are expecting this argument in case of SmartWeb only
                 	appez.smartweb.navigateBack(pageId);
                 }

                if(navigateTo(pageId) !== false)
				{
					//Removed the page from the stack once the user has navigated back
					uv.pageIdStack.pop(getUicPageId('active'));
				}
            }
            else{
     	         console.log('history.getPrev() ' + history.getPrev() + ' is undefined history.getLast() ' + history.getLast().url);
            }           
            
           
        }
        
        function getUicPageId(param){
        	
        	var activeIndex = history.activeIndex;
        	
        	if(param === 'active'){
        		
        		return history.stack[activeIndex].url;
        	}
        	else if(param === 'back'){
        	    console.log('Back pressed at screen:');

        	    if (history.stack[activeIndex - 1]) {

        	        return history.stack[activeIndex - 1].url || 'NA';
        	    }
        	    else {
        	        return 'NA';
        	    }
        		
        	}
        	else if(param === 'next'){
        		// doesn't support asynchronous UI flow
        		return uv.pageIdStack[activeIndex + 1] || 'NA';
        	}
        	
        } 
        
        function clearStack(){
          
          var firstPage = uv.pageIdStack[0];
         
          uv.pageIdStack.length = 1; // only first element remians in array 
          uv.history.stack.length = 1;
          uv.history.activeIndex = 0;
          
          navigateTo(firstPage);
          
        }
 
        // Reveal public pointers to
        // private functions and properties
 
        return {
            to: navigateTo,
            firstScreen: navigateToFirstScreen,
            back: navigateToBackScreen,
            getPageId: getUicPageId,
            transitionTo: transitionTo,
            clearStack: clearStack
        };
 
    })();
    
    function appExitCallBackHandler(smartEventResponse){
     	
     	console.log('app exit desicion call back -> '+JSON.stringify(smartEventResponse.getServiceResponse()));  
   
	   if (smartEventResponse.getServiceResponse().userSelection == 0) {	   
		   
	//	   var messageToSend = '{"transactionId":1395217652571,"isResponseExpected":true,"transactionRequest":{"serviceOperationId":30001,"serviceRequestData":"eyJtZXNzYWdlIjoiQW4gaW1wb3J0YW50IG1lc3NhZ2UifQ=="},"transactionResponse":{}}';
			   
			   appez.mmi.sendAppEvent("My event data", appez.mmi.constant.APP_NOTIFY_EXIT);
			   
	      }
     	
     	
     }
    


   
   
