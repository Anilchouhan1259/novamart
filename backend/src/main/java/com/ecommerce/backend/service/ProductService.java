package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductDto> getProducts(String category, String search, String sort) {
        String cleanCategory = (category != null && !category.trim().equalsIgnoreCase("all") && !category.trim().isEmpty())
                ? category.trim() : null;
        String cleanSearch = (search != null && !search.trim().isEmpty())
                ? search.trim() : null;

        List<Product> products = productRepository.searchProducts(cleanCategory, cleanSearch);

        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "price-asc":
                    products.sort(Comparator.comparing(Product::getPrice));
                    break;
                case "price-desc":
                    products.sort(Comparator.comparing(Product::getPrice).reversed());
                    break;
                case "name-asc":
                    products.sort(Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER));
                    break;
                case "rating":
                    products.sort(Comparator.comparing(Product::getRating).reversed());
                    break;
                case "newest":
                default:
                    products.sort(Comparator.comparing(Product::getCreatedAt).reversed());
                    break;
            }
        }

        return products.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getImageUrl(),
                dto.getCategory(),
                dto.getStockQuantity(),
                dto.getRating(),
                dto.getFeatured()
        );

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setCategory(dto.getCategory());
        product.setStockQuantity(dto.getStockQuantity());
        if (dto.getRating() != null) {
            product.setRating(dto.getRating());
        }
        if (dto.getFeatured() != null) {
            product.setFeatured(dto.getFeatured());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductDto mapToDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory(),
                product.getStockQuantity(),
                product.getRating(),
                product.getFeatured(),
                product.getCreatedAt()
        );
    }
}
