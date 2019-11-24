import React, { Component } from 'react';

export default ({ rep }) => (
  <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
  <div class="card card-representative ${rep.party}">
    <div class="card-header">
      <div class="row">
        <div class="col-xs-4 col-sm-3 no-padding p-0">
          {rep.missingMember ?
          `<a href="https://jacksonmaxfield.github.io/flyer_gen/#/m=${rep.id}" target="_blank"
             title="Print a milk-carton like poster for your Missing Member of Congress.">
            <div class="missing-member weight-heavy">Missing Member</div>
          </a>` : ''}
          <img src="https://www.govtrack.us/static/legislator-photos/${rep.govtrack_id}-100px.jpeg" onerror="$(this).remove()" class="grayscale" />
        </div>
        <div class="col-xs-8 col-sm-9">
              <h3>{rep.formattedMember}</h3>
              <h4>{rep.party}</h4>
        </div>
      </div>
    </div>
    <div class="card-block">
      <div class="card-text row">
        <div class="col-xs-12 col-sm-6 no-padding p-0">
          {rep.electionYear ? `<div><label>Next election:</label> ${rep.electionYear}</div>` : ''}
          {rep.phone ? `<div><label>Phone:</label> ${rep.phone}</div>` : ''}
          {rep.fax? `<div><label>Fax:</label> ${rep.fax}</div>` : ''}
        </div>
        <div class="social-icons col-xs-12 col-sm-6 no-padding p-0 text-right">
          {rep.twitter_canon ?
            `<a href="//twitter.com/${rep.twitter_canon}" class="social-icon" target="_blank">
              <i class="fa fa-twitter-square fa-2x" aria-hidden="true"></i>
            </a>` : ''
          }
          {rep.facebook_canon ?
            `<a href="//facebook.com/${rep.facebook_canon}" class="social-icon" target="_blank">
              <i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i>
            </a>` : ''
          }
          {rep.oc_email ?
            `<a href="mailto:${rep.oc_email}" class="social-icon">
              <i class="fa fa-envelope-square fa-2x" aria-hidden="true"></i>
            </a>`: ''
          }
          {rep.contact_form ?
            `<a href="http://${rep.contact_form}" class="social-icon" target="_blank">
              <i class="fa fa fa-external-link-square fa-2x" aria-hidden="true"></i>
            </a>` :
            rep.domain ?
              `<a href="http://${rep.domain}" class="social-icon" target="_blank">
                <i class="fa fa fa-external-link-square fa-2x" aria-hidden="true"></i>
              </a>`
              : ''
          }
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="mm card-footer no-padding container-flex">
        <div class="row">
          <div class="footer-icon type-holder col-4 vertical-align ">
            {rep.next_election ? 
              `<div class="footer-text"><small>Term ends:</small> <span class="highlight">${rep.next_election}</span></<div>`: ''
            }
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);