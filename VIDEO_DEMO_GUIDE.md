# Smart POS - Video Demo Guide

## 📋 Overview
This document provides a comprehensive guide for creating a demo video of the Smart POS application. The video should showcase all key features, technical implementations, and demonstrate the full functionality of the system.

---

## 🎬 Video Structure & Timeline

### Total Duration: 15-20 minutes

| Section | Duration | Content |
|---------|----------|---------|
| Introduction | 1-2 min | Brief overview of Smart POS |
| Login & Authentication | 2-3 min | Demonstrate login functionality |
| CRUD Operations | 6-8 min | Show 2 tables with full CRUD |
| API Testing (Postman) | 4-5 min | Test all endpoints |
| Feature Explanation | 2-3 min | Explain features & data display |
| MVC Pattern | 2-3 min | Code walkthrough |
| Error Handling | 1-2 min | Show error handling implementation |

---

## 📝 Detailed Section Guide

### 1. Introduction (1-2 minutes)
**What to Cover:**
- Application name: Smart POS (Point of Sale System)
- Purpose: Modern retail management system
- Technologies used:
  - **Backend**: NestJS, TypeScript, PostgreSQL, Prisma ORM
  - **Frontend**: React, TypeScript, TailwindCSS
  - **Authentication**: JWT tokens

**Script Suggestion:**
```
"Welcome to the Smart POS demo. This is a modern point of sale 
system built with NestJS and React, designed to help retail 
businesses manage their inventory, customers, and transactions 
efficiently."
```

---

### 2. Login & Authentication (2-3 minutes)

#### A. Login Page Demonstration
**Steps to Record:**
1. Show the login page UI
2. Point out the form validation
3. Attempt login with incorrect credentials
4. Show error message
5. Login with correct credentials
6. Show successful redirect to dashboard

**Credentials to Use (for demo):**
```
Email: admin@smartpos.com
Password: your_password
```

**What to Explain:**
- JWT-based authentication
- Token storage in localStorage
- Protected routes implementation
- Session management

**Code to Show (Optional):**
```typescript
// frontend/src/pages/LoginPage.tsx
// Show the authentication logic
```

---

### 3. CRUD Operations - Two Tables (6-8 minutes)

#### Table 1: Products (3-4 minutes)

##### CREATE - Add New Product
**Steps:**
1. Navigate to Products page
2. Click "Add New Product" button
3. Fill in the form:
   - Name: "Sample Product"
   - SKU: "PROD-001"
   - Category: Select from dropdown
   - Price: 50000
   - Stock: 100
   - Description: "Product description"
   - Upload image
4. Submit and show success message
5. Verify product appears in list

##### READ - View Products
**Steps:**
1. Show products table/grid
2. Demonstrate pagination
3. Show search functionality
4. Filter by category
5. Click on a product to view details

##### UPDATE - Edit Product
**Steps:**
1. Select a product
2. Click "Edit" button
3. Modify fields (price, stock, etc.)
4. Save changes
5. Show update confirmation
6. Verify changes in the list

##### DELETE - Remove Product
**Steps:**
1. Select a product
2. Click "Delete" button
3. Show confirmation dialog
4. Confirm deletion
5. Show success message
6. Verify product is removed from list

---

#### Table 2: Customers (3-4 minutes)

##### CREATE - Add New Customer
**Steps:**
1. Navigate to Customers page
2. Click "Add Customer" button
3. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "08123456789"
   - Address: "Jl. Example No. 123"
4. Submit and show success message

##### READ - View Customers
**Steps:**
1. Show customers table
2. Demonstrate search by name/email
3. Show customer details view

##### UPDATE - Edit Customer
**Steps:**
1. Select a customer
2. Click "Edit" button
3. Update information
4. Save changes
5. Show confirmation

##### DELETE - Remove Customer
**Steps:**
1. Select a customer
2. Click "Delete" button
3. Confirm deletion
4. Verify removal

---

### 4. API Testing in Postman (4-5 minutes)

#### Preparation
1. Open Postman
2. Show the collection structure
3. Set base URL: `http://localhost:3000/api`

