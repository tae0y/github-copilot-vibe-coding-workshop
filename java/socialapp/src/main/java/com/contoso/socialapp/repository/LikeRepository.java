package com.contoso.socialapp.repository;

import com.contoso.socialapp.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostIdAndUsername(String postId, String username);
    int countByPostId(String postId);
    void deleteByPostIdAndUsername(String postId, String username);
}
