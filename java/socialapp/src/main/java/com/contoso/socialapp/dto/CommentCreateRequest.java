package com.contoso.socialapp.dto;

public record CommentCreateRequest(
    String username,
    String content
) {}
