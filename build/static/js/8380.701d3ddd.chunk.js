(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[8380,5841,8222],{66554:(e,t,i)=>{"use strict";i.d(t,{$:()=>d});var o=i(65043),r=i(72711),n=i(67907),s=i(65187),a=i(69062),l=i(70579);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:c,selectedShareholder:d,onShareholderChange:h,onDelete:p,onAdd:m,popUpContent:u,shrVisible:g,handleBreadCrumbClick:C,addVisible:S,deleteVisible:R}=e;const[x,y]=(0,o.useState)(!1),[f,D]=(0,o.useState)(!1);function j(){t.add&&(u.length>0?D(!1===f):m())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(s.A,{children:[" ",(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsxs)(r.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(r.Breadcrumb.Item,{onClick:()=>{void 0!==C&&null!==C&&C(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(r.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===g?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(r.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!t.shareholder,options:a.Zj(c),onChange:e=>h(e)})})]})})})}),(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsxs)(r.Modal,{open:x,size:"small",children:[(0,l.jsx)(r.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(r.Modal.Footer,{children:[(0,l.jsx)(r.Button,{type:"secondary",content:e("Cancel"),onClick:()=>y(!1)}),(0,l.jsx)(r.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{y(!1),p()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[S?(0,l.jsx)(r.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:j,children:(0,l.jsx)(r.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:f,children:(0,l.jsx)("div",{onMouseLeave:()=>D(!1),children:(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsx)(r.VerticalMenu,{children:(0,l.jsxs)(r.VerticalMenu,{children:[(0,l.jsx)(r.VerticalMenu.Header,{children:e("Common_Create")}),u.map((t=>(0,l.jsx)(r.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,D(!1),void m(e);var e},children:e(t.fieldValue)})))]})})})})}):"",R?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&y(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(r.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:r,onShareholderChange:n,onDelete:s,onAdd:a,popUpContent:d,shrVisible:h,handleBreadCrumbClick:p,addVisible:m,deleteVisible:u}=e;return(0,l.jsx)(c,{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:r,onShareholderChange:n,onDelete:s,onAdd:a,popUpContent:d,shrVisible:h,handleBreadCrumbClick:p,addVisible:m,deleteVisible:u})}},62900:(e,t,i)=>{"use strict";i.d(t,{A:()=>R});var o=i(65043),r=i(67907),n=i(72711),s=i(72067),a=i(69062),l=i(97508),c=i(44192),d=i(40854),h=i.n(d),p=i(53536),m=i.n(p),u=i(86111),g=i.n(u),C=i(70579);class S extends o.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:a.Th(c.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,t)=>{this.setState({Password:t});const i=m().cloneDeep(this.state.validationErrors);void 0!==c.Qh[e]&&(i[e]=a.jr(c.Qh[e],t),this.setState({validationErrors:i,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const t={...this.state.validationErrors};null!==e&&""!==e||(t.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,t=this.props.Username,i=g().lib.WordArray.random(16),o=g().PBKDF2(t,i,{keySize:8,iterations:100}),r=g().lib.WordArray.random(16),n=g().AES.encrypt(e,o,{iv:r,padding:g().pad.Pkcs7,mode:g().mode.CBC}),l=i.toString()+r.toString()+n.toString();h()(s.KrY+"?encryptedPassword="+encodeURIComponent(l),a.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess&&"true"===t.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:t.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(c){this.setState({authenticationResponse:c,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=a.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,C.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,C.jsx)(r.TranslationConsumer,{children:e=>(0,C.jsxs)(n.Modal,{open:!0,size:"mini",children:[(0,C.jsxs)(n.Modal.Content,{children:[(0,C.jsxs)("div",{className:"row",children:[(0,C.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,C.jsx)("h4",{children:e("User_Authentication")})}),(0,C.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,C.jsx)(n.Icon,{root:"common",name:"close"})})]}),(0,C.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)("label",{children:(0,C.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)(n.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,C.jsxs)(n.Modal.Footer,{children:[(0,C.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,C.jsx)(n.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const R=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(S)},19380:(e,t,i)=>{"use strict";i.d(t,{A:()=>f});var o=i(65043),r=i(728),n=i(62672),s=i(27976),a=i(44063),l=i(39078),c=i(48546),d=i(82967),h=i(11201),p=i(43439),m=(i(60663),i(48385)),u=i(72711),g=i(67907),C=i(65187),S=i(53536),R=(i(90837),i(70579));const x=e=>{const[t,i]=(0,o.useState)(null),[x]=(0,g.useTranslation)(),y=t=>new r.CollectionView(e.sourceData,{pageSize:t}),[f,D]=(0,o.useState)(y(e.rowsPerPage)),j=o.createRef(),w=o.createRef(),P=o.createRef(),E=o.createRef(),b=o.useRef(),A=o.useRef(e.selectionRequired?[]:null);let v=null;const T=t=>{try{if(I(),e.onRowClick&&t.addEventListener(t.hostElement,"click",(i=>{let o=t.hitTest(i);if(o.target.closest(".wj-cell")&&![...o.target.closest(".wj-cell").classList].includes("wj-group")&&o.cellType===n.CellType.Cell){const i=t.rows[o.row].dataItem;e.onRowClick(i)}})),t.selectionMode=r.asEnum("None",n.SelectionMode),t.select(-1,-1),i(t),e.selectionRequired){v=new h.Selector(t,{itemChecked:(i,o)=>{e.singleSelection&&t.rows.filter((e=>e.isSelected&&1===A.current.filter((t=>S.isEqual(t,e.dataItem))).length)).forEach((e=>{e.isSelected=!1})),e.onSelectionHandle(t.rows.filter((e=>e.isSelected)).map((e=>e.dataItem)))},showCheckAll:!e.singleSelection});let i=v.column.grid;v.column=i.rowHeaders.columns[0],i.headersVisibility=n.HeadersVisibility.All,i.selectionMode=r.asEnum("None",n.SelectionMode)}}catch(o){console.log("Error in gridInitialized: "+o)}};(0,o.useEffect)((()=>{try{if(null!=j){let e=j.current.control;w.current.control.grid=e}D(y(e.rowsPerPage))}catch(t){console.log("Error in grid update:",t)}}),[e.sourceData]),(0,o.useEffect)((()=>{try{t&&e.selectionRequired&&(A.current.length=0,A.current.push(...e.selectedItems),t.rows.forEach((t=>{1===e.selectedItems.filter((e=>S.isEqual(e,t.dataItem))).length?t.isSelected=!0:t.isSelected=!1})),t.refresh())}catch(i){console.log("Error in pre-selecting rows:",i)}}),[e.selectedItems]),(0,o.useEffect)((()=>{try{if(localStorage.getItem(e.parentComponent+"GridState")&&"null"!==localStorage.getItem(e.parentComponent+"GridState")&&t){let o=JSON.parse(localStorage.getItem(e.parentComponent+"GridState")),n=t;n.columns.forEach((e=>{let t=o.columns.filter((t=>t.binding===e.binding));e.visible=t.length>0?t[0].visible:e.visible})),P.current.control.filterDefinition=o.filterDefinition,n.collectionView.deferUpdate((()=>{n.collectionView.sortDescriptions.clear();for(let e=0;e<o.sortDescriptions.length;e++){let t=o.sortDescriptions[e];n.collectionView.sortDescriptions.push(new r.SortDescription(t.property,t.ascending))}}));for(let e=0;e<o.groupDescriptions.length;e++)n.collectionView.groupDescriptions.push(new r.PropertyGroupDescription(o.groupDescriptions[e])),n.columns.filter((t=>t.binding===o.groupDescriptions[e]))[0].visible=!1;if(sessionStorage.getItem(e.parentComponent+"GridState")&&"null"!==sessionStorage.getItem(e.parentComponent+"GridState")){let t=JSON.parse(sessionStorage.getItem(e.parentComponent+"GridState"));n.collectionView.moveToPage(n.collectionView.pageCount-1>=t.pageIndex?t.pageIndex:n.collectionView.pageCount-1),w&&(w.current.control.text=t.searchText)}i(n),t.refresh()}}catch(o){console.log("Error in restoring local storage settings: ",o)}}),[f]),(0,o.useEffect)((()=>{try{t&&b.current&&e.columnPickerRequired&&(b.current.itemsSource=t.columns,b.current.checkedMemberPath="visible",b.current.displayMemberPath="header",b.current.lostFocus.addHandler((()=>{(0,r.hidePopup)(b.current.hostElement)})))}catch(i){console.log("Error in initializing column picker properties:",i)}}),[b.current]),(0,o.useEffect)((()=>()=>{e.columnPickerRequired&&b.current&&(0,r.hidePopup)(b.current.hostElement)}),[]);const N=()=>{try{let o=t;o.itemsSource.pageSize=e.sourceData.length,i(o),p.FlexGridXlsxConverter.saveAsync(t,{includeColumnHeaders:!0,includeCellStyles:!1,formatItem:null},e.exportFileName),o.itemsSource.pageSize=e.rowsPerPage,i(o)}catch(o){console.log("Error in export grid to excel:",o)}},k=(t,i)=>{if(void 0!==i&&null!==i){if("boolean"===typeof t||"Active"===i.Name)return t?(0,R.jsx)(u.Icon,{name:"check",size:"small",color:"green"}):(0,R.jsx)(u.Icon,{name:"close",size:"small",color:"red"});if(""===t||null===t||void 0===t)return t;if(("TerminalCodes"===i.Name||"1"===i.PopOver)&&null!==t)return(o=t).split(",").length>e.terminalsToShow?(0,R.jsx)(u.Popup,{className:"popup-theme-wrap",on:"hover",element:o.split(",").length,children:(0,R.jsx)(u.Card,{children:(0,R.jsx)(u.Card.Content,{children:o})})}):o;if(void 0!==i.DataType&&"DateTime"===i.DataType)return new Date(t).toLocaleDateString()+" "+new Date(t).toLocaleTimeString();if(void 0!==i.DataType&&"Date"===i.DataType)return new Date(t).toLocaleDateString();if(void 0!==i.DataType&&"Time"===i.DataType)return new Date(t).toLocaleTimeString()}var o;return t},F=()=>{try{if(t&&P.current){let i={columns:t.columns.map((e=>({binding:e.binding,visible:e.visible}))),filterDefinition:P.current.control.filterDefinition,sortDescriptions:t.collectionView.sortDescriptions.map((e=>({property:e.property,ascending:e.ascending}))),groupDescriptions:t.collectionView.groupDescriptions.map((e=>e.propertyName?e.propertyName:null))};if(t.collectionView.groupDescriptions&&t.collectionView.groupDescriptions.length>0){[...document.getElementsByClassName("wj-column-selector-group")].forEach((e=>{e.parentNode.parentNode.classList.add("wj-grouped-checkbox")}))}let o={pageIndex:t.collectionView.pageIndex,searchText:w.current.control.text};localStorage.setItem(e.parentComponent+"GridState",JSON.stringify(i)),sessionStorage.setItem(e.parentComponent+"GridState",JSON.stringify(o))}}catch(i){console.log("Error in saving grid state")}},I=()=>{let e=r.culture.FlexGridFilter,t=l.Operator;r.culture.FlexGridFilter.header=x("WijmoGridFilterHeader"),r.culture.FlexGridFilter.ascending="\u2191 "+x("WijmoGridFilterAscending"),r.culture.FlexGridFilter.descending="\u2193 "+x("WijmoGridFilterDescending"),r.culture.FlexGridFilter.apply=x("RoleAdminEdit_Apply"),r.culture.FlexGridFilter.clear=x("OrderCreate_btnClear"),r.culture.FlexGridFilter.conditions=x("WijmoGridFilterCondition"),r.culture.FlexGridFilter.values=x("WijmoGridFilterValue"),r.culture.FlexGridFilter.search=x("LoadingDetailsView_SearchGrid"),r.culture.FlexGridFilter.selectAll=x("WijmoGridFilterSelectAll"),r.culture.FlexGridFilter.and=x("WijmoGridFilterAnd"),r.culture.FlexGridFilter.or=x("WijmoGridFilterOr"),r.culture.FlexGridFilter.cancel=x("AccessCardInfo_Cancel"),e.stringOperators=[{name:x("WijmoGridFilterUnset"),op:null},{name:x("WijmoGridFilterEqual"),op:t.EQ},{name:x("WijmoGridFilterNotEqual"),op:t.NE},{name:x("WijmoGridFilterBeginsWith"),op:t.BW},{name:x("WijmoGridFilterEndsWith"),op:t.EW},{name:x("WijmoGridFilterContains"),op:t.CT},{name:x("WijmoGridFilterDoesNotContain"),op:t.NC}],e.numberOperators=[{name:x("WijmoGridFilterUnset"),op:null},{name:x("WijmoGridFilterEqual"),op:t.EQ},{name:x("WijmoGridFilterNotEqual"),op:t.NE},{name:x("WijmoGridFilterGreaterThan"),op:t.GT},{name:x("WijmoGridFilterLessThan"),op:t.LT},{name:x("WijmoGridFilterGreaterThanOrEqual"),op:t.GE},{name:x("WijmoGridFilterLessThanOrEqual"),op:t.LE}],e.dateOperators=[{name:x("WijmoGridFilterUnset"),op:null},{name:x("WijmoGridFilterEqual"),op:t.EQ},{name:x("WijmoGridFilterDateEarlierThan"),op:t.LT},{name:x("WijmoGridFilterDateLaterThan"),op:t.GT}],e.booleanOperators=[{name:x("WijmoGridFilterUnset"),op:null},{name:x("WijmoGridFilterEqual"),op:t.EQ},{name:x("WijmoGridFilterNotEqual"),op:t.NE}]},G=e=>{try{if(window.screen.width<1024&&e.WidthPx&&""!==e.WidthPx)return parseInt(e.WidthPx)}catch(t){console.log("Error in width:",t)}return e.WidthPercentage.includes("*")?e.WidthPercentage:parseInt(e.WidthPercentage)};return(0,R.jsx)("div",{className:"pl-1",children:(0,R.jsx)(C.A,{children:(0,R.jsx)(g.TranslationConsumer,{children:i=>(0,R.jsxs)(o.Fragment,{children:[(0,R.jsxs)("div",{className:"row pl-0",children:[(0,R.jsx)("div",{className:"col-10 col-sm-12 col-md-5 col-lg-6",children:(0,R.jsx)(c.q,{class:"ui single-input",ref:w,placeholder:i("LoadingDetailsView_SearchGrid")})}),(0,R.jsx)("div",{className:"col-10 col-sm-12 col-md-7 col-lg-6",children:(0,R.jsxs)("div",{style:{float:"right"},children:[e.columnPickerRequired?(0,R.jsxs)(u.Button,{id:"colPicker",actionType:"button",type:"primary",onClick:e=>(e=>{try{let i=b.current.hostElement;i.offsetHeight?((0,r.hidePopup)(i,!0,!0),t.focus()):((0,r.showPopup)(i,e.target,r.PopupPosition.Below,!0,!1),b.current.focus()),b.current.focus(),e.preventDefault()}catch(i){console.log("Error in Column Picker click event:",i)}})(e),children:[(0,R.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridColumnPicker")}),(0,R.jsx)("div",{style:{display:"inline-block"},children:(0,R.jsx)(u.Icon,{name:"caret-down",className:"btnIcon",size:"small"})})]}):null,e.exportRequired?(0,R.jsxs)(u.Button,{actionType:"button",type:"primary",className:"mt-3 mt-md-0",onClick:N,children:[(0,R.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridExport")}),(0,R.jsx)("div",{style:{display:"inline-block",marginLeft:"0.2rem"},children:(0,R.jsx)("span",{className:"icon-Xls",style:{fontSize:"17px",position:"absolute",top:"3px"}})})]}):null]})})]}),(0,R.jsxs)("div",{className:"tableScroll",children:[e.columnGroupingRequired?(0,R.jsx)(m.u,{className:"group-panel",grid:t,placeholder:i("WijmoGridGroupPanelPlaceholder")}):null,(0,R.jsx)(C.A,{children:(0,R.jsxs)(s.MC,{ref:j,autoGenerateColumns:!1,alternatingRowStep:0,autoRowHeights:!0,headersVisibility:"Column",itemsSource:f,selectionMode:r.asEnum("None",n.SelectionMode),initialized:T,virtualizationThreshold:[0,1e4],onUpdatedView:F,children:[(0,R.jsx)(a.M,{ref:P}),e.columns.map((t=>(0,R.jsx)(s.aK,{header:i(t.Name),binding:t.Name,width:G(t),minWidth:100,isReadOnly:!0,wordWrap:!0,align:"left",children:(0,R.jsx)(s.Gw,{cellType:"Cell",template:i=>(0,R.jsx)("span",{style:null!=e.conditionalRowStyleCheck&&e.conditionalRowStyleCheck(i.item)?{...e.conditionalRowStyles}:null,children:k(i.item[t.Name],t)})})},t.Name)))]})}),e.columnPickerRequired?(0,R.jsx)("div",{className:"column-picker-div",children:(0,R.jsx)(d.qF,{className:"column-picker",initialized:t=>(t=>{e.columnPickerRequired&&(b.current=t)})(t)})}):null]}),(0,R.jsx)("div",{className:"row",children:(0,R.jsx)(d.Ne,{ref:E,className:"ml-auto mr-auto mt-3",headerFormat:i("WijmoGridPagingTemplate"),byPage:!0,cv:f})})]})})})})};x.defaultProps={sourceData:[],columns:[],exportRequired:!0,exportFileName:"Grid.xlsx",selectionRequired:!1,columnPickerRequired:!1,columnGroupingRequired:!1,rowsPerPage:10,terminalsToShow:2,singleSelection:!1,selectedItems:[]};const y=x,f=e=>(0,R.jsx)(y,{sourceData:e.data,columns:e.columns,exportRequired:e.exportRequired,exportFileName:e.exportFileName,columnPickerRequired:e.columnPickerRequired,selectionRequired:e.selectionRequired,columnGroupingRequired:e.columnGroupingRequired,conditionalRowStyleCheck:e.conditionalRowStyleCheck,conditionalRowStyles:e.conditionalRowStyles,rowsPerPage:e.rowsPerPage,onSelectionHandle:e.onSelectionHandle,onRowClick:e.onRowClick,parentComponent:e.parentComponent,terminalsToShow:e.terminalsToShow,singleSelection:e.singleSelection,selectedItems:e.selectedItems})},68678:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>f});var o=i(65043),r=i(97508),n=i(65187),s=i(74164),a=i(19380),l=i(70579);function c(e){let{tableData:t,columnDetails:i,pageSize:o,exportRequired:r,exportFileName:n,columnPickerRequired:s,columnGroupingRequired:c,selectionRequired:d,onSelectionChange:h,onRowClick:p,parentComponent:m}=e;return(0,l.jsx)(a.A,{data:t,columns:i,rowsPerPage:o,exportRequired:r,exportFileName:n,columnPickerRequired:s,columnGroupingRequired:c,selectionRequired:d,onSelectionHandle:h,onRowClick:p,parentComponent:m})}var d=i(40252),h=i(14159),p=(i(92342),i(72067)),m=i(69062),u=i(11981),g=i(40854),C=i.n(g),S=i(15821),R=i(66554),x=i(15441);class y extends o.Component{constructor(){super(...arguments),this.state={isDetails:"false",isReadyToRender:!1,selectedRow:{},selectedShareholder:"",operationsVisibilty:{add:!1,delete:!1,shareholder:!0},data:{},isEnable:!0,fromDate:new Date,toDate:new Date,dateError:""},this.componentName="COAAssignmentList",this.handleBack=()=>{try{this.setState({isDetails:"false",selectedRow:{},isReadyToRender:!1}),this.getcoaAssignmentList(this.state.selectedShareholder)}catch(e){console.log("COAAssignmentComposite:Error occured on Back click",e)}},this.handleRowClick=e=>{try{var{operationsVisibilty:t}={...this.state};t.shareholder=!1,this.setState({operationsVisibilty:t,isDetails:"true",selectedRow:e})}catch(i){console.log("COAAssignmentComposite:Error occured on handleRowClick",i)}},this.savedEvent=(e,t,i)=>{try{(0,h.toast)((0,l.jsx)(n.A,{children:(0,l.jsx)(u.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4})}catch(o){console.log("COAAssignmentComposite:Error occured on savedEvent",o)}},this.componentWillUnmount=()=>{this.clearStorage(),window.removeEventListener("beforeunload",this.clearStorage)},this.clearStorage=()=>{sessionStorage.removeItem(this.componentName+"GridState")},this.handleShareholderSelectionChange=e=>{try{this.setState({selectedShareholder:e,isReadyToRender:!1}),this.getcoaAssignmentList(e)}catch(t){console.log("COAAssignmentComposite:Error occured on handleShareholderSelectionChange",t)}},this.handleDateTextChange=(e,t)=>{""===e&&this.setState({dateError:"",toDate:"",fromDate:""}),null!==t&&""!==t?this.setState({dateError:"Common_InvalidDate",toDate:"",fromDate:""}):this.setState({dateError:"",toDate:e.to,fromDate:e.from})},this.handleRangeSelect=e=>{let{to:t,from:i}=e;void 0!==t&&this.setState({toDate:t}),void 0!==i&&this.setState({fromDate:i})},this.handleLoadOrders=()=>{let e=m.wb(this.state.toDate,this.state.fromDate);""!==e?this.setState({dateError:e}):(this.setState({dateError:"",isReadyToRender:!1}),this.getcoaAssignmentList(this.state.selectedShareholder))}}getcoaAssignmentList(e){if(void 0!==e&&""!==e){var{operationsVisibilty:t}={...this.state};t.shareholder=!0;let i=new Date(this.state.fromDate),o=new Date(this.state.toDate);i.setHours(0,0,0),o.setHours(23,59,59);let r={ShareholderCode:e,StartRange:i,EndRange:o};C()(p.Ss3,m.tW(r,this.props.tokenDetails.tokenInfo)).then((e=>{var i=e.data;!0===i.IsSuccess?this.setState({data:i.EntityResult,isReadyToRender:!0,operationsVisibilty:t}):(this.setState({data:[],isReadyToRender:!0,operationsVisibilty:t}),console.log("Error in GetCOAAssignmentListForRole:",i.ErrorList))})).catch((e=>{this.setState({data:[],isReadyToRender:!0,operationsVisibilty:t}),console.log("Error while getting COAAssignment List:",e)}))}}componentDidMount(){try{m.pJ(this.props.userDetails.EntityResult.IsArchived),this.getLookUpData()}catch(e){console.log("COAAssignmentComposite:Error occured on ComponentDidMount",e)}window.addEventListener("beforeunload",this.clearStorage)}getLookUpData(){C()(p.xAA+"?LookUpTypeCode=COA",m.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{const t=e.data;if(!0===t.IsSuccess){let e="TRUE"===t.EntityResult.COAEnable.toUpperCase();this.setState({lookUpData:t.EntityResult,isEnable:e}),e&&(this.setState({selectedShareholder:this.props.userDetails.EntityResult.PrimaryShareholder}),this.getcoaAssignmentList(this.props.userDetails.EntityResult.PrimaryShareholder))}else console.log("Error in getLookUpData: ",t.ErrorList)})).catch((e=>{console.log("COAAssignmentComposite: Error occurred on getLookUpData",e)}))}render(){return(0,l.jsxs)("div",{children:[(0,l.jsx)(n.A,{children:(0,l.jsx)(R.$,{operationsVisibilty:this.state.operationsVisibilty,breadcrumbItem:this.props.activeItem,handleBreadCrumbClick:this.props.handleBreadCrumbClick,shareholders:this.props.userDetails.EntityResult.ShareholderList,selectedShareholder:this.state.selectedShareholder,onShareholderChange:this.handleShareholderSelectionChange,addVisible:!1,deleteVisible:!1})}),"true"===this.state.isDetails?(0,l.jsx)(n.A,{children:(0,l.jsx)(s.default,{selectedRow:this.state.selectedRow,selectedShareholder:this.state.selectedShareholder,onBack:this.handleBack,onSaved:this.savedEvent,genericProps:this.props.activeItem.itemProps},"COAAssignmentDetails")}):this.state.isReadyToRender?(0,l.jsx)("div",{children:(0,l.jsxs)(n.A,{children:[(0,l.jsx)(x.L,{dateRange:{from:this.state.fromDate,to:this.state.toDate},dateError:this.state.dateError,handleDateTextChange:this.handleDateTextChange,handleRangeSelect:this.handleRangeSelect,handleLoadOrders:this.handleLoadOrders,filterText:"LoadShipments"}),(0,l.jsx)(c,{tableData:this.state.data.Table,columnDetails:this.state.data.Column,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,exportRequired:!0,exportFileName:"COAAssignmentList",columnPickerRequired:!0,selectionRequired:!1,columnGroupingRequired:!0,onRowClick:this.handleRowClick,parentComponent:this.componentName})]})}):(0,l.jsx)(l.Fragment,{children:this.state.isEnable?(0,l.jsx)(d.A,{loadingClass:"Loading"}):(0,l.jsx)(S.default,{errorMessage:"COADisabled"})}),(0,l.jsx)(n.A,{children:(0,l.jsx)(h.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})}}const f=(0,r.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(y)},15441:(e,t,i)=>{"use strict";i.d(t,{L:()=>a});i(65043);var o=i(67907),r=i(72711),n=i(35861),s=i(70579);function a(e){let{handleDateTextChange:t,handleRangeSelect:i,handleLoadOrders:a,dateError:l,dateRange:c,filterText:d}=e;return(0,s.jsx)(o.TranslationConsumer,{children:e=>(0,s.jsxs)("div",{className:"dateRangeContainer",children:[(0,s.jsx)("div",{className:"dateRangeMargin",children:(0,s.jsx)(r.DatePicker,{type:"daterange",closeOnSelection:!0,error:e(l),displayFormat:(0,n.F1)(),rangeValue:c,onTextChange:t,onRangeSelect:i,reserveSpace:!1})}),(0,s.jsx)("div",{className:"dateSearch",children:(0,s.jsx)(r.Button,{content:e(d),onClick:a})})]})})}},80312:(e,t,i)=>{"use strict";i.d(t,{$3:()=>z,$H:()=>oe,$J:()=>me,$K:()=>ge,$V:()=>bt,$b:()=>yt,$p:()=>q,AE:()=>w,Al:()=>M,B2:()=>ot,By:()=>wt,CW:()=>gt,DA:()=>l,Ee:()=>We,FO:()=>T,Fy:()=>Ge,G9:()=>it,H8:()=>ee,Hq:()=>at,Ig:()=>I,Iu:()=>S,JI:()=>ct,JJ:()=>te,JU:()=>Q,Jz:()=>Qe,KQ:()=>se,Kk:()=>Xe,Kw:()=>et,LP:()=>vt,LR:()=>d,Lg:()=>$,Mg:()=>ye,Mm:()=>G,N1:()=>Y,Nm:()=>u,No:()=>ce,Ow:()=>B,P2:()=>n,P8:()=>Re,PD:()=>Ne,PE:()=>h,PG:()=>K,PP:()=>mt,Pb:()=>Fe,QB:()=>f,QC:()=>X,RE:()=>nt,RO:()=>$e,Rc:()=>St,Rl:()=>ft,Rx:()=>Ct,TI:()=>R,Tm:()=>ue,Ug:()=>Z,Ur:()=>Ue,V9:()=>c,VK:()=>U,VL:()=>pe,VQ:()=>ae,WD:()=>Ve,Wf:()=>b,YO:()=>k,YY:()=>Te,Yb:()=>Ce,Yg:()=>ze,Z9:()=>pt,ZE:()=>dt,ZU:()=>y,_N:()=>Rt,_S:()=>At,_d:()=>Tt,aS:()=>W,aZ:()=>ht,au:()=>je,b0:()=>Et,bL:()=>Me,c2:()=>Le,d4:()=>Ie,dB:()=>C,dD:()=>qe,dK:()=>H,dY:()=>N,de:()=>p,dv:()=>Ae,eQ:()=>a,f3:()=>fe,fF:()=>V,fL:()=>xt,fN:()=>jt,fk:()=>A,fl:()=>Se,fr:()=>D,go:()=>r,h:()=>he,hD:()=>E,hE:()=>v,hh:()=>Ze,hk:()=>ne,hz:()=>ut,i:()=>o,j2:()=>st,jN:()=>_,je:()=>g,jx:()=>L,kL:()=>Ye,ke:()=>Be,km:()=>le,l0:()=>re,l6:()=>He,lz:()=>F,m0:()=>x,nS:()=>Pe,nk:()=>lt,nn:()=>j,np:()=>J,oh:()=>rt,op:()=>Ke,pt:()=>Oe,qk:()=>de,qp:()=>xe,r6:()=>Ee,rQ:()=>be,rj:()=>O,rp:()=>s,t3:()=>Dt,tM:()=>ke,to:()=>kt,ts:()=>tt,uH:()=>De,uy:()=>Je,w1:()=>ve,x5:()=>ie,xz:()=>P,y_:()=>_e,yu:()=>m,yx:()=>Pt,z8:()=>we,z_:()=>Nt});const o={view:"view",add:"add",modify:"modify",remove:"remove"},r="carriercompany",n="driver",s="customer",a="trailer",l="originterminal",c="destination",d="primemover",h="vehicle",p="shipmentbycompartment",m="shipmentbyproduct",u="ViewShipmentStatus",g="vessel",C="order",S="OrderForceClose",R="contract",x="receiptplanbycompartment",y="ViewMarineShipment",f="MarineShipmentByCompartment",D="ViewMarineReceipt",j="supplier",w="finishedproduct",P="RailDispatch",E="RailReceipt",b="RailRoute",A="RailWagon",v="CloseRailDispatch",T="PrintRailBOL",N="PrintRailFAN",k="RailDispatchLoadSpotAssignment",F="RailDispatchProductAssignment",I="ViewRailDispatch",G="ViewRailLoadingDetails",V="CloseRailReceipt",O="PrintRailBOD",L="PrintRailRAN",M="ViewRailReceipt",q="ViewRailUnLoadingDetails",W="SMS",B="UnAccountedTransactionTank",U="UnAccountedTransactionMeter",H="PipelineDispatch",z="PipelineReceipt",_="PipelineDispatchManualEntry",Q="PipelineReceiptManualEntry",K="LookUpData",J="HSEInspection",$="HSEInspectionConfig",Y="Email",X="Shareholder",Z="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",oe="LeakageManualEntry",re="Terminal",ne="SlotInformation",se="TankGroup",ae="Tank",le="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",he="AccessCard",pe="ResetPin",me="SlotConfiguration",ue="PrintMarineFAN",ge="PrintMarineBOL",Ce="ViewMarineLoadingDetails",Se="ViewMarineShipmentAuditTrail",Re="CloseMarineShipment",xe="IssueCard",ye="ActivateCard",fe="RevokeCard",De="AutoIDAssociation",je="MarineReceiptByCompartment",we="PrintMarineRAN",Pe="PrintMarineBOD",Ee="ViewMarineUnloadingDetails",be="ViewMarineReceiptAuditTrail",Ae="CloseMarineReceipt",ve="WeekendConfig",Te="EODAdmin",Ne="PrintBOL",ke="PrintFAN",Fe="PrintBOD",Ie="CloseShipment",Ge="CloseReceipt",Ve="CONTRACTFORCECLOSE",Oe="Captain",Le="OverrideShipmentSequence",Me="KPIInformation",qe="Language",We="WebPortalUserMap",Be="BayGroup",Ue="PipelineHeaderSiteView",He="TankMonitor",ze="PersonAdmin",_e="ProductReconciliationReports",Qe="ReportConfiguration",Ke="EXECONFIGURATION",Je="ShareholderAllocation",$e="NotificationGroup",Ye="NotificationRestriction",Xe="NotificationConfig",Ze="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",ot="TANKSHAREHOLDERPRIMEFUNCTION",rt="ROLEADMIN",nt="ShiftConfig",st="PrinterConfiguration",at="CustomerAgreement",lt="BaySCADAConfiguration",ct="RailReceiptUnloadSpotAssignment",dt="STAFF_VISITOR",ht="PipelineMeterSiteView",pt="RailSiteView",mt="MarineSiteView",ut="LoadingDetails",gt="UnloadingDetails",Ct="RoadHSEInspection",St="RoadHSEInspectionConfig",Rt="MarineHSEInspection",xt="MarineHSEInspectionConfig",yt="RailHSEInspection",ft="RailHSEInspectionConfig",Dt="PipelineHSEInspection",jt="PipelineHSEInspectionConfig",wt="PrintRAN",Pt="ViewReceiptStatus",Et="customerrecipe",bt="COAParameter",At="COATemplate",vt="COAManagement",Tt="COACustomer",Nt="COAAssignment",kt="ProductForecastConfiguration"},93779:(e,t,i)=>{"use strict";i.d(t,{$A:()=>N,$L:()=>lt,$Q:()=>qe,Ae:()=>ve,BX:()=>ne,Bl:()=>ue,Bv:()=>Se,Bw:()=>X,Cb:()=>v,Cg:()=>b,DN:()=>nt,D_:()=>st,Dm:()=>k,E7:()=>J,EW:()=>I,FN:()=>re,FR:()=>n,FY:()=>ut,GA:()=>We,GT:()=>y,Ge:()=>Fe,HB:()=>se,JQ:()=>K,KJ:()=>ee,Kz:()=>H,Ln:()=>U,M$:()=>Ue,O5:()=>tt,Of:()=>fe,Oo:()=>it,Pk:()=>Ce,Pm:()=>Y,Q5:()=>ct,QK:()=>He,QV:()=>Xe,QZ:()=>dt,Qu:()=>ie,RX:()=>be,Rb:()=>W,Rp:()=>j,SP:()=>g,T5:()=>Ve,UB:()=>R,UT:()=>l,Ui:()=>_,VA:()=>q,Vk:()=>je,Wb:()=>we,Wv:()=>De,X3:()=>Ke,Y4:()=>B,Yl:()=>ot,Zx:()=>$,_B:()=>Re,_C:()=>A,_R:()=>ge,_j:()=>de,_n:()=>o,aM:()=>V,aW:()=>Me,bW:()=>M,c4:()=>rt,cD:()=>a,c_:()=>P,cx:()=>L,dL:()=>ht,eE:()=>le,eS:()=>_e,eT:()=>D,f:()=>F,f7:()=>me,fR:()=>he,g1:()=>ce,gN:()=>Je,gO:()=>z,iH:()=>at,ij:()=>et,j1:()=>E,jC:()=>xe,je:()=>pe,jz:()=>ae,ll:()=>Ze,mM:()=>x,mO:()=>mt,mW:()=>Ge,ml:()=>C,mm:()=>Ye,nB:()=>te,nT:()=>Ie,np:()=>ke,oA:()=>w,oG:()=>Qe,oV:()=>Z,ok:()=>h,oy:()=>c,pL:()=>Te,pe:()=>Be,pw:()=>ze,qF:()=>s,qQ:()=>pt,qp:()=>p,s0:()=>f,sA:()=>Ae,st:()=>oe,tY:()=>G,uw:()=>Q,v6:()=>r,vL:()=>Oe,vf:()=>Ne,wH:()=>$e,wO:()=>ye,wX:()=>O,x4:()=>Pe,xf:()=>m,xy:()=>d,yI:()=>S,yV:()=>T,yz:()=>u,zL:()=>Ee,zf:()=>Le});const o="CarrierCode",r="TransportationType",n="ShareHolderCode",s="DriverCode",a="CustomerCode",l="TrailerCode",c="OriginTerminalCode",d="PrimeMoverCode",h="VehicleCode",p="DestinationCode",m="FinishedProductCode",u="ShipmentCode",g="OrderCode",C="ReceiptCode",S="MarineDispatchCode",R="MarineReceiptCode",x="SupplierCode",y="ContractCode",f="RailDispatchCode",D="RailReceiptCode",j="RailRouteCode",w="WagonCode",P="CompartmentCode",E="SMSConfigurationCode",b="PipelineDispatchCode",A="PipelineReceiptCode",v="EmailConfigurationCode",T="BaseProductCode",N="LocationCode",k="SiteViewType",F="EntityCode",I="EntityType",G="CardReaderCode",V="AccessCardCode",O="BcuCode",L="DeuCode",M="WeighBridgeCode",q="Weight",W="OutOfToleranceAllowed",B="LoadingArmCode",U="TransportationType",H="BayCode",z="TransactionNumber",_="BatchNumber",Q="TerminalCode",K="TankGroupCode",J="TankCode",$="MeterCode",Y="ShipmentType",X="ShipmentStatus",Z="MeterLineType",ee="DispatchCode",te="ReceiptStatus",ie="FPTransactionID",oe="ProductCategoryType",re="Reason",ne="SealMasterCode",se="Reason",ae="OperationName",le="FPTransactionID",ce="ProductCategoryType",de="CompartmentSeqNoInVehicle",he="AdjustedPlanQuantity",pe="ForceComplete",me="DispatchStatus",ue="HolidayDate",ge="ActionID",Ce="EODTimePrev",Se="TerminalAction",Re="EODTime",xe="MonthStartDay",ye="CaptainCode",fe="GeneralTMUserType",De="GeneralTMUserCode",je="IsPriority",we="ActualTerminalCode",Pe="ShipmentBondNo",Ee="ReceiptBondNo",be="DeviceType",Ae="DeviceCode",ve="BayGroup",Te="PipelineHeaderCode",Ne="ExchangePartner",ke="PersonID",Fe="UserName",Ie="PipelinePlanCode",Ge="PipelinePlanType",Ve="ChannelCode",Oe="ProcessName",Le="ReconciliationCode",Me="NotificationGroupCode",qe="NotificationGroupStatus",We="NotificationGroupDesc",Be="NotificationResSource",Ue="NotificationResMsgCode",He="NotificationOrigResSource",ze="NotificationOrigResMsgCode",_e="NotificationMessageCode",Qe="PositionType",Ke="ExchangeAgreementCode",Je="ProductTransferAgreementCode",$e="ShareholderAgreementStatus",Ye="RequestorShareholder",Xe="LenderShareholder",Ze="RequestCode",et="TransferReferenceCode",tt="ShiftID",it="ShiftName",ot="PrinterName",rt="LocationType",nt="ForceClosureReason",st="TransactionType",at="CustomerRecipeCode",lt="COATemplateCode",ct="COAManagementCode",dt="COAParameterCode",ht="COAManagementFinishedProductCode",pt="COASeqNumber",mt="ForecastDate",ut="ForecastTanks"},50477:()=>{}}]);
//# sourceMappingURL=8380.701d3ddd.chunk.js.map