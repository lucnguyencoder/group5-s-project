const StoreOrderService = require('../../services/store/StoreOrderService');
const CategoryService = require('../../services/store/CategoryService');
const { Order, StoreProfile, Food } = require('../../models');

const storeDashboardController = {
  getDashboard: async (req, res) => {
    try {
      const userId = req.user.id;
      //  storeId 
      let storeId = null;
      if (req.user.storeProfile && (req.user.storeProfile.store_id || req.user.storeProfile.storeId)) {
        storeId = req.user.storeProfile.store_id || req.user.storeProfile.storeId;
      } else if (req.user.store_profile && (req.user.store_profile.store_id || req.user.store_profile.storeId)) {
        storeId = req.user.store_profile.store_id || req.user.store_profile.storeId;
      } else if (req.query.storeId) {
        storeId = req.query.storeId;
      } else {
        //  StoreProfile
        const storeProfile = await StoreProfile.findOne({ where: { user_id: userId } });
        if (storeProfile) {
          storeId = storeProfile.store_id;
        }
      }
      if (!storeId) {
        return res.status(400).json({ success: false, message: 'Missing storeId' });
      }
      // Total order 
      const orders = await Order.findAll({ where: { store_id: storeId } });
      let orderStats = { success: 0, pending: 0, total: 0, revenueSuccess: 0, revenuePending: 0 };
      orders.forEach(order => {
        if (order.is_completed) {
          orderStats.success++;
          orderStats.revenueSuccess += parseFloat(order.final_price);
        } else {
          orderStats.pending++;
          orderStats.revenuePending += parseFloat(order.final_price);
        }
        orderStats.total++;
      });
      //total category
      const categoryCount = await CategoryService.getAllCategories(storeId, '', 1, 1);
      // total products
      const productCount = await Food.count({ where: { store_id: storeId } });
      return res.json({
        success: true,
        data: {
          orderStats,
          categoryCount: categoryCount.totalCount || 0,
          productCount: productCount || 0
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = storeDashboardController; 