import React from "react";

const About = props => {
  return (
    <React.Fragment>
      <header>
        <section className="container container-fluid quote-header">
          <blockquote className="col-sm-6 col-sm-offset-3">
            <p className="text-white">
              "It falls to each of us to be those anxious, jealous guardians of
              our democracy. Embrace the joyous task we have been given to
              continually try to improve this great nation of ours because, for
              all our outward differences, we in fact all share the same proud
              type, the most important office in a democracy,
              <span className="text-secondary">citizen</span>."
            </p>
            <footer className="text-success">
              President Obama,
              <cite title="Source Title">Farewell Address</cite>
            </footer>
          </blockquote>
        </section>
      </header>
      <section className="container">
        <article className="center-block about">
          <h2 className="text-secondary-dark">About Town Hall Project</h2>
          <p className="lead">Town Hall Project is dedicated to the conviction that our democracy is stronger, fairer, and 
                  better when Americans and their elected representatives regularly meet face-to-face.
                  Our work empowers constituents across the country to have face-to-face conversations with their elected 
                  representatives.</p>
          <p className="text-primary">
            <strong>Show Up. Speak Out.</strong>
          </p>
        </article>
        <article className="row">
          <div className="col-sm-6">
            <h3>About the Events</h3>
            <p>
              Our project is currently focused on federal elected officials. We
              strongly believe that state legislatures deserve attention and
              citizen engagement, but at the moment these events are outside our
              current mission.
            </p>

            <p>Our event listing includes:</p>
            <ul>
              <li>Town halls</li>
              <li>
                Other public events with members of Congress in their
                district/state
              </li>
              <li>Ticketed events in the district/state</li>
              <li>Staff office hours</li>
              <li>
                Opportunities in Washington, D.C. to speak with your
                representative
              </li>
            </ul>
            <p>We do not currently include:</p>
            <ul>
              <li>Fundraisers outside the district/state</li>
              <li>
                Inappropriate events to ask policy questions (e.g. funerals)
              </li>
              <li>Campaign events where the member will not take questions</li>
            </ul>
          </div>
          <div className="col-sm-6">
            <h3>What to expect</h3>
            <p>
              The most powerful thing you can do, as a constituent, is ask an
              earnest, pressing question on an issue close to you.
              <strong>Your personal story is incredibly valuable.</strong> It’s
              precisely how sometimes dry policy is connected with the lives of
              real people. It’s not always easy to speak up, but these times
              call for courage in all of us. Take the mic and tell your
              representative why she or he needs to act in your best interest.
            </p>
            <p>
              The Town Hall Project strongly encourages you to only attend and
              ask questions of your own representatives. Remember that any town
              hall has limited time, and a question you take is one less
              question for a constituent.
            </p>

            <p>For more, we recommend:</p>
            <ul>
              <li>
                Indivisible's
                <a
                  href="https://indivisible.org/resource/town-hall-guide"
                  target="_blank"
                >
                  {" "}
                  Town Hall strategy resources
                </a>
              </li>
            </ul>
          </div>
        </article>
        <article className="row">
          <div className="col-sm-6">
            <h3>Why Town Halls</h3>
            <p>
              There is no better way to influence your representatives than
              in-person conversations. Town halls are a longstanding American
              tradition--where our elected representatives must listen and
              respond to the concerns of their constituents. Remember: you are
              their boss.
            </p>
            <p>
              We believe every citizen, no matter the party of their members of
              Congress, should have the opportunity to speak with his or her
              representatives.
            </p>
            <p>
              You have more power than you think. Town halls are one of the most
              effective ways to use it.
            </p>
          </div>
          <div className="col-sm-6">
            <h3>Our Supporters</h3>
            <p>
              Town Hall Project is possible because of the hard work of
              researchers, organizers, and developers across country, and the
              generous support of hundreds of grassroots donors.
            </p>
          </div>
        </article>
      </section>
      <div className="banner" id="hand-raised"></div>
      <section className="container mt-5">
        <h3>Frequently Asked Questions</h3>
        <div
          className="panel-group"
          id="accordion"
          role="tablist"
          aria-multiselectable="true"
        >
          <div className="panel panel-default">
            <div className="panel-heading" role="tab">
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#canIJoin"
                  aria-expanded="true"
                  aria-controls="canIJoin"
                >
                  Can I join you?
                </a>
              </h4>
            </div>
            <div
              id="canIJoin"
              className="panel-collapse collapse in"
              role="tabpanel"
              aria-labelledby="Can I Join You?"
            >
              <div className="panel-body">
                Yes! If you are interested in joining our volunteer research
                team or have more specialized skills like web development,
                contact us at{" "}
                <a href="mailto:info@townhallproject.com">
                  info@townhallproject.com
                </a>
                .
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading" role="tab">
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#canISupport"
                  aria-expanded="true"
                  aria-controls="canISupport"
                >
                  Can I support you?
                </a>
              </h4>
            </div>
            <div
              id="canISupport"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="Can I support you?"
            >
              <div className="panel-body">
                Yes! Town Hall Project relies on grassroots donations like yours
                to continue to bring rapid event research to engaged Americans
                nationwide. Please make a donation here. If you are interested
                in a larger or ongoing donation, or represent a granting
                foundation, please contact us at{" "}
                <a href="mailto:info@townhallproject.com">
                  info@townhallproject.com
                </a>
                .
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading" role="tab">
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#ourStory"
                  aria-expanded="true"
                  aria-controls="ourStory"
                >
                  What’s your story?
                </a>
              </h4>
            </div>
            <div
              id="ourStory"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="What's your story?"
            >
              <div className="panel-body">
                <p>
                  At the beginning of 2017, a small group of fellow organizers
                  and activists gathered together to build a single public
                  database of all public events by members of Congress. We
                  believed that congressional town halls would play an
                  enormously important role in this chapter of our democracy,
                  but were surprised to discover just how difficult information
                  about these events was to find.
                </p>

                <p>
                  Read more at{" "}
                  <a href="https://www.washingtonpost.com/news/inspired-life/wp/2017/02/17/have-something-to-say-to-your-member-of-congress-these-guys-are-making-it-easier-to-find-them/">
                    The Washington Post
                  </a>
                </p>

                <p>
                  Today we are proud to research and publish events with federal
                  and state lawmakers, create new opportunities for civic
                  activism, and find even more ways for Americans to Show Up and
                  Speak Out. And there’s more to come…
                </p>
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading" role="tab">
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#politicalPerspective"
                  aria-expanded="true"
                  aria-controls="politicalPerspective"
                >
                  What is your political perspective?
                </a>
              </h4>
            </div>
            <div
              id="politicalPerspective"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="What is your political perspective?"
            >
              <div className="panel-body">
                <p>
                  We are transparent that the bulk of Town Hall Project staff
                  and volunteers share largely progressive policy views. We make
                  no secret of our work of other progressive organizations and
                  our opposition to this Administration’s most extreme policies.
                </p>

                <p>
                  But we don’t pull any punches with our research. We list every
                  town hall held by Republicans, Democrats, and Independents.
                  And we will call out “Missing Members” (those who refuse to
                  hold town halls) of all parties.
                </p>

                <p>
                  We encourage all Americans, regardless of partisan leanings,
                  to attend public events with your members of Congress and make
                  your voice heard. From the bluest district to the reddest, and
                  everything in between, every single member of Congress will
                  represent their constituents better by listening to them.
                </p>
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading" role="tab">
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#townhallcom"
                  aria-expanded="true"
                  aria-controls="townhallcom"
                >
                  Are you affiliated with townhall.com?
                </a>
              </h4>
            </div>
            <div
              id="townhallcom"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="Are you affiliated with townhall.com?"
            >
              <div className="panel-body">Nope.</div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading" role="tab">
              <h4 className="panel-title">
                <a
                  role="button"
                  data-toggle="collapse"
                  data-parent="#accordion"
                  href="#whoAreYou"
                  aria-expanded="true"
                  aria-controls="whoAreYou"
                >
                  Who are you?
                </a>
              </h4>
            </div>
            <div
              id="whoAreYou"
              className="panel-collapse collapse"
              role="tabpanel"
              aria-labelledby="Are you affiliated with whoAreYou?"
            >
              <div className="panel-body">
                <p>
                  Town Hall Project would not be possible without the hard work
                  and talent of dozens of research volunteers, web developers,
                  communications experts, and advisers.
                </p>

                <p>
                  <b>Our leadership team:</b>
                </p>

                <p>
                  <b>Nathan Williams</b> - Executive Director - Nathan
                  co-founded Town Hall Project in 2017. Previously Nathan worked
                  on candidate and issue campaigns, including the 2008 Obama
                  campaign. He is also an award-winning independent filmmaker.
                </p>

                <p>
                  <b>Megan Riel-Mehan</b> - Lead Web Developer - Megan is a PhD
                  chemical biologist and experienced web developer, currently
                  specializing in visualizing cell biology at the Allen
                  Institute in Seattle.
                </p>

                <p>
                  <b>Jenita Igwealor</b> - National Organizing Director - Jenita
                  has worked in politics and labor for over ten years, including
                  the 2008 and 2012 Obama campaigns. She has developed training
                  programs for campaign staff and community activists interested
                  in pay equity advocacy, civic engagement, and education
                  affordability.
                </p>

                <p>
                  <b>Zoë Tapert</b> - Deputy Organizing Director - Zoë
                  previously worked on candidate and issue campaigns in Oregon,
                  including a major state carbon pricing campaign. In 2019, she
                  partnered with Town Hall Project to expand state legislature
                  research to Oregon. Zoë graduated from the University of
                  Portland in 2019 with a BA in Environmental Ethics and Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container">
        <article className="row">
          <div className="col-sm-5 col-offset-1">
            <h3>Can I send you town halls that I find?</h3>
            <p>
              Yes! Please send town hall or any other congressional events to us
              <a href="#submit">here</a>. Please include as much detail as you
              can, including a date, time, and link or other source of the event
              information.
            </p>
          </div>
          <div className="col-sm-5 col-sm-offset-2">
            <h3>What if my representatives have no public events scheduled?</h3>
            <p>
              Call their
              <a
                href="https://www.govtrack.us/congress/members"
                target="_blank"
              >
                district offices
              </a>{" "}
              and let them know you expect them to hold public events with their
              constituents. To have even more impact, join with other citizens
              in your district or state and organize group efforts. Visit the
              district office together, deliver petitions, inform your local
              press, or even hold an “Empty Chair” town hall and invite your
              member of Congress to fill that chair.
            </p>
          </div>
        </article>
        <article className="row text-center">
          <h3>Get connected locally!</h3>
          <p>
            <a data-toggle="tab" className="hash-link" href="#contact">
              Contact us{" "}
            </a>
            and one of our organizers will connect you with groups in your area.
          </p>
          <a
            className="privacy-policy-button"
            data-toggle="tab"
            href="#privacy-policy"
          >
            Privacy Policy
          </a>
        </article>
        <div className="col-sm-4"></div>
      </section>
      <section className="container">
        <div className="row">
          <div className="col-sm-12" id="disclaimer">
            <small>
              The information available on or from this website is compiled by
              Town Hall Project volunteers and provided for general
              informational purposes only. While all efforts are made to verify
              accuracy of events, event details can change at short notice and
              are not guaranteed to be complete or up-to-date. Please contact
              your representative’s office to confirm. Town Hall Project shall
              not be liable for any special or consequential damages that result
              from the direct or indirect use of, or the inability to use, the
              information on this site.
            </small>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default About;
