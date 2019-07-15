
import svgIcon from '@/components/svgIcon';
import remoteJs from '@/components/remoteJs';
import orderInfo from '@/components/orderInfo';

const Yto = {
  install: function (Vue) {
    Vue.component('svgIcon', svgIcon);
    Vue.component('remoteJs', remoteJs);
    Vue.component('orderInfo', orderInfo);
  }
};

export default Yto;
