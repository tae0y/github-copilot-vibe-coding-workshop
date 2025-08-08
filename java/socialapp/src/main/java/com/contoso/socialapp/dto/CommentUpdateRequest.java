package com.contoso.socialapp.dto;

public record CommentUpdateRequest(
    String username,
    String content
) {}
