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
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public List<PostDTO> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(this::toPostDTO).collect(Collectors.toList());
    }

    public PostDTO createPost(PostCreateRequest req) {
        String id = UUID.randomUUID().toString();
        OffsetDateTime now = OffsetDateTime.now();
        Post post = Post.builder()
                .id(id)
                .username(req.username())
                .content(req.content())
                .createdAt(now)
                .updatedAt(now)
                .likesCount(0)
                .comments(new ArrayList<>())
                .build();
        postRepository.save(post);
        return toPostDTO(post);
    }

    public PostDTO getPost(String postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("게시물을 찾을 수 없습니다."));
        return toPostDTO(post);
    }

    @Transactional
    public PostDTO updatePost(String postId, PostUpdateRequest req) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("게시물을 찾을 수 없습니다."));
        post.setUsername(req.username());
        post.setContent(req.content());
        post.setUpdatedAt(OffsetDateTime.now());
        postRepository.save(post);
        return toPostDTO(post);
    }

    @Transactional
    public void deletePost(String postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("게시물을 찾을 수 없습니다."));
        postRepository.delete(post);
    }

    private PostDTO toPostDTO(Post post) {
        List<CommentDTO> comments = commentRepository.findByPostId(post.getId())
                .stream().map(this::toCommentDTO).collect(Collectors.toList());
        return new PostDTO(
                post.getId(),
                post.getUsername(),
                post.getContent(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                comments,
                post.getLikesCount()
        );
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
