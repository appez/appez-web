/** 
 * 
 *  This class represents a Database service Service. Provides access to the device database which is a SQLite
 *  implementation. Enables the user to create database that resides in the
 *  application sand box. Also enables user to perform basic CRUD operations.
 *  Current implementation allows for execution of queries as they are provided
 *  by the user
 *  Responsible for communicating database queries and response to and from native layer.
 * 
 **/

appez.mmi.service.nativePlatform.DatabaseService = appez.mmi.createClass({          
	className:"appez.mmi.service.nativePlatform.DatabaseService", 			//Contains Class Name
	singleton:true,                                            				//Specify whether the class is singleton object or not
	extend:appez.mmi.service.SmartEventService,                            	//Contains Base Class Name
	
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
			if((smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.WEB_OPEN_DATABASE) || (smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.WEB_CLOSE_DATABASE)){
				requiredFields  = [appez.mmi.constant.MMI_REQUEST_PROP_APP_DB];
			} else if((smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.WEB_EXECUTE_DB_QUERY)||(smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.WEB_EXECUTE_DB_READ_QUERY)){
				requiredFields  = [appez.mmi.constant.MMI_REQUEST_PROP_APP_DB,appez.mmi.constant.MMI_REQUEST_PROP_QUERY_REQUEST];
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
	