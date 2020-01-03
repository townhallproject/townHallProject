import React from 'react';

import { Avatar, Button, Card, Col, Row } from 'antd';

const { Meta } = Card;
require('./style.less')
export default () => {
    return (
        <div className="support-us">
            <Row className="donate-banner" type="flex" justify="space-around">
                <Col span={6}><h1>YOU MAKE OUR WORK HAPPEN</h1></Col>
                <Col span={8}><h4>Town Hall Project is a community of people like you. We hold our lawmakers accountable, and make the voices of everyday Americans heard.</h4>

                    <h4>Please donate today to be a part of our work, and our grassroots movement.</h4>
                </Col>
            </Row>
            <section className="section-one">
                <Row  type="flex" justify="space-around">
                    <Col xs={24} md={16}>
                    <p>Town Hall Project is dedicated to the simple, powerful conviction that our democracy is stronger, fairer, and better when every constituent can make their voice heard to the people who represent us.</p>
                    <p>With your help, in 2020, Town Hall Project will fight for transparency during the most important election of our lifetimes.</p>
                    <p>And in 2021, Town Hall Project will be ready to engage Americans to move forward. Together, we will hold our newly sworn-in representatives to their commitments, and rise to our better values as a nation.</p>

                    </Col>
                    <Col span={8} className="image-container">
                        <img src="/Images/image1.jpg"/>
                    </Col>
                </Row>
                <Row>
                    <p>Help us ensure a better future. Your monthly donation or one-time contribution will support our hard-hitting work in 2020 and beyond. Thank you!</p>
                </Row>
                <div className="donate-form">
                    <Button href="https://secure.actblue.com/donate/thp" type="primary" shape="round" size="large">
                        Donate Today
                    </Button>
                </div>
            </section>
            <section className="what-we-do">
                <h2>What your donation makes possible</h2>

                <h4>With your support, Town Hall Project will give hundreds of thousands of Americans the tools they need to preserve our democracy through: </h4>
                <Row gutter={16} type="flex" justify="space-around" align="middle" className="card-container">
                    <Col xs={24}>
                        <Card bordered={true}
                        >
                        <Meta
                                title="RAPID RESEARCH"
                                avatar={<Avatar size="large" src="/Images/state-example-01.png" />}
                                description="We track the public appearances of 535 members of Congress and over 1500 state government lawmakers and publish the latest events."
                        />
                    </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={true}
                        >                   
                            <Meta
                                title="MOBILIZING"
                                avatar={<Avatar size="large" src="/Images/mobilizing-01.png" />}
                                description="We send instant alerts on local opportunities to Show Up and Speak Out, reaching hundreds of thousands of Americans."
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={true}
                        >
                            <Meta
                                title="ORGANIZING"
                                avatar={<Avatar size="large" src="/Images/road-to-change-01.jpg" />}
                                description="We don’t just track town halls -- we help activists around the country organize their own! We’ve created high-impact, local events with gun violence prevention organizations, labor organizations, and countless grassroots groups."
                            /> 
                    </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={true}> 
                            <Meta
                                title="DIGITAL TOOLS"
                                avatar={<Avatar size="large" src="/Images/tech-01.png" />}
                                description="Our support to partner organizations goes beyond our town hall event data--we also create digital tools to help them better reach their members."
                            /> 
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={true}
                        >
                            <Meta
                                title="ADVOCACY"
                                avatar={<Avatar size="large" src="/Images/th-pledge-01.jpg" />}
                                description=" We celebrate lawmakers who exemplify accessibility to their constituents through our Town Hall Awards, and successful Town Hall Pledge campaign, and we call out those who don’t through our “Missing Members” list. With your help, we’ll make sure town hall accessibility is front and center in every congressional race in the country."
                            /> 
                           </Card>
                    </Col>
                </Row>
            </section>
            <section className="ways-to-give">
                <Card
                    title="OTHER WAYS TO GIVE"
                >
                <ul>
                    <li>Join our leadership circle with a monthly contribution of $83 or a one-time donation of $1,000 or more. </li>
                    <li>Make a corporate contribution to support Town Hall Project.</li>
                    <li>Contribute through your Donor Advised Fund.</li>
                    <li>Consider planning a legacy donation or make a qualified charitable IRA rollover contribution. </li>
                </ul>
                <p>To talk with us about these and other ways to donate to Town Hall Project, please contact Nathan Williams at nwilliams@townhallproject.com.</p>


                <p>Learn more about Town Hall Project on our <a href="#about">ABOUT page.</a></p>
                </Card>
                <div className="donate-form">
                    <Button href="https://secure.actblue.com/donate/thp" type="primary" shape="round" size="large">
                        Donate Today
                    </Button>
                </div>
            </section>
        </div>
    )
}