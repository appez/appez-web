
/**
*
*  Animation Manager: Responsible for screen navigation animations   
**/


appez.uic.animation = (function () {

    var uv = appez.uic.vars,
        history = uv.history,
        activePageClass = appez.uic.vars.activePageClass,
        animationName = 'webkitTransitionEnd',
        isWp = false,
        isAnimating = false;


    if (platform.name === 'IE Mobile' || platform.name === 'IE') {

        isWp = true;
        animationName = 'animationend';
    }


    function animater(pageId, tranConfig, initiateAnimation) {
        // Create a new Deferred.
        var dfd = new $.Deferred(),
            el = $('#' + pageId),
            activeEl = $('#' + tranConfig.activePageId),
            targetEl = $('#' + tranConfig.targetPageId);
            
            tranConfig.activeEl = activeEl;
            tranConfig.targetEl = targetEl;
    
                       
             appez.isAnimating = true;

        el.bind(animationName, function () {
            // When we're done animating
            // we'll resolve our Deferred.
            // This will call any done() callbacks
            // attached to either our Deferred or
            // one of its promises.
            dfd.resolve(el, tranConfig);
        });

        if (initiateAnimation) {
        
            if (tranConfig.dir === 'forward') {

                if (isWp) {
                    console.log('WP forward direction');

                    el.addClass('forward-out');
                }
                else {
                    // console.log(' iOS forward animation --> activeEl --> '+ tranConfig.activePageId + 'targetEl --> '+ tranConfig.targetPageId);

                    if(targetEl.hasClass('bottom')){
                      
                      targetEl.removeClass('bottom');
                      
                      appez.isAnimating = false;
                      
                    }
                    else{
                      targetEl.removeClass('right').addClass('center');
                      activeEl.removeClass('center').addClass('left');
                    }
                    
                    
                }
            }
            else if (tranConfig.dir === 'backward') {

                // animation direction is backward

                if (isWp) {
                    console.log('WP backward direction');
                    el.addClass('backward-out');
                }
                else {
                    //console.log(' iOS backward animation --> activeEl --> 'tranConfig.activePageId + 'targetEl --> '+ tranConfig.targetPageId);
                    
                    if(activeEl.hasClass('modal-animation')){
                      
                      activeEl.addClass('bottom');
                      appez.isAnimating = false;
                    }
                    else{
                      targetEl.removeClass('left').addClass('center');
                      activeEl.removeClass('center').addClass('right');
                    }
                    
                }
            }
        }
        else {
            console.log('animation was not initiated');
        }

        // Return an immutable promise object.
        // Clients can listen for its done or fail
        // callbacks but they can't resolve it themselves
        return dfd.promise();
    }

    function screenTransition(tranConfig) {
       
        var activePromise = animater(tranConfig.activePageId, tranConfig, true);

            $.when(activePromise).then(function (el, tranConfig) {            

            var targetPromise = animater(tranConfig.targetPageId, tranConfig, false);

            targetPromise.done(targetAnimationDoneHandler);
            targetPromise.fail(targetAnimationFailHandler);

            });

        activePromise.done(activeAnimationDoneHandler);
        activePromise.fail(activeAnimationFailHandler);

    }

    function activeAnimationDoneHandler(el, tranConfig) {
    	
    	var activeEl = tranConfig.activeEl,
    	    targetEl = tranConfig.targetEl;                      
              
        console.log('active animation done handler called');
        
        if(isWp){
          
          if (tranConfig.dir === 'forward') {
            
             activeEl.removeClass('active-page forward-out');
            targetEl.addClass('active-page forward-in');
          }
          else{
             // animation direction is backward
             activeEl.removeClass('active-page backward-out');
             targetEl.addClass('active-page backward-in');
          }
        }
        else{
          	// iOS animation active page animation done handler
            	 appez.isAnimating = false;
        }

        el.unbind(animationName);
        

    }

    function activeAnimationFailHandler() {

        alert('active animation fail handled');

    }


    function targetAnimationDoneHandler(el, tranConfig) {
    	
    	var activeEl = tranConfig.activeEl,
    	    targetEl = tranConfig.targetEl;

        console.log('target animation done handler called');
        appez.isAnimating = false;

        if (isWp) {
 
           if (tranConfig.dir === 'forward') {
             
             targetEl.removeClass('forward-in');
           }
           else{
             // animation direction is backward
              targetEl.removeClass('backward-in');
           }
        }

        el.unbind(animationName);

    }

    function targetAnimationFailHandler() {

        alert('target fail handled');

    }

    // Reveal public pointers to
    // private functions and properties

    return {
        screenTransition: screenTransition
    };

})();





