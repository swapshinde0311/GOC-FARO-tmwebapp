(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[7264,8149,5841,8222],{66554:(e,t,i)=>{"use strict";i.d(t,{$:()=>d});var o=i(65043),s=i(72711),r=i(67907),n=i(65187),a=i(69062),l=i(70579);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:c,selectedShareholder:d,onShareholderChange:u,onDelete:p,onAdd:h,popUpContent:m,shrVisible:g,handleBreadCrumbClick:C,addVisible:y,deleteVisible:S}=e;const[R,P]=(0,o.useState)(!1),[x,f]=(0,o.useState)(!1);function D(){t.add&&(m.length>0?f(!1===x):h())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(n.A,{children:[" ",(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsxs)(s.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(s.Breadcrumb.Item,{onClick:()=>{void 0!==C&&null!==C&&C(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(s.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===g?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(s.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!t.shareholder,options:a.Zj(c),onChange:e=>u(e)})})]})})})}),(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsxs)(s.Modal,{open:R,size:"small",children:[(0,l.jsx)(s.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(s.Modal.Footer,{children:[(0,l.jsx)(s.Button,{type:"secondary",content:e("Cancel"),onClick:()=>P(!1)}),(0,l.jsx)(s.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{P(!1),p()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[y?(0,l.jsx)(s.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:D,children:(0,l.jsx)(s.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:x,children:(0,l.jsx)("div",{onMouseLeave:()=>f(!1),children:(0,l.jsx)(r.TranslationConsumer,{children:e=>(0,l.jsx)(s.VerticalMenu,{children:(0,l.jsxs)(s.VerticalMenu,{children:[(0,l.jsx)(s.VerticalMenu.Header,{children:e("Common_Create")}),m.map((t=>(0,l.jsx)(s.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,f(!1),void h(e);var e},children:e(t.fieldValue)})))]})})})})}):"",S?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&P(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(s.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:s,onShareholderChange:r,onDelete:n,onAdd:a,popUpContent:d,shrVisible:u,handleBreadCrumbClick:p,addVisible:h,deleteVisible:m}=e;return(0,l.jsx)(c,{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:s,onShareholderChange:r,onDelete:n,onAdd:a,popUpContent:d,shrVisible:u,handleBreadCrumbClick:p,addVisible:h,deleteVisible:m})}},62900:(e,t,i)=>{"use strict";i.d(t,{A:()=>S});var o=i(65043),s=i(67907),r=i(72711),n=i(72067),a=i(69062),l=i(97508),c=i(44192),d=i(40854),u=i.n(d),p=i(53536),h=i.n(p),m=i(86111),g=i.n(m),C=i(70579);class y extends o.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:a.Th(c.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,t)=>{this.setState({Password:t});const i=h().cloneDeep(this.state.validationErrors);void 0!==c.Qh[e]&&(i[e]=a.jr(c.Qh[e],t),this.setState({validationErrors:i,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const t={...this.state.validationErrors};null!==e&&""!==e||(t.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,t=this.props.Username,i=g().lib.WordArray.random(16),o=g().PBKDF2(t,i,{keySize:8,iterations:100}),s=g().lib.WordArray.random(16),r=g().AES.encrypt(e,o,{iv:s,padding:g().pad.Pkcs7,mode:g().mode.CBC}),l=i.toString()+s.toString()+r.toString();u()(n.KrY+"?encryptedPassword="+encodeURIComponent(l),a.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess&&"true"===t.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:t.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(c){this.setState({authenticationResponse:c,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=a.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,C.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,C.jsx)(s.TranslationConsumer,{children:e=>(0,C.jsxs)(r.Modal,{open:!0,size:"mini",children:[(0,C.jsxs)(r.Modal.Content,{children:[(0,C.jsxs)("div",{className:"row",children:[(0,C.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,C.jsx)("h4",{children:e("User_Authentication")})}),(0,C.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,C.jsx)(r.Icon,{root:"common",name:"close"})})]}),(0,C.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)("label",{children:(0,C.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,C.jsx)("div",{className:"col col-lg-12",children:(0,C.jsx)(r.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,C.jsxs)(r.Modal.Footer,{children:[(0,C.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,C.jsx)(r.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const S=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(y)},19380:(e,t,i)=>{"use strict";i.d(t,{A:()=>x});var o=i(65043),s=i(728),r=i(62672),n=i(27976),a=i(44063),l=i(39078),c=i(48546),d=i(82967),u=i(11201),p=i(43439),h=(i(60663),i(48385)),m=i(72711),g=i(67907),C=i(65187),y=i(53536),S=(i(90837),i(70579));const R=e=>{const[t,i]=(0,o.useState)(null),[R]=(0,g.useTranslation)(),P=t=>new s.CollectionView(e.sourceData,{pageSize:t}),[x,f]=(0,o.useState)(P(e.rowsPerPage)),D=o.createRef(),w=o.createRef(),j=o.createRef(),b=o.createRef(),E=o.useRef(),v=o.useRef(e.selectionRequired?[]:null);let T=null;const A=t=>{try{if(F(),e.onRowClick&&t.addEventListener(t.hostElement,"click",(i=>{let o=t.hitTest(i);if(o.target.closest(".wj-cell")&&![...o.target.closest(".wj-cell").classList].includes("wj-group")&&o.cellType===r.CellType.Cell){const i=t.rows[o.row].dataItem;e.onRowClick(i)}})),t.selectionMode=s.asEnum("None",r.SelectionMode),t.select(-1,-1),i(t),e.selectionRequired){T=new u.Selector(t,{itemChecked:(i,o)=>{e.singleSelection&&t.rows.filter((e=>e.isSelected&&1===v.current.filter((t=>y.isEqual(t,e.dataItem))).length)).forEach((e=>{e.isSelected=!1})),e.onSelectionHandle(t.rows.filter((e=>e.isSelected)).map((e=>e.dataItem)))},showCheckAll:!e.singleSelection});let i=T.column.grid;T.column=i.rowHeaders.columns[0],i.headersVisibility=r.HeadersVisibility.All,i.selectionMode=s.asEnum("None",r.SelectionMode)}}catch(o){console.log("Error in gridInitialized: "+o)}};(0,o.useEffect)((()=>{try{if(null!=D){let e=D.current.control;w.current.control.grid=e}f(P(e.rowsPerPage))}catch(t){console.log("Error in grid update:",t)}}),[e.sourceData]),(0,o.useEffect)((()=>{try{t&&e.selectionRequired&&(v.current.length=0,v.current.push(...e.selectedItems),t.rows.forEach((t=>{1===e.selectedItems.filter((e=>y.isEqual(e,t.dataItem))).length?t.isSelected=!0:t.isSelected=!1})),t.refresh())}catch(i){console.log("Error in pre-selecting rows:",i)}}),[e.selectedItems]),(0,o.useEffect)((()=>{try{if(localStorage.getItem(e.parentComponent+"GridState")&&"null"!==localStorage.getItem(e.parentComponent+"GridState")&&t){let o=JSON.parse(localStorage.getItem(e.parentComponent+"GridState")),r=t;r.columns.forEach((e=>{let t=o.columns.filter((t=>t.binding===e.binding));e.visible=t.length>0?t[0].visible:e.visible})),j.current.control.filterDefinition=o.filterDefinition,r.collectionView.deferUpdate((()=>{r.collectionView.sortDescriptions.clear();for(let e=0;e<o.sortDescriptions.length;e++){let t=o.sortDescriptions[e];r.collectionView.sortDescriptions.push(new s.SortDescription(t.property,t.ascending))}}));for(let e=0;e<o.groupDescriptions.length;e++)r.collectionView.groupDescriptions.push(new s.PropertyGroupDescription(o.groupDescriptions[e])),r.columns.filter((t=>t.binding===o.groupDescriptions[e]))[0].visible=!1;if(sessionStorage.getItem(e.parentComponent+"GridState")&&"null"!==sessionStorage.getItem(e.parentComponent+"GridState")){let t=JSON.parse(sessionStorage.getItem(e.parentComponent+"GridState"));r.collectionView.moveToPage(r.collectionView.pageCount-1>=t.pageIndex?t.pageIndex:r.collectionView.pageCount-1),w&&(w.current.control.text=t.searchText)}i(r),t.refresh()}}catch(o){console.log("Error in restoring local storage settings: ",o)}}),[x]),(0,o.useEffect)((()=>{try{t&&E.current&&e.columnPickerRequired&&(E.current.itemsSource=t.columns,E.current.checkedMemberPath="visible",E.current.displayMemberPath="header",E.current.lostFocus.addHandler((()=>{(0,s.hidePopup)(E.current.hostElement)})))}catch(i){console.log("Error in initializing column picker properties:",i)}}),[E.current]),(0,o.useEffect)((()=>()=>{e.columnPickerRequired&&E.current&&(0,s.hidePopup)(E.current.hostElement)}),[]);const N=()=>{try{let o=t;o.itemsSource.pageSize=e.sourceData.length,i(o),p.FlexGridXlsxConverter.saveAsync(t,{includeColumnHeaders:!0,includeCellStyles:!1,formatItem:null},e.exportFileName),o.itemsSource.pageSize=e.rowsPerPage,i(o)}catch(o){console.log("Error in export grid to excel:",o)}},I=(t,i)=>{if(void 0!==i&&null!==i){if("boolean"===typeof t||"Active"===i.Name)return t?(0,S.jsx)(m.Icon,{name:"check",size:"small",color:"green"}):(0,S.jsx)(m.Icon,{name:"close",size:"small",color:"red"});if(""===t||null===t||void 0===t)return t;if(("TerminalCodes"===i.Name||"1"===i.PopOver)&&null!==t)return(o=t).split(",").length>e.terminalsToShow?(0,S.jsx)(m.Popup,{className:"popup-theme-wrap",on:"hover",element:o.split(",").length,children:(0,S.jsx)(m.Card,{children:(0,S.jsx)(m.Card.Content,{children:o})})}):o;if(void 0!==i.DataType&&"DateTime"===i.DataType)return new Date(t).toLocaleDateString()+" "+new Date(t).toLocaleTimeString();if(void 0!==i.DataType&&"Date"===i.DataType)return new Date(t).toLocaleDateString();if(void 0!==i.DataType&&"Time"===i.DataType)return new Date(t).toLocaleTimeString()}var o;return t},k=()=>{try{if(t&&j.current){let i={columns:t.columns.map((e=>({binding:e.binding,visible:e.visible}))),filterDefinition:j.current.control.filterDefinition,sortDescriptions:t.collectionView.sortDescriptions.map((e=>({property:e.property,ascending:e.ascending}))),groupDescriptions:t.collectionView.groupDescriptions.map((e=>e.propertyName?e.propertyName:null))};if(t.collectionView.groupDescriptions&&t.collectionView.groupDescriptions.length>0){[...document.getElementsByClassName("wj-column-selector-group")].forEach((e=>{e.parentNode.parentNode.classList.add("wj-grouped-checkbox")}))}let o={pageIndex:t.collectionView.pageIndex,searchText:w.current.control.text};localStorage.setItem(e.parentComponent+"GridState",JSON.stringify(i)),sessionStorage.setItem(e.parentComponent+"GridState",JSON.stringify(o))}}catch(i){console.log("Error in saving grid state")}},F=()=>{let e=s.culture.FlexGridFilter,t=l.Operator;s.culture.FlexGridFilter.header=R("WijmoGridFilterHeader"),s.culture.FlexGridFilter.ascending="\u2191 "+R("WijmoGridFilterAscending"),s.culture.FlexGridFilter.descending="\u2193 "+R("WijmoGridFilterDescending"),s.culture.FlexGridFilter.apply=R("RoleAdminEdit_Apply"),s.culture.FlexGridFilter.clear=R("OrderCreate_btnClear"),s.culture.FlexGridFilter.conditions=R("WijmoGridFilterCondition"),s.culture.FlexGridFilter.values=R("WijmoGridFilterValue"),s.culture.FlexGridFilter.search=R("LoadingDetailsView_SearchGrid"),s.culture.FlexGridFilter.selectAll=R("WijmoGridFilterSelectAll"),s.culture.FlexGridFilter.and=R("WijmoGridFilterAnd"),s.culture.FlexGridFilter.or=R("WijmoGridFilterOr"),s.culture.FlexGridFilter.cancel=R("AccessCardInfo_Cancel"),e.stringOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE},{name:R("WijmoGridFilterBeginsWith"),op:t.BW},{name:R("WijmoGridFilterEndsWith"),op:t.EW},{name:R("WijmoGridFilterContains"),op:t.CT},{name:R("WijmoGridFilterDoesNotContain"),op:t.NC}],e.numberOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE},{name:R("WijmoGridFilterGreaterThan"),op:t.GT},{name:R("WijmoGridFilterLessThan"),op:t.LT},{name:R("WijmoGridFilterGreaterThanOrEqual"),op:t.GE},{name:R("WijmoGridFilterLessThanOrEqual"),op:t.LE}],e.dateOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterDateEarlierThan"),op:t.LT},{name:R("WijmoGridFilterDateLaterThan"),op:t.GT}],e.booleanOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE}]},L=e=>{try{if(window.screen.width<1024&&e.WidthPx&&""!==e.WidthPx)return parseInt(e.WidthPx)}catch(t){console.log("Error in width:",t)}return e.WidthPercentage.includes("*")?e.WidthPercentage:parseInt(e.WidthPercentage)};return(0,S.jsx)("div",{className:"pl-1",children:(0,S.jsx)(C.A,{children:(0,S.jsx)(g.TranslationConsumer,{children:i=>(0,S.jsxs)(o.Fragment,{children:[(0,S.jsxs)("div",{className:"row pl-0",children:[(0,S.jsx)("div",{className:"col-10 col-sm-12 col-md-5 col-lg-6",children:(0,S.jsx)(c.q,{class:"ui single-input",ref:w,placeholder:i("LoadingDetailsView_SearchGrid")})}),(0,S.jsx)("div",{className:"col-10 col-sm-12 col-md-7 col-lg-6",children:(0,S.jsxs)("div",{style:{float:"right"},children:[e.columnPickerRequired?(0,S.jsxs)(m.Button,{id:"colPicker",actionType:"button",type:"primary",onClick:e=>(e=>{try{let i=E.current.hostElement;i.offsetHeight?((0,s.hidePopup)(i,!0,!0),t.focus()):((0,s.showPopup)(i,e.target,s.PopupPosition.Below,!0,!1),E.current.focus()),E.current.focus(),e.preventDefault()}catch(i){console.log("Error in Column Picker click event:",i)}})(e),children:[(0,S.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridColumnPicker")}),(0,S.jsx)("div",{style:{display:"inline-block"},children:(0,S.jsx)(m.Icon,{name:"caret-down",className:"btnIcon",size:"small"})})]}):null,e.exportRequired?(0,S.jsxs)(m.Button,{actionType:"button",type:"primary",className:"mt-3 mt-md-0",onClick:N,children:[(0,S.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridExport")}),(0,S.jsx)("div",{style:{display:"inline-block",marginLeft:"0.2rem"},children:(0,S.jsx)("span",{className:"icon-Xls",style:{fontSize:"17px",position:"absolute",top:"3px"}})})]}):null]})})]}),(0,S.jsxs)("div",{className:"tableScroll",children:[e.columnGroupingRequired?(0,S.jsx)(h.u,{className:"group-panel",grid:t,placeholder:i("WijmoGridGroupPanelPlaceholder")}):null,(0,S.jsx)(C.A,{children:(0,S.jsxs)(n.MC,{ref:D,autoGenerateColumns:!1,alternatingRowStep:0,autoRowHeights:!0,headersVisibility:"Column",itemsSource:x,selectionMode:s.asEnum("None",r.SelectionMode),initialized:A,virtualizationThreshold:[0,1e4],onUpdatedView:k,children:[(0,S.jsx)(a.M,{ref:j}),e.columns.map((t=>(0,S.jsx)(n.aK,{header:i(t.Name),binding:t.Name,width:L(t),minWidth:100,isReadOnly:!0,wordWrap:!0,align:"left",children:(0,S.jsx)(n.Gw,{cellType:"Cell",template:i=>(0,S.jsx)("span",{style:null!=e.conditionalRowStyleCheck&&e.conditionalRowStyleCheck(i.item)?{...e.conditionalRowStyles}:null,children:I(i.item[t.Name],t)})})},t.Name)))]})}),e.columnPickerRequired?(0,S.jsx)("div",{className:"column-picker-div",children:(0,S.jsx)(d.qF,{className:"column-picker",initialized:t=>(t=>{e.columnPickerRequired&&(E.current=t)})(t)})}):null]}),(0,S.jsx)("div",{className:"row",children:(0,S.jsx)(d.Ne,{ref:b,className:"ml-auto mr-auto mt-3",headerFormat:i("WijmoGridPagingTemplate"),byPage:!0,cv:x})})]})})})})};R.defaultProps={sourceData:[],columns:[],exportRequired:!0,exportFileName:"Grid.xlsx",selectionRequired:!1,columnPickerRequired:!1,columnGroupingRequired:!1,rowsPerPage:10,terminalsToShow:2,singleSelection:!1,selectedItems:[]};const P=R,x=e=>(0,S.jsx)(P,{sourceData:e.data,columns:e.columns,exportRequired:e.exportRequired,exportFileName:e.exportFileName,columnPickerRequired:e.columnPickerRequired,selectionRequired:e.selectionRequired,columnGroupingRequired:e.columnGroupingRequired,conditionalRowStyleCheck:e.conditionalRowStyleCheck,conditionalRowStyles:e.conditionalRowStyles,rowsPerPage:e.rowsPerPage,onSelectionHandle:e.onSelectionHandle,onRowClick:e.onRowClick,parentComponent:e.parentComponent,terminalsToShow:e.terminalsToShow,singleSelection:e.singleSelection,selectedItems:e.selectedItems})},55018:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>w});var o=i(65043),s=i(66554),r=i(19380),n=i(70579);function a(e){let{tableData:t,columnDetails:i,pageSize:o,exportRequired:s,exportFileName:a,columnPickerRequired:l,columnGroupingRequired:c,terminalsToShow:d,selectionRequired:u,onSelectionChange:p,onRowClick:h,parentComponent:m}=e;return(0,n.jsx)(r.A,{data:t,columns:i,rowsPerPage:o,exportRequired:s,exportFileName:a,columnPickerRequired:l,columnGroupingRequired:c,terminalsToShow:d,selectionRequired:u,onSelectionHandle:p,onRowClick:h,parentComponent:m})}var l=i(81652),c=i(40854),d=i.n(c),u=i(72067),p=i(14159),h=(i(92342),i(97508)),m=(i(63973),i(11981)),g=i(69062),C=i(65187),y=i(93779),S=i(80297),R=i(39424),P=i(40252),x=i(80312),f=i(62900);class D extends o.Component{constructor(){super(...arguments),this.state={isDetails:!1,isReadyToRender:!1,isDetailsModified:!1,operationsVisibilty:{add:!1,delete:!1,shareholder:!1},selectedRow:{},selectedItems:[],data:{},terminalCodes:[],baseProductKPIList:[],showAuthenticationLayout:!1},this.componentName="BaseProductComponent",this.componentWillUnmount=()=>{this.clearStorage(),window.removeEventListener("beforeunload",this.clearStorage)},this.clearStorage=()=>{sessionStorage.removeItem(this.componentName+"GridState")},this.handleAdd=()=>{try{var{operationsVisibilty:e}={...this.state};e.delete=!1,e.add=!1,e.shareholder=!1,this.setState({isDetails:!0,selectedRow:{},operationsVisibilty:e})}catch(t){console.log("BaseProductComposite:Error occured on handleAdd",t)}},this.savedEvent=(e,t,i)=>{try{const s={...this.state.operationsVisibilty};if("success"===i.messageType&&(s.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.add,x.JJ),s.delete=g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.remove,x.JJ),this.setState({isDetailsModified:!0,operationsVisibilty:s})),"success"===i.messageType&&"add"===t){var o=[{Common_Code:e.Code,Common_Status:e.Active}];this.setState({selectedItems:o})}(0,p.toast)((0,n.jsx)(C.A,{children:(0,n.jsx)(m.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4})}catch(s){console.log("BaseProductComposite:Error occured on savedEvent",s)}},this.handleBack=()=>{try{var{operationsVisibilty:e}={...this.state};e.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.add,x.JJ),e.delete=!1,this.setState({isDetails:!1,selectedRow:{},selectedItems:[],isReadyToRender:!1}),this.getBaseProductList(),this.getKPIList()}catch(t){console.log("BaseProductComposite:Error occured on Back click",t)}},this.handleRowClick=e=>{try{var{operationsVisibilty:t}={...this.state};t.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.add,x.JJ),t.delete=g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.remove,x.JJ),this.setState({isDetails:!0,selectedRow:e,selectedItems:[e],operationsVisibilty:t})}catch(i){console.log("BaseProductComposite:Error occured on Row click",i)}},this.handleSelection=e=>{try{var{operationsVisibilty:t}={...this.state};t.delete=e.length>0&&g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.remove,x.JJ),this.setState({selectedItems:e,operationsVisibilty:t})}catch(i){console.log("BaseProductComposite:Error occured on handleSelection",i)}},this.authenticateDelete=()=>{try{let e=!0!==this.props.userDetails.EntityResult.IsWebPortalUser;this.setState({showAuthenticationLayout:e}),!1===e&&this.handleDelete()}catch(e){console.log("BaseProductComposite : Error in authenticateDelete")}},this.handleAuthenticationClose=()=>{this.setState({showAuthenticationLayout:!1})},this.handleDelete=()=>{try{var{operationsVisibilty:e}={...this.state};e.delete=!1,this.setState({operationsVisibilty:e});for(var t=[],i=0;i<this.state.selectedItems.length;i++){var o=this.state.selectedItems[i].Common_Code,s={KeyCodes:[{Key:y.yV,Value:o}]};t.push(s)}d()(u.OFF,g.tW(t,this.props.tokenDetails.tokenInfo)).then((t=>{var i=t.data,o=i.isSuccess;null!==i.ResultDataList&&void 0!==i.ResultDataList&&(o=i.ResultDataList.filter((function(e){return!e.IsSuccess})).length!==i.ResultDataList.length);var s=g.Cy(i,"BaseProductInfo_DeletionStatus",["BaseProductCode"]);o?(this.setState({isReadyToRender:!1,showAuthenticationLayout:!1}),this.getBaseProductList(),this.getKPIList(),e.delete=!1,this.setState({selectedItems:[],operationsVisibilty:e,selectedRow:{},showAuthenticationLayout:!1})):(e.delete=!0,this.setState({operationsVisibilty:e,showAuthenticationLayout:!1})),s.messageResultDetails.forEach((e=>{e.keyFields.length>0&&(e.keyFields[0]="BaseProductInfo_BaseProdCode")})),(0,p.toast)((0,n.jsx)(C.A,{children:(0,n.jsx)(m.A,{notificationMessage:s})}),{autoClose:"success"===s.messageType&&1e4})})).catch((e=>{console.log("Error occured while deleting:"+e);var{operationsVisibilty:t}={...this.state};t.delete=!0,this.setState({operationsVisibilty:t,showAuthenticationLayout:!1})}))}catch(r){console.log("BaseProductComposite:Error occured on handleDelet",r)}}}componentDidMount(){try{g.pJ(this.props.userDetails.EntityResult.IsArchived);var{operationsVisibilty:e}={...this.state};e.add=g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.add,x.JJ),this.setState({operationsVisibilty:e}),this.getBaseProductList(),this.props.userDetails.EntityResult.IsEnterpriseNode&&this.getTerminalsList(this.props.userDetails.EntityResult.PrimaryShareholder),this.getKPIList()}catch(t){console.log("BaseProductComposite:Error occured on componentDidMount",t)}window.addEventListener("beforeunload",this.clearStorage)}getBaseProductList(){d()(u.ayS,g.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess?this.setState({data:t.EntityResult,isReadyToRender:!0}):(this.setState({data:[],isReadyToRender:!0}),console.log("Error in getBaseProductList:",t.ErrorList))})).catch((e=>{this.setState({data:[],isReadyToRender:!0}),console.log("Error while getting BaseProduct List:",e)}))}getKPIList(){if(!0===g.ab(this.props.userDetails.EntityResult.FunctionsList,x.i.view,x.bL)){var e={message:"",messageType:"critical",messageResultDetails:[]};let t={PageName:R.TG,InputParameters:[]};d()(u.dxq,g.tW(t,this.props.tokenDetails.tokenInfo)).then((t=>{var i=t.data;!0===i.IsSuccess?this.setState({baseProductKPIList:i.EntityResult.ListKPIDetails}):(this.setState({baseProductKPIList:[]}),console.log("Error in base product KPIList:",i.ErrorList),e.messageResultDetails.push({keyFields:[],keyValues:[],isSuccess:!1,errorMessage:i.ErrorList[0]})),e.messageResultDetails.length>0&&(0,p.toast)((0,n.jsx)(C.A,{children:(0,n.jsx)(m.A,{notificationMessage:e})}),{autoClose:"success"===e.messageType&&1e4})})).catch((e=>{console.log("Error while getting Base Product KPIList:",e)}))}}getTerminalsList(e){try{null!==e&&""!==e?d()(u.Oqv,g.tW([e],this.props.tokenDetails.tokenInfo)).then((e=>{e.data.IsSuccess&&this.setState({terminalCodes:e.data.EntityResult})})):this.setState({terminalCodes:[]})}catch(t){console.log("BaseProductComposite:Error occured on getTerminalsList",t)}}render(){return(0,n.jsxs)("div",{children:[(0,n.jsx)(C.A,{children:(0,n.jsx)(s.$,{operationsVisibilty:this.state.operationsVisibilty,breadcrumbItem:this.props.activeItem,shareholders:this.props.userDetails.EntityResult.ShareholderList,onDelete:this.authenticateDelete,onAdd:this.handleAdd,shrVisible:!1,handleBreadCrumbClick:this.props.handleBreadCrumbClick})}),!0===this.state.isDetails?(0,n.jsx)(C.A,{children:(0,n.jsx)(l.default,{selectedRow:this.state.selectedRow,onBack:this.handleBack,onSaved:this.savedEvent,terminalCodes:this.state.terminalCodes},"BaseProductDetails")}):this.state.isReadyToRender?(0,n.jsxs)("div",{children:[(0,n.jsx)(C.A,{children:(0,n.jsx)("div",{className:"kpiSummaryContainer",children:(0,n.jsx)(S.A,{kpiList:this.state.baseProductKPIList,pageName:"BaseProduct"})})}),(0,n.jsx)(C.A,{children:(0,n.jsx)(a,{tableData:this.state.data.Table,columnDetails:this.state.data.Column,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,exportRequired:!0,exportFileName:"BaseProductList",columnPickerRequired:!0,terminalsToShow:this.props.userDetails.EntityResult.PageAttibutes.NoOfTerminalsToShow,selectionRequired:!0,columnGroupingRequired:!0,onSelectionChange:this.handleSelection,onRowClick:this.handleRowClick,parentComponent:this.componentName})})]}):(0,n.jsx)(P.A,{message:"Loading"}),this.state.showAuthenticationLayout?(0,n.jsx)(f.A,{Username:this.props.userDetails.EntityResult.UserName,functionName:x.i.remove,functionGroup:x.JJ,handleClose:this.handleAuthenticationClose,handleOperation:this.handleDelete}):null,(0,n.jsx)(C.A,{children:(0,n.jsx)(p.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})}}const w=(0,h.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(D)},80312:(e,t,i)=>{"use strict";i.d(t,{$3:()=>_,$H:()=>oe,$J:()=>he,$K:()=>ge,$V:()=>Et,$b:()=>Pt,$p:()=>O,AE:()=>w,Al:()=>B,B2:()=>ot,By:()=>wt,CW:()=>gt,DA:()=>l,Ee:()=>qe,FO:()=>A,Fy:()=>Le,G9:()=>it,H8:()=>ee,Hq:()=>at,Ig:()=>F,Iu:()=>y,JI:()=>ct,JJ:()=>te,JU:()=>J,Jz:()=>Je,KQ:()=>ne,Kk:()=>Xe,Kw:()=>et,LP:()=>Tt,LR:()=>d,Lg:()=>$,Mg:()=>Pe,Mm:()=>L,N1:()=>Y,Nm:()=>m,No:()=>ce,Ow:()=>W,P2:()=>r,P8:()=>Se,PD:()=>Ne,PE:()=>u,PG:()=>K,PP:()=>ht,Pb:()=>ke,QB:()=>x,QC:()=>X,RE:()=>rt,RO:()=>$e,Rc:()=>yt,Rl:()=>xt,Rx:()=>Ct,TI:()=>S,Tm:()=>me,Ug:()=>Z,Ur:()=>Ue,V9:()=>c,VK:()=>U,VL:()=>pe,VQ:()=>ae,WD:()=>Ve,Wf:()=>E,YO:()=>I,YY:()=>Ae,Yb:()=>Ce,Yg:()=>_e,Z9:()=>pt,ZE:()=>dt,ZU:()=>P,_N:()=>St,_S:()=>vt,_d:()=>At,aS:()=>q,aZ:()=>ut,au:()=>De,b0:()=>bt,bL:()=>Be,c2:()=>Me,d4:()=>Fe,dB:()=>C,dD:()=>Oe,dK:()=>H,dY:()=>N,de:()=>p,dv:()=>ve,eQ:()=>a,f3:()=>xe,fF:()=>V,fL:()=>Rt,fN:()=>Dt,fk:()=>v,fl:()=>ye,fr:()=>f,go:()=>s,h:()=>ue,hD:()=>b,hE:()=>T,hh:()=>Ze,hk:()=>re,hz:()=>mt,i:()=>o,j2:()=>nt,jN:()=>z,je:()=>g,jx:()=>M,kL:()=>Ye,ke:()=>We,km:()=>le,l0:()=>se,l6:()=>He,lz:()=>k,m0:()=>R,nS:()=>je,nk:()=>lt,nn:()=>D,np:()=>Q,oh:()=>st,op:()=>Ke,pt:()=>Ge,qk:()=>de,qp:()=>Re,r6:()=>be,rQ:()=>Ee,rj:()=>G,rp:()=>n,t3:()=>ft,tM:()=>Ie,to:()=>It,ts:()=>tt,uH:()=>fe,uy:()=>Qe,w1:()=>Te,x5:()=>ie,xz:()=>j,y_:()=>ze,yu:()=>h,yx:()=>jt,z8:()=>we,z_:()=>Nt});const o={view:"view",add:"add",modify:"modify",remove:"remove"},s="carriercompany",r="driver",n="customer",a="trailer",l="originterminal",c="destination",d="primemover",u="vehicle",p="shipmentbycompartment",h="shipmentbyproduct",m="ViewShipmentStatus",g="vessel",C="order",y="OrderForceClose",S="contract",R="receiptplanbycompartment",P="ViewMarineShipment",x="MarineShipmentByCompartment",f="ViewMarineReceipt",D="supplier",w="finishedproduct",j="RailDispatch",b="RailReceipt",E="RailRoute",v="RailWagon",T="CloseRailDispatch",A="PrintRailBOL",N="PrintRailFAN",I="RailDispatchLoadSpotAssignment",k="RailDispatchProductAssignment",F="ViewRailDispatch",L="ViewRailLoadingDetails",V="CloseRailReceipt",G="PrintRailBOD",M="PrintRailRAN",B="ViewRailReceipt",O="ViewRailUnLoadingDetails",q="SMS",W="UnAccountedTransactionTank",U="UnAccountedTransactionMeter",H="PipelineDispatch",_="PipelineReceipt",z="PipelineDispatchManualEntry",J="PipelineReceiptManualEntry",K="LookUpData",Q="HSEInspection",$="HSEInspectionConfig",Y="Email",X="Shareholder",Z="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",oe="LeakageManualEntry",se="Terminal",re="SlotInformation",ne="TankGroup",ae="Tank",le="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",ue="AccessCard",pe="ResetPin",he="SlotConfiguration",me="PrintMarineFAN",ge="PrintMarineBOL",Ce="ViewMarineLoadingDetails",ye="ViewMarineShipmentAuditTrail",Se="CloseMarineShipment",Re="IssueCard",Pe="ActivateCard",xe="RevokeCard",fe="AutoIDAssociation",De="MarineReceiptByCompartment",we="PrintMarineRAN",je="PrintMarineBOD",be="ViewMarineUnloadingDetails",Ee="ViewMarineReceiptAuditTrail",ve="CloseMarineReceipt",Te="WeekendConfig",Ae="EODAdmin",Ne="PrintBOL",Ie="PrintFAN",ke="PrintBOD",Fe="CloseShipment",Le="CloseReceipt",Ve="CONTRACTFORCECLOSE",Ge="Captain",Me="OverrideShipmentSequence",Be="KPIInformation",Oe="Language",qe="WebPortalUserMap",We="BayGroup",Ue="PipelineHeaderSiteView",He="TankMonitor",_e="PersonAdmin",ze="ProductReconciliationReports",Je="ReportConfiguration",Ke="EXECONFIGURATION",Qe="ShareholderAllocation",$e="NotificationGroup",Ye="NotificationRestriction",Xe="NotificationConfig",Ze="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",ot="TANKSHAREHOLDERPRIMEFUNCTION",st="ROLEADMIN",rt="ShiftConfig",nt="PrinterConfiguration",at="CustomerAgreement",lt="BaySCADAConfiguration",ct="RailReceiptUnloadSpotAssignment",dt="STAFF_VISITOR",ut="PipelineMeterSiteView",pt="RailSiteView",ht="MarineSiteView",mt="LoadingDetails",gt="UnloadingDetails",Ct="RoadHSEInspection",yt="RoadHSEInspectionConfig",St="MarineHSEInspection",Rt="MarineHSEInspectionConfig",Pt="RailHSEInspection",xt="RailHSEInspectionConfig",ft="PipelineHSEInspection",Dt="PipelineHSEInspectionConfig",wt="PrintRAN",jt="ViewReceiptStatus",bt="customerrecipe",Et="COAParameter",vt="COATemplate",Tt="COAManagement",At="COACustomer",Nt="COAAssignment",It="ProductForecastConfiguration"},93779:(e,t,i)=>{"use strict";i.d(t,{$A:()=>N,$L:()=>lt,$Q:()=>Oe,Ae:()=>Te,BX:()=>re,Bl:()=>me,Bv:()=>ye,Bw:()=>X,Cb:()=>T,Cg:()=>E,DN:()=>rt,D_:()=>nt,Dm:()=>I,E7:()=>Q,EW:()=>F,FN:()=>se,FR:()=>r,FY:()=>mt,GA:()=>qe,GT:()=>P,Ge:()=>ke,HB:()=>ne,JQ:()=>K,KJ:()=>ee,Kz:()=>H,Ln:()=>U,M$:()=>Ue,O5:()=>tt,Of:()=>xe,Oo:()=>it,Pk:()=>Ce,Pm:()=>Y,Q5:()=>ct,QK:()=>He,QV:()=>Xe,QZ:()=>dt,Qu:()=>ie,RX:()=>Ee,Rb:()=>q,Rp:()=>D,SP:()=>g,T5:()=>Ve,UB:()=>S,UT:()=>l,Ui:()=>z,VA:()=>O,Vk:()=>De,Wb:()=>we,Wv:()=>fe,X3:()=>Ke,Y4:()=>W,Yl:()=>ot,Zx:()=>$,_B:()=>Se,_C:()=>v,_R:()=>ge,_j:()=>de,_n:()=>o,aM:()=>V,aW:()=>Be,bW:()=>B,c4:()=>st,cD:()=>a,c_:()=>j,cx:()=>M,dL:()=>ut,eE:()=>le,eS:()=>ze,eT:()=>f,f:()=>k,f7:()=>he,fR:()=>ue,g1:()=>ce,gN:()=>Qe,gO:()=>_,iH:()=>at,ij:()=>et,j1:()=>b,jC:()=>Re,je:()=>pe,jz:()=>ae,ll:()=>Ze,mM:()=>R,mO:()=>ht,mW:()=>Le,ml:()=>C,mm:()=>Ye,nB:()=>te,nT:()=>Fe,np:()=>Ie,oA:()=>w,oG:()=>Je,oV:()=>Z,ok:()=>u,oy:()=>c,pL:()=>Ae,pe:()=>We,pw:()=>_e,qF:()=>n,qQ:()=>pt,qp:()=>p,s0:()=>x,sA:()=>ve,st:()=>oe,tY:()=>L,uw:()=>J,v6:()=>s,vL:()=>Ge,vf:()=>Ne,wH:()=>$e,wO:()=>Pe,wX:()=>G,x4:()=>je,xf:()=>h,xy:()=>d,yI:()=>y,yV:()=>A,yz:()=>m,zL:()=>be,zf:()=>Me});const o="CarrierCode",s="TransportationType",r="ShareHolderCode",n="DriverCode",a="CustomerCode",l="TrailerCode",c="OriginTerminalCode",d="PrimeMoverCode",u="VehicleCode",p="DestinationCode",h="FinishedProductCode",m="ShipmentCode",g="OrderCode",C="ReceiptCode",y="MarineDispatchCode",S="MarineReceiptCode",R="SupplierCode",P="ContractCode",x="RailDispatchCode",f="RailReceiptCode",D="RailRouteCode",w="WagonCode",j="CompartmentCode",b="SMSConfigurationCode",E="PipelineDispatchCode",v="PipelineReceiptCode",T="EmailConfigurationCode",A="BaseProductCode",N="LocationCode",I="SiteViewType",k="EntityCode",F="EntityType",L="CardReaderCode",V="AccessCardCode",G="BcuCode",M="DeuCode",B="WeighBridgeCode",O="Weight",q="OutOfToleranceAllowed",W="LoadingArmCode",U="TransportationType",H="BayCode",_="TransactionNumber",z="BatchNumber",J="TerminalCode",K="TankGroupCode",Q="TankCode",$="MeterCode",Y="ShipmentType",X="ShipmentStatus",Z="MeterLineType",ee="DispatchCode",te="ReceiptStatus",ie="FPTransactionID",oe="ProductCategoryType",se="Reason",re="SealMasterCode",ne="Reason",ae="OperationName",le="FPTransactionID",ce="ProductCategoryType",de="CompartmentSeqNoInVehicle",ue="AdjustedPlanQuantity",pe="ForceComplete",he="DispatchStatus",me="HolidayDate",ge="ActionID",Ce="EODTimePrev",ye="TerminalAction",Se="EODTime",Re="MonthStartDay",Pe="CaptainCode",xe="GeneralTMUserType",fe="GeneralTMUserCode",De="IsPriority",we="ActualTerminalCode",je="ShipmentBondNo",be="ReceiptBondNo",Ee="DeviceType",ve="DeviceCode",Te="BayGroup",Ae="PipelineHeaderCode",Ne="ExchangePartner",Ie="PersonID",ke="UserName",Fe="PipelinePlanCode",Le="PipelinePlanType",Ve="ChannelCode",Ge="ProcessName",Me="ReconciliationCode",Be="NotificationGroupCode",Oe="NotificationGroupStatus",qe="NotificationGroupDesc",We="NotificationResSource",Ue="NotificationResMsgCode",He="NotificationOrigResSource",_e="NotificationOrigResMsgCode",ze="NotificationMessageCode",Je="PositionType",Ke="ExchangeAgreementCode",Qe="ProductTransferAgreementCode",$e="ShareholderAgreementStatus",Ye="RequestorShareholder",Xe="LenderShareholder",Ze="RequestCode",et="TransferReferenceCode",tt="ShiftID",it="ShiftName",ot="PrinterName",st="LocationType",rt="ForceClosureReason",nt="TransactionType",at="CustomerRecipeCode",lt="COATemplateCode",ct="COAManagementCode",dt="COAParameterCode",ut="COAManagementFinishedProductCode",pt="COASeqNumber",ht="ForecastDate",mt="ForecastTanks"},50477:()=>{}}]);
//# sourceMappingURL=7264.376bb6d0.chunk.js.map