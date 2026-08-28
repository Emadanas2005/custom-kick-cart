# Sneaker Sole Mate

Prompt: Build a Complete Sneaker Selling Store Website
Act as an expert frontend web developer, UI/UX designer, and JavaScript developer. Design and implement a complete, modern, responsive, and visually attractive Sneaker Selling Store web application.
Technology Requirements
Use only:
HTML5
CSS3
Vanilla JavaScript
Do not use React, Angular, Vue, Bootstrap, or other frontend frameworks.
Project Requirements
Create a complete multi-page Sneaker Selling Store website with the following pages:
1. Landing Page (index.html)
Create an attractive homepage containing:
Modern navigation bar
Store logo and brand name
Hero section with a catchy heading and call-to-action button
Featured sneaker collection
Popular products section
Categories or brands section
Promotional banner
Why choose us section
Customer testimonials
Newsletter subscription section
Footer with useful links and social media icons
The design should have a premium, modern sneaker-store appearance.
2. Product Display Page (products.html)
Create a product listing page containing:
Navigation bar
Product cards with sneaker images
Product name
Brand name
Price
Discount, if applicable
Rating
Available sizes
"Add to Cart" button
Product search functionality
Category or brand filters
Responsive product grid
Include at least 8–12 sample sneaker products.
3. Shopping Cart Page (cart.html)
Create a fully functional shopping cart containing:
Product image
Product name
Selected size
Product price
Quantity controls (+ and -)
Remove item button
Individual item subtotal
Total number of items
Cart subtotal
Shipping charges
Final total price
"Proceed to Payment" button
Use localStorage so that cart items remain available when the user navigates between pages or refreshes the website.
4. Payment Page (payment.html)
Create a professional checkout and payment page containing:
Customer Information
Full Name
Email Address
Phone Number
Delivery Information
House/Street Address
City
State
ZIP/PIN Code
Payment Information
Cardholder Name
Card Number
Expiry Date
CVV
Include:
Order summary
Product details
Total amount
"Place Order" button
Payment Form Validation
Implement JavaScript validation for:
Required fields cannot be empty
Valid email format
Phone number validation
Card number validation
Expiry date validation
CVV validation
PIN/ZIP code validation
Display clear and user-friendly error messages below invalid fields.
After successful validation, display a professional order-success message such as:
"Your order has been placed successfully!"
Then clear the cart from localStorage.
Navigation Requirements
Ensure proper navigation between all pages:
Home → Products
Products → Cart
Cart → Payment
Payment → Order Confirmation
Navigation links should work correctly on every page
Include an active navigation state where appropriate.
Design Requirements
Create a premium and visually appealing sneaker-store design with:
Modern typography
Clean layout
Smooth hover effects
Attractive buttons
Product card animations
Responsive navigation menu
Mobile-friendly design
Tablet-friendly design
Desktop-friendly design
Consistent colors and spacing throughout the website
Use CSS media queries to ensure responsiveness.
The website should look like a real, professional e-commerce sneaker store.
JavaScript Functionality
Implement the following features using Vanilla JavaScript:
Add products to cart
Update product quantities
Remove products from cart
Calculate subtotal automatically
Calculate shipping charges
Calculate final total
Store cart data using localStorage
Display cart item count in the navigation bar
Search products
Filter products by category or brand
Validate the payment form
Display order success confirmation
Clear cart after successful order
Suggested Project Structure
sneaker-store/
│
├── index.html
├── products.html
├── cart.html
├── payment.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── products.js
│   ├── cart.js
│   └── payment.js
│
└── images/
    └── sneakers/

Code Quality Requirements
Write clean and well-structured code
Add comments where necessary
Use semantic HTML
Keep CSS organized
Avoid duplicate code
Use meaningful variable and function names
Ensure all buttons and links work
Ensure there are no console errors
Make the application fully functional before finishing
Important Output Instructions
Generate the complete code for all HTML, CSS, and JavaScript files.
For each file:
Clearly mention the filename.
Provide the complete code.
Explain where the file should be placed in the project structure.
Make sure all file paths and links work correctly.
Use placeholder or freely accessible sneaker images where necessary.
After generating all files, provide:
Instructions to run the project locally
Instructions to test all features
Git commands to upload the completed project to a GitHub repository
Example Git commands:
git init
git add .
git commit -m "Initial commit - Sneaker Selling Store"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main

The final result should be a fully functional, responsive, visually attractive Sneaker Selling Store web application ready to submit as a college project and upload to GitHub.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://custom-kick-cart.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d2de9324-effb-4480-96ed-85cf77194e69).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
