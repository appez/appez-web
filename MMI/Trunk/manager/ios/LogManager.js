

/** 
 * 
 *	This class represents a Log Manager in iOS.
 *	Logs client and User messages to the Java Script console.
 * 
 **/

appez.mmi.manager.ios.LogManager = appez.mmi.createClass({
	className:"appez.mmi.manager.ios.LogManager", //Contains The Class Name.
    extend:appez.mmi.manager.LogManager,             //Contains Base Class Name
    singleton:true,   
    
      /*
       * Name: log
       * Description: overridden  method for IOSplatform.
       * msg: string message that print on console
       * logLeval : leval of log , print by framework Ex: eMob.LOG_LEVAL_DEBUG
       * Returns: None
       * Details about if any exception is thrown.
       */

      log:function(msg,logLeval){
    	  //TODO need to add log level based implementation for log filtering
    	  if(msg.length > (1024*25)){
    		  msg = msg.substring(0,(1024*25)-1);
    	  }
    	  var iframe = document.createElement("IFRAME");
    	  iframe.setAttribute("src", "imrlog://" + msg);
    	  document.documentElement.appendChild(iframe);
    	  iframe.parentNode.removeChild(iframe);
    	  iframe = null;
      }
                                       
});