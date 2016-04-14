/**
 * NotifierEventResponse : Response model for managing the notifier event
 */
appez.mmi.model.NotifierEventResponse = appez.mmi.createClass({
	className:"appez.mmi.model.NotifierEventResponse",
	singleton:false,
	
	isOpComplete : false,
	response : null,
	errorType : 0,
	errorMessage : null,
	
	//Setters for notifier request
	setOperationComplete : function(opComplete){
		if(opComplete!=undefined){
			this.isOpComplete = opComplete;
		}		
	},
	
	setResponse : function(notifierResp){
		this.response = notifierResp;
	},
	
	setErrorType : function(errorType){
		this.errorType = errorType;
	},
	
	setErrorMessage : function(notifierErr){
		this.errorMessage = notifierErr;
	},
	
	//Getters for notifier request
	isOperationComplete : function(){
		return this.isOpComplete;
	},
	
	getResponse : function(){
		return this.response;
	},
	
	getErrorType : function(){
		return this.errorType;
	},
	
	getErrorMessage : function(){
		return this.errorMessage;
	}
});