/** 
 * 
 *  This class represents a Map Service. Allows the web layer to show maps in the appez powered
 *  application. Based on Google Maps v2.0 for Android. Currently this operation
 *  is supported through the CO event which means it is not purely WEB or APP
 *  event
 * Responsible for displaying platform specific map through native layer.
 * 
 **/
appez.mmi.service.nativePlatform.MapService = appez.mmi.createClass({          
	className:"appez.mmi.service.nativePlatform.MapService",     //Contains Class Name
	singleton:true,                                         	//specify whether the class is singleton object or not
	extend:appez.mmi.service.SmartEventService,                 //Contains Base Class Name
    
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
			if((smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.MAPVIEW_SHOW)||(smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.MAPVIEW_SHOW_WITH_DIRECTIONS)){
				requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_LOCATIONS];
			} else if(smEvent.getSmartEventRequest().getServiceOperationId()==appez.mmi.constant.MAPVIEW_SHOW_WITH_ANIMATION){
				requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_LOCATIONS,appez.mmi.constant.MMI_REQUEST_PROP_ANIMATION_TYPE];
			}
			
			if(appez.mmi.util.FrameworkUtil.eventReqHasRequiredFields(requestObj,requiredFields)){
				//If the location details have been provided correctly, check if the user has provided the pin color in valid hex format or not
				if(this.isValidMarkerPins(requestObj)){
//					appez.mmi.setSmartEventUnderExecution(true);
					appez.mmi.getMobiletManager().processNativeRequest(this,smEvent);
				} else {
					//It means that the marker pin color was invalid
					var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
					this.processResponse(smEventResponse);
				}
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
	
	isValidMarkerPins: function(requestObj){
		var allLocations = requestObj[appez.mmi.constant.MMI_REQUEST_PROP_LOCATIONS];
		var isValidHexColorCode = true;
		if(allLocations.length>0){
			var allLocationsCount = allLocations.length;
			for(var location=0;location<allLocationsCount;location++){
				var markerPinColor = allLocations[location][appez.mmi.constant.MMI_REQUEST_PROP_LOC_MARKER];
				if(markerPinColor!=undefined){
					isValidHexColorCode = appez.mmi.util.GenericUtil.isValidHexColor(allLocations[location][appez.mmi.constant.MMI_REQUEST_PROP_LOC_MARKER]);
				}				
			}
		}
		console.log('MapService->isValidMarkerPins->isValidHexColorCode:'+isValidHexColorCode);
		return isValidHexColorCode;
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
