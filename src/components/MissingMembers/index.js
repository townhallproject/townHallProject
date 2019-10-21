import React from 'react';

// import './style.scss';

const MissingMembers = (props) => {
  return (
    <React.Fragment>
      <header>
        <section className="container container-fluid">
          <div className="col-md-6 col-md-offset-3">
            <p className="lead">
              <span id="mm-total-copy">Many</span> members of Congress have not held a single in-person town hall since
              January 3, 2019.
              </p>
            <p className="lead">
              Is yours one of them?
              </p>
          </div>
        </section>
        <nav className="navbar navbar-default">
          <ul className="nav navbar-nav navbar-left filter-button-group">
            <li className="block">
              {/*<!-- <div className="col-sm-6">
                          <button className="btn btn-primary btn-block" type="button" name="button" id="view-missing-member-report">View 2017 Report</button>
                          </div> -->*/}
              <div className="col-sm-6">
                <p className="transparent" id="mm-current-state" data-current={0} data-total={0}>
                  Viewing ### of ### total missing members
                  </p>
                {/*<!-- <p>
                          Click the
                    <i className="fas fa-address-book" aria-hidden="true"></i> icon on your member's card to download a poster
                        </p> -->*/}
              </div>
            </li>
            <li className="block filter-button-group mm-filter-info-holder">
              <ul className="nav navbar-nav" id="mm-filter-info">
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right btn-group">
            <li className="nav-item dropdown filter-button-group btn-group">
              <a href="#" className="btn btn-xs dropdown-toggle navbar-btn btn-group mm-btn-group" data-toggle="dropdown"
                role="button" aria-haspopup="true" aria-expanded="false">Party
                  <span className="caret"></span>
              </a>
              <ul className="dropdown-menu button-group" data-filter-group="party">
                <li className="downdown-title">Filter by party</li>
                <li role="separator" className="divider"></li>
                <li data-filter=".Democratic" id="Democratic" className="btn dropdown-item btn-filter btn-white">Democratic
                  </li>
                <li data-filter=".Republican" id="Republican" className="btn dropdown-item btn-filter btn-white">Republican
                  </li>
                {/*<!-- <li data-filter=".Independent" id="Independent" className="btn dropdown-item btn-filter btn-white">Independent</li> -->*/}
                <li data-filter="" id="All" className="btn dropdown-item btn-filter btn-white">All</li>
              </ul>
            </li>
            <li className=" nav-item dropdown filter-button-group btn-group">
              <a href="#" className="btn btn-xs dropdown-toggle navbar-btn btn-group mm-btn-group" data-toggle="dropdown"
                role="button" aria-haspopup="true" aria-expanded="false">Chamber
                  <span className="caret"></span>
              </a>
              <ul className="dropdown-menu button-group" data-filter-group="chamber">
                <li className="downdown-title">Filter by chamber</li>
                <li role="separator" className="divider"></li>
                <li className="btn dropdown-item btn-filter btn-white" data-filter=".Senate">Senate</li>
                <li className="btn dropdown-item btn-filter btn-white" data-filter=".House" id="Republican">House</li>
                <li className="btn dropdown-item btn-filter btn-white" data-filter="" id="All">All</li>
              </ul>
            </li>
            {/*<!-- <li className="nav-item filter-button-group button-group btn-group" data-filter-group="ahcaFilter">
                      <a className="btn btn-xs btn-filter navbar-btn mm-btn-group" data-filter=".ahca">Voted for AHCA</a>
                    </li>
                    <li className="nav-item filter-button-group button-group btn-group" data-filter-group="taxbillFilter">
                      <a className="btn btn-xs btn-filter navbar-btn mm-btn-group" data-filter=".taxBill">Voted for 2017 tax bill</a>
                      </li> -->*/}
          </ul>
          <ul className="nav navbar-nav state-button-holder filter-button-group ">
            <ul id="state-buttons" className="button-group " data-filter-group="state">
            </ul>
          </ul>
        </nav>
      </header>
      <div className="inset">
      </div>
      <div className="missing-member-cards-container">
        <div className="container">
          <div className="grid">
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default MissingMembers;