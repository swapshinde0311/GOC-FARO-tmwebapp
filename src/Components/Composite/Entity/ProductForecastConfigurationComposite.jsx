import React from 'react';
import ErrorBoundary from '../../ErrorBoundary';
import { TMUserActionsComposite } from '../Common/TMUserActionsComposite';
import ProductForecastConfigurationDetailComposite from '../Details/ProductForecastConfigurationDetailComposite';
import { toast, ToastContainer } from 'react-toastify';
import NotifyEvent from '../../../JS/NotifyEvent';
import { LoadingPage } from '../../UIBase/Common/LoadingPage';
import "react-toastify/dist/ReactToastify.css";
import "../../../CSS/styles.css";

class ProductForecastConfigurationComposite extends React.Component {
    state = {
        operationsVisibilty: { add: false, delete: false, shareholder: false },
        isReadyToRender: false
    }

    componentDidMount = () => {
        this.setState({
            isReadyToRender: true
        });
    }

    notifyEvent = (notification) => {
        try {
            toast(
                <ErrorBoundary>
                    <NotifyEvent notificationMessage={notification}></NotifyEvent>
                </ErrorBoundary>,
                {
                    autoClose: notification.messageType === "success" ? 10000 : false,
                }
            );
        } catch (error) {
            console.log(
                "ProductForecastConfigurationComposite: Error occurred on savedEvent",
                error
            );
        }
    };

    render() {
        return (
            <div>
                <ErrorBoundary>
                    <TMUserActionsComposite
                        operationsVisibility={this.state.operationsVisibility}
                        breadcrumbItem={this.props.activeItem}
                        handleBreadCrumbClick={this.props.handleBreadCrumbClick}
                        addVisible={false}
                        deleteVisible={false}
                        shrVisible={false}
                    />
                </ErrorBoundary>
                {
                    this.state.isReadyToRender ?
                        <ErrorBoundary>
                            <ProductForecastConfigurationDetailComposite
                                onNotice={this.notifyEvent}
                                genericProps={this.props.activeItem.itemProps}
                            />
                        </ErrorBoundary>
                        : <LoadingPage message="Loading" />
                }
                <ErrorBoundary>
                    <ToastContainer
                        hideProgressBar={true}
                        closeOnClick={false}
                        closeButton={true}
                        newestOnTop={true}
                        position="bottom-right"
                        toastClassName="toast-notification-wrap"
                    />
                </ErrorBoundary>
            </div>
        )
    }
}

export default ProductForecastConfigurationComposite;