#### Endpoints to Test

##### A. Authentication Endpoints
```
POST /api/auth/login
Body:
{
  "email": "admin@smartpos.com",
  "password": "your_password"
}

Expected Response: 200 OK
{
  "access_token": "eyJhbGc...",
  "user": { ... }
}
```

##### B. Products Endpoints
```
1. GET /api/products
   - Show all products
   - Expected: 200 OK with array of products

2. GET /api/products/:id
   - Show single product
   - Expected: 200 OK with product object

3. POST /api/products
   Headers: Authorization: Bearer {token}
   Body:
   {
     "name": "Test Product",
     "sku": "TEST-001",
     "categoryId": 1,
     "price": 50000,
     "stock": 100
   }
   Expected: 201 Created

4. PUT /api/products/:id
   Headers: Authorization: Bearer {token}
   Body: (updated fields)
   Expected: 200 OK

5. DELETE /api/products/:id
   Headers: Authorization: Bearer {token}
   Expected: 200 OK
```

##### C. Customers Endpoints
```
1. GET /api/customers
   Expected: 200 OK with customers array

2. GET /api/customers/:id
   Expected: 200 OK with customer object

3. POST /api/customers
   Headers: Authorization: Bearer {token}
   Body:
   {
     "name": "Test Customer",
     "email": "test@example.com",
     "phone": "08123456789"
   }
   Expected: 201 Created

4. PUT /api/customers/:id
   Headers: Authorization: Bearer {token}
   Expected: 200 OK

5. DELETE /api/customers/:id
   Headers: Authorization: Bearer {token}
   Expected: 200 OK
```

##### D. Categories Endpoints
```
GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
```

##### E. Transactions Endpoints
```
GET /api/transactions
POST /api/transactions
GET /api/transactions/:id
```

##### F. Dashboard/Stats Endpoints
```
GET /api/dashboard/stats
```

**What to Show:**
- Request headers (especially Authorization)
- Request body (for POST/PUT)
- Response status codes
- Response body
- Error responses (401, 404, 400)

---

### 5. Feature Explanation & Data Display (2-3 minutes)

#### Key Features to Highlight

##### A. Dashboard
**Features:**
- Real-time statistics
  - Total Revenue
  - Total Profit
  - Today's Revenue
  - Today's Transactions
  - Today's Products Sold
- Recent transactions list
- Top selling products
- Stock alerts
- Sales charts

**Explain:**
```
"The dashboard provides a comprehensive overview of business 
performance. The stats are calculated in real-time from the 
database. For example, Total Revenue aggregates all transaction 
totals, while Today's Revenue filters by today's date."
```

##### B. POS (Point of Sale)
**Features:**
- Product search and selection
- Shopping cart management
- Customer selection
- Real-time total calculation
- Payment processing
- Print receipt (optional)

**Data Flow:**
```
1. Select products → Add to cart
2. Choose customer → Calculate total
3. Process payment → Create transaction
4. Update inventory → Generate receipt
```

##### C. Inventory Management
**Features:**
- Stock tracking
- Low stock alerts
- Automatic stock updates on sale
- Category-based organization

**Explain Data Selection:**
```
"Products are organized by categories for easy navigation. 
The stock level is automatically updated when a transaction 
is completed. Low stock alerts appear when quantity falls 
below the defined threshold."
```

##### D. Transaction History
**Features:**
- Complete transaction records
- Date filtering
- Customer information
- Detailed item breakdown
- Revenue tracking

---

### 6. MVC Pattern Implementation (2-3 minutes)

#### Overview
**Explain:**
```
"Smart POS follows the MVC (Model-View-Controller) pattern 
with NestJS on the backend and React on the frontend. In NestJS, 
this is implemented as Controller-Service-Entity pattern."
```

#### Backend Structure

##### A. Controller Layer
**File to Show:** `backend/src/products/products.controller.ts`

```typescript
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  // ... other endpoints
}
```

**Explain:**
- Controllers handle HTTP requests
- Route definitions with decorators
- Delegates business logic to services
- Returns HTTP responses

