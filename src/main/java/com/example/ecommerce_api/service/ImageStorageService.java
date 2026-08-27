package com.example.ecommerce_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageStorageService {

    private final Path uploadDirectory;

    public ImageStorageService(@Value("${app.upload.image-directory:uploads/images}") String uploadDirectory) {
        this.uploadDirectory = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    public String store(MultipartFile image) throws IOException {
        String contentType = image.getContentType();
        if (image.isEmpty() || contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("A non-empty image file is required");
        }

        String extension = StringUtils.getFilenameExtension(image.getOriginalFilename());
        return storeToFile(image.getInputStream(), extension);
    }

    public String store(InputStream image, String contentType) throws IOException {
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("An image content type is required");
        }
        return storeToFile(image, extensionFor(contentType));
    }

    private String storeToFile(InputStream image, String extension) throws IOException {
        String filename = UUID.randomUUID() + (extension == null ? "" : "." + extension.toLowerCase());
        Files.createDirectories(uploadDirectory);
        Path target = uploadDirectory.resolve(filename).normalize();
        if (!target.getParent().equals(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid image filename");
        }
        Files.copy(image, target);
        return filename;
    }

    private String extensionFor(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/gif" -> "gif";
            case "image/webp" -> "webp";
            default -> null;
        };
    }

    public Path load(String filename) {
        Path file = uploadDirectory.resolve(filename).normalize();
        if (!file.getParent().equals(uploadDirectory)) {
            throw new IllegalArgumentException("Invalid image filename");
        }
        return file;
    }

    public void delete(String filename) throws IOException {
        if (filename != null) {
            Files.deleteIfExists(load(filename));
        }
    }
}