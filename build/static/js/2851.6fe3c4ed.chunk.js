"use strict";(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[2851,3235],{62851:(e,s,t)=>{t.r(s),t.d(s,{default:()=>I});var a=t(65043),o=t(69062),r=t(40854),i=t.n(r),l=t(72067),n=t(65187),c=t(43503),d=t(9256),h=t(40252),u=t(72711),m=t(67907),p=t(35861),g=t(70579);function v(e){let{user:s,modUser:t,validationErrors:a,onFieldChange:o,listOptions:r,onActiveStatusChange:i,isDisableGroupANDMakeRoleMandatory:l}=e;return(0,g.jsx)(m.TranslationConsumer,{children:e=>(0,g.jsxs)("div",{className:"detailsContainer",children:[(0,g.jsxs)("div",{className:"row",children:[(0,g.jsx)("div",{className:"col-md-12 mt-4",children:(0,g.jsx)("p",{className:"border-bottom-1 pb-2 deviceheaderLabel",children:e("UserInfo_PersonalInformation")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.FirstName,indicator:"required",disabled:""!==s.FirstName,onChange:e=>o("FirstName",e),label:e("UserAdmin_FirstName"),error:e(a.FirstName),reserveSpace:!1})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.LastName,indicator:"required",onChange:e=>o("LastName",e),label:e("UserAdmin_LastName"),error:e(a.LastName),reserveSpace:!1})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,placeholder:"Select",value:t.Culture,label:e("UserInfo_Language"),options:r.languageOptions,onChange:e=>o("Culture",e),error:e(a.Culture),reserveSpace:!1,search:!0,onResultsMessage:e("noResultsMessage")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.Phone,onChange:e=>o("Phone",e),label:e("UserAdmin_PhoneNumber"),error:e(a.Phone),reserveSpace:!1})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.Mobile,onChange:e=>o("Mobile",e),label:e("Cust_Mobile"),error:e(a.Mobile),reserveSpace:!1})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.Email,onChange:e=>o("Email",e),label:e("Cust_Email"),error:e(a.Email),reserveSpace:!1})}),"BSIAdmin"===t.RoleName?(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.ApplicationID,onChange:e=>o("ApplicationID",e),label:e("Cust_ApplicationID"),error:e(a.ApplicationID),reserveSpace:!1})}):null]}),(0,g.jsxs)("div",{className:"row",children:[(0,g.jsx)("div",{className:"col-md-12 mt-4",children:(0,g.jsx)("p",{className:"border-bottom-1 pb-2 deviceheaderLabel",children:e("UserInfo_Account")})}),"1"===t.DomainName?(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.NewDomainName,onChange:e=>o("NewDomainName",e),label:e("UserInfo_DomainName"),error:e(a.NewDomainName),reserveSpace:!1,disabled:""!==s.FirstName})}):(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,placeholder:"Select",value:t.DomainName,label:e("UserInfo_DomainName"),options:r.domainNameOptions,onChange:e=>o("DomainName",e),error:e(a.DomainName),reserveSpace:!1,search:!0,onResultsMessage:e("noResultsMessage"),disabled:""!==s.FirstName})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.UserAccount,indicator:"required",disabled:""!==s.FirstName,onChange:e=>o("UserAccount",e),label:e("UserInfo_UserAccount"),error:e(a.UserAccount),reserveSpace:!1})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.Description,onChange:e=>o("Description",e),label:e("Cust_Description"),error:e(a.Description),reserveSpace:!1})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,placeholder:"Select",indicator:l?"required":"",value:t.RoleName,label:e("UserAdmin_ExplicitRole"),options:(0,p.r4)(r.roleOptions,e("Common_Select")),onChange:e=>o("RoleName",e),error:e(a.RoleName),reserveSpace:!1,search:!0,onResultsMessage:e("noResultsMessage")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,value:r.inheritedRoles,label:e("UserInfo_InheritedRoles"),options:r.inheritedRolesOptions,reserveSpace:!1,search:!0,onResultsMessage:e("noResultsMessage"),disabled:!0,multiple:!0})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4 checkboxSelect",children:(0,g.jsx)(u.Checkbox,{label:e("UserInfo_ServiceUser"),checked:!!t.IsServiceUser,onChange:e=>o("IsServiceUser",e)})})]}),(0,g.jsxs)("div",{className:"row",children:[(0,g.jsx)("div",{className:"col-md-12 mt-4",children:(0,g.jsx)("p",{className:"border-bottom-1 pb-2 deviceheaderLabel",children:e("ShareholderListx_HeaderLabel")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,placeholder:"Select",indicator:"required",value:t.PrimaryShareholder,label:e("UserAdmin_PrimaryShareHolder"),options:r.shareholderOptions,onChange:e=>o("PrimaryShareholder",e),error:e(a.PrimaryShareholder),reserveSpace:!1,search:!0,onResultsMessage:e("noResultsMessage")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,placeholder:"Select",value:t.SecondaryShareholders,label:e("UserInfo_SecondaryShareholder"),options:r.secondaryShareholderOptions,onChange:e=>o("SecondaryShareholders",e),error:e(a.SecondaryShareholders),reserveSpace:!1,multiple:!0,search:!0,onResultsMessage:e("noResultsMessage")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Select,{fluid:!0,placeholder:e("Common_Select"),label:e("BaseProductList_Status"),value:t.Status,options:[{text:e("ViewShipment_Ok"),value:!0},{text:e("ViewShipmentStatus_Inactive"),value:!1}],onChange:e=>i(e),error:e(a.Status),reserveSpace:!1,search:!0,noResultsMessage:e("noResultsMessage")})}),(0,g.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,g.jsx)(u.Input,{fluid:!0,value:t.Remarks,onChange:e=>o("Remarks",e),label:e("BaseProductList_Remarks"),error:e(a.Remarks),indicator:t.Status!==s.Status?"required":"",reserveSpace:!1})})]})]})})}v.defaultProps={listOptions:{languageOptions:[],domainNameOptions:[],roleOptions:[],shareholderOptions:[],secondaryShareholderOptions:[],inheritedRolesOptions:[],inheritedRoles:[]}};var S=t(46100),D=t(44192),N=(t(38726),t(97508)),R=t(93779),y=t(53536),E=t.n(y),f=t(80312);class U extends a.Component{constructor(){super(...arguments),this.state={user:E().cloneDeep(S.F2),modUser:{},validationErrors:o.Th(D.Oi),isReadyToRender:!1,saveEnabled:!1,attributeValidationErrors:[],languageOptions:[],domainNameOptions:[],isDisableGroupANDMakeRoleMandatory:!1,roleOptions:[],shareholderOptions:[],secondaryShareholderOptions:[],inheritedRolesOptions:[],inheritedRoles:[]},this.handleChange=(e,s)=>{try{const t=E().cloneDeep(this.state.modUser);t[e]=s;const a=E().cloneDeep(this.state.validationErrors);void 0!==D.Oi[e]&&(a[e]=o.jr(D.Oi[e],s),this.setState({validationErrors:a})),this.setState({modUser:t},(()=>{"PrimaryShareholder"===e&&this.removeSecondaryShareholderItem(s)}))}catch(t){console.log("UserDetailsComposite:Error occured on handleChange",t)}},this.handleActiveStatusChange=e=>{try{let s=E().cloneDeep(this.state.modUser);s.Status=e,s.Status!==this.state.user.Status&&(s.Remarks=""),this.setState({modUser:s})}catch(s){console.log("UserDetailsComposite:Error occured on handleActiveStatusChange",s)}},this.handleSave=()=>{try{this.setState({saveEnabled:!1});let e=this.fillDetails();this.validateSave(e)?""===this.state.user.FirstName?this.createUser(e):this.updateUser(e):this.setState({saveEnabled:!0})}catch(e){console.log("UserDetailsComposite:Error occured on handleSave",e)}},this.handleReset=()=>{try{const{validationErrors:e}={...this.state},s=E().cloneDeep(this.state.user);Object.keys(e).forEach((function(s){e[s]=""})),this.setState({modUser:{...s},selectedCompRow:[],validationErrors:e})}catch(e){console.log("UserDetailsComposite:Error occured on handleReset",e)}}}componentDidMount(){try{o.pJ(this.props.userDetails.EntityResult.IsArchived),this.getLanguages(),this.getDomainNames(),this.getLookUpData(),this.getSecurityRoles(),this.getShareholdersList(),this.getUser(this.props.selectedRow)}catch(e){console.log("UserDetailsComposite:Error occured on componentDidMount",e)}}componentWillReceiveProps(e){try{if(""!==this.state.user.FirstName&&void 0===e.selectedRow.PersonId&&this.props.tokenDetails.tokenInfo===e.tokenDetails.tokenInfo){this.getUser(e.selectedRow);let s={...this.state.validationErrors};Object.keys(s).forEach((e=>{s[e]=""})),this.setState({validationErrors:s})}}catch(s){console.log("UserDetailsComposite:Error occured on componentWillReceiveProps",s)}}getUser(e){if(S.F2.Culture=this.props.userDetails.EntityResult.UICulture,S.F2.DomainName="0",void 0!==e.PersonId){var s={KeyCodes:[{key:R.np,value:e.PersonId}]};i()(l.cuh,o.tW(s,this.props.tokenDetails.tokenInfo)).then((s=>{var t=s.data;!0===t.IsSuccess?this.setState({isReadyToRender:!0,user:E().cloneDeep(t.EntityResult),modUser:E().cloneDeep(t.EntityResult),saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.modify,f.Yg)},(()=>{this.removeSecondaryShareholderItem(t.EntityResult.PrimaryShareholder),this.getInheritedRoles(e.PersonId),this.populateNewDomainName()})):(this.setState({user:E().cloneDeep(S.F2),modUser:E().cloneDeep(S.F2),isReadyToRender:!0}),console.log("Error in getUser:",t.ErrorList))})).catch((s=>{console.log("Error while getting User:",s,e)}))}else this.setState({user:E().cloneDeep(S.F2),modUser:E().cloneDeep(S.F2),isReadyToRender:!0,selectedAttributeList:[],saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.add,f.Yg)})}populateNewDomainName(){try{const e=E().cloneDeep(this.state.modUser);e.NewDomainName=e.DomainName,"0"===e.NewDomainName&&(e.NewDomainName="Select"),e.DomainName="1",this.setState({modUser:e})}catch(e){console.log("Error while populateNewDomainName",e)}}getLanguages(){i()(l.HLD,o.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var s=e.data;if(!0===s.IsSuccess){let e=[];null!==s.EntityResult?(Object.keys(s.EntityResult).forEach((t=>e.push({text:s.EntityResult[t],value:t}))),this.setState({languageOptions:e})):console.log("No languages identified.")}else console.log("Error in getLanguages:",s.ErrorList)})).catch((e=>{console.log("Error while getting Languages:",e)}))}getDomainNames(){i()(l.tSv,o.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var s=e.data;let t=[];!0===s.IsSuccess&&null!==s.EntityResult&&Array.isArray(s.EntityResult)?(t=o.Zj(s.EntityResult),t.unshift({text:"Select",value:"0"},{text:"New Domain?",value:"1"}),this.setState({domainNameOptions:t})):(t.push({text:"Select",value:"0"},{text:"New Domain?",value:"1"}),this.setState({domainNameOptions:t}))})).catch((e=>{console.log("Error while getting DomainNames:",e)}))}getLookUpData(){try{i()(l.xAA+"?LookUpTypeCode=Security",o.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var s=e.data;!0===s.IsSuccess&&this.setState({isDisableGroupANDMakeRoleMandatory:"False"!==s.EntityResult.DisableGroupANDMakeRoleMandatory})}))}catch(e){console.log("UserDetailsComposite:Error occured on getLookUpData",e)}}getSecurityRoles(){i()(l.aDm,o.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var s=e.data;if(!0===s.IsSuccess){if(null!==s.EntityResult&&Array.isArray(s.EntityResult)){let e=[];e=o.Zj(s.EntityResult),this.setState({roleOptions:e})}}else console.log("Error in getSecurityRoles:",s.ErrorList)})).catch((e=>{console.log("Error while getSecurityRoles:",e)}))}getShareholdersList(){i()(l.b7s,o.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var s=e.data;if(!0===s.IsSuccess){if(null!==s.EntityResult){let e=[],t=[];Object.keys(s.EntityResult).forEach((t=>{e.push({text:s.EntityResult[t],value:t})})),Object.keys(s.EntityResult).forEach((e=>{t.push({text:s.EntityResult[e],value:e})})),this.setState({shareholderOptions:e,secondaryShareholderOptions:t})}}else console.log("Error in getShareholdersList:",s.ErrorList)})).catch((e=>{console.log("Error while getShareholdersList:",e)}))}getInheritedRoles(e){i()(l.MhG+"?personID="+e,o.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var s=e.data;if(!0===s.IsSuccess){if(null!==s.EntityResult&&Array.isArray(s.EntityResult)){let e=[];e=o.Zj(s.EntityResult),this.setState({inheritedRolesOptions:e,inheritedRoles:s.EntityResult})}}else console.log("Error in getInheritedRoles:",s.ErrorList)})).catch((e=>{console.log("Error while getInheritedRoles:",e)}))}removeSecondaryShareholderItem(e){try{let s=E().cloneDeep(this.state.shareholderOptions);const t=E().cloneDeep(this.state.modUser);null!==t.SecondaryShareholders&&Array.isArray(t.SecondaryShareholders)&&(t.SecondaryShareholders=t.SecondaryShareholders.filter((function(s){return s!==e}))),this.setState({secondaryShareholderOptions:s.filter((function(s){return s.value!==e})),modUser:t})}catch(s){console.log("removeSecondaryShareholderItem:Error occured on handleChange",s)}}fillDetails(){try{let e=E().cloneDeep(this.state.modUser);return"1"===e.DomainName&&(e.DomainName=e.NewDomainName),"Select"!==e.DomainName&&void 0!==e.DomainName&&""!==e.DomainName||(e.DomainName=0),e}catch(e){console.log("UserDetailsComposite:Error occured on fillDetails",e)}}validateSave(e){try{const s={...this.state.validationErrors};return Object.keys(D.Oi).forEach((function(t){void 0!==e[t]&&(s[t]=o.jr(D.Oi[t],e[t]))})),e.Status!==this.state.user.Status&&(null!==e.Remarks&&""!==e.Remarks||(s.Remarks="BaseProductInfo_EnterRemarks")),this.state.isDisableGroupANDMakeRoleMandatory&&(void 0!==e.RoleName&&null!==e.RoleName&&""!==e.RoleName.toString().trim()||(s.RoleName="UserInfo_RoleRequired")),"bsiadmin"===e.RoleName.toLowerCase()&&(""!==e.Email&&null!==e.Email&&void 0!==e.Email||""!==e.ApplicationID&&null!==e.ApplicationID&&void 0!==e.ApplicationID||(s.Email="ERRMSG_SECURITYUSER_EMAIL_APPLICATIONID_EMPTY",s.ApplicationID="ERRMSG_SECURITYUSER_EMAIL_APPLICATIONID_EMPTY")),this.setState({validationErrors:s}),Object.values(s).every((function(e){return""===e}))}catch(s){console.log("UserDetailsComposite:Error occured on validateSave",s)}}createUser(e){let s={Entity:e},t={messageType:"critical",message:"UserInfo_Savedstatus",messageResultDetails:[{keyFields:["UserAdmin_FirstName"],keyValues:[e.FirstName],isSuccess:!1,errorMessage:""}]};i()(l.MNE,o.tW(s,this.props.tokenDetails.tokenInfo)).then((e=>{let s=e.data;t.messageType=s.IsSuccess?"success":"critical",t.messageResultDetails[0].isSuccess=s.IsSuccess,!0===s.IsSuccess?this.setState({saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.modify,f.Yg)},(()=>this.getUser({PersonId:s.EntityResult.PersonID}))):(t.messageResultDetails[0].errorMessage=s.ErrorList[0],this.setState({saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.add,f.Yg)}),console.log("Error in createUser:",s.ErrorList)),this.props.onSaved(s.EntityResult,"add",t)})).catch((e=>{this.setState({saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.add,f.Yg)}),t.messageResultDetails[0].errorMessage=e,this.props.onSaved(this.state.modUser,"add",t)}))}updateUser(e){let s={Entity:e},t={messageType:"critical",message:"UserInfo_Savedstatus",messageResultDetails:[{keyFields:["UserAdmin_FirstName"],keyValues:[e.FirstName],isSuccess:!1,errorMessage:""}]};i()(l.JtR,o.tW(s,this.props.tokenDetails.tokenInfo)).then((s=>{let a=s.data;t.messageType=a.IsSuccess?"success":"critical",t.messageResultDetails[0].isSuccess=a.IsSuccess,!0===a.IsSuccess?this.setState({saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.modify,f.Yg)},(()=>this.getUser({PersonId:e.PersonID}))):(t.messageResultDetails[0].errorMessage=a.ErrorList[0],this.setState({saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.modify,f.Yg)}),console.log("Error in updateUser:",a.ErrorList)),this.props.onSaved(this.state.modUser,"update",t)})).catch((e=>{this.setState({saveEnabled:o.ab(this.props.userDetails.EntityResult.FunctionsList,f.i.modify,f.Yg)}),t.messageResultDetails[0].errorMessage=e,this.props.onSaved(this.state.modUser,"modify",t)}))}render(){const e={languageOptions:this.state.languageOptions,domainNameOptions:this.state.domainNameOptions,roleOptions:this.state.roleOptions,shareholderOptions:this.state.shareholderOptions,secondaryShareholderOptions:this.state.secondaryShareholderOptions,inheritedRolesOptions:this.state.inheritedRolesOptions,inheritedRoles:this.state.inheritedRoles},s=[{fieldName:"PipeLineHeaderInfo_LastUpdated",fieldValue:new Date(this.state.modUser.LastUpdated).toLocaleDateString()+" "+new Date(this.state.modUser.LastUpdated).toLocaleTimeString()},{fieldName:"PipeLineHeaderInfo_CreatedTime",fieldValue:new Date(this.state.modUser.CreationTime).toLocaleDateString()+" "+new Date(this.state.modUser.CreationTime).toLocaleTimeString()},{fieldName:"PipeLineHeaderInfo_LastActive",fieldValue:void 0!==this.state.modUser.LastActive&&null!==this.state.modUser.LastActive?new Date(this.state.modUser.LastActive).toLocaleDateString()+" "+new Date(this.state.modUser.LastActive).toLocaleTimeString():""}];return this.state.isReadyToRender?(0,g.jsxs)("div",{children:[(0,g.jsx)(n.A,{children:(0,g.jsx)(c.A,{entityCode:this.state.user.FirstName,newEntityName:"UserInfo_NewUser",popUpContents:s})}),(0,g.jsx)(n.A,{children:(0,g.jsx)(v,{user:this.state.user,modUser:this.state.modUser,listOptions:e,validationErrors:this.state.validationErrors,isDisableGroupANDMakeRoleMandatory:this.state.isDisableGroupANDMakeRoleMandatory,onFieldChange:this.handleChange,onActiveStatusChange:this.handleActiveStatusChange})}),(0,g.jsx)(n.A,{children:(0,g.jsx)(d.q,{handleBack:this.props.onBack,handleSave:this.handleSave,handleReset:this.handleReset,saveEnabled:this.state.saveEnabled})})]}):(0,g.jsx)(h.A,{message:"Loading"})}}const I=(0,N.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(U)},43503:(e,s,t)=>{t.d(s,{A:()=>l});t(65043);var a=t(67907),o=t(72711),r=t(70579);function i(e){let{entityCode:s,newEntityName:t,popUpContents:i}=e;return(0,r.jsx)(a.TranslationConsumer,{children:e=>(0,r.jsx)("div",{className:"headerContainer",children:(0,r.jsxs)("div",{className:"row headerSpacing",children:[(0,r.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,r.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===s||void 0===s?e(t):s})}),""!==s&&void 0!==s&&i.length>0?(0,r.jsx)("div",{className:"headerItemRight",children:(0,r.jsx)(o.Popup,{element:(0,r.jsxs)("div",{children:[e(i[0].fieldName)+" ",":"," "+i[0].fieldValue,(0,r.jsx)(o.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,r.jsx)(o.List,{className:"detailsHeaderPopUp",children:i.map((s=>(0,r.jsxs)(o.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(s.fieldName)+" ",":"," "+s.fieldValue]},"content.fieldName")))})})}):""]})})})}i.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const l=i},9256:(e,s,t)=>{t.d(s,{q:()=>i});t(65043);var a=t(72711),o=t(67907),r=t(70579);function i(e){let{handleBack:s,handleSave:t,handleReset:i,saveEnabled:l}=e;return(0,r.jsx)(o.TranslationConsumer,{children:e=>(0,r.jsxs)("div",{className:"row userActionPosition",children:[(0,r.jsx)("div",{className:"col-12 col-md-3 col-lg-4",children:(0,r.jsx)(a.Button,{className:"backButton",onClick:s,content:e("Back")})}),(0,r.jsx)("div",{className:"col-12 col-md-9 col-lg-8",children:(0,r.jsxs)("div",{style:{float:"right"},children:[(0,r.jsx)(a.Button,{content:e("LookUpData_btnReset"),className:"cancelButton",onClick:i}),(0,r.jsx)(a.Button,{content:e("Save"),disabled:!l,onClick:t})]})})]})})}i.defaultProps={saveEnabled:!1}},35861:(e,s,t)=>{t.d(s,{F1:()=>l,i7:()=>n,r4:()=>i});var a=t(86178),o=t.n(a),r=(t(15660),t(65043),t(70579));function i(e,s){if(Array.isArray(e)){0===e.filter((e=>e.text===s)).length&&e.unshift({value:null,text:s})}return e}function l(){let e=window.navigator.userLanguage||window.navigator.language;return o().locale(e),o().localeData().longDateFormat("L")}function n(e){return(0,r.jsxs)("div",{children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("div",{class:"ui red circular empty label badge  circle-padding"})]})}}}]);
//# sourceMappingURL=2851.6fe3c4ed.chunk.js.map