##### B. Service Layer (Business Logic)
**File to Show:** `backend/src/products/products.service.ts`

```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true }
    });
  }

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...data,
        createdAt: new Date(),
      }
    });
  }
  // ... other methods
}
```

**Explain:**
- Services contain business logic
- Database operations via Prisma
- Data validation and transformation
- Reusable across controllers

##### C. Model Layer (Entities)
**File to Show:** `backend/prisma/schema.prisma`

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  sku         String   @unique
  price       Decimal  @db.Decimal(10, 2)
  stock       Int
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
  image       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Explain:**
- Models define data structure
- Database schema definition
- Relationships between entities
- Type safety with Prisma

#### Frontend Structure

##### D. Component Layer (View)
**File to Show:** `frontend/src/pages/ProductsPage.tsx`

**Explain:**
- React components as views
- Presentation logic
- User interaction handling
- State management

##### E. Service Layer
**File to Show:** `frontend/src/services/products.service.ts`

**Explain:**
- API communication layer
- HTTP requests to backend
- Data fetching and mutations
- Error handling

#### MVC Flow Diagram
```
User Action (View/Frontend)
    ↓
Controller (API Routes)
    ↓
Service (Business Logic)
    ↓
Model (Database via Prisma)
    ↓
Service (Transform Data)
    ↓
Controller (HTTP Response)
    ↓
View (Update UI)
```

---

### 7. Error Handling Implementation (1-2 minutes)

#### A. Backend Error Handling

##### Global Exception Filter
**File to Show:** `backend/src/common/filters/http-exception.filter.ts`

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

**Explain:**
- Catches all exceptions globally
- Standardized error response format
- Logs errors for debugging
- User-friendly error messages

##### Validation Errors
**File to Show:** `backend/src/products/dto/create-product.dto.ts`

```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
```

**Explain:**
- Input validation with class-validator
- Automatic validation pipe
- Returns 400 Bad Request with validation errors

##### Custom Exceptions
**Example:**
```typescript
if (!product) {
  throw new NotFoundException(`Product with ID ${id} not found`);
}

if (product.stock < quantity) {
  throw new BadRequestException('Insufficient stock');
}
```

#### B. Frontend Error Handling

##### Error Boundary Component
**File to Show:** `frontend/src/components/ErrorBoundary.tsx`

**Explain:**
- Catches React component errors
- Displays fallback UI
- Prevents app crashes

##### API Error Handling
**File to Show:** `frontend/src/services/api.ts`

```typescript
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const message = error.response.data?.message;
    
    switch (status) {
      case 401:
        // Redirect to login
        break;
      case 404:
        // Show not found message
        break;
      default:
        // Show general error
    }
  } else if (error.request) {
    // No response from server
    console.error('Network error');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
};
```

**Explain:**
- Axios interceptors for global error handling
- Different handling for different status codes
- User notifications via toast messages
- Automatic token refresh on 401

##### Form Validation
**File to Show:** `frontend/src/pages/ProductsPage.tsx`

**Explain:**
- Client-side validation before API call
- Real-time field validation
- Clear error messages
- Prevents invalid data submission

#### Error Handling Examples to Demonstrate

1. **404 Not Found:**
   - Try to get a non-existent product ID
   - Show error message

2. **400 Bad Request:**
   - Submit form with invalid data
   - Show validation errors

3. **401 Unauthorized:**
   - Try to access protected route without token
   - Redirect to login

4. **500 Internal Server Error:**
   - Show how server errors are handled
   - Logged and displayed to user

---

## 🎥 Recording Tips

### Pre-Recording Checklist
- [ ] Clean database with sample data
- [ ] Clear browser cache and cookies
- [ ] Close unnecessary tabs and applications
- [ ] Prepare Postman collection
- [ ] Test all features beforehand
- [ ] Have script ready
- [ ] Check microphone and audio levels

