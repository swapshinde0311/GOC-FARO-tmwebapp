(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[1334,5841,8222],{66554:(e,t,i)=>{"use strict";i.d(t,{$:()=>d});var o=i(65043),r=i(72711),n=i(67907),s=i(65187),a=i(69062),l=i(70579);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:c,selectedShareholder:d,onShareholderChange:p,onDelete:h,onAdd:u,popUpContent:m,shrVisible:g,handleBreadCrumbClick:C,addVisible:S,deleteVisible:R}=e;const[y,x]=(0,o.useState)(!1),[f,b]=(0,o.useState)(!1);function j(){t.add&&(m.length>0?b(!1===f):u())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(s.A,{children:[" ",(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsxs)(r.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(r.Breadcrumb.Item,{onClick:()=>{void 0!==C&&null!==C&&C(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(r.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===g?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(r.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!t.shareholder,options:a.Zj(c),onChange:e=>p(e)})})]})})})}),(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsxs)(r.Modal,{open:y,size:"small",children:[(0,l.jsx)(r.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(r.Modal.Footer,{children:[(0,l.jsx)(r.Button,{type:"secondary",content:e("Cancel"),onClick:()=>x(!1)}),(0,l.jsx)(r.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{x(!1),h()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[S?(0,l.jsx)(r.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:j,children:(0,l.jsx)(r.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:f,children:(0,l.jsx)("div",{onMouseLeave:()=>b(!1),children:(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsx)(r.VerticalMenu,{children:(0,l.jsxs)(r.VerticalMenu,{children:[(0,l.jsx)(r.VerticalMenu.Header,{children:e("Common_Create")}),m.map((t=>(0,l.jsx)(r.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,b(!1),void u(e);var e},children:e(t.fieldValue)})))]})})})})}):"",R?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&x(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(r.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:r,onShareholderChange:n,onDelete:s,onAdd:a,popUpContent:d,shrVisible:p,handleBreadCrumbClick:h,addVisible:u,deleteVisible:m}=e;return(0,l.jsx)(c,{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:r,onShareholderChange:n,onDelete:s,onAdd:a,popUpContent:d,shrVisible:p,handleBreadCrumbClick:h,addVisible:u,deleteVisible:m})}},62900:(e,t,i)=>{"use strict";i.d(t,{A:()=>R});var o=i(65043),r=i(67907),n=i(72711),s=i(72067),a=i(69062),l=i(97508),c=i(44192),d=i(40854),p=i.n(d),h=i(53536),u=i.n(h),m=i(86111),g=i.n(m),C=i(70579);class S extends o.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:a.Th(c.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,t)=>{this.setState({Password:t});const i=u().cloneDeep(this.state.validationErrors);void 0!==c.Qh[e]&&(i[e]=a.jr(c.Qh[e],t),this.setState({validationErrors:i,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const t={...this.state.validationErrors};null!==e&&""!==e||(t.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,t=this.props.Username,i=g().lib.WordArray.random(16),o=g().PBKDF2(t,i,{keySize:8,iterations:100}),r=g().lib.WordArray.random(16),n=g().AES.encrypt(e,o,{iv:r,padding:g().pad.Pkcs7,mode:g().mode.CBC}),l=i.toString()+r.toString()+n.toString();p()(s.KrY+"?encryptedPassword="+encodeURIComponent(l),a.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess&&"true"===t.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:t.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(c){this.setState({authenticationResponse:c,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=a.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,C.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,C.jsx)(r.TranslationConsumer,{children:e=>(0,C.jsxs)(n.Modal,{open:!0,size:"mini",children:[(0,C.jsxs)(n.Modal.Content,{children:[(0,C.jsxs)("div",{className:"row",children:[(0,C.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,C.jsx)("h4",{children:e("User_Authentication")})}),(0,C.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,C.jsx)(n.Icon,{root:"common",name:"close"})})]}),(0,C.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)("label",{children:(0,C.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)(n.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,C.jsxs)(n.Modal.Footer,{children:[(0,C.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,C.jsx)(n.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const R=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(S)},19380:(e,t,i)=>{"use strict";i.d(t,{A:()=>f});var o=i(65043),r=i(728),n=i(62672),s=i(27976),a=i(44063),l=i(39078),c=i(48546),d=i(82967),p=i(11201),h=i(43439),u=(i(60663),i(48385)),m=i(72711),g=i(67907),C=i(65187),S=i(53536),R=(i(90837),i(70579));const y=e=>{const[t,i]=(0,o.useState)(null),[y]=(0,g.useTranslation)(),x=t=>new r.CollectionView(e.sourceData,{pageSize:t}),[f,b]=(0,o.useState)(x(e.rowsPerPage)),j=o.createRef(),D=o.createRef(),E=o.createRef(),P=o.createRef(),w=o.useRef(),T=o.useRef(e.selectionRequired?[]:null);let A=null;const v=t=>{try{if(G(),e.onRowClick&&t.addEventListener(t.hostElement,"click",(i=>{let o=t.hitTest(i);if(o.target.closest(".wj-cell")&&![...o.target.closest(".wj-cell").classList].includes("wj-group")&&o.cellType===n.CellType.Cell){const i=t.rows[o.row].dataItem;e.onRowClick(i)}})),t.selectionMode=r.asEnum("None",n.SelectionMode),t.select(-1,-1),i(t),e.selectionRequired){A=new p.Selector(t,{itemChecked:(i,o)=>{e.singleSelection&&t.rows.filter((e=>e.isSelected&&1===T.current.filter((t=>S.isEqual(t,e.dataItem))).length)).forEach((e=>{e.isSelected=!1})),e.onSelectionHandle(t.rows.filter((e=>e.isSelected)).map((e=>e.dataItem)))},showCheckAll:!e.singleSelection});let i=A.column.grid;A.column=i.rowHeaders.columns[0],i.headersVisibility=n.HeadersVisibility.All,i.selectionMode=r.asEnum("None",n.SelectionMode)}}catch(o){console.log("Error in gridInitialized: "+o)}};(0,o.useEffect)((()=>{try{if(null!=j){let e=j.current.control;D.current.control.grid=e}b(x(e.rowsPerPage))}catch(t){console.log("Error in grid update:",t)}}),[e.sourceData]),(0,o.useEffect)((()=>{try{t&&e.selectionRequired&&(T.current.length=0,T.current.push(...e.selectedItems),t.rows.forEach((t=>{1===e.selectedItems.filter((e=>S.isEqual(e,t.dataItem))).length?t.isSelected=!0:t.isSelected=!1})),t.refresh())}catch(i){console.log("Error in pre-selecting rows:",i)}}),[e.selectedItems]),(0,o.useEffect)((()=>{try{if(localStorage.getItem(e.parentComponent+"GridState")&&"null"!==localStorage.getItem(e.parentComponent+"GridState")&&t){let o=JSON.parse(localStorage.getItem(e.parentComponent+"GridState")),n=t;n.columns.forEach((e=>{let t=o.columns.filter((t=>t.binding===e.binding));e.visible=t.length>0?t[0].visible:e.visible})),E.current.control.filterDefinition=o.filterDefinition,n.collectionView.deferUpdate((()=>{n.collectionView.sortDescriptions.clear();for(let e=0;e<o.sortDescriptions.length;e++){let t=o.sortDescriptions[e];n.collectionView.sortDescriptions.push(new r.SortDescription(t.property,t.ascending))}}));for(let e=0;e<o.groupDescriptions.length;e++)n.collectionView.groupDescriptions.push(new r.PropertyGroupDescription(o.groupDescriptions[e])),n.columns.filter((t=>t.binding===o.groupDescriptions[e]))[0].visible=!1;if(sessionStorage.getItem(e.parentComponent+"GridState")&&"null"!==sessionStorage.getItem(e.parentComponent+"GridState")){let t=JSON.parse(sessionStorage.getItem(e.parentComponent+"GridState"));n.collectionView.moveToPage(n.collectionView.pageCount-1>=t.pageIndex?t.pageIndex:n.collectionView.pageCount-1),D&&(D.current.control.text=t.searchText)}i(n),t.refresh()}}catch(o){console.log("Error in restoring local storage settings: ",o)}}),[f]),(0,o.useEffect)((()=>{try{t&&w.current&&e.columnPickerRequired&&(w.current.itemsSource=t.columns,w.current.checkedMemberPath="visible",w.current.displayMemberPath="header",w.current.lostFocus.addHandler((()=>{(0,r.hidePopup)(w.current.hostElement)})))}catch(i){console.log("Error in initializing column picker properties:",i)}}),[w.current]),(0,o.useEffect)((()=>()=>{e.columnPickerRequired&&w.current&&(0,r.hidePopup)(w.current.hostElement)}),[]);const N=()=>{try{let o=t;o.itemsSource.pageSize=e.sourceData.length,i(o),h.FlexGridXlsxConverter.saveAsync(t,{includeColumnHeaders:!0,includeCellStyles:!1,formatItem:null},e.exportFileName),o.itemsSource.pageSize=e.rowsPerPage,i(o)}catch(o){console.log("Error in export grid to excel:",o)}},F=(t,i)=>{if(void 0!==i&&null!==i){if("boolean"===typeof t||"Active"===i.Name)return t?(0,R.jsx)(m.Icon,{name:"check",size:"small",color:"green"}):(0,R.jsx)(m.Icon,{name:"close",size:"small",color:"red"});if(""===t||null===t||void 0===t)return t;if(("TerminalCodes"===i.Name||"1"===i.PopOver)&&null!==t)return(o=t).split(",").length>e.terminalsToShow?(0,R.jsx)(m.Popup,{className:"popup-theme-wrap",on:"hover",element:o.split(",").length,children:(0,R.jsx)(m.Card,{children:(0,R.jsx)(m.Card.Content,{children:o})})}):o;if(void 0!==i.DataType&&"DateTime"===i.DataType)return new Date(t).toLocaleDateString()+" "+new Date(t).toLocaleTimeString();if(void 0!==i.DataType&&"Date"===i.DataType)return new Date(t).toLocaleDateString();if(void 0!==i.DataType&&"Time"===i.DataType)return new Date(t).toLocaleTimeString()}var o;return t},k=()=>{try{if(t&&E.current){let i={columns:t.columns.map((e=>({binding:e.binding,visible:e.visible}))),filterDefinition:E.current.control.filterDefinition,sortDescriptions:t.collectionView.sortDescriptions.map((e=>({property:e.property,ascending:e.ascending}))),groupDescriptions:t.collectionView.groupDescriptions.map((e=>e.propertyName?e.propertyName:null))};if(t.collectionView.groupDescriptions&&t.collectionView.groupDescriptions.length>0){[...document.getElementsByClassName("wj-column-selector-group")].forEach((e=>{e.parentNode.parentNode.classList.add("wj-grouped-checkbox")}))}let o={pageIndex:t.collectionView.pageIndex,searchText:D.current.control.text};localStorage.setItem(e.parentComponent+"GridState",JSON.stringify(i)),sessionStorage.setItem(e.parentComponent+"GridState",JSON.stringify(o))}}catch(i){console.log("Error in saving grid state")}},G=()=>{let e=r.culture.FlexGridFilter,t=l.Operator;r.culture.FlexGridFilter.header=y("WijmoGridFilterHeader"),r.culture.FlexGridFilter.ascending="\u2191 "+y("WijmoGridFilterAscending"),r.culture.FlexGridFilter.descending="\u2193 "+y("WijmoGridFilterDescending"),r.culture.FlexGridFilter.apply=y("RoleAdminEdit_Apply"),r.culture.FlexGridFilter.clear=y("OrderCreate_btnClear"),r.culture.FlexGridFilter.conditions=y("WijmoGridFilterCondition"),r.culture.FlexGridFilter.values=y("WijmoGridFilterValue"),r.culture.FlexGridFilter.search=y("LoadingDetailsView_SearchGrid"),r.culture.FlexGridFilter.selectAll=y("WijmoGridFilterSelectAll"),r.culture.FlexGridFilter.and=y("WijmoGridFilterAnd"),r.culture.FlexGridFilter.or=y("WijmoGridFilterOr"),r.culture.FlexGridFilter.cancel=y("AccessCardInfo_Cancel"),e.stringOperators=[{name:y("WijmoGridFilterUnset"),op:null},{name:y("WijmoGridFilterEqual"),op:t.EQ},{name:y("WijmoGridFilterNotEqual"),op:t.NE},{name:y("WijmoGridFilterBeginsWith"),op:t.BW},{name:y("WijmoGridFilterEndsWith"),op:t.EW},{name:y("WijmoGridFilterContains"),op:t.CT},{name:y("WijmoGridFilterDoesNotContain"),op:t.NC}],e.numberOperators=[{name:y("WijmoGridFilterUnset"),op:null},{name:y("WijmoGridFilterEqual"),op:t.EQ},{name:y("WijmoGridFilterNotEqual"),op:t.NE},{name:y("WijmoGridFilterGreaterThan"),op:t.GT},{name:y("WijmoGridFilterLessThan"),op:t.LT},{name:y("WijmoGridFilterGreaterThanOrEqual"),op:t.GE},{name:y("WijmoGridFilterLessThanOrEqual"),op:t.LE}],e.dateOperators=[{name:y("WijmoGridFilterUnset"),op:null},{name:y("WijmoGridFilterEqual"),op:t.EQ},{name:y("WijmoGridFilterDateEarlierThan"),op:t.LT},{name:y("WijmoGridFilterDateLaterThan"),op:t.GT}],e.booleanOperators=[{name:y("WijmoGridFilterUnset"),op:null},{name:y("WijmoGridFilterEqual"),op:t.EQ},{name:y("WijmoGridFilterNotEqual"),op:t.NE}]},V=e=>{try{if(window.screen.width<1024&&e.WidthPx&&""!==e.WidthPx)return parseInt(e.WidthPx)}catch(t){console.log("Error in width:",t)}return e.WidthPercentage.includes("*")?e.WidthPercentage:parseInt(e.WidthPercentage)};return(0,R.jsx)("div",{className:"pl-1",children:(0,R.jsx)(C.A,{children:(0,R.jsx)(g.TranslationConsumer,{children:i=>(0,R.jsxs)(o.Fragment,{children:[(0,R.jsxs)("div",{className:"row pl-0",children:[(0,R.jsx)("div",{className:"col-10 col-sm-12 col-md-5 col-lg-6",children:(0,R.jsx)(c.q,{class:"ui single-input",ref:D,placeholder:i("LoadingDetailsView_SearchGrid")})}),(0,R.jsx)("div",{className:"col-10 col-sm-12 col-md-7 col-lg-6",children:(0,R.jsxs)("div",{style:{float:"right"},children:[e.columnPickerRequired?(0,R.jsxs)(m.Button,{id:"colPicker",actionType:"button",type:"primary",onClick:e=>(e=>{try{let i=w.current.hostElement;i.offsetHeight?((0,r.hidePopup)(i,!0,!0),t.focus()):((0,r.showPopup)(i,e.target,r.PopupPosition.Below,!0,!1),w.current.focus()),w.current.focus(),e.preventDefault()}catch(i){console.log("Error in Column Picker click event:",i)}})(e),children:[(0,R.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridColumnPicker")}),(0,R.jsx)("div",{style:{display:"inline-block"},children:(0,R.jsx)(m.Icon,{name:"caret-down",className:"btnIcon",size:"small"})})]}):null,e.exportRequired?(0,R.jsxs)(m.Button,{actionType:"button",type:"primary",className:"mt-3 mt-md-0",onClick:N,children:[(0,R.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridExport")}),(0,R.jsx)("div",{style:{display:"inline-block",marginLeft:"0.2rem"},children:(0,R.jsx)("span",{className:"icon-Xls",style:{fontSize:"17px",position:"absolute",top:"3px"}})})]}):null]})})]}),(0,R.jsxs)("div",{className:"tableScroll",children:[e.columnGroupingRequired?(0,R.jsx)(u.u,{className:"group-panel",grid:t,placeholder:i("WijmoGridGroupPanelPlaceholder")}):null,(0,R.jsx)(C.A,{children:(0,R.jsxs)(s.MC,{ref:j,autoGenerateColumns:!1,alternatingRowStep:0,autoRowHeights:!0,headersVisibility:"Column",itemsSource:f,selectionMode:r.asEnum("None",n.SelectionMode),initialized:v,virtualizationThreshold:[0,1e4],onUpdatedView:k,children:[(0,R.jsx)(a.M,{ref:E}),e.columns.map((t=>(0,R.jsx)(s.aK,{header:i(t.Name),binding:t.Name,width:V(t),minWidth:100,isReadOnly:!0,wordWrap:!0,align:"left",children:(0,R.jsx)(s.Gw,{cellType:"Cell",template:i=>(0,R.jsx)("span",{style:null!=e.conditionalRowStyleCheck&&e.conditionalRowStyleCheck(i.item)?{...e.conditionalRowStyles}:null,children:F(i.item[t.Name],t)})})},t.Name)))]})}),e.columnPickerRequired?(0,R.jsx)("div",{className:"column-picker-div",children:(0,R.jsx)(d.qF,{className:"column-picker",initialized:t=>(t=>{e.columnPickerRequired&&(w.current=t)})(t)})}):null]}),(0,R.jsx)("div",{className:"row",children:(0,R.jsx)(d.Ne,{ref:P,className:"ml-auto mr-auto mt-3",headerFormat:i("WijmoGridPagingTemplate"),byPage:!0,cv:f})})]})})})})};y.defaultProps={sourceData:[],columns:[],exportRequired:!0,exportFileName:"Grid.xlsx",selectionRequired:!1,columnPickerRequired:!1,columnGroupingRequired:!1,rowsPerPage:10,terminalsToShow:2,singleSelection:!1,selectedItems:[]};const x=y,f=e=>(0,R.jsx)(x,{sourceData:e.data,columns:e.columns,exportRequired:e.exportRequired,exportFileName:e.exportFileName,columnPickerRequired:e.columnPickerRequired,selectionRequired:e.selectionRequired,columnGroupingRequired:e.columnGroupingRequired,conditionalRowStyleCheck:e.conditionalRowStyleCheck,conditionalRowStyles:e.conditionalRowStyles,rowsPerPage:e.rowsPerPage,onSelectionHandle:e.onSelectionHandle,onRowClick:e.onRowClick,parentComponent:e.parentComponent,terminalsToShow:e.terminalsToShow,singleSelection:e.singleSelection,selectedItems:e.selectedItems})},20227:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>j});var o=i(65043),r=i(97508),n=i(65187),s=i(66554),a=i(67907),l=i(19380),c=i(70579);function d(e){let{tableData:t,columnDetails:i,pageSize:o,exportRequired:r,exportFileName:n,columnPickerRequired:s,columnGroupingRequired:a,selectionRequired:d,onSelectionChange:p,onRowClick:h,parentComponent:u}=e;return(0,c.jsx)(l.A,{data:t,columns:i,rowsPerPage:o,exportRequired:r,exportFileName:n,columnPickerRequired:s,columnGroupingRequired:a,selectionRequired:d,onSelectionHandle:p,onRowClick:h,parentComponent:u})}var p=i(77587),h=i(40252),u=i(14159),m=(i(92342),i(63973),i(80312)),g=i(69062),C=i(72067),S=i(7523),R=i(40854),y=i.n(R),x=i(11981),f=(i(72711),i(15821));class b extends o.Component{constructor(){super(...arguments),this.state={isDetails:!1,isReadyToRender:!1,isDetailsModified:!1,operationsVisibilty:{add:!1,shareholder:!0},selectedRow:{},selectedItems:[],data:{},agreementType:"",shareholderVisible:!1,isComminglingEnable:!0,selectedShareholder:"",popUpContent:[]},this.componentName="ShareholderAgreementComponent",this.handleAdd=e=>{try{let t="";t=null!==e?e:this.state.popUpContent[0].fieldName;const i={...this.state.operationsVisibilty};i.shareholder=!1,i.add=!1,this.setState({isDetails:!0,selectedRow:{},operationsVisibilty:i,agreementType:t})}catch(t){console.log("TruckShipmentComposite:Error occured on handleAdd",t)}},this.handleShareholderSelectionChange=e=>{let{operationsVisibilty:t}={...this.state};try{this.setState({selectedShareholder:e,isReadyToRender:!1,selectedItems:[],operationsVisibilty:t}),this.GetShareholderAgreementsForRole(e)}catch(i){console.log("ShareholderAgrementComposite:Error occured on handleShareholderSelectionChange",i)}},this.handleRowClick=e=>{try{let t={...this.state.operationsVisibilty};t.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.G9),t.shareholder=!1,this.setState({isDetails:!0,selectedRow:e,selectedItems:[e],operationsVisibilty:t,agreementType:e.ShareholderAgreement_RequestType})}catch(t){console.log("TrailerComposite:Error occured on Row click",t)}},this.onBack=()=>{var e={...this.state.operationsVisibilty};e.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.G9),e.delete=!1,e.shareholder=!0,this.setState({isDetails:!1,operationsVisibilty:e,isReadyToRender:!1}),this.GetShareholderAgreementsForRole(this.state.selectedShareholder)},this.savedEvent=(e,t,i)=>{try{const r={...this.state.operationsVisibilty};if("success"===i.messageType&&(r.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.G9),r.delete=g.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.remove,m.G9),this.setState({isDetailsModified:!0,operationsVisibilty:r})),"success"===i.messageType&&"add"===t){var o=[{Common_Code:e.RequestCode,Common_Shareholder:e.ShareholderCode}];this.setState({selectedItems:o})}(0,u.toast)((0,c.jsx)(n.A,{children:(0,c.jsx)(x.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4})}catch(r){console.log("SealMasterComposite:Error occured on savedEvent",r)}}}componentDidMount(){try{g.pJ(this.props.userDetails.EntityResult.IsArchived);const e={...this.state.operationsVisibilty};e.shareholder=!1,e.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.G9),this.setState({isDetails:!0,selectedRow:{},operationsVisibilty:e,selectedShareholder:this.props.userDetails.EntityResult.PrimaryShareholder}),this.populatePopupContents(),this.getLookUpData()}catch(e){console.log("ShareholderAgrementComposite:Error occured on ComponentDidMount",e)}}getLookUpData(){try{y()(C.xAA+"?LookUpTypeCode=Commingling",g.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess&&(this.setState({isComminglingEnable:"True"===t.EntityResult.EnableCommingling,shareholderVisible:"True"===t.EntityResult.EnableCommingling}),this.state.isComminglingEnable)){var{operationsVisibilty:i}={...this.state};i.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.G9),this.setState({operationsVisibilty:i},(()=>{this.GetShareholderAgreementsForRole(this.props.userDetails.EntityResult.PrimaryShareholder)}))}}))}catch(e){console.log("ShareholderAgreementComposite:Error occured on getLookUpData",e)}}GetShareholderAgreementsForRole(e){try{this.setState({isReadyToRender:!1}),y()(C.Mj1+"?ShareholderCode="+e,g.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;if(!0===t.IsSuccess){let e=t.EntityResult;for(let t=0;t<e.Table.length;t++)e.Table[t].LastUpdatedTime=new Date(e.Table[t].LastUpdatedTime).toLocaleDateString();this.setState({data:e,isReadyToRender:!0})}else this.setState({data:[],isReadyToRender:!0}),console.log("Error in getshareholderagreement:",t.ErrorList)})).catch((e=>{this.setState({data:[],isReadyToRender:!0}),console.log("Error while getting shareholderagreement:",e)}))}catch(t){console.log("error while getting shareholderagreement",t)}}populatePopupContents(){let e=[...this.state.popUpContent];e.push({fieldName:S.yC.EXCHANGE_AGREEMENT,fieldValue:"ShareholderAgreement_Exchnage"}),e.push({fieldName:S.yC.PRODUCT_TRANSFER_AGREEMENT,fieldValue:"ShareholderAgreement_Product"});const t={...this.state.operationsVisibilty};t.add=e.length,this.setState({popUpContent:e,operationsVisibilty:t})}render(){return(0,c.jsx)(a.TranslationConsumer,{children:e=>(0,c.jsxs)("div",{children:[this.state.isComminglingEnable?(0,c.jsx)(n.A,{children:(0,c.jsx)(s.$,{operationsVisibilty:this.state.operationsVisibilty,breadcrumbItem:this.props.activeItem,shareholders:this.props.userDetails.EntityResult.ShareholderList,selectedShareholder:this.state.selectedShareholder,onShareholderChange:this.handleShareholderSelectionChange,deleteVisible:!1,onAdd:this.handleAdd,popUpContent:this.state.popUpContent.length>1?this.state.popUpContent:[],handleBreadCrumbClick:this.props.handleBreadCrumbClick})}):"",!0===this.state.isDetails&&this.state.agreementType?(0,c.jsx)(n.A,{children:(0,c.jsx)(p.default,{selectedRow:this.state.selectedRow,onBack:this.onBack,onSaved:this.savedEvent,agreementType:this.state.agreementType,selectedShareholder:this.state.selectedShareholder},"ShareholderDetails")}):this.state.isReadyToRender?(0,c.jsx)("div",{children:(0,c.jsx)(n.A,{children:(0,c.jsx)(d,{tableData:this.state.data.Table,columnDetails:this.state.data.Column,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,exportRequired:!0,columnPickerRequired:!0,columnGroupingRequired:!0,onRowClick:this.handleRowClick,parentComponent:this.componentName})})}):(0,c.jsx)(c.Fragment,{children:this.state.isComminglingEnable?(0,c.jsx)(h.A,{message:"Loading"}):(0,c.jsx)(f.default,{errorMessage:"Commingling_Enable"})}),(0,c.jsx)(n.A,{children:(0,c.jsx)(u.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})})}}const j=(0,r.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(b)},80312:(e,t,i)=>{"use strict";i.d(t,{$3:()=>H,$H:()=>oe,$J:()=>ue,$K:()=>ge,$V:()=>wt,$b:()=>xt,$p:()=>O,AE:()=>D,Al:()=>q,B2:()=>ot,By:()=>Dt,CW:()=>gt,DA:()=>l,Ee:()=>We,FO:()=>v,Fy:()=>Ve,G9:()=>it,H8:()=>ee,Hq:()=>at,Ig:()=>G,Iu:()=>S,JI:()=>ct,JJ:()=>te,JU:()=>Q,Jz:()=>Qe,KQ:()=>se,Kk:()=>Xe,Kw:()=>et,LP:()=>At,LR:()=>d,Lg:()=>$,Mg:()=>xe,Mm:()=>V,N1:()=>Y,Nm:()=>m,No:()=>ce,Ow:()=>U,P2:()=>n,P8:()=>Re,PD:()=>Ne,PE:()=>p,PG:()=>K,PP:()=>ut,Pb:()=>ke,QB:()=>f,QC:()=>X,RE:()=>nt,RO:()=>$e,Rc:()=>St,Rl:()=>ft,Rx:()=>Ct,TI:()=>R,Tm:()=>me,Ug:()=>Z,Ur:()=>Be,V9:()=>c,VK:()=>B,VL:()=>he,VQ:()=>ae,WD:()=>Ie,Wf:()=>w,YO:()=>F,YY:()=>ve,Yb:()=>Ce,Yg:()=>He,Z9:()=>ht,ZE:()=>dt,ZU:()=>x,_N:()=>Rt,_S:()=>Tt,_d:()=>vt,aS:()=>W,aZ:()=>pt,au:()=>je,b0:()=>Pt,bL:()=>qe,c2:()=>Le,d4:()=>Ge,dB:()=>C,dD:()=>Oe,dK:()=>_,dY:()=>N,de:()=>h,dv:()=>Te,eQ:()=>a,f3:()=>fe,fF:()=>I,fL:()=>yt,fN:()=>jt,fk:()=>T,fl:()=>Se,fr:()=>b,go:()=>r,h:()=>pe,hD:()=>P,hE:()=>A,hh:()=>Ze,hk:()=>ne,hz:()=>mt,i:()=>o,j2:()=>st,jN:()=>z,je:()=>g,jx:()=>L,kL:()=>Ye,ke:()=>Ue,km:()=>le,l0:()=>re,l6:()=>_e,lz:()=>k,m0:()=>y,nS:()=>Ee,nk:()=>lt,nn:()=>j,np:()=>J,oh:()=>rt,op:()=>Ke,pt:()=>Me,qk:()=>de,qp:()=>ye,r6:()=>Pe,rQ:()=>we,rj:()=>M,rp:()=>s,t3:()=>bt,tM:()=>Fe,to:()=>Ft,ts:()=>tt,uH:()=>be,uy:()=>Je,w1:()=>Ae,x5:()=>ie,xz:()=>E,y_:()=>ze,yu:()=>u,yx:()=>Et,z8:()=>De,z_:()=>Nt});const o={view:"view",add:"add",modify:"modify",remove:"remove"},r="carriercompany",n="driver",s="customer",a="trailer",l="originterminal",c="destination",d="primemover",p="vehicle",h="shipmentbycompartment",u="shipmentbyproduct",m="ViewShipmentStatus",g="vessel",C="order",S="OrderForceClose",R="contract",y="receiptplanbycompartment",x="ViewMarineShipment",f="MarineShipmentByCompartment",b="ViewMarineReceipt",j="supplier",D="finishedproduct",E="RailDispatch",P="RailReceipt",w="RailRoute",T="RailWagon",A="CloseRailDispatch",v="PrintRailBOL",N="PrintRailFAN",F="RailDispatchLoadSpotAssignment",k="RailDispatchProductAssignment",G="ViewRailDispatch",V="ViewRailLoadingDetails",I="CloseRailReceipt",M="PrintRailBOD",L="PrintRailRAN",q="ViewRailReceipt",O="ViewRailUnLoadingDetails",W="SMS",U="UnAccountedTransactionTank",B="UnAccountedTransactionMeter",_="PipelineDispatch",H="PipelineReceipt",z="PipelineDispatchManualEntry",Q="PipelineReceiptManualEntry",K="LookUpData",J="HSEInspection",$="HSEInspectionConfig",Y="Email",X="Shareholder",Z="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",oe="LeakageManualEntry",re="Terminal",ne="SlotInformation",se="TankGroup",ae="Tank",le="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",pe="AccessCard",he="ResetPin",ue="SlotConfiguration",me="PrintMarineFAN",ge="PrintMarineBOL",Ce="ViewMarineLoadingDetails",Se="ViewMarineShipmentAuditTrail",Re="CloseMarineShipment",ye="IssueCard",xe="ActivateCard",fe="RevokeCard",be="AutoIDAssociation",je="MarineReceiptByCompartment",De="PrintMarineRAN",Ee="PrintMarineBOD",Pe="ViewMarineUnloadingDetails",we="ViewMarineReceiptAuditTrail",Te="CloseMarineReceipt",Ae="WeekendConfig",ve="EODAdmin",Ne="PrintBOL",Fe="PrintFAN",ke="PrintBOD",Ge="CloseShipment",Ve="CloseReceipt",Ie="CONTRACTFORCECLOSE",Me="Captain",Le="OverrideShipmentSequence",qe="KPIInformation",Oe="Language",We="WebPortalUserMap",Ue="BayGroup",Be="PipelineHeaderSiteView",_e="TankMonitor",He="PersonAdmin",ze="ProductReconciliationReports",Qe="ReportConfiguration",Ke="EXECONFIGURATION",Je="ShareholderAllocation",$e="NotificationGroup",Ye="NotificationRestriction",Xe="NotificationConfig",Ze="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",ot="TANKSHAREHOLDERPRIMEFUNCTION",rt="ROLEADMIN",nt="ShiftConfig",st="PrinterConfiguration",at="CustomerAgreement",lt="BaySCADAConfiguration",ct="RailReceiptUnloadSpotAssignment",dt="STAFF_VISITOR",pt="PipelineMeterSiteView",ht="RailSiteView",ut="MarineSiteView",mt="LoadingDetails",gt="UnloadingDetails",Ct="RoadHSEInspection",St="RoadHSEInspectionConfig",Rt="MarineHSEInspection",yt="MarineHSEInspectionConfig",xt="RailHSEInspection",ft="RailHSEInspectionConfig",bt="PipelineHSEInspection",jt="PipelineHSEInspectionConfig",Dt="PrintRAN",Et="ViewReceiptStatus",Pt="customerrecipe",wt="COAParameter",Tt="COATemplate",At="COAManagement",vt="COACustomer",Nt="COAAssignment",Ft="ProductForecastConfiguration"},93779:(e,t,i)=>{"use strict";i.d(t,{$A:()=>N,$L:()=>lt,$Q:()=>Oe,Ae:()=>Ae,BX:()=>ne,Bl:()=>me,Bv:()=>Se,Bw:()=>X,Cb:()=>A,Cg:()=>w,DN:()=>nt,D_:()=>st,Dm:()=>F,E7:()=>J,EW:()=>G,FN:()=>re,FR:()=>n,FY:()=>mt,GA:()=>We,GT:()=>x,Ge:()=>ke,HB:()=>se,JQ:()=>K,KJ:()=>ee,Kz:()=>_,Ln:()=>B,M$:()=>Be,O5:()=>tt,Of:()=>fe,Oo:()=>it,Pk:()=>Ce,Pm:()=>Y,Q5:()=>ct,QK:()=>_e,QV:()=>Xe,QZ:()=>dt,Qu:()=>ie,RX:()=>we,Rb:()=>W,Rp:()=>j,SP:()=>g,T5:()=>Ie,UB:()=>R,UT:()=>l,Ui:()=>z,VA:()=>O,Vk:()=>je,Wb:()=>De,Wv:()=>be,X3:()=>Ke,Y4:()=>U,Yl:()=>ot,Zx:()=>$,_B:()=>Re,_C:()=>T,_R:()=>ge,_j:()=>de,_n:()=>o,aM:()=>I,aW:()=>qe,bW:()=>q,c4:()=>rt,cD:()=>a,c_:()=>E,cx:()=>L,dL:()=>pt,eE:()=>le,eS:()=>ze,eT:()=>b,f:()=>k,f7:()=>ue,fR:()=>pe,g1:()=>ce,gN:()=>Je,gO:()=>H,iH:()=>at,ij:()=>et,j1:()=>P,jC:()=>ye,je:()=>he,jz:()=>ae,ll:()=>Ze,mM:()=>y,mO:()=>ut,mW:()=>Ve,ml:()=>C,mm:()=>Ye,nB:()=>te,nT:()=>Ge,np:()=>Fe,oA:()=>D,oG:()=>Qe,oV:()=>Z,ok:()=>p,oy:()=>c,pL:()=>ve,pe:()=>Ue,pw:()=>He,qF:()=>s,qQ:()=>ht,qp:()=>h,s0:()=>f,sA:()=>Te,st:()=>oe,tY:()=>V,uw:()=>Q,v6:()=>r,vL:()=>Me,vf:()=>Ne,wH:()=>$e,wO:()=>xe,wX:()=>M,x4:()=>Ee,xf:()=>u,xy:()=>d,yI:()=>S,yV:()=>v,yz:()=>m,zL:()=>Pe,zf:()=>Le});const o="CarrierCode",r="TransportationType",n="ShareHolderCode",s="DriverCode",a="CustomerCode",l="TrailerCode",c="OriginTerminalCode",d="PrimeMoverCode",p="VehicleCode",h="DestinationCode",u="FinishedProductCode",m="ShipmentCode",g="OrderCode",C="ReceiptCode",S="MarineDispatchCode",R="MarineReceiptCode",y="SupplierCode",x="ContractCode",f="RailDispatchCode",b="RailReceiptCode",j="RailRouteCode",D="WagonCode",E="CompartmentCode",P="SMSConfigurationCode",w="PipelineDispatchCode",T="PipelineReceiptCode",A="EmailConfigurationCode",v="BaseProductCode",N="LocationCode",F="SiteViewType",k="EntityCode",G="EntityType",V="CardReaderCode",I="AccessCardCode",M="BcuCode",L="DeuCode",q="WeighBridgeCode",O="Weight",W="OutOfToleranceAllowed",U="LoadingArmCode",B="TransportationType",_="BayCode",H="TransactionNumber",z="BatchNumber",Q="TerminalCode",K="TankGroupCode",J="TankCode",$="MeterCode",Y="ShipmentType",X="ShipmentStatus",Z="MeterLineType",ee="DispatchCode",te="ReceiptStatus",ie="FPTransactionID",oe="ProductCategoryType",re="Reason",ne="SealMasterCode",se="Reason",ae="OperationName",le="FPTransactionID",ce="ProductCategoryType",de="CompartmentSeqNoInVehicle",pe="AdjustedPlanQuantity",he="ForceComplete",ue="DispatchStatus",me="HolidayDate",ge="ActionID",Ce="EODTimePrev",Se="TerminalAction",Re="EODTime",ye="MonthStartDay",xe="CaptainCode",fe="GeneralTMUserType",be="GeneralTMUserCode",je="IsPriority",De="ActualTerminalCode",Ee="ShipmentBondNo",Pe="ReceiptBondNo",we="DeviceType",Te="DeviceCode",Ae="BayGroup",ve="PipelineHeaderCode",Ne="ExchangePartner",Fe="PersonID",ke="UserName",Ge="PipelinePlanCode",Ve="PipelinePlanType",Ie="ChannelCode",Me="ProcessName",Le="ReconciliationCode",qe="NotificationGroupCode",Oe="NotificationGroupStatus",We="NotificationGroupDesc",Ue="NotificationResSource",Be="NotificationResMsgCode",_e="NotificationOrigResSource",He="NotificationOrigResMsgCode",ze="NotificationMessageCode",Qe="PositionType",Ke="ExchangeAgreementCode",Je="ProductTransferAgreementCode",$e="ShareholderAgreementStatus",Ye="RequestorShareholder",Xe="LenderShareholder",Ze="RequestCode",et="TransferReferenceCode",tt="ShiftID",it="ShiftName",ot="PrinterName",rt="LocationType",nt="ForceClosureReason",st="TransactionType",at="CustomerRecipeCode",lt="COATemplateCode",ct="COAManagementCode",dt="COAParameterCode",pt="COAManagementFinishedProductCode",ht="COASeqNumber",ut="ForecastDate",mt="ForecastTanks"},50477:()=>{}}]);
//# sourceMappingURL=1334.9fc0e101.chunk.js.map