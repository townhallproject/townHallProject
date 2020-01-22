export const SIGN_UP_LINK = 'join';
export const VOLUNTEER_LINK = 'volunteer';
export const ORGANIZE_A_TOWN_HALL_ID = 'organize';
export const SHARE_LINK = 'upload-video';
export const MISSING_MEMBER_LINK = 'missing-members';
export const TOWN_HALL_PLEDGE_LINK = 'https://www.townhallpledge.com/';
export const FIGHT_FOR_OUR_DEMO_LINK = 'http://fightforourdemocracy.com/';
export const REPORT_2019_LINK = "https://docs.google.com/document/u/1/d/e/2PACX-1vTrbPYgMsrtXauULljeXvscO8SK4-96oFXuwiHycP3XQB8aGD7lGUvkmoz_VO71LAcp508WZ-Yx7DB7/pub";
export const REPORT_2019_ID = "2019-report";
export const ABOUT_LINK = 'about';
export const NEWS_LINK = 'news';
export const RESEARCH_LINK = 'research';

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
  ['our-projects', [{
    display: 'Missing Members',
    link: MISSING_MEMBER_LINK
  }, {
    display: 'Town Hall Pledge',
    link: TOWN_HALL_PLEDGE_LINK,
    external: true,
  }, {
    display: 'Fight for Our Democracy',
    link: FIGHT_FOR_OUR_DEMO_LINK,
    external: true,
  }, {
    display: 'State Legislatures'
  }]],
  ['learn-more', [{
    display: 'About THP',
    link: ABOUT_LINK
  }, ]],
  ['2019-review', [{
      display: 'Accessibly Report',
      link: REPORT_2019_ID
    },
    {
      display: 'THP Awards',
      link: RESEARCH_LINK
    },
    {
      display: 'Accessibility Report Infographic',
      link: RESEARCH_LINK
    },
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