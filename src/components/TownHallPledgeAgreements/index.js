import React from 'react';

const TownHallPledgeAgreements = (props) => {
  return (
    <div role="tabpanel" className="tab-pane" id="town-hall-pledge">
      <div className="container">
        <div className="row">
          <div className="col-md-6 img-holder">
            <img src="../Images/svgs/THP_Pledge_House.svg" />
          </div>
          <div className="col-md-6 img-holder">
            <img src="../Images/svgs/THP_Pledge_Senate.svg" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default TownHallPledgeAgreements;