# 图片文件夹说明

此文件夹用于存储前端应用的静态图片资源。

## 📁 文件夹结构

```
frontend/
  public/
    images/
      product-1.jpg      # 产品1的图片
      product-2.jpg      # 产品2的图片
      default-product.png # 默认产品图片（当图片加载失败时使用）
      logo.png           # 网站Logo（可选）
      banner.jpg         # 横幅图片（可选）
```

## 📝 使用方法

### 1. 添加图片文件

将图片文件直接放入此文件夹：
- 支持的格式：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- 建议使用有意义的文件名，如 `product-1.jpg`, `logo.png` 等

### 2. 在代码中引用

使用绝对路径（以 `/` 开头）引用图片：

```jsx
// 在React组件中
<img src="/images/product-1.jpg" alt="产品1" />

// 或使用工具函数
import { getImageUrl } from '../utils/imageUtils'
<img src={getImageUrl('/images/product-1.jpg')} alt="产品1" />
```

### 3. 当前使用的图片

根据 `backend/data/products.json` 配置：

- **产品1** (Classic Black T-Shirt): `/images/product-1.jpg`
- **产品2** (Desert Sand Hoodie): `/images/product-2.jpg`
- **默认图片**: `/images/default-product.png` (当图片加载失败时显示)

## 🖼️ 图片要求

### 产品图片建议规格：
- **尺寸**: 600x600 像素或更大（正方形）
- **格式**: JPG 或 PNG
- **文件大小**: 建议小于 500KB（优化加载速度）
- **质量**: 清晰、光线充足的产品照片

### 默认图片：
- **尺寸**: 600x600 像素
- **内容**: 可以是占位符或通用产品图标
- **格式**: PNG（支持透明背景）

## 🔧 如何添加新图片

1. **准备图片文件**
   - 确保图片已优化（压缩、调整尺寸）
   - 使用有意义的文件名

2. **复制到文件夹**
   ```bash
   # 将图片复制到此文件夹
   cp your-image.jpg frontend/public/images/
   ```

3. **更新数据配置**
   - 编辑 `backend/data/products.json`
   - 将 `images` 字段更新为 `/images/your-image.jpg`

4. **测试**
   - 启动开发服务器
   - 检查图片是否正确显示

## 📌 注意事项

- ✅ 路径必须以 `/` 开头（如 `/images/xxx.jpg`）
- ✅ 文件名区分大小写
- ✅ 图片文件会被直接复制到构建输出目录
- ❌ 不要在此文件夹中放置敏感信息
- ❌ 不要放置过大的文件（影响加载速度）

## 🎨 图片优化工具推荐

- **在线压缩**: [TinyPNG](https://tinypng.com/)
- **批量处理**: [ImageOptim](https://imageoptim.com/)
- **格式转换**: [CloudConvert](https://cloudconvert.com/)

## 📚 相关文档

查看 `frontend/图片插入方法说明.md` 了解更多图片使用方法。

