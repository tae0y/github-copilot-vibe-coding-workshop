package com.contoso.socialapp.dto;

public record PostUpdateRequest(
    String username,
    String content
) {}
