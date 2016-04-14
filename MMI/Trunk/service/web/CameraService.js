/** Provides handling of camera in the web layer. 
 * This service uses HTML5 support for camera in the device for accessing the hardware camera in the device, if present 
 * 
 */
appez.mmi.service.web.CameraService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.CameraService", 	//Contains Class Name
	singleton:true,                                            //specify whether the class is singleton object or not ,By default are singleton
	extend:appez.mmi.service.SmartEventService,                     //Contains Base Class Name
   
	/*
	 * Name: processRequest
	 * Description: Execute SmartEventRequest object for native communication
	 * smartEventRequest: SmartEventRequest object
	 * Returns: None , transfer control to callBack method.
	 * Details about if any exception is thrown.
	 */
	processRequest: function(smartEventRequest){

	},
    
	/*
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(smartEventResponse){

	}
});
