(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[8211],{66554:(e,i,t)=>{"use strict";t.d(i,{$:()=>d});var o=t(65043),r=t(72711),n=t(67907),l=t(65187),a=t(69062),s=t(70579);function c(e){let{operationsVisibilty:i,breadcrumbItem:t,shareholders:c,selectedShareholder:d,onShareholderChange:p,onDelete:u,onAdd:m,popUpContent:h,shrVisible:C,handleBreadCrumbClick:g,addVisible:S,deleteVisible:x}=e;const[R,f]=(0,o.useState)(!1),[y,P]=(0,o.useState)(!1);function j(){i.add&&(h.length>0?P(!1===y):m())}return(0,s.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,s.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,s.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,s.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,s.jsxs)(l.A,{children:[" ",(0,s.jsx)(n.TranslationConsumer,{children:e=>(0,s.jsxs)(r.Breadcrumb,{children:[t.parents.map((i=>(0,s.jsx)(r.Breadcrumb.Item,{onClick:()=>{void 0!==g&&null!==g&&g(i.itemCode,t.parents)},children:e(i.localizedKey)},i.itemCode))),(0,s.jsx)(r.Breadcrumb.Item,{children:e(t.localizedKey)},t.itemCode)]})})]})}),(0,s.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,s.jsx)(n.TranslationConsumer,{children:e=>(0,s.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===C?"":(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{children:(0,s.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,s.jsx)("div",{className:"opSelect",children:(0,s.jsx)(r.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!i.shareholder,options:a.Zj(c),onChange:e=>p(e)})})]})})})}),(0,s.jsx)(n.TranslationConsumer,{children:e=>(0,s.jsxs)(r.Modal,{open:R,size:"small",children:[(0,s.jsx)(r.Modal.Content,{children:(0,s.jsx)("div",{children:(0,s.jsx)("b",{children:e("Confirm_Delete")})})}),(0,s.jsxs)(r.Modal.Footer,{children:[(0,s.jsx)(r.Button,{type:"secondary",content:e("Cancel"),onClick:()=>f(!1)}),(0,s.jsx)(r.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{f(!1),u()}})]})]})})]})}),(0,s.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,s.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[S?(0,s.jsx)(r.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,s.jsx)("div",{className:(i.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:j,children:(0,s.jsx)(r.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:y,children:(0,s.jsx)("div",{onMouseLeave:()=>P(!1),children:(0,s.jsx)(n.TranslationConsumer,{children:e=>(0,s.jsx)(r.VerticalMenu,{children:(0,s.jsxs)(r.VerticalMenu,{children:[(0,s.jsx)(r.VerticalMenu.Header,{children:e("Common_Create")}),h.map((i=>(0,s.jsx)(r.VerticalMenu.Item,{onClick:()=>{return e=i.fieldName,P(!1),void m(e);var e},children:e(i.fieldValue)})))]})})})})}):"",x?(0,s.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{i.delete&&f(!0)},className:(i.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,s.jsx)(r.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};t(38726);function d(e){let{operationsVisibilty:i,breadcrumbItem:t,shareholders:o,selectedShareholder:r,onShareholderChange:n,onDelete:l,onAdd:a,popUpContent:d,shrVisible:p,handleBreadCrumbClick:u,addVisible:m,deleteVisible:h}=e;return(0,s.jsx)(c,{operationsVisibilty:i,breadcrumbItem:t,shareholders:o,selectedShareholder:r,onShareholderChange:n,onDelete:l,onAdd:a,popUpContent:d,shrVisible:p,handleBreadCrumbClick:u,addVisible:m,deleteVisible:h})}},62900:(e,i,t)=>{"use strict";t.d(i,{A:()=>x});var o=t(65043),r=t(67907),n=t(72711),l=t(72067),a=t(69062),s=t(97508),c=t(44192),d=t(40854),p=t.n(d),u=t(53536),m=t.n(u),h=t(86111),C=t.n(h),g=t(70579);class S extends o.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:a.Th(c.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,i)=>{this.setState({Password:i});const t=m().cloneDeep(this.state.validationErrors);void 0!==c.Qh[e]&&(t[e]=a.jr(c.Qh[e],i),this.setState({validationErrors:t,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const i={...this.state.validationErrors};null!==e&&""!==e||(i.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:i});var t=!0;return t&&(t=Object.values(i).every((function(e){return""===e}))),t},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,i=this.props.Username,t=C().lib.WordArray.random(16),o=C().PBKDF2(i,t,{keySize:8,iterations:100}),r=C().lib.WordArray.random(16),n=C().AES.encrypt(e,o,{iv:r,padding:C().pad.Pkcs7,mode:C().mode.CBC}),s=t.toString()+r.toString()+n.toString();p()(l.KrY+"?encryptedPassword="+encodeURIComponent(s),a.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var i=e.data;!0===i.IsSuccess&&"true"===i.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:i.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(c){this.setState({authenticationResponse:c,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=a.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,g.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,g.jsx)(r.TranslationConsumer,{children:e=>(0,g.jsxs)(n.Modal,{open:!0,size:"mini",children:[(0,g.jsxs)(n.Modal.Content,{children:[(0,g.jsxs)("div",{className:"row",children:[(0,g.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,g.jsx)("h4",{children:e("User_Authentication")})}),(0,g.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,g.jsx)(n.Icon,{root:"common",name:"close"})})]}),(0,g.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,g.jsx)("div",{className:"col col-lg-12",children:(0,g.jsx)("label",{children:(0,g.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,g.jsx)("div",{className:"col col-lg-12",children:(0,g.jsx)(n.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,g.jsxs)(n.Modal.Footer,{children:[(0,g.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,g.jsx)(n.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const x=(0,s.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(S)},19380:(e,i,t)=>{"use strict";t.d(i,{A:()=>y});var o=t(65043),r=t(728),n=t(62672),l=t(27976),a=t(44063),s=t(39078),c=t(48546),d=t(82967),p=t(11201),u=t(43439),m=(t(60663),t(48385)),h=t(72711),C=t(67907),g=t(65187),S=t(53536),x=(t(90837),t(70579));const R=e=>{const[i,t]=(0,o.useState)(null),[R]=(0,C.useTranslation)(),f=i=>new r.CollectionView(e.sourceData,{pageSize:i}),[y,P]=(0,o.useState)(f(e.rowsPerPage)),j=o.createRef(),w=o.createRef(),D=o.createRef(),b=o.createRef(),E=o.useRef(),N=o.useRef(e.selectionRequired?[]:null);let T=null;const v=i=>{try{if(k(),e.onRowClick&&i.addEventListener(i.hostElement,"click",(t=>{let o=i.hitTest(t);if(o.target.closest(".wj-cell")&&![...o.target.closest(".wj-cell").classList].includes("wj-group")&&o.cellType===n.CellType.Cell){const t=i.rows[o.row].dataItem;e.onRowClick(t)}})),i.selectionMode=r.asEnum("None",n.SelectionMode),i.select(-1,-1),t(i),e.selectionRequired){T=new p.Selector(i,{itemChecked:(t,o)=>{e.singleSelection&&i.rows.filter((e=>e.isSelected&&1===N.current.filter((i=>S.isEqual(i,e.dataItem))).length)).forEach((e=>{e.isSelected=!1})),e.onSelectionHandle(i.rows.filter((e=>e.isSelected)).map((e=>e.dataItem)))},showCheckAll:!e.singleSelection});let t=T.column.grid;T.column=t.rowHeaders.columns[0],t.headersVisibility=n.HeadersVisibility.All,t.selectionMode=r.asEnum("None",n.SelectionMode)}}catch(o){console.log("Error in gridInitialized: "+o)}};(0,o.useEffect)((()=>{try{if(null!=j){let e=j.current.control;w.current.control.grid=e}P(f(e.rowsPerPage))}catch(i){console.log("Error in grid update:",i)}}),[e.sourceData]),(0,o.useEffect)((()=>{try{i&&e.selectionRequired&&(N.current.length=0,N.current.push(...e.selectedItems),i.rows.forEach((i=>{1===e.selectedItems.filter((e=>S.isEqual(e,i.dataItem))).length?i.isSelected=!0:i.isSelected=!1})),i.refresh())}catch(t){console.log("Error in pre-selecting rows:",t)}}),[e.selectedItems]),(0,o.useEffect)((()=>{try{if(localStorage.getItem(e.parentComponent+"GridState")&&"null"!==localStorage.getItem(e.parentComponent+"GridState")&&i){let o=JSON.parse(localStorage.getItem(e.parentComponent+"GridState")),n=i;n.columns.forEach((e=>{let i=o.columns.filter((i=>i.binding===e.binding));e.visible=i.length>0?i[0].visible:e.visible})),D.current.control.filterDefinition=o.filterDefinition,n.collectionView.deferUpdate((()=>{n.collectionView.sortDescriptions.clear();for(let e=0;e<o.sortDescriptions.length;e++){let i=o.sortDescriptions[e];n.collectionView.sortDescriptions.push(new r.SortDescription(i.property,i.ascending))}}));for(let e=0;e<o.groupDescriptions.length;e++)n.collectionView.groupDescriptions.push(new r.PropertyGroupDescription(o.groupDescriptions[e])),n.columns.filter((i=>i.binding===o.groupDescriptions[e]))[0].visible=!1;if(sessionStorage.getItem(e.parentComponent+"GridState")&&"null"!==sessionStorage.getItem(e.parentComponent+"GridState")){let i=JSON.parse(sessionStorage.getItem(e.parentComponent+"GridState"));n.collectionView.moveToPage(n.collectionView.pageCount-1>=i.pageIndex?i.pageIndex:n.collectionView.pageCount-1),w&&(w.current.control.text=i.searchText)}t(n),i.refresh()}}catch(o){console.log("Error in restoring local storage settings: ",o)}}),[y]),(0,o.useEffect)((()=>{try{i&&E.current&&e.columnPickerRequired&&(E.current.itemsSource=i.columns,E.current.checkedMemberPath="visible",E.current.displayMemberPath="header",E.current.lostFocus.addHandler((()=>{(0,r.hidePopup)(E.current.hostElement)})))}catch(t){console.log("Error in initializing column picker properties:",t)}}),[E.current]),(0,o.useEffect)((()=>()=>{e.columnPickerRequired&&E.current&&(0,r.hidePopup)(E.current.hostElement)}),[]);const A=()=>{try{let o=i;o.itemsSource.pageSize=e.sourceData.length,t(o),u.FlexGridXlsxConverter.saveAsync(i,{includeColumnHeaders:!0,includeCellStyles:!1,formatItem:null},e.exportFileName),o.itemsSource.pageSize=e.rowsPerPage,t(o)}catch(o){console.log("Error in export grid to excel:",o)}},F=(i,t)=>{if(void 0!==t&&null!==t){if("boolean"===typeof i||"Active"===t.Name)return i?(0,x.jsx)(h.Icon,{name:"check",size:"small",color:"green"}):(0,x.jsx)(h.Icon,{name:"close",size:"small",color:"red"});if(""===i||null===i||void 0===i)return i;if(("TerminalCodes"===t.Name||"1"===t.PopOver)&&null!==i)return(o=i).split(",").length>e.terminalsToShow?(0,x.jsx)(h.Popup,{className:"popup-theme-wrap",on:"hover",element:o.split(",").length,children:(0,x.jsx)(h.Card,{children:(0,x.jsx)(h.Card.Content,{children:o})})}):o;if(void 0!==t.DataType&&"DateTime"===t.DataType)return new Date(i).toLocaleDateString()+" "+new Date(i).toLocaleTimeString();if(void 0!==t.DataType&&"Date"===t.DataType)return new Date(i).toLocaleDateString();if(void 0!==t.DataType&&"Time"===t.DataType)return new Date(i).toLocaleTimeString()}var o;return i},G=()=>{try{if(i&&D.current){let t={columns:i.columns.map((e=>({binding:e.binding,visible:e.visible}))),filterDefinition:D.current.control.filterDefinition,sortDescriptions:i.collectionView.sortDescriptions.map((e=>({property:e.property,ascending:e.ascending}))),groupDescriptions:i.collectionView.groupDescriptions.map((e=>e.propertyName?e.propertyName:null))};if(i.collectionView.groupDescriptions&&i.collectionView.groupDescriptions.length>0){[...document.getElementsByClassName("wj-column-selector-group")].forEach((e=>{e.parentNode.parentNode.classList.add("wj-grouped-checkbox")}))}let o={pageIndex:i.collectionView.pageIndex,searchText:w.current.control.text};localStorage.setItem(e.parentComponent+"GridState",JSON.stringify(t)),sessionStorage.setItem(e.parentComponent+"GridState",JSON.stringify(o))}}catch(t){console.log("Error in saving grid state")}},k=()=>{let e=r.culture.FlexGridFilter,i=s.Operator;r.culture.FlexGridFilter.header=R("WijmoGridFilterHeader"),r.culture.FlexGridFilter.ascending="\u2191 "+R("WijmoGridFilterAscending"),r.culture.FlexGridFilter.descending="\u2193 "+R("WijmoGridFilterDescending"),r.culture.FlexGridFilter.apply=R("RoleAdminEdit_Apply"),r.culture.FlexGridFilter.clear=R("OrderCreate_btnClear"),r.culture.FlexGridFilter.conditions=R("WijmoGridFilterCondition"),r.culture.FlexGridFilter.values=R("WijmoGridFilterValue"),r.culture.FlexGridFilter.search=R("LoadingDetailsView_SearchGrid"),r.culture.FlexGridFilter.selectAll=R("WijmoGridFilterSelectAll"),r.culture.FlexGridFilter.and=R("WijmoGridFilterAnd"),r.culture.FlexGridFilter.or=R("WijmoGridFilterOr"),r.culture.FlexGridFilter.cancel=R("AccessCardInfo_Cancel"),e.stringOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:i.EQ},{name:R("WijmoGridFilterNotEqual"),op:i.NE},{name:R("WijmoGridFilterBeginsWith"),op:i.BW},{name:R("WijmoGridFilterEndsWith"),op:i.EW},{name:R("WijmoGridFilterContains"),op:i.CT},{name:R("WijmoGridFilterDoesNotContain"),op:i.NC}],e.numberOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:i.EQ},{name:R("WijmoGridFilterNotEqual"),op:i.NE},{name:R("WijmoGridFilterGreaterThan"),op:i.GT},{name:R("WijmoGridFilterLessThan"),op:i.LT},{name:R("WijmoGridFilterGreaterThanOrEqual"),op:i.GE},{name:R("WijmoGridFilterLessThanOrEqual"),op:i.LE}],e.dateOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:i.EQ},{name:R("WijmoGridFilterDateEarlierThan"),op:i.LT},{name:R("WijmoGridFilterDateLaterThan"),op:i.GT}],e.booleanOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:i.EQ},{name:R("WijmoGridFilterNotEqual"),op:i.NE}]},I=e=>{try{if(window.screen.width<1024&&e.WidthPx&&""!==e.WidthPx)return parseInt(e.WidthPx)}catch(i){console.log("Error in width:",i)}return e.WidthPercentage.includes("*")?e.WidthPercentage:parseInt(e.WidthPercentage)};return(0,x.jsx)("div",{className:"pl-1",children:(0,x.jsx)(g.A,{children:(0,x.jsx)(C.TranslationConsumer,{children:t=>(0,x.jsxs)(o.Fragment,{children:[(0,x.jsxs)("div",{className:"row pl-0",children:[(0,x.jsx)("div",{className:"col-10 col-sm-12 col-md-5 col-lg-6",children:(0,x.jsx)(c.q,{class:"ui single-input",ref:w,placeholder:t("LoadingDetailsView_SearchGrid")})}),(0,x.jsx)("div",{className:"col-10 col-sm-12 col-md-7 col-lg-6",children:(0,x.jsxs)("div",{style:{float:"right"},children:[e.columnPickerRequired?(0,x.jsxs)(h.Button,{id:"colPicker",actionType:"button",type:"primary",onClick:e=>(e=>{try{let t=E.current.hostElement;t.offsetHeight?((0,r.hidePopup)(t,!0,!0),i.focus()):((0,r.showPopup)(t,e.target,r.PopupPosition.Below,!0,!1),E.current.focus()),E.current.focus(),e.preventDefault()}catch(t){console.log("Error in Column Picker click event:",t)}})(e),children:[(0,x.jsx)("div",{style:{display:"inline-block"},children:t("WijmoGridColumnPicker")}),(0,x.jsx)("div",{style:{display:"inline-block"},children:(0,x.jsx)(h.Icon,{name:"caret-down",className:"btnIcon",size:"small"})})]}):null,e.exportRequired?(0,x.jsxs)(h.Button,{actionType:"button",type:"primary",className:"mt-3 mt-md-0",onClick:A,children:[(0,x.jsx)("div",{style:{display:"inline-block"},children:t("WijmoGridExport")}),(0,x.jsx)("div",{style:{display:"inline-block",marginLeft:"0.2rem"},children:(0,x.jsx)("span",{className:"icon-Xls",style:{fontSize:"17px",position:"absolute",top:"3px"}})})]}):null]})})]}),(0,x.jsxs)("div",{className:"tableScroll",children:[e.columnGroupingRequired?(0,x.jsx)(m.u,{className:"group-panel",grid:i,placeholder:t("WijmoGridGroupPanelPlaceholder")}):null,(0,x.jsx)(g.A,{children:(0,x.jsxs)(l.MC,{ref:j,autoGenerateColumns:!1,alternatingRowStep:0,autoRowHeights:!0,headersVisibility:"Column",itemsSource:y,selectionMode:r.asEnum("None",n.SelectionMode),initialized:v,virtualizationThreshold:[0,1e4],onUpdatedView:G,children:[(0,x.jsx)(a.M,{ref:D}),e.columns.map((i=>(0,x.jsx)(l.aK,{header:t(i.Name),binding:i.Name,width:I(i),minWidth:100,isReadOnly:!0,wordWrap:!0,align:"left",children:(0,x.jsx)(l.Gw,{cellType:"Cell",template:t=>(0,x.jsx)("span",{style:null!=e.conditionalRowStyleCheck&&e.conditionalRowStyleCheck(t.item)?{...e.conditionalRowStyles}:null,children:F(t.item[i.Name],i)})})},i.Name)))]})}),e.columnPickerRequired?(0,x.jsx)("div",{className:"column-picker-div",children:(0,x.jsx)(d.qF,{className:"column-picker",initialized:i=>(i=>{e.columnPickerRequired&&(E.current=i)})(i)})}):null]}),(0,x.jsx)("div",{className:"row",children:(0,x.jsx)(d.Ne,{ref:b,className:"ml-auto mr-auto mt-3",headerFormat:t("WijmoGridPagingTemplate"),byPage:!0,cv:y})})]})})})})};R.defaultProps={sourceData:[],columns:[],exportRequired:!0,exportFileName:"Grid.xlsx",selectionRequired:!1,columnPickerRequired:!1,columnGroupingRequired:!1,rowsPerPage:10,terminalsToShow:2,singleSelection:!1,selectedItems:[]};const f=R,y=e=>(0,x.jsx)(f,{sourceData:e.data,columns:e.columns,exportRequired:e.exportRequired,exportFileName:e.exportFileName,columnPickerRequired:e.columnPickerRequired,selectionRequired:e.selectionRequired,columnGroupingRequired:e.columnGroupingRequired,conditionalRowStyleCheck:e.conditionalRowStyleCheck,conditionalRowStyles:e.conditionalRowStyles,rowsPerPage:e.rowsPerPage,onSelectionHandle:e.onSelectionHandle,onRowClick:e.onRowClick,parentComponent:e.parentComponent,terminalsToShow:e.terminalsToShow,singleSelection:e.singleSelection,selectedItems:e.selectedItems})},23602:(e,i,t)=>{"use strict";t.d(i,{P:()=>n});t(65043);var o=t(19380),r=t(70579);function n(e){let{tableData:i,columnDetails:t,pageSize:n,exportRequired:l,exportFileName:a,columnPickerRequired:s,columnGroupingRequired:c,terminalsToShow:d,selectionRequired:p,onSelectionChange:u,onRowClick:m,parentComponent:h}=e;return(0,r.jsx)(o.A,{data:i,columns:t,rowsPerPage:n,exportRequired:l,exportFileName:a,columnPickerRequired:s,columnGroupingRequired:c,terminalsToShow:d,selectionRequired:p,onSelectionHandle:u,onRowClick:m,parentComponent:h})}},80312:(e,i,t)=>{"use strict";t.d(i,{$3:()=>z,$H:()=>oe,$J:()=>me,$K:()=>Ce,$V:()=>Ei,$b:()=>fi,$p:()=>W,AE:()=>w,Al:()=>q,B2:()=>oi,By:()=>wi,CW:()=>Ci,DA:()=>s,Ee:()=>Le,FO:()=>v,Fy:()=>Ie,G9:()=>ti,H8:()=>ee,Hq:()=>ai,Ig:()=>k,Iu:()=>S,JI:()=>ci,JJ:()=>ie,JU:()=>Q,Jz:()=>Qe,KQ:()=>le,Kk:()=>Xe,Kw:()=>ei,LP:()=>Ti,LR:()=>d,Lg:()=>$,Mg:()=>fe,Mm:()=>I,N1:()=>Y,Nm:()=>h,No:()=>ce,Ow:()=>B,P2:()=>n,P8:()=>xe,PD:()=>Ae,PE:()=>p,PG:()=>K,PP:()=>mi,Pb:()=>Ge,QB:()=>y,QC:()=>X,RE:()=>ni,RO:()=>$e,Rc:()=>Si,Rl:()=>yi,Rx:()=>gi,TI:()=>x,Tm:()=>he,Ug:()=>Z,Ur:()=>Ue,V9:()=>c,VK:()=>U,VL:()=>ue,VQ:()=>ae,WD:()=>Ve,Wf:()=>E,YO:()=>F,YY:()=>ve,Yb:()=>ge,Yg:()=>ze,Z9:()=>ui,ZE:()=>di,ZU:()=>f,_N:()=>xi,_S:()=>Ni,_d:()=>vi,aS:()=>L,aZ:()=>pi,au:()=>je,b0:()=>bi,bL:()=>qe,c2:()=>Oe,d4:()=>ke,dB:()=>g,dD:()=>We,dK:()=>H,dY:()=>A,de:()=>u,dv:()=>Ne,eQ:()=>a,f3:()=>ye,fF:()=>V,fL:()=>Ri,fN:()=>ji,fk:()=>N,fl:()=>Se,fr:()=>P,go:()=>r,h:()=>pe,hD:()=>b,hE:()=>T,hh:()=>Ze,hk:()=>ne,hz:()=>hi,i:()=>o,j2:()=>li,jN:()=>_,je:()=>C,jx:()=>O,kL:()=>Ye,ke:()=>Be,km:()=>se,l0:()=>re,l6:()=>He,lz:()=>G,m0:()=>R,nS:()=>De,nk:()=>si,nn:()=>j,np:()=>J,oh:()=>ri,op:()=>Ke,pt:()=>Me,qk:()=>de,qp:()=>Re,r6:()=>be,rQ:()=>Ee,rj:()=>M,rp:()=>l,t3:()=>Pi,tM:()=>Fe,to:()=>Fi,ts:()=>ii,uH:()=>Pe,uy:()=>Je,w1:()=>Te,x5:()=>te,xz:()=>D,y_:()=>_e,yu:()=>m,yx:()=>Di,z8:()=>we,z_:()=>Ai});const o={view:"view",add:"add",modify:"modify",remove:"remove"},r="carriercompany",n="driver",l="customer",a="trailer",s="originterminal",c="destination",d="primemover",p="vehicle",u="shipmentbycompartment",m="shipmentbyproduct",h="ViewShipmentStatus",C="vessel",g="order",S="OrderForceClose",x="contract",R="receiptplanbycompartment",f="ViewMarineShipment",y="MarineShipmentByCompartment",P="ViewMarineReceipt",j="supplier",w="finishedproduct",D="RailDispatch",b="RailReceipt",E="RailRoute",N="RailWagon",T="CloseRailDispatch",v="PrintRailBOL",A="PrintRailFAN",F="RailDispatchLoadSpotAssignment",G="RailDispatchProductAssignment",k="ViewRailDispatch",I="ViewRailLoadingDetails",V="CloseRailReceipt",M="PrintRailBOD",O="PrintRailRAN",q="ViewRailReceipt",W="ViewRailUnLoadingDetails",L="SMS",B="UnAccountedTransactionTank",U="UnAccountedTransactionMeter",H="PipelineDispatch",z="PipelineReceipt",_="PipelineDispatchManualEntry",Q="PipelineReceiptManualEntry",K="LookUpData",J="HSEInspection",$="HSEInspectionConfig",Y="Email",X="Shareholder",Z="LocationConfig",ee="DeviceConfig",ie="baseproduct",te="SiteView",oe="LeakageManualEntry",re="Terminal",ne="SlotInformation",le="TankGroup",ae="Tank",se="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",pe="AccessCard",ue="ResetPin",me="SlotConfiguration",he="PrintMarineFAN",Ce="PrintMarineBOL",ge="ViewMarineLoadingDetails",Se="ViewMarineShipmentAuditTrail",xe="CloseMarineShipment",Re="IssueCard",fe="ActivateCard",ye="RevokeCard",Pe="AutoIDAssociation",je="MarineReceiptByCompartment",we="PrintMarineRAN",De="PrintMarineBOD",be="ViewMarineUnloadingDetails",Ee="ViewMarineReceiptAuditTrail",Ne="CloseMarineReceipt",Te="WeekendConfig",ve="EODAdmin",Ae="PrintBOL",Fe="PrintFAN",Ge="PrintBOD",ke="CloseShipment",Ie="CloseReceipt",Ve="CONTRACTFORCECLOSE",Me="Captain",Oe="OverrideShipmentSequence",qe="KPIInformation",We="Language",Le="WebPortalUserMap",Be="BayGroup",Ue="PipelineHeaderSiteView",He="TankMonitor",ze="PersonAdmin",_e="ProductReconciliationReports",Qe="ReportConfiguration",Ke="EXECONFIGURATION",Je="ShareholderAllocation",$e="NotificationGroup",Ye="NotificationRestriction",Xe="NotificationConfig",Ze="AllowWeighBridgeManualEntry",ei="ProductAllocation",ii="MasterDeviceConfiguration",ti="ShareholderAgreement",oi="TANKSHAREHOLDERPRIMEFUNCTION",ri="ROLEADMIN",ni="ShiftConfig",li="PrinterConfiguration",ai="CustomerAgreement",si="BaySCADAConfiguration",ci="RailReceiptUnloadSpotAssignment",di="STAFF_VISITOR",pi="PipelineMeterSiteView",ui="RailSiteView",mi="MarineSiteView",hi="LoadingDetails",Ci="UnloadingDetails",gi="RoadHSEInspection",Si="RoadHSEInspectionConfig",xi="MarineHSEInspection",Ri="MarineHSEInspectionConfig",fi="RailHSEInspection",yi="RailHSEInspectionConfig",Pi="PipelineHSEInspection",ji="PipelineHSEInspectionConfig",wi="PrintRAN",Di="ViewReceiptStatus",bi="customerrecipe",Ei="COAParameter",Ni="COATemplate",Ti="COAManagement",vi="COACustomer",Ai="COAAssignment",Fi="ProductForecastConfiguration"},93779:(e,i,t)=>{"use strict";t.d(i,{$A:()=>A,$L:()=>si,$Q:()=>We,Ae:()=>Te,BX:()=>ne,Bl:()=>he,Bv:()=>Se,Bw:()=>X,Cb:()=>T,Cg:()=>E,DN:()=>ni,D_:()=>li,Dm:()=>F,E7:()=>J,EW:()=>k,FN:()=>re,FR:()=>n,FY:()=>hi,GA:()=>Le,GT:()=>f,Ge:()=>Ge,HB:()=>le,JQ:()=>K,KJ:()=>ee,Kz:()=>H,Ln:()=>U,M$:()=>Ue,O5:()=>ii,Of:()=>ye,Oo:()=>ti,Pk:()=>ge,Pm:()=>Y,Q5:()=>ci,QK:()=>He,QV:()=>Xe,QZ:()=>di,Qu:()=>te,RX:()=>Ee,Rb:()=>L,Rp:()=>j,SP:()=>C,T5:()=>Ve,UB:()=>x,UT:()=>s,Ui:()=>_,VA:()=>W,Vk:()=>je,Wb:()=>we,Wv:()=>Pe,X3:()=>Ke,Y4:()=>B,Yl:()=>oi,Zx:()=>$,_B:()=>xe,_C:()=>N,_R:()=>Ce,_j:()=>de,_n:()=>o,aM:()=>V,aW:()=>qe,bW:()=>q,c4:()=>ri,cD:()=>a,c_:()=>D,cx:()=>O,dL:()=>pi,eE:()=>se,eS:()=>_e,eT:()=>P,f:()=>G,f7:()=>me,fR:()=>pe,g1:()=>ce,gN:()=>Je,gO:()=>z,iH:()=>ai,ij:()=>ei,j1:()=>b,jC:()=>Re,je:()=>ue,jz:()=>ae,ll:()=>Ze,mM:()=>R,mO:()=>mi,mW:()=>Ie,ml:()=>g,mm:()=>Ye,nB:()=>ie,nT:()=>ke,np:()=>Fe,oA:()=>w,oG:()=>Qe,oV:()=>Z,ok:()=>p,oy:()=>c,pL:()=>ve,pe:()=>Be,pw:()=>ze,qF:()=>l,qQ:()=>ui,qp:()=>u,s0:()=>y,sA:()=>Ne,st:()=>oe,tY:()=>I,uw:()=>Q,v6:()=>r,vL:()=>Me,vf:()=>Ae,wH:()=>$e,wO:()=>fe,wX:()=>M,x4:()=>De,xf:()=>m,xy:()=>d,yI:()=>S,yV:()=>v,yz:()=>h,zL:()=>be,zf:()=>Oe});const o="CarrierCode",r="TransportationType",n="ShareHolderCode",l="DriverCode",a="CustomerCode",s="TrailerCode",c="OriginTerminalCode",d="PrimeMoverCode",p="VehicleCode",u="DestinationCode",m="FinishedProductCode",h="ShipmentCode",C="OrderCode",g="ReceiptCode",S="MarineDispatchCode",x="MarineReceiptCode",R="SupplierCode",f="ContractCode",y="RailDispatchCode",P="RailReceiptCode",j="RailRouteCode",w="WagonCode",D="CompartmentCode",b="SMSConfigurationCode",E="PipelineDispatchCode",N="PipelineReceiptCode",T="EmailConfigurationCode",v="BaseProductCode",A="LocationCode",F="SiteViewType",G="EntityCode",k="EntityType",I="CardReaderCode",V="AccessCardCode",M="BcuCode",O="DeuCode",q="WeighBridgeCode",W="Weight",L="OutOfToleranceAllowed",B="LoadingArmCode",U="TransportationType",H="BayCode",z="TransactionNumber",_="BatchNumber",Q="TerminalCode",K="TankGroupCode",J="TankCode",$="MeterCode",Y="ShipmentType",X="ShipmentStatus",Z="MeterLineType",ee="DispatchCode",ie="ReceiptStatus",te="FPTransactionID",oe="ProductCategoryType",re="Reason",ne="SealMasterCode",le="Reason",ae="OperationName",se="FPTransactionID",ce="ProductCategoryType",de="CompartmentSeqNoInVehicle",pe="AdjustedPlanQuantity",ue="ForceComplete",me="DispatchStatus",he="HolidayDate",Ce="ActionID",ge="EODTimePrev",Se="TerminalAction",xe="EODTime",Re="MonthStartDay",fe="CaptainCode",ye="GeneralTMUserType",Pe="GeneralTMUserCode",je="IsPriority",we="ActualTerminalCode",De="ShipmentBondNo",be="ReceiptBondNo",Ee="DeviceType",Ne="DeviceCode",Te="BayGroup",ve="PipelineHeaderCode",Ae="ExchangePartner",Fe="PersonID",Ge="UserName",ke="PipelinePlanCode",Ie="PipelinePlanType",Ve="ChannelCode",Me="ProcessName",Oe="ReconciliationCode",qe="NotificationGroupCode",We="NotificationGroupStatus",Le="NotificationGroupDesc",Be="NotificationResSource",Ue="NotificationResMsgCode",He="NotificationOrigResSource",ze="NotificationOrigResMsgCode",_e="NotificationMessageCode",Qe="PositionType",Ke="ExchangeAgreementCode",Je="ProductTransferAgreementCode",$e="ShareholderAgreementStatus",Ye="RequestorShareholder",Xe="LenderShareholder",Ze="RequestCode",ei="TransferReferenceCode",ii="ShiftID",ti="ShiftName",oi="PrinterName",ri="LocationType",ni="ForceClosureReason",li="TransactionType",ai="CustomerRecipeCode",si="COATemplateCode",ci="COAManagementCode",di="COAParameterCode",pi="COAManagementFinishedProductCode",ui="COASeqNumber",mi="ForecastDate",hi="ForecastTanks"},50477:()=>{}}]);
//# sourceMappingURL=8211.837b8e19.chunk.js.map