"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[2577],{12577:(e,t,i)=>{i.r(t),i.d(t,{default:()=>M});var a=i(65043),l=i(78374),r=i(67907),o=i(72711),s=i(40854),n=i.n(s),d=i(7523),c=i(72067),T=i(69062),A=i(50805),E=i(9966),I=i(97508),N=i(53536),m=i.n(N),p=i(46100),u=i(45127),R=i(728),C=i(15417),S=i(70579);R.setLicenseKey(d.yQ);class D extends a.Component{constructor(){super(...arguments),this.state={receiptViewAuditTrailData:[],modReceiptViewAuditTrailData:[],openPrint:!1,auditTrailAttributeMetaDataList:[],compartmentDetailsPageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,ViewAuditTrailList:[]},this.handlePrint=()=>{try{this.setState({openPrint:!0},(()=>{}))}catch(e){console.log("MarineReceiptViewAuditTrailDetailsComposite:Error occured on handlePrint",e)}}}getReceiptViewAuditTrail(e){void 0!==e?n()(c.k9J+"?ShareholderCode="+this.props.userDetails.EntityResult.PrimaryShareholder+"&MarineReceiptCode="+e,T.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess?this.setState({receiptViewAuditTrailData:m().cloneDeep(t.EntityResult),modReceiptViewAuditTrailData:m().cloneDeep(t.EntityResult)}):this.setState({receiptViewAuditTrailData:m().cloneDeep(p.Gi),modReceiptViewAuditTrailData:m().cloneDeep(p.Gi)});var i=m().cloneDeep(this.state.modReceiptViewAuditTrailData),a=m().cloneDeep(this.state.receiptViewAuditTrailData);for(let r=0;r<i.length;r++){let e=i[r].ReceiptStatus;e===d.oO.AUTO_UNLOADED?e=d.cG.AUTO_UNLOADED:e===d.oO.CLOSED?e=d.cG.CLOSED:e===d.oO.INTERRUPTED?e=d.cG.INTERRUPTED:e===d.oO.UNLOADING?e=d.cG.UNLOADING:e===d.oO.MANUALLY_UNLOADED?e=d.cG.MANUALLY_UNLOADED:e===d.oO.PARTIALLY_UNLOADED?e=d.cG.PARTIALLY_UNLOADED:e===d.oO.QUEUED?e=d.cG.QUEUED:e===d.oO.READY&&(e=d.cG.READY),i[r].ReceiptStatus=e,i[r].UpdatedTime=new Date(i[r].UpdatedTime).toLocaleDateString()+" "+new Date(i[r].UpdatedTime).toLocaleTimeString(),this.setState({receiptViewAuditTrailData:a,modReceiptViewAuditTrailData:i})}var l=m().cloneDeep(this.state.receiptViewAuditTrailData);for(let r=0;r<l.length;r++)l[r].AttributesforUI=this.formReadonlyCompAttributes(l[r].Attributes,this.state.auditTrailAttributeMetaDataList);this.setState({ViewAuditTrailList:l})})).catch((e=>{console.log("Error while getting MarineReceiptViewAuditTrail:",e)})):this.setState({receiptViewAuditTrailData:[],modReceiptViewAuditTrailData:[]})}formReadonlyCompAttributes(e,t){let i=[];return null!==t&&void 0!==t&&t.length>0&&t.forEach((e=>{e.attributeMetaDataList.forEach((e=>{i.push({AttributeCode:e.Code,AttributeName:e.DisplayName?e.DisplayName:e.Code,AttributeValue:e.DefaultValue,TerminalCode:e.TerminalCode,IsMandatory:e.IsMandatory,DataType:e.DataType,IsReadonly:e.IsReadonly,MinValue:e.MinValue,MaxValue:e.MaxValue,ValidationFormat:e.ValidationFormat,compSequenceNo:""})}))})),null!==e&&void 0!==e&&e.length>0&&e.forEach((e=>{i.forEach((t=>{t.TerminalCode===e.TerminalCode&&e.ListOfAttributeData.forEach((e=>{t.AttributeCode===e.AttributeCode&&(t.AttributeValue=e.AttributeValue)}))}))})),i}componentDidMount(){try{T.pJ(this.props.userDetails.EntityResult.IsArchived),this.getAttributes()}catch(e){console.log("MarineReceiptViewAuditTrailDetailsComposite:Error occured on componentDidMount",e)}}getAttributes(){try{n()(c.fKH,T.tW([C.Gj],this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess?(null!==t.EntityResult.MARINERECEIPTSTATUSTIME&&void 0!==t.EntityResult.MARINERECEIPTSTATUSTIME||(t.EntityResult.MARINERECEIPTSTATUSTIME=[]),this.setState({auditTrailAttributeMetaDataList:m().cloneDeep(t.EntityResult.MARINERECEIPTSTATUSTIME)},(()=>{this.getReceiptViewAuditTrail(this.props.receiptCode)}))):console.log("Failed to get Attributes")}))}catch(e){console.log("Error while getting Attributes:",e)}}displayTMModalforPrintConfirm(){return(0,S.jsx)(r.TranslationConsumer,{children:e=>(0,S.jsx)(o.Modal,{onClose:()=>this.setState({openPrint:!1}),open:this.state.openPrint,className:"marineModalPrint",closeOnDimmerClick:!1,children:(0,S.jsxs)(o.Modal.Content,{children:[(0,S.jsx)("div",{className:"col col-md-8 col-lg-9 col col-xl-9",children:(0,S.jsx)("h3",{children:e("ViewMarineReceiptAuditTrail_ViewAuditTrailForMarineReceipt")+" : "+this.props.receiptCode})}),(0,S.jsx)("div",{className:"col-md-10 container-fluid",children:(0,S.jsxs)(u.IO,{itemsSource:this.state.modReceiptViewAuditTrailData,chartType:"Line",bindingX:"UpdatedTime",palette:["red"],style:{width:"100%",height:"450px"},children:[(0,S.jsx)(u.tN,{position:"Bottom"}),(0,S.jsx)(u.vc,{wjProperty:"axisY",majorUnit:1,max:7,min:0,itemFormatter:L,axisLine:!0}),(0,S.jsx)(u.t3,{binding:"ReceiptStatus",name:e("ReceiptStatus")})]})}),(0,S.jsx)("div",{className:"col-12 detailsTable",id:"printTable",children:(0,S.jsxs)(l.bQ,{data:this.state.ViewAuditTrailList,children:[(0,S.jsx)(l.bQ.Column,{className:"compColHeight",field:"ReceiptStatus",header:e("ReceiptStatus"),editable:!1,editFieldType:"text"},"ReceiptStatus"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight",field:"UpdatedTime",renderer:e=>h(e.rowData.UpdatedTime),header:e("SAAuditTrial_UpdatedTime"),editable:!1,editFieldType:"text"},"UpdatedTime"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight",field:"CompartmentSeqNoInVehicle",header:e("ViewMarineReceiptAuditTrail_ReceiptCompartmentSeq"),editable:!1,editFieldType:"text"},"CompartmentSeqNoInVehicle"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight",field:"ReceiptCompartmentStatus",renderer:e=>P(e.rowData.ReceiptCompartmentStatus),header:e("ViewMarineReceiptAuditTrail_ReceiptCompartmentStatus"),editable:!1,editFieldType:"text"},"ReceiptCompartmentStatus"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight",field:"UserPIN",header:e("PIN"),editable:!1,editFieldType:"text"},"UserPIN"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight",field:"OfficerName",header:e("ViewAuditTrail_OfficerName"),editable:!1,editFieldType:"text"},"OfficerName"),void 0!==this.state.ViewAuditTrailList&&this.state.ViewAuditTrailList.length>0?this.state.ViewAuditTrailList[0].AttributesforUI.map((t=>(0,S.jsx)(l.bQ.Column,{className:"compColHeight",header:e(t.AttributeName),editable:!1,renderer:O}))):[]]})}),(0,S.jsx)(o.Modal.Footer,{children:(0,S.jsxs)("div",{className:"viewPrint",children:[(0,S.jsx)(o.Button,{type:"secondary",size:"small",content:e("MarineEOD_Close"),onClick:()=>{this.setState({openPrint:!1})}}),(0,S.jsx)(o.Button,{type:"primary",size:"small",content:e("EOD_Print"),onClick:()=>{let t=window.document.getElementById("printTable").innerHTML;const i=window.document.createElement("IFRAME");let a=null;window.document.body.appendChild(i),a=i.contentWindow.document;const l=t.substring(0,t.indexOf("<table")+6),r=t.substring(t.indexOf("<table")+6,t.length);t=e("ViewMarineReceiptAuditTrail_ViewAuditTrailForMarineReceipt")+" : "+this.props.receiptCode+l+' border="1" cellspacing="0"'+r,t=t.replace('<tfoot class="p-datatable-tfoot">',""),t=t.replace('<tr><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td><td class="compColHeight"></td></tr>',""),a.write(t),console.info(t),a.close(),i.contentWindow.focus(),i.contentWindow.print(),setTimeout((()=>{document.body.removeChild(i)}),2e3)}})]})})]})})})}render(){return(0,S.jsxs)("div",{children:[(0,S.jsx)(r.TranslationConsumer,{children:e=>(0,S.jsx)("div",{children:(0,S.jsxs)("div",{className:"detailsContainer",children:[(0,S.jsx)("div",{className:"row",children:(0,S.jsx)("div",{className:"col-12",children:(0,S.jsx)("h3",{children:e("ViewMarineReceiptAuditTrail_ViewAuditTrailForMarineReceipt")+" : "+this.props.receiptCode})})}),(0,S.jsx)("div",{className:"row marginRightZero tableScroll",children:(0,S.jsx)("div",{className:"col-12 container-fluid",children:(0,S.jsxs)(u.IO,{itemsSource:this.state.modReceiptViewAuditTrailData,chartType:"Line",bindingX:"UpdatedTime",palette:["red"],style:{width:"100%",minWidth:"800px",height:"450px"},children:[(0,S.jsx)(u.tN,{position:"Bottom"}),(0,S.jsx)(u.vc,{wjProperty:"axisY",majorUnit:1,max:7,min:0,itemFormatter:L,axisLine:!0}),(0,S.jsx)(u.t3,{binding:"ReceiptStatus",name:e("ReceiptStatus")})]})})}),(0,S.jsx)("div",{className:"row marginRightZero tableScroll",children:(0,S.jsx)("div",{className:"col-12 detailsTable",children:(0,S.jsxs)(l.bQ,{data:this.state.ViewAuditTrailList,children:[(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",field:"ReceiptStatus",header:e("ReceiptStatus"),editable:!1,editFieldType:"text"},"ReceiptStatus"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",field:"UpdatedTime",renderer:e=>h(e.rowData.UpdatedTime),header:e("SAAuditTrial_UpdatedTime"),editable:!1,editFieldType:"text"},"UpdatedTime"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",field:"CompartmentSeqNoInVehicle",header:e("ViewMarineReceiptAuditTrail_ReceiptCompartmentSeq"),editable:!1,editFieldType:"text"},"CompartmentSeqNoInVehicle"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",field:"ReceiptCompartmentStatus",renderer:e=>P(e.rowData.ReceiptCompartmentStatus),header:e("ViewMarineReceiptAuditTrail_ReceiptCompartmentStatus"),editable:!1,editFieldType:"text"},"ReceiptCompartmentStatus"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",field:"UserPIN",header:e("PIN"),editable:!1,editFieldType:"text"},"UserPIN"),(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",field:"OfficerName",header:e("ViewAuditTrail_OfficerName"),editable:!1,editFieldType:"text"},"OfficerName"),void 0!==this.state.ViewAuditTrailList&&this.state.ViewAuditTrailList.length>0?this.state.ViewAuditTrailList[0].AttributesforUI.map((t=>(0,S.jsx)(l.bQ.Column,{className:"compColHeight colminWidth",header:e(t.AttributeName),editable:!1,renderer:O}))):[]]})})}),(0,S.jsxs)("div",{className:"row",children:[(0,S.jsx)("div",{className:"col-12 col-sm-6 col-lg-8",children:(0,S.jsx)(o.Button,{className:"backButton",onClick:this.props.handleBack,content:e("Back")})}),this.props.userDetails.EntityResult.IsWebPortalUser?[]:(0,S.jsx)("div",{className:"col-12 col-sm-6 col-lg-4",style:{textAlign:"right"},children:(0,S.jsx)(o.Button,{className:"printButton",onClick:this.handlePrint,content:e("ViewEAAuditTrail_PrintAuditTrail")})})]})]})})}),this.displayTMModalforPrintConfirm()]})}}const h=e=>{try{return null==e||""===e||void 0===e?"":new Date(e).toLocaleDateString()+" "+new Date(e).toLocaleTimeString()}catch(t){return""}},L=(e,t)=>(t.cls=null,e.fontSize="7px",t.val===d.cG.AUTO_UNLOADED?t.text=d.oO.AUTO_UNLOADED:t.val===d.cG.CLOSED?t.text=d.oO.CLOSED:t.val===d.cG.INTERRUPTED?t.text=d.oO.INTERRUPTED:t.val===d.cG.UNLOADING?t.text=d.oO.UNLOADING:t.val===d.cG.MANUALLY_UNLOADED?t.text=d.oO.MANUALLY_UNLOADED:t.val===d.cG.PARTIALLY_UNLOADED?t.text=d.oO.PARTIALLY_UNLOADED:t.val===d.cG.QUEUED?t.text=d.oO.QUEUED:t.val===d.cG.READY&&(t.text=d.oO.READY),t),P=e=>{try{return 0===e&&null!==e?d.gB.COMPLETED.toLocaleString():1===e&&null!==e?d.gB.EMPTY.toLocaleString():2===e&&null!==e?d.gB.FORCE_COMPLETED.toLocaleString():3===e&&null!==e?d.gB.INTERRUPTED.toLocaleString():4===e&&null!==e?d.gB.OVER_UNLOADED.toLocaleString():5===e&&null!==e?d.gB.PART_UNLOADED.toLocaleString():6===e&&null!==e?d.gB.UNLOAD_NOTSTARTED.toLocaleString():7===e&&null!==e?d.gB.UNLOADING.toLocaleString():e}catch(t){return e}},O=e=>{try{const t=e.rowData.AttributesforUI.filter((t=>t.AttributeName===e.name))[0];return t.DataType.toLowerCase()===d.pe.STRING.toLowerCase()||t.DataType.toLowerCase()===d.pe.INT.toLowerCase()||t.DataType.toLowerCase()===d.pe.LONG.toLowerCase()||t.DataType.toLowerCase()===d.pe.FLOAT.toLowerCase()?(0,S.jsx)("label",{children:t.AttributeValue}):t.DataType.toLowerCase()===d.pe.BOOL.toLowerCase()?(0,S.jsx)(o.Checkbox,{checked:"true"===t.AttributeValue.toString().toLowerCase(),disabled:!0}):(0,S.jsx)("label",{children:new Date(t.AttributeValue).toLocaleDateString()})}catch(t){return""}},M=(0,I.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})),(e=>({userActions:(0,A.zH)(E,e)})))(D)},15417:(e,t,i)=>{i.d(t,{$7:()=>U,AN:()=>ie,AU:()=>M,Ak:()=>We,Ao:()=>a,B6:()=>K,C4:()=>fe,CG:()=>z,Ct:()=>Y,Cw:()=>V,EY:()=>P,G$:()=>Ke,G6:()=>Xe,GF:()=>Ee,GJ:()=>G,Gj:()=>Te,Gl:()=>re,H9:()=>qe,HB:()=>Oe,HP:()=>L,Hr:()=>Pe,II:()=>lt,IQ:()=>C,Jr:()=>B,Jx:()=>Re,Ki:()=>te,LP:()=>le,Lv:()=>r,MK:()=>p,MX:()=>ee,Mx:()=>Q,N4:()=>He,NH:()=>ue,OF:()=>Je,Ps:()=>j,Q7:()=>Ye,QY:()=>f,SF:()=>o,Sq:()=>he,Sw:()=>se,TQ:()=>$,U7:()=>O,UH:()=>m,UO:()=>oe,V_:()=>we,Vy:()=>ve,W9:()=>de,WN:()=>R,Wr:()=>l,Ww:()=>X,XP:()=>ge,Xk:()=>q,Yb:()=>De,Yy:()=>I,Z2:()=>Ge,ZN:()=>b,ZO:()=>Se,Zu:()=>Be,_G:()=>k,_N:()=>T,_u:()=>ce,ad:()=>ne,al:()=>Ce,ao:()=>v,bK:()=>W,bN:()=>u,cf:()=>x,dO:()=>Ue,dU:()=>E,dv:()=>s,eE:()=>Z,g:()=>h,gG:()=>n,gS:()=>Me,gT:()=>it,gW:()=>J,gZ:()=>$e,go:()=>g,gp:()=>F,hq:()=>xe,i6:()=>et,ip:()=>Ae,k9:()=>N,kI:()=>S,l4:()=>Ve,l5:()=>D,lA:()=>H,lU:()=>ze,mD:()=>Fe,mY:()=>y,mq:()=>d,n$:()=>at,n7:()=>A,nZ:()=>be,rA:()=>ye,s$:()=>je,s8:()=>_e,se:()=>pe,tA:()=>Le,vK:()=>tt,vs:()=>me,w2:()=>Ze,w4:()=>Ne,wT:()=>c,wY:()=>w,wf:()=>Ie,wk:()=>ae,xW:()=>_,yM:()=>ke,yO:()=>Qe});const a="driver",l="carriercompany",r="shareholder",o="baseProduct",s="TRAILER",n="TRAILERCOMPARTMENT",d="terminal",c="customer",T="destination",A="finishedproduct",E="tank",I="marine_vessel",N="marine_trailercompartment",m="supplier",p="vehicle",u="vehicletrailer",R="originterminal",C="bay",S="loadingArm",D="cardreader",h="vehicleprimemover",L="meter",P="SHIPMENT",O="SHIPMENTCOMPARTMENT",M="SHIPMENTDESTINATIONCOMPARTMENT",g="SHIPMENTDETAILS",w="SHIPMENTTRAILERWEIGHBRIDGE",U="SHIPMENTTRAILER",b="SHIPMENTSTATUSTIME",x="MARINEDISPATCH",H="MARINEDISPATCHCOMPARTMENTDETAIL",G="railwagon",V="primemover",y="bcu",f="RAILRECEIPTPLAN",j="RAILRECEIPTWAGONDETAILPLAN",v="RAILUNLOADINGDETAILSFP",F="RAILUNLOADINGDETAILSBP",_="RAILUNLOADINGDETAILSADDITIVE",B="RAILDISPATCHPLAN",W="RAILDISPATCHITEM",k="RAILDISPATCHSTATUSCHANGE",Q="RAILDISPATCHWAGON",Y="RAILDISPATCHWAGONDETAILPLAN",q="RAILDISPATCHWAGONWEIGHBRIDGE",K="RAILDISPATCHWAGONCOMPARTMENT",Z="RAILLOADINGDETAILSFP",z="RAILLOADINGDETAILSBP",J="RAILLOADINGDETAILSADDITIVE",X="marineReceipt",$="UNACCOUNTEDMETERTRANSACTION",ee="UNACCOUNTEDTANKTRANSACTION",te="marineLoadingDetailsFP",ie="marineLoadingDetailsAdditive",ae="marineLoadingDetailsBP",le="marineReceiptCompartmentDetail",re="marineUnloadingDetailsFP",oe="marineUnloadingDetailsBP",se="accessCard",ne="LOADINGDETAILSFP",de="LOADINGDETAILSBP",ce="LOADINGDETAILSADDITIVE",Te="MARINERECEIPTSTATUSTIME",Ae="MARINEDISPATCHSTATUSTIME",Ee="RECEIPT",Ie="UNLOADINGTRANSACTIONS",Ne="ORDER",me="ORDERITEM",pe="CONTRACT",ue="CONTRACT_ITEM",Re="RECEIPTORIGINTERMINALCOMPARTMENT",Ce="GeneralTMUser_CAPTAIN",Se="weighbridge",De="deu",he="GeneralTMUser_STAFF",Le="GeneralTMUser_VISITOR",Pe="PIPELINEHEADER",Oe="SEALMASTER",Me="PIPELINERECEIPT",ge="ROADSHIPMENTSLOTINFO",we="ROADRECEIPTSLOTINFO",Ue="MARINESHIPMENTSLOTINFO",be="MARINERECEIPTSLOTINFO",xe="PIPELINEDISPATCH",He="PIPELINETRANSACTIONS",Ge="PIPELINEDISPATCHSTATUSTIME",Ve="PIPELINERECEIPTSTATUSTIME",ye="PROCESSCONFIG",fe="PRODUCTALLOCATIONITEM",je="HSEINSPECTIONSHIPMENTRIGIDTRUCK",ve="HSEINSPECTIONSHIPMENTTRAILER",Fe="HSEINSPECTIONSHIPMENTPRIMEMOVER",_e="HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE",Be="HSEINSPECTIONMARINESHIPMENTBARGE",We="HSEINSPECTIONMARINESHIPMENTSHIP",ke="HSEINSPECTIONSHIPMENTRAILWAGON",Qe="HSEINSPECTIONSHIPMENTPIPELINE",Ye="HSEINSPECTIONRECEIPTRIGIDTRUCK",qe="HSEINSPECTIONRECEIPTTRAILER",Ke="HSEINSPECTIONRECEIPTPRIMEMOVER",Ze="HSEINSPECTIONRECEIPTNONFILLINGVEHICLE",ze="HSEINSPECTIONMARINERECEIPTBARGE",Je="HSEINSPECTIONMARINERECEIPTSHIP",Xe="HSEINSPECTIONRECEIPTRAILWAGON",$e="HSEINSPECTIONRECEIPTPIPELINE",et="SHAREHOLDERAGREEMENT",tt="COATEMPLATE",it="COAMANAGEMENT",at="COACUSTOMER",lt="COAASSIGNMENT"}}]);
//# sourceMappingURL=2577.7be62503.chunk.js.map