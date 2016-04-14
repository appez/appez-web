appez.mmi.model.SmartEvent = appez.mmi.createClass({
	className:"appez.mmi.model.SmartEvent",
	singleton:false,
	
	transactionId : null,
	isResponseExpected : false,
	smartEventRequest : null,
	smartEventResponse : null,
	
	setTransactionId : function(transId){
		this.transactionId = transId;
	},

	setResponseExpected : function(isResponseExp){
		this.isResponseExpected = isResponseExp;
	},
	
	setSmartEventRequest : function(smEventRequest){
		this.smartEventRequest = smEventRequest;
	},
	
	setSmartEventResponse : function(smEventResponse){
		this.smartEventResponse = smEventResponse;
	},
	
	getTransactionId : function(){
		return this.transactionId;
	},

	getResponseExpected : function(){
		return this.isResponseExpected;
	},
	
	getSmartEventRequest : function(){
		return this.smartEventRequest;
	},
	
	getSmartEventResponse : function(){
		return this.smartEventResponse;
	}
});	