import React, { Component, lazy } from "react";
import { SidebarLayout, Header, Footer, Tooltip, Icon } from "@scuf/common";
import "@scuf/common/honeywell-compact-combined/theme.css";

import "@scuf/datatable/honeywell-compact-combined/theme.css";
// import "@scuf/charts/honeywell-compact-combined/theme.css";
import axios from "axios";
import * as RestAPIs from "../JS/RestApis";
import * as appThemeActions from "../Redux/Actions/AppTheme"
import { toggleTheme, ThemeType } from "@scuf/common";
import { TranslationConsumer, LocalizationConfig } from "@scuf/localization";
import { connect } from "react-redux";
import ErrorBoundary from "./ErrorBoundary";
import { getAuthenticationObjectforGet } from "../JS/Utilities";
import { LoadingPage } from "./UIBase/Common/LoadingPage";
import "../CSS/iconStyles.css";
import "../CSS/bootStrapGrid.css";
import "../CSS/darkTheme.css";
import "../CSS/lightTheme.css";
import "../CSS/styles.css";

const runtimeConfig = window["runConfig"];
const termsConditionURL = runtimeConfig.termsConditionURL;
const privacyPolicyURL = runtimeConfig.privacyPolicyURL;
const homePage = runtimeConfig.defaultHomePage;
const driverHomePage = runtimeConfig.driverHomePage;

let EntityComponent = null;
//import Loadable from "react-loadable";
//import Home from "./Base/Home";
//let iconMargin = 0;
const UserProfile = Header.UserProfile;
const Sidebar = SidebarLayout.Sidebar;

