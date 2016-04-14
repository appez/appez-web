/**
 * SmartService.js: 
 * Base class of the services. All individual service classes are derived
 * from SmartService. It exposes interface called SmartServiceListner to share
 * processing results of service with intended client
 */

appez.mmi.service.SmartEventService = appez.mmi.createClass({
	className:"appez.mmi.service.SmartEventService",         //Contains Class Name
	singleton:true,                                     //specify whethet the class is singleton object or not ,Bydefault service classes are singleton
	smEventRequest:null,                                //SmartEventRequest Object
    
	init : function(){
		
	},
	
    setSmEventRequest:function(smartEventRequest) {
//        this.smEventRequest=smartEventRequest;
    },
    
    getSmEventRequest:function(smartEventRequest){
//        return this.smEventRequest;
    },
                                                  
    processRequest: function(smartEventRequest){
		
	},
	
	processResponse: function(smartEventResponse){
	
	}
});