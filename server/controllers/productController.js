const asyncHandler = require('../middlewares/asyncHandler');
const productServices = require('../services/productService');

//get product (id/category/all)
exports.getproduct = asyncHandler(async (req, res) => {    
  const { id } = req.params;
  const { page = 1, limit = 12, name, category } = req.query;

  const { products, total, totalCatProducts, totalDogProducts } = await productServices.getProductsService({
    id,
    category,
    page: parseInt(page),
    limit: parseInt(limit),
    name,
  });

  return res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    products,
    totalCatProducts, totalDogProducts

  });
});


// Add a new product
exports.addProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  if (req.file && req.file.path) {
    productData.image = req.file.path;
  } else {
    return res.status(400).json({
      success: false,
      message: 'Image upload failed. Please include a valid image file.',
    });
  }

  // Call the service to add the product
  const product = await productServices.addProduct(productData);
  res.status(201).json({
    success: true,
    message: 'Product added successfully',
    product,
  });
});



//delete product (soft delete)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params; 

  await productServices.deleteProduct(productId);
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});




// edit Product
exports.editProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updateData = req.body;
  
  if (req.file) {
    updateData.image = req.file.path; 
  }
  const updatedProduct = await productServices.editProduct(productId, updateData);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product: updatedProduct,
  });
});