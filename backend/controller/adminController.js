const { Coupon }= require ('../schema/cuponModel.js');
const mongoose = require('mongoose');



const addNewCoupon = async (req, res, next) => {
  try {
      const { 
          code, 
          value, 
          type = '', 
          isActive, 
          description = ''
          // Ignore status and claimedBy from req.body
      } = req.body;

      // Validations
      if (!code || !value) {
          return res.status(400).json({ error: 'Code and value are required fields' });
      }

      if (value <= 0) {
          return res.status(400).json({ error: 'Value must be a positive number' });
      }

      if (type === 'percentage' && value > 100) {
          return res.status(400).json({ error: 'Percentage value cannot exceed 100' });
      }

      // Create coupon with fixed status and empty claimedBy
      const newCoupon = await Coupon.create({
          code: code.toUpperCase().trim(),
          value,
          type,
          isActive,
          description: description.trim(),
          claimedBy: {  // Always initialize as empty
              ip: '',
              sessionId: '',
              userAgent: ''
          },
          status: 'Available'  // Always set to 'Available'
      });

      res.status(201).json({
          status: 'Created Successfully',
          data: {
              coupon: newCoupon
          }
      });

  } catch (err) {
      // Handle duplicate code error
      if (err.code === 11000) {
          return res.status(400).json({ error: 'Coupon code already exists' });
      }
      next(err); // Pass other errors to the global error handler
  }
};


const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Coupon ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid coupon ID format' });
    }

    // Prepare update object with only allowed fields (excluding claimedAt and claimedBy)
    const allowedFields = ['code', 'value', 'type', 'isActive', 'description', 'status'];
    const filteredUpdate = {};

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        // Special handling for code (uppercase and trim)
        if (key === 'code') {
          filteredUpdate[key] = updateData[key].toUpperCase().trim();
        }
        // Special handling for status (capitalize first letter)
        else if (key === 'status') {
          const lowerStatus = updateData[key].toLowerCase();
          if (lowerStatus === 'available' || lowerStatus === 'claimed') {
            filteredUpdate[key] = lowerStatus.charAt(0).toUpperCase() + lowerStatus.slice(1);
          }
        }
        else {
          filteredUpdate[key] = updateData[key];
        }
      }
    });

    // Validate value if being updated
    if (filteredUpdate.value) {
      if (filteredUpdate.value <= 0) {
        return res.status(400).json({ error: 'Value must be a positive number' });
      }
      if (filteredUpdate.type === 'percentage' && filteredUpdate.value > 100) {
        return res.status(400).json({ error: 'Percentage value cannot exceed 100' });
      }
    }

    // Find and update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      filteredUpdate,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(400).json({ error: 'No coupon found with that ID' });
    }

    res.status(200).json({
      status: 'Successfully Updated',
      data: {
        coupon: updatedCoupon
      }
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    next(err);
  }
};

  const getAllCoupon = async (req, res, next) => {
    try {
        const { status } = req.query;
        
        // Build the query
        const query = {};
        
        // Normalize status to lowercase for comparison
        const normalizedStatus = status?.toLowerCase();
        
        // Apply status filter if provided
        if (normalizedStatus === 'available') {
          query.claimedAt = { $exists: false };
          query.status = 'Available'; // Match the stored capitalized format
        } else if (normalizedStatus === 'claimed') {
          query.claimedAt = { $exists: true };
          query.status = 'Claimed'; // Match the stored capitalized format
        }
        
        // Find coupons with the filter
        const coupons = await Coupon.find(query)
          .sort({ createdAt: -1 }); // Newest first
        
        res.status(200).json({
          status: 'Fetched Successfully',
          results: coupons.length,
          data: {
            coupons
          }
        });
        
    } catch (err) {
        next(new AppError('Failed to fetch coupons', 500));
    }
};


const getAdminOverviewofClaim = async (req, res, next) => {
    try {
        // Optional filters from query params
        const { couponCode } = req.query;
        const query = {
            status: 'Claimed',  // Use capitalized 'Claimed' to match your schema
            claimedAt: { $exists: true, $ne: null }  // Ensure claimedAt exists and isn't null
        };

        // Filter by coupon code (case-insensitive)
        if (couponCode) {
            query.code = { 
                $regex: couponCode.toUpperCase(), 
                $options: 'i' 
            };
        }

        // Fetch all matching coupons, newest claims first
        const coupons = await Coupon.find(query)
            .sort({ claimedAt: -1 }) // Newest to oldest
            .select('-__v'); // Exclude version key

        res.status(200).json({
            status: 'Successfully Fetched',
            results: coupons.length,
            data: {
                coupons
            }
        });

    } catch (err) {
        next(err);
    }
};
  
module.exports={
    addNewCoupon,
    updateCoupon,
    getAllCoupon,
    getAdminOverviewofClaim
}