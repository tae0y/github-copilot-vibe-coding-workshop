package com.contoso.socialapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SwaggerRedirectController {
    @GetMapping("/")
    public String redirectToSwagger() {
        return "redirect:/swagger-ui/index.html";
    }
    @GetMapping("/openapi.yaml")
    public String redirectToOpenApiYaml() {
        return "redirect:/v3/api-docs.yaml";
    }
    @GetMapping("/openapi.json")
    public String redirectToOpenApiJson() {
        return "redirect:/v3/api-docs";
    }
}
