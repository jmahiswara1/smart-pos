# 🎬 SMART POS - SCRIPT VIDEO DEMO LENGKAP

## 📋 RINGKASAN
**Durasi**: 15-20 menit  
**Fokus CRUD**: Products & Categories  
**Postman**: Semua endpoint Auth, Products, Categories (lengkap) + endpoint lainnya (ringkas)

---

## 🎯 BAGIAN 1: INTRO (1-2 menit)

### Script:
```
"Selamat datang di demo Smart POS - Point of Sale System yang Modern.

Aplikasi ini dibangun dengan:
- Backend: NestJS, TypeScript, PostgreSQL, Prisma ORM
- Frontend: React, TypeScript, TailwindCSS
- Authentication: JWT Token

Smart POS membantu bisnis retail mengelola inventory, customers, 
dan transactions dengan efisien.

Mari kita mulai demo nya..."
```

**Visual**: Tampilkan splash screen atau home page aplikasi.

---

## 🔐 BAGIAN 2: LOGIN & AUTHENTICATION (2-3 menit)

### A. Demo Login Page

**Script:**
```
"Pertama, kita akan login ke sistem. 
Ini adalah halaman login dengan form validation."
```

#### Steps:
1. **Tampilkan login page** - tunjukkan desain modern dengan logo
2. **Test Wrong Credentials**:
   - Email: `wrong@email.com`
   - Password: `wrongpassword`
   - **Tunjukkan**: Error message muncul tanpa page refresh
   
3. **Login dengan Correct Credentials**:
   - Email: `admin@smartpos.com` (sesuaikan dengan data Anda)
   - Password: password yang benar
   - **Tunjukkan**: Success message & redirect ke dashboard

**Script:**
```
"Perhatikan bahwa ketika credentials salah, error message muncul
tanpa refresh halaman. Setelah login sukses, kita mendapat JWT token
yang disimpan di localStorage untuk autentikasi selanjutnya."
```

**Visual**: Tunjukkan localStorage (F12 → Application → Local Storage) yang berisi token.

---

## 📦 BAGIAN 3: CRUD PRODUCTS (4-5 menit)

### Script Pembuka:
```
"Sekarang kita akan demo operasi CRUD lengkap untuk Products.
Ini adalah salah satu dari 2 tabel utama yang akan saya tunjukkan."
```

### ✅ CREATE - Tambah Product Baru

#### Steps:
1. **Navigate to Products page**
2. **Click "Add Product" button**
3. **Fill form**:
   - Name: `Laptop Dell XPS 15`
   - SKU: `LAPTOP-001`
   - Category: Pilih `Electronics` (dari dropdown)
   - Price: `15000000`
   - Cost: `13000000`
   - Stock: `10`
   - Min Stock: `2`
   - Barcode: `8901234567890`
   - Description: `High-performance laptop for professionals`
   - Upload image (optional)

4. **Click Submit**

**Script:**
```
"Saya akan menambahkan product baru - Laptop Dell XPS 15.
Form ini memiliki validation, jadi semua field required harus diisi.
Setelah submit, product langsung muncul di list."
```

**Visual**: Tunjukkan toast notification sukses & product baru di table.

---

### 👀 READ - View & Search Products

#### Steps:
1. **Tunjukkan products table**:
   - Image, Name, SKU, Price, Stock
   - Pagination di bagian bawah

2. **Demo Search**:
   - Ketik: `laptop` di search box
   - **Tunjukkan**: Hasil filtered real-time
   - Clear search

3. **Demo Sorting**:
   - Sort by: Name (A-Z)
   - Sort by: Price (Low to High)
   - Sort by: Stock (Low to High)
   - Toggle ascending/descending dengan tombol arrow

4. **Demo Pagination**:
   - Ubah items per page (10, 25, 50)
   - Navigate between pages

**Script:**
```
"Products ditampilkan dalam table dengan pagination.
Kita bisa search by name atau SKU dengan debounce 500ms.
Ada juga sorting by name, price, stock dengan ascending/descending.
Dan pagination untuk menampilkan data dalam jumlah besar."
```

---

### ✏️ UPDATE - Edit Product

#### Steps:
1. **Click edit icon** pada product yang tadi dibuat
2. **Modify fields**:
   - Price: ubah ke `14500000`
   - Stock: ubah ke `15`
