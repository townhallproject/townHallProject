export const SIGN_UP_LINK = 'join';
export const VOLUNTEER_LINK = 'volunteer';
export const ORGANIZE_A_TOWN_HALL_LINK = 'organize';
export const SHARE_LINK = 'upload-video';
export const MISSING_MEMBER_LINK = 'missing-members';
export const TOWN_HALL_PLEDGE_LINK = 'https://www.townhallpledge.com/';
export const FIGHT_FOR_OUR_DEMO_LINK = 'http://fightforourdemocracy.com/';
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
  // {
  //   display: 'Organize a Town Hall',
  //   link: ORGANIZE_A_TOWN_HALL_LINK
  // }, 
  {
    display: 'Share your Town Hall video',
    link: SHARE_LINK
  }]],
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
  }, 
  // {
  //   display: 'In the News',
  //   link: NEWS_LINK
  // }, {
  //   display: 'Our Research',
  //   link: RESEARCH_LINK
  // }
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