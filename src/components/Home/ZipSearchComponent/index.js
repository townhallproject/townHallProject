import React from 'react';

// import './style.scss';

const ZipSearchComponent = (props) => {
  return (
    <header className="site-header clearfix">
      <section className="container container-fluid">
        <div className="row">
          <div className="col-md-6 left-panels">
            <div className=" text-left site-header clearfix displayoff ">
              <div className="form-text-results col-md-12">
                <div className="text-toggle header-large">
                  <img id="header-image" src="/Images/THP_logo_inverse.png" alt=""></img>
                </div>
                <div className="text-toggle header-small hidden">
                  {/*<img src="/Images/THP_logo_inverse_simple.png" alt=""></img>*/}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 right-panels">
            <div className="spacer">
            </div>
            <form id="look-up" className="form-inline text-center" action="index.html">
              <div className="form-group text-center">
                <label htmlFor="zip"></label>
                <input className="form-control input-lg" type="zip" name="" placeholder="Zip Code" />
                <button type="submit" name="button" className="btn btn-primary btn-lg fath-button">Find A Town Hall</button>

                <div id="selection-results" className="text-center ">
                  <h4 className="selection-results_content"></h4>
                </div>

              </div>
            </form>
            <div id="textresults" className="text-center "></div>
          </div>
        </div>
      </section>
    </header>
  );
};

export default ZipSearchComponent;