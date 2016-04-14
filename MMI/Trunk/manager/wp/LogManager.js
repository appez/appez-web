

/** 
 * 
 *	This class represents a Log Manager in Windows Phone.
 *	Logs client and User messages to the Java Script console.
 * 
 **/

appez.mmi.manager.wp.LogManager = appez.mmi.createClass({
	className:"appez.mmi.manager.wp.LogManager", //Contains The Class Name.
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
    	  window.external.notify("imrlog://"+msg);
      }                                       
});