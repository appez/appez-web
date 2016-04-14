
/** 
 * 
 *   This class represents an Smart Response model and holds event configuration detail.
 *   Use to send the request resource or data through the events.
 **/

appez.mmi.model.SmartEventResponse = appez.mmi.createClass({
	className:"appez.mmi.model.SmartEventResponse",
    singleton:false,
    
    isOperationComplete : false,
    serviceResponse : null,
    exceptionType : null,
    exceptionMessage : null,
    
    setOperationComplete : function(isOpComplete){
    	this.isOperationComplete = isOpComplete;
    },
    
    setServiceResponse : function(response){
    	this.serviceResponse = response;
    },
    
    setExceptionType : function(excType){
    	this.exceptionType = excType;
    },
    
    setExceptionMessage : function(excMessage){
    	this.exceptionMessage = excMessage;
    },
    
    getOperationComplete : function(){
    	return this.isOperationComplete;
    },
    
    getServiceResponse : function(){
    	return this.serviceResponse;
    },
    
    getExceptionType : function(){
    	return this.exceptionType;
    },
    
    getExceptionMessage : function(){
    	return this.exceptionMessage;
    }
});