var menuItems = [];
class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {},

      collapsed: this.props.collapsed,
      activeItem: homePage,
      // activeItem: {
      //   itemName: "Home",
      //   itemCode: "Home",
      //   localizedKey: "Home",
      //   itemProps: {},
      //   parents: [],
      //   isComponent: "false",
      // },

      //checked: false,
      expand: [],
      selectedParents: [],
      expandWithChilds: [],
      menu: [],
      //   {
      //     itemCode: "TruckMoT",
      //     itemName: "TruckMoT",
      //     subMenu: [
      //       {
      //         itemCode: "Truck Carrier Details",
      //         itemName: "Carrier Details",
      //         subMenu: [
      //           { itemCode: "TruckCarrierCompany", itemName: "CarrierCompany" },
      //           { itemCode: "Drivers", itemName: "Drivers" },
      //         ],
      //       },
      //       { itemCode: "Transactions", itemName: "Transactions" },
      //     ],
      //   },
      //   {
      //     itemCode: "MarineMoT",
      //     itemName: "MarineMoT",
      //     subMenu: [
      //       {
      //         itemCode: "Marine Carrier Details",
      //         itemName: "Carrier Details",
      //         subMenu: [
      //           {
      //             itemCode: "MarineCarrierCompany",
      //             itemName: "CarrierCompany",
      //           },
      //           { itemCode: "Vessel", itemName: "Vessel" },
      //         ],
      //       },
      //       { itemCode: "Transactions", itemName: "Transactions" },
      //     ],
      //   },
      // ],
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleSubmenuClick = this.handleSubmenuClick.bind(this);
    this.handlethemeChange = this.handlethemeChange.bind(this);
  }

  componentDidMount() {
    let theme = this.props.theme;
    let tempTheme = localStorage.getItem("Theme");
    try {
      if (tempTheme !== null) {
        theme = isNaN(parseInt(tempTheme))
          ? ThemeType.Light
          : parseInt(tempTheme);
      } else {
        theme = ThemeType.Light;
      }
    } catch (error) {
      console("Unable to identiyfy theme.Settinag as light", error);
    }
    this.props.setTheme({ theme: theme });

    axios(
      RestAPIs.GetMasterPageMenu,
      getAuthenticationObjectforGet(this.props.tokenDetails.tokenInfo)
    )
      .then((response) => {
        var data = response.data;
        var menuJson = data.EntityResult;
        var isSuccess = JSON.parse(data.IsSuccess);
        //console.log("isSuccess-", isSuccess);
        if (isSuccess === true) {
          this.setState({ menu: menuJson }, this.updateMenu);
          //console.log(menuJson);
        } else {
          console.log("Error in GetMenuListForRole:", data.ErrorList);
        }

        //this.setState({ menu: json.menu},()=>this.updateMenu)
      })
      .catch((error) => {
        console.log("Error in GetMenuListForRole API:", error);
      });
    // this.state.menu.map((sidemenu) => this.BuildMenuItems(sidemenu, []));

    const user = this.props.userDetails.EntityResult;
    let isDriverRole = user != undefined && user.RoleName == "Driver";
    if (isDriverRole) {
      EntityComponent = lazy(() =>
        import("./Composite/Entity/" + driverHomePage.itemName + "Composite.jsx")
      );
      this.setState({ activeItem: driverHomePage });
    } else {
      EntityComponent = lazy(() =>
        import("./Composite/Entity/" + homePage.itemName + "Composite.jsx")
      );
    }
  }

  updateMenu() {
    this.state.menu.map((sidemenu) => this.BuildMenuItems(sidemenu, []));
  }

  toggleModule = (name) => {
    // const { activeName } = this.state;
    // modules = [];
    //if (name !== this.state.activeItem.itemCode)

    // this.addComponent(name);
    EntityComponent = lazy(async () => {
      let mod;
      try {
        mod = await import(`./Composite/Entity/${name}Composite.jsx`);
      } catch (err) {
        mod = await import("./Error");
      }
      return mod;
    });

    // modules.push(
    //   Loadable({
    //     loader: () => import("./Base/" + name), // Here can be any component!
    //     loading: () => <div>Loading {name}...</div>,
    //   })
    // );
    // this.setState({ ...this.state, modules });
  };

  BuildMenuItems(SubMenu, parents) {
    try {
      // const { itemName, itemCode, itemProps, localizedKey } = SubMenu;
      //const [t] = useTranslation();
      var isComponent = SubMenu.IsComponent;
      var menuItem = {
        itemName: SubMenu.Name,
        itemCode: SubMenu.MenuCode,
        itemProps: { ...JSON.parse(SubMenu.MenuParams).Itemprops },
        localizedKey: SubMenu.LocalizedKey,
        parents: parents,
        childs: Array.isArray(SubMenu.SubMenu)
          ? SubMenu.SubMenu.map((subMenu) => subMenu.MenuCode)
          : isComponent
            ? []
            : [SubMenu.SubMenu.MenuCode],
        isComponent: isComponent,
      };
      // console.log("menu", menuItem);
      menuItems.push(menuItem);
      var newParents = parents.slice();
      newParents.push(menuItem);

      if (!isComponent) {
        if (Array.isArray(SubMenu.SubMenu)) {
          SubMenu.SubMenu.map((sidemenu) =>
            this.BuildMenuItems(sidemenu, newParents)
          );
        } else {
          this.BuildMenuItems(SubMenu.SubMenu, newParents);
        }
      }
    } catch (error) {
      console.log("error in BuildMenuItems", SubMenu, parents, error);
    }
  }

  handleBreadCrumbClick = (menuName, parents) => {
    //debugger;
    let expand = [];
    let expandWithChilds = [];
    try {
      if (Array.isArray(parents)) {
        let menuIndex = parents.findIndex((menu) => menu.itemCode === menuName);
        for (let index = 0; index <= menuIndex; index++) {
          expand.push(parents[index].itemCode);
        }
      }
      expandWithChilds = this.getChildMenusForExpandedBlock(expand);
    } catch (error) {
      console.log("error at handleBreadCrumbClick", error);
    }
    this.setState({ expand, collapsed: false, expandWithChilds });

    // expand = [...this.state.expand];

    // let index = expand.indexOf(menuName);
    // if (index !== -1) {
    //   index = index + 1;
    //   expand.splice(index, expand.length - index);
    // } else {
    //   expand.push(menuName);
    // }
  };
  getMenuItemClass(itemCode, isSubMenu) {
    let className = "";
    if (isSubMenu) {
      className = "submenu";
    } else {
      className = "";
    }
    if (this.state.expand.includes(itemCode)) {
      className = className + " open";
    }
    if (this.state.expandWithChilds.includes(itemCode)) {
      className = className + " expand";
    }
    // if (this.state.selectedParents.includes(itemCode)) {
    //   className = className + " selectedParent";
    // }
    return className;
  }
  BuildSideBar(SubMenu) {
    // SubMenu.subMenu !== undefined && SubMenu.subMenu.length > 0
    //   ? console.log("Submenu length", SubMenu.subMenu.length)
    //   : console.log("SubMenu.subMenu.length", "0");
    // const { itemCode, iconClass, localizedKey } = SubMenu;
    const expand = [...this.state.expand];
    // return SubMenu.subMenu !== undefined && SubMenu.subMenu.length > 0 ? (
    let iconLeftMargin = 0;
    // debugger;
    if (!this.state.collapsed) {
      let menuProperties = menuItems.find(
        (menuItem) => menuItem.itemCode === SubMenu.MenuCode
      );
      if (menuProperties !== undefined) {
        iconLeftMargin = menuProperties.parents.length * 20;
      }

      //iconLeftMargin=Submenu
    }
    return SubMenu.SubMenu ? (
      <ErrorBoundary key={SubMenu.MenuCode}>
        <TranslationConsumer>
          {(t) => (
            <Sidebar.Submenu
              className={this.getMenuItemClass(SubMenu.MenuCode, true)}
              //className="submenuCustom"
              content={
                <div
                  className={
                    this.state.selectedParents.includes(SubMenu.MenuCode)
                      ? "selectedParent"
                      : "sidebarLabel"
                  }
                >
                  {t(SubMenu.LocalizedKey)}
                </div>
              }
              name={SubMenu.MenuCode}
              icon={
                <span
                  style={{
                    transitionDuration: "0.4s",
                    fontSize: "24px",
                    marginLeft:
                      SubMenu.MenuCode === "Home"
                        ? "0px"
                        : `${iconLeftMargin}px`,
                  }}
                  className={
                    SubMenu.IconClassName +
                    " " +
                    (this.state.selectedParents.includes(SubMenu.MenuCode)
                      ? "selectedParent"
                      : "sidebarLabel")
                  }
                  title={t(SubMenu.LocalizedKey)}
                ></span>
              }
              // icon={<Icon root="common" size="large" name="shipping" />}
              onClick={this.handleSubmenuClick}
              open={expand.includes(SubMenu.MenuCode)}
            //activeName={itemCode}
            // active={true}
            // active={
            //   this.state.activeItem.parents.filter((e) => e.itemCode === itemCode)
            //     .length === 0
            // }
            >
              {Array.isArray(SubMenu.SubMenu)
                ? SubMenu.SubMenu.map((sidemenu) => this.BuildSideBar(sidemenu))
                : this.BuildSideBar(SubMenu.SubMenu)}
            </Sidebar.Submenu>
          )}
        </TranslationConsumer>
      </ErrorBoundary>
    ) : (
      <TranslationConsumer>
        {(t) => (
          <Sidebar.Item
            key={SubMenu.MenuCode}
            className={this.getMenuItemClass(SubMenu.MenuCode, false)}
            content={
              <div
                className={
                  this.state.activeItem.itemCode === SubMenu.MenuCode
                    ? "selectedParent"
                    : "sidebarLabel"
                }
              >
                {t(SubMenu.LocalizedKey)}
              </div>
            }
            icon={
              <span
                style={{
                  transitionDuration: "0.4s",
                  fontSize: "24px",
                  marginLeft:
                    SubMenu.MenuCode === "Home" ? "0px" : `${iconLeftMargin}px`,
                }}
                className={
                  SubMenu.IconClassName +
                  " " +
                  (this.state.activeItem.itemCode === SubMenu.MenuCode
                    ? "selectedParent"
                    : "sidebarLabel")
                }
                title={t(SubMenu.LocalizedKey)}
              ></span>
            }
            name={SubMenu.MenuCode}
            activeName={this.state.activeItem.itemCode}
            // icon={<span className={`icon-${itemCode}`}></span>}
            onClick={this.handleItemClick}
          // iconRoot="common"
          // icon="shipping"
          // size="small"
          />
        )}
      </TranslationConsumer>
    );
  }

  handleItemClick(event, item) {
    //console.log("menuitems", menuItems);
    try {
      const windowWidth = window.screen.width;
      const { name } = item;
      let selectedParents = [];
      var components = menuItems.filter((e) => e.itemCode === name); //.itemName;
      var componentName = "";
      if (components.length > 0) {
        componentName = components[0].itemName;
        selectedParents = components[0].parents.map(
          (parent) => parent.itemCode
        );
      } else componentName = "Error";
      //if (name !== this.state.activeName)
      // if (name !== this.state.activeItem.itemCode)

      this.toggleModule(componentName);

      // this.setState({ activeName: name, activeItem: components[0] });
      let collapsed = this.state.collapsed;
      //if (this.props.userDetails.EntityResult.IsWebPortalUser) {
      if (windowWidth < 1024) {
        collapsed = true;
      }
      // this.handleIconMargin(collapsed);
      // }
      this.setState({ activeItem: components[0], collapsed, selectedParents });
      window.scrollTo(0, 0);
      // console.log(components[0]);
    } catch (error) {
      console.log(error);
    }
    //console.log("activeName", itemProps);
    //console.log("content", itemProps.content);
  }

  // handleIconMargin(collapsed) {
  //   if (collapsed) {
  //     iconMargin = 0;
  //   } else iconMargin = 20;
  // }
  handleSubmenuClick(event, itemProps) {
    // let expand = [...this.state.expand];
    //console.log(this.state.expand, itemProps);
    // debugger;
    //let menu = this.state.menu;
    let itemCode = itemProps.name;
    // let expandWithChilds = [];
    try {
      let expand = [...this.state.expand];

      const expanderIndex = expand.findIndex((element) => element === itemCode);
      if (expanderIndex >= 0) {
        // if (expanderIndex === expand.length - 1) expand.splice(expanderIndex, 1);
        // else {
        //   expand.splice(expanderIndex, expand.length - expanderIndex);
        // }
        expand.splice(expanderIndex, expand.length - expanderIndex);
        this.setState({ expand });
        // console.log(expand);
      } else {
        let expand = [];

        var itemIndex = menuItems.findIndex((obj) => obj.itemCode === itemCode);
        if (itemIndex > 0) {
          let parents = menuItems[itemIndex].parents;
          parents.forEach((objParent) => {
            expand.push(objParent.itemCode);
          });
        }
        expand.push(itemCode);

        let expandWithChilds = this.getChildMenusForExpandedBlock(expand);
        //console.log(expandWithChilds);

        this.setState({ expand, expandWithChilds });

        // console.log(expand);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getChildMenusForExpandedBlock(expand) {
    let expandWithChilds = [];
    try {
      function getChildItems(expandedItem) {
        try {
          let childItem = menuItems.find(
            (menuitem) => menuitem.itemCode === expandedItem
          );
          if (childItem !== undefined) {
            if (!expandWithChilds.includes(childItem.itemCode)) {
              expandWithChilds.push(childItem.itemCode);
            }
            // debugger;
            childItem.childs.forEach((menuItem) => getChildItems(menuItem));
          }
        } catch (error) {
          console.log("error in getChildItems", error);
        }
      }

      expand.forEach((expandedItem) => getChildItems(expandedItem));
    } catch (error) {
      console.log("error in getChildMenusForExpandedBlock", error);
    }
    return expandWithChilds;
  }

  handlethemeChange(theme) {
    // let theme = e.target.checked ? ThemeType.Dark : ThemeType.Light;
    this.props.setTheme({ theme: theme });
  }
  render() {
    // let themeColor = "Light";
    // if (this.state.checked) {
    //   themeColor = "Dark";
    // }
    let theme = this.props.theme;
    toggleTheme(theme);
    // toggleTheme(ThemeType[themeColor]);
    //const { modules } = this.state;
    //console.log(this.props.userDetails.userDetails.EntityResult);

    let lngCode = null;
    let isDemoLicense = "";
    let isDriverRole = false;

    const user = this.props.userDetails.EntityResult;
    if (user.UICulture !== undefined && user.UICulture !== null)
      lngCode = user.UICulture.substring(0, 2);

    if (user.IsDemoLicense) isDemoLicense = "Demo";

    if (user.RoleName === "Driver") isDriverRole =  true

    return (
      <TranslationConsumer>
        {(t) => (
          <div
          //  className={themeColor.toLowerCase() === "light" ? "light" : "dark"}
          >

            {isDriverRole ? "" : (
              <Header
                className="headerPosition"
                title={
                  <div>
                    <span> {t("Header_TerminalManager")} </span>{" "}
                    {user.IsEnterpriseNode ? <span> {"Enterprise"} </span> : ""}
                    <span className="demoText"> {t(isDemoLicense)} </span>{" "}
                  </div>
                }
                menu={true}
                reponsive="false"
                onMenuToggle={() => {
                  //this.handleIconMargin(!this.state.collapsed);
                  this.setState({ collapsed: !this.state.collapsed });
                }}
              >
                {user.IsArchived ? (
                  <Header.Item className="logo-item">
                    <Tooltip
                      element={
                        <span className="icon-Archive-system slotDateColHeader" />
                      }
                      content={t("Archive_System")}
                      position="bottom left"
                    />
                    <span className="archiveDates">
                      &nbsp;
                      {new Date(user.FromArchivePeriod).toLocaleDateString() +
                        " " +
                        t("to") +
                        " " +
                        new Date(user.ToArchivePeriod).toLocaleDateString()}{" "}
                    </span>
                  </Header.Item>
                ) : (
                  ""
                )}

                {user.IsEnterpriseNode ? (
                  <Header.Item className="logo-item  mr-3">
                    <Tooltip
                      element={
                        <span
                          style={{ fontSize: "35px", marginBottom: "5px" }}
                          className="icon-Enterprise_Node slotDateColHeader"
                        />
                      }
                      content={t("Header_Enterprise")}
                      position="bottom left"
                    />
                  </Header.Item>
                ) : (
                  <Header.Item className="logo-item mr-3">
                    <Tooltip
                      element={
                        <span className="tank-form-header">
                          {user.TerminalCode}{" "}
                        </span>
                      }
                      content={user.TerminalName}
                      position="bottom left"
                    />
                  </Header.Item>
                )}

                {user.PageAttibutes.IsNTEPCertificateValid ? (
                  <Header.Item className="logo-item">
                    <img
                      src="/NTEP.jpg"
                      alt=""
                      title={
                        t("AboutPage_CertificationInfoText") +
                        user.PageAttibutes.NTEP_CCNumber
                      }
                    ></img>
                  </Header.Item>
                ) : (
                  ""
                )}

                <Header.Item className="logo-item mr-3">
                  <img
                    alt=""
                    src={
                      user.IsAramcoLicense
                        ? "/SACustomerImage.png"
                        : "/CustomerLogo.png"
                    }
                  ></img>
                </Header.Item>
                {user.IsAramcoLicense ? (
                  ""
                ) : (
                  <Header.Item className="logo-item">
                    <Tooltip
                      element={<span
                        className="themeIcon p-3"
                        style={{ marginRight: "0px", cursor: "pointer" }}
                        onClick={
                          () => this.handlethemeChange(theme === ThemeType.Dark ? ThemeType.Light : ThemeType.Dark)
                        }>
                        {
                          theme === ThemeType.Dark ?
                            <Icon root="common" name="sun" size="medium" /> :
                            <Icon root="common" name="clear-night" size="medium" />
                        }
                      </span>
                      }
                      content={theme === ThemeType.Dark ? t("Theme_Light") : t("Theme_Dark")}
                      hoverable={true}
                      event='hover'
                    />
                  </Header.Item>
                )}

                <UserProfile
                  firstName={user.Firstname ? user.Firstname : ""}
                  lastName={user.LastName ? user.LastName : ""}
                >
                  <UserProfile.Item className="logo-item">
                    {user.Firstname}, {user.LastName}
                  </UserProfile.Item>
                  <UserProfile.Item className="logo-item">
                    {t("Shareholder") + ": " + user.PrimaryShareholder}
                  </UserProfile.Item>
                  <UserProfile.Item onClick={this.props.onSignout}>
                    {t("SignOut")}
                  </UserProfile.Item>
                </UserProfile>
              </Header>
            )}

            {/* Driver Role Header Start */}
            {isDriverRole ? (
              <Header
                className="headerPosition"
                responsive={false}
                menu={true}
                title={
                  <div>
                    <span> {t("Header_TerminalManager")} </span>{" "}
                  </div>
                }
                onMenuToggle={() => { this.setState({ collapsed: !this.state.collapsed });}}>

                {user.IsAramcoLicense ? (
                  ""
                ) : (
                  <Header.Item className="logo-item">
                    <Tooltip
                      element={<span
                        className="themeIcon p-3"
                        style={{ marginRight: "0px", cursor: "pointer" }}
                        onClick={
                          () => this.handlethemeChange(theme === ThemeType.Dark ? ThemeType.Light : ThemeType.Dark)
                        }>
                        {
                          theme === ThemeType.Dark ?
                            <Icon root="common" name="sun" size="medium" /> :
                            <Icon root="common" name="clear-night" size="medium" />
                        }
                      </span>
                      }
                      content={theme === ThemeType.Dark ? t("Theme_Light") : t("Theme_Dark")}
                      hoverable={true}
                      event='hover'
                    />
                  </Header.Item>
                )}

                <UserProfile
                  firstName={user.Firstname ? user.Firstname : ""}
                  lastName={user.LastName ? user.LastName : ""}
                >
                  <UserProfile.Item className="logo-item">
                    {user.Firstname}, {user.LastName}
                  </UserProfile.Item>
                  <UserProfile.Item className="logo-item">
                    {t("Shareholder") + ": " + user.PrimaryShareholder}
                  </UserProfile.Item>
                  <UserProfile.Item onClick={this.props.onSignout}>
                    {t("SignOut")}
                  </UserProfile.Item>
                </UserProfile>
              </Header>
            ) : ""}
            {/* Driver Role Header End */}

            <SidebarLayout
              className="sideBarHeight"
              collapsed={this.state.collapsed}
              noIcons={isDriverRole}
            >
              <Sidebar>
                {this.state.menu.map((sidemenu) => this.BuildSideBar(sidemenu))}
              </Sidebar>
              <content className="contentContainer">
                <React.Suspense
                  fallback={<LoadingPage message="Loading"></LoadingPage>}
                >
                  {EntityComponent == null ? "" : (
                    <ErrorBoundary>
                      <LocalizationConfig languageCode={lngCode}>
                        <EntityComponent
                          activeItem={this.state.activeItem}
                          handleBreadCrumbClick={this.handleBreadCrumbClick}
                        />
                      </LocalizationConfig>
                    </ErrorBoundary>
                  )}
                </React.Suspense>
              </content>
            </SidebarLayout>
            <Footer className="footerPosition" copyrightText="">
              <Footer.Item onClick={() => window.open(termsConditionURL)}>
                {t("TermsCondition")}
              </Footer.Item>
              <Footer.Item onClick={() => window.open(privacyPolicyURL)}>
                {t("PrivacyPolicy")}
              </Footer.Item>
            </Footer>
          </div>
        )}
      </TranslationConsumer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userDetails: state.getUserDetails.userDetails,
    tokenDetails: state.getUserDetails.TokenAuth,
    theme: state.appTheme.theme
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTheme: (obj) => dispatch(appThemeActions.setAppTheme(obj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