3. **Click Update**

**Script:**
```
"Untuk update product, klik icon edit.
Form akan ter-populate dengan data existing.
Saya akan update price dan stock, lalu save changes."
```

**Visual**: Tunjukkan toast notification & data terupdate di table.

---

### 🗑️ DELETE - Hapus Product

#### Steps:
1. **Click delete icon** pada product lainnya
2. **Tunjukkan confirmation dialog**:
   - "Are you sure you want to delete...?"
3. **Click Confirm**
4. **Product hilang dari list** (hard delete - permanent)

**Script:**
```
"Delete product bersifat permanent (hard delete).
Ada confirmation dialog untuk mencegah accidental deletion.
Setelah confirm, product langsung terhapus dari database."
```

**Visual**: Product removed, toast success.

---

## 📂 BAGIAN 4: CRUD CATEGORIES (4-5 menit)

### Script Pembuka:
```
"Sekarang kita lanjut ke table kedua - Categories.
Categories digunakan untuk mengorganisir products."
```

### ✅ CREATE - Tambah Category Baru

#### Steps:
1. **Navigate to Categories page**
2. **Click "Add Category" button**
3. **Fill form**:
   - Name: `Home & Living`
   - Description: `Furniture and home decor products`
   - Color: Pilih warna (misal: Orange `#FF6B6B`)
4. **Click Create**

**Script:**
```
"Form category lebih sederhana dibanding product.
Kita bisa set warna untuk visual distinction di UI.
Warna ini akan muncul sebagai badge/indicator."
```

**Visual**: Category baru muncul dengan color badge nya.

---

### 👀 READ - View & Search Categories

#### Steps:
1. **Tunjukkan categories table**:
   - Color badge
   - Name
   - Description
   - Products count

2. **Demo Search**:
   - Ketik: `electronic` di search box
   - Results filtered
   - Clear search

**Script:**
```
"Setiap category menampilkan jumlah products yang ada di category tersebut.
Search juga berfungsi real-time dengan debounce."
```

---

### ✏️ UPDATE - Edit Category

#### Steps:
1. **Click edit** pada category
2. **Modify**:
   - Description: Update deskripsi
   - Color: Ganti warna
3. **Click Update**

**Script:**
```
"Update category works sama seperti product.
Perubahan warna langsung terlihat di table."
```

---

### 🗑️ DELETE - Hapus Category

#### Steps:
1. **Click delete** pada category yang TIDAK memiliki products
2. **Confirmation dialog**
3. **Click Confirm**

**Script:**
```
"Category menggunakan soft delete, jadi data tidak benar-benar hilang.
Best practice: jangan delete category yang masih memiliki products."
```

**Note**: Jika ada error karena category memiliki products, jelaskan bahwa ini adalah database constraint.

---

## 🔌 BAGIAN 5: POSTMAN API TESTING (5-6 menit)

### Script Pembuka:
```
"Sekarang kita akan test API endpoints menggunakan Postman.
Saya akan test secara lengkap untuk Auth, Products, dan Categories,
dan ringkas untuk endpoint lainnya."
```

### Preparation:
1. **Buka Postman**
2. **Set base URL**: `http://localhost:3000/api`
3. **Prepare Collection**: Smart POS API

---

### 🔐 A. AUTHENTICATION ENDPOINTS (LENGKAP)

#### 1. POST /api/auth/register
**Script:** "Pertama, kita test register new user."

**Request:**
```json
POST http://localhost:3000/api/auth/register
Headers: Content-Type: application/json

Body:
{
  "email": "testuser@smartpos.com",
  "password": "Test123!",
  "name": "Test User",
  "role": "CASHIER"
}
```

**Expected Response:**
```json
Status: 201 Created
{
  "id": "uuid",
  "email": "testuser@smartpos.com",
  "name": "Test User",
  "role": "CASHIER"
}
```

---

#### 2. POST /api/auth/login
**Script:** "Login untuk mendapat JWT token."

**Request:**
```json
POST http://localhost:3000/api/auth/login

Body:
{
  "email": "admin@smartpos.com",
  "password": "your_password"
}
```

