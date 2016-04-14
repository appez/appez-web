/** 
 * 
 *	This class represents a App Event Service.
 *	Responsible for notification of various application events.
 * 
 **/

appez.mmi.service.nativePlatform.AppEventService = appez.mmi.createClass({          
	className:"appez.mmi.service.nativePlatform.AppEventService", 	//Contains Class Name
	singleton:true,                                            		//specify whether the class is singleton object or not 
	extend:appez.mmi.service.SmartEventService,                     //Contains Base Class Name
   
	/*
	 * Name: processRequest
	 * Description: Execute SmartEventRequest object for native communication
	 * smartEventRequest: SmartEventRequest object
	 * Returns: None , transfer control to callBack method.
	 * Details about if any exception is thrown.
	 */
	processRequest: function(smEvent, callbackFunc, callbackFuncScope){
		this.smartEvent = smEvent;
		appez.mmi.log('AppEventService->processRequest');
		
		appez.mmi.getMobiletManager().processNativeRequest(this,smEvent);
	},
	
	/*
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(eventResponse){
		
	}
});
