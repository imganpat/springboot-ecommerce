package com.example.ecommerce_api;

import com.example.ecommerce_api.entity.Product;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void shouldKeepMultipleImageFilenamesAndExposeFirstAsLegacyDefault() {
        Product product = new Product();

        product.setImageFilenames(new java.util.ArrayList<>(java.util.List.of("a.png", "b.png")));

        assertEquals("a.png", product.getImageFilename());
        assertEquals(java.util.List.of("a.png", "b.png"), product.getImageFilenames());

        product.setImageFilename("c.png");
        assertEquals("c.png", product.getImageFilename());
        assertEquals(java.util.List.of("c.png"), product.getImageFilenames());
    }
}