**Expected Response:**
```json
Status: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@smartpos.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**Script:**
```
"Copy access_token ini - kita akan gunakan untuk authorization
di semua protected endpoints selanjutnya."
```

**Action**: Save token ke Environment Variable di Postman.

---

#### 3. GET /api/auth/profile
**Script:** "Get current user profile dengan token."

**Request:**
```
GET http://localhost:3000/api/auth/profile
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "id": "uuid",
  "email": "admin@smartpos.com",
  "name": "Admin User",
  "role": "ADMIN"
}
```

---

### 📦 B. PRODUCTS ENDPOINTS (LENGKAP)

#### 1. GET /api/products
**Script:** "Get all products dengan pagination dan filters."

**Request:**
```
GET http://localhost:3000/api/products?page=1&limit=10&search=laptop&sortBy=price&sortOrder=desc
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "name": "Laptop Dell XPS 15",
      "sku": "LAPTOP-001",
      "price": 14500000,
      "stock": 15,
      "category": {
        "id": "uuid",
       "name": "Electronics"
      },
      ...
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**Script:** "Tunjukkan query parameters untuk filtering."

---

#### 2. GET /api/products/:id
**Script:** "Get single product by ID."

**Request:**
```
GET http://localhost:3000/api/products/{product_id}
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "id": "uuid",
  "name": "Laptop Dell XPS 15",
  "sku": "LAPTOP-001",
  "price": 14500000,
  "cost": 13000000,
  "stock": 15,
  "minStock": 2,
  "barcode": "8901234567890",
  "description": "High-performance laptop...",
  "category": {...},
  "createdAt": "2026-02-09T...",
  "updatedAt": "2026-02-09T..."
}
```

---

#### 3. POST /api/products
**Script:** "Create new product via API."

**Request:**
```json
POST http://localhost:3000/api/products
Headers:
- Authorization: Bearer {{access_token}}
- Content-Type: application/json

Body:
{
  "name": "Mouse Logitech MX Master 3",
  "sku": "MOUSE-001",
  "categoryId": "{electronics_category_id}",
  "price": 1200000,
  "cost": 950000,
  "stock": 50,
  "minStock": 10,
  "barcode": "8901234567891",
  "description": "Wireless ergonomic mouse"
}
```

**Expected Response:**
```json
Status: 201 Created
{
  "id": "new_uuid",
  "name": "Mouse Logitech MX Master 3",
  "sku": "MOUSE-001",
  ...
}
```

---

#### 4. PATCH /api/products/:id
**Script:** "Update existing product."

**Request:**
```json
PATCH http://localhost:3000/api/products/{product_id}
Headers:
- Authorization: Bearer {{access_token}}
- Content-Type: application/json

Body:
{
  "price": 1150000,
  "stock": 45
}
```

**Expected Response:**
```json
Status: 200 OK
{
  "id": "uuid",
  "price": 1150000,
  "stock": 45,
  ...
}
```

---

#### 5. DELETE /api/products/:id
**Script:** "Delete product - hard delete."

**Request:**
```
DELETE http://localhost:3000/api/products/{product_id}
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "message": "Product deleted successfully"
}
```

---

#### 6. GET /api/products/stats
**Script:** "Get product statistics."

**Request:**
```
GET http://localhost:3000/api/products/stats
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "total": 45,
  "active": 42,
  "lowStock": 5,
  "outOfStock": 2,
  "totalStock": 1250
}
```

---

#### 7. GET /api/products/low-stock
**Script:** "Get products dengan stock rendah."

**Request:**
```
GET http://localhost:3000/api/products/low-stock
Headers:
- Authorization: Bearer {{access_token}}
```

---

#### 8. GET /api/products/by-category
**Script:** "Get products grouped by category."

**Request:**
```
GET http://localhost:3000/api/products/by-category
Headers:
- Authorization: Bearer {{access_token}}
```

---

#### 9. POST /api/products/bulk-update
**Script:** "Bulk update multiple products sekaligus."

**Request:**
```json
POST http://localhost:3000/api/products/bulk-update
Headers:
- Authorization: Bearer {{access_token}}

Body:
{
  "ids": ["id1", "id2", "id3"],
  "isActive": true
}
```

---

### 📂 C. CATEGORIES ENDPOINTS (LENGKAP)

#### 1. GET /api/categories
**Script:** "Get all categories dengan pagination."

