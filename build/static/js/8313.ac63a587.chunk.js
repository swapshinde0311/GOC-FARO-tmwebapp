"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[8313,6001,8382,735,3116,3235,5973,8354],{78313:(e,t,a)=>{a.r(t),a.d(t,{default:()=>P});var s=a(65043),n=a(67907),i=a(72711),o=a(35861),r=a(65187),l=a(85800),c=a(70579);function d(e){let{modAccountedTransaction:t,listOptions:a,validationErrors:s,onFieldChange:d,onCustomerSearchChange:u,isEnterpriseNode:h,selectedAttributeList:T,attributeValidationErrors:E,handleCellDataEdit:p}=e;const A=(e,t)=>{let a=[];return a=e.find((e=>e.TerminalCode===t)),a.attributeValidationErrors};return(0,c.jsx)(n.TranslationConsumer,{children:e=>(0,c.jsxs)("div",{className:"detailsContainer",children:[(0,c.jsxs)("div",{className:"row",children:[(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",label:e("Reconciliation_Tank"),indicator:"required",value:t.TankCode,options:a.tankCodeOptions,onChange:e=>d("TankCode",e),reserveSpace:!1,error:e(s.TankCode),noResultsMessage:e("noResultsMessage")})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",label:e("Reconciliation_UnAccountedType"),indicator:"required",options:a.transactionTypeOptions,reserveSpace:!1,onChange:e=>d("UnAccountedTransactionTypeCode",e),value:t.UnAccountedTransactionTypeCode,error:e(s.UnAccountedTransactionTypeCode),noResultsMessage:e("noResultsMessage")})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",label:e("Vehicle_Transport"),indicator:"required",options:a.transportationTypeOptions,onChange:e=>d("TransportationType",e),value:t.TransportationType,error:e(s.TransportationType),reserveSpace:!1})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",label:e("Reconciliation_QuantityUOM"),indicator:"required",onChange:e=>d("QuantityUOM",e),search:!0,options:a.quantityUOMOptions,reserveSpace:!1,value:t.QuantityUOM,error:e(s.QuantityUOM)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Input,{fluid:!0,indicator:"required",label:e("GrossQuantity"),onChange:e=>d("UnAccountedGrossQuantity",e),reserveSpace:!1,value:t.UnAccountedGrossQuantity,error:e(s.UnAccountedGrossQuantity)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Input,{fluid:!0,indicator:"required",label:e("Reconciliation_NetQuantity"),onChange:e=>d("UnAccountedNetQuantity",e),reserveSpace:!1,value:t.UnAccountedNetQuantity,error:e(s.UnAccountedNetQuantity)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Input,{fluid:!0,indicator:"required",label:e("Reconciliation_Density"),onChange:e=>d("Density",e),reserveSpace:!1,value:t.Density,error:e(s.Density)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",label:e("Reconciliation_DensityUOM"),indicator:"required",options:a.densityUOMOptions,reserveSpace:!1,search:!0,onChange:e=>d("DensityUOM",e),value:t.DensityUOM,error:e(s.DensityUOM)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.DatePicker,{fluid:!0,label:e("Reconciliation_StartTime"),type:"datetime",minuteStep:"5",indicator:"required",onChange:e=>d("TransactionStartTime",e),displayFormat:(0,o.F1)(),reserveSpace:!1,value:t.TransactionStartTime,error:e(s.TransactionStartTime)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.DatePicker,{fluid:!0,label:e("Reconciliation_EndTime"),type:"datetime",minuteStep:"5",indicator:"required",onChange:e=>d("TransactionEndTime",e),displayFormat:(0,o.F1)(),reserveSpace:!1,value:null===t.TransactionEndTime?"":t.TransactionEndTime,error:e(s.TransactionEndTime)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",label:e("Reconciliation_BaseProduct"),indicator:"required",options:a.baseProdcutOptions,reserveSpace:!1,onChange:e=>d("BaseProductCode",e),value:t.BaseProductCode,error:e(s.BaseProductCode)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Input,{fluid:!0,label:e("Reconciliation_Comments"),onChange:e=>d("Comments",e),reserveSpace:!1,value:t.Comments,error:e(s.Comments)})}),(0,c.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,c.jsx)(i.Select,{fluid:!0,placeholder:"Select",options:a.customerOptions,label:e("ViewMarineShipmentList_Customer"),search:!0,onChange:e=>d("CustomerCode",e),onSearch:u,reserveSpace:!1,value:t.CustomerCode,error:e(s.CustomerCode)})})]}),T.length>0?T.map((t=>(0,c.jsx)(r.A,{children:(0,c.jsx)(i.Accordion,{children:(0,c.jsx)(i.Accordion.Content,{className:"attributeAccordian",title:h?t.TerminalCode+" - "+e("Attributes_Header"):e("Attributes_Header"),children:(0,c.jsx)(l.n,{selectedAttributeList:t.attributeMetaDataList,handleCellDataEdit:p,attributeValidationErrors:A(E,t.TerminalCode)})})})}))):null]})})}d.defaultProps={listOptions:{quantityUOMOptions:[],densityUOMOptions:[],tankCodeOptions:[],customerOptions:[],transactionTypeOptions:[],baseProdcutOptions:[],transportationTypeOptions:[]}};var u=a(9256),h=a(69062),T=a(40854),E=a.n(T),p=a(7523),A=a(72067),C=a(9966),I=a(50805),m=a(97508),N=(a(38726),a(43503)),S=a(44192),D=a(80312),y=a(53536),O=a.n(y),R=a(46100),L=a(40252),v=a(15417),g=a(62900);class b extends s.Component{constructor(){super(...arguments),this.state={AccountedTransaction:O().cloneDeep(R.o7),modAccountedTransaction:O().cloneDeep(R.o7),isReadyToRender:!0,saveEnabled:!1,tankCodeOptions:[],transactionTypeOptions:[],baseProdcutOptions:[],quantityUOMOptions:[],transportationTypeOptions:[],customerOptions:[],densityUOMOptions:[],customerSearchOptions:[],attributeMetaDataList:[],selectedAttributeList:[],attributeValidationErrors:[],validationErrors:h.Th(S.kC),showAuthenticationLayout:!1,tempAccountedTransaction:{}},this.handleReset=()=>{try{const e={...this.state.validationErrors},t=O().cloneDeep(this.state.AccountedTransaction);Object.keys(e).forEach((function(t){e[t]=""})),this.setState({modAccountedTransaction:{...t},validationErrors:e,selectedAttributeList:[]},(()=>{this.props.userDetails.EntityResult.IsEnterpriseNode?(this.terminalSelectionChange([]),this.handleResetAttributeValidationError()):(this.localNodeAttribute(),this.handleResetAttributeValidationError())}))}catch(e){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on handleReset",e)}},this.componentWillReceiveProps=e=>{try{""!==this.state.AccountedTransaction.TankCode&&void 0===e.selectedRow.Common_Code&&this.props.tokenDetails.tokenInfo===e.tokenDetails.tokenInfo&&this.setState({modAccountedTransaction:R.o7,AccountedTransaction:R.o7,saveEnabled:!0,selectedAttributeList:[]},(()=>{this.props.userDetails.EntityResult.IsEnterpriseNode?(this.terminalSelectionChange([]),this.handleResetAttributeValidationError()):(this.localNodeAttribute(),this.handleResetAttributeValidationError())}))}catch(t){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on componentWillReceiveProps",t)}},this.handleCustomerSearchChange=e=>{try{let t=this.state.customerOptions.filter((t=>t.value.toLowerCase().includes(e.toLowerCase())));t.length>p.bM&&(t=t.slice(0,p.bM)),this.setState({customerSearchOptions:t})}catch(t){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on handleDriverSearchChange",t)}},this.handleChange=(e,t)=>{try{const a=O().cloneDeep(this.state.modAccountedTransaction),s=O().cloneDeep(this.state.validationErrors);a[e]=t,this.setState({modAccountedTransaction:a}),void 0!==S.kC[e]&&(s[e]=h.jr(S.kC[e],t),this.setState({validationErrors:s}))}catch(a){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on handleChange",a)}},this.handleAddTransaction=()=>{let e=O().cloneDeep(this.state.tempAccountedTransaction);this.createAccountedTransaction(e)},this.handleSave=()=>{try{let e=this.fillDetails(),t=h.pI(this.state.selectedAttributeList);if(this.validateSave(t)){e=this.convertStringtoDecimal(e,t);let a=!0!==this.props.userDetails.EntityResult.IsWebPortalUser,s=O().cloneDeep(e);this.setState({showAuthenticationLayout:a,tempAccountedTransaction:s},(()=>{!1===a&&this.handleAddTransaction()}))}else this.setState({saveEnabled:!0})}catch(e){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on handleSave",e)}},this.handleCellDataEdit=(e,t)=>{try{e.DefaultValue=t,this.setState({attribute:e});const a=O().cloneDeep(this.state.attributeValidationErrors);a.forEach((a=>{a.TerminalCode===e.TerminalCode&&(a.attributeValidationErrors[e.Code]=h.I5(e,t))})),this.setState({attributeValidationErrors:a})}catch(a){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on handleCellDataEdit",a)}},this.handleAuthenticationClose=()=>{this.setState({showAuthenticationLayout:!1})}}GetUOMList(){E()(A.WFM,h.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){if(null!==t.EntityResult){let e=[],a=[];if(Array.isArray(t.EntityResult.VOLUME)&&(e=h.Zj(t.EntityResult.VOLUME)),Array.isArray(t.EntityResult.MASS)){h.Zj(t.EntityResult.MASS).forEach((t=>e.push(t)))}Array.isArray(t.EntityResult.DENSITY)&&(a=h.Zj(t.EntityResult.DENSITY)),this.setState({quantityUOMOptions:e,densityUOMOptions:a})}}else console.log("UnAccountedTransactionTankDetailsComposite:Error in GetUOMList:",t.ErrorList)})).catch((e=>{console.log("UnAccountedTransactionTankDetailsComposite:Error while getting GetUOMList:",e)}))}componentDidMount(){try{h.pJ(this.props.userDetails.EntityResult.IsArchived),this.getAttributes(),this.GetUOMList(),this.GetTankList(),this.GetBaseProductsList(),this.GetUnAccountedTransactionTypeList(),this.GetCustomerList(),this.GetTransportationTypeOptions();let e=O().cloneDeep(this.state.modAccountedTransaction);e.ShareholderCode=this.props.selectedShareholder,this.setState({saveEnabled:h.ab(this.props.userDetails.EntityResult.FunctionsList,D.i.add,D.Ow),modAccountedTransaction:e})}catch(e){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on componentDidMount",e)}}GetCustomerList(){let e=O().cloneDeep(this.state.modAccountedTransaction);E()(A.E6k+"?TransportationType="+e.TransportationType+"&ShareholderCode="+this.props.selectedShareholder,h.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess)if(Array.isArray(t.EntityResult)){let e=t.EntityResult.filter((e=>e.ShareholderCode===this.props.selectedShareholder));if(e.length>0){let t=e[0].CustomerDestinationsList,a=[];null!==t&&(a=Object.keys(t),a=h.Zj(a)),this.setState({customerOptions:a})}else console.log("UnAccountedTransactionTankDetailsComposite:no customers identified for shareholder")}else console.log("UnAccountedTransactionTankDetailsComposite:customerdestinations not identified for shareholder")}))}GetTransportationTypeOptions(){const e=[];for(let t in p.LY)t!==p.LY.PIPELINE&&e.push(t);this.setState({transportationTypeOptions:h.Zj(e)})}GetTankList(){E()(A.Ibp+"?ShareholderCode="+this.props.selectedShareholder,h.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){let e=[];null!==t.EntityResult&&(e=h.Zj(t.EntityResult)),this.setState({tankCodeOptions:e})}else console.log("UnAccountedTransactionTankDetailsComposite:Error in GetTankList:",t.ErrorList)})).catch((e=>{console.log("UnAccountedTransactionTankDetailsComposite:Error while getting GetTankList:",e)}))}GetUnAccountedTransactionTypeList(){E()(A.Fx7,h.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){if(null!==t.EntityResult){var a=t.EntityResult.Tank;let e=[];a.forEach((t=>{e.push({text:t,value:t})})),this.setState({transactionTypeOptions:e})}}else console.log("UnAccountedTransactionTankDetailsComposite:Error in GetUnAccountedTransactionTypeList:",t.ErrorList)})).catch((e=>{console.log("UnAccountedTransactionTankDetailsComposite:Error while getting GetUnAccountedTransactionTypeList:",e)}))}GetBaseProductsList(){E()(A.mD_,h.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;let a=[];!0===t.IsSuccess?(null!==t.EntityResult&&Object.keys(t.EntityResult).forEach((e=>{void 0!==t.EntityResult[e]&&Array.isArray(t.EntityResult[e])&&(a=a.concat(h.Zj(t.EntityResult[e])))})),this.setState({baseProdcutOptions:a})):console.log("UnAccountedTransactionTankDetailsComposite:Error in GetBaseProductsList:",t.ErrorList),this.getAdditivesList(a)})).catch((e=>{console.log("UnAccountedTransactionTankDetailsComposite:Error while getting GetBaseProductsList:",e)}))}getAdditivesList(e){E()(A.Oyd,h.Jm(this.props.tokenDetails.tokenInfo)).then((t=>{var a=t.data;if(!0===a.IsSuccess){if(null!==a.EntityResult&&void 0!==a.EntityResult){h.Zj(a.EntityResult.ALLPROD).forEach((t=>e.push(t))),this.setState({baseProdcutOptions:e})}}else console.log("Error in getAdditivesList:",a.ErrorList)})).catch((e=>{console.log("Error while getting Additives List:",e)}))}validateSave(e){const{modAccountedTransaction:t}=this.state;var a=O().cloneDeep(this.state.validationErrors);Object.keys(S.kC).forEach((function(e){a[e]=h.jr(S.kC[e],t[e])})),this.setState({validationErrors:a});var s=O().cloneDeep(this.state.attributeValidationErrors);e.forEach((e=>{s.forEach((t=>{t.TerminalCode===e.TerminalCode&&e.attributeMetaDataList.forEach((e=>{t.attributeValidationErrors[e.Code]=h.I5(e,e.DefaultValue)}))}))})),this.setState({validationErrors:a,attributeValidationErrors:s});var n=!0;return s.forEach((e=>{if(!n)return n;n=Object.values(e.attributeValidationErrors).every((function(e){return""===e}))})),n&&(n=Object.values(a).every((function(e){return""===e}))),n}createAccountedTransaction(e){this.handleAuthenticationClose(),this.setState({saveEnabled:!1});var t={ShareHolderCode:this.props.selectedShareholder,Entity:e},a={messageType:"critical",message:"UnAccountedTransactionTank_SavedStatus",messageResultDetails:[{keyFields:["tankCodeOptions"],keyValues:[e.TankCode],isSuccess:!1,errorMessage:""}]};E()(A.kpt,h.tW(t,this.props.tokenDetails.tokenInfo)).then((t=>{var s=t.data;a.messageType=s.IsSuccess?"success":"critical",a.messageResultDetails[0].isSuccess=s.IsSuccess,!0===s.IsSuccess?this.setState({saveEnabled:!1,AccountedTransaction:e}):(a.messageResultDetails[0].errorMessage=s.ErrorList[0],this.setState({saveEnabled:h.ab(this.props.userDetails.EntityResult.FunctionsList,D.i.add,D.Ow)}),console.log("UnAccountedTransactionTankDetailsComposite:Error in createAccountedTransaction:",s.ErrorList)),this.props.onSaved(e,"add",a)})).catch((t=>{this.setState({saveEnabled:h.ab(this.props.userDetails.EntityResult.FunctionsList,D.i.add,D.Ow)}),a.messageResultDetails[0].errorMessage=t,this.props.onSaved(e,"add",a)}))}fillDetails(){try{let e=O().cloneDeep(this.state.modAccountedTransaction);return e.ShareholderCode=this.props.selectedShareholder,null!==e.Density&&""!==e.Density&&(e.Density=e.Density.toLocaleString()),null!==e.UnAccountedNetQuantity&&""!==e.UnAccountedNetQuantity&&(e.UnAccountedNetQuantity=e.UnAccountedNetQuantity.toLocaleString()),null!==e.UnAccountedGrossQuantity&&""!==e.UnAccountedGrossQuantity&&this.setState({modAccountedTransaction:e}),e}catch(e){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on fillDetails",e)}}getAttributes(){try{E()(A.fKH,h.tW([v.MX],this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess?this.setState({attributeMetaDataList:O().cloneDeep(t.EntityResult),attributeValidationErrors:h.Fl(t.EntityResult.UNACCOUNTEDTANKTRANSACTION)},(()=>{this.props.userDetails.EntityResult.IsEnterpriseNode?this.terminalSelectionChange([]):this.localNodeAttribute()})):console.log("UnAccountedTransactionTankDetailsComposite:Error in getAttributes:")}))}catch(e){console.log("UnAccountedTransactionTankDetailsComposite:Error while getAttributes:",e)}}convertStringtoDecimal(e,t){try{return null!==e.UnAccountedGrossQuantity&&""!==e.UnAccountedGrossQuantity&&(e.UnAccountedGrossQuantity=h.bo(e.UnAccountedGrossQuantity)),null!==e.UnAccountedNetQuantity&&""!==e.UnAccountedNetQuantity&&(e.UnAccountedNetQuantity=h.bo(e.UnAccountedNetQuantity)),null!==e.Density&&""!==e.Density&&(e.Density=h.bo(e.Density)),e=this.fillAttributeDetails(e,t)}catch(a){console.log("UnAccountedTransactionTankDetailsComposite:convertStringtoDecimal error modAccountedMeterTransaction Details",a)}}fillAttributeDetails(e,t){try{return t=h.SC(t),e.Attributes=[],t.forEach((t=>{let a={ListOfAttributeData:[]};a.TerminalCode=t.TerminalCode,t.attributeMetaDataList.forEach((e=>{a.ListOfAttributeData.push({AttributeCode:e.Code,AttributeValue:e.DefaultValue})})),e.Attributes.push(a)})),this.setState({modAccountedMeterTransaction:e}),e}catch(a){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on fillAttributeDetails",a)}}terminalSelectionChange(e){try{if(void 0!==e&&null!==e){let n=[];var t=[],a=[];t=O().cloneDeep(this.state.attributeMetaDataList),a=O().cloneDeep(this.state.selectedAttributeList);const i=O().cloneDeep(this.state.attributeValidationErrors);var s=O().cloneDeep(this.state.modAccountedTransaction);e.forEach((e=>{var i=a.find((t=>t.TerminalCode===e));void 0===i?t.UNACCOUNTEDTANKTRANSACTION.forEach((function(t){if(t.TerminalCode===e){var a=s.Attributes.find((t=>t.TerminalCode===e));void 0!==a&&t.attributeMetaDataList.forEach((function(e){var t=a.ListOfAttributeData.find((t=>t.AttributeCode===e.Code));void 0!==t&&(e.DefaultValue=t.AttributeValue)})),n.push(t)}})):n.push(i)})),a=[],a=n,a=h.nQ(a),i.forEach((t=>{void 0===e.find((e=>t.TerminalCode===e))&&Object.keys(t.attributeValidationErrors).forEach((e=>t.attributeValidationErrors[e]=""))})),this.setState({selectedAttributeList:a,attributeValidationErrors:i})}}catch(n){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on terminalSelectionChange",n)}}localNodeAttribute(){try{var e=O().cloneDeep(this.state.attributeMetaDataList);Array.isArray(e.UNACCOUNTEDTANKTRANSACTION)&&e.UNACCOUNTEDTANKTRANSACTION.length>0&&this.terminalSelectionChange([e.UNACCOUNTEDTANKTRANSACTION[0].TerminalCode])}catch(t){console.log("UnAccountedTransactionTankDetailsComposite:Error occured on localNodeAttribute",t)}}handleResetAttributeValidationError(){try{var e=O().cloneDeep(this.state.attributeMetaDataList);this.setState({attributeValidationErrors:h.Fl(e.UNACCOUNTEDTANKTRANSACTION)})}catch(t){console.log("handleAttributeValidationError:Error occured on handleReset",t)}}render(){return this.state.isReadyToRender?(0,c.jsxs)("div",{children:[(0,c.jsx)(r.A,{children:(0,c.jsx)(N.A,{newEntityName:"TankUnaccountedTransaction_Header"})}),(0,c.jsx)(r.A,{children:(0,c.jsx)(d,{modAccountedTransaction:this.state.modAccountedTransaction,listOptions:{quantityUOMOptions:this.state.quantityUOMOptions,densityUOMOptions:this.state.densityUOMOptions,tankCodeOptions:this.state.tankCodeOptions,transactionTypeOptions:this.state.transactionTypeOptions,baseProdcutOptions:this.state.baseProdcutOptions,customerOptions:this.state.customerOptions,customerSearchOptions:this.state.customerSearchOptions,transportationTypeOptions:this.state.transportationTypeOptions},onFieldChange:this.handleChange,validationErrors:this.state.validationErrors,onCustomerSearchChange:this.handleCustomerSearchChange,isEnterpriseNode:this.props.userDetails.EntityResult.IsEnterpriseNode,attributeValidationErrors:this.state.attributeValidationErrors,selectedAttributeList:this.state.selectedAttributeList,handleCellDataEdit:this.handleCellDataEdit})}),(0,c.jsx)(r.A,{children:(0,c.jsx)(u.q,{handleBack:this.props.onBack,handleSave:this.handleSave,handleReset:this.handleReset,saveEnabled:this.state.saveEnabled})}),this.state.showAuthenticationLayout?(0,c.jsx)(g.A,{Username:this.props.userDetails.EntityResult.UserName,functionName:D.i.add,functionGroup:D.Ow,handleOperation:this.handleAddTransaction,handleClose:this.handleAuthenticationClose}):null]}):(0,c.jsx)(L.A,{message:"Loading"})}}const P=(0,m.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})),(e=>({userActions:(0,I.zH)(C,e)})))(b)},43503:(e,t,a)=>{a.d(t,{A:()=>r});a(65043);var s=a(67907),n=a(72711),i=a(70579);function o(e){let{entityCode:t,newEntityName:a,popUpContents:o}=e;return(0,i.jsx)(s.TranslationConsumer,{children:e=>(0,i.jsx)("div",{className:"headerContainer",children:(0,i.jsxs)("div",{className:"row headerSpacing",children:[(0,i.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,i.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===t||void 0===t?e(a):t})}),""!==t&&void 0!==t&&o.length>0?(0,i.jsx)("div",{className:"headerItemRight",children:(0,i.jsx)(n.Popup,{element:(0,i.jsxs)("div",{children:[e(o[0].fieldName)+" ",":"," "+o[0].fieldValue,(0,i.jsx)(n.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,i.jsx)(n.List,{className:"detailsHeaderPopUp",children:o.map((t=>(0,i.jsxs)(n.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(t.fieldName)+" ",":"," "+t.fieldValue]},"content.fieldName")))})})}):""]})})})}o.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const r=o},9256:(e,t,a)=>{a.d(t,{q:()=>o});a(65043);var s=a(72711),n=a(67907),i=a(70579);function o(e){let{handleBack:t,handleSave:a,handleReset:o,saveEnabled:r}=e;return(0,i.jsx)(n.TranslationConsumer,{children:e=>(0,i.jsxs)("div",{className:"row userActionPosition",children:[(0,i.jsx)("div",{className:"col-12 col-md-3 col-lg-4",children:(0,i.jsx)(s.Button,{className:"backButton",onClick:t,content:e("Back")})}),(0,i.jsx)("div",{className:"col-12 col-md-9 col-lg-8",children:(0,i.jsxs)("div",{style:{float:"right"},children:[(0,i.jsx)(s.Button,{content:e("LookUpData_btnReset"),className:"cancelButton",onClick:o}),(0,i.jsx)(s.Button,{content:e("Save"),disabled:!r,onClick:a})]})})]})})}o.defaultProps={saveEnabled:!1}},85800:(e,t,a)=>{a.d(t,{n:()=>l});a(65043);var s=a(72711),n=a(67907),i=a(7523),o=a(35861),r=a(70579);function l(e){let{selectedAttributeList:t,handleCellDataEdit:a,attributeValidationErrors:l}=e;const c=e=>{if("0000-00-00"===e.DefaultValue)return d(e,new Date),new Date;var t=e.DefaultValue.split("-");return new Date(t[0],t[1]-1,t[2])},d=(e,t)=>{var s=new Date(t);t=s.getFullYear()+"-"+("0"+(s.getMonth()+1)).slice(-2)+"-"+("0"+s.getDate()).slice(-2),a(e,t)};return(0,r.jsx)(n.TranslationConsumer,{children:e=>(0,r.jsx)("div",{className:"row",children:(0,r.jsx)("div",{className:"col-md-12 attributeDetails-wrap",children:(0,r.jsx)("div",{className:"row",children:t.map((t=>t.DataType.toLowerCase()===i.pe.STRING.toLowerCase()&&!0===t.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(s.Input,{fluid:!0,label:e(t.DisplayName),value:null===t.DefaultValue?"":t.DefaultValue,indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>a(t,e),error:e(l[t.Code]),reserveSpace:!1})}):t.DataType.toLowerCase()!==i.pe.INT.toLowerCase()&&t.DataType.toLowerCase()!==i.pe.LONG.toLowerCase()||!0!==t.IsVisible?t.DataType.toLowerCase()!==i.pe.FLOAT.toLowerCase()&&t.DataType.toLowerCase()!==i.pe.DOUBLE.toLowerCase()||!0!==t.IsVisible?t.DataType.toLowerCase()===i.pe.BOOL.toLowerCase()&&!0===t.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(s.Checkbox,{className:"deviceCheckBox customDeviceCheckBox",label:e(t.DisplayName),checked:null===t.DefaultValue?"":"true"===t.DefaultValue.toString().toLowerCase(),disabled:!0===t.IsReadonly,onChange:e=>a(t,e)})}):t.DataType.toLowerCase()===i.pe.DATETIME.toLowerCase()&&!0===t.IsVisible?(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(s.DatePicker,{fluid:!0,value:null===t.DefaultValue||""===t.DefaultValue?"":c(t),label:e(t.DisplayName),displayFormat:(0,o.F1)(),showYearSelector:"true",indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>d(t,e),onTextChange:e=>{d(t,e)},error:e(l[t.Code]),reserveSpace:!1})}):null:(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(s.Input,{fluid:!0,label:e(t.DisplayName),value:null===t.DefaultValue||""===t.DefaultValue?"":t.DefaultValue.toLocaleString(),indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>a(t,e),error:e(l[t.Code]),reserveSpace:!1})}):(0,r.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,r.jsx)(s.Input,{fluid:!0,label:e(t.DisplayName),value:null===t.DefaultValue?"":t.DefaultValue,indicator:!0===t.IsMandatory?"required":null,disabled:!0===t.IsReadonly,onChange:e=>a(t,e),error:e(l[t.Code]),reserveSpace:!1})})))})})})})}},15417:(e,t,a)=>{a.d(t,{$7:()=>P,AN:()=>ae,AU:()=>v,Ak:()=>Qe,Ao:()=>s,B6:()=>Z,C4:()=>Ge,CG:()=>J,Ct:()=>W,Cw:()=>j,EY:()=>R,G$:()=>Ze,G6:()=>$e,GF:()=>Te,GJ:()=>k,Gj:()=>ue,Gl:()=>ie,H9:()=>Ke,HB:()=>Le,HP:()=>O,Hr:()=>Re,II:()=>nt,IQ:()=>N,Jr:()=>B,Jx:()=>me,Ki:()=>te,LP:()=>ne,Lv:()=>i,MK:()=>C,MX:()=>ee,Mx:()=>q,N4:()=>Me,NH:()=>Ie,OF:()=>Xe,Ps:()=>H,Q7:()=>We,QY:()=>G,SF:()=>o,Sq:()=>ye,Sw:()=>re,TQ:()=>z,U7:()=>L,UH:()=>A,UO:()=>oe,V_:()=>be,Vy:()=>we,W9:()=>ce,WN:()=>m,Wr:()=>n,Ww:()=>$,XP:()=>ge,Xk:()=>K,Yb:()=>De,Yy:()=>E,Z2:()=>ke,ZN:()=>f,ZO:()=>Se,Zu:()=>Be,_G:()=>_,_N:()=>u,_u:()=>de,ad:()=>le,al:()=>Ne,ao:()=>w,bK:()=>Q,bN:()=>I,cf:()=>U,dO:()=>Pe,dU:()=>T,dv:()=>r,eE:()=>Y,g:()=>y,gG:()=>l,gS:()=>ve,gT:()=>at,gW:()=>X,gZ:()=>ze,go:()=>g,gp:()=>V,hq:()=>Ue,i6:()=>et,ip:()=>he,k9:()=>p,kI:()=>S,l4:()=>je,l5:()=>D,lA:()=>M,lU:()=>Je,mD:()=>Ve,mY:()=>x,mq:()=>c,n$:()=>st,n7:()=>h,nZ:()=>fe,rA:()=>xe,s$:()=>He,s8:()=>Fe,se:()=>Ce,tA:()=>Oe,vK:()=>tt,vs:()=>Ae,w2:()=>Ye,w4:()=>pe,wT:()=>d,wY:()=>b,wf:()=>Ee,wk:()=>se,xW:()=>F,yM:()=>_e,yO:()=>qe});const s="driver",n="carriercompany",i="shareholder",o="baseProduct",r="TRAILER",l="TRAILERCOMPARTMENT",c="terminal",d="customer",u="destination",h="finishedproduct",T="tank",E="marine_vessel",p="marine_trailercompartment",A="supplier",C="vehicle",I="vehicletrailer",m="originterminal",N="bay",S="loadingArm",D="cardreader",y="vehicleprimemover",O="meter",R="SHIPMENT",L="SHIPMENTCOMPARTMENT",v="SHIPMENTDESTINATIONCOMPARTMENT",g="SHIPMENTDETAILS",b="SHIPMENTTRAILERWEIGHBRIDGE",P="SHIPMENTTRAILER",f="SHIPMENTSTATUSTIME",U="MARINEDISPATCH",M="MARINEDISPATCHCOMPARTMENTDETAIL",k="railwagon",j="primemover",x="bcu",G="RAILRECEIPTPLAN",H="RAILRECEIPTWAGONDETAILPLAN",w="RAILUNLOADINGDETAILSFP",V="RAILUNLOADINGDETAILSBP",F="RAILUNLOADINGDETAILSADDITIVE",B="RAILDISPATCHPLAN",Q="RAILDISPATCHITEM",_="RAILDISPATCHSTATUSCHANGE",q="RAILDISPATCHWAGON",W="RAILDISPATCHWAGONDETAILPLAN",K="RAILDISPATCHWAGONWEIGHBRIDGE",Z="RAILDISPATCHWAGONCOMPARTMENT",Y="RAILLOADINGDETAILSFP",J="RAILLOADINGDETAILSBP",X="RAILLOADINGDETAILSADDITIVE",$="marineReceipt",z="UNACCOUNTEDMETERTRANSACTION",ee="UNACCOUNTEDTANKTRANSACTION",te="marineLoadingDetailsFP",ae="marineLoadingDetailsAdditive",se="marineLoadingDetailsBP",ne="marineReceiptCompartmentDetail",ie="marineUnloadingDetailsFP",oe="marineUnloadingDetailsBP",re="accessCard",le="LOADINGDETAILSFP",ce="LOADINGDETAILSBP",de="LOADINGDETAILSADDITIVE",ue="MARINERECEIPTSTATUSTIME",he="MARINEDISPATCHSTATUSTIME",Te="RECEIPT",Ee="UNLOADINGTRANSACTIONS",pe="ORDER",Ae="ORDERITEM",Ce="CONTRACT",Ie="CONTRACT_ITEM",me="RECEIPTORIGINTERMINALCOMPARTMENT",Ne="GeneralTMUser_CAPTAIN",Se="weighbridge",De="deu",ye="GeneralTMUser_STAFF",Oe="GeneralTMUser_VISITOR",Re="PIPELINEHEADER",Le="SEALMASTER",ve="PIPELINERECEIPT",ge="ROADSHIPMENTSLOTINFO",be="ROADRECEIPTSLOTINFO",Pe="MARINESHIPMENTSLOTINFO",fe="MARINERECEIPTSLOTINFO",Ue="PIPELINEDISPATCH",Me="PIPELINETRANSACTIONS",ke="PIPELINEDISPATCHSTATUSTIME",je="PIPELINERECEIPTSTATUSTIME",xe="PROCESSCONFIG",Ge="PRODUCTALLOCATIONITEM",He="HSEINSPECTIONSHIPMENTRIGIDTRUCK",we="HSEINSPECTIONSHIPMENTTRAILER",Ve="HSEINSPECTIONSHIPMENTPRIMEMOVER",Fe="HSEINSPECTIONSHIPMENTNONFILLINGVEHICLE",Be="HSEINSPECTIONMARINESHIPMENTBARGE",Qe="HSEINSPECTIONMARINESHIPMENTSHIP",_e="HSEINSPECTIONSHIPMENTRAILWAGON",qe="HSEINSPECTIONSHIPMENTPIPELINE",We="HSEINSPECTIONRECEIPTRIGIDTRUCK",Ke="HSEINSPECTIONRECEIPTTRAILER",Ze="HSEINSPECTIONRECEIPTPRIMEMOVER",Ye="HSEINSPECTIONRECEIPTNONFILLINGVEHICLE",Je="HSEINSPECTIONMARINERECEIPTBARGE",Xe="HSEINSPECTIONMARINERECEIPTSHIP",$e="HSEINSPECTIONRECEIPTRAILWAGON",ze="HSEINSPECTIONRECEIPTPIPELINE",et="SHAREHOLDERAGREEMENT",tt="COATEMPLATE",at="COAMANAGEMENT",st="COACUSTOMER",nt="COAASSIGNMENT"},35861:(e,t,a)=>{a.d(t,{F1:()=>r,i7:()=>l,r4:()=>o});var s=a(86178),n=a.n(s),i=(a(15660),a(65043),a(70579));function o(e,t){if(Array.isArray(e)){0===e.filter((e=>e.text===t)).length&&e.unshift({value:null,text:t})}return e}function r(){let e=window.navigator.userLanguage||window.navigator.language;return n().locale(e),n().localeData().longDateFormat("L")}function l(e){return(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{children:e}),(0,i.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=8313.ac63a587.chunk.js.map