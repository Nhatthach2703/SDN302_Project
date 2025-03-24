const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
var mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.render('products/listadmin', { products, user: req.user || null });
    } catch (error) {
        res.status(500).send('Server error');
    }
};


exports.getProductsByCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const categoryId = req.query.category;

        const skip = (page - 1) * limit;

        const filter = categoryId ? { category: categoryId } : {};

        const totalProducts = await Product.countDocuments(filter);

        if (totalProducts === 0) {
            return res.render('products/listuser', {
                products: [],
                user: req.user || null,
                currentPage: page,
                totalPages: 0,
                totalProducts: 0,
                limit,
                categoryId
            });
        }

        const products = await Product.find(filter)
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalProducts / limit);

        const paginationData = {
            products,
            user: req.user || null,
            currentPage: page,
            totalPages,
            totalProducts,
            limit,
            categoryId
        };

        res.render('products/listuser', paginationData);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).send('Server error');
    }
};

// Hàm tạo query lọc theo tên
const filterByName = (keyword) => ({
    name: { $regex: new RegExp(keyword, 'i') }
});

exports.suggestProducts = async (req, res) => {
    try {

        const keyword = req.query.keyword;
        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        const query = {
            $or: [filterByName(keyword)]
        };

        const products = await Product.find(query)
            .populate('category', 'name')

        console.log(products)
        res.status(200).json(products);
    } catch (error) {
        console.error('Error suggesting products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
    try {

        const keyword = req.query.keyword;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const categoryId = req.query.category;

        const skip = (page - 1) * limit;



        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        // Tìm theo cả name và type
        const query = {
            $or: [filterByName(keyword)]
        };

        const products = await Product.find(query)
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });;

        const totalProducts = products.length;
        if (!products.length) {
            return res.render('products/searchList', {
                products: [],
                user: req.user || null,
                currentPage: page,
                totalPages: 0,
                totalProducts: 0,
                limit,
                categoryId
            });
        }
        const totalPages = Math.ceil(totalProducts / limit);

        const paginationData = {
            products,
            user: req.user || null,
            currentPage: page,
            totalPages,
            totalProducts,
            limit,
            categoryId
        };

        res.render('products/searchList', paginationData);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Lấy thông tin chi tiết sản phẩm user
exports.getProductDetail = async (req, res) => {
    try {
        console.log("search")
        // Lấy ID sản phẩm từ query
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('Invalid product ID');
        }

        // Lấy thông tin sản phẩm hiện tại và populate category
        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Các ID của danh mục Dog và Cat
        const dogCategoryId = '67cfb5625b64caf653f70ebc';
        const catCategoryId = '67cfb5695b64caf653f70ebe';
        const accessoryCategoryId = '67cfb5a25b64caf653f70ec0';
        const foodDrinksCategoryId = '67cff3f4a92e227c8ffbaf50';
        const otherServiceCategoryId = '67cff3f5a92e227c8ffbaf51'; // Giả định

        // Xác định danh mục hiện tại
        const currentCategoryId = product.category._id.toString();
        let relatedProducts = [];

        // Logic lấy sản phẩm liên quan
        if (currentCategoryId === dogCategoryId || currentCategoryId === catCategoryId) {
            // Nếu đang xem Dog hoặc Cat, lấy sản phẩm từ cùng danh mục
            relatedProducts = await Product.find({
                category: currentCategoryId,
                _id: { $ne: productId } // Không lấy sản phẩm đang xem
            })
                .populate('category', 'name')
                .limit(4); // Giới hạn 4 sản phẩm
        } else if (
            currentCategoryId === accessoryCategoryId ||
            currentCategoryId === foodDrinksCategoryId ||
            currentCategoryId === otherServiceCategoryId
        ) {
            // Nếu đang xem Accessory, Food & Drinks, hoặc Other Service, lấy sản phẩm từ Dog và Cat
            relatedProducts = await Product.find({
                category: { $in: [dogCategoryId, catCategoryId] },
                _id: { $ne: productId }
            })
                .populate('category', 'name')
                .limit(4); // Giới hạn 4 sản phẩm
        }

        // Dữ liệu truyền vào template
        const data = {
            product,
            relatedProducts,
            user: req.user || null
        };

        // Render template
        res.render('products/detailuser', data);
    } catch (error) {
        console.error('Error fetching product detail:', error);
        res.status(500).send('Server error');
    }
};

// Gợi ý sản phẩm


// Render trang tìm kiếm
exports.getSearchPage = async (req, res) => {
    try {
        console.log("search")
        // Lấy ID sản phẩm từ query
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('Invalid product ID');
        }

        // Lấy thông tin sản phẩm hiện tại và populate category
        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Các ID của danh mục Dog và Cat
        const dogCategoryId = '67cfb5625b64caf653f70ebc';
        const catCategoryId = '67cfb5695b64caf653f70ebe';
        const accessoryCategoryId = '67cfb5a25b64caf653f70ec0';
        const foodDrinksCategoryId = '67cff3f4a92e227c8ffbaf50';
        const otherServiceCategoryId = '67cff3f5a92e227c8ffbaf51'; // Giả định

        // Xác định danh mục hiện tại
        const currentCategoryId = product.category._id.toString();
        let relatedProducts = [];

        // Logic lấy sản phẩm liên quan
        if (currentCategoryId === dogCategoryId || currentCategoryId === catCategoryId) {
            // Nếu đang xem Dog hoặc Cat, lấy sản phẩm từ cùng danh mục
            relatedProducts = await Product.find({
                category: currentCategoryId,
                _id: { $ne: productId } // Không lấy sản phẩm đang xem
            })
                .populate('category', 'name')
                .limit(4); // Giới hạn 4 sản phẩm
        } else if (
            currentCategoryId === accessoryCategoryId ||
            currentCategoryId === foodDrinksCategoryId ||
            currentCategoryId === otherServiceCategoryId
        ) {
            // Nếu đang xem Accessory, Food & Drinks, hoặc Other Service, lấy sản phẩm từ Dog và Cat
            relatedProducts = await Product.find({
                category: { $in: [dogCategoryId, catCategoryId] },
                _id: { $ne: productId }
            })
                .populate('category', 'name')
                .limit(4); // Giới hạn 4 sản phẩm
        }

        // Dữ liệu truyền vào template
        const data = {
            product,
            relatedProducts,
            user: req.user || null
        };

        // Render template
        res.render('products/detailuser', data);
    } catch (error) {
        console.error('Error fetching product detail:', error);
        res.status(500).send('Server error');
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.render('products/detailuser', { product, user: req.user || null });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Render the add product page
exports.getAddProductPage = async (req, res) => {
    try {
        const categories = await Category.find(); // Get category list
        res.render('products/addadmin', { categories, user: req.user || null }); // Render EJS page
    } catch (error) {
        console.error("Error loading add product page:", error);
        res.status(500).send("Error loading add product page");
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, category, price, stock, image, description, petDetails } = req.body;

        // Kiểm tra xem category có phải là ObjectId hợp lệ không
        let existingCategory;
        if (category.match(/^[0-9a-fA-F]{24}$/)) {
            existingCategory = await Category.findById(category);
        } else {
            existingCategory = await Category.findOne({ name: category });
        }

        if (!existingCategory) {
            return res.status(400).json({ error: "Invalid category" });
        }

        // Chuẩn bị dữ liệu sản phẩm
        let productData = {
            name,
            category: existingCategory._id,
            price,
            stock,
            image,
            description,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Kiểm tra nếu danh mục là "dog" hoặc "cat" thì cần petDetails
        if (["dog", "cat"].includes(existingCategory.name.toLowerCase())) {
            let parsedPetDetails = petDetails;

            // Kiểm tra nếu petDetails là JSON string thì chuyển đổi
            if (typeof petDetails === "string") {
                try {
                    parsedPetDetails = JSON.parse(petDetails);
                } catch (err) {
                    return res.status(400).json({ error: "Invalid pet details format" });
                }
            }

            // Kiểm tra dữ liệu petDetails hợp lệ
            if (!parsedPetDetails || !parsedPetDetails.age || !parsedPetDetails.weight) {
                return res.status(400).json({ error: "Pet details (age and weight) are required for pet products" });
            }

            productData.petDetails = {
                age: parsedPetDetails.age,
                weight: parsedPetDetails.weight,
                character: parsedPetDetails.character || ""
            };
        }

        // Tạo sản phẩm mới
        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).redirect('/products/admin');
    } catch (error) {
        console.error("Error while creating product:", error);
        res.status(500).json({ error: "Server error while adding product" });
    }
};




// Render the edit product page
exports.getEditProductPage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).render("products/editadmin", { error: "Invalid product ID", product: null, categories: [], user: req.user || null });
        }

        const product = await Product.findById(id).populate("category", "name");

        if (!product) {
            return res.status(404).render("products/editadmin", { error: "Product not found", product: null, categories: [], user: req.user || null });
        }

        const categories = await Category.find();
        res.render("products/editadmin", { product, categories, error: null, user: req.user || null }); // Pass error = null to avoid issues
    } catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).render("products/editadmin", { error: "Server error", product: null, categories: [], user: req.user || null });
    }
};

// Update product information
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).render("products/editadmin", {
                error: "Invalid product ID",
                product: null,
                categories: await Category.find(), // Load product categories
                user: req.user || null
            });
        }

        // Extract data from request
        const { name, category, price, stock, image, description, petDetails } = req.body;

        // Validate required fields
        if (!name || !category || !price || !stock) {
            return res.status(400).render("products/editadmin", {
                error: "Please fill in all required product details",
                product: { _id: id, name, category, price, stock, image, description, petDetails },
                categories: await Category.find(),
                user: req.user || null
            });
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, category, price, stock, image, description, petDetails, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        // Check if product exists
        if (!updatedProduct) {
            return res.status(404).render("products/editadmin", {
                error: "Product not found",
                product: null,
                categories: await Category.find(),
                user: req.user || null
            });
        }

        // Redirect to product list after successful update
        res.redirect("/products/admin");

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).render("products/editadmin", {
            error: "Server error, please try again!",
            product: null,
            categories: await Category.find(),
            user: req.user || null
        });
    }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.redirect('/products/admin');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