### During Recording
- [ ] Speak clearly and at moderate pace
- [ ] Pause between sections
- [ ] Show cursor movements clearly
- [ ] Highlight important UI elements
- [ ] Use annotations if possible
- [ ] Keep desktop clean and professional

### Recommended Tools
- **Screen Recording:** OBS Studio, Camtasia, or ScreenFlow
- **Video Editing:** DaVinci Resolve, Adobe Premiere, or Camtasia
- **Annotations:** Annotate (macOS) or ScreenMarker (Windows)

### Video Settings
- **Resolution:** 1920x1080 (Full HD)
- **Frame Rate:** 30 fps minimum
- **Format:** MP4 (H.264 codec)
- **Audio:** 128 kbps or higher

---

## 📊 Sample Data Preparation

### Users
```sql
INSERT INTO "User" (email, password, name, role) VALUES
('admin@smartpos.com', '$hashed_password', 'Admin User', 'ADMIN');
```

### Categories
```sql
INSERT INTO "Category" (name) VALUES
('Electronics'),
('Food & Beverage'),
('Clothing'),
('Accessories');
```

### Products
```sql
INSERT INTO "Product" (name, sku, price, stock, categoryId) VALUES
('Laptop Dell', 'ELEC-001', 15000000, 10, 1),
('Coffee Arabica', 'FOOD-001', 50000, 100, 2),
('T-Shirt Basic', 'CLTH-001', 100000, 50, 3);
```

### Customers
```sql
INSERT INTO "Customer" (name, email, phone, address) VALUES
('John Doe', 'john@example.com', '08123456789', 'Jl. Example 123'),
('Jane Smith', 'jane@example.com', '08198765432', 'Jl. Sample 456');
```

---

## 📋 Post-Recording Checklist

- [ ] Review entire video
- [ ] Add intro and outro
- [ ] Add background music (optional, low volume)
- [ ] Add subtitles/captions (recommended)
- [ ] Export in high quality
- [ ] Upload to platform (YouTube, Google Drive, etc.)
- [ ] Create thumbnail
- [ ] Add video description with timestamps

---

## 🎬 Video Script Template

```
[INTRO - 0:00]
"Hi, welcome to this demo of Smart POS, a modern point of sale 
system built with NestJS and React."

[LOGIN - 0:30]
"Let's start by logging into the application..."

[PRODUCTS CRUD - 2:00]
"Now I'll demonstrate the product management features..."

[CUSTOMERS CRUD - 6:00]
"Next, let's look at customer management..."

[POSTMAN API - 10:00]
"Now I'll show you the API endpoints in Postman..."

[FEATURES - 14:00]
"Let me explain the key features and data flow..."

[MVC PATTERN - 16:00]
"Let's dive into the code structure and MVC implementation..."

[ERROR HANDLING - 18:00]
"Finally, I'll show you how error handling is implemented..."

[OUTRO - 20:00]
"Thank you for watching this demo of Smart POS."
```

---

## 📌 Additional Notes

### Common Issues to Avoid
- Talking too fast
- Not showing important details
- Skipping error messages
- Not explaining code clearly
- Poor audio quality
- Cluttered screen

### Best Practices
- Use zoom for code sections
- Highlight cursor when clicking
- Pause for 2-3 seconds after major actions
- Use chapter markers in the final video
- Include timestamps in description
- Provide GitHub repository link

---

## 📎 Resources

### Documentation Links
- NestJS: https://docs.nestjs.com
- React: https://react.dev
- Prisma: https://www.prisma.io/docs
- Postman: https://learning.postman.com

### Video Upload Platforms
- YouTube
- Vimeo
- Google Drive
- Loom

---

## ✅ Final Verification

Before publishing, ensure:
- [ ] All CRUD operations shown for 2 tables
- [ ] All API endpoints tested in Postman
- [ ] Login flow demonstrated
- [ ] Features explained clearly
- [ ] MVC pattern walkthrough included
- [ ] Error handling demonstrated
- [ ] Video quality is good
- [ ] Audio is clear
- [ ] Duration is 15-20 minutes

---

**Good luck with your demo video!** 🎉

*Last updated: February 9, 2026*
