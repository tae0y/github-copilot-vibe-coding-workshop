package com.contoso.socialapp.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record PostDTO(
    String id,
    String username,
    String content,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    List<CommentDTO> comments,
    int likesCount
) {}
