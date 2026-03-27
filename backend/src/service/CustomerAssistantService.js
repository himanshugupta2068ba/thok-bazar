const Product = require("../models/Product");
const productService = require("./ProductService");
const OrderService = require("./OrderService");

const MAX_TOOL_PRODUCTS = 6;
const MAX_TOOL_ROUNDS = 4;
const ASSISTANT_PRODUCT_SELECT = [
    "title",
    "mrpPrice",
    "sellingPrice",
    "stock",
    "images",
    "sellerId",
    "category",
    "mainCategory",
    "subCategory",
    "subSubCategory",
    "color",
    "size",
    "discountPercentage",
    "createdAt",
].join(" ");
const INPUT_NORMALIZERS = [
    { pattern: /\b(t[\s-]?shirts?|tshrt|tee[\s-]?shirts?|tees?)\b/gi, replacement: " tshirt " },
    { pattern: /\b(shooes|shoees|shoos|shoe)\b/gi, replacement: " shoes " },
    { pattern: /\b(jeen|jeanss)\b/gi, replacement: " jeans " },
    { pattern: /\b(perfum|parfum|fragance|fragrance)\b/gi, replacement: " perfume " },
    { pattern: /\b(sari)\b/gi, replacement: " saree " },
    { pattern: /\b(moble|mobille|smart phone|cell phone)\b/gi, replacement: " mobile " },
    { pattern: /\b(televsion|televission|television)\b/gi, replacement: " tv " },
    { pattern: /\b(lappy|notebook pc)\b/gi, replacement: " laptop " },
    { pattern: /\b(ordr|orderr|oders)\b/gi, replacement: " order " },
    { pattern: /\b(stetus|staus)\b/gi, replacement: " status " },
    { pattern: /\b(delivary|dilevery|shiping|shipping)\b/gi, replacement: " delivery " },
    { pattern: /\b(refnd|retun|returnd?)\b/gi, replacement: " refund " },
    { pattern: /\b(cancle|cnacel|cancellation)\b/gi, replacement: " cancel " },
    { pattern: /\b(adress|adres|addr)\b/gi, replacement: " address " },
    { pattern: /\b(paymant|pyment|pament)\b/gi, replacement: " payment " },
    { pattern: /\b(wish\s?list|whishlist)\b/gi, replacement: " wishlist " },
    { pattern: /\b(check\s?out)\b/gi, replacement: " checkout " },
    { pattern: /\b(selar|vender|vendor)\b/gi, replacement: " seller " },
];
const SEARCH_VARIANTS = {
    tshirt: ["tshirt", "t shirt", "t-shirt", "tee", "tee shirt"],
    shoes: ["shoes", "shoe", "sneakers", "sneaker", "footwear"],
    jeans: ["jeans", "denim"],
    perfume: ["perfume", "fragrance", "deodorant", "deo"],
    saree: ["saree", "sari"],
    mobile: ["mobile", "phone", "smartphone"],
    tv: ["tv", "television", "smart tv"],
    laptop: ["laptop", "notebook"],
};

const SHOPPING_GUIDE = [
    "You help Thok Bazar customers discover products and get support.",
    "For product recommendations, use tool data before naming specific products or prices.",
    "For order questions, use the customer orders tool when customer context is available.",
    "Never claim that you cancelled, refunded, returned, or modified an order yourself.",
    "Guide customers to the right page when an action must be done in the UI.",
    "Keep answers concise, helpful, and shopping-focused.",
    "When suggesting products, mention why they fit and keep price references in Rs.",
].join(" ");

const SUPPORT_CONTEXT = [
    "Customers can browse products, use search, add items to cart, manage wishlist, and checkout.",
    "Customer account pages are under /customer/profile, including orders, addresses, and payment methods.",
    "If a customer wants to become a seller, direct them to /become-seller.",
].join(" ");

class CustomerAssistantService {
    getOpenAIKey() {
        return String(process.env.OPENAI_API_KEY || "").trim();
    }

    getModel() {
        return String(process.env.CUSTOMER_AI_MODEL || "gpt-4.1-mini").trim();
    }

    hasOpenAIConfigured() {
        return Boolean(this.getOpenAIKey());
    }

