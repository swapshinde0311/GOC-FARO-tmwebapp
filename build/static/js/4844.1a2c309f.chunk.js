(self.webpackChunktmwebapp=self.webpackChunktmwebapp||[]).push([[4844,5841,8222],{66554:(e,t,i)=>{"use strict";i.d(t,{$:()=>d});var o=i(65043),s=i(72711),n=i(67907),r=i(65187),a=i(69062),l=i(70579);function c(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:c,selectedShareholder:d,onShareholderChange:p,onDelete:u,onAdd:h,popUpContent:m,shrVisible:C,handleBreadCrumbClick:g,addVisible:S,deleteVisible:y}=e;const[R,x]=(0,o.useState)(!1),[f,D]=(0,o.useState)(!1);function w(){t.add&&(m.length>0?D(!1===f):h())}return(0,l.jsxs)("div",{className:"row",style:{alignItems:"flex-start",padding:"0px"},children:[(0,l.jsx)("div",{className:"col-9 col-sm-9 col-md-9 col-lg-10 col-xl-10",style:{padding:"0px"},children:(0,l.jsxs)("div",{className:"row",style:{marginTop:"10px",alignItems:""},children:[(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-8",children:(0,l.jsxs)(r.A,{children:[" ",(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsxs)(s.Breadcrumb,{children:[i.parents.map((t=>(0,l.jsx)(s.Breadcrumb.Item,{onClick:()=>{void 0!==g&&null!==g&&g(t.itemCode,i.parents)},children:e(t.localizedKey)},t.itemCode))),(0,l.jsx)(s.Breadcrumb.Item,{children:e(i.localizedKey)},i.itemCode)]})})]})}),(0,l.jsx)("div",{className:"col-12 col-sm-12 col-md-12 col-lg-6 col-xl-4",children:(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsx)("div",{className:"compartmentIcon",style:{justifyContent:"flex-start"},children:!1===C?"":(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("div",{children:(0,l.jsxs)("h4",{className:"shrText",children:[e("Common_Shareholder"),":"]})}),(0,l.jsx)("div",{className:"opSelect",children:(0,l.jsx)(s.Select,{placeholder:e("Common_Shareholder"),value:d,disabled:!t.shareholder,options:a.Zj(c),onChange:e=>p(e)})})]})})})}),(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsxs)(s.Modal,{open:R,size:"small",children:[(0,l.jsx)(s.Modal.Content,{children:(0,l.jsx)("div",{children:(0,l.jsx)("b",{children:e("Confirm_Delete")})})}),(0,l.jsxs)(s.Modal.Footer,{children:[(0,l.jsx)(s.Button,{type:"secondary",content:e("Cancel"),onClick:()=>x(!1)}),(0,l.jsx)(s.Button,{type:"primary",content:e("PipelineDispatch_BtnSubmit"),onClick:()=>{x(!1),u()}})]})]})})]})}),(0,l.jsx)("div",{className:"col-3 col-sm-3 col-md-3 col-lg-2 col-xl-2",children:(0,l.jsxs)("div",{style:{float:"right",display:"inline-block",marginTop:"10px"},children:[S?(0,l.jsx)(s.Popup,{position:"bottom right",className:"popup-theme-wrap",element:(0,l.jsx)("div",{className:(t.add?"iconCircle ":"iconCircleDisable ")+"iconblock",onClick:w,children:(0,l.jsx)(s.Icon,{root:"common",name:"badge-plus",size:"small",color:"white"})}),on:"click",open:f,children:(0,l.jsx)("div",{onMouseLeave:()=>D(!1),children:(0,l.jsx)(n.TranslationConsumer,{children:e=>(0,l.jsx)(s.VerticalMenu,{children:(0,l.jsxs)(s.VerticalMenu,{children:[(0,l.jsx)(s.VerticalMenu.Header,{children:e("Common_Create")}),m.map((t=>(0,l.jsx)(s.VerticalMenu.Item,{onClick:()=>{return e=t.fieldName,D(!1),void h(e);var e},children:e(t.fieldValue)})))]})})})})}):"",y?(0,l.jsx)("div",{style:{marginLeft:"10px"},onClick:()=>{t.delete&&x(!0)},className:(t.delete?"iconCircle ":"iconCircleDisable ")+"iconblock",children:(0,l.jsx)(s.Icon,{root:"common",name:"delete",size:"small",color:"white"})}):""]})})]})}c.defaultProps={operationsVisibilty:{add:!1,delete:!1,shareholder:!1},breadcrumbItem:{itemName:"",itemCode:"",localizedKey:"",itemProps:{},parents:[],isComponent:!1},shareholders:[],selectedShareholder:"",popUpContent:[],shrVisible:!0,addVisible:!0,deleteVisible:!0};i(38726);function d(e){let{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:s,onShareholderChange:n,onDelete:r,onAdd:a,popUpContent:d,shrVisible:p,handleBreadCrumbClick:u,addVisible:h,deleteVisible:m}=e;return(0,l.jsx)(c,{operationsVisibilty:t,breadcrumbItem:i,shareholders:o,selectedShareholder:s,onShareholderChange:n,onDelete:r,onAdd:a,popUpContent:d,shrVisible:p,handleBreadCrumbClick:u,addVisible:h,deleteVisible:m})}},62900:(e,t,i)=>{"use strict";i.d(t,{A:()=>y});var o=i(65043),s=i(67907),n=i(72711),r=i(72067),a=i(69062),l=i(97508),c=i(44192),d=i(40854),p=i.n(d),u=i(53536),h=i.n(u),m=i(86111),C=i.n(m),g=i(70579);class S extends o.Component{constructor(){super(...arguments),this.state={isPasswordRequired:!1,Password:"",validationErrors:a.Th(c.Qh),authenticationResponse:"",btnAuthenticateEnabled:!0},this.onFieldChange=(e,t)=>{this.setState({Password:t});const i=h().cloneDeep(this.state.validationErrors);void 0!==c.Qh[e]&&(i[e]=a.jr(c.Qh[e],t),this.setState({validationErrors:i,authenticationResponse:""}))},this.validatePassword=e=>{this.setState({btnAuthenticateEnabled:!1});const t={...this.state.validationErrors};null!==e&&""!==e||(t.Password="UserValidationForm_ReqfldValPassword"),this.setState({validationErrors:t});var i=!0;return i&&(i=Object.values(t).every((function(e){return""===e}))),i},this.onCloseClick=()=>{this.setState({isPasswordRequired:!1,authenticationResponse:"",btnAuthenticateEnabled:!0},(()=>this.props.handleClose()))},this.AuthenticateUser=()=>{if(this.validatePassword(this.state.Password)){this.setState({authenticationResponse:""});try{var e=this.state.Password,t=this.props.Username,i=C().lib.WordArray.random(16),o=C().PBKDF2(t,i,{keySize:8,iterations:100}),s=C().lib.WordArray.random(16),n=C().AES.encrypt(e,o,{iv:s,padding:C().pad.Pkcs7,mode:C().mode.CBC}),l=i.toString()+s.toString()+n.toString();p()(r.KrY+"?encryptedPassword="+encodeURIComponent(l),a.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess&&"true"===t.EntityResult.toLowerCase()?(this.setState({isPasswordRequired:!1}),this.props.handleOperation()):this.setState({authenticationResponse:t.ErrorList[0],btnAuthenticateEnabled:!0})})).catch((e=>{this.setState({authenticationResponse:e,btnAuthenticateEnabled:!0})}))}catch(c){this.setState({authenticationResponse:c,btnAuthenticateEnabled:!0})}}else this.setState({btnAuthenticateEnabled:!0})}}componentDidMount(){try{this.IsPasswordRequired()}catch(e){console.log("BaseProductDetailsComposite:Error occured on componentDidMount",e)}}IsPasswordRequired(){try{let e=a.Hp(this.props.userDetails.EntityResult.roleFunctionInfo,this.props.functionName,this.props.functionGroup);this.setState({isPasswordRequired:e}),!1===e&&this.props.handleOperation()}catch(e){console.log("Error in IsPasswordRequired method:",e)}}render(){return(0,g.jsx)("div",{children:!0===this.state.isPasswordRequired?(0,g.jsx)(s.TranslationConsumer,{children:e=>(0,g.jsxs)(n.Modal,{open:!0,size:"mini",children:[(0,g.jsxs)(n.Modal.Content,{children:[(0,g.jsxs)("div",{className:"row",children:[(0,g.jsx)("div",{className:"col col-lg-8",style:{marginLeft:"10px"},children:(0,g.jsx)("h4",{children:e("User_Authentication")})}),(0,g.jsx)("div",{className:"col-12 col-lg-3",style:{textAlign:"right"},onClick:this.onCloseClick,children:(0,g.jsx)(n.Icon,{root:"common",name:"close"})})]}),(0,g.jsxs)("div",{style:{display:"flex",flexWrap:"wrap"},children:[(0,g.jsx)("div",{className:"col col-lg-12",children:(0,g.jsx)("label",{children:(0,g.jsxs)("h5",{children:[e("UserValidation_Form_AccountName"),":",this.props.Username]})})}),(0,g.jsx)("div",{className:"col col-lg-12",children:(0,g.jsx)(n.Input,{fluid:!0,type:"password",disablePasswordToggle:!1,value:this.state.Password,indicator:"required",onChange:e=>this.onFieldChange("Password",e),label:e("AccessCardInfo_x_Pwd"),error:e(this.state.validationErrors.Password),reserveSpace:!1})})]})]}),(0,g.jsxs)(n.Modal.Footer,{children:[(0,g.jsx)("span",{className:"ui error-message autherrormsg",children:e(this.state.authenticationResponse)}),(0,g.jsx)(n.Button,{type:"primary",disabled:!this.state.btnAuthenticateEnabled,content:e("UserValidationForm_Authentication"),onClick:this.AuthenticateUser})]})]})}):null})}}const y=(0,l.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(S)},19380:(e,t,i)=>{"use strict";i.d(t,{A:()=>f});var o=i(65043),s=i(728),n=i(62672),r=i(27976),a=i(44063),l=i(39078),c=i(48546),d=i(82967),p=i(11201),u=i(43439),h=(i(60663),i(48385)),m=i(72711),C=i(67907),g=i(65187),S=i(53536),y=(i(90837),i(70579));const R=e=>{const[t,i]=(0,o.useState)(null),[R]=(0,C.useTranslation)(),x=t=>new s.CollectionView(e.sourceData,{pageSize:t}),[f,D]=(0,o.useState)(x(e.rowsPerPage)),w=o.createRef(),j=o.createRef(),b=o.createRef(),P=o.createRef(),E=o.useRef(),T=o.useRef(e.selectionRequired?[]:null);let A=null;const v=t=>{try{if(I(),e.onRowClick&&t.addEventListener(t.hostElement,"click",(i=>{let o=t.hitTest(i);if(o.target.closest(".wj-cell")&&![...o.target.closest(".wj-cell").classList].includes("wj-group")&&o.cellType===n.CellType.Cell){const i=t.rows[o.row].dataItem;e.onRowClick(i)}})),t.selectionMode=s.asEnum("None",n.SelectionMode),t.select(-1,-1),i(t),e.selectionRequired){A=new p.Selector(t,{itemChecked:(i,o)=>{e.singleSelection&&t.rows.filter((e=>e.isSelected&&1===T.current.filter((t=>S.isEqual(t,e.dataItem))).length)).forEach((e=>{e.isSelected=!1})),e.onSelectionHandle(t.rows.filter((e=>e.isSelected)).map((e=>e.dataItem)))},showCheckAll:!e.singleSelection});let i=A.column.grid;A.column=i.rowHeaders.columns[0],i.headersVisibility=n.HeadersVisibility.All,i.selectionMode=s.asEnum("None",n.SelectionMode)}}catch(o){console.log("Error in gridInitialized: "+o)}};(0,o.useEffect)((()=>{try{if(null!=w){let e=w.current.control;j.current.control.grid=e}D(x(e.rowsPerPage))}catch(t){console.log("Error in grid update:",t)}}),[e.sourceData]),(0,o.useEffect)((()=>{try{t&&e.selectionRequired&&(T.current.length=0,T.current.push(...e.selectedItems),t.rows.forEach((t=>{1===e.selectedItems.filter((e=>S.isEqual(e,t.dataItem))).length?t.isSelected=!0:t.isSelected=!1})),t.refresh())}catch(i){console.log("Error in pre-selecting rows:",i)}}),[e.selectedItems]),(0,o.useEffect)((()=>{try{if(localStorage.getItem(e.parentComponent+"GridState")&&"null"!==localStorage.getItem(e.parentComponent+"GridState")&&t){let o=JSON.parse(localStorage.getItem(e.parentComponent+"GridState")),n=t;n.columns.forEach((e=>{let t=o.columns.filter((t=>t.binding===e.binding));e.visible=t.length>0?t[0].visible:e.visible})),b.current.control.filterDefinition=o.filterDefinition,n.collectionView.deferUpdate((()=>{n.collectionView.sortDescriptions.clear();for(let e=0;e<o.sortDescriptions.length;e++){let t=o.sortDescriptions[e];n.collectionView.sortDescriptions.push(new s.SortDescription(t.property,t.ascending))}}));for(let e=0;e<o.groupDescriptions.length;e++)n.collectionView.groupDescriptions.push(new s.PropertyGroupDescription(o.groupDescriptions[e])),n.columns.filter((t=>t.binding===o.groupDescriptions[e]))[0].visible=!1;if(sessionStorage.getItem(e.parentComponent+"GridState")&&"null"!==sessionStorage.getItem(e.parentComponent+"GridState")){let t=JSON.parse(sessionStorage.getItem(e.parentComponent+"GridState"));n.collectionView.moveToPage(n.collectionView.pageCount-1>=t.pageIndex?t.pageIndex:n.collectionView.pageCount-1),j&&(j.current.control.text=t.searchText)}i(n),t.refresh()}}catch(o){console.log("Error in restoring local storage settings: ",o)}}),[f]),(0,o.useEffect)((()=>{try{t&&E.current&&e.columnPickerRequired&&(E.current.itemsSource=t.columns,E.current.checkedMemberPath="visible",E.current.displayMemberPath="header",E.current.lostFocus.addHandler((()=>{(0,s.hidePopup)(E.current.hostElement)})))}catch(i){console.log("Error in initializing column picker properties:",i)}}),[E.current]),(0,o.useEffect)((()=>()=>{e.columnPickerRequired&&E.current&&(0,s.hidePopup)(E.current.hostElement)}),[]);const N=()=>{try{let o=t;o.itemsSource.pageSize=e.sourceData.length,i(o),u.FlexGridXlsxConverter.saveAsync(t,{includeColumnHeaders:!0,includeCellStyles:!1,formatItem:null},e.exportFileName),o.itemsSource.pageSize=e.rowsPerPage,i(o)}catch(o){console.log("Error in export grid to excel:",o)}},k=(t,i)=>{if(void 0!==i&&null!==i){if("boolean"===typeof t||"Active"===i.Name)return t?(0,y.jsx)(m.Icon,{name:"check",size:"small",color:"green"}):(0,y.jsx)(m.Icon,{name:"close",size:"small",color:"red"});if(""===t||null===t||void 0===t)return t;if(("TerminalCodes"===i.Name||"1"===i.PopOver)&&null!==t)return(o=t).split(",").length>e.terminalsToShow?(0,y.jsx)(m.Popup,{className:"popup-theme-wrap",on:"hover",element:o.split(",").length,children:(0,y.jsx)(m.Card,{children:(0,y.jsx)(m.Card.Content,{children:o})})}):o;if(void 0!==i.DataType&&"DateTime"===i.DataType)return new Date(t).toLocaleDateString()+" "+new Date(t).toLocaleTimeString();if(void 0!==i.DataType&&"Date"===i.DataType)return new Date(t).toLocaleDateString();if(void 0!==i.DataType&&"Time"===i.DataType)return new Date(t).toLocaleTimeString()}var o;return t},F=()=>{try{if(t&&b.current){let i={columns:t.columns.map((e=>({binding:e.binding,visible:e.visible}))),filterDefinition:b.current.control.filterDefinition,sortDescriptions:t.collectionView.sortDescriptions.map((e=>({property:e.property,ascending:e.ascending}))),groupDescriptions:t.collectionView.groupDescriptions.map((e=>e.propertyName?e.propertyName:null))};if(t.collectionView.groupDescriptions&&t.collectionView.groupDescriptions.length>0){[...document.getElementsByClassName("wj-column-selector-group")].forEach((e=>{e.parentNode.parentNode.classList.add("wj-grouped-checkbox")}))}let o={pageIndex:t.collectionView.pageIndex,searchText:j.current.control.text};localStorage.setItem(e.parentComponent+"GridState",JSON.stringify(i)),sessionStorage.setItem(e.parentComponent+"GridState",JSON.stringify(o))}}catch(i){console.log("Error in saving grid state")}},I=()=>{let e=s.culture.FlexGridFilter,t=l.Operator;s.culture.FlexGridFilter.header=R("WijmoGridFilterHeader"),s.culture.FlexGridFilter.ascending="\u2191 "+R("WijmoGridFilterAscending"),s.culture.FlexGridFilter.descending="\u2193 "+R("WijmoGridFilterDescending"),s.culture.FlexGridFilter.apply=R("RoleAdminEdit_Apply"),s.culture.FlexGridFilter.clear=R("OrderCreate_btnClear"),s.culture.FlexGridFilter.conditions=R("WijmoGridFilterCondition"),s.culture.FlexGridFilter.values=R("WijmoGridFilterValue"),s.culture.FlexGridFilter.search=R("LoadingDetailsView_SearchGrid"),s.culture.FlexGridFilter.selectAll=R("WijmoGridFilterSelectAll"),s.culture.FlexGridFilter.and=R("WijmoGridFilterAnd"),s.culture.FlexGridFilter.or=R("WijmoGridFilterOr"),s.culture.FlexGridFilter.cancel=R("AccessCardInfo_Cancel"),e.stringOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE},{name:R("WijmoGridFilterBeginsWith"),op:t.BW},{name:R("WijmoGridFilterEndsWith"),op:t.EW},{name:R("WijmoGridFilterContains"),op:t.CT},{name:R("WijmoGridFilterDoesNotContain"),op:t.NC}],e.numberOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE},{name:R("WijmoGridFilterGreaterThan"),op:t.GT},{name:R("WijmoGridFilterLessThan"),op:t.LT},{name:R("WijmoGridFilterGreaterThanOrEqual"),op:t.GE},{name:R("WijmoGridFilterLessThanOrEqual"),op:t.LE}],e.dateOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterDateEarlierThan"),op:t.LT},{name:R("WijmoGridFilterDateLaterThan"),op:t.GT}],e.booleanOperators=[{name:R("WijmoGridFilterUnset"),op:null},{name:R("WijmoGridFilterEqual"),op:t.EQ},{name:R("WijmoGridFilterNotEqual"),op:t.NE}]},V=e=>{try{if(window.screen.width<1024&&e.WidthPx&&""!==e.WidthPx)return parseInt(e.WidthPx)}catch(t){console.log("Error in width:",t)}return e.WidthPercentage.includes("*")?e.WidthPercentage:parseInt(e.WidthPercentage)};return(0,y.jsx)("div",{className:"pl-1",children:(0,y.jsx)(g.A,{children:(0,y.jsx)(C.TranslationConsumer,{children:i=>(0,y.jsxs)(o.Fragment,{children:[(0,y.jsxs)("div",{className:"row pl-0",children:[(0,y.jsx)("div",{className:"col-10 col-sm-12 col-md-5 col-lg-6",children:(0,y.jsx)(c.q,{class:"ui single-input",ref:j,placeholder:i("LoadingDetailsView_SearchGrid")})}),(0,y.jsx)("div",{className:"col-10 col-sm-12 col-md-7 col-lg-6",children:(0,y.jsxs)("div",{style:{float:"right"},children:[e.columnPickerRequired?(0,y.jsxs)(m.Button,{id:"colPicker",actionType:"button",type:"primary",onClick:e=>(e=>{try{let i=E.current.hostElement;i.offsetHeight?((0,s.hidePopup)(i,!0,!0),t.focus()):((0,s.showPopup)(i,e.target,s.PopupPosition.Below,!0,!1),E.current.focus()),E.current.focus(),e.preventDefault()}catch(i){console.log("Error in Column Picker click event:",i)}})(e),children:[(0,y.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridColumnPicker")}),(0,y.jsx)("div",{style:{display:"inline-block"},children:(0,y.jsx)(m.Icon,{name:"caret-down",className:"btnIcon",size:"small"})})]}):null,e.exportRequired?(0,y.jsxs)(m.Button,{actionType:"button",type:"primary",className:"mt-3 mt-md-0",onClick:N,children:[(0,y.jsx)("div",{style:{display:"inline-block"},children:i("WijmoGridExport")}),(0,y.jsx)("div",{style:{display:"inline-block",marginLeft:"0.2rem"},children:(0,y.jsx)("span",{className:"icon-Xls",style:{fontSize:"17px",position:"absolute",top:"3px"}})})]}):null]})})]}),(0,y.jsxs)("div",{className:"tableScroll",children:[e.columnGroupingRequired?(0,y.jsx)(h.u,{className:"group-panel",grid:t,placeholder:i("WijmoGridGroupPanelPlaceholder")}):null,(0,y.jsx)(g.A,{children:(0,y.jsxs)(r.MC,{ref:w,autoGenerateColumns:!1,alternatingRowStep:0,autoRowHeights:!0,headersVisibility:"Column",itemsSource:f,selectionMode:s.asEnum("None",n.SelectionMode),initialized:v,virtualizationThreshold:[0,1e4],onUpdatedView:F,children:[(0,y.jsx)(a.M,{ref:b}),e.columns.map((t=>(0,y.jsx)(r.aK,{header:i(t.Name),binding:t.Name,width:V(t),minWidth:100,isReadOnly:!0,wordWrap:!0,align:"left",children:(0,y.jsx)(r.Gw,{cellType:"Cell",template:i=>(0,y.jsx)("span",{style:null!=e.conditionalRowStyleCheck&&e.conditionalRowStyleCheck(i.item)?{...e.conditionalRowStyles}:null,children:k(i.item[t.Name],t)})})},t.Name)))]})}),e.columnPickerRequired?(0,y.jsx)("div",{className:"column-picker-div",children:(0,y.jsx)(d.qF,{className:"column-picker",initialized:t=>(t=>{e.columnPickerRequired&&(E.current=t)})(t)})}):null]}),(0,y.jsx)("div",{className:"row",children:(0,y.jsx)(d.Ne,{ref:P,className:"ml-auto mr-auto mt-3",headerFormat:i("WijmoGridPagingTemplate"),byPage:!0,cv:f})})]})})})})};R.defaultProps={sourceData:[],columns:[],exportRequired:!0,exportFileName:"Grid.xlsx",selectionRequired:!1,columnPickerRequired:!1,columnGroupingRequired:!1,rowsPerPage:10,terminalsToShow:2,singleSelection:!1,selectedItems:[]};const x=R,f=e=>(0,y.jsx)(x,{sourceData:e.data,columns:e.columns,exportRequired:e.exportRequired,exportFileName:e.exportFileName,columnPickerRequired:e.columnPickerRequired,selectionRequired:e.selectionRequired,columnGroupingRequired:e.columnGroupingRequired,conditionalRowStyleCheck:e.conditionalRowStyleCheck,conditionalRowStyles:e.conditionalRowStyles,rowsPerPage:e.rowsPerPage,onSelectionHandle:e.onSelectionHandle,onRowClick:e.onRowClick,parentComponent:e.parentComponent,terminalsToShow:e.terminalsToShow,singleSelection:e.singleSelection,selectedItems:e.selectedItems})},47238:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>b});var o=i(65043),s=i(97508),n=(i(7523),i(65187)),r=i(66554),a=i(95745),l=i(19380),c=i(70579);function d(e){let{tableData:t,columnDetails:i,pageSize:o,exportRequired:s,exportFileName:n,columnPickerRequired:r,columnGroupingRequired:a,selectionRequired:d,onSelectionChange:p,onRowClick:u,parentComponent:h}=e;return(0,c.jsx)(l.A,{data:t,columns:i,rowsPerPage:o,exportRequired:s,exportFileName:n,columnPickerRequired:r,columnGroupingRequired:a,selectionRequired:d,onSelectionHandle:p,onRowClick:u,parentComponent:h})}var p=i(40252),u=i(62900),h=i(80312),m=i(14159),C=(i(92342),i(93779)),g=i(72067),S=i(69062),y=i(11981),R=i(40854),x=i.n(R),f=i(53536),D=i.n(f),w=i(15821);class j extends o.Component{constructor(){super(...arguments),this.state={isDetails:"false",isReadyToRender:!1,isDetailsModified:"false",operationsVisibilty:{add:!1,delete:!1},selectedRow:{},selectedItems:[],data:{},showAuthenticationLayout:!1,isEnable:!0},this.handleAdd=()=>{try{var{operationsVisibilty:e}={...this.state};e.delete=!1,e.add=!1,this.setState({isDetails:"true",selectedRow:{},operationsVisibilty:e})}catch(t){console.log("COATemplateComposite:Error occured on handleAdd",t)}},this.handleDelete=()=>{try{var{operationsVisibilty:e}={...this.state};e.delete=!1,this.setState({operationsVisibilty:e});for(var t=[],i=0;i<this.state.selectedItems.length;i++){var o=this.state.selectedItems[i].COATemplateCode,s={keyDataCode:i,KeyCodes:[{Key:C.$L,Value:o}]};t.push(s)}x()(g.zzM,S.tW(t,this.props.tokenDetails.tokenInfo)).then((t=>{var i=t.data,o=i.isSuccess;null!==i.ResultDataList&&void 0!==i.ResultDataList&&(o=i.ResultDataList.filter((function(e){return!e.IsSuccess})).length!==i.ResultDataList.length);var s=S.Cy(i,"COATemplateDetails_DeletionStatus",["COATemplateCode"]);o?(this.setState({isReadyToRender:!1,showAuthenticationLayout:!1}),this.getcoaTemplateList(),e.delete=!1,this.setState({selectedItems:[],operationsVisibilty:e,selectedRow:{},showAuthenticationLayout:!1})):(e.delete=!0,this.setState({operationsVisibilty:e,showAuthenticationLayout:!1})),s.messageResultDetails.forEach((e=>{e.keyFields.length>0&&(e.keyFields[0]="COATemplateCode")})),(0,m.toast)((0,c.jsx)(n.A,{children:(0,c.jsx)(y.A,{notificationMessage:s})}),{autoClose:"success"===s.messageType&&1e4})})).catch((e=>{throw e}))}catch(r){console.log("COATemplateComposite:Error occured on handleDelete",r)}},this.handleBack=()=>{try{var{operationsVisibilty:e}={...this.state};e.add=S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.add,h._S),e.delete=!1,this.setState({isDetails:"false",selectedRow:{},selectedItems:[],operationsVisibilty:e,isReadyToRender:!1}),this.getcoaTemplateList()}catch(t){console.log("COATemplateComposite:Error occured on Back click",t)}},this.handleRowClick=e=>{try{var{operationsVisibilty:t}={...this.state};t.add=S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.add,h._S),t.delete=S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.remove,h._S),this.setState({isDetails:"true",selectedRow:e,selectedItems:[e],operationsVisibilty:t})}catch(i){console.log("COATemplateComposite:Error occured on handleRowClick",i)}},this.handleSelection=e=>{try{var{operationsVisibilty:t}={...this.state};t.delete=e.length>0&&S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.remove,h._S),this.setState({selectedItems:e,operationsVisibilty:t})}catch(i){console.log("COATemplateComposite:Error occured on handleSelection",i)}},this.savedEvent=(e,t,i)=>{try{var{operationsVisibilty:o}={...this.state};if("success"===i.messageType&&(o.add=S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.add,h._S),o.delete=S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.remove,h._S),this.setState({isDetailsModified:"true",operationsVisibilty:o})),"success"===i.messageType&&"add"===t){var s=[{COATemplateCode:e.COATemplateCode}];this.setState({selectedItems:s})}(0,m.toast)((0,c.jsx)(n.A,{children:(0,c.jsx)(y.A,{notificationMessage:i})}),{autoClose:"success"===i.messageType&&1e4})}catch(r){console.log("COATemplateComposite:Error occured on savedEvent",r)}},this.componentWillUnmount=()=>{this.clearStorage(),window.removeEventListener("beforeunload",this.clearStorage)},this.clearStorage=()=>{sessionStorage.removeItem(this.componentName+"GridState")},this.authenticateDelete=()=>{try{let e=!0!==this.props.userDetails.EntityResult.IsWebPortalUser;this.setState({showAuthenticationLayout:e}),!1===e&&this.handleDelete()}catch(e){console.log("COATemplateComposite : Error in authenticateDelete")}},this.handleAuthenticationClose=()=>{this.setState({showAuthenticationLayout:!1})}}getcoaTemplateList(){x()(g.LbD,S.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{var t=e.data;!0===t.IsSuccess?this.setState({data:t.EntityResult,isReadyToRender:!0}):(this.setState({data:[],isReadyToRender:!0}),console.log("Error in GetCOATemplateListForRole:",t.ErrorList))})).catch((e=>{this.setState({data:[],isReadyToRender:!0}),console.log("Error while getting COATemplate List:",e)}))}componentDidMount(){try{S.pJ(this.props.userDetails.EntityResult.IsArchived),this.getLookUpData()}catch(e){console.log("COATemplateComposite:Error occured on ComponentDidMount",e)}window.addEventListener("beforeunload",this.clearStorage)}getLookUpData(){x()(g.xAA+"?LookUpTypeCode=COA",S.Jm(this.props.tokenDetails.tokenInfo)).then((e=>{const t=e.data;if(!0===t.IsSuccess){let e="TRUE"===t.EntityResult.COAEnable.toUpperCase();if(this.setState({lookUpData:t.EntityResult,isEnable:e}),e){const e=D().cloneDeep(this.state.operationsVisibilty);e.add=S.ab(this.props.userDetails.EntityResult.FunctionsList,h.i.add,h._S),this.setState({operationsVisibilty:e}),this.getcoaTemplateList()}}else console.log("Error in getLookUpData: ",t.ErrorList)})).catch((e=>{console.log("COATemplateComposite: Error occurred on getLookUpData",e)}))}render(){return(0,c.jsxs)("div",{children:[(0,c.jsx)(n.A,{children:(0,c.jsx)(r.$,{operationsVisibilty:this.state.operationsVisibilty,breadcrumbItem:this.props.activeItem,onDelete:this.authenticateDelete,onAdd:this.handleAdd,handleBreadCrumbClick:this.props.handleBreadCrumbClick,shrVisible:!1})}),"true"===this.state.isDetails?(0,c.jsx)(n.A,{children:(0,c.jsx)(a.default,{selectedRow:this.state.selectedRow,onBack:this.handleBack,onSaved:this.savedEvent,genericProps:this.props.activeItem.itemProps},"COATemplateDetails")}):this.state.isReadyToRender?(0,c.jsx)("div",{children:(0,c.jsx)(n.A,{children:(0,c.jsx)(d,{tableData:this.state.data.Table,columnDetails:this.state.data.Column,pageSize:this.props.userDetails.EntityResult.PageAttibutes.WebPortalListPageSize,exportRequired:!0,exportFileName:"COATemplateList",columnPickerRequired:!0,selectionRequired:!0,columnGroupingRequired:!0,onRowClick:this.handleRowClick,onSelectionChange:this.handleSelection,parentComponent:this.componentName})})}):(0,c.jsx)(c.Fragment,{children:this.state.isEnable?(0,c.jsx)(p.A,{loadingClass:"Loading"}):(0,c.jsx)(w.default,{errorMessage:"COADisabled"})}),this.state.showAuthenticationLayout?(0,c.jsx)(u.A,{Username:this.props.userDetails.EntityResult.UserName,functionName:h.i.remove,functionGroup:h._S,handleClose:this.handleAuthenticationClose,handleOperation:this.handleDelete}):null,(0,c.jsx)(n.A,{children:(0,c.jsx)(m.ToastContainer,{hideProgressBar:!0,closeOnClick:!1,closeButton:!0,newestOnTop:!0,position:"bottom-right",toastClassName:"toast-notification-wrap"})})]})}}const b=(0,s.Ng)((e=>({userDetails:e.getUserDetails.userDetails,tokenDetails:e.getUserDetails.TokenAuth})))(j)},80312:(e,t,i)=>{"use strict";i.d(t,{$3:()=>z,$H:()=>oe,$J:()=>he,$K:()=>Ce,$V:()=>Et,$b:()=>xt,$p:()=>q,AE:()=>j,Al:()=>M,B2:()=>ot,By:()=>jt,CW:()=>Ct,DA:()=>l,Ee:()=>We,FO:()=>v,Fy:()=>Ve,G9:()=>it,H8:()=>ee,Hq:()=>at,Ig:()=>I,Iu:()=>S,JI:()=>ct,JJ:()=>te,JU:()=>Q,Jz:()=>Qe,KQ:()=>re,Kk:()=>Xe,Kw:()=>et,LP:()=>At,LR:()=>d,Lg:()=>$,Mg:()=>xe,Mm:()=>V,N1:()=>Y,Nm:()=>m,No:()=>ce,Ow:()=>B,P2:()=>n,P8:()=>ye,PD:()=>Ne,PE:()=>p,PG:()=>K,PP:()=>ht,Pb:()=>Fe,QB:()=>f,QC:()=>X,RE:()=>nt,RO:()=>$e,Rc:()=>St,Rl:()=>ft,Rx:()=>gt,TI:()=>y,Tm:()=>me,Ug:()=>Z,Ur:()=>Ue,V9:()=>c,VK:()=>U,VL:()=>ue,VQ:()=>ae,WD:()=>Ge,Wf:()=>E,YO:()=>k,YY:()=>ve,Yb:()=>ge,Yg:()=>ze,Z9:()=>ut,ZE:()=>dt,ZU:()=>x,_N:()=>yt,_S:()=>Tt,_d:()=>vt,aS:()=>W,aZ:()=>pt,au:()=>we,b0:()=>Pt,bL:()=>Me,c2:()=>Oe,d4:()=>Ie,dB:()=>g,dD:()=>qe,dK:()=>_,dY:()=>N,de:()=>u,dv:()=>Te,eQ:()=>a,f3:()=>fe,fF:()=>G,fL:()=>Rt,fN:()=>wt,fk:()=>T,fl:()=>Se,fr:()=>D,go:()=>s,h:()=>pe,hD:()=>P,hE:()=>A,hh:()=>Ze,hk:()=>ne,hz:()=>mt,i:()=>o,j2:()=>rt,jN:()=>H,je:()=>C,jx:()=>O,kL:()=>Ye,ke:()=>Be,km:()=>le,l0:()=>se,l6:()=>_e,lz:()=>F,m0:()=>R,nS:()=>be,nk:()=>lt,nn:()=>w,np:()=>J,oh:()=>st,op:()=>Ke,pt:()=>Le,qk:()=>de,qp:()=>Re,r6:()=>Pe,rQ:()=>Ee,rj:()=>L,rp:()=>r,t3:()=>Dt,tM:()=>ke,to:()=>kt,ts:()=>tt,uH:()=>De,uy:()=>Je,w1:()=>Ae,x5:()=>ie,xz:()=>b,y_:()=>He,yu:()=>h,yx:()=>bt,z8:()=>je,z_:()=>Nt});const o={view:"view",add:"add",modify:"modify",remove:"remove"},s="carriercompany",n="driver",r="customer",a="trailer",l="originterminal",c="destination",d="primemover",p="vehicle",u="shipmentbycompartment",h="shipmentbyproduct",m="ViewShipmentStatus",C="vessel",g="order",S="OrderForceClose",y="contract",R="receiptplanbycompartment",x="ViewMarineShipment",f="MarineShipmentByCompartment",D="ViewMarineReceipt",w="supplier",j="finishedproduct",b="RailDispatch",P="RailReceipt",E="RailRoute",T="RailWagon",A="CloseRailDispatch",v="PrintRailBOL",N="PrintRailFAN",k="RailDispatchLoadSpotAssignment",F="RailDispatchProductAssignment",I="ViewRailDispatch",V="ViewRailLoadingDetails",G="CloseRailReceipt",L="PrintRailBOD",O="PrintRailRAN",M="ViewRailReceipt",q="ViewRailUnLoadingDetails",W="SMS",B="UnAccountedTransactionTank",U="UnAccountedTransactionMeter",_="PipelineDispatch",z="PipelineReceipt",H="PipelineDispatchManualEntry",Q="PipelineReceiptManualEntry",K="LookUpData",J="HSEInspection",$="HSEInspectionConfig",Y="Email",X="Shareholder",Z="LocationConfig",ee="DeviceConfig",te="baseproduct",ie="SiteView",oe="LeakageManualEntry",se="Terminal",ne="SlotInformation",re="TankGroup",ae="Tank",le="SealMaster",ce="TankEODEntry",de="UnmatchedLocalTransactions",pe="AccessCard",ue="ResetPin",he="SlotConfiguration",me="PrintMarineFAN",Ce="PrintMarineBOL",ge="ViewMarineLoadingDetails",Se="ViewMarineShipmentAuditTrail",ye="CloseMarineShipment",Re="IssueCard",xe="ActivateCard",fe="RevokeCard",De="AutoIDAssociation",we="MarineReceiptByCompartment",je="PrintMarineRAN",be="PrintMarineBOD",Pe="ViewMarineUnloadingDetails",Ee="ViewMarineReceiptAuditTrail",Te="CloseMarineReceipt",Ae="WeekendConfig",ve="EODAdmin",Ne="PrintBOL",ke="PrintFAN",Fe="PrintBOD",Ie="CloseShipment",Ve="CloseReceipt",Ge="CONTRACTFORCECLOSE",Le="Captain",Oe="OverrideShipmentSequence",Me="KPIInformation",qe="Language",We="WebPortalUserMap",Be="BayGroup",Ue="PipelineHeaderSiteView",_e="TankMonitor",ze="PersonAdmin",He="ProductReconciliationReports",Qe="ReportConfiguration",Ke="EXECONFIGURATION",Je="ShareholderAllocation",$e="NotificationGroup",Ye="NotificationRestriction",Xe="NotificationConfig",Ze="AllowWeighBridgeManualEntry",et="ProductAllocation",tt="MasterDeviceConfiguration",it="ShareholderAgreement",ot="TANKSHAREHOLDERPRIMEFUNCTION",st="ROLEADMIN",nt="ShiftConfig",rt="PrinterConfiguration",at="CustomerAgreement",lt="BaySCADAConfiguration",ct="RailReceiptUnloadSpotAssignment",dt="STAFF_VISITOR",pt="PipelineMeterSiteView",ut="RailSiteView",ht="MarineSiteView",mt="LoadingDetails",Ct="UnloadingDetails",gt="RoadHSEInspection",St="RoadHSEInspectionConfig",yt="MarineHSEInspection",Rt="MarineHSEInspectionConfig",xt="RailHSEInspection",ft="RailHSEInspectionConfig",Dt="PipelineHSEInspection",wt="PipelineHSEInspectionConfig",jt="PrintRAN",bt="ViewReceiptStatus",Pt="customerrecipe",Et="COAParameter",Tt="COATemplate",At="COAManagement",vt="COACustomer",Nt="COAAssignment",kt="ProductForecastConfiguration"},93779:(e,t,i)=>{"use strict";i.d(t,{$A:()=>N,$L:()=>lt,$Q:()=>qe,Ae:()=>Ae,BX:()=>ne,Bl:()=>me,Bv:()=>Se,Bw:()=>X,Cb:()=>A,Cg:()=>E,DN:()=>nt,D_:()=>rt,Dm:()=>k,E7:()=>J,EW:()=>I,FN:()=>se,FR:()=>n,FY:()=>mt,GA:()=>We,GT:()=>x,Ge:()=>Fe,HB:()=>re,JQ:()=>K,KJ:()=>ee,Kz:()=>_,Ln:()=>U,M$:()=>Ue,O5:()=>tt,Of:()=>fe,Oo:()=>it,Pk:()=>ge,Pm:()=>Y,Q5:()=>ct,QK:()=>_e,QV:()=>Xe,QZ:()=>dt,Qu:()=>ie,RX:()=>Ee,Rb:()=>W,Rp:()=>w,SP:()=>C,T5:()=>Ge,UB:()=>y,UT:()=>l,Ui:()=>H,VA:()=>q,Vk:()=>we,Wb:()=>je,Wv:()=>De,X3:()=>Ke,Y4:()=>B,Yl:()=>ot,Zx:()=>$,_B:()=>ye,_C:()=>T,_R:()=>Ce,_j:()=>de,_n:()=>o,aM:()=>G,aW:()=>Me,bW:()=>M,c4:()=>st,cD:()=>a,c_:()=>b,cx:()=>O,dL:()=>pt,eE:()=>le,eS:()=>He,eT:()=>D,f:()=>F,f7:()=>he,fR:()=>pe,g1:()=>ce,gN:()=>Je,gO:()=>z,iH:()=>at,ij:()=>et,j1:()=>P,jC:()=>Re,je:()=>ue,jz:()=>ae,ll:()=>Ze,mM:()=>R,mO:()=>ht,mW:()=>Ve,ml:()=>g,mm:()=>Ye,nB:()=>te,nT:()=>Ie,np:()=>ke,oA:()=>j,oG:()=>Qe,oV:()=>Z,ok:()=>p,oy:()=>c,pL:()=>ve,pe:()=>Be,pw:()=>ze,qF:()=>r,qQ:()=>ut,qp:()=>u,s0:()=>f,sA:()=>Te,st:()=>oe,tY:()=>V,uw:()=>Q,v6:()=>s,vL:()=>Le,vf:()=>Ne,wH:()=>$e,wO:()=>xe,wX:()=>L,x4:()=>be,xf:()=>h,xy:()=>d,yI:()=>S,yV:()=>v,yz:()=>m,zL:()=>Pe,zf:()=>Oe});const o="CarrierCode",s="TransportationType",n="ShareHolderCode",r="DriverCode",a="CustomerCode",l="TrailerCode",c="OriginTerminalCode",d="PrimeMoverCode",p="VehicleCode",u="DestinationCode",h="FinishedProductCode",m="ShipmentCode",C="OrderCode",g="ReceiptCode",S="MarineDispatchCode",y="MarineReceiptCode",R="SupplierCode",x="ContractCode",f="RailDispatchCode",D="RailReceiptCode",w="RailRouteCode",j="WagonCode",b="CompartmentCode",P="SMSConfigurationCode",E="PipelineDispatchCode",T="PipelineReceiptCode",A="EmailConfigurationCode",v="BaseProductCode",N="LocationCode",k="SiteViewType",F="EntityCode",I="EntityType",V="CardReaderCode",G="AccessCardCode",L="BcuCode",O="DeuCode",M="WeighBridgeCode",q="Weight",W="OutOfToleranceAllowed",B="LoadingArmCode",U="TransportationType",_="BayCode",z="TransactionNumber",H="BatchNumber",Q="TerminalCode",K="TankGroupCode",J="TankCode",$="MeterCode",Y="ShipmentType",X="ShipmentStatus",Z="MeterLineType",ee="DispatchCode",te="ReceiptStatus",ie="FPTransactionID",oe="ProductCategoryType",se="Reason",ne="SealMasterCode",re="Reason",ae="OperationName",le="FPTransactionID",ce="ProductCategoryType",de="CompartmentSeqNoInVehicle",pe="AdjustedPlanQuantity",ue="ForceComplete",he="DispatchStatus",me="HolidayDate",Ce="ActionID",ge="EODTimePrev",Se="TerminalAction",ye="EODTime",Re="MonthStartDay",xe="CaptainCode",fe="GeneralTMUserType",De="GeneralTMUserCode",we="IsPriority",je="ActualTerminalCode",be="ShipmentBondNo",Pe="ReceiptBondNo",Ee="DeviceType",Te="DeviceCode",Ae="BayGroup",ve="PipelineHeaderCode",Ne="ExchangePartner",ke="PersonID",Fe="UserName",Ie="PipelinePlanCode",Ve="PipelinePlanType",Ge="ChannelCode",Le="ProcessName",Oe="ReconciliationCode",Me="NotificationGroupCode",qe="NotificationGroupStatus",We="NotificationGroupDesc",Be="NotificationResSource",Ue="NotificationResMsgCode",_e="NotificationOrigResSource",ze="NotificationOrigResMsgCode",He="NotificationMessageCode",Qe="PositionType",Ke="ExchangeAgreementCode",Je="ProductTransferAgreementCode",$e="ShareholderAgreementStatus",Ye="RequestorShareholder",Xe="LenderShareholder",Ze="RequestCode",et="TransferReferenceCode",tt="ShiftID",it="ShiftName",ot="PrinterName",st="LocationType",nt="ForceClosureReason",rt="TransactionType",at="CustomerRecipeCode",lt="COATemplateCode",ct="COAManagementCode",dt="COAParameterCode",pt="COAManagementFinishedProductCode",ut="COASeqNumber",ht="ForecastDate",mt="ForecastTanks"},50477:()=>{}}]);
//# sourceMappingURL=4844.1a2c309f.chunk.js.map