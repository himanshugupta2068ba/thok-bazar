const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Deal = require('../models/Deal');
const calculateDiscountPercentage = require('../util/discountCalculator');

const ACTIVE_DEAL_CACHE_TTL_MS = 30 * 1000;
const PRODUCT_LIST_SELECT = [
    'title',
    'description',
    'mrpPrice',
    'sellingPrice',
    'category',
    'stock',
    'images',
    'sellerId',
    'discountPercentage',
    'mainCategory',
    'subCategory',
    'subSubCategory',
    'color',
    'size',
    'specifications',
].join(' ');

class ProductService {
    constructor() {
        this.activeDealCache = {
            dealMaps: null,
            expiresAt: 0,
        };
    }

    clearActiveDealCache() {
        this.activeDealCache = {
            dealMaps: null,
            expiresAt: 0,
        };
    }

    async getActiveDealMaps() {
        if (this.activeDealCache.dealMaps && Date.now() < this.activeDealCache.expiresAt) {
            return this.activeDealCache.dealMaps;
        }

        const deals = await Deal.find({ $or: [{ isActive: true }, { isActive: { $exists: false } }] })
            .populate('category', 'categoryId')
            .select('discount category productIds isActive')
            .lean();

        const categoryDealMap = new Map();
        const productDealMap = new Map();

        deals.forEach((deal) => {
            const discount = Number(deal?.discount || 0);
            if (!discount || discount <= 0) {
                return;
            }

            const categoryId = String(deal?.category?.categoryId || '').trim();
            if (categoryId) {
                const existing = categoryDealMap.get(categoryId);
                if (!existing || Number(existing.discount || 0) < discount) {
                    categoryDealMap.set(categoryId, deal);
                }
            }

            const productIds = Array.isArray(deal?.productIds) ? deal.productIds : [];
            productIds.forEach((productId) => {
                const key = String(productId || '').trim();
                if (!key) {
                    return;
                }
                const existing = productDealMap.get(key);
                if (!existing || Number(existing.discount || 0) < discount) {
                    productDealMap.set(key, deal);
                }
            });
        });

        const dealMaps = { categoryDealMap, productDealMap };
        this.activeDealCache = {
            dealMaps,
            expiresAt: Date.now() + ACTIVE_DEAL_CACHE_TTL_MS,
        };

        return dealMaps;
    }

    findDealForProduct(product, dealMaps) {
        const { categoryDealMap, productDealMap } = dealMaps;
        const productId = String(product?._id || '').trim();

        if (productId && productDealMap.has(productId)) {
            return productDealMap.get(productId);
        }

        const categoryCandidates = [
            product?.subSubCategory,
            product?.subCategory,
            product?.mainCategory,
            product?.category?.categoryId,
        ].map((value) => String(value || '').trim()).filter(Boolean);

        for (const categoryId of categoryCandidates) {
            if (categoryDealMap.has(categoryId)) {
                return categoryDealMap.get(categoryId);
            }
        }

        return null;
    }

    applyDealToProduct(product, dealMaps) {
        const rawProduct = product?.toObject ? product.toObject() : product;
        const matchingDeal = this.findDealForProduct(rawProduct, dealMaps);
        const mrpPrice = Number(rawProduct?.mrpPrice || 0);
        const baseSellingPrice = Number(rawProduct?.sellingPrice || 0);
        const baseDiscountPercentage = Number(
            rawProduct?.discountPercentage || calculateDiscountPercentage(mrpPrice, baseSellingPrice),
        );

        if (!matchingDeal) {
            return {
                ...rawProduct,
                dealApplied: false,
                activeDeal: null,
                dealSellingPrice: baseSellingPrice,
                effectiveSellingPrice: baseSellingPrice,
                effectiveDiscountPercentage: baseDiscountPercentage,
                baseSellingPrice,
                baseDiscountPercentage,
            };
        }

        const dealDiscount = Number(matchingDeal?.discount || 0);
        const dealSellingPrice = Math.max(
            0,
            Number((baseSellingPrice * (1 - dealDiscount / 100)).toFixed(2)),
        );

        return {
            ...rawProduct,
            dealApplied: true,
            activeDeal: {
                id: matchingDeal?._id,
                discount: dealDiscount,
                categoryId: matchingDeal?.category?.categoryId || null,
                isProductSpecific: Array.isArray(matchingDeal?.productIds) && matchingDeal.productIds.length > 0,
            },
            dealSellingPrice,
            effectiveSellingPrice: dealSellingPrice,
            effectiveDiscountPercentage: calculateDiscountPercentage(mrpPrice, dealSellingPrice),
            baseSellingPrice,
            baseDiscountPercentage,
        };
    }

