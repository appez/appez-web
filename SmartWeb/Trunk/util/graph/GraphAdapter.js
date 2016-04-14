/**
 * Works as a adapter and wraps the calls between the appez Web library and the chart.js library
 */
appez.smartweb.util.graph.GraphAdapter= appez.smartweb.createClass({
	className : "appez.smartweb.util.graph.GraphAdapter",
	singleton : true,

	/**
	 * Initialize the graph with the necessary parameters
	 * Init paramters should contain the following properties
	 * 'graphType','targetDiv','chartData'
	 * */
	drawGraph : function(reqParams) {
		if(reqParams && (reqParams instanceof Object)){
			var graphType = reqParams[appez.smartweb.constant.CHART_REQ_PARAM_GRAPH_TYPE];
			var targetDiv = reqParams[appez.smartweb.constant.CHART_REQ_PARAM_TARGET_DIV];
			var chartData = reqParams[appez.smartweb.constant.CHART_REQ_PARAM_DATA];
			var chartObj = null;
			switch(graphType){
			case appez.smartweb.constant.CHART_TYPE_BAR:
				chartObj = new Chart(document.getElementById(targetDiv).getContext("2d")).Bar(chartData,{'animation':false});
				break;
				
			case appez.smartweb.constant.CHART_TYPE_PIE:
				chartObj = new Chart(document.getElementById(targetDiv).getContext("2d")).Pie(chartData,{'animation':false});
				break;
				
			case appez.smartweb.constant.CHART_TYPE_LINE:
				chartObj = new Chart(document.getElementById(targetDiv).getContext("2d")).Line(chartData,{'animation':false});
				break;
				
			case appez.smartweb.constant.CHART_TYPE_DOUGHNUT:
				chartObj = new Chart(document.getElementById(targetDiv).getContext("2d")).Doughnut(chartData,{'animation':false});
				break;	
				
			default:
				//Throw an error here as this means that it is an unsupported graph type
				break;	
			}
			
		} else {
			//throw an error that the user has not specified the init parameters
		}
	}
});