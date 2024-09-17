"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[4629,9158,6001,6777,8382,735,3116,3920,3235,5973,8354],{40510:(e,a,l)=>{l.d(a,{A:()=>o});var t=l(65043),r=l(80297),i=l(65187),s=l(67907),n=l(70579);function o(e){let{KPIList:a,pageName:l,rowHeight:o,widgetHeight:I,isDraggable:d,isResizable:E,kpiDisplayTopBreakpoint:c}=e;const[T,N]=(0,t.useState)(1),A=t.useRef(null),C=()=>{let e=window.pageYOffset,a=T;if(A.current&&A.current.getBoundingClientRect().top<c)a=0;else{if(0!==e)return;a=1}N(a)};return(0,t.useEffect)((()=>{"undefined"!==typeof window&&window.addEventListener("scroll",C)})),(0,t.useEffect)((()=>()=>{window.removeEventListener("scroll",C)}),[]),(0,n.jsx)("div",{ref:A,children:1===T?(0,n.jsx)(s.TranslationConsumer,{children:e=>(0,n.jsx)("div",{style:{marginTop:"6px"},children:(0,n.jsx)(i.A,{children:(0,n.jsx)(r.A,{kpiList:a,isDraggable:d,isResizable:E,rowHeight:o,widgetHeight:I,pageName:l})})})}):""})}o.defaultProps={kpiDisplayTopBreakpoint:100}},24904:(e,a,l)=>{l.d(a,{y:()=>n});l(65043);var t=l(67907),r=l(72711),i=l(69062),s=l(70579);function n(e){let{terminalList:a,selectedTerminal:l,validationError:n,onFieldChange:o,onCheckChange:I}=e;return null===l&&(l=[]),(0,s.jsx)(t.TranslationConsumer,{children:e=>(0,s.jsxs)("div",{style:{display:"flex",justifyContent:"space-between"},children:[(0,s.jsx)("div",{style:{width:"80%"},children:(0,s.jsx)(r.Select,{fluid:!0,placeholder:e("Common_Select"),label:e("TerminalCodes"),value:l,multiple:!0,options:i.Zj(a),onChange:e=>o("TerminalCodes",e),error:e(n),disabled:0===a.length,reserveSpace:!1})}),(0,s.jsx)("div",{className:"ddlSelectAll",children:(0,s.jsx)(r.Checkbox,{label:e("Common_All"),checked:Array.isArray(l)&&l.length===a.length,onChange:e=>I(e)})})]})})}n.defaultProps={terminalList:[],selectedTerminal:[],validationError:""}},43503:(e,a,l)=>{l.d(a,{A:()=>n});l(65043);var t=l(67907),r=l(72711),i=l(70579);function s(e){let{entityCode:a,newEntityName:l,popUpContents:s}=e;return(0,i.jsx)(t.TranslationConsumer,{children:e=>(0,i.jsx)("div",{className:"headerContainer",children:(0,i.jsxs)("div",{className:"row headerSpacing",children:[(0,i.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,i.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===a||void 0===a?e(l):a})}),""!==a&&void 0!==a&&s.length>0?(0,i.jsx)("div",{className:"headerItemRight",children:(0,i.jsx)(r.Popup,{element:(0,i.jsxs)("div",{children:[e(s[0].fieldName)+" ",":"," "+s[0].fieldValue,(0,i.jsx)(r.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,i.jsx)(r.List,{className:"detailsHeaderPopUp",children:s.map((a=>(0,i.jsxs)(r.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(a.fieldName)+" ",":"," "+a.fieldValue]},"content.fieldName")))})})}):""]})})})}s.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const n=s},9256:(e,a,l)=>{l.d(a,{q:()=>s});l(65043);var t=l(72711),r=l(67907),i=l(70579);function s(e){let{handleBack:a,handleSave:l,handleReset:s,saveEnabled:n}=e;return(0,i.jsx)(r.TranslationConsumer,{children:e=>(0,i.jsxs)("div",{className:"row userActionPosition",children:[(0,i.jsx)("div",{className:"col-12 col-md-3 col-lg-4",children:(0,i.jsx)(t.Button,{className:"backButton",onClick:a,content:e("Back")})}),(0,i.jsx)("div",{className:"col-12 col-md-9 col-lg-8",children:(0,i.jsxs)("div",{style:{float:"right"},children:[(0,i.jsx)(t.Button,{content:e("LookUpData_btnReset"),className:"cancelButton",onClick:s}),(0,i.jsx)(t.Button,{content:e("Save"),disabled:!n,onClick:l})]})})]})})}s.defaultProps={saveEnabled:!1}},85800:(e,a,l)=>{l.d(a,{n:()=>o});l(65043);var t=l(72711),r=l(67907),i=l(7523),s=l(35861),n=l(70579);function o(e){let{selectedAttributeList:a,handleCellDataEdit:l,attributeValidationErrors:o}=e;const I=e=>{if("0000-00-00"===e.DefaultValue)return d(e,new Date),new Date;var a=e.DefaultValue.split("-");return new Date(a[0],a[1]-1,a[2])},d=(e,a)=>{var t=new Date(a);a=t.getFullYear()+"-"+("0"+(t.getMonth()+1)).slice(-2)+"-"+("0"+t.getDate()).slice(-2),l(e,a)};return(0,n.jsx)(r.TranslationConsumer,{children:e=>(0,n.jsx)("div",{className:"row",children:(0,n.jsx)("div",{className:"col-md-12 attributeDetails-wrap",children:(0,n.jsx)("div",{className:"row",children:a.map((a=>a.DataType.toLowerCase()===i.pe.STRING.toLowerCase()&&!0===a.IsVisible?(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(t.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue?"":a.DefaultValue,indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(o[a.Code]),reserveSpace:!1})}):a.DataType.toLowerCase()!==i.pe.INT.toLowerCase()&&a.DataType.toLowerCase()!==i.pe.LONG.toLowerCase()||!0!==a.IsVisible?a.DataType.toLowerCase()!==i.pe.FLOAT.toLowerCase()&&a.DataType.toLowerCase()!==i.pe.DOUBLE.toLowerCase()||!0!==a.IsVisible?a.DataType.toLowerCase()===i.pe.BOOL.toLowerCase()&&!0===a.IsVisible?(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(t.Checkbox,{className:"deviceCheckBox customDeviceCheckBox",label:e(a.DisplayName),checked:null===a.DefaultValue?"":"true"===a.DefaultValue.toString().toLowerCase(),disabled:!0===a.IsReadonly,onChange:e=>l(a,e)})}):a.DataType.toLowerCase()===i.pe.DATETIME.toLowerCase()&&!0===a.IsVisible?(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(t.DatePicker,{fluid:!0,value:null===a.DefaultValue||""===a.DefaultValue?"":I(a),label:e(a.DisplayName),displayFormat:(0,s.F1)(),showYearSelector:"true",indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>d(a,e),onTextChange:e=>{d(a,e)},error:e(o[a.Code]),reserveSpace:!1})}):null:(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(t.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue||""===a.DefaultValue?"":a.DefaultValue.toLocaleString(),indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(o[a.Code]),reserveSpace:!1})}):(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,n.jsx)(t.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue?"":a.DefaultValue,indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(o[a.Code]),reserveSpace:!1})})))})})})})}},15417:(e,a,l)=>{l.d(a,{$7:()=>v,AN:()=>le,AU:()=>x,Ak:()=>We,Ao:()=>t,B6:()=>Z,C4:()=>Ge,CG:()=>Q,Ct:()=>q,Cw:()=>j,EY:()=>O,G$:()=>Ze,G6:()=>Je,GF:()=>Te,GJ:()=>w,Gj:()=>Ee,Gl:()=>ie,H9:()=>Ke,HB:()=>he,HP:()=>m,Hr:()=>Oe,II:()=>ra,IQ:()=>L,Jr:()=>F,Jx:()=>Se,Ki:()=>ae,LP:()=>re,Lv:()=>i,MK:()=>u,MX:()=>ee,Mx:()=>Y,N4:()=>fe,NH:()=>De,OF:()=>$e,Ps:()=>U,Q7:()=>qe,QY:()=>G,SF:()=>s,Sq:()=>pe,Sw:()=>ne,TQ:()=>X,U7:()=>h,UH:()=>C,UO:()=>se,V_:()=>Me,Vy:()=>Ve,W9:()=>Ie,WN:()=>S,Wr:()=>r,Ww:()=>J,XP:()=>ge,Xk:()=>K,Yb:()=>Re,Yy:()=>N,Z2:()=>we,ZN:()=>H,ZO:()=>Pe,Zu:()=>Fe,_G:()=>_,_N:()=>E,_u:()=>de,ad:()=>oe,al:()=>Le,ao:()=>V,bK:()=>W,bN:()=>D,cf:()=>y,dO:()=>ve,dU:()=>T,dv:()=>n,eE:()=>z,g:()=>p,gG:()=>o,gS:()=>xe,gT:()=>la,gW:()=>$,gZ:()=>Xe,go:()=>g,gp:()=>k,hq:()=>ye,i6:()=>ea,ip:()=>ce,k9:()=>A,kI:()=>P,l4:()=>je,l5:()=>R,lA:()=>f,lU:()=>Qe,mD:()=>ke,mY:()=>b,mq:()=>I,n$:()=>ta,n7:()=>c,nZ:()=>He,rA:()=>be,s$:()=>Ue,s8:()=>Be,se:()=>ue,tA:()=>me,vK:()=>aa,vs:()=>Ce,w2:()=>ze,w4:()=>Ae,wT:()=>d,wY:()=>M,wf:()=>Ne,wk:()=>te,xW:()=>B,yM:()=>_e,yO:()=>Ye});const t="driver",r="carriercompany",i="shareholder",s="baseProduct",n="TRAILER",o="TRAILERCOMPARTMENT",I="terminal",d="customer",E="destination",c="finishedproduct",T="tank",N="marine_vessel",A="marine_trailercompartment",C="supplier",u="vehicle",D="vehicletrailer",S="originterminal",L="bay",P="loadingArm",R="cardreader",p="vehicleprimemover",m="meter",O="SHIPMENT",h="SHIPMENTCOMPARTMENT",x="SHIPMENTDESTINATIONCOMPARTMENT",g="SHIPMENTDETAILS",M="SHIPMENTTRAILERWEIGHBRIDGE",v="SHIPMENTTRAILER",H="SHIPMENTSTATUSTIME",y="MARINEDISPATCH",f="MARINEDISPATCHCOMPARTMENTDETAIL",w="railwagon",j="primemover",b="bcu",G="RAILRECEIPTPLAN",U="RAILRECEIPTWAGONDETAILPLAN",V="RAILUNLOADINGDETAILSFP",k="RAILUNLOADINGDETAILSBP",B="RAILUNLOADINGDETAILSADDITIVE",F="RAILDISPATCHPLAN",W="RAILDISPATCHITEM",_="RAILDISPATCHSTATUSCHANGE",Y="RAILDISPATCHWAGON",q="RAILDISPATCHWAGONDETAILPLAN",K="RAILDISPATCHWAGONWEIGHBRIDGE",Z="RAILDISPATCHWAGONCOMPARTMENT",z="RAILLOADINGDETAILSFP",Q="RAILLOADINGDETAILSBP",$="RAILLOADINGDETAILSADDITIVE",J="marineReceipt",X="UNACCOUNTEDMETERTRANSACTION",ee="UNACCOUNTEDTANKTRANSACTION",ae="marineLoadingDetailsFP",le="marineLoadingDetailsAdditive",te="marineLoadingDetailsBP",re="marineReceiptCompartmentDetail",ie="marineUnloadingDetailsFP",se="marineUnloadingDetailsBP",ne="accessCard",oe="LOADINGDETAILSFP",Ie="LOADINGDETAILSBP",de="LOADINGDETAILSADDITIVE",Ee="MARINERECEIPTSTATUSTIME",ce="MARINEDISPATCHSTATUSTIME",Te="RECEIPT",Ne="UNLOADINGTRANSACTIONS",Ae="ORDER",Ce="ORDERITEM",ue="CONTRACT",De="CONTRACT_ITEM",Se="RECEIPTORIGINTERMINALCOMPARTMENT",Le="GeneralTMUser_CAPTAIN",Pe="weighbridge",Re="deu",pe="GeneralTMUser_STAFF",me="GeneralTMUser_VISITOR",Oe="PIPELINEHEADER",he="SEALMASTER",xe="PIPELINERECEIPT",ge="ROADSHIPMENTSLOTINFO",Me="ROADRECEIPTSLOTINFO",ve="MARINESHIPMENTSLOTINFO",He="MARINERECEIPTSLOTINFO",ye="PIPELINEDISPATCH",fe="PIPELINETRANSACTIONS",we="PIPELINEDISPATCHSTATUSTIME",je="PIPELINERECEIPTSTATUSTIME",be="PROCESSCONFIG",Ge="PRODUCTALLOCATIONITEM",Ue="HSEINSPECTIONSHIPMENTRIGIDTRUCK",Ve="HSEINSPECTIONSHIPMENTTRAILER",ke="HSEINSPECTIONSHIPMENTPRIMEMOVER",Be="HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE",Fe="HSEINSPECTIONMARINESHIPMENTBARGE",We="HSEINSPECTIONMARINESHIPMENTSHIP",_e="HSEINSPECTIONSHIPMENTRAILWAGON",Ye="HSEINSPECTIONSHIPMENTPIPELINE",qe="HSEINSPECTIONRECEIPTRIGIDTRUCK",Ke="HSEINSPECTIONRECEIPTTRAILER",Ze="HSEINSPECTIONRECEIPTPRIMEMOVER",ze="HSEINSPECTIONRECEIPTNONFILLINGVEHICLE",Qe="HSEINSPECTIONMARINERECEIPTBARGE",$e="HSEINSPECTIONMARINERECEIPTSHIP",Je="HSEINSPECTIONRECEIPTRAILWAGON",Xe="HSEINSPECTIONRECEIPTPIPELINE",ea="SHAREHOLDERAGREEMENT",aa="COATEMPLATE",la="COAMANAGEMENT",ta="COACUSTOMER",ra="COAASSIGNMENT"},97105:(e,a,l)=>{l.d(a,{S:()=>t});const t={Driver:["License1ExpiryDate","License1IssueDate","License2IssueDate","License2ExpiryDate","License3IssueDate","License3ExpiryDate","HazardousLicenseExpiry"],CarrierCompany:["PermitExpiryDate"],PrimeMover:["RoadTaxNoIssueDate","RoadTaxNoExpiryDate","licenseExpiryDate"],Wagon:["LicenseExpiryDate"],Vehicle:["LicenseNoIssueDate","LicenseNoExpiryDate","RoadTaxNoIssueDate","RoadTaxNoExpiryDate","Bondexpirydate","HazardousLicenseExpiry"],Contract:["StartDate","EndDate"],ContractItem:["StartDate","EndDate"],Order:["OrderStartDate","OrderEndDate","OrderDate","DeliveryDate"],AccessCard:["ExpiryDate","IssueDate","PasswordExpiryDate"],Trailer:["HazardousLicenseExpiry"]}},35861:(e,a,l)=>{l.d(a,{F1:()=>n,i7:()=>o,r4:()=>s});var t=l(86178),r=l.n(t),i=(l(15660),l(65043),l(70579));function s(e,a){if(Array.isArray(e)){0===e.filter((e=>e.text===a)).length&&e.unshift({value:null,text:a})}return e}function n(){let e=window.navigator.userLanguage||window.navigator.language;return r().locale(e),r().localeData().longDateFormat("L")}function o(e){return(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{children:e}),(0,i.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=4629.6498993e.chunk.js.map