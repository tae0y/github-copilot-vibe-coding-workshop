package com.contoso.socialapp.service;

import com.contoso.socialapp.dto.LikeRequest;
import com.contoso.socialapp.entity.Like;
import com.contoso.socialapp.entity.Post;
import com.contoso.socialapp.repository.LikeRepository;
import com.contoso.socialapp.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    @Transactional
    public void likePost(String postId, LikeRequest req) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("게시물을 찾을 수 없습니다."));
        if (likeRepository.findByPostIdAndUsername(postId, req.username()).isPresent()) {
            throw new IllegalArgumentException("이미 좋아요를 누른 사용자입니다.");
        }
        Like like = Like.builder().postId(postId).username(req.username()).build();
        likeRepository.save(like);
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
    }

    @Transactional
    public void unlikePost(String postId, LikeRequest req) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("게시물을 찾을 수 없습니다."));
        Like like = likeRepository.findByPostIdAndUsername(postId, req.username())
                .orElseThrow(() -> new NoSuchElementException("좋아요를 찾을 수 없습니다."));
        likeRepository.delete(like);
        post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        postRepository.save(post);
    }
}
