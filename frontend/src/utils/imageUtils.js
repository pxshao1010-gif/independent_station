/**
 * 图片路径处理工具函数
 * 支持public文件夹路径和外部URL
 */

/**
 * 获取图片URL
 * @param {string} imagePath - 图片路径（可以是public路径如"/images/xxx.jpg"或外部URL）
 * @returns {string} 处理后的图片URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null
  
  // 如果已经是完整的外部URL（http://或https://），直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 如果是public文件夹路径（以/开头），直接返回（Vite会自动处理）
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // 如果是不带/的相对路径，添加/images/前缀
  return `/images/${imagePath}`
}

/**
 * 获取产品图片URL
 * @param {object} product - 产品对象
 * @param {number} index - 图片索引，默认为0
 * @returns {string|null} 图片URL
 */
export function getProductImageUrl(product, index = 0) {
  if (!product || !product.images || !product.images[index]) {
    return null
  }
  
  return getImageUrl(product.images[index])
}

/**
 * 获取默认产品图片
 * @returns {string} 默认图片路径
 */
export function getDefaultProductImage() {
  return '/images/default-product.png'
}