**Request:**
```
GET http://localhost:3000/api/categories?page=1&limit=10&search=electronics
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "name": "Electronics",
      "description": "Gadgets and devices",
      "color": "#3B82F6",
      "_count": {
        "products": 12
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

#### 2. GET /api/categories/:id
**Script:** "Get single category dengan products nya."

**Request:**
```
GET http://localhost:3000/api/categories/{category_id}
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "id": "uuid",
  "name": "Electronics",
  "description": "...",
  "color": "#3B82F6",
  "products": [...],
  "_count": {
    "products": 12
  }
}
```

---

#### 3. POST /api/categories
**Script:** "Create new category."

**Request:**
```json
POST http://localhost:3000/api/categories
Headers:
- Authorization: Bearer {{access_token}}

Body:
{
  "name": "Sports & Outdoors",
  "description": "Sports equipment and outdoor gear",
  "color": "#10B981"
}
```

**Expected Response:**
```json
Status: 201 Created
{
  "id": "new_uuid",
  "name": "Sports & Outdoors",
  ...
}
```

---

#### 4. PATCH /api/categories/:id
**Script:** "Update category."

**Request:**
```json
PATCH http://localhost:3000/api/categories/{category_id}
Headers:
- Authorization: Bearer {{access_token}}

Body:
{
  "description": "Updated description",
  "color": "#F59E0B"
}
```

---

#### 5. DELETE /api/categories/:id
**Script:** "Delete category - soft delete."

**Request:**
```
DELETE http://localhost:3000/api/categories/{category_id}
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "message": "Category deleted successfully"
}
```

---

#### 6. GET /api/categories/stats
**Script:** "Get category statistics."

**Request:**
```
GET http://localhost:3000/api/categories/stats
Headers:
- Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
Status: 200 OK
{
  "total": 8,
  "active": 7,
  "inactive": 1
}
```

---

### 👥 D. CUSTOMERS ENDPOINTS (RINGKAS)

**Script:** 
```
"Untuk module lainnya seperti Customers, saya akan tunjukkan 
secara ringkas karena pattern nya sama."
```

#### Endpoints:
```
GET    /api/customers           - Get all customers
GET    /api/customers/:id       - Get single customer
POST   /api/customers           - Create customer
PATCH  /api/customers/:id       - Update customer
DELETE /api/customers/:id       - Toggle active/inactive
GET    /api/customers/stats     - Get stats
```

**Demo**: Hanya GET all customers & POST create one customer.

---

### 💰 E. TRANSACTIONS ENDPOINTS (RINGKAS)

**Script:** "Transaction endpoints untuk POS operations."

#### Endpoints:
```
GET    /api/transactions        - Get all transactions
GET    /api/transactions/:id    - Get single transaction
POST   /api/transactions        - Create transaction (sale)
PATCH  /api/transactions/:id/status - Update status
GET    /api/transactions/stats  - Get revenue stats
```

**Demo**: GET all transactions & tunjukkan structure response.

---

### 👤 F. USERS ENDPOINTS (RINGKAS)

**Script:** "User management untuk admin."

#### Endpoints:
```
GET    /api/users               - Get all users
GET    /api/users/:id           - Get single user  
PATCH  /api/users/:id           - Update user
```

**Demo**: GET all users saja.

---

## 📊 BAGIAN 6: FEATURES & DATA DISPLAY (2-3 menit)

### Script:
```
"Sekarang saya akan explain beberapa key features dan bagaimana
data ditampilkan di aplikasi."
```

### A. Dashboard Statistics

**Navigate to Dashboard & tunjukkan:**
1. **Total Revenue**: "Aggregates semua transaction totals"
2. **Total Profit**: "Calculated as sumOf(price - cost) * quantity"
3. **Today's Revenue**: "Filter transactions by today's date"
4. **Today's Transactions**: "Count of today's transactions"
5. **Today's Products Sold**: "Sum of quantities sold today"

**Script:**
```
"Dashboard stats ini real-time dari database.
Setiap transaksi baru langsung update angka-angka ini."
```

---

### B. Customer Status Badges

**Navigate to Customers Page & tunjukkan:**
1. **Active customers**: Green badge
2. **Inactive customers**: Red badge  
3. **Toggle button**: UserCheck (activate) / UserX (deactivate)

**Script:**
```
"Customer status ditampilkan dengan color-coded badges.
Green untuk active, red untuk inactive.
Kita bisa toggle status tanpa delete customer."
```

---

### C. Product Sorting & Filtering

**Di Products Page tunjukkan:**
1. **Search by name/SKU**
2. **Sort dropdown**: Name, Price, Stock, Date
3. **Ascending/Descending toggle**
4. **Pagination controls**

**Script:**
```
"Features sorting dan filtering membantu manage inventory besar.
Search dengan debounce untuk performance,
dan sorting bisa by multiple fields."
```

---

## 💻 BAGIAN 7: MVC PATTERN CODE WALKTHROUGH (2-3 menit)

### Script:
```
"Sekarang kita lihat bagaimana MVC pattern diimplementasi di codebase."
```

### A. Controller (API Routes)

**Open:** `products.controller.ts`

**Tunjukkan:**
```typescript
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query() filterDto: FilterProductDto) {
    return this.productsService.findAll(filterDto);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

**Script:**
```
"Controller handles HTTP requests.
Decorators @Get, @Post define routes.
Business logic di-delegate ke Service layer.
DTO untuk validation."
```

---

### B. Service (Business Logic)

**Open:** `products.service.ts`

**Tunjukkan:**
```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filterDto: FilterProductDto) {
    const where: Prisma.ProductWhereInput = {};

    if (filterDto.search) {
      where.OR = [
        { name: { contains: filterDto.search, mode: 'insensitive' } },
        { sku: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [filterDto.sortBy]: filterDto.sortOrder },
    });
  }
}
```

**Script:**
```
"Service contains business logic.
Database operations via Prisma ORM.
Search, filter, sorting logic ada di sini.
Reusable dan testable."
```

---

### C. Model (Database Schema)

**Open:** `schema.prisma`

**Tunjukkan:**
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  sku         String   @unique
  price       Decimal  @db.Decimal(10, 2)
  cost        Decimal  @db.Decimal(10, 2)
  stock       Int
  minStock    Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Category {
  id          String    @id @default(uuid())
  name        String
  description String?
  color       String?
  products    Product[]
  
  @@map("categories")
}
```

**Script:**
```
"Prisma schema defines database structure.
Relations antara tables dengan @relation.
Type-safe dengan TypeScript auto-generation.
Migrations automatic dari schema changes."
```

---

### D. Frontend Component (View)

**Open:** `ProductsPage.tsx`

**Tunjukkan:**
```typescript
export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  
  const { data, isLoading } = useQuery({
    queryKey: ['products', search, sortBy],
    queryFn: async () => {
      const { data } = await api.get('/products', {
        params: { search, sortBy }
      });
      return data;
    }
  });

  return (
    <div>
      <Table data={products} />
    </div>
  );
}
```

**Script:**
```
"React components sebagai View layer.
React Query untuk data fetching dan caching.
State management dengan useState.
Component composition untuk reusability."
```

---

### MVC Flow Diagram

**Script:**
```
"Ini flow dari user action sampai database:

