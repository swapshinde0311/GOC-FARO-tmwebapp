"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[3775,5841,8222],{66554:(e,t,i)=>{i.d(t,{$:()=>c});var n=i(65043),r=i(72711),o=i(67907),s=i(65187),a=i(69062),l=i(70579);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:d,selectedShareholder:c,onShareholderChange:p,onDelete:h,onAdd:m,popUpContent:u,shrVisible:C,handleBreadCrumbClick:f,addVisible:g,deleteVisible:y}=e;const[_,v]=(0,n.useState)(!1),[b,S]=(0,n.useState)(!1);function x(){t.add&&(u.length>0?S(!1===b):m())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(s.A,{children:[" ",(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsxs)(r.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(r.Breadcrumb.Item,{onClick:()=>{void 0!==f&&null!==f&&f(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(r.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===C?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(r.Select,{placeholder:e("Common_Shareholder"),value:c,disabled:!t.shareholder,options:a.Zj(d),onChange:e=>p(e)})})]})})})}),(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsxs)(r.Modal,{open:_,size:"small",children:[(0,l.jsx)(r.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(r.Modal.Footer,{children:[(0,l.jsx)(r.Button,{type:"secondary",content:e("Cancel"),onClick:()=>v(!1)}),(0,l.jsx)(r.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{v(!1),h()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[g?(0,l.jsx)(r.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:x,children:(0,l.jsx)(r.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:b,children:(0,l.jsx)("div",{onMouseLeave:()=>S(!1),children:(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsx)(r.VerticalMenu,{children:(0,l.jsxs)(r.VerticalMenu,{children:[(0,l.jsx)(r.VerticalMenu.Header,{children:e("Common_Create")}),u.map((t=>(0,l.jsx)(r.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,S(!1),void m(e);var e},children:e(t.fieldValue)})))]})})})})}):"",y?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&v(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(r.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}d.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:n,selectedShareholder:r,onShareholderChange:o,onDelete:s,onAdd:a,popUpContent:c,shrVisible:p,handleBreadCrumbClick:h,addVisible:m,deleteVisible:u}=e;return(0,l.jsx)(d,{operationsVisibilty:t,breadcrumbItem:i,shareholders:n,selectedShareholder:r,onShareholderChange:o,onDelete:s,onAdd:a,popUpContent:c,shrVisible:p,handleBreadCrumbClick:h,addVisible:m,deleteVisible:u})}},97358:(e,t,i)=>{i.r(t),i.d(t,{default:()=>g});var n=i(65043),r=i(97508),o=i(65187),s=i(66554),a=i(67907),l=i(70579);function d(e){let{statesCount:t}=e;return(0,l.jsx)(a.TranslationConsumer,{children:e=>(0,l.jsx)("div",{children:(0,l.jsxs)("div",{className:"row",children:[(0,l.jsx)("div",{className:"col-12 col-md-6 col-xl-2",children:(0,l.jsx)("div",{className:"background",children:(0,l.jsxs)("div",{className:"tile",style:{borderLeftColor:"green"},children:[(0,l.jsx)("div",{className:"tileValue",children:(0,l.jsx)("span",{style:{color:"green"},children:t.AS})}),(0,l.jsx)("div",{className:"tileName",children:e("Active")+"   "+e("Shipment")})]})})}),(0,l.jsx)("div",{className:"col-12 col-md-6 col-xl-2",children:(0,l.jsx)("div",{className:"background",children:(0,l.jsxs)("div",{className:"tile",style:{borderLeftColor:"green"},children:[(0,l.jsx)("div",{className:"tileValue",children:(0,l.jsx)("span",{style:{color:"green"},children:t.PS})}),(0,l.jsx)("div",{className:"tileName",children:e("Pending")+"   "+e("Shipment")})]})})}),(0,l.jsx)("div",{className:"col-12 col-md-6 col-xl-2",children:(0,l.jsx)("div",{className:"background",children:(0,l.jsxs)("div",{className:"tile",style:{borderLeftColor:"green"},children:[(0,l.jsx)("div",{className:"tileValue",children:(0,l.jsx)("span",{style:{color:"green"},children:t.IS})}),(0,l.jsx)("div",{className:"tileName",children:e("Interrupted")+"   "+e("Shipment")})]})})}),(0,l.jsx)("div",{className:"col-12 col-md-6 col-xl-2",children:(0,l.jsx)("div",{className:"background",children:(0,l.jsxs)("div",{className:"tile",style:{borderLeftColor:"green"},children:[(0,l.jsx)("div",{className:"tileValue",children:(0,l.jsx)("span",{style:{color:"green"},children:t.AR})}),(0,l.jsx)("div",{className:"tileName",children:e("Active")+"   "+e("Receipt")})]})})}),(0,l.jsx)("div",{className:"col-12 col-md-6 col-xl-2",children:(0,l.jsx)("div",{className:"background",children:(0,l.jsxs)("div",{className:"tile",style:{borderLeftColor:"green"},children:[(0,l.jsx)("div",{className:"tileValue",children:(0,l.jsx)("span",{style:{color:"green"},children:t.PR})}),(0,l.jsx)("div",{className:"tileName",children:e("Pending")+"   "+e("Receipt")})]})})}),(0,l.jsx)("div",{className:"col-12 col-md-6 col-xl-2",children:(0,l.jsx)("div",{className:"background",children:(0,l.jsxs)("div",{className:"tile",style:{borderLeftColor:"green"},children:[(0,l.jsx)("div",{className:"tileValue",children:(0,l.jsx)("span",{style:{color:"green"},children:t.IR})}),(0,l.jsx)("div",{className:"tileName",children:e("Interrupted")+"   "+e("Receipt")})]})})})]})})})}d.defaultProps={};var c=i(58664),p=i(93779),h=i(72067),m=i(69062),u=i(40854),C=i.n(u);class f extends n.Component{constructor(){super(...arguments),this.state={operationsVisibilty:{},selectedShareholder:"",statesCount:{},DashboardConfig:{RefreshRate:6e4}},this.onDelete=()=>{},this.onShareholderChange=()=>{},this.onAdd=()=>{}}componentDidMount(){this.setState({selectedShareholder:this.props.userDetails.EntityResult.PrimaryShareholder}),this.getDashboardOrderStatesCount()}getDashboardOrderStatesCount(){const{DashboardConfig:e}=this.state,t=[{key:p.v6,value:this.props.activeItem.itemProps.transportationType.toUpperCase()}],i={ShareHolderCode:this.props.userDetails.EntityResult.PrimaryShareholder,keyDataCode:p.v6,KeyCodes:t};C()(h.IpN,m.tW(i,this.props.tokenDetails.tokenInfo)).then((e=>{const t=e.data,i={};if(!0===t.IsSuccess){t.EntityResult.forEach((e=>{i[e.Code]=e.Count.toLocaleString()})),this.setState({statesCount:i})}else console.log("Error in getDashboardOrderStatesCount:",t.ErrorList)})).catch((e=>{console.log("Error while getting getDashboardOrderStatesCount:",e)})),this.refreshTransactionsSummaryTimer=setTimeout((()=>this.getDashboardOrderStatesCount()),parseInt(e.RefreshRate))}componentWillUnmount(){this.refreshTransactionsSummaryTimer&&clearTimeout(this.refreshTransactionsSummaryTimer)}render(){return(0,l.jsxs)("div",{children:[(0,l.jsx)(o.A,{children:(0,l.jsx)(s.$,{operationsVisibilty:this.state.operationsVisibilty,breadcrumbItem:this.props.activeItem,shareholders:this.props.userDetails.EntityResult.ShareholderList,selectedShareholder:this.state.selectedShareholder,onShareholderChange:this.onShareholderChange,onDelete:this.onDelete,onAdd:this.onAdd,shrVisible:!1,handleBreadCrumbClick:this.props.handleBreadCrumbClick})}),(0,l.jsxs)(o.A,{children:[(0,l.jsx)(d,{statesCount:this.state.statesCount}),(0,l.jsx)(c.default,{transportationType:this.props.activeItem.itemProps.transportationType.toUpperCase()})]})]})}}const g=(0,r.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(f)},80312:(e,t,i)=>{i.d(t,{$3:()=>G,$H:()=>ne,$J:()=>me,$K:()=>Ce,$V:()=>Nt,$b:()=>vt,$p:()=>L,AE:()=>P,Al:()=>U,B2:()=>nt,By:()=>Pt,CW:()=>Ct,DA:()=>l,Ee:()=>He,FO:()=>I,Fy:()=>Oe,G9:()=>it,H8:()=>ee,Hq:()=>at,Ig:()=>V,Iu:()=>g,JI:()=>dt,JJ:()=>te,JU:()=>Q,Jz:()=>Qe,KQ:()=>se,Kk:()=>Ze,Kw:()=>et,LP:()=>At,LR:()=>c,Lg:()=>Y,Mg:()=>ve,Mm:()=>O,N1:()=>J,Nm:()=>u,No:()=>de,Ow:()=>F,P2:()=>o,P8:()=>ye,PD:()=>Te,PE:()=>p,PG:()=>$,PP:()=>mt,Pb:()=>Me,QB:()=>b,QC:()=>Z,RE:()=>ot,RO:()=>Ye,Rc:()=>gt,Rl:()=>bt,Rx:()=>ft,TI:()=>y,Tm:()=>ue,Ug:()=>X,Ur:()=>We,V9:()=>d,VK:()=>W,VL:()=>he,VQ:()=>ae,WD:()=>ke,Wf:()=>N,YO:()=>E,YY:()=>Ie,Yb:()=>fe,Yg:()=>Ge,Z9:()=>ht,ZE:()=>ct,ZU:()=>v,_N:()=>yt,_S:()=>Dt,_d:()=>It,aS:()=>H,aZ:()=>pt,au:()=>xe,b0:()=>jt,bL:()=>Ue,c2:()=>Be,d4:()=>Ve,dB:()=>f,dD:()=>Le,dK:()=>z,dY:()=>T,de:()=>h,dv:()=>De,eQ:()=>a,f3:()=>be,fF:()=>k,fL:()=>_t,fN:()=>xt,fk:()=>D,fl:()=>ge,fr:()=>S,go:()=>r,h:()=>pe,hD:()=>j,hE:()=>A,hh:()=>Xe,hk:()=>oe,hz:()=>ut,i:()=>n,j2:()=>st,jN:()=>K,je:()=>C,jx:()=>B,kL:()=>Je,ke:()=>Fe,km:()=>le,l0:()=>re,l6:()=>ze,lz:()=>M,m0:()=>_,nS:()=>Re,nk:()=>lt,nn:()=>x,np:()=>q,oh:()=>rt,op:()=>$e,pt:()=>we,qk:()=>ce,qp:()=>_e,r6:()=>je,rQ:()=>Ne,rj:()=>w,rp:()=>s,t3:()=>St,tM:()=>Ee,to:()=>Et,ts:()=>tt,uH:()=>Se,uy:()=>qe,w1:()=>Ae,x5:()=>ie,xz:()=>R,y_:()=>Ke,yu:()=>m,yx:()=>Rt,z8:()=>Pe,z_:()=>Tt});const n={view:"view",add:"add",modify:"modify",remove:"remove"},r="carriercompany",o="driver",s="customer",a="trailer",l="originterminal",d="destination",c="primemover",p="vehicle",h="shipmentbycompartment",m="shipmentbyproduct",u="ViewShipmentStatus",C="vessel",f="order",g="OrderForceClose",y="contract",_="receiptplanbycompartment",v="ViewMarineShipment",b="MarineShipmentByCompartment",S="ViewMarineReceipt",x="supplier",P="finishedproduct",R="RailDispatch",j="RailReceipt",N="RailRoute",D="RailWagon",A="CloseRailDispatch",I="PrintRailBOL",T="PrintRailFAN",E="RailDispatchLoadSpotAssignment",M="RailDispatchProductAssignment",V="ViewRailDispatch",O="ViewRailLoadingDetails",k="CloseRailReceipt",w="PrintRailBOD",B="PrintRailRAN",U="ViewRailReceipt",L="ViewRailUnLoadingDetails",H="SMS",F="UnAccountedTransactionTank",W="UnAccountedTransactionMeter",z="PipelineDispatch",G="PipelineReceipt",K="PipelineDispatchManualEntry",Q="PipelineReceiptManualEntry",$="LookUpData",q="HSEInspection",Y="HSEInspectionConfig",J="Email",Z="Shareholder",X="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",ne="LeakageManualEntry",re="Terminal",oe="SlotInformation",se="TankGroup",ae="Tank",le="SealMaster",de="TankEODEntry",ce="UnmatchedLocalTransactions",pe="AccessCard",he="ResetPin",me="SlotConfiguration",ue="PrintMarineFAN",Ce="PrintMarineBOL",fe="ViewMarineLoadingDetails",ge="ViewMarineShipmentAuditTrail",ye="CloseMarineShipment",_e="IssueCard",ve="ActivateCard",be="RevokeCard",Se="AutoIDAssociation",xe="MarineReceiptByCompartment",Pe="PrintMarineRAN",Re="PrintMarineBOD",je="ViewMarineUnloadingDetails",Ne="ViewMarineReceiptAuditTrail",De="CloseMarineReceipt",Ae="WeekendConfig",Ie="EODAdmin",Te="PrintBOL",Ee="PrintFAN",Me="PrintBOD",Ve="CloseShipment",Oe="CloseReceipt",ke="CONTRACTFORCECLOSE",we="Captain",Be="OverrideShipmentSequence",Ue="KPIInformation",Le="Language",He="WebPortalUserMap",Fe="BayGroup",We="PipelineHeaderSiteView",ze="TankMonitor",Ge="PersonAdmin",Ke="ProductReconciliationReports",Qe="ReportConfiguration",$e="EXECONFIGURATION",qe="ShareholderAllocation",Ye="NotificationGroup",Je="NotificationRestriction",Ze="NotificationConfig",Xe="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",nt="TANKSHAREHOLDERPRIMEFUNCTION",rt="ROLEADMIN",ot="ShiftConfig",st="PrinterConfiguration",at="CustomerAgreement",lt="BaySCADAConfiguration",dt="RailReceiptUnloadSpotAssignment",ct="STAFF_VISITOR",pt="PipelineMeterSiteView",ht="RailSiteView",mt="MarineSiteView",ut="LoadingDetails",Ct="UnloadingDetails",ft="RoadHSEInspection",gt="RoadHSEInspectionConfig",yt="MarineHSEInspection",_t="MarineHSEInspectionConfig",vt="RailHSEInspection",bt="RailHSEInspectionConfig",St="PipelineHSEInspection",xt="PipelineHSEInspectionConfig",Pt="PrintRAN",Rt="ViewReceiptStatus",jt="customerrecipe",Nt="COAParameter",Dt="COATemplate",At="COAManagement",It="COACustomer",Tt="COAAssignment",Et="ProductForecastConfiguration"},93779:(e,t,i)=>{i.d(t,{$A:()=>T,$L:()=>lt,$Q:()=>Le,Ae:()=>Ae,BX:()=>oe,Bl:()=>ue,Bv:()=>ge,Bw:()=>Z,Cb:()=>A,Cg:()=>N,DN:()=>ot,D_:()=>st,Dm:()=>E,E7:()=>q,EW:()=>V,FN:()=>re,FR:()=>o,FY:()=>ut,GA:()=>He,GT:()=>v,Ge:()=>Me,HB:()=>se,JQ:()=>$,KJ:()=>ee,Kz:()=>z,Ln:()=>W,M$:()=>We,O5:()=>tt,Of:()=>be,Oo:()=>it,Pk:()=>fe,Pm:()=>J,Q5:()=>dt,QK:()=>ze,QV:()=>Ze,QZ:()=>ct,Qu:()=>ie,RX:()=>Ne,Rb:()=>H,Rp:()=>x,SP:()=>C,T5:()=>ke,UB:()=>y,UT:()=>l,Ui:()=>K,VA:()=>L,Vk:()=>xe,Wb:()=>Pe,Wv:()=>Se,X3:()=>$e,Y4:()=>F,Yl:()=>nt,Zx:()=>Y,_B:()=>ye,_C:()=>D,_R:()=>Ce,_j:()=>ce,_n:()=>n,aM:()=>k,aW:()=>Ue,bW:()=>U,c4:()=>rt,cD:()=>a,c_:()=>R,cx:()=>B,dL:()=>pt,eE:()=>le,eS:()=>Ke,eT:()=>S,f:()=>M,f7:()=>me,fR:()=>pe,g1:()=>de,gN:()=>qe,gO:()=>G,iH:()=>at,ij:()=>et,j1:()=>j,jC:()=>_e,je:()=>he,jz:()=>ae,ll:()=>Xe,mM:()=>_,mO:()=>mt,mW:()=>Oe,ml:()=>f,mm:()=>Je,nB:()=>te,nT:()=>Ve,np:()=>Ee,oA:()=>P,oG:()=>Qe,oV:()=>X,ok:()=>p,oy:()=>d,pL:()=>Ie,pe:()=>Fe,pw:()=>Ge,qF:()=>s,qQ:()=>ht,qp:()=>h,s0:()=>b,sA:()=>De,st:()=>ne,tY:()=>O,uw:()=>Q,v6:()=>r,vL:()=>we,vf:()=>Te,wH:()=>Ye,wO:()=>ve,wX:()=>w,x4:()=>Re,xf:()=>m,xy:()=>c,yI:()=>g,yV:()=>I,yz:()=>u,zL:()=>je,zf:()=>Be});const n="CarrierCode",r="TransportationType",o="ShareHolderCode",s="DriverCode",a="CustomerCode",l="TrailerCode",d="OriginTerminalCode",c="PrimeMoverCode",p="VehicleCode",h="DestinationCode",m="FinishedProductCode",u="ShipmentCode",C="OrderCode",f="ReceiptCode",g="MarineDispatchCode",y="MarineReceiptCode",_="SupplierCode",v="ContractCode",b="RailDispatchCode",S="RailReceiptCode",x="RailRouteCode",P="WagonCode",R="CompartmentCode",j="SMSConfigurationCode",N="PipelineDispatchCode",D="PipelineReceiptCode",A="EmailConfigurationCode",I="BaseProductCode",T="LocationCode",E="SiteViewType",M="EntityCode",V="EntityType",O="CardReaderCode",k="AccessCardCode",w="BcuCode",B="DeuCode",U="WeighBridgeCode",L="Weight",H="OutOfToleranceAllowed",F="LoadingArmCode",W="TransportationType",z="BayCode",G="TransactionNumber",K="BatchNumber",Q="TerminalCode",$="TankGroupCode",q="TankCode",Y="MeterCode",J="ShipmentType",Z="ShipmentStatus",X="MeterLineType",ee="DispatchCode",te="ReceiptStatus",ie="FPTransactionID",ne="ProductCategoryType",re="Reason",oe="SealMasterCode",se="Reason",ae="OperationName",le="FPTransactionID",de="ProductCategoryType",ce="CompartmentSeqNoInVehicle",pe="AdjustedPlanQuantity",he="ForceComplete",me="DispatchStatus",ue="HolidayDate",Ce="ActionID",fe="EODTimePrev",ge="TerminalAction",ye="EODTime",_e="MonthStartDay",ve="CaptainCode",be="GeneralTMUserType",Se="GeneralTMUserCode",xe="IsPriority",Pe="ActualTerminalCode",Re="ShipmentBondNo",je="ReceiptBondNo",Ne="DeviceType",De="DeviceCode",Ae="BayGroup",Ie="PipelineHeaderCode",Te="ExchangePartner",Ee="PersonID",Me="UserName",Ve="PipelinePlanCode",Oe="PipelinePlanType",ke="ChannelCode",we="ProcessName",Be="ReconciliationCode",Ue="NotificationGroupCode",Le="NotificationGroupStatus",He="NotificationGroupDesc",Fe="NotificationResSource",We="NotificationResMsgCode",ze="NotificationOrigResSource",Ge="NotificationOrigResMsgCode",Ke="NotificationMessageCode",Qe="PositionType",$e="ExchangeAgreementCode",qe="ProductTransferAgreementCode",Ye="ShareholderAgreementStatus",Je="RequestorShareholder",Ze="LenderShareholder",Xe="RequestCode",et="TransferReferenceCode",tt="ShiftID",it="ShiftName",nt="PrinterName",rt="LocationType",ot="ForceClosureReason",st="TransactionType",at="CustomerRecipeCode",lt="COATemplateCode",dt="COAManagementCode",ct="COAParameterCode",pt="COAManagementFinishedProductCode",ht="COASeqNumber",mt="ForecastDate",ut="ForecastTanks"},6890:(e,t,i)=>{i.d(t,{x:()=>s});var n=i(728),r=i(65043),o=function(){var e=function(t,i){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(t,i)};return function(t,i){function n(){this.constructor=t}e(t,i),t.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}(),s=function(e){function t(i,o,s){var a=e.call(this,i)||this;a._objPropHash={},a._isMounted=!1,a._mountedCBs=[],a._hostRef=function(e){return a._hostRefValue=e},a._beforeRender=new n.Event,a._afterRender=new n.Event,a._beforeWillUnmount=new n.Event,a._afterWillUnmount=new n.Event,a._beforeDidUpdate=new n.Event,a._afterDidUpdate=new n.Event,t._reactMajorVersion||(t._reactMajorVersion=parseInt(r.version)),a.props=i,a.controlType=o;for(var l=0,d=s&&s.objectProps||[];l<d.length;l++){var c=d[l];a._objPropHash[c]=!0}return a}return o(t,e),t.prototype.render=function(){this._onBeforeRender();var e=this._renderImpl();return this._onAfterRender(),e},t.prototype.componentDidMount=function(){var e=this;if(this._isChild()){var i=this.props[t._propsParent];i&&i._mountedCB((function(){e._setParent(i)}))}else this._prepareControl();return this.control},t.prototype.componentWillUnmount=function(){this._onBeforeWillUnmount(),this._siblingInsertedEH&&this._getElement().removeEventListener("DOMNodeInserted",this._siblingInsertedEH);var e=this.control;if(e)if(this._isChild()){var t=this._getParentProp();if(t){var i=this.parent.control[t];if((0,n.isArray)(i)){var r=i.indexOf(e);r>-1&&i.splice(r,1)}}}else e instanceof n.Control&&setTimeout((function(){e.hostElement&&(e._orgOuter=null,e.dispose())}));this._onAfterWillUnmount()},t.prototype.shouldComponentUpdate=function(e){return!0},t.prototype.componentDidUpdate=function(e){this._onBeforeDidUpdate();var t=this.control;this._copy(t,this.props,e),this._onAfterDidUpdate()},t.prototype._mountedCB=function(e){this._isMounted?e():this._mountedCBs.push(e)},t.prototype._renderImpl=function(){var e={};e[t._propsParent]=this;var i=r.Children.map(this.props.children,(function(t){return t&&r.cloneElement(t,e)})),n={ref:this._hostRef};return this._isChild()&&(n.style={display:"none"}),r.createElement("div",n,i)},t.prototype._onBeforeRender=function(e){this._beforeRender.raise(this,e)},t.prototype._onAfterRender=function(e){this._afterRender.raise(this,e)},t.prototype._onBeforeWillUnmount=function(e){this._beforeWillUnmount.raise(this,e)},t.prototype._onAfterWillUnmount=function(e){this._afterWillUnmount.raise(this,e)},t.prototype._onBeforeDidUpdate=function(e){this._beforeDidUpdate.raise(this,e)},t.prototype._onAfterDidUpdate=function(e){this._afterDidUpdate.raise(this,e)},t.prototype._createControl=function(){var e=this._isChild()?this._isParentInCtor()?this.parent.control:void 0:this._getElement();return new this.controlType(e)},t.prototype._prepareControl=function(){var e=this._getElement(),i=this.props;e&&!this._isChild()&&t._copyAttrs(e,i,n.Control._rxInputAtts);var r=this.control=this._createControl(),o=r instanceof n.Control,s=t;this._siblingId||(null==this.constructor[s._typeSiblingIdProp]&&(this.constructor[s._typeSiblingIdProp]=++s._siblingDirId+""),this._siblingId=this.constructor[s._typeSiblingIdProp]),e.setAttribute(s._typeSiblingIdProp,this._siblingId);var a={};for(var l in i){var d=i[l];this._ignoreProp(l)||(0,n.isUndefined)(d)||(l in r?a[l]=d:this._setHostAttribute(e,l,d))}o?r.initialize(a):this._copy(r,a,null,!0),this._isMounted=!0;var c=this._mountedCBs;this._mountedCBs=[];for(var p=0,h=c;p<h.length;p++)(0,h[p])();(0,n.isFunction)(i.initialized)&&i.initialized(r)},t.prototype._initParent=function(){var e=this._getParentProp();if(e){var t=this.parent.control,i=t[e];if((0,n.isArray)(i)){var r=this._getSiblingIndex();(r<0||r>=i.length)&&(r=i.length),i.splice(r,0,this.control),this._siblingInsertedEH=this._siblingInserted.bind(this),this._getElement().addEventListener("DOMNodeInserted",this._siblingInsertedEH)}else t[e]=this.control}},t.prototype._setParent=function(e){if(e!==this.parent){if(this.parent)throw"Wijmo child component is already attached to a different parent.";this.parent=e,this._prepareControl(),this._initParent()}},t.prototype._isChild=function(){return null!=this._parentProp||null!=this._parentInCtor},t.prototype._isParentInCtor=function(){return!0===this._parentInCtor},t.prototype._getParentProp=function(){return this.props.wjProperty||this._parentProp},t.prototype._getSiblingIndex=function(){var e=this._getElement(),i=e.parentElement;if(!i)return-1;for(var n=i.childNodes,r=-1,o=this._siblingId,s=0;s<n.length;s++){var a=n[s];if(1==a.nodeType&&a.getAttribute(t._typeSiblingIdProp)==o&&(++r,a===e))return r}return-1},t.prototype._siblingInserted=function(e){if(e.target===this._getElement()){var t=this._getSiblingIndex(),i=this.control,n=this.parent.control[this._getParentProp()],r=n.indexOf(i);t>=0&&r>=0&&t!==r&&(n.splice(r,1),t=Math.min(t,n.length),n.splice(t,0,i))}},t.prototype._copy=function(e,t,i,r){if(void 0===r&&(r=!1),e&&t){var o,s=e===this.control;for(var a in t)if(!this._ignoreProp(a)||!s){var l=t[a];if(a in e){if(this._isEvent(e,a))r&&(0,n.isFunction)(l)&&e[a].addHandler(l);else if(!i||!this._sameValue(i[a],l))if(null==l)e[a]=l;else if((0,n.isPrimitive)(l)||(0,n.isFunction)(l)||this._objPropHash[a]&&e===(o||(o=this.control)))e[a]=l;else if((0,n.isArray)(l)&&(0,n.isArray)(e[a])){var d=e[a],c=l;if(c.length==d.length)for(var p=0;p<c.length;p++)this._copy(d[p],c[p])}else(0,n.isObject)(l)&&this._copy(e[a],t[a])}else this._setHostAttribute(e.hostElement,a,t[a])}}},t.prototype._setHostAttribute=function(e,t,i){if(e)switch(t){case"className":var r=this._appliedClassName;r!==i&&((0,n.removeClass)(e,r),(0,n.addClass)(e,i),this._appliedClassName=i);break;case"style":(0,n.setCss)(e,i);break;default:null!=e[t]?e[t]=i:"string"==typeof i&&"$"!==t[0]&&e.setAttribute(t,i)}},t.prototype._sameValue=function(e,t){return e==t||n.DateTime.equals(e,t)},t.prototype._isEvent=function(e,t){var i=e&&e[t];return null!=i&&i instanceof n.Event},t.prototype._getElement=function(){return this._hostRefValue},t.prototype._ignoreProp=function(e){return"children"===e},t._copyAttrs=function(e,t,i){if(e)for(var n in t)n.match(i)&&e.setAttribute(n,t[n])},t.isInStrictMode=function(e){return!!(e.hasOwnProperty("_reactInternalFiber")&&1&e._reactInternalFiber.mode)},t._propsParent="$parent",t._typeSiblingIdProp="_wjSiblingIdProp",t._siblingDirId=0,t}(r.Component)},60663:()=>{},92342:()=>{}}]);
//# sourceMappingURL=3775.0fffa3f7.chunk.js.map