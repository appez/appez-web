/** Provides support for the UI components such as dialogs, indicators etc.
 * 
 */
appez.mmi.service.web.UIService = appez.mmi.createClass({          
	className:"appez.mmi.service.web.UIService",              //Contains Class Name
	singleton:true,                                      //specify whether the class is singleton object or not ,By default service classes are singleton
	extend:appez.mmi.service.SmartEventService,               //Contains Base Class Name
	
	callbackFunction : null,
	callbackFunctionScope : null,
	smartEvent : null,
	
	componentElementName : 'appezUiComponentElement',
	
	/*
	 * Name: processRequest
	 * Description: Excecute SmartEventRequest object for native communication
	 * smartEventRequest: SmartEventRequest object
	 * Returns: None , transfer control to callBack method.
	 * Details about if any exception is thrown.
	 */
	processRequest: function(smEvent, callbackFunc, callbackFuncScope){
		this.smartEvent = smEvent;
		this.callbackFunction = callbackFunc;
		this.callbackFunctionScope = callbackFuncScope;
		var smartEventRequest = smEvent.getSmartEventRequest();
		this.parent.smEventRequest = smEvent.getSmartEventRequest();
		
		var requestData = JSON.stringify(smartEventRequest.getServiceRequestData());
		requestData = appez.mmi.util.Base64.decode(requestData);
		requestData = JSON.parse(requestData);
		
		switch(smartEventRequest.getServiceOperationId()){
		case appez.mmi.constant.WEB_SHOW_ACTIVITY_INDICATOR:
		case appez.mmi.constant.WEB_UPDATE_LOADING_MESSAGE:
			this.showLoadingIndicatorDialog(requestData);
			break;
			
		case appez.mmi.constant.WEB_HIDE_ACTIVITY_INDICATOR:
			this.hideLoadingIndicatorDialog(requestData);
			break;
			
		case appez.mmi.constant.WEB_SHOW_MESSAGE:
			this.showInformationDialog(requestData);
			break;
			
		case appez.mmi.constant.WEB_SHOW_MESSAGE_YESNO:
			this.showDecisionDialog(requestData);
			break;
			
		case appez.mmi.constant.WEB_SHOW_DIALOG_SINGLE_CHOICE_LIST:
			this.showSingleSelectionDialog(requestData);
			break;
			
		case appez.mmi.constant.WEB_SHOW_DIALOG_SINGLE_CHOICE_LIST_RADIO_BTN:
			this.showSingleRadioSelectionDialog(requestData);
			break;
			
		case appez.mmi.constant.WEB_SHOW_DIALOG_MULTIPLE_CHOICE_LIST_CHECKBOXES:
			this.showMultipleSelectionDialog(requestData);
			break;
		
		case appez.mmi.constant.WEB_SHOW_DATE_PICKER:
			this.showDatePicker(requestData);
			break;
		}	
	},
	
	/**
	 * Shows the loading indicator
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showLoadingIndicatorDialog : function(serviceReqData){
		var dataToFill = '<div id="activityIndicatorModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>[LOADING-MSG]</h3> </div> <div class="modal-body"> <div class="progress progress-striped active"> <div class="bar" style="width: 40%;"></div> </div> </div> </div>';
		if(serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE]!=undefined){
			dataToFill = dataToFill.replace('[LOADING-MSG]',serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE]);
			this.fillComponentDataInHtml(dataToFill);
			$('#activityIndicatorModal').modal('show');
		} else {
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
			this.processResponse(smEventResponse);
		}		
	},	
	
	/**
	 * Hides the loading indicator
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	hideLoadingIndicatorDialog : function(){
		appez.mmi.service.web.UIService.removeComponentFromHtml();
	},
	
	/**
	 * Shows the information dialog
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showInformationDialog : function(serviceReqData){
		var dataToFill = '<div id="dialogModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>Information</h3> </div> <div class="modal-body"> <p>[DIALOG-MESSAGE]</p> </div> <div class="modal-footer"> <button class="btn btn-primary">[POSITIVE-BTN-TXT]</button> </div> </div>';
		var infoDialogMsg = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
		
		if(infoDialogMsg==undefined){
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
			this.processResponse(smEventResponse);
		} else {
			dataToFill = dataToFill.replace('[DIALOG-MESSAGE]',infoDialogMsg);
			var infoDialogBtnTxt = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_BUTTON_TEXT];
			if(infoDialogBtnTxt==undefined){
				infoDialogBtnTxt = "OK";
			}
			dataToFill = dataToFill.replace('[POSITIVE-BTN-TXT]',infoDialogBtnTxt);
			this.fillComponentDataInHtml(dataToFill);
			$('#dialogModal').modal('show');
			
			$('#dialogModal .close').bind('tap',appez.mmi.service.web.UIService.onSelectInfoDialogOk);
			$('#dialogModal .modal-footer .btn-primary').bind('tap',appez.mmi.service.web.UIService.onSelectInfoDialogOk);
		}		
	},	
	
	/**
	 * Shows the decision dialog
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showDecisionDialog : function(serviceReqData){
		var dataToFill = '<div id="decisionModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>Information</h3> </div> <div class="modal-body"> <p>[DIALOG-MESSAGE]</p> </div> <div class="modal-footer"> <button class="btn btn-primary positiveBtn">[POSITIVE-BTN-TXT]</button> <button class="btn btn-primary negativeBtn">[NEGATIVE-BTN-TXT]</button> </div> </div>';
		try {
			var decisionDialogMsg = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
			var requiredFields = [];
			requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
			if(appez.mmi.util.FrameworkUtil.eventReqHasRequiredFields(serviceReqData,requiredFields)){
				dataToFill = dataToFill.replace('[DIALOG-MESSAGE]',decisionDialogMsg);
				var positiveBtnText = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_POSITIVE_BTN_TEXT];
				if(positiveBtnText==undefined){
					positiveBtnText = "OK";
				}
				var negativeBtnText = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_NEGATIVE_BTN_TEXT];
				if(negativeBtnText==undefined){
					negativeBtnText = "Cancel";
				}
				dataToFill = dataToFill.replace('[POSITIVE-BTN-TXT]',positiveBtnText);
				dataToFill = dataToFill.replace('[NEGATIVE-BTN-TXT]',negativeBtnText);
				this.fillComponentDataInHtml(dataToFill);
				$('#decisionModal').modal('show');
				
				$('#decisionModal .close').bind('tap',appez.mmi.service.web.UIService.onSelectDecisionDialogCancel);
				$('#decisionModal .modal-footer .positiveBtn').bind('tap',appez.mmi.service.web.UIService.onSelectDecisionDialogOk);
				$('#decisionModal .modal-footer .negativeBtn').bind('tap',appez.mmi.service.web.UIService.onSelectDecisionDialogCancel);
			} else {
				//Means that the user provided request does not have all the required request parameters. 
				//In this case, an error should be generated and should be returned to the user callback function
				var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
				this.processResponse(smEventResponse);
			}
		} catch(error){
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_JSON_REQUEST,error.message);
			this.processResponse(smEventResponse);
		}	
	},
	
	/**
	 * Shows single selection dialog. In this control, the element is selected when the user taps in any one of the list option elements
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showSingleSelectionDialog : function(serviceReqData){
		//$(':checked')[0].id {For reference only} 
		var dataToFill = '<div id="singleSelectModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>Select Item</h3> </div> <div class="modal-body"> [OPTIONS-LIST] </div> <div class="modal-footer"> <button class="btn btn-primary">Cancel</button> </div> </div>';
		try {
			var allListRows = '';
			var requiredFields = [];
			requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
			if(appez.mmi.util.FrameworkUtil.eventReqHasRequiredFields(serviceReqData,requiredFields)){
				var allListElements = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
				var allListElementsCount = allListElements.length;
				for(var currentElement = 0; currentElement<allListElementsCount;currentElement++){
					var singleRowTemplate = '<p class="select-option" id="[OPTION-ID]">[OPTION-TXT]</p>';
					singleRowTemplate = singleRowTemplate.replace('[OPTION-ID]',currentElement);
					singleRowTemplate = singleRowTemplate.replace('[OPTION-TXT]',allListElements[currentElement][appez.mmi.constant.MMI_REQUEST_PROP_ITEM]);
					allListRows += singleRowTemplate;
				}
				
				dataToFill = dataToFill.replace('[OPTIONS-LIST]',allListRows);
				this.fillComponentDataInHtml(dataToFill);
				$('#singleSelectModal').modal('show');
				
				$('#singleSelectModal .close').bind('tap',appez.mmi.service.web.UIService.onSingleSelectCancel);
				$('#singleSelectModal .modal-footer .btn-primary').bind('tap',appez.mmi.service.web.UIService.onSingleSelectCancel);
				$('#singleSelectModal p').bind('tap',appez.mmi.service.web.UIService.onSingleSelectElement);
			} else {
				//Means that the user provided request does not have all the required request parameters. 
				//In this case, an error should be generated and should be returned to the user callback function
				var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
				this.processResponse(smEventResponse);
			}
		} catch(error){
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_JSON_REQUEST,error.message);
			this.processResponse(smEventResponse);
		}	
	}, 
	
	/**
	 * Shows single selection dialog with radio buttons. In this control, the element is selected when user selects radio button corresponding to the list row element
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showSingleRadioSelectionDialog : function(serviceReqData){
		var dataToFill = '<div id="radioSelectModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>Select Item</h3> </div> <div class="modal-body"> [OPTIONS-LIST] </div> <div class="modal-footer"> <button class="btn btn-primary positiveBtn">OK</button> <button class="btn btn-primary negativeBtn">Cancel</button> </div> </div>';
		try {
			var allListRows = '';
			var requiredFields = [];
			requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
			if(appez.mmi.util.FrameworkUtil.eventReqHasRequiredFields(serviceReqData,requiredFields)){
				var allListElements = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
				var allListElementsCount = allListElements.length;
				for(var currentElement = 0; currentElement<allListElementsCount;currentElement++){
					var singleRowTemplate = '<label class="radio select-option"> <input type="radio" name="optionsRadios" id="[OPTION-ID]" value="option1"> [OPTION-TXT] </label>';
					singleRowTemplate = singleRowTemplate.replace('[OPTION-ID]',currentElement);
					singleRowTemplate = singleRowTemplate.replace('[OPTION-TXT]',allListElements[currentElement][appez.mmi.constant.MMI_REQUEST_PROP_ITEM]);
					allListRows += singleRowTemplate;
				}
				
				dataToFill = dataToFill.replace('[OPTIONS-LIST]',allListRows);
				this.fillComponentDataInHtml(dataToFill);
				$('#radioSelectModal').modal('show');
				
				$('#radioSelectModal .close').bind('tap',appez.mmi.service.web.UIService.onSingleSelectRadioCancel);
				$('#radioSelectModal .modal-footer .positiveBtn').bind('tap',appez.mmi.service.web.UIService.onSingleSelectRadioOk);
				$('#radioSelectModal .modal-footer .negativeBtn').bind('tap',appez.mmi.service.web.UIService.onSingleSelectRadioCancel);
			} else {
				//Means that the user provided request does not have all the required request parameters. 
				//In this case, an error should be generated and should be returned to the user callback function
				var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
				this.processResponse(smEventResponse);
			}
		} catch(error){
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_JSON_REQUEST,error.message);
			this.processResponse(smEventResponse);
		}	
	},
	
	/**
	 * Shows multiple selection dialog. Using this control, user can select more than one of the provided options
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showMultipleSelectionDialog : function(serviceReqData){
		var dataToFill = '<div id="multiSelectModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>Select Item(s)</h3> </div> <div class="modal-body"> [OPTIONS-LIST] </div> <div class="modal-footer"> <button class="btn btn-primary positiveBtn">OK</button> <button class="btn btn-primary negativeBtn">Cancel</button> </div> </div>';
		try {
			var allListRows = '';
			var requiredFields = [];
			requiredFields = [appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
			if(appez.mmi.util.FrameworkUtil.eventReqHasRequiredFields(serviceReqData,requiredFields)){
				var allListElements = serviceReqData[appez.mmi.constant.MMI_REQUEST_PROP_MESSAGE];
				var allListElementsCount = allListElements.length;
				for(var currentElement = 0; currentElement<allListElementsCount;currentElement++){
					var singleRowTemplate = '<label class="checkbox select-option"> <input type="checkbox" name="optionsRadios" id="[OPTION-ID]" value="option2"> [OPTION-TXT] </label>';
					singleRowTemplate = singleRowTemplate.replace('[OPTION-ID]',currentElement);
					singleRowTemplate = singleRowTemplate.replace('[OPTION-TXT]',allListElements[currentElement][appez.mmi.constant.MMI_REQUEST_PROP_ITEM]);
					allListRows += singleRowTemplate;
				}
				
				dataToFill = dataToFill.replace('[OPTIONS-LIST]',allListRows);
				this.fillComponentDataInHtml(dataToFill);
				$('#multiSelectModal').modal('show');
				
				$('#multiSelectModal .close').bind('tap',appez.mmi.service.web.UIService.onMultiSelectCancel);
				$('#multiSelectModal .modal-footer .positiveBtn').bind('tap',appez.mmi.service.web.UIService.onMultiSelectOk);
				$('#multiSelectModal .modal-footer .negativeBtn').bind('tap',appez.mmi.service.web.UIService.onMultiSelectCancel);
			} else {
				//Means that the user provided request does not have all the required request parameters. 
				//In this case, an error should be generated and should be returned to the user callback function
				var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR,appez.mmi.constant.INVALID_SERVICE_REQUEST_ERROR_MESSAGE);
				this.processResponse(smEventResponse);
			}
		} catch(error){
			var smEventResponse = appez.mmi.util.FrameworkUtil.getSmartEventResponseForServiceError(appez.mmi.constant.INVALID_JSON_REQUEST,error.message);
			this.processResponse(smEventResponse);
		}	
	},	
	
	/**
	 * Shows date picker control
	 * 
	 * @param serviceReqData : Request data corresponding to the current request
	 * 
	 * */
	showDatePicker : function(serviceReqData){
		var dataToFill = '<div id="datePickerModal" class="modal fade" role="dialog" data-backdrop="static"> <div class="modal-header">  <h3>Select Date</h3> </div> <div class="modal-body"> <div class="input-append date" id="datepicker-el" data-date="[CURRENT-DATE-DATA]" data-date-format="dd-mm-yyyy"> <input class="span2" size="16" type="text" value="[CURRENT-DATE]"> <span class="add-on"><i class="icon-th"></i></span> </div> </div> <div class="modal-footer"> <button class="btn btn-primary">OK</button> </div></div>';
		var currentDate = this.getCurrentDateString();
		dataToFill = dataToFill.replace('[CURRENT-DATE-DATA]',currentDate);
		dataToFill = dataToFill.replace('[CURRENT-DATE]',currentDate);
		this.fillComponentDataInHtml(dataToFill);
		$('#datePickerModal').modal('show');
		$('#datepicker-el').datepicker(); // initializes data picker component
		//Set the 'z-index' of the picker control
		$('.datepicker').css('z-index','10001');
		
		$('#datePickerModal .close').bind('tap',appez.mmi.service.web.UIService.onDatePickerCancel);
		$('#datePickerModal .modal-footer .btn-primary').bind('tap',appez.mmi.service.web.UIService.onDatePickerSelectOk);
	},
	
	/**
	 * Prepares the modified SmartEvent model by adding the response to it
	 *  
	 */
	prepareResponse : function(isOperationComplete, serviceResponse, exceptionType, exceptionMessage){
		//TODO to set the response of this action in the SmartEventResponse object and return the controller using the 'processResponse' method
		var smartEventResponse = new appez.mmi.model.SmartEventResponse();
		smartEventResponse.setOperationComplete(isOperationComplete);
		smartEventResponse.setServiceResponse(serviceResponse);
		smartEventResponse.setExceptionType(exceptionType);
		smartEventResponse.setExceptionMessage(exceptionMessage);
		this.processResponse(smartEventResponse);
	},
                                                         
	/**
	 * Name: processResponse
	 * Description: Here we get control after SmartEventRequest object processed.
	 * smartEventResponse: SmartEventResponse object
	 * Returns: None 
	 * Details about if any exception is thrown.
	 */
	processResponse: function(smartEventResponse){
		//Send the response directly to the calling scope and the specified callback function
		this.callbackFunction.call(this.callbackFunctionScope, smartEventResponse);
	},
	
	/**
	 * Fills the data of the UI service component in the specified div of the page
	 * 
	 * @param componentHtml
	 * 
	 * */
	fillComponentDataInHtml : function(componentHtml){
		//Delete the 'div' element if already created
		//It will be created when any UI service component will be shown
		if (document.getElementById(this.componentElementName)) {
			var elem = document.getElementById(this.componentElementName);
		    elem.parentNode.removeChild(elem);
		}
		
	    //Now create a new element by the same name and add the UI component HTML in that element
		$('body').append('<div id="'+this.componentElementName+'">'+componentHtml+'</div>');		
	},
	
	/**
	 * Removes the DOM element and its contents from the page
	 * 
	 * */
	removeComponentFromHtml : function(){
		//Delete the 'div' element if already created
		//It will be created when any UI service component will be shown
		if(document.getElementById(this.componentElementName)) {
			var elem = document.getElementById(this.componentElementName);
		    elem.parentNode.removeChild(elem);
		}
	},
	
	/**
	 * Returns the current date string in the desired formate of DD-MM-YYYY
	 * 
	 * */
	getCurrentDateString : function(){
		var d = new Date();
		var month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
		var dateString = d.getDate() +'-'+ month[d.getUTCMonth()]+"-"+d.getFullYear();
		return dateString;
	},
	
	/**
	 * Initiates the service completion notification when OK button is pressed on information dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSelectInfoDialogOk : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = appez.mmi.constant.USER_SELECTION_OK;
		$('#dialogModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when OK button is pressed on decision dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSelectDecisionDialogOk : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = appez.mmi.constant.USER_SELECTION_YES;
		$('#decisionModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when Cancel button is pressed on decision dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSelectDecisionDialogCancel : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = appez.mmi.constant.USER_SELECTION_NO;
		$('#decisionModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when Cancel button is pressed on Single select dialog
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSingleSelectCancel : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = "-1";
		$('#singleSelectModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when an element from the single select dialog is selected
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSingleSelectElement : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = e.currentTarget.id;
		$('#singleSelectModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when OK button is pressed on single select radio dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSingleSelectRadioOk : function(e){
		e.preventDefault();
		var response = {};
		if($('#radioSelectModal :checked')[0]!=undefined){
			//Means an element is selected
			response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = $('#radioSelectModal :checked')[0].id;
		} else {
			//Means no element is selected
			response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = "";
		}
		$('#radioSelectModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when Cancel button is pressed on single select radio dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onSingleSelectRadioCancel : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = "-1";
		$('#radioSelectModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when OK button is pressed on multiple select dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onMultiSelectOk : function(e){
		e.preventDefault();
		var response = {};
		var allSelectedElements = $('#multiSelectModal :checked');
		if(allSelectedElements!=null && allSelectedElements!=undefined){
			var selectedElementsCount = allSelectedElements.length;
			if(selectedElementsCount>0){
				var allElementsArray = [];
				for(var currentElement=0;currentElement<selectedElementsCount;currentElement++){
					var selectedIndexObj = {};
					selectedIndexObj[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTED_INDEX] = allSelectedElements[currentElement].id;
					allElementsArray[currentElement] = selectedIndexObj;
				}
				response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = allElementsArray;
			} else {
				response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = "";
			} 
		}
		
		$('#multiSelectModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when Cancel button is pressed on multi select dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onMultiSelectCancel : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.MMI_RESPONSE_PROP_USER_SELECTION] = "-1";
		$('#multiSelectModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when Cancel button is pressed on date picker dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onDatePickerCancel : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.RESPONSE_JSON_PROP_DATA] = "";
		$('#datePickerModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	},
	
	/**
	 * Initiates the service completion notification when OK button is pressed on date picker dialog 
	 * 
	 * @param e : Current event object
	 * 
	 * */
	onDatePickerSelectOk : function(e){
		e.preventDefault();
		var response = {};
		response[appez.mmi.constant.RESPONSE_JSON_PROP_DATA] = $('#datePickerModal input')[0].value;
		$('#datePickerModal').modal('hide');
		appez.mmi.service.web.UIService.prepareResponse(true, response, 0, null);
	}
});                        