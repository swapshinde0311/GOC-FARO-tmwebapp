"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[9528,2547,1132,4928,8751,6001,8382,735,3116,3235,5973,8354],{80432:(e,a,l)=>{l.d(a,{E:()=>r});var n=l(65043),t=l(72711),s=l(67907),i=l(70579);function r(e){let{handleDelete:a,handleSave:l,isDeleteEnabled:r,saveEnabled:I,isEnterpriseNode:o,isBCU:E,handleSkipLocalLoadFetch:d}=e;const[N,T]=(0,n.useState)(!1);return(0,i.jsxs)("div",{children:[(0,i.jsx)(s.TranslationConsumer,{children:e=>(0,i.jsx)("div",{className:"row",children:(0,i.jsxs)("div",{className:"col-lg-12 pr-4 mt-2",style:{textAlign:"right"},children:[(0,i.jsx)(t.Button,{content:e("Loadingarm_Delete"),className:!0===o||!0!==r?"cancelENButton":"cancelButton",disabled:!r||!0===o,onClick:()=>{T(!0)}}),(0,i.jsx)(t.Button,{content:e("Save"),disabled:!I||!0===o,onClick:l})]})})}),(0,i.jsx)(s.TranslationConsumer,{children:e=>(0,i.jsxs)(t.Modal,{open:N,size:"small",children:[(0,i.jsx)(t.Modal.Content,{children:(0,i.jsx)("div",{children:(0,i.jsx)("b",{children:e("Confirm_Delete")})})}),(0,i.jsxs)(t.Modal.Footer,{children:[(0,i.jsx)(t.Button,{type:"secondary",content:e("Cancel"),onClick:()=>T(!1)}),(0,i.jsx)(t.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{T(!1),a()}})]})]})})]})}r.defaultProps={saveEnabled:!0,isDeleteEnabled:!1}},43503:(e,a,l)=>{l.d(a,{A:()=>r});l(65043);var n=l(67907),t=l(72711),s=l(70579);function i(e){let{entityCode:a,newEntityName:l,popUpContents:i}=e;return(0,s.jsx)(n.TranslationConsumer,{children:e=>(0,s.jsx)("div",{className:"headerContainer",children:(0,s.jsxs)("div",{className:"row headerSpacing",children:[(0,s.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,s.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===a||void 0===a?e(l):a})}),""!==a&&void 0!==a&&i.length>0?(0,s.jsx)("div",{className:"headerItemRight",children:(0,s.jsx)(t.Popup,{element:(0,s.jsxs)("div",{children:[e(i[0].fieldName)+" ",":"," "+i[0].fieldValue,(0,s.jsx)(t.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,s.jsx)(t.List,{className:"detailsHeaderPopUp",children:i.map((a=>(0,s.jsxs)(t.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(a.fieldName)+" ",":"," "+a.fieldValue]},"content.fieldName")))})})}):""]})})})}i.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const r=i},9256:(e,a,l)=>{l.d(a,{q:()=>i});l(65043);var n=l(72711),t=l(67907),s=l(70579);function i(e){let{handleBack:a,handleSave:l,handleReset:i,saveEnabled:r}=e;return(0,s.jsx)(t.TranslationConsumer,{children:e=>(0,s.jsxs)("div",{className:"row userActionPosition",children:[(0,s.jsx)("div",{className:"col-12 col-md-3 col-lg-4",children:(0,s.jsx)(n.Button,{className:"backButton",onClick:a,content:e("Back")})}),(0,s.jsx)("div",{className:"col-12 col-md-9 col-lg-8",children:(0,s.jsxs)("div",{style:{float:"right"},children:[(0,s.jsx)(n.Button,{content:e("LookUpData_btnReset"),className:"cancelButton",onClick:i}),(0,s.jsx)(n.Button,{content:e("Save"),disabled:!r,onClick:l})]})})]})})}i.defaultProps={saveEnabled:!1}},85800:(e,a,l)=>{l.d(a,{n:()=>I});l(65043);var n=l(72711),t=l(67907),s=l(7523),i=l(35861),r=l(70579);function I(e){let{selectedAttributeList:a,handleCellDataEdit:l,attributeValidationErrors:I}=e;const o=e=>{if("0000-00-00"===e.DefaultValue)return E(e,new Date),new Date;var a=e.DefaultValue.split("-");return new Date(a[0],a[1]-1,a[2])},E=(e,a)=>{var n=new Date(a);a=n.getFullYear()+"-"+("0"+(n.getMonth()+1)).slice(-2)+"-"+("0"+n.getDate()).slice(-2),l(e,a)};return(0,r.jsx)(t.TranslationConsumer,{children:e=>(0,r.jsx)("div",{className:"row",children:(0,r.jsx)("div",{className:"col-md-12 attributeDetails-wrap",children:(0,r.jsx)("div",{className:"row",children:a.map((a=>a.DataType.toLowerCase()===s.pe.STRING.toLowerCase()&&!0===a.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(n.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue?"":a.DefaultValue,indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(I[a.Code]),reserveSpace:!1})}):a.DataType.toLowerCase()!==s.pe.INT.toLowerCase()&&a.DataType.toLowerCase()!==s.pe.LONG.toLowerCase()||!0!==a.IsVisible?a.DataType.toLowerCase()!==s.pe.FLOAT.toLowerCase()&&a.DataType.toLowerCase()!==s.pe.DOUBLE.toLowerCase()||!0!==a.IsVisible?a.DataType.toLowerCase()===s.pe.BOOL.toLowerCase()&&!0===a.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(n.Checkbox,{className:"deviceCheckBox customDeviceCheckBox",label:e(a.DisplayName),checked:null===a.DefaultValue?"":"true"===a.DefaultValue.toString().toLowerCase(),disabled:!0===a.IsReadonly,onChange:e=>l(a,e)})}):a.DataType.toLowerCase()===s.pe.DATETIME.toLowerCase()&&!0===a.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(n.DatePicker,{fluid:!0,value:null===a.DefaultValue||""===a.DefaultValue?"":o(a),label:e(a.DisplayName),displayFormat:(0,i.F1)(),showYearSelector:"true",indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>E(a,e),onTextChange:e=>{E(a,e)},error:e(I[a.Code]),reserveSpace:!1})}):null:(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(n.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue||""===a.DefaultValue?"":a.DefaultValue.toLocaleString(),indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(I[a.Code]),reserveSpace:!1})}):(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(n.Input,{fluid:!0,label:e(a.DisplayName),value:null===a.DefaultValue?"":a.DefaultValue,indicator:!0===a.IsMandatory?"required":null,disabled:!0===a.IsReadonly,onChange:e=>l(a,e),error:e(I[a.Code]),reserveSpace:!1})})))})})})})}},15417:(e,a,l)=>{l.d(a,{$7:()=>x,AN:()=>le,AU:()=>M,Ak:()=>We,Ao:()=>n,B6:()=>Z,C4:()=>ye,CG:()=>$,Ct:()=>Y,Cw:()=>G,EY:()=>p,G$:()=>Ze,G6:()=>Xe,GF:()=>Te,GJ:()=>b,Gj:()=>de,Gl:()=>se,H9:()=>Ke,HB:()=>he,HP:()=>O,Hr:()=>pe,II:()=>ta,IQ:()=>L,Jr:()=>F,Jx:()=>ue,Ki:()=>ae,LP:()=>te,Lv:()=>s,MK:()=>S,MX:()=>ee,Mx:()=>q,N4:()=>we,NH:()=>Pe,OF:()=>Je,Ps:()=>U,Q7:()=>Ye,QY:()=>y,SF:()=>i,Sq:()=>me,Sw:()=>re,TQ:()=>z,U7:()=>h,UH:()=>C,UO:()=>ie,V_:()=>He,Vy:()=>Ve,W9:()=>oe,WN:()=>u,Wr:()=>t,Ww:()=>X,XP:()=>ve,Xk:()=>K,Yb:()=>De,Yy:()=>c,Z2:()=>be,ZN:()=>g,ZO:()=>Re,Zu:()=>Fe,_G:()=>_,_N:()=>d,_u:()=>Ee,ad:()=>Ie,al:()=>Le,ao:()=>V,bK:()=>W,bN:()=>P,cf:()=>j,dO:()=>xe,dU:()=>T,dv:()=>r,eE:()=>Q,g:()=>m,gG:()=>I,gS:()=>Me,gT:()=>la,gW:()=>J,gZ:()=>ze,go:()=>v,gp:()=>B,hq:()=>je,i6:()=>ea,ip:()=>Ne,k9:()=>A,kI:()=>R,l4:()=>Ge,l5:()=>D,lA:()=>w,lU:()=>$e,mD:()=>Be,mY:()=>f,mq:()=>o,n$:()=>na,n7:()=>N,nZ:()=>ge,rA:()=>fe,s$:()=>Ue,s8:()=>ke,se:()=>Se,tA:()=>Oe,vK:()=>aa,vs:()=>Ce,w2:()=>Qe,w4:()=>Ae,wT:()=>E,wY:()=>H,wf:()=>ce,wk:()=>ne,xW:()=>k,yM:()=>_e,yO:()=>qe});const n="driver",t="carriercompany",s="shareholder",i="baseProduct",r="TRAILER",I="TRAILERCOMPARTMENT",o="terminal",E="customer",d="destination",N="finishedproduct",T="tank",c="marine_vessel",A="marine_trailercompartment",C="supplier",S="vehicle",P="vehicletrailer",u="originterminal",L="bay",R="loadingArm",D="cardreader",m="vehicleprimemover",O="meter",p="SHIPMENT",h="SHIPMENTCOMPARTMENT",M="SHIPMENTDESTINATIONCOMPARTMENT",v="SHIPMENTDETAILS",H="SHIPMENTTRAILERWEIGHBRIDGE",x="SHIPMENTTRAILER",g="SHIPMENTSTATUSTIME",j="MARINEDISPATCH",w="MARINEDISPATCHCOMPARTMENTDETAIL",b="railwagon",G="primemover",f="bcu",y="RAILRECEIPTPLAN",U="RAILRECEIPTWAGONDETAILPLAN",V="RAILUNLOADINGDETAILSFP",B="RAILUNLOADINGDETAILSBP",k="RAILUNLOADINGDETAILSADDITIVE",F="RAILDISPATCHPLAN",W="RAILDISPATCHITEM",_="RAILDISPATCHSTATUSCHANGE",q="RAILDISPATCHWAGON",Y="RAILDISPATCHWAGONDETAILPLAN",K="RAILDISPATCHWAGONWEIGHBRIDGE",Z="RAILDISPATCHWAGONCOMPARTMENT",Q="RAILLOADINGDETAILSFP",$="RAILLOADINGDETAILSBP",J="RAILLOADINGDETAILSADDITIVE",X="marineReceipt",z="UNACCOUNTEDMETERTRANSACTION",ee="UNACCOUNTEDTANKTRANSACTION",ae="marineLoadingDetailsFP",le="marineLoadingDetailsAdditive",ne="marineLoadingDetailsBP",te="marineReceiptCompartmentDetail",se="marineUnloadingDetailsFP",ie="marineUnloadingDetailsBP",re="accessCard",Ie="LOADINGDETAILSFP",oe="LOADINGDETAILSBP",Ee="LOADINGDETAILSADDITIVE",de="MARINERECEIPTSTATUSTIME",Ne="MARINEDISPATCHSTATUSTIME",Te="RECEIPT",ce="UNLOADINGTRANSACTIONS",Ae="ORDER",Ce="ORDERITEM",Se="CONTRACT",Pe="CONTRACT_ITEM",ue="RECEIPTORIGINTERMINALCOMPARTMENT",Le="GeneralTMUser_CAPTAIN",Re="weighbridge",De="deu",me="GeneralTMUser_STAFF",Oe="GeneralTMUser_VISITOR",pe="PIPELINEHEADER",he="SEALMASTER",Me="PIPELINERECEIPT",ve="ROADSHIPMENTSLOTINFO",He="ROADRECEIPTSLOTINFO",xe="MARINESHIPMENTSLOTINFO",ge="MARINERECEIPTSLOTINFO",je="PIPELINEDISPATCH",we="PIPELINETRANSACTIONS",be="PIPELINEDISPATCHSTATUSTIME",Ge="PIPELINERECEIPTSTATUSTIME",fe="PROCESSCONFIG",ye="PRODUCTALLOCATIONITEM",Ue="HSEINSPECTIONSHIPMENTRIGIDTRUCK",Ve="HSEINSPECTIONSHIPMENTTRAILER",Be="HSEINSPECTIONSHIPMENTPRIMEMOVER",ke="HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE",Fe="HSEINSPECTIONMARINESHIPMENTBARGE",We="HSEINSPECTIONMARINESHIPMENTSHIP",_e="HSEINSPECTIONSHIPMENTRAILWAGON",qe="HSEINSPECTIONSHIPMENTPIPELINE",Ye="HSEINSPECTIONRECEIPTRIGIDTRUCK",Ke="HSEINSPECTIONRECEIPTTRAILER",Ze="HSEINSPECTIONRECEIPTPRIMEMOVER",Qe="HSEINSPECTIONRECEIPTNONFILLINGVEHICLE",$e="HSEINSPECTIONMARINERECEIPTBARGE",Je="HSEINSPECTIONMARINERECEIPTSHIP",Xe="HSEINSPECTIONRECEIPTRAILWAGON",ze="HSEINSPECTIONRECEIPTPIPELINE",ea="SHAREHOLDERAGREEMENT",aa="COATEMPLATE",la="COAMANAGEMENT",na="COACUSTOMER",ta="COAASSIGNMENT"},35861:(e,a,l)=>{l.d(a,{F1:()=>r,i7:()=>I,r4:()=>i});var n=l(86178),t=l.n(n),s=(l(15660),l(65043),l(70579));function i(e,a){if(Array.isArray(e)){0===e.filter((e=>e.text===a)).length&&e.unshift({value:null,text:a})}return e}function r(){let e=window.navigator.userLanguage||window.navigator.language;return t().locale(e),t().localeData().longDateFormat("L")}function I(e){return(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{children:e}),(0,s.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=9528.e0b2a1ad.chunk.js.map