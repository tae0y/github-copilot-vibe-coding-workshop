package com.contoso.socialapp.dto;

import java.time.OffsetDateTime;

public record CommentDTO(
    String id,
    String postId,
    String username,
    String content,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
