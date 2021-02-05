export const SIGN_UP_LINK = 'join';
export const VOLUNTEER_LINK = 'volunteer';
export const ORGANIZE_A_TOWN_HALL_ID = 'organize';
export const SHARE_LINK = 'upload-video';
export const MISSING_MEMBER_LINK = 'missing-members';
export const TOWN_HALL_PLEDGE_LINK = 'https://www.townhallpledge.com/';
export const FIGHT_FOR_OUR_DEMO_LINK = 'http://fightforourdemocracy.com/';
export const REPORT_2019_LINK = "https://docs.google.com/document/u/1/d/e/2PACX-1vTrbPYgMsrtXauULljeXvscO8SK4-96oFXuwiHycP3XQB8aGD7lGUvkmoz_VO71LAcp508WZ-Yx7DB7/pub";
export const REPORT_2019_ID = "2019-report";
export const REPORT_2020_LINK = "https://docs.google.com/document/u/1/d/e/2PACX-1vSwH66OWsI_TNeRCLUkfdbyEFZkLXi3kIqLoSPbX0k2DzI8bxqKi911UV7AwhY6XjjuosyMT8Rv-gX4/pub";
export const REPORT_2020_ID = "2020-report";
export const ABOUT_LINK = 'about';
export const NEWS_LINK = 'news';
export const RESEARCH_LINK = 'research';

export const TOP_LEVEL_MENU = [
  {
    value: 'submit-event',
    label: 'Submit An Event',
    hash: 'submit'
  }, {
    value: 'take-action',
    label: 'Take Action'
  }, {
    value: 'our-projects',
    label: 'Our Projects'
  }, {
    value: 'learn-more',
    label: 'Learn More'
  }, {
    value: '2020-review',
    label: '2020 In Review'
  }, {
    value: 'donate',
    label: 'Donate Now',
    href: 'https://secure.actblue.com/donate/townhallproject2019'
  },
  
  
]

// eslint-disable-next-line no-undef
export const MENU_MAP = new Map([
  ['submit-event', []],
  ['take-action', [{
      display: 'Get Town Hall Alerts',
      link: SIGN_UP_LINK
    },
    // {
    //   display: 'Volunteer with THP',
    //   link: VOLUNTEER_LINK
    // }, 
    {
      display: 'Organize a Town Hall',
      link: ORGANIZE_A_TOWN_HALL_ID,
    },
    {
      display: 'Share your Town Hall video',
      link: SHARE_LINK
    }
  ]],
  ['our-projects', [
  //   {
  //   display: 'Missing Members',
  //   link: MISSING_MEMBER_LINK
  // }, 
  {
    display: 'Town Hall Pledge',
    link: TOWN_HALL_PLEDGE_LINK,
    external: true,
  },  
  {
    display: 'State Legislatures'
  }]],
  ['learn-more', [{
      display: 'About THP',
      link: ABOUT_LINK
    },
    {
      display: 'THP Year 1',
      link: 'year-one',
      src: "/Images/EOY_2017_Report_Desktop.png",
      mobileSrc: '/Images/EOY_2017_Report_Mobile.png',
      type: 'modal',
      icon: 'calendar',
      background: `#3facef`
    },
    {
      display: 'THP Year 2',
      link: "year-two",
      src: "/Images/lookback2018-Desktop-nobg.png",
      mobileSrc: '/Images/lookback2018-Mobile-nobg.png',
      type: 'modal',
      icon: 'calendar',
      background: `#3facef`
    },
    {
      display: 'THP Year 3',
      link: 'year-three',
      src: "/Images/EOY_2019_Desktop.png",
      mobileSrc: '/Images/EOY_2019_Mobile.png',
      type: 'modal',
      icon: 'calendar',
      background: `#3facef`
    }
  ]],
  ['2020-review', [
    {
      display: '2020 End of Year Report',
      link: REPORT_2020_ID,
      icon: 'file-done'
    },
    // {
    //   display: 'THP Awards',
    //   src: "/Images/awards-2019.png",
    //   type: 'modal',
    //   icon: 'trophy'
    // },
    // {
    //   display: 'Accountability Report Infographic',
    //   src: "/Images/CongressionalAccountabilityReport2019.png",
    //   type: 'modal',
    //   icon: 'area-chart'
    // },
      {
        display: 'THP 2020',
        link: 'year-four',
        src: "/Images/EOY_2020_Desktop_noBG.png",
        mobileSrc: '/Images/EOY_2020_Mobile_noBG.png',
        type: 'modal',
        icon: 'calendar',
        background: `#3facef`
      }
  ]],
  ['donate', []],
]);

export const STATE_LEGISLATURES_MENU = [
  'Arizona',
  'Colorado',
  'Florida',
  'Maine',
  'Maryland',
  'Michigan',
  'Nevada',
  'North Carolina',
  'Oregon',
  'Pennsylvania',
  'Virginia'
]