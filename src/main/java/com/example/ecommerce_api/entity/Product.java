package com.example.ecommerce_api.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private double price;

    private int quantity;

    private String imageFilename;

    @ElementCollection
    @CollectionTable(name = "product_image_filenames", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_filename")
    private List<String> imageFilenames = new ArrayList<>();

    private boolean deleted;

    public Product() {
    }

    public Product(String name, String description, double price, int quantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getImageFilename() {
        if (imageFilename != null && !imageFilename.isBlank()) {
            return imageFilename;
        }

        if (imageFilenames == null || imageFilenames.isEmpty()) {
            return null;
        }

        return imageFilenames.get(0);
    }

    public void setImageFilename(String imageFilename) {
        this.imageFilename = imageFilename;

        if (imageFilename == null || imageFilename.isBlank()) {
            if (imageFilenames != null && !imageFilenames.isEmpty()) {
                imageFilenames.removeIf(filename -> filename == null || filename.isBlank());
            }
            return;
        }

        if (imageFilenames == null) {
            imageFilenames = new ArrayList<>();
        }

        imageFilenames.remove(imageFilename);
        imageFilenames.add(0, imageFilename);
    }

    public List<String> getImageFilenames() {
        if (imageFilenames == null) {
            imageFilenames = new ArrayList<>();
        }

        if (imageFilename != null && !imageFilename.isBlank() && imageFilenames.isEmpty()) {
            imageFilenames.add(imageFilename);
        }

        return imageFilenames;
    }

    public void setImageFilenames(List<String> imageFilenames) {
        this.imageFilenames = imageFilenames == null ? new ArrayList<>() : new ArrayList<>(imageFilenames);
        this.imageFilename = this.imageFilenames.isEmpty() ? null : this.imageFilenames.get(0);
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}