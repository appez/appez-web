/** 
 * 
 *  This class represents a HTTP Service. Performs HTTP operations. Currently supports HTTP GET,POST, PUT and DELETE
 *  operations. Also supports feature to create a DAT file dump that holds the response of HTTP operation
 *  Responsible for communication over HTTP protocol.
 * 
 **/

appez.mmi.service.nativePlatform.HttpService = appez.mmi.createClass({          
	className:"appez.mmi.service.nativePlatform.HttpService",           //Contains Class Name
	singleton:true,                                                 	//specify whether the class is singleton object or not
	extend:appez.mmi.service.SmartEventService,                         //Contains Base Class Name
    
	callbackFunction : null,
	callbackFunctionScope : null,
	smartEvent : null,
		
	/*
	 * Name: processRequest
	 * Description: Execute SmartEventRequest object for native communication
	 * eventRequest: EventRequest object
	 * Returns: None , transfer control to callBack method.
	 * Details about if any exception is thrown.
	 */
	processRequest: function(smEvent, callbackFunc, callbackFuncScope){
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		this.smartEvent = smEvent;
		try {
			//Check whether or not the request provided by the user has all the required fields for this service
			var requestObj = appez.mmi.util.FrameworkUtil.getRequestObjFromSmartEvent(smEvent);
			
			var requiredFields = [];
			if(smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.WEB_HTTP_REQUEST){
				requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_REQ_METHOD,appez.mmi.constant.MMI_REQUEST_PROP_REQ_URL];
			} else if(smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.WEB_HTTP_REQUEST_SAVE_DATA){
				requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_REQ_METHOD,appez.mmi.constant.MMI_REQUEST_PROP_REQ_URL,appez.mmi.constant.MMI_REQUEST_PROP_REQ_FILE_TO_SAVE_NAME];
			}					
					
			if(appez.mmi.util.FrameworkUtil.eventReqHasRequiredFields(requestObj,requiredFields)){
//				appez.mmi.setSmartEventUnderExecution(true);
				appez.mmi.getMobiletManager().processNativeRequest(this,smEvent);
			} else {
				//Means that the user provided request does not have all the required request parameters. 
				//In this case, an error should be generated and should be returned to the user callback function
				var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
				this.processResponse(smEventResponse);
			}
		} catch(error){
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_JSON_REQUEST,error.message);
			this.processResponse(smEventResponse);
		}
	},
                                                         
	/*
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(eventResponse){
		//If the processResponse is being called, that means the service operation has completed
		appez.mmi.setSmartEventUnderExecution(false);
		//Send the response directly to the calling scope and the specified callback function
		this.callbackFunction.call(this.callbackFunctionScope, eventResponse);
	}
});	
