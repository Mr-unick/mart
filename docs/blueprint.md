# **App Name**: TenantBill

## Core Features:

- Tenant Onboarding: Tenant registration form with fields for company name, admin user details, and billing information.
- Product Catalog: Product catalog display with filtering and search functionality, scoped by tenant.
- Order Form: Customer order form with dynamic product selection, quantity input, and coupon code application. Reflects customer-specific pricing.
- Dynamic Billing Engine: Bill generator with line items, discounts (flat/percentage), tax (%), and coupon logic, which generates line item descriptions using AI tool to reason over customer order and customer-specific promotions.
- Order Summary: Order summary display with breakdown of costs, discounts, taxes, and final total, presented clearly to the customer.
- API Management: API endpoints for tenant registration, product addition, and order creation, enforcing multi-tenancy at the data layer.

## Style Guidelines:

- Primary color: Deep sky blue (#42A5F5) for a professional and trustworthy feel.
- Background color: Light gray (#F5F5F5), nearly white, to provide a clean and modern backdrop.
- Accent color: Vibrant orange (#FF7043) to highlight key actions and important information.
- Body and headline font: 'Inter', a grotesque sans-serif known for its modern and neutral appearance. 
- Clean and structured layout with clear sections for product listing, order form, and summary. Emphasize ease of navigation and information clarity.
- Use a set of consistent, professional icons throughout the application for wayfinding and to reinforce the various functions. Icons should have a modern line art style.
- Subtle animations such as fade-ins and transitions to enhance user experience without being distracting.