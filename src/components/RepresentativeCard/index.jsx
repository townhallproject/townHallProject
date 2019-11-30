import React, { Component } from 'react';
import classNames from 'classnames';

import './style.less'

export default (props) => {
  const {
    rep
  } = props;
  const renderSocialIcon = (infoKey, url, icon) => {
    if (!rep[infoKey]) { return null }

    return (<a href={`${url}/${infoKey}`} className="social-icon" target="_blank">
            <i className={classNames("fa", icon, "fa-2x")} aria-hidden="true"></i>
          </a>)
  }

  return (<div className={classNames("col-lg-4", "col-md-6", "col-sm-6", "col-xs-12")}>
      <div className={classNames("card", "card-representative", rep.party)}>
        <div className="card-header">
          <div className="row">
            <div className="col-xs-4 col-sm-3 no-padding p-0">
              {/* {rep.missing_member['116'] && <a href={`https://jacksonmaxfield.github.io/flyer_gen/#/m=${rep.id}`} target="_blank"
             title="Print a milk-carton like poster for your Missing Member of Congress.">
                  <div className="missing-member weight-heavy">Missing Member</div>
                </a>} */}
              <img src={`https://www.govtrack.us/static/legislator-photos/${rep.govtrack_id}-100px.jpeg`} className="grayscale" />
            </div>
            <div className="col-xs-8 col-sm-9">
              <h3>{rep.formattedMember}</h3>
              <h4>{rep.party}</h4>
            </div>
          </div>
        </div>
        <div className="card-block">
          <div className={classNames("card-text", "row")}>
            <div className={classNames("col-xs-12", "col-sm-6", "no-padding", "p-0")}>
              {rep.electionYear && <div><label>Next election:</label> {rep.electionYear}</div>}
              {rep.phone && <div><label>Phone:</label> {rep.phone}</div>}
              {rep.fax && <div><label>Fax:</label> {rep.fax}</div>}
            </div>
            <div className={classNames("social-icons", "col-xs-12", "col-sm-6", "no-padding", "p-0", "text-right")}>
              {renderSocialIcon('twitter_cannon', '//twitter.com/', 'fa-twitter-square')}
              {renderSocialIcon('facebook_canon', '//facebook.com/', 'fa-facebook-square')}
              {renderSocialIcon('oc_email', 'mailto:', 'fa-envelope-square')}
              {renderSocialIcon('contact_form', 'http://', 'fa-external-link-square')}
              {renderSocialIcon('domain', 'http://', 'fa-external-link-square')}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className={classNames("mm", "card-footer", "no-padding", "container-flex")}>
            <div className="row">
              <div className={classNames("footer-icon", "type-holder", "col-4", "vertical-align")}>
                {rep.next_election &&
                  (<div className="footer-text">
                    <small>Term ends: </small> 
                    <span className="highlight">{rep.next_election}</span>
                  </div>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
