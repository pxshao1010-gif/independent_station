# Public文件夹图片使用指南

## 🚀 快速开始

项目已配置为使用 `public/images/` 文件夹存储和加载图片。

## 📂 文件夹位置

```
frontend/
  public/
    images/          ← 图片存储在这里
      product-1.jpg
      product-2.jpg
      default-product.png
```

## ✅ 已完成的配置

1. ✅ 创建了 `public/images/` 文件夹
2. ✅ 创建了图片路径处理工具函数 (`src/utils/imageUtils.js`)
3. ✅ 更新了 `ProductCard` 组件使用public文件夹
4. ✅ 更新了 `Cart` 组件使用public文件夹
5. ✅ 更新了后端产品数据配置

## 📝 如何添加图片

### 步骤1: 准备图片文件

准备以下图片文件：
- `product-1.jpg` - 产品1的图片（Classic Black T-Shirt）
- `product-2.jpg` - 产品2的图片（Desert Sand Hoodie）
- `default-product.png` - 默认产品图片（可选，用于加载失败时显示）

### 步骤2: 复制图片到文件夹

```bash
# 方法1: 使用命令行
cp your-image.jpg frontend/public/images/product-1.jpg

# 方法2: 直接拖拽
# 在文件管理器中，将图片文件拖拽到 frontend/public/images/ 文件夹
```

### 步骤3: 验证图片路径

确保在 `backend/data/products.json` 中图片路径正确：

```json
{
  "id": 1,
  "images": ["/images/product-1.jpg"]  ← 路径以 /images/ 开头
}
```

## 🔧 代码使用示例

### 在组件中使用图片

```jsx
// 方法1: 直接使用路径（推荐）
<img src="/images/product-1.jpg" alt="产品1" />

// 方法2: 使用工具函数（支持外部URL和本地路径）
import { getImageUrl } from '../utils/imageUtils'
<img src={getImageUrl('/images/product-1.jpg')} alt="产品1" />

// 方法3: 使用产品图片工具函数
import { getProductImageUrl } from '../utils/imageUtils'
const imageUrl = getProductImageUrl(product)
<img src={imageUrl} alt={product.title} />
```

### 当前实现

**ProductCard组件** (`src/components/ProductCard.jsx`):
```jsx
import { getProductImageUrl, getDefaultProductImage } from '../utils/imageUtils'

const imageUrl = getProductImageUrl(product) || getDefaultProductImage()
<img 
  src={imageError ? getDefaultProductImage() : imageUrl} 
  alt={title}
  onError={() => setImageError(true)}
/>
```

**Cart组件** (`src/components/Cart.jsx`):
```jsx
import { getImageUrl, getDefaultProductImage } from '../utils/imageUtils'

const imageUrl = item.image ? getImageUrl(item.image) : getDefaultProductImage()
<img 
  src={imageUrl} 
  alt={item.title}
  onError={(e) => { e.target.src = getDefaultProductImage() }}
/>
```

## 🎯 图片路径规则

### ✅ 正确的路径格式

```jsx
// 1. 绝对路径（推荐）
"/images/product-1.jpg"

// 2. 外部URL（仍然支持）
"https://example.com/image.jpg"
```

### ❌ 错误的路径格式

```jsx
// 不要使用相对路径
"./images/product-1.jpg"  // ❌
"../images/product-1.jpg" // ❌
"images/product-1.jpg"    // ❌（缺少前导斜杠）
```

## 🖼️ 图片要求

### 产品图片建议

- **尺寸**: 600x600 像素或更大（正方形）
- **格式**: JPG（照片）或 PNG（图标）
- **文件大小**: < 500KB（优化加载速度）
- **命名**: 使用有意义的文件名，如 `product-1.jpg`

### 图片优化

在添加图片前，建议进行优化：

1. **压缩图片**: 使用 [TinyPNG](https://tinypng.com/) 或类似工具
2. **调整尺寸**: 确保图片尺寸合适（不要过大）
3. **格式选择**: 
   - 照片 → JPG
   - 图标/Logo → PNG（支持透明）
   - 现代格式 → WebP（更好的压缩）

## 🔍 故障排查

### 图片不显示？

1. **检查文件是否存在**
   ```bash
   ls frontend/public/images/
   ```

2. **检查路径是否正确**
   - 路径必须以 `/` 开头
   - 路径区分大小写
   - 文件名必须完全匹配

3. **检查浏览器控制台**
   - 打开开发者工具（F12）
   - 查看 Network 标签页
   - 检查图片请求是否404

4. **检查数据配置**
   - 确认 `backend/data/products.json` 中的路径正确
   - 路径格式：`/images/xxx.jpg`

### 常见错误

**404 Not Found**
- 文件不存在或路径错误
- 检查文件名和路径

**CORS错误**
- 如果使用外部URL，确保服务器允许跨域访问

**图片加载失败**
- 代码已包含错误处理，会自动显示默认图片

## 📚 相关文件

- **工具函数**: `frontend/src/utils/imageUtils.js`
- **产品卡片**: `frontend/src/components/ProductCard.jsx`
- **购物车**: `frontend/src/components/Cart.jsx`
- **产品数据**: `backend/data/products.json`
- **详细说明**: `frontend/public/images/README.md`

## 💡 提示

1. **开发环境**: 图片修改后，刷新浏览器即可看到效果
2. **生产环境**: 构建后，图片会被复制到 `dist/images/` 文件夹
3. **版本控制**: 建议将图片文件添加到 `.gitignore`（如果文件较大），或使用Git LFS

## 🎨 示例图片

如果需要占位符图片进行测试，可以使用以下命令生成：

```bash
# 使用ImageMagick生成占位符（如果已安装）
convert -size 600x600 xc:lightblue \
  -pointsize 72 -fill black -gravity center \
  -annotate +0+0 "Product 1" \
  frontend/public/images/product-1.jpg
```

或者访问 [placeholder.com](https://via.placeholder.com/600x600) 下载占位符图片。

---

**现在你可以开始添加图片到 `frontend/public/images/` 文件夹了！** 🎉

