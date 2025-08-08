package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.entity.*;
import com.contoso.socialapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public List<CommentDTO> getComments(String postId) {
        if (!postRepository.existsById(postId)) {
            throw new NoSuchElementException("게시물을 찾을 수 없습니다.");
        }
        return commentRepository.findByPostId(postId)
                .stream().map(this::toCommentDTO).collect(Collectors.toList());
    }

    public CommentDTO createComment(String postId, CommentCreateRequest req) {
        if (!postRepository.existsById(postId)) {
            throw new NoSuchElementException("게시물을 찾을 수 없습니다.");
        }
        String id = UUID.randomUUID().toString();
        OffsetDateTime now = OffsetDateTime.now();
        Comment comment = Comment.builder()
                .id(id)
                .postId(postId)
                .username(req.username())
                .content(req.content())
                .createdAt(now)
                .updatedAt(now)
                .build();
        commentRepository.save(comment);
        return toCommentDTO(comment);
    }

    public CommentDTO getComment(String postId, String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> c.getPostId().equals(postId))
                .orElseThrow(() -> new NoSuchElementException("댓글을 찾을 수 없습니다."));
        return toCommentDTO(comment);
    }

    @Transactional
    public CommentDTO updateComment(String postId, String commentId, CommentUpdateRequest req) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> c.getPostId().equals(postId))
                .orElseThrow(() -> new NoSuchElementException("댓글을 찾을 수 없습니다."));
        comment.setUsername(req.username());
        comment.setContent(req.content());
        comment.setUpdatedAt(OffsetDateTime.now());
        commentRepository.save(comment);
        return toCommentDTO(comment);
    }

    @Transactional
    public void deleteComment(String postId, String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .filter(c -> c.getPostId().equals(postId))
                .orElseThrow(() -> new NoSuchElementException("댓글을 찾을 수 없습니다."));
        commentRepository.delete(comment);
    }

    private CommentDTO toCommentDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getPostId(),
                comment.getUsername(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
