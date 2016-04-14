/** 
 * 
 *	This class represents a Log manager.
 *	Responsible for logging messages to console uniformly across platforms.
 * 
 **/

appez.mmi.manager.LogManager = appez.mmi.createClass({
	className:"appez.mmi.manager.LogManager",    //Contains The Class Name.
	singleton: true,
    enabled:true,                           //By default it is true , it permits framework to print logs and vice versa
     
    /*
    * Name: isEnabled
    * Description: it returns whether log is enabled or not
    * <Parameter Name>: None
    * Returns: Boolean (True or False)
    * Details about if any exception is thrown.
    */
   isEnabled:function(){
     return enabled;
   },
                                           
   setEnabled:function(enabled){
     this.enabled=enabled;
   },
   /*
    * Name: init
    * Description: intialize the log , set threshold and App mode
    * <Parameter Name>: None
    * Returns: None
    * Details about if any exception is thrown.
    */
                                        
   init:function(){
	  
   },
   
   isLogEnabled: function() {
	   
   },
       
   /*
    * Name: log
    * Description: child classes override this method for multiple platforms.
    * msg: string message that print on console
    * logLeval : leval of log , print by framework Ex: eMob.LOG_LEVAL_DEBUG
    * Returns: None
    * Details about if any exception is thrown.
    */
   log:function(msg,logLeval){
   
   }                             
});