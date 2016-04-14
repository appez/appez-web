/** 
 * 
 *	This class represents a Co-Event Service.
 *	Responsible for communicating camera events and configuration to native layer.
 * 
 **/

appez.mmi.service.nativePlatform.CoEventService = appez.mmi.createClass({          
	className:"appez.mmi.service.nativePlatform.CoEventService", //Contains Class Name
	singleton:true,                                         	//specify whether the class is singleton object or not
	extend:appez.mmi.service.SmartEventService,                 //Contains Base Class Name
	
	callbackFunction : null,
	callbackFunctionScope : null,
	smartEvent : null,
	
	/*	
	 * Name: processRequest
	 * Description: Execute SmartEventRequest object for native communication
	 * smartEventRequest: SmartEventRequest object
	 * Returns: None , transfer control to callBack method.
	 * Details about if any exception is thrown.
	 */
	processRequest: function(smEvent, callbackFunc, callbackFuncScope){
		appez.mmi.log('CoEventService->processRequest');
		this.smartEvent = smEvent;
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		
		appez.mmi.getMobiletManager().processNativeRequest(this,smEvent);
	},
	
	/*
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(smartEventResponse){
		//Send the response directly to the calling scope and the specified callback function
		this.callbackFunction.call(this.callbackFunctionScope, smartEventResponse);
	}
});
