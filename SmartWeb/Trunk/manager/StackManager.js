/** 
 * 
 *	This manager is responsible for management of controller stack
 * 
 **/


appez.smartweb.manager.StackManager = appez.smartweb.createClass({
	className : "appez.smartweb.manager.StackManager",
	extend : appez.smartweb.swcore.BaseManager,
	singleton: true,
    application: {},
    
    controllerStack : null,
    controllerMap : null,
    currentControllerCount : 0,
    currentPage : null,
    
    //this flag indicates whether or not the last operation was a Back key press
    isBackPressedInPreviousOp : false,
	
    init : function() {
    	this.controllerStack = {};
    	this.controllerMap = [];
    	this.currentControllerCount = 0;
	},
	
	navigateTo : function(pageId, controllerObj){
		if(this.isBackPressedInPreviousOp){
			this.isBackPressedInPreviousOp = false;
			this.currentControllerCount = this.currentControllerCount+1;
		}
		this.currentPage = pageId;
		this.controllerStack[pageId] = controllerObj;
		this.controllerMap[this.currentControllerCount]=pageId;
		console.log('StackManager->navigateTo->currentControllerCount(previous):' + this.currentControllerCount);
		this.currentControllerCount = this.currentControllerCount + 1;
		appez.smartweb.setCurrentController(this.controllerStack[pageId]);
		console.log('StackManager->navigateTo->currentControllerCount(new):' + this.currentControllerCount + ',current controller:' + appez.smartweb.getCurrentController().className);
	},
	
	navigateBack : function(previousPageId){
	    console.log('StackManager->navigateBack->navigateBack');
	    if(!this.isBackPressedInPreviousOp){
	        //We need to normalise the value of 'currentControllerCount' because while navigating forward we have kept the 'currentControllerCount' value 1 greater than the actual number of controllers
	        this.currentControllerCount = this.currentControllerCount - 1;
	        this.isBackPressedInPreviousOp = true;
	    }
		
		if(previousPageId!=undefined && this.currentControllerCount>0){
			//If the Id of the previous page has been provided, then we need to set the current controller directly to that value
			this.currentControllerCount = this.currentControllerCount-1;
			console.log('StackManager->navigateBack->currentControllerCount:' + this.currentControllerCount + ',controllermap screen:' + this.controllerMap[this.currentControllerCount] + ",previousPageId:" + previousPageId);
			if(this.controllerMap[this.currentControllerCount]!=previousPageId) {
				//This means that the user has specified to navigate to a page which is different from the one encountered during forward navigation
				delete this.controllerStack[this.currentPage];
				for(var controllerCurrentIndex=0;controllerCurrentIndex<this.currentControllerCount;controllerCurrentIndex++){
					if(this.controllerMap[controllerCurrentIndex]===previousPageId){
						this.currentControllerCount = controllerCurrentIndex;
						break;
					}
				}
				this.controllerMap[this.currentControllerCount]=previousPageId;
			} else {
				//This means the user is navigating back in the same manner as forward navigation
				delete this.controllerStack[this.currentPage];
				appez.smartweb.setCurrentController(this.controllerStack[previousPageId]);
			}
		} else {
			//Means that the previous page is not mentioned by the user
			//In this case, get the controller in the previous position on the stack
			if(this.currentControllerCount>0){
				delete this.controllerStack[this.currentPage];
				this.controllerStack[this.controllerMap[this.currentControllerCount]] = null;
				this.controllerMap[this.currentControllerCount] = null;
				this.currentControllerCount = this.currentControllerCount-1;
				this.currentPage = this.controllerMap[this.currentControllerCount];
				appez.smartweb.setCurrentController(this.controllerStack[this.currentPage]);
			} else {
				this.currentPage = this.controllerMap[0];
				appez.smartweb.setCurrentController(this.controllerStack[this.currentPage]);
			}
		}
		console.log('StackManager->navigateBack->current controller:' + appez.smartweb.getCurrentController().className);
	}
});