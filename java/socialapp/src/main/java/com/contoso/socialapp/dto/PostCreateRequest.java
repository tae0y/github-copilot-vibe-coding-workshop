package com.contoso.socialapp.dto;

public record PostCreateRequest(
    String username,
    String content
) {}
