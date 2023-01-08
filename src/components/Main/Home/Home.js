import React, { Component } from "react";
import { key } from "../../../constants";
import ContentHeader from "../ContentHeader/ContentHeader";

class Home extends Component {
  render() {
    return <div className="content-wrapper">
      <ContentHeader header="Home" />
      <section className="content">
        <div className="container-fluid">
          <div className="row" style={{ minHeight: '100%', margin: 10 }}>
            <div className="col-md-12" style={{ textAlign: "center" }}>
                {/* <p>{localStorage.getItem(key.token)}</p> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  }
}

export default Home;