1. User clicks button (View - React Component)
2. API call via axios (Frontend Service)
3. Request hits Controller (NestJS @Get/@Post)
4. Controller calls Service method
5. Service executes business logic
6. Prisma ORM queries database (Model)
7. Data returned to Service
8. Service transforms data
9. Controller sends HTTP response
10. Frontend updates UI (React re-render)

Separation of concerns ini membuat code maintainable dan testable."
```

---

## ⚠️ BAGIAN 8: ERROR HANDLING (1-2 menit)

### Script:
```
"Terakhir, saya akan demo error handling implementation."
```

### A. Validation Errors (400)

**Di Postman:**
```
POST /api/products
Body: {
  "name": "",  // Empty - invalid!
  "sku": "TEST"
}
```

**Response:**
```json
Status: 400 Bad Request
{
  "statusCode": 400,
  "message": ["name should not be empty"],
  "error": "Bad Request"
}
```

**Script:** "Class-validator otomatis validate DTO dan return 400."

---

### B. Not Found (404)

**Di Postman:**
```
GET /api/products/non-existent-id
```

**Response:**
```json
Status: 404 Not Found
{
  "statusCode": 404,
  "message": "Product not found"
}
```

---

### C. Unauthorized (401)

**Di Postman:**
```
GET /api/products
(Tanpa Authorization header)
```

**Response:**
```json
Status: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Script:**
```
"JWT Guard protect semua endpoints.
Tanpa valid token, dapat 401 Unauthorized."
```

