(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[7117,8149,5841,8222],{66554:(e,t,i)=>{"use strict";i.d(t,{$:()=>d});var o=i(65043),s=i(72711),r=i(67907),n=i(65187),a=i(69062),l=i(70579);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:c,selectedShareholder:d,onShareholderChange:h,onDelete:u,onAdd:p,popUpContent:m,shrVisible:g,handleBreadCrumbClick:C,addVisible:S,deleteVisible:y}=e;const[R,D]=(0,o.useState)(!1),[x,f]=(0,o.useState)(!1);function P(){t.add&&(m.length>0?f(!1===x):p())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(n.A,{children:[" ",(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsxs)(s.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(s.Breadcrumb.Item,{onClick:()=>{void 0!==C&&null!==C&&C(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(s.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===g?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(s.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!t.shareholder,options:a.Zj(c),onChange:e=>h(e)})})]})})})}),(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsxs)(s.Modal,{open:R,size:"small",children:[(0,l.jsx)(s.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(s.Modal.Footer,{children:[(0,l.jsx)(s.Button,{type:"secondary",content:e("Cancel"),onClick:()=>D(!1)}),(0,l.jsx)(s.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{D(!1),u()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[S?(0,l.jsx)(s.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:P,children:(0,l.jsx)(s.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:x,children:(0,l.jsx)("div",{onMouseLeave:()=>f(!1),children:(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsx)(s.VerticalMenu,{children:(0,l.jsxs)(s.VerticalMenu,{children:[(0,l.jsx)(s.VerticalMenu.Header,{children:e("Common_Create")}),m.map((t=>(0,l.jsx)(s.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,f(!1),void p(e);var e},children:e(t.fieldValue)})))]})})})})}):"",y?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&D(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(s.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:s,onShareholderChange:r,onDelete:n,onAdd:a,popUpContent:d,shrVisible:h,handleBreadCrumbClick:u,addVisible:p,deleteVisible:m}=e;return(0,l.jsx)(c,{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:s,onShareholderChange:r,onDelete:n,onAdd:a,popUpContent:d,shrVisible:h,handleBreadCrumbClick:u,addVisible:p,deleteVisible:m})}},62900:(e,t,i)=>{"use strict";i.d(t,{A:()=>y});var o=i(65043),s=i(67907),r=i(72711),n=i(72067),a=i(69062),l=i(97508),c=i(44192),d=i(40854),h=i.n(d),u=i(53536),p=i.n(u),m=i(86111),g=i.n(m),C=i(70579);class S extends o.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:a.Th(c.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,t)=>{this.setState({Password:t});const i=p().cloneDeep(this.state.validationErrors);void 0!==c.Qh[e]&&(i[e]=a.jr(c.Qh[e],t),this.setState({validationErrors:i,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const t={...this.state.validationErrors};null!==e&&""!==e||(t.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,t=this.props.Username,i=g().lib.WordArray.random(16),o=g().PBKDF2(t,i,{keySize:8,iterations:100}),s=g().lib.WordArray.random(16),r=g().AES.encrypt(e,o,{iv:s,padding:g().pad.Pkcs7,mode:g().mode.CBC}),l=i.toString()+s.toString()+r.toString();h()(n.KrY+"?encryptedPassword="+encodeURIComponent(l),a.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess&&"true"===t.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:t.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(c){this.setState({authenticationResponse:c,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=a.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,C.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,C.jsx)(s.TranslationConsumer,{children:e=>(0,C.jsxs)(r.Modal,{open:!0,size:"mini",children:[(0,C.jsxs)(r.Modal.Content,{children:[(0,C.jsxs)("div",{className:"row",children:[(0,C.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,C.jsx)("h4",{children:e("User_Authentication")})}),(0,C.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,C.jsx)(r.Icon,{root:"common",name:"close"})})]}),(0,C.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)("label",{children:(0,C.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)(r.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,C.jsxs)(r.Modal.Footer,{children:[(0,C.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,C.jsx)(r.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const y=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(S)},19380:(e,t,i)=>{"use strict";i.d(t,{A:()=>x});var o=i(65043),s=i(728),r=i(62672),n=i(27976),a=i(44063),l=i(39078),c=i(48546),d=i(82967),h=i(11201),u=i(43439),p=(i(60663),i(48385)),m=i(72711),g=i(67907),C=i(65187),S=i(53536),y=(i(90837),i(70579));const R=e=>{const[t,i]=(0,o.useState)(null),[R]=(0,g.useTranslation)(),D=t=>new s.CollectionView(e.sourceData,{pageSize:t}),[x,f]=(0,o.useState)(D(e.rowsPerPage)),P=o.createRef(),v=o.createRef(),w=o.createRef(),j=o.createRef(),b=o.useRef(),E=o.useRef(e.selectionRequired?[]:null);let T=null;const A=t=>{try{if(F(),e.onRowClick&&t.addEventListener(t.hostElement,"click",(i=>{let o=t.hitTest(i);if(o.target.closest(".wj-cell")&&![...o.target.closest(".wj-cell").classList].includes("wj-group")&&o.cellType===r.CellType.Cell){const i=t.rows[o.row].dataItem;e.onRowClick(i)}})),t.selectionMode=s.asEnum("None",r.SelectionMode),t.select(-1,-1),i(t),e.selectionRequired){T=new h.Selector(t,{itemChecked:(i,o)=>{e.singleSelection&&t.rows.filter((e=>e.isSelected&&1===E.current.filter((t=>S.isEqual(t,e.dataItem))).length)).forEach((e=>{e.isSelected=!1})),e.onSelectionHandle(t.rows.filter((e=>e.isSelected)).map((e=>e.dataItem)))},showCheckAll:!e.singleSelection});let i=T.column.grid;T.column=i.rowHeaders.columns[0],i.headersVisibility=r.HeadersVisibility.All,i.selectionMode=s.asEnum("None",r.SelectionMode)}}catch(o){console.log("Error in gridInitialized: "+o)}};(0,o.useEffect)((()=>{try{if(null!=P){let e=P.current.control;v.current.control.grid=e}f(D(e.rowsPerPage))}catch(t){console.log("Error in grid update:",t)}}),[e.sourceData]),(0,o.useEffect)((()=>{try{t&&e.selectionRequired&&(E.current.length=0,E.current.push(...e.selectedItems),t.rows.forEach((t=>{1===e.selectedItems.filter((e=>S.isEqual(e,t.dataItem))).length?t.isSelected=!0:t.isSelected=!1})),t.refresh())}catch(i){console.log("Error in pre-selecting rows:",i)}}),[e.selectedItems]),(0,o.useEffect)((()=>{try{if(localStorage.getItem(e.parentComponent+"GridState")&&"null"!==localStorage.getItem(e.parentComponent+"GridState")&&t){let o=JSON.parse(localStorage.getItem(e.parentComponent+"GridState")),r=t;r.columns.forEach((e=>{let t=o.columns.filter((t=>t.binding===e.binding));e.visible=t.length>0?t[0].visible:e.visible})),w.current.control.filterDefinition=o.filterDefinition,r.collectionView.deferUpdate((()=>{r.collectionView.sortDescriptions.clear();for(let e=0;e<o.sortDescriptions.length;e++){let t=o.sortDescriptions[e];r.collectionView.sortDescriptions.push(new s.SortDescription(t.property,t.ascending))}}));for(let e=0;e<o.groupDescriptions.length;e++)r.collectionView.groupDescriptions.push(new s.PropertyGroupDescription(o.groupDescriptions[e])),r.columns.filter((t=>t.binding===o.groupDescriptions[e]))[0].visible=!1;if(sessionStorage.getItem(e.parentComponent+"GridState")&&"null"!==sessionStorage.getItem(e.parentComponent+"GridState")){let t=JSON.parse(sessionStorage.getItem(e.parentComponent+"GridState"));r.collectionView.moveToPage(r.collectionView.pageCount-1>=t.pageIndex?t.pageIndex:r.collectionView.pageCount-1),v&&(v.current.control.text=t.searchText)}i(r),t.refresh()}}catch(o){console.log("Error in restoring local storage settings: ",o)}}),[x]),(0,o.useEffect)((()=>{try{t&&b.current&&e.columnPickerRequired&&(b.current.itemsSource=t.columns,b.current.checkedMemberPath="visible",b.current.displayMemberPath="header",b.current.lostFocus.addHandler((()=>{(0,s.hidePopup)(b.current.hostElement)})))}catch(i){console.log("Error in initializing column picker properties:",i)}}),[b.current]),(0,o.useEffect)((()=>()=>{e.columnPickerRequired&&b.current&&(0,s.hidePopup)(b.current.hostElement)}),[]);const N=()=>{try{let o=t;o.itemsSource.pageSize=e.sourceData.length,i(o),u.FlexGridXlsxConverter.saveAsync(t,{includeColumnHeaders:!0,includeCellStyles:!1,formatItem:null},e.exportFileName),o.itemsSource.pageSize=e.rowsPerPage,i(o)}catch(o){console.log("Error in export grid to excel:",o)}},I=(t,i)=>{if(void 0!==i&&null!==i){if("boolean"===typeof t||"Active"===i.Name)return t?(0,y.jsx)(m.Icon,{name:"check",size:"small",color:"green"}):(0,y.jsx)(m.Icon,{name:"close",size:"small",color:"red"});if(""===t||null===t||void 0===t)return t;if(("TerminalCodes"===i.Name||"1"===i.PopOver)&&null!==t)return(o=t).split(",").length>e.terminalsToShow?(0,y.jsx)(m.Popup,{className:"popup-theme-wrap",on:"hover",element:o.split(",").length,children:(0,y.jsx)(m.Card,{children:(0,y.jsx)(m.Card.Content,{children:o})})}):o;if(void 0!==i.DataType&&"DateTime"===i.DataType)return new Date(t).toLocaleDateString()+" "+new Date(t).toLocaleTimeString();if(void 0!==i.DataType&&"Date"===i.DataType)return new Date(t).toLocaleDateString();if(void 0!==i.DataType&&"Time"===i.DataType)return new Date(t).toLocaleTimeString()}var o;return t},k=()=>{try{if(t&&w.current){let i={columns:t.columns.map((e=>({binding:e.binding,visible:e.visible}))),filterDefinition:w.current.control.filterDefinition,sortDescriptions:t.collectionView.sortDescriptions.map((e=>({property:e.property,ascending:e.ascending}))),groupDescriptions:t.collectionView.groupDescriptions.map((e=>e.propertyName?e.propertyName:null))};if(t.collectionView.groupDescriptions&&t.collectionView.groupDescriptions.length>0){[...document.getElementsByClassName("wj-column-selector-group")].forEach((e=>{e.parentNode.parentNode.classList.add("wj-grouped-checkbox")}))}let o={pageIndex:t.collectionView.pageIndex,searchText:v.current.control.text};localStorage.setItem(e.parentComponent+"GridState",JSON.stringify(i)),sessionStorage.setItem(e.parentComponent+"GridState",JSON.stringify(o))}}catch(i){console.log("Error in saving grid state")}},F=()=>{let e=s.culture.FlexGridFilter,t=l.Operator;s.culture.FlexGridFilter.header=R("WijmoGridFilterHeader"),s.culture.FlexGridFilter.ascending="\u2191 "+R("WijmoGridFilterAscending"),s.culture.FlexGridFilter.descending="\u2193 "+R("WijmoGridFilterDescending"),s.culture.FlexGridFilter.apply=R("RoleAdminEdit_Apply"),s.culture.FlexGridFilter.clear=R("OrderCreate_btnClear"),s.culture.FlexGridFilter.conditions=R("WijmoGridFilterCondition"),s.culture.FlexGridFilter.values=R("WijmoGridFilterValue"),s.culture.FlexGridFilter.search=R("LoadingDetailsView_SearchGrid"),s.culture.FlexGridFilter.selectAll=R("WijmoGridFilterSelectAll"),s.culture.FlexGridFilter.and=R("WijmoGridFilterAnd"),s.culture.FlexGridFilter.or=R("WijmoGridFilterOr"),s.culture.FlexGridFilter.cancel=R("AccessCardInfo_Cancel"),e.stringOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE},{name:R("WijmoGridFilterBeginsWith"),op:t.BW},{name:R("WijmoGridFilterEndsWith"),op:t.EW},{name:R("WijmoGridFilterContains"),op:t.CT},{name:R("WijmoGridFilterDoesNotContain"),op:t.NC}],e.numberOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE},{name:R("WijmoGridFilterGreaterThan"),op:t.GT},{name:R("WijmoGridFilterLessThan"),op:t.LT},{name:R("WijmoGridFilterGreaterThanOrEqual"),op:t.GE},{name:R("WijmoGridFilterLessThanOrEqual"),op:t.LE}],e.dateOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterDateEarlierThan"),op:t.LT},{name:R("WijmoGridFilterDateLaterThan"),op:t.GT}],e.booleanOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE}]},L=e=>{try{if(window.screen.width<1024&&e.WidthPx&&""!==e.WidthPx)return parseInt(e.WidthPx)}catch(t){console.log("Error in width:",t)}return e.WidthPercentage.includes("*")?e.WidthPercentage:parseInt(e.WidthPercentage)};return(0,y.jsx)("div",{className:"pl-1",children:(0,y.jsx)(C.A,{children:(0,y.jsx)(g.TranslationConsumer,{children:i=>(0,y.jsxs)(o.Fragment,{children:[(0,y.jsxs)("div",{className:"row pl-0",children:[(0,y.jsx)("div",{className:"col-10 col-sm-12 col-md-5 col-lg-6",children:(0,y.jsx)(c.q,{class:"ui single-input",ref:v,placeholder:i("LoadingDetailsView_SearchGrid")})}),(0,y.jsx)("div",{className:"col-10 col-sm-12 col-md-7 col-lg-6",children:(0,y.jsxs)("div",{style:{float:"right"},children:[e.columnPickerRequired?(0,y.jsxs)(m.Button,{id:"colPicker",actionType:"button",type:"primary",onClick:e=>(e=>{try{let i=b.current.hostElement;i.offsetHeight?((0,s.hidePopup)(i,!0,!0),t.focus()):((0,s.showPopup)(i,e.target,s.PopupPosition.Below,!0,!1),b.current.focus()),b.current.focus(),e.preventDefault()}catch(i){console.log("Error in Column Picker click event:",i)}})(e),children:[(0,y.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridColumnPicker")}),(0,y.jsx)("div",{style:{display:"inline-block"},children:(0,y.jsx)(m.Icon,{name:"caret-down",className:"btnIcon",size:"small"})})]}):null,e.exportRequired?(0,y.jsxs)(m.Button,{actionType:"button",type:"primary",className:"mt-3 mt-md-0",onClick:N,children:[(0,y.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridExport")}),(0,y.jsx)("div",{style:{display:"inline-block",marginLeft:"0.2rem"},children:(0,y.jsx)("span",{className:"icon-Xls",style:{fontSize:"17px",position:"absolute",top:"3px"}})})]}):null]})})]}),(0,y.jsxs)("div",{className:"tableScroll",children:[e.columnGroupingRequired?(0,y.jsx)(p.u,{className:"group-panel",grid:t,placeholder:i("WijmoGridGroupPanelPlaceholder")}):null,(0,y.jsx)(C.A,{children:(0,y.jsxs)(n.MC,{ref:P,autoGenerateColumns:!1,alternatingRowStep:0,autoRowHeights:!0,headersVisibility:"Column",itemsSource:x,selectionMode:s.asEnum("None",r.SelectionMode),initialized:A,virtualizationThreshold:[0,1e4],onUpdatedView:k,children:[(0,y.jsx)(a.M,{ref:w}),e.columns.map((t=>(0,y.jsx)(n.aK,{header:i(t.Name),binding:t.Name,width:L(t),minWidth:100,isReadOnly:!0,wordWrap:!0,align:"left",children:(0,y.jsx)(n.Gw,{cellType:"Cell",template:i=>(0,y.jsx)("span",{style:null!=e.conditionalRowStyleCheck&&e.conditionalRowStyleCheck(i.item)?{...e.conditionalRowStyles}:null,children:I(i.item[t.Name],t)})})},t.Name)))]})}),e.columnPickerRequired?(0,y.jsx)("div",{className:"column-picker-div",children:(0,y.jsx)(d.qF,{className:"column-picker",initialized:t=>(t=>{e.columnPickerRequired&&(b.current=t)})(t)})}):null]}),(0,y.jsx)("div",{className:"row",children:(0,y.jsx)(d.Ne,{ref:j,className:"ml-auto mr-auto mt-3",headerFormat:i("WijmoGridPagingTemplate"),byPage:!0,cv:x})})]})})})})};R.defaultProps={sourceData:[],columns:[],exportRequired:!0,exportFileName:"Grid.xlsx",selectionRequired:!1,columnPickerRequired:!1,columnGroupingRequired:!1,rowsPerPage:10,terminalsToShow:2,singleSelection:!1,selectedItems:[]};const D=R,x=e=>(0,y.jsx)(D,{sourceData:e.data,columns:e.columns,exportRequired:e.exportRequired,exportFileName:e.exportFileName,columnPickerRequired:e.columnPickerRequired,selectionRequired:e.selectionRequired,columnGroupingRequired:e.columnGroupingRequired,conditionalRowStyleCheck:e.conditionalRowStyleCheck,conditionalRowStyles:e.conditionalRowStyles,rowsPerPage:e.rowsPerPage,onSelectionHandle:e.onSelectionHandle,onRowClick:e.onRowClick,parentComponent:e.parentComponent,terminalsToShow:e.terminalsToShow,singleSelection:e.singleSelection,selectedItems:e.selectedItems})},28781:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>v});var o=i(65043),s=i(66554),r=i(40854),n=i.n(r),a=i(72067),l=i(14159),c=(i(92342),i(97508)),d=(i(63973),i(11981)),h=i(69062),u=i(65187),p=i(93779),m=i(80312),g=i(19380),C=i(70579);function S(e){let{tableData:t,columnDetails:i,exportRequired:o,exportFileName:s,columnPickerRequired:r,columnGroupingRequired:n,selectionRequired:a,pageSize:l,terminalsToShow:c,onSelectionChange:d,onRowClick:h,parentComponent:u}=e;return(0,C.jsx)(g.A,{data:t,columns:i,rowsPerPage:l,exportRequired:o,exportFileName:s,columnPickerRequired:r,columnGroupingRequired:n,selectionRequired:a,onSelectionHandle:d,onRowClick:h,parentComponent:u,terminalsToShow:c})}var y=i(62296),R=i(40252),D=i(80297),x=i(39424),f=i(62900);class P extends o.Component{constructor(){super(...arguments),this.state={isDetails:"false",isReadyToRender:!1,isDetailsModified:"false",operationsVisibilty:{add:!1,delete:!1,shareholder:!0},selectedRow:{},selectedItems:[],selectedShareholder:"",data:{},driverKPIList:[],showAuthenticationLayout:!1},this.componentName="DriversList",this.handleAdd=()=>{try{var{operationsVisibilty:e}={...this.state};e.delete=!1,e.add=!1,e.shareholder=!1,this.setState({isDetails:"true",selectedRow:{},operationsVisibilty:e})}catch(t){console.log("DriversComposite:Error occured on handleAdd",t)}},this.authenticateDelete=()=>{try{let e=!0!==this.props.userDetails.EntityResult.IsWebPortalUser;this.setState({showAuthenticationLayout:e}),!1===e&&this.handleDelete()}catch(e){console.log("DriversComponentComposite : Error in authenticateDelete")}},this.handleAuthenticationClose=()=>{this.setState({showAuthenticationLayout:!1})},this.handleDelete=()=>{try{var{operationsVisibilty:e}={...this.state};e.delete=!1,this.setState({operationsVisibilty:e});for(var t=[],i=0;i<this.state.selectedItems.length;i++){var o=this.state.selectedShareholder,s=this.state.selectedItems[i].Common_Code,r={keyDataCode:0,ShareHolderCode:o,KeyCodes:[{Key:p.qF,Value:s}]};t.push(r)}n()(a.qAQ,h.tW(t,this.props.tokenDetails.tokenInfo)).then((t=>{var i=t.data,o=i.isSuccess;null!==i.ResultDataList&&void 0!==i.ResultDataList&&(o=i.ResultDataList.filter((function(e){return!e.IsSuccess})).length!==i.ResultDataList.length);var s=h.Cy(i,"DriverInfo_DeletionStatus",["DriverCode"]);o?(this.setState({isReadyToRender:!1,showAuthenticationLayout:!1}),this.getdriverList(this.state.selectedShareholder),this.getKPIList(this.state.selectedShareholder),e.delete=!1,this.setState({selectedItems:[],operationsVisibilty:e,selectedRow:{},showAuthenticationLayout:!1})):(e.delete=!0,this.setState({operationsVisibilty:e,showAuthenticationLayout:!1})),s.messageResultDetails.forEach((e=>{e.keyFields.length>0&&(e.keyFields[0]="DriverInfo_Code")})),(0,l.toast)((0,C.jsx)(u.A,{children:(0,C.jsx)(d.A,{notificationMessage:s})}),{autoClose:"success"===s.messageType&&1e4})})).catch((e=>{throw e}))}catch(c){console.log("DriversComposite:Error occured on handleDelet",c)}},this.handleBack=()=>{try{var{operationsVisibilty:e}={...this.state};e.add=h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.P2),e.delete=!1,e.shareholder=!0,this.setState({isDetails:"false",selectedRow:{},selectedItems:[],operationsVisibilty:e,isReadyToRender:!1}),this.getdriverList(this.state.selectedShareholder),this.getKPIList(this.state.selectedShareholder)}catch(t){console.log("DriversComposite:Error occured on Back click",t)}},this.handleRowClick=e=>{try{var{operationsVisibilty:t}={...this.state};t.add=h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.P2),t.delete=h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.remove,m.P2),t.shareholder=!1,this.setState({isDetails:"true",selectedRow:e,selectedItems:[e],operationsVisibilty:t})}catch(i){console.log("DriversComposite:Error occured on handleRowClick",i)}},this.handleSelection=e=>{try{var{operationsVisibilty:t}={...this.state};t.delete=e.length>0&&h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.remove,m.P2),this.setState({selectedItems:e,operationsVisibilty:t})}catch(i){console.log("DriversComposite:Error occured on handleSelection",i)}},this.savedEvent=(e,t,i)=>{try{var{operationsVisibilty:o}={...this.state};if("success"===i.messageType&&(o.add=h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.P2),o.delete=h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.remove,m.P2),this.setState({isDetailsModified:"true",operationsVisibilty:o})),"success"===i.messageType&&"add"===t){var s=[{Common_Code:e.Code,Common_Shareholder:e.ShareholderCode}];this.setState({selectedItems:s})}(0,l.toast)((0,C.jsx)(u.A,{children:(0,C.jsx)(d.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4})}catch(r){console.log("DriversComposite:Error occured on savedEvent",r)}},this.handleShareholderSelectionChange=e=>{try{let{operationsVisibilty:t}={...this.state};t.delete=!1,this.setState({selectedShareholder:e,isReadyToRender:!1,selectedItems:[],operationsVisibilty:t}),this.getdriverList(e),this.getKPIList(e)}catch(t){console.log("DriversComposite:Error occured on handleShareholderSelectionChange",t)}},this.componentWillUnmount=()=>{h.D6(this.componentName+"GridState"),window.removeEventListener("beforeunload",(()=>h.D6(this.componentName+"GridState")))}}getKPIList(e){if(!0===h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.view,m.bL)){var t={message:"",messageType:"critical",messageResultDetails:[]};let i={PageName:x.De,InputParameters:[{key:"ShareholderCode",value:e}]};n()(a.dxq,h.tW(i,this.props.tokenDetails.tokenInfo)).then((e=>{var i=e.data;!0===i.IsSuccess?this.setState({driverKPIList:i.EntityResult.ListKPIDetails}):(this.setState({driverKPIList:[]}),console.log("Error in driver KPIList:",i.ErrorList),t.messageResultDetails.push({keyFields:[],keyValues:[],isSuccess:!1,errorMessage:i.ErrorList[0]})),t.messageResultDetails.length>0&&(0,l.toast)((0,C.jsx)(u.A,{children:(0,C.jsx)(d.A,{notificationMessage:t})}),{autoClose:"success"===t.messageType&&1e4})})).catch((e=>{console.log("Error while getting Driver KPIList:",e)}))}}getdriverList(e){n()(a.OUj+e,h.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess?this.setState({data:t.EntityResult,isReadyToRender:!0}):(this.setState({data:[],isReadyToRender:!0}),console.log("Error in GetDriverListForRole:",t.ErrorList))})).catch((e=>{this.setState({data:[],isReadyToRender:!0}),console.log("Error while getting Driver List:",e)}))}componentDidMount(){window.addEventListener("beforeunload",(()=>h.D6(this.componentName+"GridState")));try{h.pJ(this.props.userDetails.EntityResult.IsArchived);var{operationsVisibilty:e}={...this.state};e.add=h.ab(this.props.userDetails.EntityResult.FunctionsList,m.i.add,m.P2),this.setState({operationsVisibilty:e,selectedShareholder:this.props.userDetails.EntityResult.PrimaryShareholder}),this.getdriverList(this.props.userDetails.EntityResult.PrimaryShareholder),this.getKPIList(this.props.userDetails.EntityResult.PrimaryShareholder)}catch(t){console.log("DriversComposite:Error occured on ComponentDidMount",t)}}render(){return(0,C.jsxs)("div",{children:[(0,C.jsx)(u.A,{children:(0,C.jsx)(s.$,{operationsVisibilty:this.state.operationsVisibilty,breadcrumbItem:this.props.activeItem,shareholders:this.props.userDetails.EntityResult.ShareholderList,selectedShareholder:this.state.selectedShareholder,onShareholderChange:this.handleShareholderSelectionChange,onDelete:this.authenticateDelete,onAdd:this.handleAdd,handleBreadCrumbClick:this.props.handleBreadCrumbClick})}),"true"===this.state.isDetails?(0,C.jsx)(u.A,{children:(0,C.jsx)(y.default,{selectedRow:this.state.selectedRow,selectedShareholder:this.state.selectedShareholder,onBack:this.handleBack,onSaved:this.savedEvent},"DriverDetails")}):this.state.isReadyToRender?(0,C.jsxs)("div",{children:[(0,C.jsx)(u.A,{children:(0,C.jsx)("div",{className:"kpiSummaryContainer",children:(0,C.jsx)(D.A,{kpiList:this.state.driverKPIList,pageName:"Drivers"})})}),(0,C.jsx)(u.A,{children:(0,C.jsx)(S,{tableData:this.state.data.Table,columnDetails:this.state.data.Column,exportRequired:!0,exportFileName:"DriversList.xlsx",columnPickerRequired:!0,columnGroupingRequired:!0,selectionRequired:!0,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,terminalsToShow:this.props.userDetails.EntityResult.PageAttibutes.NoOfTerminalsToShow,onRowClick:this.handleRowClick,onSelectionChange:this.handleSelection,parentComponent:this.componentName})})]}):(0,C.jsx)(R.A,{message:"Loading"}),this.state.showAuthenticationLayout?(0,C.jsx)(f.A,{Username:this.props.userDetails.EntityResult.UserName,functionName:m.i.remove,functionGroup:m.P2,handleClose:this.handleAuthenticationClose,handleOperation:this.handleDelete}):null,(0,C.jsx)(u.A,{children:(0,C.jsx)(l.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})}}const v=(0,c.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(P)},80312:(e,t,i)=>{"use strict";i.d(t,{$3:()=>_,$H:()=>oe,$J:()=>pe,$K:()=>ge,$V:()=>bt,$b:()=>Dt,$p:()=>O,AE:()=>v,Al:()=>q,B2:()=>ot,By:()=>vt,CW:()=>gt,DA:()=>l,Ee:()=>We,FO:()=>A,Fy:()=>Le,G9:()=>it,H8:()=>ee,Hq:()=>at,Ig:()=>F,Iu:()=>S,JI:()=>ct,JJ:()=>te,JU:()=>K,Jz:()=>Ke,KQ:()=>ne,Kk:()=>Xe,Kw:()=>et,LP:()=>Tt,LR:()=>d,Lg:()=>$,Mg:()=>De,Mm:()=>L,N1:()=>Y,Nm:()=>m,No:()=>ce,Ow:()=>B,P2:()=>r,P8:()=>ye,PD:()=>Ne,PE:()=>h,PG:()=>Q,PP:()=>pt,Pb:()=>ke,QB:()=>x,QC:()=>X,RE:()=>rt,RO:()=>$e,Rc:()=>St,Rl:()=>xt,Rx:()=>Ct,TI:()=>y,Tm:()=>me,Ug:()=>Z,Ur:()=>Ue,V9:()=>c,VK:()=>U,VL:()=>ue,VQ:()=>ae,WD:()=>Ve,Wf:()=>b,YO:()=>I,YY:()=>Ae,Yb:()=>Ce,Yg:()=>_e,Z9:()=>ut,ZE:()=>dt,ZU:()=>D,_N:()=>yt,_S:()=>Et,_d:()=>At,aS:()=>W,aZ:()=>ht,au:()=>Pe,b0:()=>jt,bL:()=>qe,c2:()=>Me,d4:()=>Fe,dB:()=>C,dD:()=>Oe,dK:()=>H,dY:()=>N,de:()=>u,dv:()=>Ee,eQ:()=>a,f3:()=>xe,fF:()=>V,fL:()=>Rt,fN:()=>Pt,fk:()=>E,fl:()=>Se,fr:()=>f,go:()=>s,h:()=>he,hD:()=>j,hE:()=>T,hh:()=>Ze,hk:()=>re,hz:()=>mt,i:()=>o,j2:()=>nt,jN:()=>z,je:()=>g,jx:()=>M,kL:()=>Ye,ke:()=>Be,km:()=>le,l0:()=>se,l6:()=>He,lz:()=>k,m0:()=>R,nS:()=>we,nk:()=>lt,nn:()=>P,np:()=>J,oh:()=>st,op:()=>Qe,pt:()=>Ge,qk:()=>de,qp:()=>Re,r6:()=>je,rQ:()=>be,rj:()=>G,rp:()=>n,t3:()=>ft,tM:()=>Ie,to:()=>It,ts:()=>tt,uH:()=>fe,uy:()=>Je,w1:()=>Te,x5:()=>ie,xz:()=>w,y_:()=>ze,yu:()=>p,yx:()=>wt,z8:()=>ve,z_:()=>Nt});const o={view:"view",add:"add",modify:"modify",remove:"remove"},s="carriercompany",r="driver",n="customer",a="trailer",l="originterminal",c="destination",d="primemover",h="vehicle",u="shipmentbycompartment",p="shipmentbyproduct",m="ViewShipmentStatus",g="vessel",C="order",S="OrderForceClose",y="contract",R="receiptplanbycompartment",D="ViewMarineShipment",x="MarineShipmentByCompartment",f="ViewMarineReceipt",P="supplier",v="finishedproduct",w="RailDispatch",j="RailReceipt",b="RailRoute",E="RailWagon",T="CloseRailDispatch",A="PrintRailBOL",N="PrintRailFAN",I="RailDispatchLoadSpotAssignment",k="RailDispatchProductAssignment",F="ViewRailDispatch",L="ViewRailLoadingDetails",V="CloseRailReceipt",G="PrintRailBOD",M="PrintRailRAN",q="ViewRailReceipt",O="ViewRailUnLoadingDetails",W="SMS",B="UnAccountedTransactionTank",U="UnAccountedTransactionMeter",H="PipelineDispatch",_="PipelineReceipt",z="PipelineDispatchManualEntry",K="PipelineReceiptManualEntry",Q="LookUpData",J="HSEInspection",$="HSEInspectionConfig",Y="Email",X="Shareholder",Z="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",oe="LeakageManualEntry",se="Terminal",re="SlotInformation",ne="TankGroup",ae="Tank",le="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",he="AccessCard",ue="ResetPin",pe="SlotConfiguration",me="PrintMarineFAN",ge="PrintMarineBOL",Ce="ViewMarineLoadingDetails",Se="ViewMarineShipmentAuditTrail",ye="CloseMarineShipment",Re="IssueCard",De="ActivateCard",xe="RevokeCard",fe="AutoIDAssociation",Pe="MarineReceiptByCompartment",ve="PrintMarineRAN",we="PrintMarineBOD",je="ViewMarineUnloadingDetails",be="ViewMarineReceiptAuditTrail",Ee="CloseMarineReceipt",Te="WeekendConfig",Ae="EODAdmin",Ne="PrintBOL",Ie="PrintFAN",ke="PrintBOD",Fe="CloseShipment",Le="CloseReceipt",Ve="CONTRACTFORCECLOSE",Ge="Captain",Me="OverrideShipmentSequence",qe="KPIInformation",Oe="Language",We="WebPortalUserMap",Be="BayGroup",Ue="PipelineHeaderSiteView",He="TankMonitor",_e="PersonAdmin",ze="ProductReconciliationReports",Ke="ReportConfiguration",Qe="EXECONFIGURATION",Je="ShareholderAllocation",$e="NotificationGroup",Ye="NotificationRestriction",Xe="NotificationConfig",Ze="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",ot="TANKSHAREHOLDERPRIMEFUNCTION",st="ROLEADMIN",rt="ShiftConfig",nt="PrinterConfiguration",at="CustomerAgreement",lt="BaySCADAConfiguration",ct="RailReceiptUnloadSpotAssignment",dt="STAFF_VISITOR",ht="PipelineMeterSiteView",ut="RailSiteView",pt="MarineSiteView",mt="LoadingDetails",gt="UnloadingDetails",Ct="RoadHSEInspection",St="RoadHSEInspectionConfig",yt="MarineHSEInspection",Rt="MarineHSEInspectionConfig",Dt="RailHSEInspection",xt="RailHSEInspectionConfig",ft="PipelineHSEInspection",Pt="PipelineHSEInspectionConfig",vt="PrintRAN",wt="ViewReceiptStatus",jt="customerrecipe",bt="COAParameter",Et="COATemplate",Tt="COAManagement",At="COACustomer",Nt="COAAssignment",It="ProductForecastConfiguration"},93779:(e,t,i)=>{"use strict";i.d(t,{$A:()=>N,$L:()=>lt,$Q:()=>Oe,Ae:()=>Te,BX:()=>re,Bl:()=>me,Bv:()=>Se,Bw:()=>X,Cb:()=>T,Cg:()=>b,DN:()=>rt,D_:()=>nt,Dm:()=>I,E7:()=>J,EW:()=>F,FN:()=>se,FR:()=>r,FY:()=>mt,GA:()=>We,GT:()=>D,Ge:()=>ke,HB:()=>ne,JQ:()=>Q,KJ:()=>ee,Kz:()=>H,Ln:()=>U,M$:()=>Ue,O5:()=>tt,Of:()=>xe,Oo:()=>it,Pk:()=>Ce,Pm:()=>Y,Q5:()=>ct,QK:()=>He,QV:()=>Xe,QZ:()=>dt,Qu:()=>ie,RX:()=>be,Rb:()=>W,Rp:()=>P,SP:()=>g,T5:()=>Ve,UB:()=>y,UT:()=>l,Ui:()=>z,VA:()=>O,Vk:()=>Pe,Wb:()=>ve,Wv:()=>fe,X3:()=>Qe,Y4:()=>B,Yl:()=>ot,Zx:()=>$,_B:()=>ye,_C:()=>E,_R:()=>ge,_j:()=>de,_n:()=>o,aM:()=>V,aW:()=>qe,bW:()=>q,c4:()=>st,cD:()=>a,c_:()=>w,cx:()=>M,dL:()=>ht,eE:()=>le,eS:()=>ze,eT:()=>f,f:()=>k,f7:()=>pe,fR:()=>he,g1:()=>ce,gN:()=>Je,gO:()=>_,iH:()=>at,ij:()=>et,j1:()=>j,jC:()=>Re,je:()=>ue,jz:()=>ae,ll:()=>Ze,mM:()=>R,mO:()=>pt,mW:()=>Le,ml:()=>C,mm:()=>Ye,nB:()=>te,nT:()=>Fe,np:()=>Ie,oA:()=>v,oG:()=>Ke,oV:()=>Z,ok:()=>h,oy:()=>c,pL:()=>Ae,pe:()=>Be,pw:()=>_e,qF:()=>n,qQ:()=>ut,qp:()=>u,s0:()=>x,sA:()=>Ee,st:()=>oe,tY:()=>L,uw:()=>K,v6:()=>s,vL:()=>Ge,vf:()=>Ne,wH:()=>$e,wO:()=>De,wX:()=>G,x4:()=>we,xf:()=>p,xy:()=>d,yI:()=>S,yV:()=>A,yz:()=>m,zL:()=>je,zf:()=>Me});const o="CarrierCode",s="TransportationType",r="ShareHolderCode",n="DriverCode",a="CustomerCode",l="TrailerCode",c="OriginTerminalCode",d="PrimeMoverCode",h="VehicleCode",u="DestinationCode",p="FinishedProductCode",m="ShipmentCode",g="OrderCode",C="ReceiptCode",S="MarineDispatchCode",y="MarineReceiptCode",R="SupplierCode",D="ContractCode",x="RailDispatchCode",f="RailReceiptCode",P="RailRouteCode",v="WagonCode",w="CompartmentCode",j="SMSConfigurationCode",b="PipelineDispatchCode",E="PipelineReceiptCode",T="EmailConfigurationCode",A="BaseProductCode",N="LocationCode",I="SiteViewType",k="EntityCode",F="EntityType",L="CardReaderCode",V="AccessCardCode",G="BcuCode",M="DeuCode",q="WeighBridgeCode",O="Weight",W="OutOfToleranceAllowed",B="LoadingArmCode",U="TransportationType",H="BayCode",_="TransactionNumber",z="BatchNumber",K="TerminalCode",Q="TankGroupCode",J="TankCode",$="MeterCode",Y="ShipmentType",X="ShipmentStatus",Z="MeterLineType",ee="DispatchCode",te="ReceiptStatus",ie="FPTransactionID",oe="ProductCategoryType",se="Reason",re="SealMasterCode",ne="Reason",ae="OperationName",le="FPTransactionID",ce="ProductCategoryType",de="CompartmentSeqNoInVehicle",he="AdjustedPlanQuantity",ue="ForceComplete",pe="DispatchStatus",me="HolidayDate",ge="ActionID",Ce="EODTimePrev",Se="TerminalAction",ye="EODTime",Re="MonthStartDay",De="CaptainCode",xe="GeneralTMUserType",fe="GeneralTMUserCode",Pe="IsPriority",ve="ActualTerminalCode",we="ShipmentBondNo",je="ReceiptBondNo",be="DeviceType",Ee="DeviceCode",Te="BayGroup",Ae="PipelineHeaderCode",Ne="ExchangePartner",Ie="PersonID",ke="UserName",Fe="PipelinePlanCode",Le="PipelinePlanType",Ve="ChannelCode",Ge="ProcessName",Me="ReconciliationCode",qe="NotificationGroupCode",Oe="NotificationGroupStatus",We="NotificationGroupDesc",Be="NotificationResSource",Ue="NotificationResMsgCode",He="NotificationOrigResSource",_e="NotificationOrigResMsgCode",ze="NotificationMessageCode",Ke="PositionType",Qe="ExchangeAgreementCode",Je="ProductTransferAgreementCode",$e="ShareholderAgreementStatus",Ye="RequestorShareholder",Xe="LenderShareholder",Ze="RequestCode",et="TransferReferenceCode",tt="ShiftID",it="ShiftName",ot="PrinterName",st="LocationType",rt="ForceClosureReason",nt="TransactionType",at="CustomerRecipeCode",lt="COATemplateCode",ct="COAManagementCode",dt="COAParameterCode",ht="COAManagementFinishedProductCode",ut="COASeqNumber",pt="ForecastDate",mt="ForecastTanks"},50477:()=>{}}]);
//# sourceMappingURL=7117.6c272aee.chunk.js.map