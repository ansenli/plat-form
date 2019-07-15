import login from './login';
import accountManage from './accountManage';
// import waybillPrinting from './waybillPrinting';
// import finance from './finance';
import common from './common';
import order from './order';
// import issue from './issue';
import myFortune from './myFortune';
import home from './home';
import userClaim from './userClaim';

export default {...login, ...home, ...common, ...accountManage, ...order, ...myFortune, ...userClaim};
