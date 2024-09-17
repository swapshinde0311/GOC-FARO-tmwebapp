"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[7465],{77465:(e,t,a)=>{a.r(t),a.d(t,{default:()=>x});var s=a(65043),o=a(40252),n=a(40854),i=a.n(n),l=a(72067),d=a(97508),r=(a(38726),a(65187)),c=a(69062),h=a(72711),y=a(78374),u=a(67907),m=a(35861),p=a(70579);function C(e){let{customerCode:t,baseproductCode:a,inventorySummaryInfo:s,dateRange:o,handleDateTextChange:n,handleRangeSelect:i,dateError:l,closedReceipt:d,closedDispatch:r,activeDispatch:c,handleLoadInventory:C,pageSize:D,totalUnloadedQty:g,totalLoadedQty:x,totalBlockedQty:v}=e;return(0,p.jsx)(u.TranslationConsumer,{children:e=>(0,p.jsxs)("div",{children:[(0,p.jsx)("div",{className:"headerContainer",children:(0,p.jsx)("div",{className:"row headerSpacing",children:(0,p.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,p.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:e("CustomerInventory_Title").replace("{0}",t).replace("{1}",a)})})})}),(0,p.jsxs)("div",{className:"detailsContainer",children:[(0,p.jsx)("div",{className:"row",children:(0,p.jsx)("div",{className:"col-12 col-md-12 col-lg-12",children:(0,p.jsx)("h5",{children:e("CustomerInventory_QtyAsOfNow")+": "+s.GrossAvailableQty+s.QuantityUOM})})}),(0,p.jsx)("div",{className:"row",style:{marginLeft:"1px"},children:(0,p.jsxs)("div",{className:"dateRangeContainer",children:[(0,p.jsx)("div",{className:"dateRangeMargin",children:(0,p.jsx)(h.DatePicker,{type:"daterange",closeOnSelection:!0,error:e(l),displayFormat:(0,m.F1)(),rangeValue:o,onTextChange:n,onRangeSelect:i,reserveSpace:!1})}),(0,p.jsx)("div",{className:"dateSearch",children:(0,p.jsx)(h.Button,{content:e("ProductAllocation_Go"),onClick:C})})]})}),(0,p.jsxs)("div",{className:"row customerInventoryGridRow",children:[(0,p.jsxs)("div",{className:"col-12 col-md-12 col-lg-4",children:[d.length>0?(0,p.jsx)("h5",{children:e("CustomerInventory_ClosedReceipts")+" ("+e("CustomerInventory_TotalUnloadedQty")+" : "+g+s.QuantityUOM+")"}):(0,p.jsx)("h5",{children:e("CustomerInventory_ClosedReceipts")}),(0,p.jsx)("div",{className:"tableScroll  flexRelative",children:(0,p.jsxs)(y.bQ,{data:d,search:!1,children:[(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"ReceiptCode",header:e("Report_ReceiptCode"),editFieldType:"text"},"ReceiptCode"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"UnloadedTime",header:e("UnloadedDate"),editFieldType:"text"},"UnloadedTime"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"PlannedQuantity",header:e("ViewReceipt_Quantity"),editFieldType:"text"},"PlannedQuantity"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"UnloadedQuantity",header:e("UnLoadingInfo_UnloadQuantity"),editFieldType:"text"},"UnloadedQuantity"),Array.isArray(d)&&d.length>D?(0,p.jsx)(y.bQ.Pagination,{}):""]})})]}),(0,p.jsxs)("div",{className:"col-12 col-md-12 col-lg-4",children:[r.length>0?(0,p.jsx)("h5",{children:e("CustomerInventory_ClosedDispatches")+" ("+e("CustomerInventory_TotalLoadedQty")+" : "+x+s.QuantityUOM+")"}):(0,p.jsx)("h5",{children:e("CustomerInventory_ClosedDispatches")}),(0,p.jsx)("div",{className:"tableScroll  flexRelative",children:(0,p.jsxs)(y.bQ,{data:r,search:!1,children:[(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"DispatchCode",header:e("PipelineDispatch_DispatchCode"),editFieldType:"text"},"DispatchCode"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"LoadedTime",header:e("ShipmentByCompartmentList_LoadedDate"),editFieldType:"text"},"LoadedTime"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"PlannedQuantity",header:e("ViewReceipt_Quantity"),editFieldType:"text"},"PlannedQuantity"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"LoadedQuantity",header:e("ShipmentOrder_LoadedQuantity"),editFieldType:"text"},"LoadedQuantity"),Array.isArray(r)&&r.length>D?(0,p.jsx)(y.bQ.Pagination,{}):""]})})]}),(0,p.jsxs)("div",{className:"col-12 col-md-12 col-lg-4",children:[c.length>0?(0,p.jsx)("h5",{children:e("CustomerInventory_ActiveDispatches")+" ("+e("CustomerInventory_TotalBlockedQty")+" : "+v+s.QuantityUOM+")"}):(0,p.jsx)("h5",{children:e("CustomerInventory_ActiveDispatches")}),(0,p.jsx)("div",{className:"tableScroll flexRelative",children:(0,p.jsxs)(y.bQ,{data:c,search:!1,children:[(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"DispatchCode",header:e("PipelineDispatch_DispatchCode"),editFieldType:"text"},"DispatchCode"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"ScheduledDate",header:e("ShipmentProdDetail_ScheduledDate"),editFieldType:"text"},"ScheduledDate"),(0,p.jsx)(y.bQ.Column,{className:"compColHeight",field:"PlannedQuantity",header:e("ProductAllocationItemInfo_BlockedQty"),editFieldType:"text"},"PlannedQuantity"),Array.isArray(c)&&c.length>D?(0,p.jsx)(y.bQ.Pagination,{}):""]})})]})]}),(0,p.jsx)("div",{className:"row",style:{marginLeft:"1px"},children:(0,p.jsx)("div",{className:"dateRangeContainer",children:e("CustomerInventory_LegendContent")})})]})]})})}C.defaultProps={};var D=a(7523);class g extends s.Component{constructor(){super(...arguments),this.state={isReadyToRender:!1,inventorySummaryInfo:{},fromDate:new Date,toDate:new Date,dateError:"",closedReceipt:[],closedDispatch:[],activeDispatch:[],totalUnloadedQty:"",totalLoadedQty:"",totalBlockedQty:""},this.handleRangeSelect=e=>{let{to:t,from:a}=e;void 0!==t&&this.setState({toDate:t}),void 0!==a&&this.setState({fromDate:a})},this.handleDateTextChange=(e,t)=>{""===e&&this.setState({dateError:"",toDate:"",fromDate:""}),null!==t&&""!==t?this.setState({dateError:"Common_InvalidDate",toDate:"",fromDate:""}):this.setState({dateError:"",toDate:e.to,fromDate:e.from})},this.handleLoadInventory=()=>{let e=c.wb(this.state.toDate,this.state.fromDate);""!==e?this.setState({dateError:e}):(this.setState({dateError:"",isReadyToRender:!1}),this.getCustomerInventoryDetails())}}componentDidMount(){try{this.getCustomerInventoryDetails()}catch(e){console.log("CustomerInventoryDetailsComposite:Error occured on componentDidMount",e)}}getCustomerInventoryDetails(){try{let e=new Date(this.state.fromDate),t=new Date(this.state.toDate);e.setHours(0,0,0),t.setHours(23,59,59);let a={StartRange:e,EndRange:t,BaseProductCode:this.props.baseproductCode,CustomerCode:this.props.customerCode,ShareholderCode:this.props.selectedShareholder};i()(l.Z2l,c.tW(a,this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){let e={},a=[],s=[],o=[],n=0,i=0,l=0;Array.isArray(t.EntityResult.Table)&&(e=t.EntityResult.Table[0]),Array.isArray(t.EntityResult.Table1)&&(t.EntityResult.Table1.map((function(e){n+=parseFloat(e.UnloadedQuantity),e.UnloadedTime=new Date(e.UnloadedTime).toLocaleDateString(),e.PlannedQuantity=e.PlannedQuantity+" "+e.QuantityUOM,e.UnloadedQuantity=e.UnloadedQuantity+" "+e.QuantityUOM,e.TransportationType===D.QY&&(e.ReceiptCode=e.ReceiptCode+" *")})),a=t.EntityResult.Table1),Array.isArray(t.EntityResult.Table2)&&(t.EntityResult.Table2.map((function(e){i+=parseFloat(e.LoadedQuantity),e.LoadedTime=new Date(e.LoadedTime).toLocaleDateString(),e.PlannedQuantity=e.PlannedQuantity+" "+e.QuantityUOM,e.LoadedQuantity=e.LoadedQuantity+" "+e.QuantityUOM,e.TransportationType===D.QY&&(e.DispatchCode=e.DispatchCode+" *")})),s=t.EntityResult.Table2),Array.isArray(t.EntityResult.Table3)&&(t.EntityResult.Table3.map((function(e){l+=parseFloat(e.PlannedQuantity),e.ScheduledDate=new Date(e.ScheduledDate).toLocaleDateString(),e.PlannedQuantity=e.PlannedQuantity+" "+e.QuantityUOM})),o=t.EntityResult.Table3),this.setState({isReadyToRender:!0,inventorySummaryInfo:e,closedReceipt:a,closedDispatch:s,activeDispatch:o,totalUnloadedQty:n,totalLoadedQty:i,totalBlockedQty:l})}else this.setState({isReadyToRender:!0,inventorySummaryInfo:[],closedReceipt:[],closedDispatch:[],activeDispatch:[]}),console.log("Error in getCustomerInventoryDetails:",t.ErrorList)})).catch((e=>{this.setState({isReadyToRender:!0,inventorySummaryInfo:[],closedReceipt:[],closedDispatch:[],activeDispatch:[]}),console.log("Error while getCustomerInventoryDetails:",e)}))}catch(e){console.log("CustomerInventoryDetailsComposite:Error occured on getCustomerInventoryDetails",e)}}render(){return this.state.isReadyToRender?(0,p.jsx)("div",{children:(0,p.jsxs)(r.A,{children:[(0,p.jsx)(C,{customerCode:this.props.customerCode,baseproductCode:this.props.baseproductCode,inventorySummaryInfo:this.state.inventorySummaryInfo,dateRange:{from:this.state.fromDate,to:this.state.toDate},dateError:this.state.dateError,handleDateTextChange:this.handleDateTextChange,handleRangeSelect:this.handleRangeSelect,closedReceipt:this.state.closedReceipt,closedDispatch:this.state.closedDispatch,activeDispatch:this.state.activeDispatch,handleLoadInventory:this.handleLoadInventory,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,totalUnloadedQty:this.state.totalUnloadedQty,totalLoadedQty:this.state.totalLoadedQty,totalBlockedQty:this.state.totalBlockedQty}),(0,p.jsx)("div",{className:"row",children:(0,p.jsx)("div",{className:"col col-lg-8",style:{marginTop:"1%"},children:(0,p.jsx)(u.TranslationConsumer,{children:e=>(0,p.jsx)(h.Button,{className:"backButton",onClick:this.props.onBack,content:e("Back")})})})})]})}):(0,p.jsx)(o.A,{message:"Loading"})}}const x=(0,d.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(g)},35861:(e,t,a)=>{a.d(t,{F1:()=>l,i7:()=>d,r4:()=>i});var s=a(86178),o=a.n(s),n=(a(15660),a(65043),a(70579));function i(e,t){if(Array.isArray(e)){0===e.filter((e=>e.text===t)).length&&e.unshift({value:null,text:t})}return e}function l(){let e=window.navigator.userLanguage||window.navigator.language;return o().locale(e),o().localeData().longDateFormat("L")}function d(e){return(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{children:e}),(0,n.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=7465.7e6e5193.chunk.js.map