/**
 * NotifierEventRequest : Request model for managing the notifier event
 */
appez.mmi.model.NotifierEventRequest = appez.mmi.createClass({
	className:"appez.mmi.model.NotifierEventRequest",
	singleton:false,
	
	type : 0,
	actionType : 0,
	data : null,
	
	//Setters for notifier request
	setType : function(notType){
		this.type = notType;
	},
	
	setActionType : function(notActionType){
		this.actionType = notActionType;
	},
	
	setData : function(notData){
		this.data = notData;
	},
	
	//Getters for notifier request
	getType : function(){
		return this.type;
	},
	
	getActionType : function(){
		return this.actionType;
	},
	
	getData : function(){
		return this.data;
	}
});	