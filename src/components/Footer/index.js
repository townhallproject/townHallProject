import React from 'react';

const Footer = (props) => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <ul className="list-unstyled">
          <li>
            <a data-toggle="tab" className="hash-link text-white" href="#contact">
              <i className="fas fa-envelope-square fa-3x"></i>
            </a>
            <a href="https://twitter.com/townhallproject" className="text-white" target="_blank">
              <i className="fab fa-twitter-square fa-3x" aria-hidden="true"></i>
            </a>
            <a href="https://www.facebook.com/TownHallProject/" className="text-white" target="_blank">
              <i className="fab fa-facebook-square fa-3x" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <small>Compiled by Town Hall Project volunteers. All efforts are made to verify accuracy of events.</small>
          </li>
          <li>
            <small>Event details can change at short notice, please contact your representative to confirm.</small>
          </li>
          <li>
            <a className="privacy-policy-button" data-toggle="tab" href="#privacy-policy">Privacy Policy</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;