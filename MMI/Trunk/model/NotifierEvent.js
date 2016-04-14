/**
 * NotifierEvent: Model for holding the information regarding the notifier events
 */
appez.mmi.model.NotifierEvent = appez.mmi.createClass({
	className:"appez.mmi.model.NotifierEvent",
	singleton:false,
	
	transactionId : null,
	notifierEventRequest : null,
	notifierEventResponse : null,
	
	setTransactionId : function(transId){
		this.transactionId = transId;
	},

	setNotifierEventRequest : function(smEventRequest){
		this.notifierEventRequest = smEventRequest;
	},
	
	setNotifierEventResponse : function(smEventResponse){
		this.notifierEventResponse = smEventResponse;
	},
	
	getTransactionId : function(){
		return this.transactionId;
	},
	
	getNotifierEventRequest : function(){
		return this.notifierEventRequest;
	},
	
	getNotifierEventResponse : function(){
		return this.notifierEventResponse;
	}
});	