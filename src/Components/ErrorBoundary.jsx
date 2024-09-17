import React, { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { HasError: false };
  static getDerivedStateFromError(error) {
    return { HasError: true };
  }
  render() {
    if (this.state.HasError) {
      return <div>Error Occured</div>;
    }
    return this.props.children;
  }
}

//export default ErrorBoundary;
