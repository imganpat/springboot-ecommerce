package com.example.ecommerce_api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/")
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Product rest api";
    }
}
