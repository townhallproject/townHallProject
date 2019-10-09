export default (missingMember) => {
  return `
  <div class="element-item ${missingMember.party} ${missingMember.state} ${missingMember.displayType} ${missingMember.ahca ? 'ahca' : ''} ${missingMember.taxBill ? 'taxBill' : ''} ${missingMember.missingMember ? 'missingMember' : ''}">
  <div class="card card-representative ${missingMember.party}">
    <div class="card-header">
      <div class="row">
      <div class="col-xs-4 col-sm-3 no-padding p-0">
        <img src="https://www.govtrack.us/static/legislator-photos/${missingMember.govtrack_id}-100px.jpeg" onerror="$(this).remove()" class="grayscale" />
      </div>
      <div class="col-xs-8 col-sm-9">
        <h4>${missingMember.displayName}</h4>
        <small class="rep-card-subtitle">${missingMember.repOf}</small>
      </div>
    </div>
    </div>
    <div class="card-block">
      <div class="card-text row">
        ${missingMember.phone ?
      `<div class="col-xs-12 col-sm-5 no-padding p-0">
          <div><span>Office Phone:</span> ${missingMember.phone}</div>
        </div>`: ''}
        <div class="social-icons col-xs-12 col-sm-7 no-padding p-0 text-right">
          ${missingMember.twitter ?
      `<a href="//twitter.com/${missingMember.twitter}" class="social-icon" target="_blank">
              <i class="fa fa-twitter-square fa-2x" aria-hidden="true"></i>
            </a>`: ''}
          ${missingMember.facebook ?
      `<a href="//facebook.com/${missingMember.facebook}" class="social-icon" target="_blank">
              <i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i>
            </a>`: ''}
          
        </div>
      </div>
    </div>
   </div>
</div>
  `
}

// ${missingMember.oc_email ?
// `<a href="mailto:${missingMember.oc_email}" class="social-icon">
//       <i class="fa fa-envelope-square fa-2x" aria-hidden="true"></i>
//     </a>`: ''}
//   ${missingMember.contact_form ?
// `<a href="${missingMember.contact_form}" class="social-icon" target="_blank">
//       <i class="fa fa fa-external-link-square fa-2x" aria-hidden="true"></i>
//     </a>`: ''}
//   ${missingMember.url ?
// `<a href="${missingMember.url}" class="social-icon" target="_blank">
//       <i class="fa fa fa-external-link-square fa-2x" aria-hidden="true"></i>
//     </a>`: ''}

// {{!-- <div class="poster-icon">
//     <a href="https://jacksonmaxfield.github.io/flyer_gen/#/m={{id}}" target="_blank"
//         title="Print a milk-carton like poster for your Missing Member of Congress.">
//       <i class="fas fa-2x fa-address-book" aria-hidden="true"></i>
//     </a>
// </div> --}}


// {{!-- <div class="mm card-footer no-padding container-flex">
// <div class="row">
//   <div class="footer-icon type-holder col-4 vertical-align ">
//    {{#if taxBill}}
//     <div class="footer-text"><small>Voted for</small> <span class="highlight">2017 Tax Bill</span></div>{{/if}}
//   </div>
//   <div class="footer-icon  col-4">
//     {{#if ahca}}<div class="footer-text ahca-text  vertical-align">
//       <small>Voted for </small><span class="highlight">AHCA</span></div>{{/if}}
//   </div>
// </div>
// </div> --}}