(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[679,5841,8222],{66554:(e,t,i)=>{"use strict";i.d(t,{$:()=>c});var s=i(65043),a=i(72711),o=i(67907),n=i(65187),r=i(69062),l=i(70579);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:d,selectedShareholder:c,onShareholderChange:h,onDelete:u,onAdd:m,popUpContent:p,shrVisible:g,handleBreadCrumbClick:C,addVisible:S,deleteVisible:f}=e;const[v,x]=(0,s.useState)(!1),[y,j]=(0,s.useState)(!1);function b(){t.add&&(p.length>0?j(!1===y):m())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(n.A,{children:[" ",(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsxs)(a.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(a.Breadcrumb.Item,{onClick:()=>{void 0!==C&&null!==C&&C(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(a.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===g?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(a.Select,{placeholder:e("Common_Shareholder"),value:c,disabled:!t.shareholder,options:r.Zj(d),onChange:e=>h(e)})})]})})})}),(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsxs)(a.Modal,{open:v,size:"small",children:[(0,l.jsx)(a.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(a.Modal.Footer,{children:[(0,l.jsx)(a.Button,{type:"secondary",content:e("Cancel"),onClick:()=>x(!1)}),(0,l.jsx)(a.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{x(!1),u()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[S?(0,l.jsx)(a.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:b,children:(0,l.jsx)(a.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:y,children:(0,l.jsx)("div",{onMouseLeave:()=>j(!1),children:(0,l.jsx)(o.TranslationConsumer,{children:e=>(0,l.jsx)(a.VerticalMenu,{children:(0,l.jsxs)(a.VerticalMenu,{children:[(0,l.jsx)(a.VerticalMenu.Header,{children:e("Common_Create")}),p.map((t=>(0,l.jsx)(a.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,j(!1),void m(e);var e},children:e(t.fieldValue)})))]})})})})}):"",f?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&x(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(a.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}d.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:s,selectedShareholder:a,onShareholderChange:o,onDelete:n,onAdd:r,popUpContent:c,shrVisible:h,handleBreadCrumbClick:u,addVisible:m,deleteVisible:p}=e;return(0,l.jsx)(d,{operationsVisibilty:t,breadcrumbItem:i,shareholders:s,selectedShareholder:a,onShareholderChange:o,onDelete:n,onAdd:r,popUpContent:c,shrVisible:h,handleBreadCrumbClick:u,addVisible:m,deleteVisible:p})}},62900:(e,t,i)=>{"use strict";i.d(t,{A:()=>f});var s=i(65043),a=i(67907),o=i(72711),n=i(72067),r=i(69062),l=i(97508),d=i(44192),c=i(40854),h=i.n(c),u=i(53536),m=i.n(u),p=i(86111),g=i.n(p),C=i(70579);class S extends s.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:r.Th(d.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,t)=>{this.setState({Password:t});const i=m().cloneDeep(this.state.validationErrors);void 0!==d.Qh[e]&&(i[e]=r.jr(d.Qh[e],t),this.setState({validationErrors:i,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const t={...this.state.validationErrors};null!==e&&""!==e||(t.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,t=this.props.Username,i=g().lib.WordArray.random(16),s=g().PBKDF2(t,i,{keySize:8,iterations:100}),a=g().lib.WordArray.random(16),o=g().AES.encrypt(e,s,{iv:a,padding:g().pad.Pkcs7,mode:g().mode.CBC}),l=i.toString()+a.toString()+o.toString();h()(n.KrY+"?encryptedPassword="+encodeURIComponent(l),r.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess&&"true"===t.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:t.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(d){this.setState({authenticationResponse:d,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=r.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,C.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,C.jsx)(a.TranslationConsumer,{children:e=>(0,C.jsxs)(o.Modal,{open:!0,size:"mini",children:[(0,C.jsxs)(o.Modal.Content,{children:[(0,C.jsxs)("div",{className:"row",children:[(0,C.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,C.jsx)("h4",{children:e("User_Authentication")})}),(0,C.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,C.jsx)(o.Icon,{root:"common",name:"close"})})]}),(0,C.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)("label",{children:(0,C.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)(o.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,C.jsxs)(o.Modal.Footer,{children:[(0,C.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,C.jsx)(o.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const f=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(S)},96551:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>E});var s=i(65043),a=i(66554),o=i(97508),n=i(40252),r=i(69062),l=i(14159),d=i(11981),c=i(65187),h=i(46100),u=i(40854),m=i.n(u),p=i(72067),g=i(44192),C=(i(38726),i(43503)),S=i(53536),f=i.n(S),v=i(72711),x=i(67907),y=i(80312),j=i(70579);function b(e){let{modSlotConfiguration:t,validationErrors:i,onFieldChange:s}=e;return(0,j.jsx)(x.TranslationConsumer,{children:e=>(0,j.jsx)("div",{className:"detailsContainer",children:(0,j.jsxs)("div",{className:"row",children:[(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.SlotStartTime.Value,indicator:"required",disabled:!1,onChange:e=>s("SlotStartTime",e),label:e("SlotStartTime"),error:e(i.SlotStartTime),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.SlotEndTime.Value,indicator:"required",disabled:!1,onChange:e=>s("SlotEndTime",e),label:e("SlotEndTime"),error:e(i.SlotEndTime),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.PreLoadingDuration.Value,indicator:"required",disabled:!1,onChange:e=>s("PreLoadingDuration",e),label:e("PreLoadingDuration"),error:e(i.PreLoadingDuration),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.SlotDuration.Value,indicator:"required",disabled:!1,onChange:e=>s("SlotDuration",e),label:e("SlotConfiguration_SlotDuration"),error:e(i.SlotDuration),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.PostLoadingDuration.Value,indicator:"required",disabled:!1,onChange:e=>s("PostLoadingDuration",e),label:e("PostLoadingDuration"),error:e(i.PostLoadingDuration),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.MaxNoOfSlots.Value,indicator:"required",disabled:!1,onChange:e=>s("MaxNoOfSlots",e),label:e("MaxNoOfSlots"),error:e(i.MaxNoOfSlots),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.BookAdvSlotMinutes.Value,indicator:"required",disabled:!1,onChange:e=>s("BookAdvSlotMinutes",e),label:e("BookAdvSlotMinutes"),error:e(i.BookAdvSlotMinutes),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.AdvanceSlotBookMaxDays.Value,indicator:"required",disabled:!1,onChange:e=>s("AdvanceSlotBookMaxDays",e),label:e("AdvanceSlotBookMaxDays"),error:e(i.AdvanceSlotBookMaxDays),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.ChangeAdvSlotMinutes.Value,indicator:"required",disabled:!1,onChange:e=>s("ChangeAdvSlotMinutes",e),label:e("ChangeAdvSlotMinutes"),error:e(i.ChangeAdvSlotMinutes),reserveSpace:!1})}),(0,j.jsx)("div",{className:"col-12 col-md-6 col-lg-4",children:(0,j.jsx)(v.Input,{fluid:!0,value:t.SlotParams.RefreshInterval.Value,indicator:"required",disabled:!1,onChange:e=>s("RefreshInterval",e),label:e("RefreshInterval"),error:e(i.RefreshInterval),reserveSpace:!1})})]})})})}var R=i(62900);class A extends s.Component{constructor(){super(...arguments),this.state={validationErrors:r.Th(g.g4),transportationType:"",terminalCode:"",isReadyToRender:!1,slotConfiguration:f().cloneDeep(h.au),modSlotConfiguration:f().cloneDeep(h.au),saveEnabled:!1,isNew:!1,showAuthenticationLayout:!1,tempSlotConfiguration:{}},this.saveSlotConfiguration=()=>{try{this.setState({saveEnabled:!1});let e=f().cloneDeep(this.state.tempSlotConfiguration);this.updateSlotConfiguration(e)}catch(e){console.log("RigidTruckDetailsComposite : Error in saveVehicle")}},this.handleSave=()=>{try{console.log("SlotConfigurationDetailsComposite:inside handleSave");let e=this.fillSlotConfigurationForAPI(this.state.modSlotConfiguration);if(!this.validateSave(e))return void this.setState({saveEnabled:!0});{let t=!0!==this.props.userDetails.EntityResult.IsWebPortalUser,i=f().cloneDeep(e);this.setState({showAuthenticationLayout:t,tempSlotConfiguration:i},(()=>{!1===t&&this.saveSlotConfiguration()})),console.log("SlotConfigurationDetailsComposite:Validation passed")}}catch(e){console.log("SlotConfigurationDetailsComposite:Error occured on handleSave",e)}},this.handleChange=(e,t)=>{try{const i=f().cloneDeep(this.state.modSlotConfiguration);i.SlotParams[e].Value=t,i.SlotParams[e].DefaultValue=t,this.setState({modSlotConfiguration:i});const s=f().cloneDeep(this.state.validationErrors);void 0!==g.g4[e]&&(s[e]=r.jr(g.g4[e],t),this.setState({validationErrors:s}))}catch(i){console.log("SlotConfigurationDetailsComposite:Error occured on handleChange",i)}},this.handleAuthenticationClose=()=>{this.setState({showAuthenticationLayout:!1})}}componentDidMount(){try{r.pJ(this.props.userDetails.EntityResult.IsArchived),this.getSlotConfigurations()}catch(e){console.log("SlotConfigurationDetail:Error occurred on ",e)}}getTransportationType(){var e="";const{genericProps:t}=this.props;return void 0!==t&&void 0!==t.transportationType&&(e=t.transportationType),this.setState({transportationType:e},(()=>{})),e}getTerminals(){var e="";let t={messageType:"critical",message:"TerminalList_NotAvailable",messageResultDetails:[]};return m()(p.fnw,r.Jm(this.props.tokenDetails.tokenInfo)).then((i=>{var s=i.data;!0===s.IsSuccess&&Array.isArray(s.EntityResult)&&s.EntityResult.length>0?(e=s.EntityResult[0].Key.Code,this.setState({isReadyToRender:!1,terminalCode:s.EntityResult[0].Key.Code},(()=>{}))):(console.log("Error while getting Terminal List:",s),(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:t})}),{autoClose:"success"===t.messageType&&1e4}))})).catch((e=>{(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:t})}),{autoClose:"success"===t.messageType&&1e4}),console.log("Error while getting Terminal List:",e)})),e}getSlotConfigurations(){let e=this.getTransportationType(),t=this.getTerminals(),i={messageType:"critical",message:"SlotConfigurationsEmpty",messageResultDetails:[]};m()(p.fnw,r.Jm(this.props.tokenDetails.tokenInfo)).then((s=>{var a=s.data;!0===a.IsSuccess&&Array.isArray(a.EntityResult)&&a.EntityResult.length>0?(t=a.EntityResult[0].Key.Code,this.setState({isReadyToRender:!1,terminalCode:a.EntityResult[0].Key.Code,saveEnabled:r.ab(this.props.userDetails.EntityResult.FunctionsList,y.i.modify,y.$J)},(()=>{m()(p.rC7+e+"&TerminalCode="+t+"&GetIfEmpty=true",r.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){if(""===t.EntityResult.SlotParams[0].Value){this.setState({isnew:!0});let e={messageType:"critical",message:"SlotConfiguration_New",messageResultDetails:[]};(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4})}this.setState({slotConfiguration:f().cloneDeep(t.EntityResult)});let e=this.fillSlotConfigurationForUI(this.state.slotConfiguration);this.setState({isReadyToRender:!0,slotConfiguration:e,modSlotConfiguration:e,saveEnabled:r.ab(this.props.userDetails.EntityResult.FunctionsList,y.i.add,y.$J)})}else console.log("Suchitra:Error in getslotconfig"),(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4}),console.log("Error while getting getSlotConfigurations:",t)})).catch((e=>{this.setState({isReceiptsRefreshing:!1,isShipmentsRefreshing:!1}),(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4}),console.log("Error while getting getSlotConfigurations:",e)}))}))):(console.log("Error while getting Terminal List:",a),(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4}))})).catch((e=>{(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4}),console.log("Error while getting Terminal List:",e)}))}fillSlotConfigurationForAPI(e){var t,i=f().cloneDeep(h.LB);return i.TerminalCode=e.TerminalCode,i.TransportationType=e.TransportationType,i.SlotParams=[],Object.keys(e.SlotParams).forEach((s=>((t=f().cloneDeep(h.tn)).Name=s,t.Value=e.SlotParams[s].Value,t.DefaultValue=e.SlotParams[s].DefaultValue,t.Description=e.SlotParams[s].Description,i.SlotParams.push(t)))),i}fillSlotConfigurationForUI(e){var t=f().cloneDeep(h.au);return t.TerminalCode=e.TerminalCode,t.TransportationType=e.TransportationType,Object.keys(t.SlotParams).forEach((i=>(t.SlotParams[i].Value=""===e.SlotParams.filter((e=>e.Name===i))[0].Value||null===e.SlotParams.filter((e=>e.Name===i))[0].Value?e.SlotParams.filter((e=>e.Name===i))[0].DefaultValue:e.SlotParams.filter((e=>e.Name===i))[0].Value,t.SlotParams[i].DefaultValue=e.SlotParams.filter((e=>e.Name===i))[0].DefaultValue,t.SlotParams[i].Description=e.SlotParams.filter((e=>e.Name===i))[0].Description))),t}validateSave(e){const t={...this.state.validationErrors};Object.keys(g.g4).forEach((function(i){void 0!==e[i]&&(t[i]=r.jr(g.g4[i],e.SlotParams[i]))})),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i}updateSlotConfiguration(e){let t={Entity:e},i={messageType:"critical",message:"SlotConfiguration_SavedStatus",messageResultDetails:[{keyFields:["TerminalCode"],keyValues:[e.TerminalCode],isSuccess:!1,errorMessage:""}]};m()(p.zzR,r.tW(t,this.props.tokenDetails.tokenInfo)).then((e=>{let t=e.data;i.messageType=t.IsSuccess?"success":"critical",i.messageResultDetails[0].isSuccess=t.IsSuccess,!0===t.IsSuccess?(this.handleAuthenticationClose(),this.setState({saveEnabled:r.ab(this.props.userDetails.EntityResult.FunctionsList,y.i.modify,y.$J)})):(this.handleAuthenticationClose(),i.messageResultDetails[0].errorMessage=t.ErrorList[0],this.setState({saveEnabled:r.ab(this.props.userDetails.EntityResult.FunctionsList,y.i.add,y.$J)})),this.props.onNotice(i)})).catch((e=>{this.handleAuthenticationClose(),this.setState({saveEnabled:r.ab(this.props.userDetails.EntityResult.FunctionsList,y.i.add,y.$J)}),i.messageResultDetails[0].errorMessage=e}))}render(){return this.state.isReadyToRender?(0,j.jsxs)("div",{children:[(0,j.jsx)(c.A,{children:(0,j.jsx)(C.A,{newEntityName:"SlotConfiguration_lblPageTitle"})}),(0,j.jsx)(c.A,{children:(0,j.jsx)(b,{slotConfiguration:this.state.slotConfiguration,modSlotConfiguration:this.state.modSlotConfiguration,onFieldChange:this.handleChange,validationErrors:this.state.validationErrors,isNew:this.state.isNew})}),(0,j.jsx)(c.A,{children:(0,j.jsx)(x.TranslationConsumer,{children:e=>(0,j.jsx)("div",{className:"row",children:(0,j.jsx)("div",{className:"col col-12",style:{textAlign:"right"},children:(0,j.jsx)(v.Button,{content:e("Save"),disabled:!this.state.saveEnabled,onClick:()=>this.handleSave()})})})})}),this.state.showAuthenticationLayout?(0,j.jsx)(R.A,{Username:this.props.userDetails.EntityResult.UserName,functionName:y.i.modify,functionGroup:y.$J,handleClose:this.handleAuthenticationClose,handleOperation:this.saveSlotConfiguration}):null]}):(0,j.jsx)(n.A,{message:"Loading"})}}const D=(0,o.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(A);i(92342),i(63973);class P extends s.Component{constructor(){super(...arguments),this.state={isReadyToRender:!1,operationsVisibility:{add:!1,delete:!1,shareholder:!1}},this.notifyEvent=e=>{try{(0,l.toast)((0,j.jsx)(c.A,{children:(0,j.jsx)(d.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4})}catch(t){console.log("SlotConfigurationComposite: Error occurred on savedEvent",t)}}}componentDidMount(){try{r.pJ(this.props.userDetails.EntityResult.IsArchived),this.setState({isReadyToRender:!0})}catch(e){console.log("SlotConfigurationComposite:Error occurred on componentDidMount",e)}}render(){return(0,j.jsx)(x.TranslationConsumer,{children:e=>(0,j.jsxs)("div",{children:[(0,j.jsx)(c.A,{children:(0,j.jsx)(a.$,{operationsVisibility:this.state.operationsVisibility,breadcrumbItem:this.props.activeItem,handleBreadCrumbClick:this.props.handleBreadCrumbClick,addVisible:!1,deleteVisible:!1,shrVisible:!1})}),(0,j.jsx)(c.A,{children:this.state.isReadyToRender?(0,j.jsx)(D,{Key:"SlotConfigurationDetail",onNotice:this.notifyEvent,genericProps:this.props.activeItem.itemProps}):(0,j.jsx)(n.A,{message:"Loading"})}),(0,j.jsx)(c.A,{children:(0,j.jsx)(l.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})})}}const E=(0,o.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(P)},43503:(e,t,i)=>{"use strict";i.d(t,{A:()=>r});i(65043);var s=i(67907),a=i(72711),o=i(70579);function n(e){let{entityCode:t,newEntityName:i,popUpContents:n}=e;return(0,o.jsx)(s.TranslationConsumer,{children:e=>(0,o.jsx)("div",{className:"headerContainer",children:(0,o.jsxs)("div",{className:"row headerSpacing",children:[(0,o.jsx)("div",{className:"col paddingHeaderItemLeft",children:(0,o.jsx)("span",{style:{margin:"auto"},className:"headerLabel",children:""===t||void 0===t?e(i):t})}),""!==t&&void 0!==t&&n.length>0?(0,o.jsx)("div",{className:"headerItemRight",children:(0,o.jsx)(a.Popup,{element:(0,o.jsxs)("div",{children:[e(n[0].fieldName)+" ",":"," "+n[0].fieldValue,(0,o.jsx)(a.Icon,{style:{marginLeft:"10px"},root:"common",name:"caret-down",size:"small"})]}),position:"bottom left",children:(0,o.jsx)(a.List,{className:"detailsHeaderPopUp",children:n.map((t=>(0,o.jsxs)(a.List.Content,{className:"detailsHeaderPopUpListPadding",children:[e(t.fieldName)+" ",":"," "+t.fieldValue]},"content.fieldName")))})})}):""]})})})}n.defaultProps={entityCode:"",newEntityName:"",popUpContents:[]};const r=n},80312:(e,t,i)=>{"use strict";i.d(t,{$3:()=>K,$H:()=>se,$J:()=>me,$K:()=>ge,$V:()=>Pt,$b:()=>xt,$p:()=>F,AE:()=>R,Al:()=>O,B2:()=>st,By:()=>Rt,CW:()=>gt,DA:()=>l,Ee:()=>qe,FO:()=>N,Fy:()=>ke,G9:()=>it,H8:()=>ee,Hq:()=>rt,Ig:()=>M,Iu:()=>S,JI:()=>dt,JJ:()=>te,JU:()=>$,Jz:()=>$e,KQ:()=>ne,Kk:()=>Ze,Kw:()=>et,LP:()=>Tt,LR:()=>c,Lg:()=>Q,Mg:()=>xe,Mm:()=>k,N1:()=>Y,Nm:()=>p,No:()=>de,Ow:()=>_,P2:()=>o,P8:()=>fe,PD:()=>Ie,PE:()=>h,PG:()=>W,PP:()=>mt,Pb:()=>Ve,QB:()=>y,QC:()=>Z,RE:()=>ot,RO:()=>Qe,Rc:()=>St,Rl:()=>yt,Rx:()=>Ct,TI:()=>f,Tm:()=>pe,Ug:()=>X,Ur:()=>He,V9:()=>d,VK:()=>H,VL:()=>ue,VQ:()=>re,WD:()=>Le,Wf:()=>P,YO:()=>w,YY:()=>Ne,Yb:()=>Ce,Yg:()=>Ke,Z9:()=>ut,ZE:()=>ct,ZU:()=>x,_N:()=>ft,_S:()=>Et,_d:()=>Nt,aS:()=>q,aZ:()=>ht,au:()=>be,b0:()=>Dt,bL:()=>Oe,c2:()=>Be,d4:()=>Me,dB:()=>C,dD:()=>Fe,dK:()=>J,dY:()=>I,de:()=>u,dv:()=>Ee,eQ:()=>r,f3:()=>ye,fF:()=>L,fL:()=>vt,fN:()=>bt,fk:()=>E,fl:()=>Se,fr:()=>j,go:()=>a,h:()=>he,hD:()=>D,hE:()=>T,hh:()=>Xe,hk:()=>oe,hz:()=>pt,i:()=>s,j2:()=>nt,jN:()=>z,je:()=>g,jx:()=>B,kL:()=>Ye,ke:()=>_e,km:()=>le,l0:()=>ae,l6:()=>Je,lz:()=>V,m0:()=>v,nS:()=>Ae,nk:()=>lt,nn:()=>b,np:()=>G,oh:()=>at,op:()=>We,pt:()=>Ue,qk:()=>ce,qp:()=>ve,r6:()=>De,rQ:()=>Pe,rj:()=>U,rp:()=>n,t3:()=>jt,tM:()=>we,to:()=>wt,ts:()=>tt,uH:()=>je,uy:()=>Ge,w1:()=>Te,x5:()=>ie,xz:()=>A,y_:()=>ze,yu:()=>m,yx:()=>At,z8:()=>Re,z_:()=>It});const s={view:"view",add:"add",modify:"modify",remove:"remove"},a="carriercompany",o="driver",n="customer",r="trailer",l="originterminal",d="destination",c="primemover",h="vehicle",u="shipmentbycompartment",m="shipmentbyproduct",p="ViewShipmentStatus",g="vessel",C="order",S="OrderForceClose",f="contract",v="receiptplanbycompartment",x="ViewMarineShipment",y="MarineShipmentByCompartment",j="ViewMarineReceipt",b="supplier",R="finishedproduct",A="RailDispatch",D="RailReceipt",P="RailRoute",E="RailWagon",T="CloseRailDispatch",N="PrintRailBOL",I="PrintRailFAN",w="RailDispatchLoadSpotAssignment",V="RailDispatchProductAssignment",M="ViewRailDispatch",k="ViewRailLoadingDetails",L="CloseRailReceipt",U="PrintRailBOD",B="PrintRailRAN",O="ViewRailReceipt",F="ViewRailUnLoadingDetails",q="SMS",_="UnAccountedTransactionTank",H="UnAccountedTransactionMeter",J="PipelineDispatch",K="PipelineReceipt",z="PipelineDispatchManualEntry",$="PipelineReceiptManualEntry",W="LookUpData",G="HSEInspection",Q="HSEInspectionConfig",Y="Email",Z="Shareholder",X="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",se="LeakageManualEntry",ae="Terminal",oe="SlotInformation",ne="TankGroup",re="Tank",le="SealMaster",de="TankEODEntry",ce="UnmatchedLocalTransactions",he="AccessCard",ue="ResetPin",me="SlotConfiguration",pe="PrintMarineFAN",ge="PrintMarineBOL",Ce="ViewMarineLoadingDetails",Se="ViewMarineShipmentAuditTrail",fe="CloseMarineShipment",ve="IssueCard",xe="ActivateCard",ye="RevokeCard",je="AutoIDAssociation",be="MarineReceiptByCompartment",Re="PrintMarineRAN",Ae="PrintMarineBOD",De="ViewMarineUnloadingDetails",Pe="ViewMarineReceiptAuditTrail",Ee="CloseMarineReceipt",Te="WeekendConfig",Ne="EODAdmin",Ie="PrintBOL",we="PrintFAN",Ve="PrintBOD",Me="CloseShipment",ke="CloseReceipt",Le="CONTRACTFORCECLOSE",Ue="Captain",Be="OverrideShipmentSequence",Oe="KPIInformation",Fe="Language",qe="WebPortalUserMap",_e="BayGroup",He="PipelineHeaderSiteView",Je="TankMonitor",Ke="PersonAdmin",ze="ProductReconciliationReports",$e="ReportConfiguration",We="EXECONFIGURATION",Ge="ShareholderAllocation",Qe="NotificationGroup",Ye="NotificationRestriction",Ze="NotificationConfig",Xe="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",st="TANKSHAREHOLDERPRIMEFUNCTION",at="ROLEADMIN",ot="ShiftConfig",nt="PrinterConfiguration",rt="CustomerAgreement",lt="BaySCADAConfiguration",dt="RailReceiptUnloadSpotAssignment",ct="STAFF_VISITOR",ht="PipelineMeterSiteView",ut="RailSiteView",mt="MarineSiteView",pt="LoadingDetails",gt="UnloadingDetails",Ct="RoadHSEInspection",St="RoadHSEInspectionConfig",ft="MarineHSEInspection",vt="MarineHSEInspectionConfig",xt="RailHSEInspection",yt="RailHSEInspectionConfig",jt="PipelineHSEInspection",bt="PipelineHSEInspectionConfig",Rt="PrintRAN",At="ViewReceiptStatus",Dt="customerrecipe",Pt="COAParameter",Et="COATemplate",Tt="COAManagement",Nt="COACustomer",It="COAAssignment",wt="ProductForecastConfiguration"},50477:()=>{}}]);
//# sourceMappingURL=679.6fbeb686.chunk.js.map