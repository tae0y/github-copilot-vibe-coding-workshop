package com.contoso.socialapp.controller;

import com.contoso.socialapp.dto.*;
import com.contoso.socialapp.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final CommentService commentService;
    private final LikeService likeService;

    // 게시글 목록 조회
    @GetMapping("/posts")
    public List<PostDTO> listPosts() {
        return postService.getAllPosts();
    }

    // 게시글 생성
    @PostMapping("/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostDTO createPost(@RequestBody PostCreateRequest req) {
        return postService.createPost(req);
    }

    // 게시글 단건 조회
    @GetMapping("/posts/{postId}")
    public PostDTO getPost(@PathVariable String postId) {
        return postService.getPost(postId);
    }

    // 게시글 수정
    @PatchMapping("/posts/{postId}")
    public PostDTO updatePost(@PathVariable String postId, @RequestBody PostUpdateRequest req) {
        return postService.updatePost(postId, req);
    }

    // 게시글 삭제
    @DeleteMapping("/posts/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
    }

    // 댓글 목록 조회
    @GetMapping("/posts/{postId}/comments")
    public List<CommentDTO> listComments(@PathVariable String postId) {
        return commentService.getComments(postId);
    }

    // 댓글 생성
    @PostMapping("/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public CommentDTO createComment(@PathVariable String postId, @RequestBody CommentCreateRequest req) {
        return commentService.createComment(postId, req);
    }

    // 댓글 단건 조회
    @GetMapping("/posts/{postId}/comments/{commentId}")
    public CommentDTO getComment(@PathVariable String postId, @PathVariable String commentId) {
        return commentService.getComment(postId, commentId);
    }

    // 댓글 수정
    @PatchMapping("/posts/{postId}/comments/{commentId}")
    public CommentDTO updateComment(@PathVariable String postId, @PathVariable String commentId, @RequestBody CommentUpdateRequest req) {
        return commentService.updateComment(postId, commentId, req);
    }

    // 댓글 삭제
    @DeleteMapping("/posts/{postId}/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable String postId, @PathVariable String commentId) {
        commentService.deleteComment(postId, commentId);
    }

    // 좋아요 생성
    @PostMapping("/posts/{postId}/likes")
    @ResponseStatus(HttpStatus.CREATED)
    public void likePost(@PathVariable String postId, @RequestBody LikeRequest req) {
        likeService.likePost(postId, req);
    }

    // 좋아요 취소
    @DeleteMapping("/posts/{postId}/likes")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlikePost(@PathVariable String postId, @RequestBody LikeRequest req) {
        likeService.unlikePost(postId, req);
    }

    // 예외 처리 (404, 400 등)
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(ex.getMessage()));
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(ex.getMessage()));
    }
}
