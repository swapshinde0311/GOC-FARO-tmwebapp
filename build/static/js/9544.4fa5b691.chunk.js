"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[9544,5841,8222],{66554:(e,t,s)=>{s.d(t,{$:()=>d});var a=s(65043),i=s(72711),o=s(67907),r=s(65187),n=s(69062),l=s(70579);function c(e){let{operationsVisibilty:t,breadcrumbItem:s,shareholders:c,selectedShareholder:d,onShareholderChange:h,onDelete:m,onAdd:u,popUpContent:p,shrVisible:g,handleBreadCrumbClick:C,addVisible:f,deleteVisible:y}=e;const[P,x]=(0,a.useState)(!1),[v,j]=(0,a.useState)(!1);function S(){t.add&&(p.length>0?j(!1===v):u())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(r.A,{children:[" ",(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsxs)(i.Breadcrumb,{children:[s.parents.map((t=>(0,l.jsx)(i.Breadcrumb.Item,{onClick:()=>{void 0!==C&&null!==C&&C(t.itemCode,s.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(i.Breadcrumb.Item,{children:e(s.localizedKey)},s.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===g?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(i.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!t.shareholder,options:n.Zj(c),onChange:e=>h(e)})})]})})})}),(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsxs)(i.Modal,{open:P,size:"small",children:[(0,l.jsx)(i.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(i.Modal.Footer,{children:[(0,l.jsx)(i.Button,{type:"secondary",content:e("Cancel"),onClick:()=>x(!1)}),(0,l.jsx)(i.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{x(!1),m()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[f?(0,l.jsx)(i.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:S,children:(0,l.jsx)(i.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:v,children:(0,l.jsx)("div",{onMouseLeave:()=>j(!1),children:(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsx)(i.VerticalMenu,{children:(0,l.jsxs)(i.VerticalMenu,{children:[(0,l.jsx)(i.VerticalMenu.Header,{children:e("Common_Create")}),p.map((t=>(0,l.jsx)(i.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,j(!1),void u(e);var e},children:e(t.fieldValue)})))]})})})})}):"",y?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&x(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(i.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};s(38726);function d(e){let{operationsVisibilty:t,breadcrumbItem:s,shareholders:a,selectedShareholder:i,onShareholderChange:o,onDelete:r,onAdd:n,popUpContent:d,shrVisible:h,handleBreadCrumbClick:m,addVisible:u,deleteVisible:p}=e;return(0,l.jsx)(c,{operationsVisibilty:t,breadcrumbItem:s,shareholders:a,selectedShareholder:i,onShareholderChange:o,onDelete:r,onAdd:n,popUpContent:d,shrVisible:h,handleBreadCrumbClick:m,addVisible:u,deleteVisible:p})}},59544:(e,t,s)=>{s.r(t),s.d(t,{default:()=>b});var a=s(65043),i=s(65187),o=s(66554),r=s(14159),n=s(72067),l=s(69062),c=s(11981),d=s(40854),h=s.n(d),m=s(97508),u=s(43503),p=s(72711),g=s(67907),C=s(70579);const f=e=>{const t=(t,a)=>{if("string"===a.DataType||"int"===a.DataType||"decimal"===a.DataType)return(0,C.jsx)(p.Tooltip,{element:(0,C.jsx)(p.Input,{fluid:!0,indicator:"required",disabled:!1,label:t(a.Name+"_label"),onChange:t=>e.onChange(a.Name,t),reserveSpace:!1,error:t(e.validationErrors[a.Name]),value:a.Value}),hoverable:!0,event:"hover",content:t(a.Name+"_tooltip")});if("multiselect"===a.DataType){let i=s(a),o=Array.isArray(a.Value)?a.Value:""===a.Value?[]:a.Value.split(",");return(0,C.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,C.jsx)("div",{style:{width:"80%"},children:(0,C.jsx)(p.Tooltip,{element:(0,C.jsx)(p.Select,{fluid:!0,indicator:"required",multiple:!0,options:i,disabled:!1,placeholder:t("Select"),label:t(a.Name+"_label"),onChange:t=>e.onChange(a.Name,t.join()),reserveSpace:!1,error:t(e.validationErrors[a.Name]),search:!1,value:o}),content:t(a.Name+"_tooltip"),hoverable:!0,event:"hover"})}),(0,C.jsx)("div",{className:"ddlSelectAll",children:(0,C.jsx)(p.Tooltip,{element:(0,C.jsx)(p.Checkbox,{label:t("Common_All"),checked:o.length===i.length,onChange:t=>e.onCheckAllChange(t,a.Name)}),content:t(a.Name+"_checkAll_tooltip"),event:"hover",hoverable:!0})})]})}if("select"===a.DataType){let i=s(a);return(0,C.jsx)(p.Tooltip,{element:(0,C.jsx)(p.Select,{fluid:!0,indicator:"required",multiple:!1,disabled:!1,options:i,placeholder:t("Select"),label:t(a.Name+"_label"),onChange:t=>e.onChange(a.Name,t),reserveSpace:!1,error:t(e.validationErrors[a.Name]),search:!1,value:""===a.Value?null:a.Value}),hoverable:!0,event:"hover",content:t(a.Name+"_tooltip")})}},s=t=>{let s=[];return Object.keys(e.controlParameters).includes(t.Name)&&Array.isArray(e.controlParameters[t.Name])&&e.controlParameters[t.Name].forEach((e=>{s.push({text:e,value:e})})),s};return(0,C.jsx)(i.A,{children:(0,C.jsx)("div",{className:"detailsContainer",children:(0,C.jsx)(g.TranslationConsumer,{children:s=>(0,C.jsx)("div",{className:"row mt-3",children:e.modProductForecastConfiguration.ProductForecastParams.map((e=>(0,C.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:t(s,e)})))})})})})};var y=s(44192),P=s(40252),x=s(80312);class v extends a.Component{constructor(){super(...arguments),this.state={terminalCode:null,productForecastConfig:{},modProductForecastConfig:{},isNew:!1,validationErrors:l.Th(y.ev),controlParameters:{},isReadyToRender:!1,saveEnabled:!1},this.populateDefaultValuesForCreate=e=>{try{return Array.isArray(e)?e.map((e=>({...e,Value:""===e.Value?e.DefaultValue:e.Value}))):e}catch(t){return console.log("Error in populateDefaultValuesForCreate(): ",t),e}},this.getProductForecastConfiguration=()=>{try{let e={messageType:"critical",message:"ProductForecastConfigurationsEmpty",messageResultDetails:[]};h()(n.Bx9+"?TerminalCode="+this.state.terminalCode+"&GetIfEmpty=true",l.Jm(this.props.tokenDetails.tokenInfo)).then((t=>{let s=t.data;if(s.IsSuccess){let t=!1;Array.isArray(s.EntityResult.ProductForecastParams)&&s.EntityResult.ProductForecastParams.length>0&&""===s.EntityResult.ProductForecastParams[0].Value&&(t=!0,e={messageType:"critical",message:"ProductForecastConfiguration_New",messageResultDetails:[]},(0,r.toast)((0,C.jsx)(i.A,{children:(0,C.jsx)(c.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4})),this.setState({productForecastConfig:{...s.EntityResult},modProductForecastConfig:{...s.EntityResult,ProductForecastParams:this.populateDefaultValuesForCreate(s.EntityResult.ProductForecastParams)},isNew:t,saveEnabled:l.ab(this.props.userDetails.EntityResult.FunctionsList,t?x.i.add:x.i.modify,x.to)},(()=>{this.getControlParameters(),this.setState({isReadyToRender:!0})}))}else(0,r.toast)((0,C.jsx)(i.A,{children:(0,C.jsx)(c.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4}),console.log("Error while getting getProductForecastConfigurations:",s),this.setState({isReadyToRender:!0})})).catch((e=>{console.log(e),this.setState({isReadyToRender:!0})}))}catch(e){console.log("Error in getProductForecastConfiguration(): ",e),this.setState({isReadyToRender:!0})}},this.getControlParameters=()=>{try{this.state.productForecastConfig.ProductForecastParams.forEach((e=>{e.API&&h()(n._Oi+e.API,l.Jm(this.props.tokenDetails.tokenInfo)).then((t=>{if(t.data.IsSuccess){let s=t.data.EntityResult;this.setState({controlParameters:{...this.state.controlParameters,[e.Name]:s}})}else this.setState({controlParameters:{...this.state.controlParameters,[e.Name]:null}})})).catch((t=>{console.log("Error in fetching control parameters for ProductForecastConfiguration",t),this.setState({controlParameters:{...this.state.controlParameters,[e.Name]:null}})}))}))}catch(e){console.log("Error in getControlParameters(): ",e)}},this.handleChange=(e,t)=>{try{const s={...this.state.modProductForecastConfig,ProductForecastParams:this.state.modProductForecastConfig.ProductForecastParams.map((s=>s.Name===e?{...s,Value:t}:s))};this.setState({modProductForecastConfig:s},(()=>{if(Object.keys(this.state.validationErrors).includes(e)){let s=l.jr(y.ev[e],t);this.setState({validationErrors:{...this.state.validationErrors,[e]:s}})}}))}catch(s){console.log("Error updating values: "+s)}},this.validate=()=>{const e={},t=Object.keys(y.ev);return this.state.modProductForecastConfig.ProductForecastParams.forEach((s=>{t.includes(s.Name)&&(e[s.Name]=l.jr(y.ev[s.Name],s.Value))})),this.setState({validationErrors:e}),!Object.values(e).filter((e=>""!==e)).length>0},this.handleSave=()=>{try{this.validate()&&this.setState({saveEnabled:!1},(()=>{const e={Entity:{...this.state.modProductForecastConfig}};this.state.isNew?this.createConfiguration(e):this.updateConfiguration(e)}))}catch(e){console.log("Error saving product forecast configuration: ",e)}},this.createConfiguration=e=>{let t={messageType:"critical",message:"ProductForecastConfiguration_SavedStatus",messageResultDetails:[{keyFields:["TerminalCode"],keyValues:[this.state.terminalCode],isSuccess:!1,errorMessage:""}]};h()(n.lEy,l.tW(e,this.props.tokenDetails.tokenInfo)).then((e=>{let s=e.data;t.messageType=s.IsSuccess?"success":"critical",t.messageResultDetails[0].isSuccess=s.IsSuccess,s.IsSuccess?this.getProductForecastConfiguration():(t.messageResultDetails[0].errorMessage=s.ErrorList[0],this.setState({saveEnabled:l.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.add,x.to)})),this.props.onNotice(t)})).catch((e=>{this.setState({saveEnabled:l.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.add,x.to)}),t.messageResultDetails[0].errorMessage=e,console.log("Error creating product forecast configuration: ",e),this.props.onNotice(t)}))},this.updateConfiguration=e=>{let t={messageType:"critical",message:"ProductForecastConfiguration_SavedStatus",messageResultDetails:[{keyFields:["TerminalCode"],keyValues:[this.state.terminalCode],isSuccess:!1,errorMessage:""}]};h()(n.kXt,l.tW(e,this.props.tokenDetails.tokenInfo)).then((e=>{let s=e.data;t.messageType=s.IsSuccess?"success":"critical",t.messageResultDetails[0].isSuccess=s.IsSuccess,s.IsSuccess?this.getProductForecastConfiguration():(t.messageResultDetails[0].errorMessage=s.ErrorList[0],this.setState({saveEnabled:l.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.modify,x.to)})),this.props.onNotice(t)})).catch((e=>{this.setState({saveEnabled:l.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.modify,x.to)}),t.messageResultDetails[0].errorMessage=e,console.log("Error updating product forecast configuration: ",e),this.props.onNotice(t)}))},this.handleMultiSelectCheckAll=(e,t)=>{try{let s={};if(e){if(Object.keys(this.state.controlParameters).includes(t)&&Array.isArray(this.state.controlParameters[t])){let e=this.state.controlParameters[t].join();s={...this.state.modProductForecastConfig,ProductForecastParams:this.state.modProductForecastConfig.ProductForecastParams.map((s=>s.Name===t?{...s,Value:e}:s))}}}else s={...this.state.modProductForecastConfig,ProductForecastParams:this.state.modProductForecastConfig.ProductForecastParams.map((e=>e.Name===t?{...e,Value:""}:e))};this.setState({modProductForecastConfig:s})}catch(s){console.log("Error in handleMultiSelectCheckAll(): ",s)}}}componentDidMount(){this.getTerminals().then((e=>{this.setState({terminalCode:e},(()=>{""!==e&&this.getProductForecastConfiguration()}))})).catch((e=>console.log(e)))}async getTerminals(){let e={messageType:"critical",message:"TerminalList_NotAvailable",messageResultDetails:[]};return await h()(n.fnw,l.Jm(this.props.tokenDetails.tokenInfo)).then((t=>{var s=t.data;return!0===s.IsSuccess&&Array.isArray(s.EntityResult)&&s.EntityResult.length>0?s.EntityResult[0].Key.Code:(console.log("Error while getting Terminal List:",s),(0,r.toast)((0,C.jsx)(i.A,{children:(0,C.jsx)(c.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4}),"")})).catch((t=>((0,r.toast)((0,C.jsx)(i.A,{children:(0,C.jsx)(c.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4}),console.log("Error while getting Terminal List:",t),"")))}render(){return(0,C.jsx)(i.A,{children:this.state.isReadyToRender?(0,C.jsxs)("div",{children:[(0,C.jsx)(i.A,{children:(0,C.jsx)(u.A,{newEntityName:"ProductForecastConfiguration_pgTitle"})}),(0,C.jsx)(g.TranslationConsumer,{children:e=>Array.isArray(this.state.modProductForecastConfig.ProductForecastParams)&&this.state.modProductForecastConfig.ProductForecastParams?(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(f,{modProductForecastConfiguration:this.state.modProductForecastConfig,controlParameters:this.state.controlParameters,onChange:this.handleChange,validationErrors:this.state.validationErrors,onCheckAllChange:this.handleMultiSelectCheckAll}),(0,C.jsx)("div",{className:"row mt-3",children:(0,C.jsx)("div",{className:"col col-12",style:{textAlign:"right"},children:(0,C.jsx)(p.Button,{content:e("Save"),disabled:!this.state.saveEnabled,onClick:()=>this.handleSave()})})})]}):(0,C.jsx)("h5",{children:e("ProductForecastConfiguration_Parameters_Unavailable")})})]}):(0,C.jsx)(P.A,{message:"Loading"})})}}const j=(0,m.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(v);s(92342),s(63973);class S extends a.Component{constructor(){super(...arguments),this.state={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},isReadyToRender:!1},this.componentDidMount=()=>{this.setState({isReadyToRender:!0})},this.notifyEvent=e=>{try{(0,r.toast)((0,C.jsx)(i.A,{children:(0,C.jsx)(c.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4})}catch(t){console.log("ProductForecastConfigurationComposite: Error occurred on savedEvent",t)}}}render(){return(0,C.jsxs)("div",{children:[(0,C.jsx)(i.A,{children:(0,C.jsx)(o.$,{operationsVisibility:this.state.operationsVisibility,breadcrumbItem:this.props.activeItem,handleBreadCrumbClick:this.props.handleBreadCrumbClick,addVisible:!1,deleteVisible:!1,shrVisible:!1})}),this.state.isReadyToRender?(0,C.jsx)(i.A,{children:(0,C.jsx)(j,{onNotice:this.notifyEvent,genericProps:this.props.activeItem.itemProps})}):(0,C.jsx)(P.A,{message:"Loading"}),(0,C.jsx)(i.A,{children:(0,C.jsx)(r.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})}}const b=S},43503:(e,t,s)=>{s.d(t,{A:()=>n});s(65043);var a=s(67907),i=s(72711),o=s(70579);function r(e){let{entityCode:t,newEntityName:s,popUpContents:r}=e;return(0,o.jsx)(a.TranslationConsumer,{children:e=>(0,o.jsx)("div",{className:"headerContainer",children:(0,o.jsxs)("div",{className:"row headerSpacing",children:[(0,o.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,o.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===t||void 0===t?e(s):t})}),""!==t&&void 0!==t&&r.length>0?(0,o.jsx)("div",{className:"headerItemRight",children:(0,o.jsx)(i.Popup,{element:(0,o.jsxs)("div",{children:[e(r[0].fieldName)+" ",":"," "+r[0].fieldValue,(0,o.jsx)(i.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,o.jsx)(i.List,{className:"detailsHeaderPopUp",children:r.map((t=>(0,o.jsxs)(i.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(t.fieldName)+" ",":"," "+t.fieldValue]},"content.fieldName")))})})}):""]})})})}r.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const n=r},80312:(e,t,s)=>{s.d(t,{$3:()=>J,$H:()=>ae,$J:()=>ue,$K:()=>ge,$V:()=>Nt,$b:()=>xt,$p:()=>_,AE:()=>b,Al:()=>B,B2:()=>at,By:()=>bt,CW:()=>gt,DA:()=>l,Ee:()=>Ue,FO:()=>D,Fy:()=>Me,G9:()=>st,H8:()=>ee,Hq:()=>nt,Ig:()=>I,Iu:()=>f,JI:()=>ct,JJ:()=>te,JU:()=>$,Jz:()=>$e,KQ:()=>re,Kk:()=>Ze,Kw:()=>et,LP:()=>Ft,LR:()=>d,Lg:()=>Q,Mg:()=>xe,Mm:()=>M,N1:()=>Y,Nm:()=>p,No:()=>ce,Ow:()=>H,P2:()=>o,P8:()=>ye,PD:()=>Te,PE:()=>h,PG:()=>q,PP:()=>ut,Pb:()=>ke,QB:()=>v,QC:()=>Z,RE:()=>ot,RO:()=>Qe,Rc:()=>ft,Rl:()=>vt,Rx:()=>Ct,TI:()=>y,Tm:()=>pe,Ug:()=>X,Ur:()=>ze,V9:()=>c,VK:()=>z,VL:()=>me,VQ:()=>ne,WD:()=>we,Wf:()=>N,YO:()=>V,YY:()=>De,Yb:()=>Ce,Yg:()=>Je,Z9:()=>mt,ZE:()=>dt,ZU:()=>x,_N:()=>yt,_S:()=>At,_d:()=>Dt,aS:()=>U,aZ:()=>ht,au:()=>Se,b0:()=>Et,bL:()=>Be,c2:()=>Oe,d4:()=>Ie,dB:()=>C,dD:()=>_e,dK:()=>K,dY:()=>T,de:()=>m,dv:()=>Ae,eQ:()=>n,f3:()=>ve,fF:()=>w,fL:()=>Pt,fN:()=>St,fk:()=>A,fl:()=>fe,fr:()=>j,go:()=>i,h:()=>he,hD:()=>E,hE:()=>F,hh:()=>Xe,hk:()=>oe,hz:()=>pt,i:()=>a,j2:()=>rt,jN:()=>W,je:()=>g,jx:()=>O,kL:()=>Ye,ke:()=>He,km:()=>le,l0:()=>ie,l6:()=>Ke,lz:()=>k,m0:()=>P,nS:()=>Re,nk:()=>lt,nn:()=>S,np:()=>G,oh:()=>it,op:()=>qe,pt:()=>Le,qk:()=>de,qp:()=>Pe,r6:()=>Ee,rQ:()=>Ne,rj:()=>L,rp:()=>r,t3:()=>jt,tM:()=>Ve,to:()=>Vt,ts:()=>tt,uH:()=>je,uy:()=>Ge,w1:()=>Fe,x5:()=>se,xz:()=>R,y_:()=>We,yu:()=>u,yx:()=>Rt,z8:()=>be,z_:()=>Tt});const a={view:"view",add:"add",modify:"modify",remove:"remove"},i="carriercompany",o="driver",r="customer",n="trailer",l="originterminal",c="destination",d="primemover",h="vehicle",m="shipmentbycompartment",u="shipmentbyproduct",p="ViewShipmentStatus",g="vessel",C="order",f="OrderForceClose",y="contract",P="receiptplanbycompartment",x="ViewMarineShipment",v="MarineShipmentByCompartment",j="ViewMarineReceipt",S="supplier",b="finishedproduct",R="RailDispatch",E="RailReceipt",N="RailRoute",A="RailWagon",F="CloseRailDispatch",D="PrintRailBOL",T="PrintRailFAN",V="RailDispatchLoadSpotAssignment",k="RailDispatchProductAssignment",I="ViewRailDispatch",M="ViewRailLoadingDetails",w="CloseRailReceipt",L="PrintRailBOD",O="PrintRailRAN",B="ViewRailReceipt",_="ViewRailUnLoadingDetails",U="SMS",H="UnAccountedTransactionTank",z="UnAccountedTransactionMeter",K="PipelineDispatch",J="PipelineReceipt",W="PipelineDispatchManualEntry",$="PipelineReceiptManualEntry",q="LookUpData",G="HSEInspection",Q="HSEInspectionConfig",Y="Email",Z="Shareholder",X="LocationConfig",ee="DeviceConfig",te="baseproduct",se="SiteView",ae="LeakageManualEntry",ie="Terminal",oe="SlotInformation",re="TankGroup",ne="Tank",le="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",he="AccessCard",me="ResetPin",ue="SlotConfiguration",pe="PrintMarineFAN",ge="PrintMarineBOL",Ce="ViewMarineLoadingDetails",fe="ViewMarineShipmentAuditTrail",ye="CloseMarineShipment",Pe="IssueCard",xe="ActivateCard",ve="RevokeCard",je="AutoIDAssociation",Se="MarineReceiptByCompartment",be="PrintMarineRAN",Re="PrintMarineBOD",Ee="ViewMarineUnloadingDetails",Ne="ViewMarineReceiptAuditTrail",Ae="CloseMarineReceipt",Fe="WeekendConfig",De="EODAdmin",Te="PrintBOL",Ve="PrintFAN",ke="PrintBOD",Ie="CloseShipment",Me="CloseReceipt",we="CONTRACTFORCECLOSE",Le="Captain",Oe="OverrideShipmentSequence",Be="KPIInformation",_e="Language",Ue="WebPortalUserMap",He="BayGroup",ze="PipelineHeaderSiteView",Ke="TankMonitor",Je="PersonAdmin",We="ProductReconciliationReports",$e="ReportConfiguration",qe="EXECONFIGURATION",Ge="ShareholderAllocation",Qe="NotificationGroup",Ye="NotificationRestriction",Ze="NotificationConfig",Xe="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",st="ShareholderAgreement",at="TANKSHAREHOLDERPRIMEFUNCTION",it="ROLEADMIN",ot="ShiftConfig",rt="PrinterConfiguration",nt="CustomerAgreement",lt="BaySCADAConfiguration",ct="RailReceiptUnloadSpotAssignment",dt="STAFF_VISITOR",ht="PipelineMeterSiteView",mt="RailSiteView",ut="MarineSiteView",pt="LoadingDetails",gt="UnloadingDetails",Ct="RoadHSEInspection",ft="RoadHSEInspectionConfig",yt="MarineHSEInspection",Pt="MarineHSEInspectionConfig",xt="RailHSEInspection",vt="RailHSEInspectionConfig",jt="PipelineHSEInspection",St="PipelineHSEInspectionConfig",bt="PrintRAN",Rt="ViewReceiptStatus",Et="customerrecipe",Nt="COAParameter",At="COATemplate",Ft="COAManagement",Dt="COACustomer",Tt="COAAssignment",Vt="ProductForecastConfiguration"},92342:()=>{}}]);
//# sourceMappingURL=9544.4fa5b691.chunk.js.map