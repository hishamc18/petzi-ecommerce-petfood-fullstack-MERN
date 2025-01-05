const Product = require('../models/productModel');
const Wishlist = require('../models/wishlistModel');
const CustomError = require('../utils/customError'); 

// Add product to the wishlist
const addToWishlist = async (userId, productId) => {      
  try {
    const product = await Product.findById(productId);
    if (!product) throw new CustomError('Product not found', 404);

    let wishlist = await Wishlist.findOne({ userId: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: userId, items: [] });
    }
    
    let existingProduct = wishlist.items.find((item)=>item.productId.toString() == productId)
    if(existingProduct){
      return {
        message: "Product already exists in the wishlist",
        wishlist,
      };
    }
    wishlist.items.push({productId});
    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw error;
  }
};


const removeFromWishlist = async (userId, productId) => {
  try {
    const result = await Wishlist.updateOne(
      { userId: userId },
      { $pull: { items: { productId: productId } } }
    );

    if (result.modifiedCount === 0) {
      throw new CustomError('Product not found in wishlist', 404);
    }

    return { message: 'Product removed from wishlist successfully' };
  } catch (error) {
    throw error;
  }
};


// Get the user's wishlist
const getWishlist = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: userId }).populate('items.productId');
    if (!wishlist) throw new CustomError('Wishlist not found', 404);
    
    return wishlist;
  } catch (error) {
    throw error;
  }
};

// Clear all products from the wishlist
const clearWishlist = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: userId });
    console.log(wishlist);
    
    if (!wishlist) throw new CustomError('Wishlist not found', 404);

    wishlist.items = [];
    await wishlist.save();
    return wishlist;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
};
