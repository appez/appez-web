/** Provides handling of App events in the web layer.
 * 
 */
appez.mmi.service.web.AppEventService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.AppEventService", 	//Contains Class Name
	singleton:true,                                            //specify whether the class is singleton object or not. By default util classes are singleton
	extend:appez.mmi.service.SmartEventService,                     //Contains Base Class Name
   
	/*
	 * Name: processRequest
	 * Description: Excecute SmartEventRequest object for native communication
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
		//No callback for APP events
	}
});
