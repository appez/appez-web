

/** 
 * 
 *	This class represents a Log Manager in Android.
 *	Logs client and User messages to the Java Script console.
 * 
 **/

appez.mmi.manager.android.LogManager = appez.mmi.createClass({
	className:"appez.mmi.manager.android.LogManager",  //Contains The Class Name.                         
	extend:appez.mmi.manager.LogManager,             //Contains Base Class Name
	singleton:true,
   
  /*
   * Name: log
   * Description: overridden  method for Android platform.
   * msg: string message that print on console
   * logLeval : leval of log , print by framework Ex: eMob.LOG_LEVAL_DEBUG
   * Returns: None
   * Details about if any exception is thrown.
   */
    log:function(msg,logLevel){
    	//TODO need to add log level based implementation for log filtering
    	if(logLevel!=undefined){
        	appezAndroid.log("Javascript Console", msg,logLevel);
    	} else {
        	appezAndroid.log("Javascript Console", msg,appez.mmi.constant.LOG_LEVEL_DEBUG);
    	}

    }
});