    normalizeInput(value = "") {
        let normalized = ` ${String(value || "").toLowerCase()} `;

        INPUT_NORMALIZERS.forEach(({ pattern, replacement }) => {
            normalized = normalized.replace(pattern, replacement);
        });

        return normalized.replace(/\s+/g, " ").trim();
    }

    escapeRegex(value = "") {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    clampLimit(value, fallback = 4, max = MAX_TOOL_PRODUCTS) {
        const numeric = Number(value);

        if (!Number.isFinite(numeric) || numeric <= 0) {
            return fallback;
        }

        return Math.min(Math.max(Math.round(numeric), 1), max);
    }

    parseNumber(value) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : null;
    }

    getEffectivePrice(product) {
        return Number(
            product?.effectiveSellingPrice ??
                product?.dealSellingPrice ??
                product?.sellingPrice ??
                0,
        );
    }

    getEffectiveDiscount(product) {
        const mrpPrice = Number(product?.mrpPrice || 0);
        const effectivePrice = this.getEffectivePrice(product);

        if (product?.effectiveDiscountPercentage !== undefined) {
            return Number(product.effectiveDiscountPercentage || 0);
        }

        if (mrpPrice <= 0) {
            return 0;
        }

        return Math.max(0, Math.round(((mrpPrice - effectivePrice) / mrpPrice) * 100));
    }

    buildProductSummary(product) {
        const productId = String(product?._id || product?.id || "");
        const categoryId = product?.category?.categoryId || product?.mainCategory || "products";
        const productName = product?.title || "Product";

        return {
            id: productId,
            title: productName,
            image: Array.isArray(product?.images) && product.images.length ? product.images[0] : "",
            price: this.getEffectivePrice(product),
            mrpPrice: Number(product?.mrpPrice || 0),
            discount: this.getEffectiveDiscount(product),
            stock: Number(product?.stock || 0),
            sellerName:
                product?.sellerId?.businessDetails?.businessName ||
                product?.sellerId?.sellerName ||
                product?.seller?.businessDetails?.businessName ||
                product?.seller?.sellerName ||
                "Seller",
            categoryLabel: [product?.mainCategory, product?.subCategory, product?.subSubCategory]
                .filter(Boolean)
                .join(" / "),
            url: `/product-details/${categoryId}/${encodeURIComponent(productName)}/${productId}`,
        };
    }

    sanitizeConversation(conversation = []) {
        if (!Array.isArray(conversation)) {
            return [];
        }

        return conversation
            .filter((item) => item && (item.role === "user" || item.role === "assistant"))
            .map((item) => ({
                role: item.role,
                content: String(item.content || "").trim(),
            }))
            .filter((item) => item.content)
            .slice(-8);
    }

    buildInputMessages({ message, conversation = [] }) {
        return [
            ...this.sanitizeConversation(conversation).map((item) => ({
                role: item.role,
                content: [{ type: "input_text", text: item.content }],
            })),
            {
                role: "user",
                content: [{ type: "input_text", text: String(message || "").trim() }],
            },
        ];
    }

    buildInstructions({ customer }) {
        const authContext = customer
            ? "The current customer is authenticated. Use customer order data when helpful."
            : "The current customer may be browsing without logging in. If order-specific help is needed, ask them to log in.";

        return `${SHOPPING_GUIDE} ${SUPPORT_CONTEXT} ${authContext}`;
    }

