"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[5050,3235],{85050:(e,t,a)=>{a.r(t),a.d(t,{default:()=>y});var s=a(65043),i=a(67907),r=a(69062),o=a(78374),n=a(72711),l=(a(85800),a(65187)),d=a(70579);function c(e){let{coaManagementFinishedProduct:t,listOptions:a,pageSize:s}=e;return(0,d.jsx)(i.TranslationConsumer,{children:e=>(0,d.jsxs)("div",{className:"detailsContainer",children:[(0,d.jsxs)("div",{className:"row",children:[(0,d.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,d.jsx)(n.Input,{fluid:!0,value:t.COACode,label:e("COAManagementFinishedProductCode"),indicator:"required",disabled:!0,reserveSpace:!1})}),(0,d.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,d.jsx)(n.Input,{fluid:!0,value:t.FinishedProductCode,label:e("COAManagementFinishedProductFinishedProductCode"),disabled:!0,reserveSpace:!1})}),(0,d.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,d.jsx)(n.Input,{fluid:!0,value:t.FinishedProductName,label:e("COAManagementFinishedProductFinishedProductName"),disabled:!0,reserveSpace:!1})}),(0,d.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,d.jsx)(n.Input,{fluid:!0,value:t.LOTNumber,label:e("COAManagementFinishedProductLOTNumber"),disabled:!0,reserveSpace:!1})})]}),(0,d.jsxs)("div",{className:"row",children:[(0,d.jsxs)("div",{className:"col-12 col-md-12 col-lg-12",children:[(0,d.jsx)("h4",{children:e("COAManagementFinishedProduct_Configuration")}),(0,d.jsx)("div",{className:"detailsTable",children:(0,d.jsxs)(o.bQ,{data:a.templateParameters,search:!0,rows:s,searchPlaceholder:e("LoadingDetailsView_SearchGrid"),children:[(0,d.jsx)(o.bQ.Column,{className:"compColHeight",field:"ParameterName",header:e("COAManagementDetail_ParameterName")},"ParameterName"),(0,d.jsx)(o.bQ.Column,{className:"compColHeight",field:"Specification",header:e("COAManagementDetail_Specification")},"Specification"),(0,d.jsx)(o.bQ.Column,{className:"compColHeight",field:"Method",header:e("COAManagementDetail_Method")},"Method"),(0,d.jsx)(o.bQ.Column,{className:"compColHeight",field:"Result",header:e("COAManagementDetail_Result")},"Result"),(0,d.jsx)(o.bQ.Column,{className:"compColHeight",field:"SortIndex",header:e("COAManagementDetail_SortIndex")},"SortIndex"),Array.isArray(a.templateParameters)&&a.templateParameters.length>s?(0,d.jsx)(o.bQ.Pagination,{}):""]})})]}),(0,d.jsx)("div",{})]})]})})}c.defaultProps={templateParameters:[]};var u=a(40854),h=a.n(u),p=a(72067),m=a(97508),g=(a(38726),a(43503)),C=a(93779),v=a(53536),x=a.n(v),f=a(40252),P=a(7523),j=a(73571);class D extends s.Component{constructor(){super(...arguments),this.state={coaManagementFinishedProduct:{},isReadyToRender:!1,templateParameters:[],showReport:!1},this.handleModalBack=()=>{this.setState({showReport:!1})},this.handleViewFinishedProductCOAReport=()=>{void 0===this.reportServiceURI?h()(p.yTV,r.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{e.data.IsSuccess&&(this.reportServiceURI=e.data.EntityResult,this.setState({showReport:!0}))})):this.setState({showReport:!0})}}componentWillReceiveProps(e){try{""!==this.state.coaManagementFinishedProduct.COACode&&void 0===e.selectedRow.COACode&&this.props.tokenDetails.tokenInfo===e.tokenDetails.tokenInfo&&this.getCOAManagementFinishedProduct(e.selectedRow)}catch(t){console.log("COAManagementFinishedProductDetailsComposite:Error occured on componentWillReceiveProps",t)}}componentDidMount(){try{r.pJ(this.props.userDetails.EntityResult.IsArchived),this.getCOAManagementFinishedProduct(this.props.selectedRow)}catch(e){console.log("COAManagementFinishedProductDetailsComposite:Error occured on componentDidMount",e)}}getCOAManagementFinishedProduct(e){var t=[{key:C.dL,value:e.COACode}],a={ShareHolderCode:this.props.selectedShareholder,keyDataCode:C.dL,KeyCodes:t};h()(p.Owe,r.tW(a,this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){let e=t.EntityResult.COAManagementDetailsList;var a=[];Array.isArray(e)&&e.forEach((e=>{var t={ParameterName:void 0===e.ParameterName?e.AnalysisParameterName:e.ParameterName,Specification:e.Specification,Method:e.Method,SortIndex:e.SortIndex,Result:e.Result};a.push(t)})),this.setState({isReadyToRender:!0,coaManagementFinishedProduct:x().cloneDeep(t.EntityResult),templateParameters:a})}else this.setState({coaManagementFinishedProduct:{},isReadyToRender:!0},(()=>{})),console.log("Error in getCOAManagementFinishedProduct:",t.ErrorList)})).catch((t=>{console.log("Error while getting coaManagementFinishedProduct:",t,e)}))}renderModal(){let e=null;e=this.props.userDetails.EntityResult.IsArchived?"TM/"+P.mD+"/FinishedProductCOAReport":"TM/"+P.PZ+"/FinishedProductCOAReport";let t={Culture:this.props.userDetails.EntityResult.UICulture,COACode:this.state.coaManagementFinishedProduct.COACode};return(0,d.jsx)(j.A,{showReport:this.state.showReport,handleBack:this.handleModalBack,handleModalClose:this.handleModalBack,proxyServerHost:p._Oi,reportServiceHost:this.reportServiceURI,filePath:e,parameters:t})}render(){const e={templateParameters:this.state.templateParameters},t=[{fieldName:"COAManagementFinishedProduct_LastUpDt",fieldValue:new Date(this.state.coaManagementFinishedProduct.LastUpdatedTime).toLocaleDateString()+" "+new Date(this.state.coaManagementFinishedProduct.LastUpdatedTime).toLocaleTimeString()},{fieldName:"COAManagementFinishedProduct_LastUpdatedBy",fieldValue:this.state.coaManagementFinishedProduct.LastUpdatedBy}];return this.state.isReadyToRender?(0,d.jsxs)("div",{children:[(0,d.jsx)(l.A,{children:(0,d.jsx)(g.A,{entityCode:this.state.coaManagementFinishedProduct.COACode,newEntityName:"COAManagementFinishedProduct_Title",popUpContents:t})}),(0,d.jsx)(l.A,{children:(0,d.jsx)(c,{coaManagementFinishedProduct:this.state.coaManagementFinishedProduct,genericProps:this.props.genericProps,listOptions:e,isEnterpriseNode:this.props.userDetails.EntityResult.IsEnterpriseNode,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize})}),(0,d.jsx)(l.A,{children:(0,d.jsx)(i.TranslationConsumer,{children:e=>(0,d.jsxs)("div",{className:"row userActionPosition",children:[(0,d.jsx)("div",{className:"col col-2",children:(0,d.jsx)(n.Button,{className:"backButton",onClick:this.props.onBack,content:e("Back")})}),(0,d.jsx)("div",{className:"col col-10",style:{textAlign:"right"},children:(0,d.jsx)(n.Button,{content:e("COA_ViewFinishedProductCOAReport"),onClick:()=>this.handleViewFinishedProductCOAReport()})})]})})}),this.renderModal()]}):(0,d.jsx)(f.A,{message:"Loading"})}}const y=(0,m.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(D)},43503:(e,t,a)=>{a.d(t,{A:()=>n});a(65043);var s=a(67907),i=a(72711),r=a(70579);function o(e){let{entityCode:t,newEntityName:a,popUpContents:o}=e;return(0,r.jsx)(s.TranslationConsumer,{children:e=>(0,r.jsx)("div",{className:"headerContainer",children:(0,r.jsxs)("div",{className:"row headerSpacing",children:[(0,r.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,r.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===t||void 0===t?e(a):t})}),""!==t&&void 0!==t&&o.length>0?(0,r.jsx)("div",{className:"headerItemRight",children:(0,r.jsx)(i.Popup,{element:(0,r.jsxs)("div",{children:[e(o[0].fieldName)+" ",":"," "+o[0].fieldValue,(0,r.jsx)(i.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,r.jsx)(i.List,{className:"detailsHeaderPopUp",children:o.map((t=>(0,r.jsxs)(i.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(t.fieldName)+" ",":"," "+t.fieldValue]},"content.fieldName")))})})}):""]})})})}o.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const n=o},85800:(e,t,a)=>{a.d(t,{n:()=>l});a(65043);var s=a(72711),i=a(67907),r=a(7523),o=a(35861),n=a(70579);function l(e){let{selectedAttributeList:t,handleCellDataEdit:a,attributeValidationErrors:l}=e;const d=e=>{if("0000-00-00"===e.DefaultValue)return c(e,new Date),new Date;var t=e.DefaultValue.split("-");return new Date(t[0],t[1]-1,t[2])},c=(e,t)=>{var s=new Date(t);t=s.getFullYear()+"-"+("0"+(s.getMonth()+1)).slice(-2)+"-"+("0"+s.getDate()).slice(-2),a(e,t)};return(0,n.jsx)(i.TranslationConsumer,{children:e=>(0,n.jsx)("div",{className:"row",children:(0,n.jsx)("div",{className:"col-md-12 attributeDetails-wrap",children:(0,n.jsx)("div",{className:"row",children:t.map((t=>t.DataType.toLowerCase()===r.pe.STRING.toLowerCase()&&!0===t.IsVisible?(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(s.Input,{fluid:!0,label:e(t.DisplayName),value:null===t.DefaultValue?"":t.DefaultValue,indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>a(t,e),error:e(l[t.Code]),reserveSpace:!1})}):t.DataType.toLowerCase()!==r.pe.INT.toLowerCase()&&t.DataType.toLowerCase()!==r.pe.LONG.toLowerCase()||!0!==t.IsVisible?t.DataType.toLowerCase()!==r.pe.FLOAT.toLowerCase()&&t.DataType.toLowerCase()!==r.pe.DOUBLE.toLowerCase()||!0!==t.IsVisible?t.DataType.toLowerCase()===r.pe.BOOL.toLowerCase()&&!0===t.IsVisible?(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(s.Checkbox,{className:"deviceCheckBox customDeviceCheckBox",label:e(t.DisplayName),checked:null===t.DefaultValue?"":"true"===t.DefaultValue.toString().toLowerCase(),disabled:!0===t.IsReadonly,onChange:e=>a(t,e)})}):t.DataType.toLowerCase()===r.pe.DATETIME.toLowerCase()&&!0===t.IsVisible?(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(s.DatePicker,{fluid:!0,value:null===t.DefaultValue||""===t.DefaultValue?"":d(t),label:e(t.DisplayName),displayFormat:(0,o.F1)(),showYearSelector:"true",indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>c(t,e),onTextChange:e=>{c(t,e)},error:e(l[t.Code]),reserveSpace:!1})}):null:(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(s.Input,{fluid:!0,label:e(t.DisplayName),value:null===t.DefaultValue||""===t.DefaultValue?"":t.DefaultValue.toLocaleString(),indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>a(t,e),error:e(l[t.Code]),reserveSpace:!1})}):(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(s.Input,{fluid:!0,label:e(t.DisplayName),value:null===t.DefaultValue?"":t.DefaultValue,indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>a(t,e),error:e(l[t.Code]),reserveSpace:!1})})))})})})})}},73571:(e,t,a)=>{a.d(t,{A:()=>p});a(65043);var s=a(72711),i=a(728),r=a(92569),o=a(47766),n=(a(60663),a(7523)),l=a(97508),d=a(70579);function c(e){let{proxyServerHost:t,reportServiceHost:a,parameters:s,filePath:i,...n}=e;const l=t+"api/report",c=(e,t)=>{const a=t.settings.beforeSend;t.settings.beforeSend=function(t){a&&a(t),n.userDetails.EntityResult.IsWebPortalUser||(t.withCredentials=!0),t.URL_DEBUG.indexOf("parameters")>-1&&(t.onreadystatechange=function(){if(4===this.readyState&&200===this.status){var t=e.hostElement;setTimeout((()=>{var e=t.querySelector(".wj-viewer-splitter"),a=t.querySelector(".wj-viewer-tabsleft").querySelectorAll("li")[2];a.disabled||(a.className="hidden",e.click())}),1e3)}})}};let u={Authorization:"Bearer "+n.tokenDetails.tokenInfo};const h=(e,s)=>{o._ReportService.prototype.load=function(e){var s=this,i=new o._Promise;return this._checkReportController(i)?(this.httpRequest(this._getReportInstancesUrl(),{method:"POST",data:e}).then((function(e){var r=o._parseReportExecutionInfo(e.responseText);s._instanceId=r.id,s._status=o._ExecutionStatus.loaded,s._outlinesLocation=r.outlinesLocation,s._statusLocation=r.statusLocation.replace(a,t),s._pageSettingsLocation=r.pageSettingsLocation,s._featuresLocation=r.featuresLocation,s._parametersLocation=r.parametersLocation,i.resolve(r)}),(function(e){i.reject(s._getError(e))})),i):i}};return(0,d.jsx)("div",{children:n.userDetails.EntityResult.IsWebPortalUser?(0,d.jsx)("div",{children:(0,d.jsx)(r.R,{requestHeaders:u,style:{height:"80vh"},parameters:s,serviceUrl:l,filePath:i,initialized:h,beforeSendRequest:c})}):(0,d.jsx)("div",{children:(0,d.jsx)(r.R,{style:{height:"80vh"},parameters:s,serviceUrl:l,filePath:i,initialized:h,beforeSendRequest:c})})})}c.defaultProps={parameters:{}},i.setLicenseKey(n.yQ);const u=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(c);var h=a(67907);function p(e){let{proxyServerHost:t,reportServiceHost:a,filePath:i,handleBack:r,showReport:o,handleModalClose:n,parameters:l}=e;const[c]=(0,h.useTranslation)();return(0,d.jsx)(s.Modal,{style:{padding:"0px"},size:"fullscreen",open:o,children:(0,d.jsxs)("div",{children:[(0,d.jsx)(s.Header,{title:c("Header_TerminalManager"),menu:!1}),(0,d.jsx)(u,{proxyServerHost:t,reportServiceHost:a,filePath:i,parameters:l}),(0,d.jsx)("div",{style:{marginTop:"10px",marginLeft:"20px"},children:(0,d.jsx)(s.Button,{className:"backButton",onClick:r,content:c("Report_Back")})})]})})}p.defaultProps={parameters:{}}},35861:(e,t,a)=>{a.d(t,{F1:()=>n,i7:()=>l,r4:()=>o});var s=a(86178),i=a.n(s),r=(a(15660),a(65043),a(70579));function o(e,t){if(Array.isArray(e)){0===e.filter((e=>e.text===t)).length&&e.unshift({value:null,text:t})}return e}function n(){let e=window.navigator.userLanguage||window.navigator.language;return i().locale(e),i().localeData().longDateFormat("L")}function l(e){return(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=5050.24d4646d.chunk.js.map