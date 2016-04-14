/** 
 * 
 *  This class represents a Camera Service. Provides access to the camera hardware of the device.
 *  Supports capturing image from the camera or getting image from the gallery.
 *  Also allows the user to perform basic filter operations on the image such as
 *  Monochrome and Sepia
 *  Responsible for communicating camera events and configuration to native layer.
 * 
 **/


appez.mmi.service.nativePlatform.CameraService = appez.mmi.createClass({          
	className:"appez.mmi.service.nativePlatform.CameraService", 	//Contains Class Name
	singleton:true,                                            		//specify whether the class is singleton object or not
	extend:appez.mmi.service.SmartEventService,                     //Contains Base Class Name

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
			if(requestObj[appez.mmi.constant.MMI_REQUEST_PROP_IMG_SRC]==appez.mmi.constant.LAUNCH_CAMERA){
				requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_CAMERA_DIR,appez.mmi.constant.MMI_REQUEST_PROP_IMG_RETURN_TYPE];
			} else if(requestObj[appez.mmi.constant.MMI_REQUEST_PROP_IMG_SRC]==appez.mmi.constant.LAUNCH_GALLERY){
				requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_IMG_RETURN_TYPE];
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
