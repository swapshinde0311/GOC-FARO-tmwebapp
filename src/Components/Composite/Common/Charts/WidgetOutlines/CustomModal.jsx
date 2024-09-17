import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button } from '@scuf/common';
import ErrorBoundary from '../../../../ErrorBoundary';
import { TranslationConsumer } from '@scuf/localization';

const CustomModal = (props) => {
    return (
        <ErrorBoundary>
            <TranslationConsumer>
                {(t) => (
                    <Modal style={{ padding: "0px" }} size="fullscreen" open={props.openModal} onClose={props.closeHandler} closeOnDocumentClick={false} className='cardDetailsPopup'>
                        <Modal.Header style={{ padding: "0px" }}>
                            <Header title={t("Header_TerminalManager")} menu={false} />
                        </Modal.Header>
                        <Modal.Content style={{ maxHeight: "75vh", height: "75vh", overflowX: "hidden", overflowY: "auto" }} className="cardDetailsPopup mt-3">
                            {/* <div className="col col-lg-12">
                                <h2>{t(props.header)}</h2>
                            </div> */}
                            {props.children}
                        </Modal.Content>
                        <Modal.Footer style={{ marginTop: "10px", borderTop: "1px solid  #a0a0a0" }}>
                            <div style={{ marginLeft: "20px", width: "100%" }}>
                                <Button
                                    className="backButton"
                                    style={{ "marginRight": "10px" }}
                                    onClick={props.closeHandler}
                                    content={t("Report_Back")}
                                ></Button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                )}
            </TranslationConsumer>
        </ErrorBoundary>
    )
}

CustomModal.propTypes = {
    header: PropTypes.string,
    openModal: PropTypes.bool.isRequired,
    closeHandler: PropTypes.func.isRequired,
    children: PropTypes.object
}

export default CustomModal