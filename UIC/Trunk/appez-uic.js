
/**
* UIC: Initialize UIC library and global variables.
*
**/

 var globalScope = this;

 appez.uic = {};

appez.uic.vars = {
    
    pageIdStack: [],
    activePageClass: "active-page",
    history: $.mobile.navigate.history  
};


appez.uic.init = function(){
    
      console.log('uic intializing'); 
      
    var uv = appez.uic.vars,
        firstPageId = $('.uic-page').first().attr('id');
    
  
    uv.history.stack[0] = { url: firstPageId };  // overrides default behavior of history manager
    uv.pageIdStack.push(firstPageId); // for managing stack
      
      applyStyleWrapper();
      
      if(platform.os.family === 'Android' && parseInt(platform.os.version) < 4){
      	
        	initializeGb(); 
      }

      if (!appez['smartweb']) {
          console.log('Binding native events from UIC'); // bind native events if Smart Web is not defined 
          bindNativeEvents();
      }
      
       
    
    
    if(platform.os.family === 'iOS'){
        
        initializeiOSTransition();
        
        transformiOSBackButton();        
        
      	
        if(parseInt(platform.os.version) < 7){
        
            fixFixedPosition();            

        }
            }
            
            if(platform.name === 'Chrome'){
            	
            	//initializeiOSTransition(); // remember to uncomment it
            } 
    
	 	
  };


function fixFixedPosition(){
    
    
    // Only on touch devices
    if (Modernizr.touch) {
        $(".uic-page").mobileFix({ // Pass parent to apply to
                                 inputElements: "input,textarea,select", // Pass activation child elements
                                 addClass: "fixfixed" // Pass class name
                                 });
    }
}


function applyStyleWrapper(){
	
	var wrapperClass = '';
  	
  	 if(platform.os.family === 'Android'){   
  	 	
  	 	  if(parseInt(platform.os.version) < 4){
  	 	  	
  	 	  	 wrapperClass = 'android-gb';
  	 	  }
  	 	  else{
  	 	  	
  	 	  	 wrapperClass = 'android-ics';
  	 	  }    
         	
         	$('body').addClass(wrapperClass);
         }
         else if( /* true  */ platform.os.family === 'iOS' ){
             
             if(parseInt(platform.os.version) < 7){
             
                  $('body').addClass('ios-six');
             }
             else{
              
                 $('body').addClass('ios-seven');
             }         	
         }
         else if(platform.name === 'IE Mobile' || platform.name === 'IE'){         	
         	$('body').addClass('wp-eight');	
         }
         else if(platform.name === 'Chrome'){         	
         	$('body').addClass(appezDebug.webTheme);
         }
      }

        function initializeiOSTransition(){
            
            console.log('initialize ios transtion animation ');            
           
            $('.uic-page').each(function(index,el){
              
              var ele = $(el),
                  isBottom = ele.hasClass('bottom');
                  
                  if(isBottom){
                    
                  }
                  else{
                      if(index > 0){
            	  	
            	  	ele.addClass('right');
            	  }
            	  
            	
                  }
                  
                   ele.addClass('transition show');
            	
            }) 
        }
    
      function initializeGb(){
      	
      	console.log('initiating GB start up');      	
      
      	bindGbEvents();      	
      }
      
     

      function transformiOSBackButton(){
      	
      	var iosBack = $('.icon-holder .back-icon');
      	
      	 if(parseInt(platform.os.version) < 7){
      	 	
      	 	 iosBack.html('Back');
      	 }
      	 else{
      	 	
      	 	iosBack.html('');
      	 }         
      }
    
      function bindNativeEvents() {         
      	
      	appez.mmi.registerNativeEventListener(globalScope, globalScope.nativeListenerRegistrar);
      }
      
      function nativeListenerRegistrar(nativeEvent) {
         
      	
      	if(nativeEvent === 0){
      		
      	    nativeBackKeyHandler('native');
      	}
  	
  	     
     }
     
     function nativeBackKeyHandler(arg){  
     	    
         appez.uic.navigate.back(arg); // has to be in this function as caller is function
     }
     
     

      
      function bindGbEvents(){      	
      	
      	console.log('binding gb events');
      	
      	var stateComps = ['.btn','.list-group-item','.media'];
      	
 			$(stateComps).each(function(index, el){
 				
 				el = $(el);
 				
 				el.bind( "vmousedown", mouseDownHandler); 				
 				el.bind( "vmouseup", mouseUpHandler); 	
 				el.bind( "vmousemove", mouseUpHandler);			
 				el.bind( "scrollstop", mouseUpHandler);
 			}); 
      }
      
     
      
      function mouseDownHandler(e){   
      	
      	//console.log('mouse over triggered');
      	
      	$(this).addClass('active');
      	
      }
      
      function mouseUpHandler(){
      	
      	//console.log('mouse out triggered');
      	
      	$(this).removeClass('active');
      }
      
      
      
      // Create and return the constructor function for the Timer.
        // We'll wrap this in its own execution space.
        var Timer = (function( $ ){
 
 
            // Define the constructor for the timer.
            function timer( timeout ){
 
                // Create a new Deferred object - this will be
                // resolved when the timer is finished.
                var deferred = $.Deferred();
 
                // Lock the deferred object. We are doing this so we
                // can alter the resultant object.
                var promise = deferred.promise();
 
                // Define our internal timer - this is what will be
                // powering the delay.
                var internalTimer = null;
 
                // Store the context in which this timer was executed.
                // This way, we can resolve the timer in the same
                // context.
                var resolveContext = this;
 
                // Get any additional resolution arguments that may
                // have been passed into the timer.
                var resolveArguments = Array.prototype.slice.call(
                    arguments,
                    1
                );
 
 
                // Add a CLEAR method to the timer. This will stop
                // the underlying timer and reject the deferred.
                promise.clear = function(){
 
                    // Clear the timer.
                    clearTimeout( internalTimer );
 
                    // Reject the deferred. When rejecting, let's use
                    // the given context and arguments.
                    deferred.rejectWith(
                        resolveContext,
                        resolveArguments
                    );
 
                };
 
                // Set the internal timer.
                internalTimer = setTimeout(
                    function(){
 
                        // Once the timer has executed, we'll resolve
                        // the deferred object. When doing so, let's
                        // use the given context and arguments.
                        deferred.resolveWith(
                            resolveContext,
                            resolveArguments
                        );
 
                        // Clear the timer (probably not necessary).
                        clearTimeout( internalTimer );
 
                    },
                    timeout
                );
 
                // Return the immutable promise object.
                return( promise );
 
            };
 
 
            // ---------------------------------------------- //
            // ---------------------------------------------- //
 
 
            // Return the timer function.
            return( timer );
 
 
        })( jQuery );


$.fn.mobileFix = function (options) {
    var $parent = $(this),
    $fixedElements = $(options.fixedElements);
    
    $(document)
    .on('focus', options.inputElements, function(e) {
        $parent.addClass(options.addClass);
        })
    .on('blur', options.inputElements, function(e) {
        $parent.removeClass(options.addClass);
        
        // Fix for some scenarios where you need to start scrolling
        setTimeout(function() {
                   $(document).scrollTop($(document).scrollTop())
                   }, 1);
        });
    
    return this; // Allowing chaining
};

function addRemoveClass(elId,addCls,remCls, inverse){
    
    if(inverse){
      $('#' + elId).removeClass(remCls).addClass(addCls);
    }
    else{
    
         $('#' + elId).addClass(addCls).removeClass(remCls);
    }

    

}