    getToolDefinitions() {
        return [
            {
                type: "function",
                name: "search_products",
                description:
                    "Search the live Thok Bazar catalog for products that match customer shopping needs such as cheapest t-shirt, budget shoes, or a category under a target price.",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Product query such as t shirt, shoes, perfume, or kurti.",
                        },
                        category: {
                            type: "string",
                            description: "Optional category hint such as men, women, electronics, or footwear.",
                        },
                        color: {
                            type: "string",
                            description: "Optional preferred color.",
                        },
                        size: {
                            type: "string",
                            description: "Optional preferred size.",
                        },
                        minPrice: {
                            type: "number",
                            description: "Optional minimum price in Rs.",
                        },
                        maxPrice: {
                            type: "number",
                            description: "Optional maximum price in Rs.",
                        },
                        sort: {
                            type: "string",
                            enum: ["price_low", "price_high", "newest"],
                            description: "How to sort the products.",
                        },
                        limit: {
                            type: "number",
                            description: "How many products to return, up to 6.",
                        },
                        inStockOnly: {
                            type: "boolean",
                            description: "Whether to only include in-stock products.",
                        },
                    },
                    additionalProperties: false,
                },
            },
            {
                type: "function",
                name: "get_customer_orders",
                description:
                    "Get recent order information for the logged-in customer to answer support questions such as latest order status.",
                parameters: {
                    type: "object",
                    properties: {
                        limit: {
                            type: "number",
                            description: "How many recent orders to return, up to 5.",
                        },
                        orderId: {
                            type: "string",
                            description: "Optional specific order id to focus on.",
                        },
                    },
                    additionalProperties: false,
                },
            },
        ];
    }

    buildTokenSearchClauses(text, fields) {
        const tokens = this.normalizeInput(text)
            .split(/[\s,/+-]+/)
            .map((token) => token.trim())
            .filter((token) => token && token.length > 1)
            .slice(0, 5);

        return tokens.map((token) => {
            const variants = Array.from(
                new Set([token, ...(Array.isArray(SEARCH_VARIANTS[token]) ? SEARCH_VARIANTS[token] : [])]),
            );

            return {
                $or: fields.flatMap((field) =>
                    variants.map((variant) => ({
                        [field]: { $regex: this.escapeRegex(variant), $options: "i" },
                    })),
                ),
            };
        });
    }

    async searchProducts(args = {}) {
        const limit = this.clampLimit(args.limit);
        const inStockOnly = args.inStockOnly !== false;
        const sort = ["price_low", "price_high", "newest"].includes(args.sort)
            ? args.sort
            : "price_low";
        const minPrice = this.parseNumber(args.minPrice);
        const maxPrice = this.parseNumber(args.maxPrice);

        const andClauses = [];
        const searchableFields = [
            "title",
            "description",
            "mainCategory",
            "subCategory",
            "subSubCategory",
            "color",
            "size",
        ];

        andClauses.push(...this.buildTokenSearchClauses(args.query, searchableFields));
        andClauses.push(
            ...this.buildTokenSearchClauses(args.category, [
                "mainCategory",
                "subCategory",
                "subSubCategory",
                "title",
            ]),
        );

        const filterQuery = {};

        if (andClauses.length) {
            filterQuery.$and = andClauses;
        }

        if (args.color) {
            filterQuery.color = { $regex: this.escapeRegex(args.color), $options: "i" };
        }

        if (args.size) {
            filterQuery.size = { $regex: this.escapeRegex(args.size), $options: "i" };
        }

        if (inStockOnly) {
            filterQuery.stock = { $gt: 0 };
        }

        let products = await Product.find(filterQuery)
            .select(ASSISTANT_PRODUCT_SELECT)
            .populate("category", "categoryId name")
            .populate("sellerId", "sellerName businessDetails")
            .sort(sort === "newest" ? { _id: -1 } : { createdAt: -1, _id: -1 })
            .limit(Math.max(limit * 4, 20))
            .lean();

        products = await productService.applyDealsToProductCollection(products);

        const filteredProducts = products
            .filter((product) => {
                const effectivePrice = this.getEffectivePrice(product);

                if (minPrice !== null && effectivePrice < minPrice) {
                    return false;
                }

                if (maxPrice !== null && effectivePrice > maxPrice) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (sort === "price_high") {
                    return this.getEffectivePrice(b) - this.getEffectivePrice(a);
                }

                if (sort === "newest") {
                    return new Date(b?._id?.getTimestamp?.() || b?.createdAt || 0).getTime() -
                        new Date(a?._id?.getTimestamp?.() || a?.createdAt || 0).getTime();
                }

                return this.getEffectivePrice(a) - this.getEffectivePrice(b);
            });

        const summarizedProducts = filteredProducts.slice(0, limit).map((product) => this.buildProductSummary(product));

        return {
            totalMatches: filteredProducts.length,
            appliedFilters: {
                query: String(args.query || "").trim(),
                category: String(args.category || "").trim(),
                color: String(args.color || "").trim(),
                size: String(args.size || "").trim(),
                minPrice,
                maxPrice,
                sort,
                inStockOnly,
            },
            products: summarizedProducts,
        };
    }

    async getCustomerOrders(args = {}, { customer } = {}) {
        if (!customer?._id) {
            return {
                available: false,
                message: "Customer is not logged in.",
                orders: [],
            };
        }

        const limit = Math.min(this.clampLimit(args.limit, 3, 5), 5);
        const targetOrderId = String(args.orderId || "").trim();
        const orders = await OrderService.getUserOrderSummaries(customer._id, {
            limit,
            orderId: targetOrderId || undefined,
        });
        const recentOrders = orders
            .slice(0, limit)
            .map((order) => ({
                id: String(order?._id || ""),
                status: order?.orderStatus || "UNKNOWN",
                paymentStatus: order?.paymentStatus || "UNKNOWN",
                total: Number(order?.totalSellingPrice || 0),
                createdAt: order?.createdAt || null,
                itemCount: Number(order?.totalItems || 0),
                items: (Array.isArray(order?.orderItems) ? order.orderItems : [])
                    .slice(0, 4)
                    .map((item) => item?.product?.title || "Product"),
            }));

        return {
            available: true,
            orders: recentOrders,
        };
    }

    async executeTool(name, args, context) {
        switch (name) {
            case "search_products":
                return await this.searchProducts(args);
            case "get_customer_orders":
                return await this.getCustomerOrders(args, context);
            default:
                return { error: `Unknown tool: ${name}` };
        }
    }

    extractTextFromResponse(response) {
        if (typeof response?.output_text === "string" && response.output_text.trim()) {
            return response.output_text.trim();
        }

        const texts = [];

        (Array.isArray(response?.output) ? response.output : []).forEach((item) => {
            if (item?.type !== "message" || !Array.isArray(item.content)) {
                return;
            }

            item.content.forEach((contentItem) => {
                if (contentItem?.type === "output_text" && contentItem.text) {
                    texts.push(contentItem.text);
                }
            });
        });

        return texts.join("\n").trim();
    }

    async callOpenAI({ input, previousResponseId, customer }) {
        const payload = {
            model: this.getModel(),
            instructions: this.buildInstructions({ customer }),
            input,
            tools: this.getToolDefinitions(),
        };

        if (previousResponseId) {
            payload.previous_response_id = previousResponseId;
        }

        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getOpenAIKey()}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI ${response.status}: ${errorText || "request failed"}`);
        }

        return await response.json();
    }

    collectProductsFromToolResults(toolResults = []) {
        const map = new Map();

        toolResults.forEach((result) => {
            const products = Array.isArray(result?.products) ? result.products : [];

            products.forEach((product) => {
                if (!product?.id || map.has(product.id)) {
                    return;
                }

                map.set(product.id, product);
            });
        });

        return Array.from(map.values()).slice(0, MAX_TOOL_PRODUCTS);
    }

    buildFallbackSupportReply(message, customer, orderResult) {
        const lowerMessage = this.normalizeInput(message);

        if (/^(hi|hello|hey|hii|helo)\b/.test(lowerMessage)) {
            return "Hi. Ask me to find products, compare prices, or help with orders, address, payment, and checkout.";
        }

        if (/order|delivery|status|refund|cancel/.test(lowerMessage)) {
            if (!customer?._id) {
                return "Log in to check order history and order status from your customer profile.";
            }

            const latestOrder = Array.isArray(orderResult?.orders) ? orderResult.orders[0] : null;

            if (latestOrder) {
                return `Your latest order ${latestOrder.id} is currently ${latestOrder.status}. You can open Customer Profile > Orders for full details.`;
            }

            return "I could not find any recent orders for this account. You can check Customer Profile > Orders to confirm.";
        }

        if (/address|payment method|profile/.test(lowerMessage)) {
            return "You can manage profile details, addresses, and payment methods from Customer Profile.";
        }

        if (/seller|sell/.test(lowerMessage)) {
            return "If you want to sell on Thok Bazar, open the Become Seller page from the navbar or poster section.";
        }

        return "I can help you find products, compare prices, and answer customer support questions about orders, profile, cart, and checkout.";
    }

    extractFallbackProductIntent(message) {
        const originalMessage = this.normalizeInput(message);
        const lowerMessage = originalMessage.toLowerCase();
        const budgetMatch = lowerMessage.match(
            /(?:under|below|less than|within|max(?:imum)?(?: price)?(?: of)?)\s*(?:rs\.?|₹)?\s*(\d+)/i,
        );

        const cleanedQuery = originalMessage
            .replace(/(?:under|below|less than|within|max(?:imum)?(?: price)?(?: of)?)\s*(?:rs\.?|₹)?\s*\d+/gi, " ")
            .replace(/\b(find|show|give|need|want|looking|look|for|me|the|some|best|cheapest|lowest|budget|support|help|please|products?|items?)\b/gi, " ")
            .replace(/\s+/g, " ")
            .trim();

        if (!cleanedQuery) {
            return null;
        }

        return {
            query: cleanedQuery,
            maxPrice: budgetMatch ? Number(budgetMatch[1]) : undefined,
            sort: /(cheapest|lowest|budget|affordable|low price)/i.test(lowerMessage)
                ? "price_low"
                : "price_low",
            limit: 4,
            inStockOnly: true,
        };
    }

    buildFallbackProductReply(result, intent) {
        if (!result.products.length) {
            return `I could not find matching products${intent?.query ? ` for "${intent.query}"` : ""}. Try a different keyword, category, or price range.`;
        }

        const budgetText =
            intent?.maxPrice !== undefined && intent?.maxPrice !== null
                ? ` under Rs. ${intent.maxPrice}`
                : "";

        return `Here are some${intent?.sort === "price_low" ? " budget-friendly" : ""} options${intent?.query ? ` for "${intent.query}"` : ""}${budgetText}.`;
    }

    async buildFallbackResponse({ message, customer }) {
        const orderResult = await this.getCustomerOrders({ limit: 3 }, { customer });
        const productIntent = this.extractFallbackProductIntent(message);

        if (productIntent) {
            const productResult = await this.searchProducts(productIntent);
            return {
                reply: this.buildFallbackProductReply(productResult, productIntent),
                products: productResult.products,
                source: "fallback",
            };
        }

        return {
            reply: this.buildFallbackSupportReply(message, customer, orderResult),
            products: [],
            source: "fallback",
        };
    }

    async generateResponse({ message, conversation = [], customer = null }) {
        const normalizedMessage = String(message || "").trim();

        if (!normalizedMessage) {
            return {
                reply: "Ask me to find products, compare prices, or help with customer support.",
                products: [],
                source: "fallback",
            };
        }

        if (!this.hasOpenAIConfigured()) {
            return await this.buildFallbackResponse({ message: normalizedMessage, customer });
        }

        try {
            const inputMessages = this.buildInputMessages({
                message: normalizedMessage,
                conversation,
            });

            let response = await this.callOpenAI({
                input: inputMessages,
                customer,
            });

            const toolResults = [];

            for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
                const toolCalls = (Array.isArray(response?.output) ? response.output : []).filter(
                    (item) => item?.type === "function_call",
                );

                if (!toolCalls.length) {
                    break;
                }

                const toolOutputs = [];

                for (const toolCall of toolCalls) {
                    let parsedArguments = {};

                    try {
                        parsedArguments = JSON.parse(toolCall.arguments || "{}");
                    } catch (error) {
                        parsedArguments = {};
                    }

                    const result = await this.executeTool(toolCall.name, parsedArguments, { customer });
                    toolResults.push(result);
                    toolOutputs.push({
                        type: "function_call_output",
                        call_id: toolCall.call_id,
                        output: JSON.stringify(result),
                    });
                }

                response = await this.callOpenAI({
                    input: toolOutputs,
                    previousResponseId: response.id,
                    customer,
                });
            }

            const reply = this.extractTextFromResponse(response);
            const products = this.collectProductsFromToolResults(toolResults);

            if (!reply) {
                return await this.buildFallbackResponse({ message: normalizedMessage, customer });
            }

            return {
                reply,
                products,
                source: "openai",
            };
        } catch (error) {
            console.error("Customer assistant OpenAI error:", error?.message || error);
            return await this.buildFallbackResponse({ message: normalizedMessage, customer });
        }
    }
}

module.exports = new CustomerAssistantService();