    async buildDealProductFilter(dealId) {
        const normalizedDealId = String(dealId || '').trim();

        if (!normalizedDealId || !mongoose.Types.ObjectId.isValid(normalizedDealId)) {
            return null;
        }

        const deal = await Deal.findOne({
            _id: normalizedDealId,
            $or: [{ isActive: true }, { isActive: { $exists: false } }],
        })
            .populate('category', 'categoryId')
            .select('category productIds')
            .lean();

        if (!deal) {
            return null;
        }

        const productIds = Array.isArray(deal.productIds) ? deal.productIds.filter(Boolean) : [];

        if (productIds.length) {
            return {
                _id: { $in: productIds },
            };
        }

        const categoryId = String(deal?.category?.categoryId || '').trim();

        if (!categoryId) {
            return null;
        }

        const category = await Category.findOne({ categoryId }).select('_id').lean();

        if (!category) {
            return null;
        }

        const categoryIds = await this.getCategoryTreeIds(category);

        return {
            category: { $in: categoryIds },
        };
    }

    async applyDealsToProductCollection(products = []) {
        if (!Array.isArray(products) || !products.length) {
            return [];
        }

        const dealMaps = await this.getActiveDealMaps();
        return products.map((product) => this.applyDealToProduct(product, dealMaps));
    }

    async decreaseStockForOrderItems(orderItems = []) {
        await Promise.all(
            orderItems.map(async (orderItem) => {
                const productId = orderItem?.product?._id || orderItem?.product;
                const quantity = Number(orderItem?.quantity || 0);

                if (!productId || quantity <= 0) {
                    return;
                }

                const product = await Product.findById(productId);

                if (!product) {
                    return;
                }

                product.stock = Math.max(0, Number(product.stock || 0) - quantity);
                await product.save();
            }),
        );
    }

    async restoreStockForOrderItems(orderItems = []) {
        await Promise.all(
            orderItems.map(async (orderItem) => {
                const productId = orderItem?.product?._id || orderItem?.product;
                const quantity = Number(orderItem?.quantity || 0);

                if (!productId || quantity <= 0) {
                    return;
                }

                const product = await Product.findById(productId);

                if (!product) {
                    return;
                }

                product.stock = Number(product.stock || 0) + quantity;
                await product.save();
            }),
        );
    }

    async createOrGetCategory(categoryId, level, parentId = null) {
        let category = await Category.findOne({ categoryId });

        if (!category) {
            category = new Category({
                name: categoryId,
                categoryId,
                parentCategory: parentId,
                level
            });

            category = await category.save();
        }

        return category;
    }

    normalizeSpecifications(specifications = {}) {
        const normalizedSpecifications = {};

        if (!specifications || typeof specifications !== 'object') {
            return normalizedSpecifications;
        }

        Object.entries(specifications).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                return;
            }

            const normalizedValue = String(value).trim();

            if (!normalizedValue) {
                return;
            }

