import React from "react";
import { Notification } from "@scuf/common";
import { TranslationConsumer } from "@scuf/localization";
import { delimiter } from "./Constants";
import PropTypes from "prop-types";
NotifyEvent.propTypes = {
  notificationMessage: PropTypes.shape({
    messageType: PropTypes.oneOf(["success", "critical"]),
    message: PropTypes.string,
    messageResultDetails: PropTypes.arrayOf(
      PropTypes.shape({
        keyFields: PropTypes.arrayOf(PropTypes.string),
        KeyValues: PropTypes.arrayOf(PropTypes.string),
        isSuccess: PropTypes.bool,
        errorMessage: PropTypes.string,
      })
    ),
  }).isRequired,
  //closeToast: PropTypes.bool,
};
// notifiaionMessage={messageType:"success/critical",message:"title of message",
// messageResultDetails:[{keyFields:[Array Of Key Codes],KeyValues:[Array of Key Values],isSuccess,ErrorMessage}]}
export default function NotifyEvent({ notificationMessage }) {

  function getLocalizedMessage(message) {
    try {
      let messageOptions = message.split(delimiter);
      return messageOptions[0];
    } catch (error) {
      console.log(error);
      return "";
    }
  }
  function getLocalizedMessageParameters(message) {
    try {
      let messageOptions = message.split(delimiter);
      messageOptions.splice(0, 1);
      return messageOptions;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return (
    <TranslationConsumer>
      {(t) => (
        <Notification
          className="toast-notification"
          severity={notificationMessage.messageType}
          // onCloseClick={closeToast}
          hasIcon={true}
          title={t(notificationMessage.message)}
        //onDetailsClick={() => alert(details)}
        >
          {notificationMessage.messageResultDetails.map((messageResult) => {
            var entityKeyDetails = "";
            if (messageResult.keyFields.length > 0) {
              for (var i = 0; i < messageResult.keyFields.length; i++) {
                entityKeyDetails =
                  entityKeyDetails +
                  t(messageResult.keyFields[i]) +
                  " : " +
                  messageResult.keyValues[i] +
                  ", ";
              }
            }
            return (
              <div>
                <span
                  style={{ color: messageResult.isSuccess ? "#7eb338" : "#F15A4F" }}
                >
                  {entityKeyDetails}
                  {messageResult.isSuccess
                    ? t("NotificationList_MessageType_Success")
                    : t("NotificationList_MessageType_Failure") +
                    " : " +
                    t(
                      getLocalizedMessage(messageResult.errorMessage),
                      getLocalizedMessageParameters(
                        messageResult.errorMessage
                      )
                    )}
                </span>
                <br></br>
              </div>
            );
          })}
        </Notification>
      )}
    </TranslationConsumer>
  );
}
