/**
 * INOVAMARK API E2E Test Runner
 * 
 * This script tests the public API endpoints of the INOVAMARK platform.
 * It uses native Node.js fetch to ensure no external testing dependencies are required.
 * 
 * Usage: node scripts/run-e2e-tests.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Simple test runner utility
const runTest = async (testName, testFn) => {
    try {
        process.stdout.write(`[\x1b[33mRUN\x1b[0m] ${testName}... `);
        await testFn();
        console.log(`\x1b[32mPASS\x1b[0m`);
    } catch (error) {
        console.log(`\x1b[31mFAIL\x1b[0m`);
        console.error(`      -> ${error.message}`);
        process.exitCode = 1;
    }
};

const assertEqual = (actual, expected, message) => {
    if (actual !== expected) {
        throw new Error(`${message}: Expected ${expected}, got ${actual}`);
    }
};

const assertDefined = (value, message) => {
    if (value === undefined || value === null) {
        throw new Error(`${message}: Value is undefined or null`);
    }
};

// Test Suite
async function runAllTests() {
    console.log(`\nStarting INOVAMARK API Tests against ${BASE_URL}\n`);

    // 1. Categories API
    await runTest('GET /api/categories - Fetch categories', async () => {
        const res = await fetch(`${BASE_URL}/api/categories`);
        assertEqual(res.status, 200, 'Status code should be 200');

        const data = await res.json();
        assertDefined(data.categories, 'Response should contain a "categories" array');

        if (data.categories.length > 0) {
            const cat = data.categories[0];
            assertDefined(cat.id, 'Category should have an id');
            assertDefined(cat.name, 'Category should have a name');
            assertDefined(cat.slug, 'Category should have a slug');
        }
    });

    // 2. Vendors API
    await runTest('GET /api/vendors - Fetch vendors list', async () => {
        const res = await fetch(`${BASE_URL}/api/vendors`);
        assertEqual(res.status, 200, 'Status code should be 200');

        const data = await res.json();
        assertDefined(data.vendors, 'Response should contain a "vendors" array');

        if (data.vendors.length > 0) {
            const vendor = data.vendors[0];
            assertDefined(vendor.id, 'Vendor should have an id');
            assertDefined(vendor.storeName, 'Vendor should have a storeName');
            assertDefined(vendor.rating, 'Vendor should have a rating');
        }
    });

    // 3. Products API
    await runTest('GET /api/products - Fetch active products', async () => {
        const res = await fetch(`${BASE_URL}/api/products`);
        assertEqual(res.status, 200, 'Status code should be 200');

        const data = await res.json();
        assertDefined(data.products, 'Response should contain a "products" array');

        if (data.products.length > 0) {
            const product = data.products[0];
            assertDefined(product.id, 'Product should have an id');
            assertDefined(product.name, 'Product should have a name');
            assertDefined(product.price, 'Product should have a price');
            // Check relations
            assertDefined(product.category, 'Product should include category data');
            assertDefined(product.vendor, 'Product should include vendor data');
        }
    });

    console.log('\n\x1b[32mAll specified tests completed.\x1b[0m\n');
}

// Execute tests
runAllTests().catch(err => {
    console.error('Test suite failed to run:', err);
    process.exit(1);
});
