"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[6777,9158,6001,8382,735,3116,3920,3235,5973,8354],{40510:(e,a,l)=>{l.d(a,{A:()=>I});var t=l(65043),i=l(80297),n=l(65187),s=l(67907),r=l(70579);function I(e){let{KPIList:a,pageName:l,rowHeight:I,widgetHeight:o,isDraggable:E,isResizable:d,kpiDisplayTopBreakpoint:T}=e;const[N,c]=(0,t.useState)(1),A=t.useRef(null),C=()=>{let e=window.pageYOffset,a=N;if(A.current&&A.current.getBoundingClientRect().top<T)a=0;else{if(0!==e)return;a=1}c(a)};return(0,t.useEffect)((()=>{"undefined"!==typeof window&&window.addEventListener("scroll",C)})),(0,t.useEffect)((()=>()=>{window.removeEventListener("scroll",C)}),[]),(0,r.jsx)("div",{ref:A,children:1===N?(0,r.jsx)(s.TranslationConsumer,{children:e=>(0,r.jsx)("div",{style:{marginTop:"6px"},children:(0,r.jsx)(n.A,{children:(0,r.jsx)(i.A,{kpiList:a,isDraggable:E,isResizable:d,rowHeight:I,widgetHeight:o,pageName:l})})})}):""})}I.defaultProps={kpiDisplayTopBreakpoint:100}},43503:(e,a,l)=>{l.d(a,{A:()=>r});l(65043);var t=l(67907),i=l(72711),n=l(70579);function s(e){let{entityCode:a,newEntityName:l,popUpContents:s}=e;return(0,n.jsx)(t.TranslationConsumer,{children:e=>(0,n.jsx)("div",{className:"headerContainer",children:(0,n.jsxs)("div",{className:"row headerSpacing",children:[(0,n.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,n.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===a||void 0===a?e(l):a})}),""!==a&&void 0!==a&&s.length>0?(0,n.jsx)("div",{className:"headerItemRight",children:(0,n.jsx)(i.Popup,{element:(0,n.jsxs)("div",{children:[e(s[0].fieldName)+" ",":"," "+s[0].fieldValue,(0,n.jsx)(i.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,n.jsx)(i.List,{className:"detailsHeaderPopUp",children:s.map((a=>(0,n.jsxs)(i.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(a.fieldName)+" ",":"," "+a.fieldValue]},"content.fieldName")))})})}):""]})})})}s.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const r=s},9256:(e,a,l)=>{l.d(a,{q:()=>s});l(65043);var t=l(72711),i=l(67907),n=l(70579);function s(e){let{handleBack:a,handleSave:l,handleReset:s,saveEnabled:r}=e;return(0,n.jsx)(i.TranslationConsumer,{children:e=>(0,n.jsxs)("div",{className:"row userActionPosition",children:[(0,n.jsx)("div",{className:"col-12 col-md-3 col-lg-4",children:(0,n.jsx)(t.Button,{className:"backButton",onClick:a,content:e("Back")})}),(0,n.jsx)("div",{className:"col-12 col-md-9 col-lg-8",children:(0,n.jsxs)("div",{style:{float:"right"},children:[(0,n.jsx)(t.Button,{content:e("LookUpData_btnReset"),className:"cancelButton",onClick:s}),(0,n.jsx)(t.Button,{content:e("Save"),disabled:!r,onClick:l})]})})]})})}s.defaultProps={saveEnabled:!1}},85800:(e,a,l)=>{l.d(a,{n:()=>I});l(65043);var t=l(72711),i=l(67907),n=l(7523),s=l(35861),r=l(70579);function I(e){let{selectedAttributeList:a,handleCellDataEdit:l,attributeValidationErrors:I}=e;const o=e=>{if("0000-00-00"===e.DefaultValue)return E(e,new Date),new Date;var a=e.DefaultValue.split("-");return new Date(a[0],a[1]-1,a[2])},E=(e,a)=>{var t=new Date(a);a=t.getFullYear()+"-"+("0"+(t.getMonth()+1)).slice(-2)+"-"+("0"+t.getDate()).slice(-2),l(e,a)};return(0,r.jsx)(i.TranslationConsumer,{children:e=>(0,r.jsx)("div",{className:"row",children:(0,r.jsx)("div",{className:"col-md-12 attributeDetails-wrap",children:(0,r.jsx)("div",{className:"row",children:a.map((a=>a.DataType.toLowerCase()===n.pe.STRING.toLowerCase()&&!0===a.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(t.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue?"":a.DefaultValue,indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(I[a.Code]),reserveSpace:!1})}):a.DataType.toLowerCase()!==n.pe.INT.toLowerCase()&&a.DataType.toLowerCase()!==n.pe.LONG.toLowerCase()||!0!==a.IsVisible?a.DataType.toLowerCase()!==n.pe.FLOAT.toLowerCase()&&a.DataType.toLowerCase()!==n.pe.DOUBLE.toLowerCase()||!0!==a.IsVisible?a.DataType.toLowerCase()===n.pe.BOOL.toLowerCase()&&!0===a.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(t.Checkbox,{className:"deviceCheckBox customDeviceCheckBox",label:e(a.DisplayName),checked:null===a.DefaultValue?"":"true"===a.DefaultValue.toString().toLowerCase(),disabled:!0===a.IsReadonly,onChange:e=>l(a,e)})}):a.DataType.toLowerCase()===n.pe.DATETIME.toLowerCase()&&!0===a.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(t.DatePicker,{fluid:!0,value:null===a.DefaultValue||""===a.DefaultValue?"":o(a),label:e(a.DisplayName),displayFormat:(0,s.F1)(),showYearSelector:"true",indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>E(a,e),onTextChange:e=>{E(a,e)},error:e(I[a.Code]),reserveSpace:!1})}):null:(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(t.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue||""===a.DefaultValue?"":a.DefaultValue.toLocaleString(),indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(I[a.Code]),reserveSpace:!1})}):(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(t.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue?"":a.DefaultValue,indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(I[a.Code]),reserveSpace:!1})})))})})})})}},15417:(e,a,l)=>{l.d(a,{$7:()=>v,AN:()=>le,AU:()=>g,Ak:()=>We,Ao:()=>t,B6:()=>Z,C4:()=>ye,CG:()=>$,Ct:()=>q,Cw:()=>b,EY:()=>O,G$:()=>Ze,G6:()=>Je,GF:()=>Ne,GJ:()=>G,Gj:()=>de,Gl:()=>ne,H9:()=>Ke,HB:()=>Me,HP:()=>p,Hr:()=>Oe,II:()=>ia,IQ:()=>L,Jr:()=>F,Jx:()=>Pe,Ki:()=>ae,LP:()=>ie,Lv:()=>n,MK:()=>S,MX:()=>ee,Mx:()=>Y,N4:()=>xe,NH:()=>ue,OF:()=>ze,Ps:()=>U,Q7:()=>qe,QY:()=>y,SF:()=>s,Sq:()=>me,Sw:()=>re,TQ:()=>X,U7:()=>M,UH:()=>C,UO:()=>se,V_:()=>He,Vy:()=>Ve,W9:()=>oe,WN:()=>P,Wr:()=>i,Ww:()=>J,XP:()=>he,Xk:()=>K,Yb:()=>De,Yy:()=>c,Z2:()=>Ge,ZN:()=>w,ZO:()=>Re,Zu:()=>Fe,_G:()=>_,_N:()=>d,_u:()=>Ee,ad:()=>Ie,al:()=>Le,ao:()=>V,bK:()=>W,bN:()=>u,cf:()=>f,dO:()=>ve,dU:()=>N,dv:()=>r,eE:()=>Q,g:()=>m,gG:()=>I,gS:()=>ge,gT:()=>la,gW:()=>z,gZ:()=>Xe,go:()=>h,gp:()=>k,hq:()=>fe,i6:()=>ea,ip:()=>Te,k9:()=>A,kI:()=>R,l4:()=>be,l5:()=>D,lA:()=>x,lU:()=>$e,mD:()=>ke,mY:()=>j,mq:()=>o,n$:()=>ta,n7:()=>T,nZ:()=>we,rA:()=>je,s$:()=>Ue,s8:()=>Be,se:()=>Se,tA:()=>pe,vK:()=>aa,vs:()=>Ce,w2:()=>Qe,w4:()=>Ae,wT:()=>E,wY:()=>H,wf:()=>ce,wk:()=>te,xW:()=>B,yM:()=>_e,yO:()=>Ye});const t="driver",i="carriercompany",n="shareholder",s="baseProduct",r="TRAILER",I="TRAILERCOMPARTMENT",o="terminal",E="customer",d="destination",T="finishedproduct",N="tank",c="marine_vessel",A="marine_trailercompartment",C="supplier",S="vehicle",u="vehicletrailer",P="originterminal",L="bay",R="loadingArm",D="cardreader",m="vehicleprimemover",p="meter",O="SHIPMENT",M="SHIPMENTCOMPARTMENT",g="SHIPMENTDESTINATIONCOMPARTMENT",h="SHIPMENTDETAILS",H="SHIPMENTTRAILERWEIGHBRIDGE",v="SHIPMENTTRAILER",w="SHIPMENTSTATUSTIME",f="MARINEDISPATCH",x="MARINEDISPATCHCOMPARTMENTDETAIL",G="railwagon",b="primemover",j="bcu",y="RAILRECEIPTPLAN",U="RAILRECEIPTWAGONDETAILPLAN",V="RAILUNLOADINGDETAILSFP",k="RAILUNLOADINGDETAILSBP",B="RAILUNLOADINGDETAILSADDITIVE",F="RAILDISPATCHPLAN",W="RAILDISPATCHITEM",_="RAILDISPATCHSTATUSCHANGE",Y="RAILDISPATCHWAGON",q="RAILDISPATCHWAGONDETAILPLAN",K="RAILDISPATCHWAGONWEIGHBRIDGE",Z="RAILDISPATCHWAGONCOMPARTMENT",Q="RAILLOADINGDETAILSFP",$="RAILLOADINGDETAILSBP",z="RAILLOADINGDETAILSADDITIVE",J="marineReceipt",X="UNACCOUNTEDMETERTRANSACTION",ee="UNACCOUNTEDTANKTRANSACTION",ae="marineLoadingDetailsFP",le="marineLoadingDetailsAdditive",te="marineLoadingDetailsBP",ie="marineReceiptCompartmentDetail",ne="marineUnloadingDetailsFP",se="marineUnloadingDetailsBP",re="accessCard",Ie="LOADINGDETAILSFP",oe="LOADINGDETAILSBP",Ee="LOADINGDETAILSADDITIVE",de="MARINERECEIPTSTATUSTIME",Te="MARINEDISPATCHSTATUSTIME",Ne="RECEIPT",ce="UNLOADINGTRANSACTIONS",Ae="ORDER",Ce="ORDERITEM",Se="CONTRACT",ue="CONTRACT_ITEM",Pe="RECEIPTORIGINTERMINALCOMPARTMENT",Le="GeneralTMUser_CAPTAIN",Re="weighbridge",De="deu",me="GeneralTMUser_STAFF",pe="GeneralTMUser_VISITOR",Oe="PIPELINEHEADER",Me="SEALMASTER",ge="PIPELINERECEIPT",he="ROADSHIPMENTSLOTINFO",He="ROADRECEIPTSLOTINFO",ve="MARINESHIPMENTSLOTINFO",we="MARINERECEIPTSLOTINFO",fe="PIPELINEDISPATCH",xe="PIPELINETRANSACTIONS",Ge="PIPELINEDISPATCHSTATUSTIME",be="PIPELINERECEIPTSTATUSTIME",je="PROCESSCONFIG",ye="PRODUCTALLOCATIONITEM",Ue="HSEINSPECTIONSHIPMENTRIGIDTRUCK",Ve="HSEINSPECTIONSHIPMENTTRAILER",ke="HSEINSPECTIONSHIPMENTPRIMEMOVER",Be="HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE",Fe="HSEINSPECTIONMARINESHIPMENTBARGE",We="HSEINSPECTIONMARINESHIPMENTSHIP",_e="HSEINSPECTIONSHIPMENTRAILWAGON",Ye="HSEINSPECTIONSHIPMENTPIPELINE",qe="HSEINSPECTIONRECEIPTRIGIDTRUCK",Ke="HSEINSPECTIONRECEIPTTRAILER",Ze="HSEINSPECTIONRECEIPTPRIMEMOVER",Qe="HSEINSPECTIONRECEIPTNONFILLINGVEHICLE",$e="HSEINSPECTIONMARINERECEIPTBARGE",ze="HSEINSPECTIONMARINERECEIPTSHIP",Je="HSEINSPECTIONRECEIPTRAILWAGON",Xe="HSEINSPECTIONRECEIPTPIPELINE",ea="SHAREHOLDERAGREEMENT",aa="COATEMPLATE",la="COAMANAGEMENT",ta="COACUSTOMER",ia="COAASSIGNMENT"},35861:(e,a,l)=>{l.d(a,{F1:()=>r,i7:()=>I,r4:()=>s});var t=l(86178),i=l.n(t),n=(l(15660),l(65043),l(70579));function s(e,a){if(Array.isArray(e)){0===e.filter((e=>e.text===a)).length&&e.unshift({value:null,text:a})}return e}function r(){let e=window.navigator.userLanguage||window.navigator.language;return i().locale(e),i().localeData().longDateFormat("L")}function I(e){return(0,n.jsxs)("div",{children:[(0,n.jsx)("span",{children:e}),(0,n.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=6777.dcce6179.chunk.js.map