            normalizedSpecifications[key] = normalizedValue;
        });

        return normalizedSpecifications;
    }

    async resolveCategoryHierarchy({ categoryId, subCategoryId, subSubCategoryId }) {
        if (!categoryId || !subCategoryId || !subSubCategoryId) {
            throw new Error('Please select category, category 2, and category 3');
        }

        const category1 = await this.createOrGetCategory(categoryId, 1);
        const category2 = await this.createOrGetCategory(subCategoryId, 2, category1._id);
        const category3 = await this.createOrGetCategory(subSubCategoryId, 3, category2._id);

        return {
            category: category3._id,
            mainCategory: categoryId,
            subCategory: subCategoryId,
            subSubCategory: subSubCategoryId
        };
    }

    buildProductData(productData, categoryData = {}) {
        const mrpPrice = Number(productData.mrpPrice);
        const sellingPrice = Number(productData.sellingPrice);
        const specifications = this.normalizeSpecifications(productData.specifications);
        const color = String(productData.color || specifications.color || '').trim();
        const size = String(productData.size || specifications.size || '').trim();

        if (color) {
            specifications.color = color;
        } else {
            delete specifications.color;
        }

        if (size) {
            specifications.size = size;
        } else {
            delete specifications.size;
        }

        return {
            ...categoryData,
            title: productData.title,
            description: productData.description,
            mrpPrice,
            sellingPrice,
            stock: Number(productData.stock),
            images: Array.isArray(productData.images) ? productData.images : [],
            discountPercentage: calculateDiscountPercentage(mrpPrice, sellingPrice),
            color,
            size,
            specifications
        };
    }

    async getCategoryTreeIds(category) {
        const categoryIds = [category._id];
        let parentIds = [category._id];

        while (parentIds.length > 0) {
            const childCategories = await Category.find({
                parentCategory: { $in: parentIds }
            })
                .select('_id')
                .lean();

            if (!childCategories.length) {
                break;
            }

            parentIds = childCategories.map((child) => child._id);
            categoryIds.push(...parentIds);
        }

        return categoryIds;
    }

    async getProductReviews(productId) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const reviews = await Review.find({ productId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        const totalReviews = reviews.length;
        const averageRating = totalReviews
            ? Number(
                (
                    reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
                    totalReviews
                ).toFixed(1)
            )
            : 0;

        return {
            reviews,
            totalReviews,
            averageRating
        };
    }

    async createProductReview(productId, user, reviewData) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        const rating = Number(reviewData.rating);
        const comment = String(reviewData.comment || '').trim();

        if (!rating || rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        if (!comment) {
            throw new Error('Review comment is required');
        }

        const existingReview = await Review.findOne({
            productId,
            userId: user._id
        });

        if (existingReview) {
            throw new Error('You have already reviewed this product');
        }

        await Review.create({
            productId,
            userId: user._id,
            rating,
            comment
        });

        return await this.getProductReviews(productId);
    }

    async createProduct(req, seller) {
        try {
            const categoryData = await this.resolveCategoryHierarchy(req.body);
            const normalizedProductData = this.buildProductData(req.body, categoryData);

            const product = new Product({
                ...normalizedProductData,
                sellerId: seller._id
            });

            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    async deleteProduct(productId, seller) {
        const product = await Product.findOne({ _id: productId, sellerId: seller._id });
        if (!product) {
            throw new Error('Product not found or you do not have permission to delete this product');
        }
        await Product.deleteOne({ _id: productId });
        return true;
    }

    async updateProduct(productId, updateProductData) {
        try {
            const existingProduct = await Product.findById(productId);

            if (!existingProduct) {
                throw new Error('Product not found');
            }

            const shouldUpdateCategory =
                updateProductData.categoryId ||
                updateProductData.subCategoryId ||
                updateProductData.subSubCategoryId;

            const categoryData = shouldUpdateCategory
                ? await this.resolveCategoryHierarchy({
                    categoryId: updateProductData.categoryId || existingProduct.mainCategory,
                    subCategoryId: updateProductData.subCategoryId || existingProduct.subCategory,
                    subSubCategoryId: updateProductData.subSubCategoryId || existingProduct.subSubCategory
                })
                : {};

            const nextProductData = this.buildProductData(
                {
                    ...existingProduct.toObject(),
                    ...updateProductData,
                    mrpPrice: updateProductData.mrpPrice ?? existingProduct.mrpPrice,
                    sellingPrice: updateProductData.sellingPrice ?? existingProduct.sellingPrice,
                    specifications:
                        updateProductData.specifications !== undefined
                            ? updateProductData.specifications
                            : existingProduct.specifications || {}
                },
                categoryData
            );

            const product = await Product.findByIdAndUpdate(productId, nextProductData, {
                new: true
            });

            if (!product) {
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async findProductbyId(productId) {
        const product = await Product
            .findById(productId)
            .select(PRODUCT_LIST_SELECT)
            .populate('category', 'categoryId name')
            .populate('sellerId', 'name email sellerName businessDetails')
            .lean();

        if (!product) {
            throw new Error('Product not found');
        }
        const [productWithDeal] = await this.applyDealsToProductCollection([product]);
        return productWithDeal;
    }

    async searchProducts(query) {
        try {
            const products = await Product.find({ title: { $regex: query, $options: 'i' } })
                .select(PRODUCT_LIST_SELECT)
                .populate('category', 'categoryId name')
                .populate('sellerId', 'sellerName businessDetails')
                .sort({ _id: -1 })
                .lean();
            return await this.applyDealsToProductCollection(products);
        } catch (error) {
            throw new Error('Error searching products: ' + error.message);
        }
    }

    async getProductBySeller(sellerId) {
        const products = await Product.find({ sellerId: sellerId })
            .select(PRODUCT_LIST_SELECT)
            .populate('category', 'categoryId name')
            .sort({ _id: -1 })
            .lean();
        return await this.applyDealsToProductCollection(products);
    }

    async getProductsBySellerId(sellerId, pageNumber = 0) {
        const page = Number(pageNumber) || 0;
        const query = { sellerId: sellerId };
        const [products, totalElement] = await Promise.all([
            Product.find(query)
                .select(PRODUCT_LIST_SELECT)
                .populate('category', 'categoryId name')
                .sort({ _id: -1 })
                .skip(page * 10)
                .limit(10)
                .lean(),
            Product.countDocuments(query),
        ]);
        const totalpages = Math.ceil(totalElement / 10);
        const content = await this.applyDealsToProductCollection(products);

        return {
            content,
            totalpages,
            totalElement
        };
    }

    async getAllProducts(req) {
        const filterQuery = {};

        if (req.dealId) {
            const dealFilter = await this.buildDealProductFilter(req.dealId);

            if (!dealFilter) {
                return {
                    content: [],
                    totalpages: 0,
                    totalElement: 0,
                };
            }

            Object.assign(filterQuery, dealFilter);
        }

        if (req.q) {
            const keyword = String(req.q).trim();

            if (keyword) {
                filterQuery.$or = [
                    { title: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                ];
            }
        }

        if (req.category) {
            const category = await Category.findOne({ categoryId: req.category });

            if (!category) {
                return {
                    content: [],
                    totalpages: 0,
                    totalElement: 0
                };
            }

            const categoryIds = await this.getCategoryTreeIds(category);
            filterQuery.category = { $in: categoryIds };
        }

        if (req.color) {
            filterQuery.color = req.color;
        }

        if (req.minPrice && req.maxPrice) {
            filterQuery.sellingPrice = { $gte: req.minPrice, $lte: req.maxPrice };
        }

        if (req.minDiscount) {
            filterQuery.discountPercentage = { $gte: req.minDiscount };
        }

        if (req.size) {
            filterQuery.size = req.size;
        }

        Object.entries(req).forEach(([key, value]) => {
            if (!key.startsWith('spec_') || !value) {
                return;
            }

            const specificationKey = key.replace('spec_', '');
            filterQuery[`specifications.${specificationKey}`] = value;
        });

        const sortQuery = { _id: -1 };
        if (req.sort == 'price_low') {
            sortQuery.sellingPrice = 1;
            delete sortQuery._id;
        } else if (req.sort == 'price_high') {
            sortQuery.sellingPrice = -1;
            delete sortQuery._id;
        } else if (req.sort == 'newest') {
            sortQuery._id = -1;
        }

        const pageNumber = Number(req.pageNumber ?? req.page ?? 0) || 0;

        const [product, totalElement] = await Promise.all([
            Product.find(filterQuery)
                .select(PRODUCT_LIST_SELECT)
                .populate('category', 'categoryId name')
                .populate('sellerId', 'sellerName businessDetails')
                .sort(sortQuery)
                .skip(pageNumber * 10)
                .limit(10)
                .lean(),
            Product.countDocuments(filterQuery),
        ]);
        const totalpages = Math.ceil(totalElement / 10);
        const content = await this.applyDealsToProductCollection(product);

        return {
            content,
            totalpages,
            totalElement
        };
    }

    async getSimilarProducts(productId) {
        const currentProduct = await Product.findById(productId).populate({
            path: 'category',
            populate: {
                path: 'parentCategory',
                model: 'Category'
            }
        });

        if (!currentProduct) {
            throw new Error('Product not found');
        }

        let subCategory = null;

        if (currentProduct.subCategory) {
            subCategory = await Category.findOne({ categoryId: currentProduct.subCategory });
        }

        if (!subCategory && currentProduct.category?.parentCategory) {
            subCategory = currentProduct.category.parentCategory;
        }

        if (!subCategory) {
            return [];
        }

        const categoryIds = await this.getCategoryTreeIds(subCategory);

        const products = await Product.find({
            _id: { $ne: productId },
            category: { $in: categoryIds }
        })
            .select(PRODUCT_LIST_SELECT)
            .populate('category', 'categoryId name')
            .populate('sellerId', 'sellerName businessDetails')
            .sort({ _id: -1 })
            .limit(8)
            .lean();

        return await this.applyDealsToProductCollection(products);
    }
}

const productService = new ProductService();
module.exports = productService;
