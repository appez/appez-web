
/** 
 * 
 *  This class represents an Smart Event Request model and holds event configuration detail.
 *  Use to request resources and process events.
 **/

appez.mmi.model.SmartEventRequest = appez.mmi.createClass({
	className:"appez.mmi.model.SmartEventRequest",
	singleton:false,
    
    //Class member variables
    serviceOperationId : null,
    serviceRequestData : null,
    
	//Setters for SmartEventRequest parameters
	setServiceOperationId : function(operationId){
		this.serviceOperationId = operationId;
	},
	
	setServiceRequestData : function(requestData){
		this.serviceRequestData = requestData;
	},
		
	getServiceOperationId : function(){
		return this.serviceOperationId;
	},
	
	getServiceRequestData : function(){
		return this.serviceRequestData;
	}
});