---

### D. Frontend Error Handling

**Di Browser:**
1. **Try delete product** → Confirmation dialog
2. **Try submit empty form** → Field validation errors
3. **Network error simulation** → Toast error message

**Open:** `axios.ts` 

**Tunjukkan interceptor:**
```typescript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Script:**
```
"Axios interceptor handles errors globally.
401 auto-redirect to login.
Toast notifications untuk user feedback.
Error boundary component catches React errors."
```

---

## 🎬 OUTRO (1 menit)

### Script:
```
"Terima kasih telah menonton demo Smart POS.

Kita telah melihat:
✅ Authentication dengan JWT
✅ CRUD lengkap untuk Products dan Categories
✅ Testing API endpoints di Postman secara comprehensive
✅ Key features seperti sorting, filtering, dan status badges
✅ MVC pattern implementation
✅ Error handling di backend dan frontend

Smart POS ini production-ready dengan:
- Type-safe development dengan TypeScript
- Database migrations dengan Prisma
- Real-time data dengan React Query
- Modern UI dengan TailwindCSS
- Comprehensive error handling
- RESTful API design

Untuk source code dan documentation lengkap,
silakan check repository GitHub.

Terima kasih!"
```

---

## 📋 CHECKLIST SEBELUM RECORDING

### Pre-Recording:
- [ ] Backend server running: `npm run start:dev`
- [ ] Frontend server running: `npm run dev`
- [ ] Database seeded dengan sample data
- [ ] Postman collection prepared
- [ ] Browser cache cleared
- [ ] Close unnecessary tabs
- [ ] Audio test
- [ ] Screen resolution: 1920x1080

### Sample Data Needed:
- [ ] 10-15 products across different categories
- [ ] 5-10 categories dengan warna berbeda
- [ ] 5-8 customers (mix active/inactive)
- [ ] 3-5 transactions untuk dashboard stats
- [ ] Admin user untuk login

### Postman Setup:
- [ ] Collection: "Smart POS API"
- [ ] Environment Variable: `base_url` = `http://localhost:3000/api`
- [ ] Environment Variable: `access_token` = (will get from login)
- [ ] Semua request sudah di-organize by folder

---

## 🎥 RECORDING SETTINGS

**Software**: OBS Studio / Camtasia
**Resolution**: 1920x1080 (Full HD)
**Frame Rate**: 30 fps
**Audio**: 128 kbps, clear narration
**Format**: MP4 (H.264 codec)

**Annotations**:
- Highlight cursor clicks
- Zoom in pada code sections
- Use text overlays untuk emphasize key points

---

## 📊 TOTAL ENDPOINT COUNT

### Berdasarkan Module:

1. **Auth** (3 endpoints):
   - POST /register
   - POST /login
   - GET /profile

2. **Products** (9 endpoints):
   - GET /products
   - GET /products/:id
   - POST /products
   - PATCH /products/:id
   - DELETE /products/:id
   - GET /products/stats
   - GET /products/low-stock
   - GET /products/by-category
   - POST /products/bulk-update

3. **Categories** (6 endpoints):
   - GET /categories
   - GET /categories/:id
   - POST /categories
   - PATCH /categories/:id
   - DELETE /categories/:id
   - GET /categories/stats

4. **Customers** (6 endpoints):
   - GET /customers
   - GET /customers/:id
   - POST /customers
   - PATCH /customers/:id
   - DELETE /customers/:id (toggle)
   - GET /customers/stats

5. **Transactions** (5 endpoints):
   - GET /transactions
   - GET /transactions/:id
   - POST /transactions
   - PATCH /transactions/:id/status
   - GET /transactions/stats

6. **Users** (3 endpoints):
   - GET /users
   - GET /users/:id
   - PATCH /users/:id

**TOTAL: 32 endpoints**

---

## ✅ GOOD LUCK!

Script ini comprehensive dan detail.
Durasi estimasi: 18-20 menit.

Tips terakhir:
- Speak clearly and slowly
- Pause saat transition
- Show cursor movement
- Highlight penting sections
- Keep energy up throughout

**Selamat merekam!** 🎬
