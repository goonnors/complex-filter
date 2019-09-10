import initialData from '@/assets/static/initialData';
import mockData from '@/assets/static/mockData';

export default {
  getInitialData() {
    return new Promise(function(resolve) {
      setTimeout(() => resolve(initialData), 500);
    });
  },

  getMockData() {
    return new Promise(function(resolve) {
      setTimeout(() => resolve(mockData), 500);
    });
  }
}
