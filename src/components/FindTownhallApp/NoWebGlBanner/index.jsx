import React from 'react';

const NoWebGlBanner = (props) => {
    return (
        <div className="hidden show-if-no-webgl webgl-banner">
            <div className="webGl-warning" target="_blank">
                <img className="webGl-compimg" src="../Images/map/ohno-computer.png"></img>
                <p>Our interactive map feature uses WebGL, a plugin common in most modern browsers. Your browser does not
                have WebGL
                working currently.</p>
                <p>You can learn how to enable WebGL on
                <a href="https://get.webgl.org/" target="_blank">this website.</a>
                </p>
            </div>
            <img className="webGL-kill" src="../Images/map/xmark.svg"></img>
        </div>
    )
};

export default NoWebGlBanner;